# The Show Go On

## 循环依赖

绝大部分循环依赖都是设计的问题。设计结构时一定要仔细考虑代码应该放的位置。
当遇到一些没办法重新组织结构的情况，可以考虑一下方法：

1. 提取共用**方法**到单独的包中

2. 将使用到循环依赖的方法中对循环依赖包中**函数**的调用提取成参数传入：

   ```go
   func Hello(arg1 int, f func(int)){
     f(arg1)
   }
   ```

3. 将循环依赖的**函数**所对应的结构体或类型作为调用结构体的成员：

   ```go
   type A struct {
   	b B
   }
   
   func (self *A) Add(s int) (int) {
   	return self.b.Add(s)
   }
   ```



## 命令行

### 命令行管道符输入

```go
var v1 = flag.String("v1", "init_value", "参数1")
var v2 = flag.int("v2", 0, "参数2")

func main() {
	flag.Parse()
	if *v1 != "init_value" {
		doSomething(*v1, *v2)
		return
	}

  // 不断的从控制台接收输入
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		*v1 = scanner.Text()
		doSomething(*v1, *v2)
	}
}
```




### 执行命令行

通过`exec`包可以在go中执行命令行命令：

```go
var cmdOut, cmdErr bytes.Buffer
command := "ls"
args := []strings{"-a"}

cmd := exec.Command(command, args...)
cmd.Stdout = &cmdOut
cmd.Stderr = &cmdErr

err := cmd.Run()
if err != nil {
  return errors.Wrapf(err, "%s", cmdErr.String())
}

fmt.Println(cmdOut)
```

此外，通过`context`还可以添加超时时间：

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
command := "top"
args := []string{"-n", "3"}

cmd := exec.CommandContext(ctx, command, args...)
//... 略
```



## Job

反射执行方法：

```go
type Worker struct {}
```

```go
func (self *Worker)HelloJob() bool {
  log.Info("Hello Work!")
	return true
}
```

```go
// 通过flag获取选项参数
var mStr string

//  https://pkg.go.dev/flag
flag.StringVar(&mStr, "m", "", "执行方法名")
flag.Parse()

// 反射获取对应方法
workerValue := reflect.ValueOf(&worker.Worker{})
m := workerValue.MethodByName(mStr)
if !m.IsValid() {
  panic("Method Not Found!")
}

// 执行方法
value := m.Call([]reflect.Value{})
ok := value[0].Bool()
if ok {
  print("OK!")
}
```

```go
go run dojob.go -m "HelloJob"
```



## 切片去重

通过反射实现任意类型的切片去重：

```go
func DistinctBy(s interface{}, f interface{}) interface{} {
	return distinct(s, f)
}

func Distinct(s interface{}) interface{} {
	return distinct(s, func(v interface{}) interface{} { return v })
}

func distinct(s interface{}, f interface{}) interface{} {
	sv := reflect.ValueOf(s)
	l := sv.Len()

	// 利用map去重
	m := make(map[interface{}]struct{}, l>>1)
	fv := reflect.ValueOf(f)
	iSlice:= make([]reflect.Value, 0, l>>1)
	for i := 0; i < l; i++ {
		v := sv.Index(i)
		k := fv.Call([]reflect.Value{v})[0].Interface()
		if _, ok := m[k]; ok {
			continue
		}
		m[k] = struct{}{}
		iSlice = append(iSlice, v)
	}
	res := reflect.MakeSlice(reflect.TypeOf(s), len(iSlice), len(iSlice))
	res = reflect.Append(res, iSlice...)

	return res.Interface()
}
```



## Builder Pattern

建造者模式通常用于复杂对象的构建，可以隐藏掉大量的构建函数代码，使实际的逻辑代码更简洁。

```go
type Student struct {
	Id    int
	Name  string
	Email string
}
```

```go
type StudentBuilder struct {
	student *Student
}

func Init() *StudentBuilder {
	return &StudentBuilder{
		student: &Student{
			Id:    0,
			Name:  "",
			Email: "",
		},
	}
}

func (self *StudentBuilder)Id(id int) *StudentBuilder {
	self.student.Id = id
	return self
}

func (self *StudentBuilder)Name(name string) *StudentBuilder {
	self.student.Name = name
	return self
}

func (self *StudentBuilder)Email(email string) *StudentBuilder {
	self.student.Email = email
	return self
}

func (self *StudentBuilder)Build() Student {
	return *self.student
}
```

```go
func TestBuilder(t *testing.T) {
	stu := Init().Id(1).Name("zhangsan").Email("zhangsan@4399.com").Build()
	t.Logf("Student: %v", stu)
}
```



还有一种此模式上的演变，经常使用在配置的加载中。其中添加了Opt作为配置项参数作为构建的抽象：

```go
type Student2 struct {
	Id    int
	Name  string
	Email string
}

type StudentBuilder2 struct {
	student *Student2
	opts     []Opt
}

type Opt func(*StudentBuilder2)
```

```go

func Init2() *StudentBuilder2 {
	return &StudentBuilder2{
		student: &Student2{
			Id:    0,
			Name:  "",
			Email: "",
		},
		opts:    []Opt{},
	}
}

func (self *StudentBuilder2) Id(id int) *StudentBuilder2 {
	self.opts = append(self.opts, func(builder *StudentBuilder2) {
		builder.student.Id = id
	})
	return self
}

func (self *StudentBuilder2) Name(name string) *StudentBuilder2 {
	self.opts = append(self.opts, func(builder *StudentBuilder2) {
		builder.student.Name = name
	})
	return self
}

func (self *StudentBuilder2) Email(email string) *StudentBuilder2 {
	self.opts = append(self.opts, func(builder *StudentBuilder2) {
		builder.student.Email = email
	})
	return self
}

func (self *StudentBuilder2) Build() Student2 {
	for _, opt := range self.opts {
		opt(self)
	}
	return *self.student
}
```

```go
func TestBuilder2(t *testing.T) {
	stu := Init2().Id(1).Name("zhangsan").Email("zhangsan@4399.com").Build()
	t.Logf("Student: %v", stu)
}
```



引入

```go
package data

import (
	"path/filepath"
	"runtime"
)

// basepath is the root directory of this package.
var basepath string

func init() {
	_, currentFile, _, _ := runtime.Caller(0)
	basepath = filepath.Dir(currentFile)
}

// Path returns the absolute path the given relative file or directory path,
// relative to the google.golang.org/grpc/examples/data directory in the
// user's GOPATH.  If rel is already absolute, it is returned unmodified.
func Path(rel string) string {
	if filepath.IsAbs(rel) {
		return rel
	}

	return filepath.Join(basepath, rel)
}
```

