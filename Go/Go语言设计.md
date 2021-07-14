# Go语言设计

## defer

Go 语言中， `defer` 会在当前函数返回前执行传入的函数。经常被用于关闭文件、数据库连接等操作。

实际上，Go在编译时会对`defer`做一些小小的改动，比如如下代码：

```go
func A(){
    defer B()
    // do something
}
```

编译后：

```go
func A(){
    r := deferproc(8,B)
    // ...
    
    // do something
    
    runtime.deferreturn()
    return
    // ...
}
```

`deferproc()`会先在当前的`goroutine`中注册我们传入的方法，然后`runtime.deferreturn()`会将注册的函数执行。

每个`goroutine`在运行时都会有一个对应的结构体`runtime.g`。其中有一个字段指向`_defer`链表头，其指向的是一个个`_defer`结构体。新注册的`defer`，会添加在该链表的头部。执行时也会从头开始执行注册的`_defer`：

![defer链表](../image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_wQFGPO3XOj.png)

所以，我们后注册的`defer`会先被调用。

让我们简单看一下`_defer`的数据结构：

```go
type _defer struct {
	siz     int32 	// 参数和返回值共占多少字节
	started bool	// 是否已执行
	heap    bool	// 是否为堆分配

	openDefer bool		
	sp        uintptr  	// 调用者栈指针
	pc        uintptr  	// 返回地址
	fn        *funcval 	// 注册函数
	_panic    *_panic
	link      *_defer 	// 下一个_defer

	fd   unsafe.Pointer 
	varp uintptr
	framepc uintptr
}
```

在Go1.12版本中，注册`defer`时，会在堆上，为`_defer`分配内存并存储注册的`defer`。
实际上，Go语言会预分配不同大小的`deferpool`，只有当没有空闲的或者大小合适的`_defer`时，才会从堆上直接分配。这样可以避免频繁的堆分配与回收。

在Go1.13中，在编译阶段会增加一些局部变量：

![1.13](../image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_q0FJ2l3pRV.png)

将`defer` 信息保存到当前函数栈帧的局部变量中，然后通过`runtime.deferprocStack()`将这个`_defer()`注册到`g._defer`中。以减少`defer`在堆上的分配。对于如下的代码：

```go
for i:=0; i<n; i++ {
    defer A(i)
}
```


因为变量`i`需要在运行时才能确定，所以无法在编译阶段注册`defer`

在Go1.14中采用了一种叫做`open coded defer`的方式，直接在编译时将`defer`调用函数的参数使用局部变量保存，然后根据`df`变量在函数返回之前确定是否需要被调用。

![1.14](Z:/note/image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_OirJhw4DUZ.png)

这种方式将`defer`直接展开再调用函数内，从而不需要创建`_defer`结构体，而且不需要注册在`g._defer`链表中。
但和1.13版本一样，对于一些需要在运行时确定参数的`defer`注册，还是需要采用1.12中的方式调用`defer`。
此外，如果在运行函数是执行了`panic`，之后的代码将不会被执行。1.14版本中采用的是额外栈扫描的方式来发现并执行`defer`。这无疑将消耗额外的性能，但通常`defer`被使用的次数远高于`panic`，所以总体来看有很高的性能提升。



## 异常处理

Go语言中，异常分为两类`error`和`panic`。

通常`error`用于抛出程序中函数调用失败，以传递错误信息。`panic`则被用来处理程序运行时较为严重的错误，如果不处理`panic`将会停止程序的运行。

Go语言认为我们应该对每个可能的异常进行手动处理。



**error**

`error`是Go中提供的一个接口：

```go
type error interface {
    Error() string
}
```

在标准包`errors`中提供了多种类型的实现，最常用的是未公开的`errorString`：

```go
// errorString is a trivial implementation of error.
type errorString struct {
    s string
}

func (e *errorString) Error() string {
    return e.s
}
```

```go
// New returns an error that formats as the given text.
func New(text string) error {
    return &errorString{text}
}
```

通过`errors.New()`可以直接返回一个`errorString`，标准包中的`fmt`将会直接调用`error`的`Error()`方法来格式化输出。以下是处理求两数的商异常的例子：

