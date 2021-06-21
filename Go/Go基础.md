

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

