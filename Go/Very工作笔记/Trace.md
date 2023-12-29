# Trace

（本文使用到的trace库为[go.opentelemetry.io/otel](https://github.com/open-telemetry/opentelemetry-go)）

trace分析分为两个部分：首先是记录，然后才是统计分析。其中记录的核心在于应该在哪些地方打点记录。
最常见的例子是从一个HTTP请求开始，HTTP服务在应用内调用GRPC服务，然后GRPC服务操作数据库。在这个例子中通常我们需要在`HttpServer`、`GrpcClient`、`GrpcServer`以及数据库操作时，进行打点。

对于`HttpServer`添加打点，我们可以在中间件中轻松的完成。但是值得注意的是，虽然通常都是请求的入口，但是如果内部服务之间也有HTTP调用的话，应当先查尝试从HTTP请求中获取以及存在的trace信息（propagation.TraceContext）并且，由于Go语言context.Context向下传递的特性，需要注意ctx的保存。下面是一个中间件的例子：
```go
func TraceMiddleware(c *gin.Context) {
	savedCtx := c.Request.Context()
	defer func() {
		c.Request = c.Request.WithContext(savedCtx)
	}()

  // 尝试从Header中获取到trace信息
	var propagator = otel.GetTextMapPropagator()
	ctx := propagator.Extract(c.Request.Context(), propagation.HeaderCarrier(c.Request.Header))

	var tracer = otel.Tracer("TracerName")
	ctx, span := tracer.Start(ctx, c.FullPath())
	defer span.End()
	c.Request = c.Request.WithContext(ctx)

	c.Next()
}
```



对于`GrpcClient`和`GrpcServer`可以通过分别实现`grpc.UnaryClientInterceptor`、`grpc.StreamClientInterceptor`以及`grpc.UnaryServerInterceptor`、`grpc.StreamServerInterceptor`然后使用`grpc.WithChainUnaryInterceptor()`、`grpc.WithChainStreamInterceptor()`和`grpc.UnaryInterceptor()`、`grpc.StreamInterceptor()`在创建时进行设置。
但是已经有一些成熟的框架可以帮助我们像创建HTTP中间件一样，去创建`GrpcClient`或者`GrpcServer`的中间件。甚至已经提供了trace中间件：

```go
// github.com/go-kratos/kratos/v2@v2.7.0/middleware/tracing/tracing.go
// Server returns a new server middleware for OpenTelemetry.
func Server(opts ...Option) middleware.Middleware {
	tracer := NewTracer(trace.SpanKindServer, opts...)
	return func(handler middleware.Handler) middleware.Handler {
		return func(ctx context.Context, req interface{}) (reply interface{}, err error) {
			if tr, ok := transport.FromServerContext(ctx); ok {
				var span trace.Span
				ctx, span = tracer.Start(ctx, tr.Operation(), tr.RequestHeader())
				setServerSpan(ctx, span, req)
				defer func() { tracer.End(ctx, span, reply, err) }()
			}
			return handler(ctx, req)
		}
	}
}
// Client 同上
```

其中`tracer.Start()`是`kratos`提供的，并且已经实现了尝试先从请求中获取trace信息。
```go
// github.com/go-kratos/kratos/v2@v2.7.0/middleware/tracing/tracer.go
// Start start tracing span
func (t *Tracer) Start(ctx context.Context, operation string, carrier propagation.TextMapCarrier) (context.Context, trace.Span) {
	if t.kind == trace.SpanKindServer {
		ctx = t.opt.propagator.Extract(ctx, carrier)
	}
	ctx, span := t.tracer.Start(ctx,
		operation,
		trace.WithSpanKind(t.kind),
	)
	if t.kind == trace.SpanKindClient {
		t.opt.propagator.Inject(ctx, carrier)
	}
	return ctx, span
}
```



对于数据库操作，大部分`orm`库都会提供事件监听，我们可以在让`TracerEventListener`监听所有的事件，然后进行打点。由于`tracer`的创建和此前提到的HTTP、GRPC中tracer的创建方式大同小异，并且`orm`的事件监听绑定又因不同的`orm`库有很大差别，所以这里给一些简单的示例：

```go
func newRepoSource(db *sql.DB) *RepoSource {
	ormDB := gosql.New("mysql", db)
	ormDB.Eventer(sqlotel.NewTracing().Tracer)

	return &Source{	OrmDB: ormDB }
}
```



在OpenTelemetry中，我们需要提前提供一个`TracerProvider`，创建时需要提供两个参数，其中`resource.Resource`包含了该`TracerProvider`特有的基础信息，`sdktrace.SpanExporter`用于实际处理`trace`的上报过程。
可以通过设置`propagation.TextMapPropagator`来进行扩展，以支持一些多进程场景的打点。例如此前我们提到的先尝试从HTTP中获取到trace信息。顺便一提在OpenTelemetry中，可以使用`propagation.Baggage`来在不同的`span` 之间共享信息。下面是一个将trace信息输出到本地的例子：

```go
package otel

import (
	"context"
	"fmt"
	"testing"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

func fibonacci(ctx context.Context, n int) int {
	// 设置全局 Tracer Provider
	provider := otel.GetTracerProvider()
	// 创建一个全局 tracer
	tracer := provider.Tracer("fibonacci-tracer")
	// 创建一个 span
	ctx, span := tracer.Start(ctx, "Fibonacci")
	defer span.End()
	// 设置 span 的属性
	span.SetAttributes(
		attribute.Int("input", n),
	)

	if n <= 1 {
		return n
	}

	return fibonacci(ctx, n-1) + fibonacci(ctx, n-2)
}

func TestOtelTrace(t *testing.T) {
	var ctx = context.Background()

	// init
	exporter, err := newExporter()
	if err != nil {
		panic("failed to initialize exporter: " + err.Error())
	}
	tp := newTraceProvider(exporter)
	defer func() { _ = tp.Shutdown(ctx) }()
	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		// https://opentelemetry.io/docs/instrumentation/go/manual/#propagators-and-context
		propagation.TraceContext{},
		// https://opentelemetry.io/docs/concepts/signals/baggage/
		propagation.Baggage{},
	))

	var n = 3
	fmt.Printf("Fibonacci(%d) = %d\n", n, fibonacci(ctx, n))
}

// https://opentelemetry.io/docs/instrumentation/go/exporters/
func newExporter() (sdktrace.SpanExporter, error) {
	return stdouttrace.New()
}

// https://opentelemetry.io/docs/instrumentation/go/manual/
func newTraceProvider(exp sdktrace.SpanExporter) *sdktrace.TracerProvider {
	// Ensure default SDK resources and the required service name are set.
	r, err := resource.Merge(
		resource.Default(),
		resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName("ExampleService"),
		),
	)
	if err != nil {
		panic(err)
	}

	return sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exp),
		sdktrace.WithResource(r),
	)
}
```

