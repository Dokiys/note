# DiagnosticsGo

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

## Debug

### dlv 

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



### Goland Remote Debug

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

## Profilling

### CPU

Go中提供了`pprof`工具来监控和分析应用程序运行时的资源消耗情况。我们可以通过下面这个计算斐波那契数列的函数来感受一下：

```go
func fib(n int) int {
	if n <= 1 {
		return n
	}

	return fib(n-1) + fib(n-2)
}
```

最常见的监控维度是 CPU 的使用情况和堆内存的使用情况。

先以 CPU 为例，我们需要监控运行程序一段时间内 CPU 是如何被分配的，所以需要确定检测的范围，然后将检测的信息输出。比如：

```go
func main() {
  PprofCPU()
}

func PprofCPU() {
	f, _ := os.OpenFile("fib.profile", os.O_CREATE|os.O_RDWR|os.O_TRUNC, 0644)
	defer f.Close()
	if err := pprof.StartCPUProfile(f); err != nil {
		fmt.Printf("could not start CPU profile: %s", err)
	}
	defer pprof.StopCPUProfile()

	n := 10
	for i := 1; i <= 5; i++ {
		fmt.Printf("fib(%d)=%d\n", n, fib(n))
		n += 3 * i
	}
}
```

我们从`PprofCPU()`开始时监控，并循环调用了多次`fib()`函数，然后在执行完之后结束。然后我们运行这个程序，为了避免编译器的一些影响，我们可以在运行时添加一个选项：

```bash
$ go run -gcflags "all=-N -l" main.go
```

完成后，将会生成一个文件`fib.profile`，该文件包含了刚才我们运行的代码 CPU 使用情况的信息。通过Go提供的工具`pprof`，我们可以进行查看：

```bash
$ go tool pprof fib.profile
Type: cpu
Time: Apr 20, 2023 at 1:52pm (CST)
Duration: 606.27ms, Total samples = 450ms (74.22%)
Entering interactive mode (type "help" for commands, "o" for options)
```

`top`命令可以查看到具体信息：

```bash
(pprof) top
Showing nodes accounting for 450ms, 100% of 450ms total
      flat  flat%   sum%        cum   cum%
     450ms   100%   100%      450ms   100%  main.fib
         0     0%   100%      450ms   100%  main.PprofCPU
         0     0%   100%      450ms   100%  main.main
         0     0%   100%      450ms   100%  runtime.main
```

`flat`和`flat%`分别表示函数在 CPU 上运行的时间以及百分比；`sum%`是当前函数所使用 CPU 的占例；`cum(cumulative)`和`cum%`代表这个函数以及子函数运行所占用的时间和占例，应该大于等于前两列的值；最后一列是函数的名字。
此外可以使用`help`查看更多的命令帮助。

如果想要通过图形化的方式来查看比如`png`、`web`等命令，需要安装`graphviz`工具：

```bash
brew install graphviz
```

### Heap

然后再让我们来通过`pprof`观察一下堆的使用。在此之前我们需要对原来的程序进行简单的更改，之前的`fib()`函数都是在栈上使用参数进行计算，现在我们可以直接在全局创建两个数组，来保存每一项斐波那契数列的值：

```go
var s = make([]int, 0)
var s1 []int

func fib2(n int) int {
	s = append(s, n)
	s1 = append(s1, n)
	if n <= 1 {
		return n
	}

	return fib2(n-1) + fib2(n-2)
}
```

观察堆的使用和之前稍有不同，我们通常只需要观察某一个时刻堆上使用的内存信息。所以记录程序堆的使用情况不需要`close()`，不过需要注意的是我们需要在记录前，手动进行一次垃圾回收以保证我们记录到的数据准确。此外在下面的程序中，我们提前对`s1`进行了合适的内存分配，对于`s`则是通过`append()`在`fib2()`中动态分配，我们之后可以看到其中的差别：

```go
func main() {
	if os.Args[1] == "CPU" {
		PprofCPU()
	} else if os.Args[1] == "heap" {
		PprofHeap()
	}
}

func PprofHeap() {
	s1 = make([]int, 0, 29954739)

	n := 5
	for i := 1; i <= 5; i++ {
		fmt.Printf("fib2(%d)=%d\n", n, fib2(n))
		n += 3 * i
	}

	runtime.GC() // get up-to-date statistics
	f, _ := os.OpenFile("fib_heap.profile", os.O_CREATE|os.O_RDWR|os.O_TRUNC, 0644)
	defer f.Close()
	if err := pprof.WriteHeapProfile(f); err != nil {
		fmt.Printf("could not write heap profile: %s", err)
	}
}
```

