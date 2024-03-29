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

切片和数组的遍历均可以使用一个或者两个参数接收：

```go
for index := range slice {}
for index, value := range slice {}
```

每次遍历的`value`会由一个单独的内存空间来存储，所以如果对`value`取地址都将会获得同一个地址：

```go
type A struct { Id int }
slice := []A{{Id: 1}, {Id: 2}}

for _, v := range slice {
  t.Logf("%p", &v)
}
```

```bash
 0xc000130140
 0xc000130140
```

所以如果需要更改原切片中的值需要采用以下方式：

```go
for i := range slice {
		slice[i] = i+1
}
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

需要注意的是没有分配内存的`map`是不能存取键值对的：

```go
var m map[string]int
m["1"] = 1		// panic: assignment to entry in nil map
```

此外通常情况下为了避免`map`频繁的扩容，应该使用`make`提前预估`map`长度来创建：

```go
fmt.Printf("%v\n",m1[1])		// 获取值
fmt.Printf("%v\n",m1[3])		// 不存在返回对于value的初始值
m1[3] = "c"				// 设置值
delete(m1, 4)		// 如果存在则删除键值对
for k, v := range m1 {	// 遍历
    fmt.Printf("key: %v; value: %v\n", k, v)
}
```

当插入的键值对数量大于`make`分配的长度时，并不会出现类似数组下标越界的情况，而是会自动扩容：

```go
m := make(map[int]struct{}, 1)
m[1] = struct{}{}
m[2] = struct{}{}
t.Log(m)		// map[1:{} 2:{}]
```

需要注意的是，使用`for`语句遍历`map`的时候，不能保证迭代的返回次序。

此外，遍历的是复制值，如果需要替换`value`的话，可以通过以下方式，或者让`value`保存变量指针：

```go
for k, v := range m1 {
    m1[k] = v + v
}
```

当用两个参数来接收`map`的值时，可以判断`key`是否存在：

```go
m := make(map[int]struct{}, 1)
m[1] = struct{}{}
v, ok := m[1]
t.Log(v)		// {}
t.Log(ok)		// true
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

方法根据调用者不同可以分为两种表现形式：

```go
instance.method(args...)			// method value
<type>.func(instance, args...)		// method expression。
```

可以通过一下的例子来感受一下：

```go
type Cat struct {
	name string
}

func (cat *Cat) Rename(name string) {
	cat.name = name
}

func (cat Cat) WhoAmI() {
	fmt.Printf("I am %v\n", cat.name)
}
```

以下对于`WhoAmI()`和`Rename()`两种写法其实是等价的：

```go
// value reciver
cat := Cat{"Tomcat"}
cat.WhoAmI()				// 1
(Cat).WhoAmI(cat)		// 2
```

```go
// pointer reciver
cat := Cat{"Tomcat"}
cat.Rename("Jerry")						// 1	=> (&cat).Rename("Jerry")
(*Cat).Rename(&cat, "Harry")	// 2
```

这里值得注意的是，cat作为Cat类型的值依然可以调用到作为指针接收的`(cat *Cat) Rename`方法。这是因为`go`在编译的时候会为我们做隐式转换，实际上`cat.Rename("Jerry")`相当于`(&cat).Rename("Jerry")`。
但是如果尝试使用以下两种方法调用，则编译会不通过：

```go
Cat.Rename(&cat, "Harry")
Cat.Rename(cat, "Harry")		
```

这就涉及到方法集的概念，方法集决定了可以在该类型上操作的方法。每个类型都有与之关联的⽅法集，比如上面例子中的`WhoAmI()`就是定义在`Cat`类型的方法集中的一个方法。

定义同一个receiver上的方法，可能属于多个方法集：

* 类型 T ⽅法集包含全部 receiver T ⽅法。 
* 类型 *T ⽅法集包含全部 receiver T + *T ⽅法。 
* 如类型 S 包含匿名字段 T，则 S ⽅法集包含 T ⽅法。 
* 如类型 S 包含匿名字段 *T，则 S ⽅法集包含 T + *T ⽅法。 
* 不管嵌⼊ T 或 *T，S ⽅法集总是包含 T + *T ⽅法。



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

### 实现接口

在实践中我们在使用接口的过程中，通常都会遇到接口增加方法的时候，这样就需要在接口的实现中添加对应的方法。由于 Go 语言的特性，并没有强制要求指定结构体对接口的实现。所有我们需要明确找到借口实现，添加接口方法。如果是使用的 Goland 编辑器，有一个小技巧，帮助我们快速实现添加的方法。
比如我们有一个结构体，需要实现`io.Reader`接口。我们可以添加如下的冗余代码：

```go
type r struct{}

var _ io.Reader = (*r)(nil)
```

这样 Goland 会提示我们`r`没有实现`io.Reader`中的方法，我们可以借此快速添加缺失的方法。



## 内存布局

**Number**

![number](../asset/Go/Go%E5%9F%BA%E7%A1%80/number.png)

