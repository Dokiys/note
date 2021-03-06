

# Go基础

## Hello Work！

新建`hello.go`文件，键入以下内容：

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello Work！")
}
```

在文件的根目录下执行：

```bash
> go build hello.go
```

`go`命令会根据操作系统在同一级目录生成一个可执行文件`hello.exe`。执行该文件：

```bash
> hello.exe
Hello Work！
```

---

Go语言中，所有的代码都必须组织在`package`中，`package`由**同一**目录下的多个源码⽂件组成，每个`package`作为被其他项目引用的基本单元。

引入`package`使用`import`关键字。如上，我们引入了标准库中的`fmt`包，并在`main`方法中调用了其方法来输出字符串。

`go build`命令可以指定文件根据操作系统生成对应的可执行文件，文件必须包含在名为`main`的包中，同时提供名为`main`的入口函数，如`hello.go`



## 类型

### 变量

Go是静态语言，变量类型必须在编译时就确定。声明变量和常用类型如下：

```go
var i int					// 声明一个int类型变量
var f = 1.0					// 声明一个带初始值的变量，编译器会自动推断类型
var x, y int				// 一次声明多个变量
var (						// 一次声明多个定义类型，带初始值的变量
	i2 int
	f2 float32 = 2.0
)
var a, b = "hello", 123		// 一次声明多个带不同初始值的变量

func VartypeMethod(){
	str := "123" 			// 函数内部可以使用简写声明
	f := 2.0				// 将会修改全局变量f
	{
		str := "345"			// 不在同⼀层级代码块，将会定义新的同名变量
		println(str)

	}
	println(str,f)

	//flag := true 			// 未使用的局部变量会被编译器报错
}
```

基本类型：

|   类型    | 默认值 | 说明           |
| :-------: | :----: | :------------- |
|   bool    | false  |                |
|   byte    |   0    |                |
|   rune    |   0    |                |
| int，uint |   0    | 整型           |
|   float   |  0.0   | 浮点型         |
|  complex  |        | 复数           |
|  uintptr  |        | 存放指针的整数 |
|   array   |        | 数组，值类型   |
|  struct   |        | 值类型         |
|  string   |   ""   | UTF-字符串     |
|   slice   |  nil   | 引⽤类型       |
|    map    |  nil   | 引⽤类型       |
|  channel  |  nil   | 引⽤类型       |
| interface |  nil   | 接口           |
| function  |  nil   | 函数           |

### 常量

常量值必须是编译期可确定的数字、字符串、布尔值。

```go
const pi float64 = 3.14		// 定义常量
const (                 	// 定义多个常量
	//a = 9.8				// 跨文件同包名下的变量a重名，编译不通过
	g  = 9.8 // 类型推断
	e  = 2.71
	e1 // 值同上一个常量
	e2 // 值同上一个常量
)

func ConsttypeMethod(){
	println(e, e1, e2)

	const hello = "Hello Work!" // 未使用的常量不会报错
}
```

Go还提供了关键字`iota`来方便的创建枚举，`iota`第一次使用时为`0`，之后的值为与第一次使用所在行的差数：

```go
const (
	c1 = iota				// 0
	c2						// 1
	c3 = "C"				// C
	c4						// C
    
	c5 = iota				// 4
	c6						// 5
)
```

以下是Go标准库中的代码：

```go
const (
 _ = iota 						// iota = 0, `_`符号会将赋予它的值忽略
 KB int64 = 1 << (10 * iota) 	// iota = 1
 MB 							// 与 KB 表达式相同，但 iota = 2
 GB
 TB
)
```



### 自定义类型

`type`关键字可用与在全局或者函数内定义新的类型：

```go
type myint int

func MytypeMethod(){
	type mystr string
    
    var mi myint = 10
	var i int
	// i = mi		// type定义的类型跟原类型属于不同的类型不能相互转换
    i = int(mi)		// 可以显示转换
}
```

`bool`、`int`、`string`等类型属于命名类型，而`array`、 `slice`、`map `等和具体元素类型、⻓度等有关，属于未命名类型。

对于相同类型的未命名类型可以进行隐式转换

```go
type myarr []int
var ma myarr = []int{1,2,3}
var arr []int = ma
println(arr)
```

`arr`、`slice`、`map`、`指针`等未命名类型，其对应的基类型、元素、键值相同的，将被视为同一类型。对于`channel`则还需要有相同的传送方向，才会被视为同一类型。此外以下类型也会被认为是同一类型：

* 具有相同字段序列 (字段名、类型、标签、顺序) 的匿名 struct
* 签名相同 (参数和返回值 的 function
* ⽅法集相同 (⽅法名、⽅法签名) 的 interface



## 表达式

### if

```go
if n := 1; n > 0 { 	// 可以有一句初始化语句
		// do something
	} else if n > 1{
		// do something
	} else {
		// do something
	}
	//print(n)			// 初始化的变量外部无法获取
