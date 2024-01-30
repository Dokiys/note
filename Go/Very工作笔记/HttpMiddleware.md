# HTTP中间件

在HTTP请求中分为服务端（Server）和客户端（Client），任意一方都可以设置自己的中间件，并且模型也很类似。

## Client

在Go官方提供的`net/http`包中，`http.Client`的设计非常便于中间件的扩展，其结构如下：
```go
// The Client's Transport typically has internal state (cached TCP
// connections), so Clients should be reused instead of created as
// needed. Clients are safe for concurrent use by multiple goroutines.
//
// A Client is higher-level than a RoundTripper (such as Transport)
// and additionally handles HTTP details such as cookies and
// redirects.
type Client struct {
	// Transport specifies the mechanism by which individual
	// HTTP requests are made.
	// If nil, DefaultTransport is used.
	Transport RoundTripper

	CheckRedirect func(req *Request, via []*Request) error

	Jar CookieJar

	Timeout time.Duration
}
```

其中`RoundTripper`是真正处理HTTP请求的接口。并Go提供了默认的`DefaultTransport`实现了该接口来处理HTTP请求。因此，我们可以非常方便的利用`DefaultTransport`进行扩展。最简便的方式就是：
```go
type LogTransport struct {
	Transport http.RoundTripper		
}

func NewLogTransport(rt http.RoundTripper) http.RoundTripper{
  return &LogTrasport{rt}
}
func (m *LogTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	// log some thing
	resp, err := m.Transport
	// log some thing
  return resp, err
}
```

最后我们使用`LogTransport`来创建`http.Client`并使用。
但是以上方式存在两个问题：一是每有一个新的中间件，就需要定义一个新的结构体；二是`http.Client`的`Transport`（也就是这里的`LogTrasnport`）并非以配置的方式来生成的，而是由New方法手动创建的。这使得该中间件看起来更像是一个新的`Transport`而非`Middleware`。

解决第一个问题，我们们可以参考`http.HandlerFunc`的设计方式，这是在`http.server`中提供的一种定义方法类型以允许我们将一个匿名方法实现`Handler`接口的方式。

```go
// RoundTripFunc 类似于http.HandlerFunc。由于 http.RoundTripper 是一个interface，
// 因此需要一个struct 来实现RoundTrip()方法。RoundTripFunc类型实现了该方法，以便我们将
// 一个匿名方法转换成 Middleware。
type RoundTripFunc func(*http.Request) (*http.Response, error)

func (rt RoundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return rt(req)
}
```

我们可以直接通过以下方式得到一个`RoundTripper`：

```go
RoundTripFunc(func(req *http.Request) (*http.Response, error) {
	// log some thing
	resp, err := m.Transport
	// log some thing
  return resp, err
})
```



并且我们可以用同样的方式来处理第二个问题。因为`Middleware`的创建始终接受一个`http.RoundTripper`，并且返回一个`http.RoundTripper`。因此可以将`Middleware`直接定义为如下类型：
```go
// ClientMiddleware is HTTP Client transport middleware.
type ClientMiddleware func(http.RoundTripper) http.RoundTripper
```

此时中间件的创建就变成了（当然也可以通过类型转换以匿名的形式创建）：
```go
func NewClientLogMiddleware() ClientMiddleware {
	return func(tripper http.RoundTripper) http.RoundTripper {
		return RoundTripFunc(func(req *http.Request) (*http.Response, error) {
			fmt.Println(time.Now().UnixMilli(), ": client start....1")
			time.Sleep(1 * time.Millisecond)
			resp, err := tripper.RoundTrip(req)
			time.Sleep(1 * time.Millisecond)
			fmt.Println(time.Now().UnixMilli(), ": client end....4")

			return resp, err
		})
	}
}
```

最后我们需要一个方法将提供的多个`ClientMiddleware`串起来：

```go
// Chain returns a ClientMiddleware that specifies the chained handler for endpoint.
func Chain(rt http.RoundTripper, middlewares ...ClientMiddleware) http.RoundTripper {
	if rt == nil {
		rt = http.DefaultTransport
	}

	for i := len(middlewares) - 1; i >= 0; i-- {
		rt = middlewares[i](rt)
	}

	return rt
}
```



为了演示Client的Middleware，这里我们需要先启动一个简单的HTTP服务：