**string**

![string](../asset/Go/Go%E5%9F%BA%E7%A1%80/string.png)

**struct**

![struct](../asset/Go/Go%E5%9F%BA%E7%A1%80/struct.png)

**slice**

![slice](../asset/Go/Go%E5%9F%BA%E7%A1%80/slice.png)

**interface**

![interface](../asset/Go/Go%E5%9F%BA%E7%A1%80/interface.png)

**new**

![new](../asset/Go/Go%E5%9F%BA%E7%A1%80/new.png)

**make**

![make](../asset/Go/Go%E5%9F%BA%E7%A1%80/make.png)



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



## IO

经常遇到io相关的问题就有点摸不着头脑，故此将IO单独整理写到基础里面以供查阅。
这里讨论的IO并非操作系统对文件的读写操作。虽然Go中的ioutil包曾利用os包封装了API，直接对文件进行操作，但是自Go 1.16之后已经废弃了这些方法。所以这里讨论的io更多的是io包提供的接口和接口方法。

IO最主要的就是理解三个东西：`Reader`、`Writer`和`[]byte`。
几乎所有通用的包的`Reader`、`Writer`，都是为了实现`io.Reader`和`io.Writer`接口，以对外提供方法。并且对应的`struct`底层都会对应一个`[]byte`。
而`Reader`的`Read()`方法，和`Writer`的`Write()`都是相对于这个底层`[]byte`来说的。即分别从这个`[]byte`读取数据和向这个`[]byte`写入数据。我们可以看一下`Reader`读取数据的例子：

```go
	reader := bytes.NewReader([]byte("1234567890"))

	for {
		b := make([]byte, 6)
		n, err := reader.Read(b)
		if err != nil {
			if err == io.EOF {
				t.Log("Read Finished")	// 读取完成需要返回
				break
			}
			t.Fatal("Read错误：",err)
		}

		t.Log(string(b[:n]))				// 需要根据Read到的实际数据进行输出
	}
```

```bash
io_test.go:63: 123456
io_test.go:63: 7890
io_test.go:57: Read Finished
```

关于`Writer`的例子会稍微难理解一点：

```go
// writer
b := []byte{}
buf := bytes.NewBuffer(b)
_, err := buf.Write([]byte("1234567890a"))
assert.NoError(t, err)
t.Log(b)
t.Log(buf)
```

```bash
io_test.go:74: []
io_test.go:75: 1234567890a
```

在这里`buf`才是重点。我们通过`bytes`包提供的方法根据一个空的`[]byte`生成一个`Buffer`类型的变量`buf`。但是从输出的结果可以看到，这里传入的`[]byte`并不是`Write()`方法操作的byte数组。如果进入该方法的源码可以看到，这里的`b`仅仅作为`buf`的初始内容，`buf`中单独维护了一个可变长度的`[]`byte。

从`Writer`的例子可以看到，通常`Write`并不是向调用者所提供的`[]byte`中写入数据，而是向该`Writer`内部提供的`[]byte`写入数据。甚至更常见的情况是，直接进行系统调用，向文件写入数据：

```go
file, err := os.Create("write_test.txt")
assert.NoError(t, err)
_, err = file.Write([]byte("test write to file"))
assert.NoError(t, err)
```

频繁的写入少量数据，会导致频繁的访问本地磁盘的文件，造成大量的开销。`bufio`包提供了中间的缓冲，当缓冲区数据装满时才会调用创建时提供的`Writer`进行写数据：

```go
file, err := os.Create("bufio_write_test.txt")
assert.NoError(t, err)
writer := bufio.NewWriterSize(file, 1000)					// 根据file创建bufio，并设置缓冲区大小为1000
_, err = writer.Write([]byte("test bufio write to file1"))
_, err = writer.Write([]byte("test bufio write to file2"))
_, err = writer.Write([]byte("test bufio write to file3"))
assert.NoError(t, err)
writer.Flush()
```

我们多次写入的数据并没有装满缓冲区，但最后通过`Flush()`方法，仍然可以将数据强制写出，这里则是进行系统调用，将数据写入文件。

# 测试

之所以将测试单独写一章，就是为了表明测试对一个项目的重要性。



## 单元测试

### Test

单元测试是用来测试一部分代码的函数。单元测试的是确认目标在给定的场景下有没有按照预期工作。
根据测试文件需要按照以下约定：

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

go在运行测试方法时，各个**包之间是相互隔离并且并行的**（当然这取决于你设置的运行cpu数量）。同一个包下的测试会按照**文件名顺序**执行。同一个文件中的多个测试会按照**从上到下**的顺序执行。
`t.Run()`可以让我们在同一个Test方法中，顺序执行多次，并可以设置名称：

```go
func TestRun(t *testing.T) {
  t.Run("name1", func(t *testing.T) {
		t.Log(1)
	})
	t.Run("name2", func(t *testing.T) {
		t.Log(2)
	})
}
```

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