```bash
$ go run -gcflags "all=-N -l" main.go heap
$ go tool pprof fib_heap.profile
Type: inuse_space
Time: Apr 20, 2023 at 2:16pm (CST)
Entering interactive mode (type "help" for commands, "o" for options)
```

```bash
(pprof) top
Showing nodes accounting for 458.02MB, 100% of 458.02MB total
      flat  flat%   sum%        cum   cum%
  229.48MB 50.10% 50.10%   229.48MB 50.10%  main.fib2
  228.54MB 49.90%   100%   458.02MB   100%  main.PprofHeap
         0     0%   100%   458.02MB   100%  main.main
         0     0%   100%   458.02MB   100%  runtime.main
```

可以看到，在`main.PprofHeap()`中分配了`228.54MB`的内存，在`main.fib2()`中分配了`229.48MB`的内存。此时如果分别输出`s`和`s1`的容量，就会发现，动态创建的`s`的容量大于`s1`：

```
cap(s): 	 30078976
cap(s1): 	 29954739
```



除了命令行界面的方式，还可以通过`-http`选项，部署http服务通过浏览器来查看：

```bash
go tool pprof -http=:8081 fib_heap.profile
```

此外，除了堆`pprof`还可以通过`pprof.Lookup()`对以下内容进行分析：

```
//	goroutine    - stack traces of all current goroutines
//	heap         - a sampling of memory allocations of live objects
//	allocs       - a sampling of all past memory allocations
//	threadcreate - stack traces that led to the creation of new OS threads
//	block        - stack traces that led to blocking on synchronization primitives
//	mutex        - stack traces of holders of contended mutexes
```

### HTTP

http也是常见的服务提供方式之一，GO官方提供的`"net/http/pprof"`包，可以让我们很方便的对http服务进行诊断。但是首先我们需要将我们的测试程序改写成http服务：

```go
func main() {
	if os.Args[1] == "cup" {
		PprofCup()
	} else if os.Args[1] == "heap" {
		PprofHeap()
	} else if os.Args[1] == "http" {
		PprofHttp()
	}
}

func PprofHttp() {
	http.HandleFunc("/fib", func(w http.ResponseWriter, r *http.Request) {
		n := r.URL.Query().Get("n")
		i, _ := strconv.Atoi(n)
		w.Write([]byte(fmt.Sprintf("fib(%d)=%d\n", i, fib(i))))
	})
  http.HandleFunc("/fib2", func(w http.ResponseWriter, r *http.Request) {
		n := r.URL.Query().Get("n")
		i, _ := strconv.Atoi(n)
		w.Write([]byte(fmt.Sprintf("fib2(%d)=%d\n", i, fib2(i))))
	})
	http.ListenAndServe(":8080", nil)
}
```

然后我们需要通过下划线的方式强制引入`_ "net/http/pprof"`包，并启动该服务：

```bash
go run -gcflags "all=-N -l" main.go http
```

该包的引入会在`http://localhost:8080/debug/pprof`路径下提供一些列用于检索性能分析处理程序的 URL。

`go tool pprof`支持对这些URL进行性能分析，所以我们可以使用原来的方式来查看程序的资源使用情况：

```bash
go tool pprof http://localhost:8080/debug/pprof/heap
```

查看CPU使用则需要指定一个时间：

```bash
go tool pprof -seconds 10 http://localhost:8080/debug/pprof/profile
go tool pprof http://localhost:8080/debug/pprof/profile?seconds=10
```

此时我们可以请求路径：

```bash
$ curl 'localhost:8080/fib?n=35'
fib(35)=9227465
$ curl 'localhost:8080/fib2?n=35'
fib2(35)=9227465
```

等命令执行结束后会在`~/pprof`路径下生成对应的文件`pprof.samples.cpu.001.pb.gz`：

```bash
$ go tool pprof http://localhost:8080/debug/pprof/profile?seconds=10
Fetching profile over HTTP from http://localhost:8080/debug/pprof/profile?seconds=10
Saved profile in /Users/XXX/pprof/pprof.samples.cpu.001.pb.gz
Type: cpu
Time: May 9, 2023 at 2:36pm (CST)
Duration: 10.10s, Total samples = 4.56s (45.15%)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) %
```

该文件与此前我们生成的`fib.profile`是类似的，是压缩后的 CPU 性能分析文件我们同样可以通过原来的命令查看CPU消耗情况：

```bash
go tool pprof pprof.samples.cpu.001.pb.gz
```

```bash
go tool pprof -http=:8081 pprof.samples.cpu.001.pb.gz
```



