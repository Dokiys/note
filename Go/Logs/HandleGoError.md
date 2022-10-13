# Go的错误处理

Go语言将错误看作正常流程的一部分，将错误直接作为函数的返回值。如此一来，Go语言为我们提供了对处理错误绝对的权利。

## 错误类型

通常在java或其他语言中，我们会在代码中根据错误的类型来处理不同的逻辑。而在Go中，由于`interface`的特性，凡实现了`Error`方法的都可以被看作是一种错误类型。所以我们可以通过`类型断言（type assertion）`或者`类型开关（type switch）`来实现类似的功能：

```go
type MyErr struct {
	msg string
}

func New(msg string) MyErr {
	return MyErr{msg: msg}
}

func (self MyErr) Error() string {
	return self.msg
}
```

```go
unc TestMyErrAssert(t *testing.T) {
	err := New("test")
	var e error
	e = err
	if _, ok := e.(MyErr); ok {
		t.Log("myerr")
		t.Log(err.Error())
	} else {
		t.Log("other err")
		t.Log(err.Error())
	}
}
```

```go
func TestMyErrSwitch(t *testing.T) {
	err := New("test")
	var e error
	e = err

	switch e.(type) {
	case MyErr:
		t.Log("myerr")
	default:
		t.Log("other err")
	}
}
```

值得一提的是：**在处理错误的逻辑中，我们不应该根据错误的信息去判断代码的逻辑**

通过错误类型来处理最大的问题就在于，`error`类型必须是公开的。并且，如果代码一旦根据某个包中的错误类型，便在调用者和包之间产生了耦合。

## 标记错误

在Go语言的标准库中，也会经常使用`标记错误`的方式来进行错误的判断，比如`io.Copy`中，通过`io.EOF`来判断是否到数据结尾：

```go
var EOF = errors.New("EOF")
```

```go
if er != nil {
  if er != EOF {
    err = er
  }
  break
}
```

使用标记错误来处理错误的方式跟错误类型拥有相同的缺点，即耦合。而且标记错误只能表示一个特定的错误，延展性比通过错误类型来处理更差。
使用标记错误来处理时，还存在一个问题。那就是几乎所有项目都会引用标准库，而标准库不会引用我们自己的库，所以在标准库中的标记错误很少出现循环引用的问题。如果在我们自己的项目中使用某个包的标记错误，则必须引用整个包，而这也极易产生循环引用的问题。

## 封装错误

还有一种错误处理方法是，作为调用者不去关心调用失败的信息，而是只关心调用的结果。同时为了避免调用失败的信息丢失，可以自定义错误信息并将调用失败的信息封装在其中，这种方法被称为`封装错误`：

```go
type MyErr struct {
	msg string
}

func (self MyErr) Error() string { return self.msg }
func doSomething() error { 
  return MyErr{msg: "No such file directory"} 
}
```

```go
func RaiseErr() error {
	err := doSomething()
	if err != nil {
		//return fmt.Errorf("call doSomething() Err: %s", err.Error())
		return errors.New(fmt.Sprintf("call doSomething() Err: %s", err.Error()))
	}
	return nil
}
```

但这样存在一个问题，那就是这将抹去`err`的错误类型等信息，向上抛出的是一个`errorString`类型的数据(`error`包中可以查看到)。

值得一提的是，`RaiseErr`可能会被写成：

```go
func RaiseErr() error {
  return doSomething()
}
```

但如果在调用`RaiseErr`的上下文中有多个可能返回的错误，并且都有可能返回经典的`"no such file or directory"`错误，则没有办法准确判断该错误是否由`doSomething`引起