为了避免不必要的重复执行，一个成功的单元测试将会被缓存，直到当前测试包下的内容有修改。
即使某个方法存在类似`time.Now()`这种动态生成的变量的时候，比如测试方法包含`time.Now().Unix() < 1668152900`这样的判断，并通过的情况下，**即使该判断存在二义性，因为测试通过了就会被缓存**。所以应该避免在单元测试中使用不确定的参数。

在没有指定文件的情况下`go test`会尝试加载执行目录下的所有`go`文件。如果只想加载部分文件，可以在命令最后通过文件名指定：

```go
go test --run="[FUNCTION_NAME]" main_test.go
go test --run="[FUNCTION_NAME]" -v $(ls | grep -v '_test.go' | grep '.go') main_test.go
```



### TestMain

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



### testflag

可以通过`go help test`和`go help testflag`查看更多的参数

#### -v

打印详细的测试输出

#### -run

`-run`参数，后面赋值对应需要执行的测试方法， 并且`-run`支持赋值正则表达式，比如之前的例子：

```go
>go test -v -run="TestTable.*"
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

#### -args

`go test`允许我们传入自定义参数，一下两种方式都可以被接收：

```bash
go test -coverprofile=cover.out -args '-quiet=true'
go test -coverprofile=cover.out -quiet=true 
```

```go
var quiet = flag.Bool("quiet", false, "")

func TestMain(m *testing.M) {
	flag.Parse()
  fmt.Printf("quiet: %b", quiet)
}
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

还可以通过`-benchtime`选项来设置最短运行时间或运行次数：

```go
>go test -run="none" -bench="Bench*" -benchtime="100000x" // 设置最少运行次数
>go test -run="none" -bench="Bench*" -benchtime="3s"			// 设置最少运行时间
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
值得注意的是，Benchmark 测试会现执行一次，然后再从`i=0`依次递增进行处理，比如下面这段代码的输出，为`0 0 1 2 3 `而非`0 1 2 3 `：

```go
func BenchmarkTest(b *testing.B) {
	for i := 0; i < b.N; i++ {
		fmt.Printf("%d ", i)
		if i == 3 { panic("end") }
	}
}
```



## Mock

### 依赖注入

有些情况下我们的方法会依赖一些外部调用，比如数据库，HTTP请求等，这时候的单元测试就会形成对外部调用返回结果的依赖。我们可以先看一下下面的这个例子：

```go
type A struct{}

func (self *A) IsOne() bool {
	if r := Bar(); r == 1 {
		return true
	} else {
		return false
	}
}

func Bar() int {
	return rand.Intn(2)
}
```

```go
func TestMock(t *testing.T) {
	a := &A{}
	assert.Equal(t, true,a.IsOne())
}
```

`*A.greet()`方法会依赖函数`Bar()`的返回值来判断，而`Bar()`的返回值是随机的，所以在执行测试函数`TestGreet()`的时候不是幂等的。
我们可以对代码进行适当的修改以达到幂等的目的。比如将函数`Bar()`以参数方式传入：

```go
func (self *A) IsOne(f func() int) bool {...}
```

```go
	f1 := func() int { return 1 }
	f2 := func() int { return 2 }
	assert.Equal(t, true, a.IsOne(f1))
	assert.Equal(t, false, a.IsOne(f2))
```

如此一来我们变解决了对函数`Bar()`的依赖。而实际上我们更常见的情况是成员方式的调用，比如：

```go
type B struct{}

func (self *B) Bar() int {
	return rand.Intn(2)
}
```

```go
type A struct {
	b *B
}

func (self *A) IsOne() bool {
	if r := self.b.Bar(); r == 1 {
		return true
	} else {
		return false
	}
}
```

这是在很多项目中都很常见的一种情况，Service 直接将 Model 作为成员变量。这样就会又会遇到我们刚刚的问题，A 对  B 的依赖导致不太好编写单元测试。
解决这一问题的核心就是解开 A 和 B 的耦合，解耦利器**接口**可以帮助我们对代码进行简单修改：

```go
type Inf interface {
	Bar() int
}
type A struct {
	inf Inf
}

func (self *A) IsOne() bool {
	if r := self.inf.Bar(); r == 1 {
		return true
	} else {
		return false
	}
}
```

```go
type InfImpl struct{}

func (self *InfImpl) Bar() int {
	return 1
}

