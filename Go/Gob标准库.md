# Go标准库

## Build-in Functions

在Go语言源码[]提供了一些不需要导入便可直接调用的函数。就如同`true`/`false`，`iota`等内置的常量，甚至`nil`也属于Go语言内置的变量：

```go
var nil Type // Type must be a pointer, channel, func, interface, map, or slice type
```

Go语言提供的内置函数如下：

```go
func print(args ...Type)  												// 输出参数
func println(args ...Type)   											// 输出参数并换行
func new(Type) *Type															// 分配某类型的内存，并返回指向该内存的指针
func make(t Type, size ...IntegerType) Type				// 分配slice, map或者chan的内存
func len(v Type) int															// 可以返回String、Array、Slice、Chan、Map的长度
func delete(m map[Type]Type1, key Type)						// 用于删除map中的某个键值对
func append(slice []Type, elems ...Type) []Type		// 添加切片元素
func copy(dst, src []Type) int										// 复制切片
func close(c chan<- Type)													// 关闭通道
func complex(r, i FloatType) ComplexType					// 创建复数
func real(c ComplexType) FloatType								// 获取复数实部
func imag(c ComplexType) FloatType								// 获取复数虚部
func panic(v interface{})													// 停止当前goroutine的执行
func recover() interface{}												// 处理被panic的goroutine，返回panic传入的参数
```

示例：

```go
type A struct{}

func TestInnerMethod(t *testing.T) {
	// Map
	ma := make(map[int]*A, 2)
	ma[1] = new(A)
	delete(ma, 1)
	print(len(ma))

	// Slice
	var s2 []A
	s1 := make([]A, 2)
	s1 = append(s1, A{})
	print(len(s1))
	println(cap(s1))
	copy(s2, s1)

	// Chan
	ch := make(chan int)
	close(ch)

	// Complex
	c := complex(1,2)
	println(real(c))
	println(imag(c))

	// Panic
	defer recover()
	panic("breakdown!")
}
```