回到封装错误的问题上，建议的方式是采用`注解错误`的办法，将调用得到的错误封装在某个错误中，并添加额外的错误信息。推荐使用 [github.com/pkg/errors](https://godoc.org/github.com/pkg/errors)。该包提供了一个结构来实现上述方式：

```go
type withMessage struct {
	cause error
	msg   string
}
```

该结构实现了`Error`方法,并且该结构提供了两个公开的方法来封装和解封错误：

```go
func Wrap(err error, message string) error
func Cause(err error) error
```

```go
func WrapErr() error {
  return errors.Wrap(doSomething, "call doSomething() Err:")
}
```

**注：** `errors.Wrap`在传入`err`为`nil`时会直接返回`nil`，所以这里不用拆开判断。

此外对特定错误的处理可以通过`Cause`方法获取原来的错误并判断：

```go
func DealTheErr() {
	err := WrapErr()
	if err == nil {
		return
	}
	myerr, ok := errors.Cause(err).(MyErr)
	if ok {
		fmt.Printf("MyErr: %v", myerr)
	} else {
		fmt.Printf("Error: %v", myerr)
	}
}
```

但是我们会发现，这又回到了最初的起点，`MyErr`依旧存在依赖的问题。更优雅的方式应该是**对错误的行为断言，而不是类型**。看看下面的例子：

首先添加一个`Temporary`接口，以及一个`IsTemporary`的公共方法，用来判断该错误是否为临时错误:

```go
type Temprorary interface {
	IsTemporary() bool
}

func IsTemporary(err error) bool {
	te, ok := err.(Temprorary)
	return ok && te.IsTemporary()
}
```

然后再让`MyErr`实现`Temporary`接口：

```go
func (self MyErr) IsTemporary() bool { return true }
```

如此一来，我们便可以通过`IsTemporary()`来判断返回的错误是否满足某些行为并作出相应的处理：

```go
func DealTheBehavior() {
	err := WrapErr()
	if err == nil {
		return
	}
	if IsTemporary(errors.Cause(err)) {		// 标记行
		DealTheBehavior()
	} else {
		fmt.Printf("Error: %v", err)
	}
}
```

有可能你会发现在标记行我们直接处理了最底层的函数`doSomething()`抛出的错误。而在编程实践中，我们可能并不知道应该采用`WrapErr()`所返回的错误去判断`IsTemporary()`还是使用`doSomething()`返回的错误去判断。
我的建议是，如果这个错误需要被处理，应该尽可能早的去处理。即在`WrapErr()`中就应该先执行`Istemporary()`来判断，并处理相应逻辑。

如果因为某些原因，只能向上返回错误处理，那就可以使用Go1.13引入的错误链来处理了。

## 错误链

Go1.13中对标准库中的`errors`包添加了以下三个方法：

```go
func Unwrap(err error) error 									// 如果传入的err实现了Unwrap方法，则调用
func Is(err, target error) bool 							// 判断err链中是否是包含某具体的错误（标记错误）
func As(err error, target interface{}) bool 	// 判断err链中是否包含某类型（错误类型）
```

`Unwrap()`跟`github.com/pkg/errors`中的`Cause()`功能一样。让我们先来看看其余两个方法的使用：

```go
func ErrChain() {
	err := WrapErr()

	var IsMyErr = MyErr{msg: "myerr"}
	var temp Temprorary
  fmt.Printf("Is: %v\n",errors.Is(err, IsMyErr))		// Is: true
  fmt.Printf("As: %v\n",errors.As(err, &temp))			// As: true
  fmt.Printf("As: %v\n",errors.As(err, &MyErr{}))		// As: true
}
```

现在对封装错误中的代码进行简单的改造：

```go
type MyTempErr MyErr

func (self MyTempErr) Error() string { return self.msg }
func (self MyTempErr) IsTemporary()  {}

type IsTemporaryErr interface {
	IsTemporary()
}
```

判断行为的代码使用`As()`方法， `github.com/pkg/errors`中也提供了相应的实现：

```go
func IsTemporary2(err error) bool {
	var t IsTemporaryErr
	return errors.As(err, &t)
}
```

修改`doSomething()`中抛出的错误：

```go
func doSomething2() error { return MyTempErr{msg: "myerr"} }
```

```go
func WrapErr2() error {
	err := doSomething2()
	if err != nil {
		return errors.Wrapf(err, "call doSomething() Err:\n\t")
	}
	return nil
}
```

```go
func DealTheChain() {
	err := WrapErr2()
	if err == nil {
		return
	}
	if IsTemporary2(err) {
		DealTheChain()
	} else {
		fmt.Printf("Error: %v\n\t", err)
	}
}
```



## 错误的处理

处理错误意味着检查错误值，然后作出决定。如果不做决定，我们应当直接忽略掉返回的错误：

```go
_ = doSomething()
```

此外，我们只需要**处理一次错误**。如果对错误打印了日志又返回给了调用者，会产生重复的信息，就像下面的例子：

```go
func doSomething() error {
  myerr := MyTempErr{msg: "myerr"}
  log.Printf(myerr)
  return myerr
}
```