func TestMock(t *testing.T) {
	a := &A{inf: &InfImpl{}}
	assert.Equal(t, true, a.IsOne())
}
```

可以看到，通过`Inf`我们将`*A.greet()`方法的逻辑抽离了出来。然后利用对`Inf`接口的不同实现，我们可以控制`*A.greet()`方法的执行逻辑。这种方式也被称作为**依赖注入**(dependency injection，缩写为DI)。

目前有一些成熟的工具来帮助我们生成实现接口的方法，只需要我们自己设置入参和返回值，比如[GoMock](https://github.com/golang/mock)。首先我们安装工具：

```bash
go install github.com/golang/mock/mockgen
```

然后指定需要实现的接口作为数据源，并设置报名，然后生成文件：

```bash
mockgen -source=./mock_test.go -destination=./mock_info.go -package=tdd
```

执行命令后`GoMock`会为我们在`mock_info.go`中生成一个或多个结构体来实现`mock_test.go`中的接口。
然后我们可以直接在单元测试中使用：

```go
func TestMock(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockInf := NewMockInf(ctrl)
	mockInf.EXPECT().Bar().Return(1).AnyTimes()
	a := &A{inf: mockInf}

	assert.Equal(t, true, a.greet())
}
```

如果接口的方法需要入参，也可以基于入参数来设置返回值：

```go
mockInf.EXPECT().IsGood(gomock.Eq("zhangsan")).Return(true).AnyTimes()
```

我们还也自己实现`gomock`提供的`Matcher`来做一些判断，比如有些情况入参可能会有很多参数，但实际上我们只关心其中一个：

```go
type People struct {
	age int
}

type Inf interface {
	IsOldPerson(p *People) bool
}
```

```go
type gtAgeMatcher struct {
	age int
}

func newGtAgeMatcher(age int) *gtAgeMatcher {
	return &gtAgeMatcher{age: age}
}

func (self *gtAgeMatcher) Matches(x interface{}) bool {
	p, ok := x.(*People)
	if !ok {
		return false
	}
	if self.age < p.age {
		return true
	}

	return false
}

func (self *gtAgeMatcher) String() string {
	return fmt.Sprintf("age > %d", self.age)
}
```

```go
mockInf.EXPECT().IsOldPerson(newGtAgeMatcher(10)).Return(true).AnyTimes()
```



### HTTP

HTTP 请求的依赖在编程实践中也是比较常见的。下面是`http.CLient`的结构：

```go
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

其中最主要的就是`RoundTripper`接口，它提供了基本的 HTTP 服务：

```go
type RoundTripper interface {
	RoundTrip(*Request) (*Response, error)
}
```

简单来说，`RoundTripper`需要实现一个`RoundTrip`方法，接收一个`*http.Request`返回一个`*http.Response`。借此我们可以实现一个自己的`http.Client`来提供 Mock：

```go
type MockRoundTrip struct {}
func (self *MockRoundTrip) RoundTrip(req *http.Request) (*http.Response, error) {
	return &http.Response{
		StatusCode: 200,
    Body:       ioutil.NopCloser(bytes.NewBufferString([]byte("Test MockRoundTrip")])),
		Header:     make(http.Header),
	},nil
}

func NewMockHttpClient() *http.Client{
  return &http.Client{ Transport: MockRoundTrip }
}
```

当然我们可以在`MockRoundTrip`提供更多的 case，或者传入 case 来处理更多不同的情况。



## 测试覆盖率

通过`go test -cover`可以查看测试的覆盖率：

```bash
go test -cover
Start Test
PASS
coverage: 100.0% of statements
End Test
ok      hellogo/test    0.107s
```

默认情况下`go test`只会运行当前目录下的测试文件，可以在最后指定其他目录：

```bash
go test ./...		# 当前目录及所有子目录下的测试用例
```

通过以下命令可以将覆盖率信息保存到`cover.out`文件，然后再通过`cover`工具，可以查看当前包下各函数的覆盖率：

```bash
go install golang.org/x/tools/cmd/cover		# 安装cover工具
go test -v -coverprofile=cover.out
```

```bash
go tool cover -func=cover.out
hellogo/test/fib.go:3:  Fib             100.0%
total:                  (statements)    100.0%
```

通过`-html`选项会直接浏览器中打开测试内容的覆盖情况：

```bash
go tool cover -html=cover.out
```

```go
go test -run="$(pbpaste)" --coverprofile=cover.out && go tool cover -html=cover.out
```



## Example

除了标准的测试以外，还可以利用`go doc`支持的`Example`来进行测试：

```go
func ExamplePrintln() {
	fmt.Println("example!")
	// Output:
	// example!
}
```

```bash
$ go test -v -run='ExamplePrintln'      
=== RUN   ExamplePrintln
--- PASS: ExamplePrintln (0.00s)
PASS
ok      mydoc   0.361s
```

