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




## 执行命令行

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
flag.StringVar(&mStr, "m", "", "执行方法名") // 定义可接受的选项
flag.Parse()	// 解析命令行选项到指定的参数中

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