```go
func TestHttpServerMiddleware(t *testing.T) {
	http.Handle("/hello", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(time.Now().UnixMilli(), ": server start....2")
		time.Sleep(1 * time.Millisecond)
		w.Write([]byte("Hello Work!"))
		time.Sleep(1 * time.Millisecond)
		fmt.Println(time.Now().UnixMilli(), ": server end....3")
	}))
  
	fmt.Println("Server listening on port 8080")
	err := http.ListenAndServe(":8080", http.DefaultServeMux)
	if err != nil {
		fmt.Println(err)
	}
}
```

以及最后的Client
```go
func TestHttpClientMiddleware(t *testing.T) {
	defaultTransport := http.DefaultTransport
	middlewares := []ClientMiddleware{
		NewClientLogMiddleware(),
	}

	client := &http.Client{
		Transport: Chain(defaultTransport, middlewares...),
	}

	_, err := client.Get("http://localhost:8080/hello")
	if err != nil {
		fmt.Println(err)
	}
}
```



## Server

Server的中间件和Client的几乎一样，只不过Client中的`http.RoundTripper`接口在Server中叫`http.Handler`。我们定义的`RoundTripFunc`官方以及提供了，并且叫`http.HandlerFunc`。
但是在Server端的中间件需要可以作用于所有的路径，也需要可以仅作用于某一个单独特别指定的路径。因此我们需要定义一些额外的结构来帮我们保存这些信息：

```go

type Router struct {
	middlewareChain []ServerMiddleware
	mux             map[string]http.Handler
}

func NewRouter() *Router {
	return &Router{
		mux: make(map[string]http.Handler),
	}
}
func (r *Router) Use(m ServerMiddleware) {
	r.middlewareChain = append(r.middlewareChain, m)
}
func (r *Router) Add(route string, h http.Handler, middlewares ...ServerMiddleware) {
	var mergedHandler = h

	for i := len(r.middlewareChain) - 1; i >= 0; i-- {
		mergedHandler = r.middlewareChain[i](mergedHandler)
	}
	for i := len(middlewares) - 1; i >= 0; i-- {
		mergedHandler = middlewares[i](mergedHandler)
	}

	r.mux[route] = mergedHandler
}
```

最终服务端代码如下：

```go

func NewServerLogMiddleware() ServerMiddleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			fmt.Println(time.Now().UnixMilli(), ": server start....2")
			time.Sleep(1 * time.Millisecond)
			next.ServeHTTP(w, r)
			time.Sleep(1 * time.Millisecond)
			fmt.Println(time.Now().UnixMilli(), ": server end....3")
		})
	}
}
func TestHttpServerMiddleware(t *testing.T) {
	r := NewRouter()
	r.Use(NewServerLogMiddleware())
	r.Add("/hello", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello Work!"))
		// }), traceServerMiddleWare())
	}))

	s := http.NewServeMux()
	for pattern, handler := range r.mux {
		s.Handle(pattern, handler)
	}
	fmt.Println("Server listening on port 8080")
	err := http.ListenAndServe(":8080", s)
	if err != nil {
		fmt.Println(err)
	}
}
```

以下是一些常见的服务端中间件的简单实现：

```go
func NewServerRecoverMiddleware() ServerMiddleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rec := recover(); rec != nil {
					fmt.Println(rec)
					var stackInfo = make([]byte, 1<<16) // 64k
					idx := runtime.Stack(stackInfo, false)
					fmt.Println(string(stackInfo[0:idx]))
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}
```

```go
func NewServerCorsMiddleware() ServerMiddleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Set CORS headers for all responses
			w.Header().Set("Access-Control-Allow-Origin", "*")

			// Handle pre-flight OPTIONS request
			if r.Method == http.MethodOptions {
				// Include other necessary headers for pre-flight response
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Length, Content-Type")
				w.Header().Set("Access-Control-Max-Age", "86400") // Cache pre-flight response for 24 hours

				// Respond with HTTP 204 No Content status
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
```

```go
func NewServerLimiterMiddleware() ServerMiddleware {
	var limit = rate.NewLimiter(rate.Every(time.Second), 1)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if limit.Allow() {
				next.ServeHTTP(w, r)
			}
			w.WriteHeader(http.StatusNotAcceptable)
		})
	}
}
```