更多关于`Example`的内容可见[doc](#doc)的章节

# 环境配置

Windows环境和MacOS，Linux的设置环境变量稍有区别：

```bash
go env -w [环境变量名]=[环境变量值]							// Windows
export [环境变量名]=[环境变量值]								// MacOS,Linux
```

查看环境变量：

```bash
go env [环境变量名]													 // Windows
echo $[环境变了名]														 // MacOS，Linux
```

通常我们会将环境写入命令解释器的配置文件，比如zsh的配置文件在`~/.zshrc`。



## 环境变量

**GOROOT**
用于指定Go的安装路径。通常指定为`/usr/local/go`

**GOPATH**
指定项目的工作空间，在mod引入之前通过GOPATH指定的路径来管理一个项目，通常包含三个目录：

* `src` 保存源码
* `pkg` 保存引入的包，通过`go get`下载的包会被放在这个文件夹下
* `bin` 保存内建的可执行文件

**GOBIN**
指定通过`go install`命令安装的应用存放的目录。通常设置为`GOPATH/bin`

**GOPRIVATE** 
用来控制go命令执行时的识别指定的私有仓库，私有仓库将会跳过proxy server和检验检查。
可以通过逗号分隔开来填写多个值。

```bash
GOPRIVATE=*.4399.com,baidu.com/private
```

**GOPROXY**
从Go1.13开始，`GOPROXY`随着go module引入，用来控制go module的下载源。`GOPROXY`用于修改下载go相关数据的代理：

```bash
GOPROXY=https://goproxy.cn,direct
```

**GOSUMDB**
我们先试想一种情况：某项目的v1版本被很多其他很多项目引入，这个时候该项目在v1版本进行了新的修改，这样所有引入了该项目的其他项目在重新拉取依赖时，即使没有做过任何修改也会出现和原来不一致的情况。
为了解决以上问题， Go 加入了`go.sum`对下载的依赖进行校验。通过对 mod 的版本及所有文件进行 Hash 计算会得到一个校验值，一个公开 mod 的这个校验值都会存在 Checksum 数据库中，这个服务由 [sum.golang.org](https://sum.golang.org/) 提供。当我们通过 go 命令下载 mod 的时候，也会根据下载的版本及下载的所有文件去计算这个 mod 的校验值，并到 sum.golang.org 去校验 mod 内容是否有被篡改，从而保证 mod 的安全性。所以 Go 公开的 mod 即使很小的改动，都需要重新打 tag。

所以从Go1.13开始，`GOSUMDB`随着go module引入可以用来配置使用哪个校验服务器来做依赖包的校验：

```bash
GOSUMDB="sum.golang.google.cn"
```

也可以通过`GONOSUMDB`指定那些包不需要校验。



## **版本切换**

如果需要安装或者切换go版本，我们可以先到[官网](https://go.dev/dl/)下载系统对应的压缩包。比如我这里下载的是[go1.18.2.darwin-amd64.tar.gz](https://go.dev/dl/go1.18.2.darwin-amd64.tar.gz)`。然后将原来的go版本直接改名：

```bash
mv /usr/local/go /usr/local/go1.16
```

然后将压缩包解压到`/usr/local`，因为这里我`$GOROOT`的地址是`/usr/local/go`.

```bash
tar -xcf go1.18.2.darwin-amd64.tar.gz -C /usr/local
```

```bash
go version
go version go1.18.2 darwin/amd64
```

可以看到已经安装成功

# 工具

## 构建

### **go build**

Go提供的命令行工具`build`可包涵`main`函数的文件统计目录生成可执行文件。

修改环境变量可以生成不同平台的可执行程序：

```bash
GOOS=linux GOARCH=amd64 go build main
```

默认情况下编译器只会加载`main.go`文件，其他文件需要手动添加。`-o`参数可以指定生成的文件路径和文件名，其后的第一个用于指定生成的可执行文件名称：

```bash
go build -o ./lalala ./main.go ./utils.go
```

如果直接通过文件构建，可以生成同名的可执行文件：

```bash
go build lalala.go
```

甚至可以直接通过远程的 mod 来直接构建可执行文件：

```bash
go build github.com/google/wire/cmd/wire ./ && ls | grep wire
> wire
```

此外添加`-x`和`-v`参数可以输出构建时每一步执行的操作。



go1.18版本之后，在执行`go build`时会将版本信息嵌入到二进制文件当中。我们可以通过`go version -m [binaries]` 来查看具体信息：
```bash
$ go version -m /usr/local/bin/gmfs
/usr/local/bin/gmfs: go1.20.2
	path	github.com/Dokiys/gmfs/cmd/gmfs
	mod	github.com/Dokiys/gmfs	v0.2.0	h1:cfrv2a4sQDajtKBSfwosFzwfQjMXCWoJk9NRt4ozvpM=
	build	-buildmode=exe
	build	-compiler=gc
	build	CGO_ENABLED=1
	build	CGO_CFLAGS=
	build	CGO_CPPFLAGS=
	build	CGO_CXXFLAGS=
	build	CGO_LDFLAGS=
	build	GOARCH=arm64
	build	GOOS=darwin
```



### go install

`install`和`build`很相似，区别在于其构建的可执行文件会直接放在`$GOPATH/bin`目录下，可被全局调用。



### go run

相较于`build`，` run`命令也会编译源码，并执行源码的`main()`函数，但是不会在当前目录留下可执行文件。并且也可以直接运行远程的文件。

```go
go run github.com/google/wire/cmd/wire     
wire: app: wrote XXX/wire_gen.go
```



### go clean

`clean`可以用于清理`build`命令生成的文件，添加`-i`选项，可以将`install`命令在`$GOPATH/bin`目录下生成的文件一并删除。

`-x`参数可以打印出执行的命令：

```bash
$ go clean -x
cd /Users/XXX/XXX/go_test/my/royalpoker
rm -f royalpoker royalpoker.exe royalpoker royalpoker.exe royalpoker.test royalpoker.test.exe royalpoker.test royalpoker.test.exe handler handler.exe hub hub.exe local_player local_player.exe local_player.test local_player.test.exe local_player_test local_player_test.exe main main.exe msg msg.exe player player.exe
```





### 构建约束

在 go 编译时，我们可以设置一些条件来指定满足条件的文件才被编译，不满足条件的则舍去。目前支持的构建约束方式有两种：通过文件名后缀，以及在文件中添加编译标签（build tag）。

**文件名后缀**
文件名后缀需要满足以下格式：

```
filename_$GOOS.go
filename_$GOARCH.go
filename_$GOOS_$GOARCH.go
```

比如 Go 源码中的 os 包中的 Linux，Windows 实现：

```
src/runtime/os_linux.go
src/runtime/os_linux_arm.go
src/runtime/os_linux_arm64.go
src/runtime/os_windows.go
src/runtime/os_windows_arm.go
src/runtime/os_windows_arm64.go
```

**build tag**
通过在文件顶部添加注释来设置构建条件，目前有两种写法：

```go
// 1.17以前版本
// 空格表示：AND; 逗号表示：OR; !表示：NOT; 换行表示：AND
// +build <tag>
```

```go
// 1.17及以后
// && 表示AND; || 表示OR; ! 表示NOT; () 表示分组
//go:build <tag>		
```

在`tag`中可以指定一下内容：

* 操作系统，即环境变量中GOOS的值；
* 操作系统的架构，即环境变量中GOARCH的值
* 使用的编译器，比如 gc 或者 gccgo；
* 其他自定义标签；
* 枚举值`ignore`，指定该文件不参与编译；

对于自定义的标签，可以在`go build`的时候，添加`-tags`参数来设置筛选：

```bash
go build -tags <tag...> 
```



## vet

Go 中自带的静态分析工具，用来检查一些代码中的错误。

```bash
go vet gen.go
```



## mod

`mod`是1.11版本引入的官方包管理工具，相较于之前的`GOPATH`的引入方式，更具简洁。
`Gomod`引入依赖的方式很简单，首先需要使用`go mod init`进入到项目根目录对项目进行初始化：

```bash
go mod init [项目名]
```

初始化完成后，会在目录下生成一个`go.mod`的文件来记录依赖。
此时需要再引入外部工具包的话，可以直接在`go.mod`的同级目录执行：

```bash
go get [包名]
```

`go get`会下载并缓存最新的版本，也可以指定特定的版本。如果引入的包较多，还可以直接更改`go.mod`文件，然后运行`go mod tidy`，来自动下载依赖。以下是一个修改过的简单示例：

```go
module go_test
go 1.16

require (
	github.com/xuri/excelize/v2 v2.4.2-0.20211201164820-4ca1b305fe5b
  golang.org/x/crypto v0.0.0-20210921155107-089bfa567519 // indirect
	golang.org/x/text v0.3.7 // indirect
	gopkg.in/yaml.v2 v2.4.0
)
```

其中包含了被注释了`// indirect`的间接引入的包。
如果引入的包符合`gomod`的命名规范，将会附带版本号，如`gopkg.in/yaml.v2 v2.4.0`。
否则就会自动生成一个版本号其中包含提交时间和提交的hash值，如：`golang.org/x/crypto v0.0.0-20210921155107-089bfa567519 // indirect`
**值得注意的是：**修改`go.mod`文件然后执行`go mod tidy`更新依赖的方式如果遇到存在同一个间接引入的依赖需要不同版本时会抛出错误。这时候可以通过`go get`来更新间接引入的依赖。

**引用分支**

`mod`还可以指定引入依赖的分支，如上引入的`github.com/xuri/excelize/v2 v2.4.2-0.20211201164820-4ca1b305fe5b`包，则是指定了分支的结果。在执行`go mod tidy`之前，`go.mod`文件的该行内容为：

```go
github.com/xuri/excelize/v2 master
```

**引用本地包**

通过在`go.mod`中指定`replace`可以将某依赖，替换为另外的依赖，以实现引入本地已经通过`go mod init`包：

```go
module go_test
go 1.16

require (
	gopkg.in/yaml.v2 v2.4.0
)
replace gopkg.in/yaml.v2 v2.4.0 => [本地mod包]
```

常用的关于`mod`的命令：

```bash
# 列出当前项目包名以及所有依赖到的包
go list -m all
# 清除已经下载的包
go clean -modcache
```



### go work

go 自1.18版本后引入了`workspace`的概念，可以简单理解为是将原来`go.mod`中需要临时替换本地库的`replace`找了一个新家。比如，之前我们需要临时使用本地包，需要修改`go.mod`：

```
module workspace

go 1.18

require golang.org/x/example v0.0.0-20220412213650-2e68773dfca0

// 临时替换
replace golang.org/x/example v0.0.0-20220412213650-2e68773dfca0 => ./example
```

这样会导致对`go.mod`的反复修改，`workspace`通过在`go.work`文件中编写原来的`replace`语句以此来保证`go.mod`的正确性。我们仍然可以不对`go.mod`进行任何改变：

```
module workspace

go 1.18

require golang.org/x/example v0.0.0-20220412213650-2e68773dfca0
```

然后通过在`go.mod`文件的同级目录执行`go work init `来创建一个`workspace`，这条命令会自动为我们创建一个`go.work`文件，我们需要为我们的`workspace`指定包含的包。（go 在1.15以后使用`go.mod`来表示一个包）我们可以直接执行`go use .`来指定这个`workspace`包含当前路径下的`go.mod`文件。

然后指定`golang.org/x/example`替换为我们本地的包：

```
go 1.18

use .

// 临时替换
replace golang.org/x/example v0.0.0-20220412213650-2e68773dfca0 => ./example
```

这样就可以使用本地的包进行调试了。

在这个示例里面如果`./example/go.mod`中的`module`名就是`golang.org/x/example`，我们也可以直接使用`go work use ./exmple`命令来指定，执行后`go.work`文件的内容如下：

```
go 1.18

use (
	.
	./example
)
```

当我们不需要再使用本地的包时，直接删除掉`go.work`的文件，一切就恢复了原状。



## generate

`go generate`默认会扫描当前目录包下添加了`//go:generate`注释的文件，然后运行设置的命令。这通常和一些工具配合生成一些代码或者相关文件。比如我们有一下文件：

```go
//go:generate touch 1.txt
//go:generate touch 2.txt

package main

func main() {}
```

我们在同级目录执行：

```bash
go generate
```

将会生成`1.txt`及`2.txt`两个文件。当然我们也可以用以下方式指定目录下的所有文件：

```bash
go generate ./...
```



## godoc

`godoc`也是官方提供的工具之一，可以根据项目生成对应的文档。使用之前需要先安装这个工具：

```bash
go install golang.org/x/tools/cmd/godoc@latest
```

然后通过如下命令即可启动一个http的文档服务，然后访问`localhost:6060`即可：

```bash
godoc -http=localhost:6060
```

关于生成的文档又一些规则，比如

* 在当前目录下任意go文件的`package`上面**一行**写的注释会被生成为`Overview`。如果在多个文件中都写了包注释，则会有冲突。通常会专门用一个名为`doc.go`的文件来写关于这个项目的`Overview`
* 包下的函数，结构体等，都会被生成到`Index`中
* 如果为函数或者结构体编写了`example`函数，则会在文档对应的函数或者结构体中也生成`Example`

**Example**

编写`Example`函数的文件名需要以`_test.go`为后缀，并且包名为`{PackageName}_test`。需要作为例子展示的函数需要以`Example`为函数名前缀。下面是一个简单的例子：

```go
package mydoc_test

import (
	"fmt"

	"mydoc"
)

func ExampleVersion() {
	mydoc.Version()
	// Output:
	// v1.0.0
}
```

这个`Example`函数将会被生成到`mydoc`到`Version`函数下。并且这个函数是可以被测试的：

```bash
$ go test -v -run='ExampleVersion'  
```

测试的结果是将这里结尾的`Output:`以下的注释内容与`ExampleVersion()`这个函数执行时的输出进行比较。如果完全一致才会通过测试。
除此之外还可以为结构体的方法添加`Example`，名称需要遵循格式：`Example{StructName}_{MethodName}`：

```go
func ExampleStu_Study() {
	stu := mydoc.Stu{Name: "zhangsan"}
	fmt.Println(stu.Code())
	stu.Study()
	fmt.Println(stu.Code())
	// Output:
	// 0
	// 1
}
```



## golangci-lint

golangci-lint 集成了各种go语言的静态检测工具，包括语法检测（lint），注释风格（style），错误处理（bugs），圈复杂度(cyclop)等各种工具。可以通过以下命令安装：

```bash
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

安装后可以通过`golangci-lint linters `查看开启配置的检查器。运行目录下文件名为`.golangci.yml`的文件可以被读取为配置。配置内容可以参考[这里](https://golangci-lint.run/usage/configuration/)。



## Web Go Playground

go官网提供了[运行环境](https://go.dev/play/)，且可以生成链接用于分享代码片段。



# 项目结构示例

小型项目：

```bash
tms
├── cmd
├── internal
├── pkg
└── README.md
```

大型项目：

```bash
├── api                     # 当前项目对外提供的各种不同类型的 API 接口定义文件
│   ├── openapi
|   ├── protobuf-spec
|   ├── thrift-spec
|   ├── http-spec
│   └── swagger
|       ├── docs/
|       ├── README.md
│       └── swagger.yaml
├── assets                  # 项目的其他资源 (图片、CSS、JavaScript 等）
├── build                   # 安装包和持续集成相关的文件
│   ├── ci                  # CI（travis，circle，drone）的配置文件和脚本
│   ├── docker              # 子项目各个组件的 Dockerfile 文件
│   │   ├── iam-apiserver
│   │   ├── iam-authz-server
│   │   └── iam-pump
│   └── package              # 容器（Docker）、系统（deb, rpm, pkg）的包配置和脚本
├── CHANGELOG                # 更新记录，方便了解当前版本的更新内容或者历史更新内容
|                            #     可结合 Angular 规范 和 git-chglog 来自动生成
├── cmd       # 统一存放组件 main 函数所在目录，不存放过多代码
|   |                        #     其下的目录名与可执行文件名一致 
│   ├── iam-apiserver
│   │   └── apiserver.go
│   ├── iam-authz-server
│   │   └── authzserver.go
│   ├── iamctl
│   │   └── iamctl.go
│   └── iam-pump
│       └── pump.go
├── configs                  # 配置文件模板或默认配置，不携带敏感信息（占位符替代）
├── CONTRIBUTING.md          # 说明如何贡献代码，如何开源协同等
|                            #     用于规范协同流程、降低第三方开发者贡献代码的难度
├── deploy                   # Iaas、PaaS 系统和容器编排部署配置和模板
├── docs                     # 设计文档、开发文档和用户文档等（除了 godoc 生成的文档）
│   ├── devel                # 开发文档、hack 文档等
│   │   ├── en-US
│   │   └── zh-CN
│   ├── guide                # 用户手册，安装、quickstart、产品文档等
│   │   ├── en-US
│   │   └── zh-CN
│   ├── images               # 图片文件
│   └── README.md
├── examples                 # 应用程序或者公共包的示例代码
├── githooks
├── go.mod
├── go.sum
├── init                     # 初始化系统（systemd，upstart，sysv）、进程管理配置文件（runit，supervisord）
├── internal                 # 私有应用和库代码，在被尝试引入时编译会报错
│   ├── apiserver            # 应用目录，包含应用程序实现代码。
│   │   ├── c
│   │   │   └── v1           # HTTP API 具体实现，实现请求解包、参数校验、业务逻辑处理、返回。
|   |   |       |            #     业务逻辑较轻，复杂的建议放到 /internal/apiserver/service 下
│   │   │       └── user
│   │   ├── apiserver.go
│   │   ├── options
│   │   ├── service
│   │   ├── store            # 与数据库交互、持久化代码
│   │   │   ├── mysql
│   │   │   └── fake
│   │   └── testing
│   ├── iamctl               # 客户端工具
│   │   ├── cmd
│   │   │   ├── completion
│   │   │   └── user
│   │   └── util
│   └── pkg                  # 项目内可共享，项目外不共享的包
|       |                    #     准备对外开发时再转存到 /pkg
│       ├── code             # 项目业务 Code 码
│       ├── options
│       ├── server
│       ├── util
|       ├── middleware       # HTTP 请求处理链
│       └── validation       # 通用的验证函数
├── LICENSE                  # 版权文件，可以是私有或开源
├── Makefile                 # 执行静态代码检查、单元测试、编译等功能
|                            #     gen -> format -> lint -> test -> build
├── _output                  # 编译输出的二进制文件
│   └── platforms
│       └── linux
│           └── amd64
├── pkg                      # 可被外部应用使用的代码（import），需要慎重
│   └── util
│       └── genutil
├── README.md                # 项目介绍、功能、快速安装和使用指引、详细文档链接、开发指引等
├── scripts                  # 脚本文件，实现构建、安装、分析等不同功能
│   ├── lib                  # 执行自动化任务 shell 的脚本，发布、更新文档、生成代码等
|   |   ├── util.sh
|   |   └── logging.sh
|   ├── install              # 复杂的自动化部署脚本
│   └── make-rules           # 实现 /Makefile 文件中的各个功能
├── test                     # 其他外部测试应用和测试数据
│   └── data                 # 需要 Go 忽略该目录中的内容时使用
├── third_party              # 外部帮助工具，分支代码或其他第三方应用，比如 Swagger
│   └── forked               #     fork 并作改动的第三方包，便于与 upstream 同步
├── tools                    # 项目的支持工具。可导入来自 /pkg 和 /internal 的代码
├── vendor                   # 项目依赖，可通过 go mod vendor 创建
|                            #     对于 Go 库不要提交 vendor 依赖包
├── website                  # 如不使用 GitHub 页面，可在此放置项目网站相关的数据
└── web       # 前端代码，主要是静态资源，服务端模板和单页应用（SPAs）
```

