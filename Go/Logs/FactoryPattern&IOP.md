# 工厂方法及面向接口编程实践

假设现在我们需要实现如下接口：

```go
type Client interface {
	Request()
}
```

最简单的方式就是：

```go
type Impl struct{}

func (c *Impl) Request() {
	fmt.Println("Impl Request")
}
```

但是编程实践中，情况往往没有那么简单，可能`Impl`的构建会是一个比较麻烦的过程，我们假设需要多个参数来构建：

```go
func NewImpl(a int, b int32, c int64, d string) *Impl {
	fmt.Printf("%d,%d,%d,%s", conf.a, conf.b, conf.c, conf.d)
	return &Impl{}
}
```

过多的入参会导致代码阅读和维护困难，最直接的优化方式就是将`NewImpl`的入参提取出来，然后通过一个统一的方法来获取：

```go
type Config struct {
	a int
	b int32
	c int64
	d string
}
func NewImpl(a int, b int32, c int64, d string) *Impl {...}

func doSomeGetConf(id int) Config {...}
```

现在我们可以愉快的去调用了：

```go
func TestFactory(t *testing.T) {
	conf1 := doSomeGetConf(1)
	//var conf = Config{a: 1,b: 1,c: 1,d: "1"}
	c1 := NewImpl(conf1)
	c1.Request()

	conf2 := doSomeGetConf(2)
	c2 := NewImpl(conf2)
	c2.Request()
}
```

可以发现，我们创建了两个`Impl`实例，调用了两次`doSomeGetConf()`方法，并且执行了一样的功能，我们完全可以只写一遍。那么可能想到的最直白的方式就是直接将其放在`Impl`的构造函数中：

```go
func NewClient(id int) *Impl {
	conf := doSomeGetConf(id)
	fmt.Printf("%d,%d,%d,%s", conf.a, conf.b, conf.c, conf.d)
	return &Impl{}
}
```

这就出现了个问题，在编程实践中，绝大部分类似`doSomeGetConf()`功能的方法是有外部依赖的，或者跟业务有关联的。出于单一指责的原则，我们应该将这部分代码从`Impl`的构造函数中解耦出来。或者是说`Impl`的方法实现，及其构造函数应该可以是一个独立的包，不需要依赖其他的代码。
据此，我们可以用最简单直白的方式来实现：

```go
func BuildClientImpl(id int) *Impl {
	conf := doSomeGetConf(id)
	return NewImpl(conf)
}
```

这条代码看似解决了我们的问题，其实有点问题。首先我们需要明确，这个方法通过接受一些参数，返回一个`*Impl`，其实就是`Impl`的构造函数，只不过是对原来`impl.NewImpl()`的分装。
假设我们现在有个结构体`A`, 其方法中的部分功能需要由`Client`接口来实现。那么当我们创建`A`的实例的时候，就需要通过`BuildClientImpl()`方法来注入实现，大概就是这样：

```go
type A struct {
	Client
}

func TestBuildClientImpl(t *testing.T) {
  id := 1
	a := &A{BuildClientImpl(id)}

	a.Request()
}
```

这时候`a`的`Client`实现就已经确定了。但是如果我们在创建`a`时并不清楚应该传入`id`的数值，而是需要根据实际执行时候的业务来判断（比如，请求某个接口。如果成功了，创建id为1的Client请求；失败了则使用id为2的Client请求）。这将是一个很棘手的问题。这里的代码看似只需要重新创建一个`A`并赋值给`a`即可，但是在编程实践中`A`的构建可能往往没有那么简单，比如`A`可能是一个`Service`并对数据库连接有依赖。
回到我们现在遇到的问题：我们需要在创建`A` 的时候，先不去实际创建`Client`的实现，而是在需要实际调用的时候，根据业务再去创建`Client`的实现。
还是最简单的实现方式：

```go
func TestBuildClientImpl(t *testing.T) {
	a := &A{}

  id := 1
	a.Client = BuildClientImpl(id)		// 注入？
	a.Request()
}
```

不知道你有没有发现一个问题，我们似乎回到了最初的起点。在`A`中我们需要一个`Client`的接口，目的就是为了将具体实现抛出，通过注入的方式来解耦，而现在我们多少有点南辕北辙了。

回到刚刚的问题，如果我们能现将`BuildClientImpl()`方法，保存在`A`中，当需要获取`Client`实现的时候就可以随时创建了。并且此时`A`其实就不需要再将`Client`作为成员变量了：

```go
type A struct {
	BuildMethod func(id int) *Impl
}

func TestBuildClientImpl(t *testing.T) {
	//a := &A{BuildClientImpl(1)}
	a := &A{BuildMethod: BuildClientImpl}
	a.BuildMethod(1).Request()
}
```

到这一步，其实`BuildMethod`就是`Impl`的工厂方法。不过我们还可以再做的优雅一点：

```go
type ClientFactory func(id int) *Impl

func NewClientFactory() ClientFactory {
	return func(id int) *Impl {
		conf := doSomeGetConf(id)
		return NewImpl(conf)
	}
}

type A struct {
	cf ClientFactory
}

func TestBuildClientImpl(t *testing.T) {
	a := &A{cf: NewClientFactory()}
	a.cf(1).Request()
}
```

关于工厂方法到这里就可以先写个句号了。

从IOP的角度我们还有一些问题，假设`Impl`中还有一个`Destroy()`方法，调用直接会产生`panic`。这个时候我们会发现在`A` 中创建出来的`Impl`可以直接调用到这个方法：

```go
func TestBuildClientImpl(t *testing.T) {
	a := &A{cf: NewClientFactory()}
	a.cf(1).Request()
	a.cf(1).Destroy()
}
```

这并不是我们想看到的，根据最少知识原则(Least Knowledge Principle，LKP)，`NewClientFactory`中我们只应该返回一个`Client`,：

```go
type ClientFactory func(id int) Client

func NewClientFactory() ClientFactory {
	return func(id int) Client {
		conf := doSomeGetConf(id)
		return NewImpl(conf)
	}
}
```

在Go中，并不需要我们明确指出结构体是对那个接口的实现，只需要实现所有接口方法即可。在一些比较通用的接口方法中，可能就会产生混淆。比如，仅由一个`Do()`方法接口，可能会被一些不相干的结构体实现。我们可以添加如下的冗余行来提示调用者`*Impl`是对`Client`的实现。并且在一些开发工具中，我们可以借此来快速生成需要但还没有实现的接口方法。

```go
var _ Client = (*Impl)(nil)
```



最后顺便提一下，在Go中其实更推荐`Option`的方式来构建一个结构体，比如`NewImpl`可以改成：

```go
type Option func(impl *Impl)

func SetA(a int) Option {
	return func(impl *Impl) {
		fmt.Printf("Set %d\n", a)
	}
}

func NewImpl2(opts ...Option) *Impl {
	impl := &Impl{}
	for _, opt := range opts {
		opt(impl)
	}
	return impl
}

func TestImpl2(t *testing.T) {
	impl2 := NewImpl2(SetA(1))
	impl2.Request()
}
```