```go
func Div(dividend float64, divisor float64) (float64, error) {
	if divisor == 0 {
		return 0, errors.New("math: division by zero")
	}
	return dividend / divisor, nil
}
```

```go
func main() {
	quotient, err := Div(10, 0)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Printf("The result is：%v \n", quotient)
}
```



**panic**

`panic`的调用用于比较严重的程序错误，如果不进行处理将直接停止程序的运行。

Go提供了`recover`来恢复`panic`，然后在执行完当前`goroutine`的`_defer`链中的函数后结束当前调用函数：

```go
func A()  {
	defer A1()
    defer A2()
	panic("panicA1")
	fmt.Println("A")
}
func A1(){
	r := recover()
	fmt.Printf("recover panic: %v\n",r)
}
```

运行以上代码后输出：

```go
A2
recover panic: panicA1
```

值得注意的是，`recover()`只能在`defer`中调用。

我们发现，程序先输出了"A2"然后才输出恢复的panic信息。实际上，在调用`panic`时，Go语言运行时会调用`runtime.gopanic()`在当前`goroutine`的`_panic`链中添加一个`panic`。
然后结束当前 `goroutine`剩余代码的执行，直接执行当前`goroutine`中的`_defer`链。
在`_defer`链中调用`recover()`函数时，会在`_panic`链中将第一个未处理的`panic`标记为已恢复，然后在该`defer`中的设置已处理的`panic`指针。
执行`recover`的函数正常返回以后，继续执行剩余的`_defer`链。
将已经设置了`panic`的`defer`删除，并标记该`panic`为丢弃。
然后用相同的方式执行`_defer`链中的其余函数。
最后当`_defer`执行完时，遍历`_panic`链，输出剩余未被丢弃的`panic`信息。

让我们通过一个例子来看一下`panic`和`recover`的运行逻辑。在此之前让我们先了解以下`panic`的数据结构：

```go
type _panic struct {
	argp      unsafe.Pointer // 指向 defer 调用时参数的指针
	arg       interface{}    // 调用 panic 时传入的参数
	link      *_panic        // link to earlier panic
	pc        uintptr        // 指向应该返回执行defer的栈指针
	sp        unsafe.Pointer // 指向应该返回执行函数的栈指针
	recovered bool           // 是否被回复
	aborted   bool           // 是否被抛弃
	goexit    bool
}
```

```go
func A(){
	defer A1()
	defer A2()
	panic("panicA")			// 1
	fmt.Println("A")		// 2
}
func A1(){
	fmt.Println("A1")
}
func A2(){
	defer B1()
	panic("panicA2")		// 3
}
func B1(){
	r := recover()
	fmt.Println(r)
}
```

当执行到`1`时，会调用`gopanic()`在当前`goroutine`的`_defer`链已经添加了`B2()`和`B1()`，同时将`panicA`也添加到了当前`goroutine`的`_panic`链中：

![panicA](../image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_KEpz0G2gad.png)

然后由于调用了`panic`，结束之后代码的执行，即`2`处的代码不会被执行。然后转而调用`goroutine`的`_defer`链，即调用`A2()`。在`A2()`中又在当前`goroutine`的`_defer`链中添加了`B1()`，然后再次调用`gopanic()`，将`panicA2`添加到了当前`goroutine`的`_panic`链中：

![panicA2](../image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_0TDtunoJEz.png)

此时开始执行`B1()`，`recover()`将`_panic`链中的第一个`panic`标记为恢复，然后打印输出：

![recovered](../image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_QpkklaBluz.png)

当`B1()`执行完，返回到上一次的`panic`触发位置，即`3`。此时会去检查`B2()`在`_panic`中创建的`panicB2`，发现已经被恢复，将其从`_panic`中移除：

![aborted](../image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_A4uxt82ZKK.png)

此时`A2()`也执行完，返回到`A()`中的`1`处，继续执行`_defer`链中的`A1()`：

![remove](../image/Go/Go%E8%AF%AD%E8%A8%80%E8%AE%BE%E8%AE%A1/chrome_f0rjtvOkcU.png)

最后遍历当前`goroutine`中的`_panic`，输出`panic`信息。