```

Go语言没有三元运算符



### for

```go
for i := 0; i < 3; i++ {
    // do something
}
```

```go
n := 3
for ;n > 0; { // 除条件判断语句，其他都可用省略
    // do something
    n--
}
```

```go
for { // 死循环
    // do something always
}
```



### range

`range`用于迭代数据，支持`array`、`slice`、`map`、`channel`：

```go
str := "123"	// string类型内部是一个byte数组，所以可以迭代
for i, c := range str { // 第一个参数表示index，第二个参数表示值
    println(i, c)
}
```

```go
for i := range str { // 如果用一个参数接收，默认是index
    println(str[i])
}
```

```go
for _, c := range str { // 可以用占位符_，忽略掉index
    println(c)
}
```

```go
for range str { // 忽略全部返回值，仅迭代。
    // ...
}
```

```go
m := map[string]int{"a": 1, "b": 2}
for k, v := range m { // 如果迭代map则返回key, value
    println(k, v)
}
```

需要注意的是，`range`的迭代会使用复制值，对迭代值的修改不会改变原始数据：

```go
arr := [...]int{1, 2, 3}
for _, v := range arr {
    v = 0
    print(v)		// 输出 000
}
fmt.Println(arr) 	// 输出 [1 2 3]
```



### switch

```go
i := 1
switch i {			// 判断语句
case 1:
    println(1)
case 2:
    println(2)
default:
    println("unkown")
}
```

```go
switch i := 1; {	// 初始化语句，且不带条件判断
case i == 1:	// 进行条件判断
    println(1)
    fallthrough		// fallthrough 关键字会强制执行下一个case，且不需要条件判断
case i == 2:
    println(2)
default:
    println("unkown")
}
```



### 流程跳转

Go语言的流程中可以通过`continue`和`break`来控制循环，`break `可⽤于 for、switch、select，⽽`continue` 仅能⽤于 for 循环。

```go
for i := 0; i<10; i++ {
    if i < 5{
        continue
    } else if i > 8{
        break
    }
    print(i)		// 输出 5678
}
```

此外Go还提供了标签的方式来进行流程控制：

```go
L1:
	for x := 0; x < 3; x++ {
	L2:
		for y := 0; y < 5; y++ {
			if y > 2 {
				continue L2
			}
			if x > 1 {
				break L1
			}
			print(x, ":", y, " ")
		}
		println()
        // 输出
        // 0:0 0:1 0:2
		// 1:0 1:1 1:2
	}
```



## 函数

Go语言中的函数支持

* 函数参数
* 多返回参数，命名返回参数
* 可变参数
* 匿名函数和闭包

Go语言不支持：

* 重载
* 默认参数
* 嵌套（即函数中定义函数）

### 函数参数

可以将复杂的函数签名(函数名、参数以及返回值)定义为类型：

```go
type MyFunc func(p1 string, p2 int)(result string, err bool)
// 匿名函数赋值给全局变量
var f1 = func(str string, i int) (result string, err bool) {
    // 定义了返回参数的函数，可以不用再定义变量
	result = "return result: " + str
	if i > 1 {
		err = true
	} else {
		err = false
	}
    
    // 按照变量名返回参数
	return
}

func funcSign(fn MyFunc) {
	list, err := fn("test", 1)
	println(list, err)
}

func FuncMethod(fn MyFunc){
	funcSign(f1)
}
```



### 可变参数

Go语言中的可变参数必须定义在最后，且只能有一个，其本质上是一个`slice`，并且`slice`作为可变参数传入时，必须使用`...`展开：

```go
func variableParams(flag bool, rs ...rune) {
	slice := []rune{}
	for index, r := range rs {
		println(index, r)
		slice = append(slice, r)
	}

	if flag {
		variableParams(false, slice...)
	}
}
variableParams(true, []rune("Hello Work")...) // 定义runs类型的切片
```



### 延迟调用

`defer`可以延迟调用函数，被调用的函数将会在`return`之后函数实际返回之前被调用：

```go
func deferFunc() (i int) {
defer func() { println("defer1",i); i++ }()
defer func() { println("defer2",i); i++ }()
	return i+1
}
println(deferFunc())	// 输出：3
// 输出：
// defer2 1
// defer1 2
// 3
```

值得注意的是，`defer`调用按照`FILO`的顺序执行，且如果其中有函数报错，其他的函数依旧会执行，可被后续延迟调⽤捕获，但仅最后⼀个错误可被捕获



### 错误处理

Go语言中抛出错误使用`panic`，抓取错误使用`recover`，其函数签名分别接收和返回一个`interface`类型，也就是说，可以抛出或抓取任意类型：

```go
func panic(v interface{})
func recover() interface{}
```

```go
func panicFunc() {
	defer func() {
		if err := recover(); err != nil {
			println(err.(string)) // 将 interface{} 转型为具体类型。
		}
	}()
	panic("panic error!")
}
```

`panic`的抛出会中断程序执行，更常见的作法是使用标准库来返回错误，并对返回的错误判断并处理：

```go
var ErrDivByZero = errors.New("division by zero")
func div(x, y int) (int, error) {
	if y == 0 { return 0, ErrDivByZero }
	return x / y, nil
}
func errorFunc() {
	switch z, err := div(10, 0); err {
	case nil:
		println(z)
	case ErrDivByZero:
		panic(err)
	}
}
```



## 数据

### Array

Go中的数组属于值类型，可以直接使用`==`和`!=`来比较，且数组长度必须在定义的时候确定，相同长度，相同类型的数组才被视为同一类型。数组的定义方式如下：

```go
arr1 := [3]int{1, 2} 			// 初始化前两个值,第三个为元素类型的初始值,即0
arr2 := [...]int{1, 2, 3, 4} 	// 根据初始值确定数组长度
arr3 := [5]int{2: 100, 4:200} 	// 通过索引初始化具体值
arr4 := [...]struct {			// 结构体数组
    name string
    age uint8
}{
    {"user1", 10}, 	
    {"user2", 20}, 	
}
println(arr1,arr2,arr3,arr4)
```

同时Go支持多维数组、指针数组`[]*int`和数组指针`*[]int`

值得注意的是，数组参数在函数中的传递，采用的是值传递的方式，如果只是读取数据，或需要修改数组的话，可以采用传递数组指针的方式。



### Slice

`slice(切片)`更接近于其他语言中的数组概念，是一个结构体。其内部包含一个数组指针，同时包含长度变量`len`，和容量变量`cap`：

```go
struct Slice
{ // must not move anything
 byte* array; // actual data
 uintgo len; // number of elements
 uintgo cap; // allocated number of elements
};
```

* `len`表示切片存储的元素个数
* `cap`表示切片所能存储的最大元素个数

切片的定义：

```go
s1 := []int {1,2,3}					// 使用初始值创建切片，长度和容量默认为3
fmt.Print(len(s1), "\t")			// len()方法可以返回一个切片的长度
fmt.Print(cap(s1), "\t\n")			// cap()方法可以返回一个切片的容量

