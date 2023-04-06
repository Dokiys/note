# Go程序的测试与dlv调试

## Test

问题是这样产生的：  
在某个`pakage`内有很多的文件，并提供了单元测试。但后来发现这些文件共同使用的某个函数，我们暂时称为`Common()`，需要添加一个额外的参数，于是`Common()`变为`Common(id string)`。也就是说，此时所有调用`Common()`的地方都会因为新函数`Common(id string)`缺少传参而编译错误。  
然而此时，我并没有十足的把握修改后的公共函数可以让程序正确的运行。所以我想先修改某处调用，并进行测试，如果运行符合预期，则在将其余所有调用修改，以避免`Common(id string)`仍然为错误的情况下，重复做了许多不必要的工作。

但我通常使用`Goland`作为开发工具。但是似乎它内置的单元测试工具，并不能指定单独的文件进行测试，而总是以测试函数所在文件的目录作为运行的单元。也就是说，那些还未修改的地方会使得测试无法编译通过。

目前我遇到的这种情况下，我可以保留原来的`Common()`函数，并复制一个`Common2(id string)`，来避免编译错误。但是我并不想这么做。因为如果这是一个有接收者的方法，那么我需要修改的内容则会比较多，可能会造成不必要的错误。所以我打算使用`go test`来进行测试。`go test`可以指定测试的文件，以及方法。所以我只需要指定相关的文件即可，就像下面这样：

```bash
go test -run="TestCallCommon" main_test.go common.go call_common.go call_common_test.go
```

果然，程序依然有问题，并且通过错误信息，难以判断出原因。我希望能够对这个测试方法进行逐行调试，以便找出问题所在。

## dlv Debug

我选择了使用[`dlv`](https://github.com/go-delve/delve)来进行调试。

```bash
go install github.com/go-delve/delve/cmd/dlv@latest
```

```bash
dlv test -run="TestCallCommon" main_test.go common.go call_common.go call_common_test.go
Type 'help' for list of commands.
```

注意，这里因为是对测试方法进行调试，所以使用的`dlv test`。如果是对主程序进行调试应当使用`dlv debug`

```bash
(dlv) b call_common_test.go:7		# b 添加断点
Breakpoint 1 set at 0x10485b9ec for command-line-arguments.TestCallCommon.func1() ./call_common_test.go:7
```

```bash
(dlv) c		# c 开始运行直到下一个断点，或者程序结束
start 907244000
> command-line-arguments.TestCallCommon.func1() ./call_common_test.go:7 (hits goroutine(35):1 total:1) (PC: 0x10485b9ec)
     2: 
     3: import "testing"
     4: 
     5: func TestCallCommon(t *testing.T) {
     6:         t.Run("dlv debug", func(t *testing.T) {
=>   7:                 Common("123")
     8:         })
     9: }
```

```bash
(dlv) s		# s 单步执行
> command-line-arguments.Common() ./common.go:3 (PC: 0x10485b8bc)
     1: package src
     2: 
=>   3: func Common(id string) {
     4:         println(id)
     5: }
```

```bash
(dlv) p id	# p 打印某参数的值
"123"
```

```bash
(dlv) so	# so 结束当前方法
123
> command-line-arguments.TestCallCommon.func1() ./call_common_test.go:8 (PC: 0x10485b9fc)
Values returned:

     3: import "testing"
     4: 
     5: func TestCallCommon(t *testing.T) {
     6:         t.Run("dlv debug", func(t *testing.T) {
     7:                 Common("123")
=>   8:         })
     9: }
```

```bash
(dlv) r		# r 重新执行调试
Process restarted with PID 18993
```

```bash
(dlv) n		# n 执行下一行内容（不会进入方法）
123
> command-line-arguments.TestCallCommon.func1() ./call_common_test.go:8 (PC: 0x104a6f9fc)
     3: import "testing"
     4: 
     5: func TestCallCommon(t *testing.T) {
     6:         t.Run("dlv debug", func(t *testing.T) {
     7:                 Common("123")
=>   8:         })
     9: }
```



## Goland Remote Debug

通过`--headless `选项可以仅启动`debug server`，然后我们可以通过Goland的远程链接，进行远程调试。现在我们的代码如下：

```go
package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/render"
)

func main() {
	r := gin.Default()

	r.GET("/", handler)
	if err := r.Run(":" + os.Args[1]); err != nil {
		panic(err)
	}
}

func handler(c *gin.Context) {
	c.Render(http.StatusOK, render.Data{
		ContentType: "text/plain; charset=utf-8",
		Data:        []byte("ok"),
	})
}
```

在启动`debuge server`之前，我们需要先编译。值的注意的是我们需要禁用编译优化：

```bash
go build -gcflags "all=-N -l" -o dlv_test .
```

然后通过以下命令启动：

```bash
dlv --listen=:2345 --headless=true --continue --api-version=2 --accept-multiclient exec dlv_test -- ':8080'
```

这里的其他参数可以通过`dlv -h`来查看；`--`之后的参数将会被传入到`dlv_test`程序中。

此时`dlv server`已经启动起来了，我们需要在Goland中链接并进行调试。打开`Run => Edit Configurations... => ➕ [Go Remote] `然后设置Host即可。然后就可以像本地打断点一样，`GET`请求`localhost:8080/`直接调试即可。