s2 := make([]int, 6, 8)				// make方法可以创建指定长度和容量的切片
// s2 := make([]int, 6)				// 如果不指定容量，则容量等于长度
fmt.Print(len(s2), "\t")
fmt.Print(cap(s2), "\t\n")

// 输出
// 3	3	
// 6	8	
```

切片还可以通过截取数组来定义，其长度等于截取数组的元素个数，容量等于截取位置到数组最后一个元素的个数：

```go
arr := []int{1,2,3,4,5}			
s3 := arr[2:]					// 从数组中获取切片
fmt.Println(s3)					
fmt.Print(len(s2), "\t")	
fmt.Print(cap(s2), "\t\n")

s4:= arr[:3]
fmt.Println(s4)					// 左闭右开
fmt.Print(len(s4), "\t")
fmt.Print(cap(s4), "\t\n")	

// 输出
// [3 4 5]
// 3	3	
// [1 2 3]
// 3	5
```

切片还可以通过截取切片来获得:

```go
s7 := []int{1,2,3,4,5,6}
s8 := s7[2:4:6]			// 定义截取的长度和容量
fmt.Println(s8)
fmt.Print(len(s8), "\t")
fmt.Print(cap(s8), "\t\n")
// 输出
// [3 4]
// 2	4
```

值得注意的是，从数组或切片获取的切片，其内部的数组指针指向的是原数组，对数组的修改将会改变切片的值：

```go
arr2 := []int{1,2,3,4,5}
s5 := arr2[2:]
fmt.Println(s5)
arr2[2] = 0
fmt.Println(s5)
```

当切片的容量已满时，如果还需要添加元素，可以使用`append`方法。其会创建一个两倍于原底层数组的数组，并指向该数组。在原切片容量大于1000时，扩容将会被缩小至1.25倍：

```go
s6 := []int {1,2,3}
s6 = append(s6,4)
```

值得注意的是：定义一个`空切片`和`nil`切片是不一样的，所有的空切片其数组指针会指向同一个内存地址：

```go
// nil切片
var s1 []int
var s2 = *new([]int)
// 空切片
var s3 = []int{}
var s4 = make([]int, 0)

var a1 = *(*[3]int)(unsafe.Pointer(&s1))
var a2 = *(*[3]int)(unsafe.Pointer(&s2))
var a3 = *(*[3]int)(unsafe.Pointer(&s3))
var a4 = *(*[3]int)(unsafe.Pointer(&s4))

fmt.Println(a1)
fmt.Println(a2)
fmt.Println(a3)
fmt.Println(a4)

// 输出
// [0 0 0]
// [0 0 0]
// [824634199592 0 0]
// [824634199592 0 0]
```

参考资料: [深度解析 Go 语言中「切片」的三种特殊状态](https://juejin.cn/post/6844903712654098446)

`copy`可以将一个切片复制给另一个切片:

```go
data := [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
s9 := data[8:]
s10 := data[:5]
copy(s10, s9)
fmt.Println(s9)
fmt.Println(data)

// 输出
// [8 9 2 3 4]
// [8 9 2 3 4 5 6 7 8 9]
```



### Map

`key`必须是支持`==`和`!=`的类型，`value`可以是任意类型:

```go
m1 := map[int]string{		// 初始值创建map
    1:"a",
    2:"b",
}
m2 := make(map[int]string, 1000)	// make申请内存来创建map
fmt.Println("len: \v", len(m2))		// 可以使用len方法来查看map的长度
```

通常情况下为了避免`map`频繁的扩容，应该使用`make`提前预估`map`长度来创建

```go
fmt.Printf("%v\n",m1[1])		// 获取值
fmt.Printf("%v\n",m1[3])		// 不存在返回对于value的初始值
m1[3] = "c"				// 设置值
delete(m1, 4)		// 如果存在则删除键值对
for k, v := range m1 {	// 遍历
    fmt.Printf("key: %v; value: %v\n", k, v)
}
```

需要注意的是，使用`for`语句遍历`map`的时候，不能保证迭代的返回次序。

此外，遍历的是复制值，如果需要替换`value`的话，可以通过以下方式，或者让`value`保存变量指针：

```go
for k,v := range m1 {
    m1[k] = v + v
}
```



### Struct

使用`type`可以自定义一个值类型的结构体类型：

```go
type User struct{
	name string
	age int
}
```

也支持匿名结构体：

```go
s1 := struct {
    address string
    phone string
}{"shanghai", "110"}
```

初始化：

```go
u1 := User{name: "zhangsan", age: 18}
u2 := User{"zhangsan", 18}
```

Go不支持继承，可以通过结构体嵌套达到类似效果：

```go
type Manager struct {
	level int
	name  string
	User	// 嵌入类型
    // *User // 不能同时嵌入某类型和其指针，因为名字相同
}

m1 := Manager{
    level: 1,
    name:  "Lee",
    User:  u1,
}
fmt.Println(m1.User.age)	// => 18	
fmt.Println(m1.name) 		// => Lee
fmt.Println(m1.User.name) 	// => zhangsan
```

结构体还可以定义标签，在使用对应的读取时会根据对应标签的名称来获取或者设置值：

```go
type Feed struct {
	name     string `json:"site"`
	uri      string `json:"link"`
	feedType string `json:"feed_type"`
}

feeds := []*Feed{}
resp, err := http.Get("www.baidu.com")
if err != nil {
    println(err)
}
json.NewDecoder(resp.Body).Decode(&feeds)
```

值得注意的是，空的`struct`不占用任何内存空间，可以用于实现只有方法的"静态类"或者`set`数据结构：

```go
var null struct{}
set := make(map[string]struct{})
set["a"] = null
```



## 方法

### 方法定义

Go语言里面方法和函数非常相似，但在定义声明上方法比函数多了一个接收者。

假设我们有结构体Cat，一个完整的方法定义应该如下：

```go
func(cat Cat) SayHello(somebody string) (err bool){
	println(cat.name,"said: Hello",somebody)
	return false
}
```

其表示给结构体Cat的实例定义一个可接收`string`类型的`SayHello`方法，并返回`bool`类型

可以看到，在方法中可以是使用名为`cat`的参数来获取接收者的属性

此外，以上的接收者被定义为值类型，我们也可以定义为指针类型`(cat *Cat)`

```go
func(cat *Cat) Rename(name string){
	cat.name = name
}
```

在Cat类型的实例调用`Rename()`方法之后，其`name`，也将被改变

需要注意的是：

* 只能为当前包内命名类型定义⽅法
* 参数` receiver`，不能是接⼝或指针
* ` receiver`在方法中未被使用，可以省略参数名

### 方法集

每个类型都有与之关联的⽅法集：

* 类型 T ⽅法集包含全部 receiver T ⽅法。 
* 类型 *T ⽅法集包含全部 receiver T + *T ⽅法。 
* 如类型 S 包含匿名字段 T，则 S ⽅法集包含 T ⽅法。 
* 如类型 S 包含匿名字段 *T，则 S ⽅法集包含 T + *T ⽅法。 
* 不管嵌⼊ T 或 *T，*S ⽅法集总是包含 T + *T ⽅法。



方法根据调用者不同可以分为两种表现形式：

```go
instance.method(args...)			// method value
<type>.func(instance, args...)		// method expression。
```

如以上定义的Cat结构体中添加`WhoAmI()`，方法后可以使用如下两种方式调用：

```go
func (cat *Cat) WhoAmI(){
	fmt.Printf("I am %v\n",cat.name)
}

func MethodMethod() {
	cat := &Cat{"Tomcat"}
	cat.WhoAmI()
	(*Cat).WhoAmI(cat)
}
```



## 接口

### 接口定义

Go中的接口是一个或多个方法签名的集合：

```go
type Heller interface {		// 通常接口以er结尾
	SayHello(string)
}
```

切类型实现接口无需显示添加声明，只需要实现该接口的所有方法即可：

```go
type Cat struct {
	name string
}

func (cat Cat) SayHello(somebody string) {
	fmt.Printf("Hello, %v\n",somebody)
}

func InfMethods(){
	var tomcat = Cat{"Tomcat"}
	var heller Heller = tomcat
    // var heller Heller = Cat{"Tomcat"}
	heller.SayHello("Work!")
}
```

接⼝对象由接⼝表`Itab`指针和数据指针`data`组成，其中接口表包括括接⼝类型、动态类型，以及实现接⼝的⽅法指针，数据指针持有的则是目标对象的只读复制：

```go
tomcat.name = "Jack"
fmt.Println(heller.(Cat).name)		// => Tomcat
fmt.Println(tomcat.name)			// => Jack
```

接口还可以作为变量类型，或结构成员：

```go
type Pet struct {
	h Heller
}
func InfMethods(){
	var miao = Cat{"miao"}
	var pet = Pet{h:miao}
	pet.h.SayHello("Work!")
}
```

此外Go中接口还有以下特点：

* 可在接⼝中嵌⼊其他接⼝
* 类型可实现多个接⼝
* 超集接⼝对象可转换为⼦集接⼝，反之则报错

### 接口转换

空接口`interface{}`没有任何方法签名，即所有类型都实现了空接口。所以可以使用空接口来传递任意返回值以及返回值。

```go
cat := Cat{"Tomcat"}
var vi, pi interface{} = cat, &cat
```

此时需要获取`Cat`的`name`属性则需要将参数转换成原有类型：

```go
fmt.Printf("%v\n", vi.(Cat).name)
fmt.Printf("%v\n", pi.(*Cat).name)
```

同时，接⼝转型返回临时对象时，只有使⽤指针才能修改其状态：

```go
// vi.(Cat).name = "Jack" // Error: cannot assign to vi.(Cat).name
pi.(*Cat).name = "Jack"
```

利⽤类型推断，可判断接⼝对象是否某个具体的接⼝或类型：

```go
if i, ok := vi.(Heller); ok {
    fmt.Println(i)
}
```

```go
switch v := vi.(type) {
case nil: // vi == nil
    fmt.Println("nil")
case Heller: // interface
    v.SayHello("Work!")
case func() string: // func
    fmt.Println(v())
case Cat: // struct
    fmt.Printf("struct name: %v\n", v.name)
case *Cat: // *struct
    fmt.Printf("*struct name: %v\n", v.name)
default:
    fmt.Println("unknown")
}
```



## 内存布局

**Number**

![number](../image/Go/Go%E5%9F%BA%E7%A1%80/number.png)

**string**

![string](../image/Go/Go%E5%9F%BA%E7%A1%80/string.png)

**struct**

![struct](../image/Go/Go%E5%9F%BA%E7%A1%80/struct.png)

**slice**

![slice](../image/Go/Go%E5%9F%BA%E7%A1%80/slice.png)

**interface**

![interface](../image/Go/Go%E5%9F%BA%E7%A1%80/interface.png)

**new**

![new](../image/Go/Go%E5%9F%BA%E7%A1%80/new.png)

**make**

![make](../image/Go/Go%E5%9F%BA%E7%A1%80/make.png)



## 反射

当一个对象转换成接口时，会在该接口的`Itab`中存储与该类型相关的信息，标准库中的`reflect`包则是根据这些信息来操作对象的

### Type

假设有如下结构体：

```go
type Cat struct {
	Animal
	owner string `field:"onwer" type:"varchar(20)"`
}

type Animal struct {
	name string `field:"a_name" type:"varchar(20)"`
	Foot int    `field:"foot" type:"integer(4)"`
}
```

`Type`是`reflect`包中的一个接口，用于表示Go中的类型。通过`reflect.TypeOf()`方法可以返回对象的类型`(reflect.Type)`：

```go
var tomcat Cat
//tomcat := Cat{
//	"zhangsan",
//	Animal{"Jack",4},
//}
t := reflect.TypeOf(tomcat)
```

通过`reflect.Type`可以获取到对象的各字段：

```go
// 遍历， 通过下标获取
t := reflect.TypeOf(tomcat)
for i, n := 0, t.NumField(); i < n; i++ {
    f := t.Field(i)					
    fmt.Println(f.Name, f.Type)
}
```

```go
// 通过名称获取，会自动查找嵌套字段
if f, ok := t.FieldByName("name"); ok {
    fmt.Println(f.Name, f.Type)		
}
```

```go
// 多级序号访问
// []int{0, 2} panic: Field index out of bounds
f := t.FieldByIndex([]int{0, 1}) 	
fmt.Println(f.Name, f.Type)
```

字段上自定义的标签可以通过`tag`名来获取对应的值：

```go
f, _ = t.FieldByName("name")
fmt.Println(f.Tag)					// => field:"a_name" type:"varchar(20)"
fmt.Println(f.Tag.Get("field"))		// => a_name
fmt.Println(f.Tag.Get("type"))		// => varchar(20)
```

指针本身是没有任何字段的，所以反射指针对象时，需要通过`Elem()`将其转换成基本类型：

```go
jack := new(Cat)
//jack := &Cat{
//	"zhangsan",
//	Animal{"Jack",4},
//}

// value-interface 和 pointer-interface 也会导致⽅法集存在差异
// ptr elem
t2 := reflect.TypeOf(jack)
// It panics if the type's Kind is not Array, Chan, Map, Ptr, or Slice.
t2 = t2.Elem() 
for i, n := 0, t2.NumField(); i < n; i++ {
    f := t2.Field(i)
    fmt.Println(f.Name, f.Type)
}
```

当然也可以通过基本类型生成复合类型：

```go
i := reflect.TypeOf(0)
str := reflect.TypeOf("")

c := reflect.ChanOf(reflect.SendDir, str)
fmt.Println(c)					// => chan<- string
m := reflect.MapOf(str, i)	
fmt.Println(m)					// => map[string]int
s := reflect.SliceOf(i)
fmt.Println(s)					// => []int
st := struct{ Name string }{}
p := reflect.PtrTo(reflect.TypeOf(st))
fmt.Println(p)					// => *struct { Name string }
```

在创建结构体时，内存分配可能会被Go优化，我们可以通过`reflect`中的`Size()`、`Align`等方法来查看结构体在内存中的对其信息：

```go
type Data struct {
    b byte
    i int32
}
var d Data
td := reflect.TypeOf(d)
fmt.Println(td.Size(), td.Align()) 	// => 8 4
```

`FildAlign()`可以查看字段在结构体中的对齐信息：

```go
fd, _ := td.FieldByName("b")
fmt.Println(fd.Type.FieldAlign()) 	// => 1
```

此外`reflect.Type`还提供了`Implements()`来判断是否实现了某接口、`AssignableTo()`用于赋值、`ConvertibleTo()`用于转换判断



### Value

`reflect`包中提供的`Value`相关的方法跟`Type`相关的方法相当类似，只不过改成了获取字段的值：

```go
tomcat := Cat{
    Animal{"Tomcat", 4},
    "zhangsan",
}
v := reflect.ValueOf(tomcat)
fmt.Println(v.FieldByName("owner").String())		// => "zhangsan"
fmt.Println(v.FieldByName("Foot").Int())			// => 4
fmt.Println(v.FieldByIndex([]int{0, 0}).String())	// => "Tomcat"	 
```

如果未找到值会返回一个`invalid Value`

```go
fmt.Println(v.FieldByName("none").String())			// => <invalid Value>
```

对于导出字段（首字母大写的字段）可以使用`Interface()`获取值

```go
f := v.FieldByName("Foot")
if f.CanInterface() {
    fmt.Println(f.Interface())	// => 4
    i := f.Interface()
    fmt.Printf("%T\n",i)		// => int
}
```

复合类型值获取：

```go
// slice、array
v2 := reflect.ValueOf([]int{1, 2, 3})
for i := 0; i < v2.Len(); i++ {
    fmt.Println(v2.Index(i).Int())
}
```

```go
// map
v3 := reflect.ValueOf(map[string]int{"a": 1, "b": 2, "c": 3})
for i, k := range v3.MapKeys() { // 遍历顺序是不一定的
    fmt.Printf("%v: %v => %v\n", i, k, v3.MapIndex(k))
}
```

此外`Kind()`方法可以获取`reflect.Value`的类型，`IsNil()`可以判断`reflect.Value`对象是否为空，需要注意的是，基本类型拥有默认值均不为空，所以不适用于该方法

`ValueOf()` 会返回一个新的实例，且该实例只读，但是如果这是一个指针的实例，且是导出字段则可以对指向的目标进行修改：

```go
v5 := reflect.ValueOf(&tomcat)
fmt.Println(v5.CanSet())	// => false
v5.Elem().FieldByName("Foot").SetInt(3)
fmt.Println(v5)				// => &{{Tomcat 3} zhangsan}
```

如果是非导出字段，则可以获取其地址改变其值：

```go
v6 := reflect.ValueOf(&tomcat)
f6 := v6.Elem().FieldByName("owner")
fmt.Println(f6.CanAddr())	// => true
if f6.CanAddr() {
    owner := (*string)(unsafe.Pointer(f6.UnsafeAddr()))
    // owner := (*string)(unsafe.Pointer(f.Addr().Pointer())) // 等同
    *owner = "lisi"
}
fmt.Println(v6)		// => &{{Tomcat 3} lisi}
```

复合类型值修改：

```go
// slice
s := make([]int, 0, 5)
// 反射指针才能修改值，通过Elem()获取指针指向的对象
v7 := reflect.ValueOf(&s).Elem()
v7.SetLen(1)
v7.Index(0).SetInt(1)
v7 = reflect.Append(v7, reflect.ValueOf(2))		// append 生成新的底层数组
v7 = reflect.AppendSlice(v7, reflect.ValueOf([]int{3, 4}))
fmt.Println(v7, s)		// => [1 2 3 4] [1]
```

```go
// map
m := map[string]int{"a":0}
v8 := reflect.ValueOf(&m).Elem()
v8.SetMapIndex(reflect.ValueOf("a"), reflect.ValueOf(1))	// update
v8.SetMapIndex(reflect.ValueOf("b"), reflect.ValueOf(2))	// create
fmt.Println(v8, m)		// => map[a:1 b:2] map[a:1 b:2]
```



### Method

通过反射还可以获取方法的入参，返回值等信息：

```go
type Data struct{}

func (*Data) Add(x, y int) int {
	return x + y
}

func (*Data) Sum(x int, s ...int) int {
	for _, v := range s {
		x += v
	}
	return x
}
```

```go
info := func(m reflect.Method) {
    fmt.Printf("%v", m.Name)
    t := m.Type
    for i := 0; i < t.NumIn(); i++ {
        fmt.Printf(" in[%d] %v\n", i, t.In(i))
    }
    for i := 0; i < t.NumOut(); i++ {
        fmt.Printf(" out[%d] %v\n", i, t.Out(i))
    }
}
d := new(Data)
t := reflect.TypeOf(d)		// TypeOf

typeAdd := t.Method(0)
info(typeAdd)
if sum, ok := t.MethodByName("Sum"); ok {
    info(sum)
}
```

输出：

```go
Add in[0] *ref.Data
 in[1] int
 in[2] int
 out[0] int
Sum in[0] *ref.Data
 in[1] int
 in[2] []int
 out[0] int
```

不仅如此，通过方法类型的`reflect.Value`还可以直接调用方法：

```go
v := reflect.ValueOf(d)		// ValueOf
in := []reflect.Value{
    reflect.ValueOf(1),
    reflect.ValueOf(2),
}
valueAdd := v.MethodByName("Add")
out := valueAdd.Call(in)
for i, v := range out {
    fmt.Printf("out[%v]: %v\n", i, v)		// => out[0]: 3
}
```

方法中的可变参数可以通过`reflect.Value`类型的`slice`传入，并通过`CallSlice()`方法调用：

```go
v2 := reflect.ValueOf(d)
in2 := []reflect.Value{
    reflect.ValueOf(1),
    reflect.ValueOf([]int{2, 3, 4}),
}
valueSum := v2.Method(1)
out2 := valueSum.CallSlice(in2)
for i, v := range out2 {
    fmt.Printf("out[%v]: %v\n", i, v)		// => out[0]: 10
}
```



### Make

`reflect`包提供的一系列`Make`方法可以动态创建各引用类型的数据结构，甚至包括`func`。这里以动态创建`func`为例子，`MakeSlice`、`MakeMap()`、`MakeChan()`等方法可以自行查看`reflce`中的源码：

```go
hello := func(args []reflect.Value) (result []reflect.Value) {
    for _, v := range args {
        fmt.Printf("Hello, %v", v.Interface())
    }
    return
}

var f func(string)
valueFuncPtr := reflect.ValueOf(&f)			// 取指针才能修改
// 等同reflect.ValueOf(&f).Elem()
valueFunc := reflect.Indirect(valueFuncPtr) // 获取指针指向的对象
valueFunc.Set(reflect.MakeFunc(valueFunc.Type(), hello))

f("Work!")		// => Hello, Work!
```



# 测试

之所以将测试单独写一章，就是为了表明测试的重要性。



## 单元测试

单元测试是用来测试一部分代码的函数。单元测试的是确认目标在给定的场景下有没有按照预期工作。

根据测试框架的的约定：

* 测试文件的文件名必须以`_test`结尾。
* 测试函数必须以`Test`开头，并且必须接收一个`testing.T`类型的指针，且无返回值。

我们先再编写一个计算Fibnacci数列和的函数，然后再编写测试：

```go
func Fib(i int) (result int) {
	if i <= 2 {
		return 1
	}

	return Fib(i-1) + Fib(i-2)
}
```

然后在**同一个包**下创建测试文件`fib_test.go`

```go
func TestUnit(t *testing.T) {
	t.Log("Unit Test")
	result := Fib(2)
	if result != 1 {
		t.Fatalf("Run fib(2) expect return: 1, but got %v", result)
	}
}
```

然后在文件同级目录下，运行命令`go test -v`：

```bash
go test -v
=== RUN   TestUnit
    unit_test.go:14: Unit Test
--- PASS: TestFib (0.00s)
PASS
ok      hellogo/test    0.100s
```

如果不添加`-v`参数，将不会输出`t.Log()`中的内容。

让我们修改一下函数的内容，使得返回一个错误的结果，在运行测试：

```go
func Fib(i int) (result int) {
	if i <= 2 {
		//return 1
		return 2
	}

	return Fib(i-1) + Fib(i-2)
}
```

```bash
>go test
--- FAIL: TestUnit (0.00s)
    unit_test.go:15: Unit Test
    unit_test.go:18: Run fib(2) expect return: 1, but got 2
FAIL
exit status 1
FAIL    hellogo/test    0.107s
```

如果执行`t.Fatalf()`将会直接停止当前测试函数的运行，如果希望抛出错误并且继续运行函数可以使用`t.Errorf()`

通过简单的修改函数，我们还可以同时对一组结果进行测试：

```go
func TestTable(t *testing.T) {
	datas := []struct {
		name string
		i      int
		result int
	}{
		{"Test fib(1)",1, 1},
		{"Test fib(2)",2, 1},
		{"Test fib(3)",3, 2},
		{"Test fib(4)",4, 3},
	}

	t.Log("Table Group Test")
	for _, v := range datas {
		t.Run(v.name, func(t *testing.T){
			result := Fib(v.i)
			if result != v.result {
				t.Fatalf("Run fib(%v) expect return: %v, but got %v", v.i, v.result, result)
			}
		})
	}
}
```

此时如果我们指向运行`TestTable()`可以添加`-run`参数，后面赋值对应需要的方法：

```go
>go test -v -run="TestTable"
=== RUN   TestTable
    unit_test.go:35: Table Group Test
=== RUN   TestTable/Test_fib(1)
=== RUN   TestTable/Test_fib(2)
=== RUN   TestTable/Test_fib(3)
=== RUN   TestTable/Test_fib(4)
--- PASS: TestTable (0.00s)
    --- PASS: TestTable/Test_fib(1) (0.00s)
    --- PASS: TestTable/Test_fib(2) (0.00s)
    --- PASS: TestTable/Test_fib(3) (0.00s)
    --- PASS: TestTable/Test_fib(4) (0.00s)
PASS
ok      hellogo/test    0.147s
```

此外`-run`还可以赋值正则表达式。

如果测试文件中包含`TestMain(m *testing.M)`，那么生成的测试将调用 `TestMain(m *testing.M)`，而不是直接运行测试。我们可以将此利用，在`TestMain(m *testing.M)`做一些共有的操作：

```go
func TestMain(m *testing.M) {
	fmt.Println("Start Test")
	code := m.Run()
	fmt.Println("End Test")
	os.Exit(code)
}
```

```go
>go test -v
Start Test
=== RUN   TestUnit
    unit_test.go:18: Unit Test
--- PASS: TestUnit (0.00s)
=== RUN   TestTable
    unit_test.go:37: Table Group Test
=== RUN   TestTable/Test_fib(1)
=== RUN   TestTable/Test_fib(2)
=== RUN   TestTable/Test_fib(3)
=== RUN   TestTable/Test_fib(4)
--- PASS: TestTable (0.00s)
    --- PASS: TestTable/Test_fib(1) (0.00s)
    --- PASS: TestTable/Test_fib(2) (0.00s)
    --- PASS: TestTable/Test_fib(3) (0.00s)
    --- PASS: TestTable/Test_fib(4) (0.00s)
PASS
End Test
ok      hellogo/test    0.129s
```



## 基准测试

基准测试用于测试代码性能。与单元测试一样，基准测试的文件名也必须以`_test.go`结尾。且测试函数必须以`Benchmark`开头，并且必须接收一个`testing.B`类型的指针，且无返回值。再次测试`Fib()`：

```go
func BenchmarkFib(b *testing.B) {
	// do something...
	b.ResetTimer()				// 重置计算时间

	for i:=0 ;i <b.N; i++{		// 循环统计
		Fib(5)
	}
}
```

进行基准需要添加`-bench="Bench*"`。为了避免运行前面的单元测试，我们添加选项`-run="none"`

```go
>go test -run="none" -bench="Bench*"
Start Test
goos: windows
goarch: amd64
pkg: hellogo/test
cpu: Intel(R) Core(TM) i5-5257U CPU @ 2.70GHz
BenchmarkFib-4          57981378                20.44 ns/op
PASS
End Test
ok      hellogo/test    1.316s
```

我们可以看到程序在`1.316s`内运行了`57981378`次

还可以通过`-benchtime`选项来设置最短运行时间：

```go
t>go test -run="none" -bench="Bench*" -benchtime="3s"
Start Test
goos: windows
goarch: amd64
pkg: hellogo/test
cpu: Intel(R) Core(TM) i5-5257U CPU @ 2.70GHz
BenchmarkFib-4          176971278               20.27 ns/op
PASS
End Test
ok      hellogo/test    5.755s
```

此外添加`-benchmem`可以打印出每次操作分配的内存，以及分配内存的次数：

```go
>go test -run="none" -bench="Bench*" -benchtime="3s" -benchmem
Start Test
goos: windows
goarch: amd64
pkg: hellogo/test
cpu: Intel(R) Core(TM) i5-5257U CPU @ 2.70GHz
BenchmarkFib-4          167322406               24.38 ns/op            0 B/op          0 allocs/op
PASS
End Test
ok      hellogo/test    6.368s

```

由于`Fib()`函数直接在栈上调用，所有内存分配为0



## Mock

// TODO



## 测试覆盖

通过`go test -cover`可以查看测试的覆盖率：

```bash
t>go test -cover
Start Test
PASS
coverage: 100.0% of statements
End Test
ok      hellogo/test    0.107s
```

通过命令：

```bash
>go test -v -coverprofile=cover.out
```

可以将覆盖率信息保存到`cover.out`文件，然后再通过`cover`工具，可以查看当前包下各函数的覆盖率：

```bash
>go tool cover -func=cover.out
hellogo/test/fib.go:3:  Fib             100.0%
total:                  (statements)    100.0%
```

通过`-html`选项会直接浏览器中打开测试内容的覆盖情况：

```bash
>go tool cover -html=cover.out
```







