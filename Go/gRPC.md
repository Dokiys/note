# Protocol Buffer

`Protocol Buffer`是Google开发的一种与语言无关、平台无关、可扩展的用于序列化结构化数据的机制。
使用`protobuf`有以下几个步骤：

1. 首先我们需要按照[《Language Guide》](https://developers.google.com/protocol-buffers/docs/overview)定义一个`.proto`的文件，来描述我们希望存储的数据结构
2. 使用`protobuf compiler`编译`.proto`文件生成对应语言的数据结构代码
3. 序列化和反序列化定义的数据结构

我这里使用的Go，让我们跟着官方的[《Protocol Buffer Basics: Go》](https://developers.google.com/protocol-buffers/docs/gotutorial)来使用一下`protobuf`

---

## Hello Protobuf

### 定义proto文件

首先先创建一个`grpc/helloproto`目录，并在`grpc`使用`go mod`初始化

```bash
$ mkdir -p grpc/helloproto && cd grpc
$ go mod init grpc
```

然后在`grpc/helloproto`目录下创建`hellp_proto.proto`文件：

```protobuf
syntax = "proto3";

package helloproto;	// proto文件不是通过每个文件来区分命名空间的，而是通过package

import "google/protobuf/timestamp.proto";

option go_package = "grpc/helloproto";

message Person {
  string name = 1;
  int32 id = 2;
  string email = 3;

  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }

  message PhoneNumber {
    string number = 1;
    PhoneType type = 2;
  }

  repeated PhoneNumber phones = 4;

  google.protobuf.Timestamp last_updated = 5;
}

message AddressBook {
  repeated Person people = 1;
}
```

这里需要注意的是，我们引入了一个官方提供的`proto`文件`import "google/protobuf/timestamp.proto";`之后这将会影响到使用`protobuf compiler`编译。其他官方提供的类型可以在[《Package google.protobuf》](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf)找到
此外我这里使用的Go，添加了可选的配置`option go_package = "grpc/helloproto";`，这也会影响到`protobuf complier`的编译

### 编译proto文件

首先我们需要安装`protobuf compiler`：

```bash
$ brew install protobuf
$ protoc --version                                                 
libprotoc 3.17.3
```

然后由于我这里使用的Go，则需要安装Go相关的插件，其他语言也可以在[这里](https://developers.google.com/protocol-buffers/docs/tutorials)找到：

```bash
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```

然后运行compiler：

```bash
$ cd ~/grpc
$ protoc --proto_path=. \		# 指定扫描import文件的路径
				 --go_out=../ \			# 指定生成文件的路径
					./helloproto/hello_proto.proto google/protobuf/timestamp.proto # 指定编译的文件
```

运行完以后生成了文件`hello_proto.pb.go`其中包含了我们定义的数据结构，和其他相关代码。

这里需要解释一下，`--proto_path`选项制定了扫描proto文件中国import文件的路径。但是对于我们引入的`google/protobuf/timestamp.proto`这个文件，在我们本地并没有，于是在最后指定编译文件的时候需要额外引入。
此外，让我们先看一下当前`~/grpc`下的目录结构：

```bash
$ tree     
.
├── go.mod
├── go.sum
└── helloproto
    ├── hello_proto.pb.go
    └── hello_proto.proto
```

`--go_out`选项指定了，生成文件的开始路径。我们是在`~/grpc`路径下执行的，此时`protoc`生成文件的路径就是从`~`同级目录开始的。然而我们发现生成的文件却在`~/grpc/helloproto`目录下，这就是之前设置了`option go_package = "grpc/helloproto";`的结果。
`prorotc`插件`google.golang.org/protobuf/cmd/protoc-gen-go`要求我们必须设置`option go_package`参数并且指定有效的Go导入路径。一下的提示信息将会在设置错误的`go_package`时提示出来：

```bash
protoc-gen-go: invalid Go import path "helloproto" for "helloproto/hello_proto.proto"

The import path must contain at least one period ('.') or forward slash ('/') character.
```

也就是说，在`--go_out`设置的同级目录中，`import`生成的`XXX_pb.go`文件时指定的包名就是在`proto`文件中设置的`option go_package`包名。

为了方便之后修改`proto`文件的时候重新编译，这里稍作修改，并将命令写入了`Makefile`文件：

```bash
$ touch ~/grpc/Makefile
$ cat Makefile
PROTO_FILES=$(shell find ./helloproto/* -name *.proto)
proto:
	protoc --proto_path=. --go_out=../ $(PROTO_FILES) google/protobuf/timestamp.proto
```

### 序列化结构体

然后编写测试`hello_proto_test.go`：

```go
package grpc

import (
	"github.com/stretchr/testify/assert"
	"google.golang.org/protobuf/proto"
	pb "grpc/helloproto"
	"testing"
)

func TestHelloProto(t *testing.T) {
	// The whole purpose of using protocol buffers is to serialize your data
	bookOut := &pb.AddressBook{
		People: []*pb.Person{{
			Id:    1234,
			Name:  "John Doe",
			Email: "jdoe@example.com",
			Phones: []*pb.Person_PhoneNumber{
				{Number: "555-4321", Type: pb.Person_HOME},
			},
		}},
	}
	data, err := proto.Marshal(bookOut)
	assert.NoError(t, err)

	bookIn := &pb.AddressBook{}
	assert.NoError(t, proto.Unmarshal(data, bookIn))
}
```



## 其他序列化方式

其他还有如`XML`、`JSON`等比较通用的序列化方式。`XML`一直被人诟病的就是信息密度太低，`JSON`由于采用字符串保存数据，可读性很高，性能却不太理想。
`protobuf`推出之后相较于以上两者性能有了很大提升，但是在官方推出的第一版`protobuf`之后，社区有了性能更强的魔改版本[`gogoprotobuf`](https://github.com/gogo/protobuf)。

[go_serialization_benchmarks](https://github.com/alecthomas/go_serialization_benchmarks)比较了Go中多种序列化方式的性能。

2020年3月份，`protobuf`官方又发文[《A new Go API for Protocol Buffers》](https://go.dev/blog/protobuf-apiv2)推出了一个v2版本，性能上与`gogoprotobuf`相比依然不尽人意。具体可参考[《go protobuf v1败给了gogo protobuf，那v2呢？》](https://tonybai.com/2020/04/24/gogoprotobuf-vs-goprotobuf-v1-and-v2/)。但是在官方推出的v2版本支持了动态反射，这使得我们生成一些编译时未知的message。
关于官方发文的翻译可以参考一下：[《Go Protobuf APIv2 动态反射 Protobuf 使用指南》](https://farer.org/2020/04/17/go-protobuf-apiv2-reflect-dynamicpb/)这篇文章中也介绍了`protoreflect`的一些使用。接下来让我们用两个例子简单看一下v2的动态反射。



## Protoreflect

第一个例子很简单，直接在`hello_proto_test.go`中添加如下代码：

```go
func TestHelloProtoReflect(t *testing.T) {
	book := &pb.AddressBook{
		People: []*pb.Person{{
			Id:    1234,
			Name:  "John Doe",
			Email: "jdoe@example.com",
			Phones: []*pb.Person_PhoneNumber{
				{Number: "555-4321", Type: pb.Person_HOME},
			},
		}},
	}
	data, err := proto.Marshal(book)
	assert.NoError(t, err)

	// Get message type by full name
	msgType, err := protoregistry.GlobalTypes.FindMessageByName("helloproto.AddressBook")
	assert.NoError(t, err)

	// Deserialize into helloproto.AddressBook message
	msg := msgType.New().Interface()
	err = proto.Unmarshal(data, msg)
	assert.NoError(t, err)

	t.Log(msg)
}
```

我们直接根据字面量`"helloproto.AddressBook"`从`protoregistry.GlobalTypes`获取了一个`protoreflect.MessageType`，并将提前准备好的序列化数据，反序列化到由`msgType`新生成的实例中。
需要提一下的是，`protoregistry.GlobalTypes`是根据生成的`hello_proto.pb.go`文件来反射生成实例的。

第二个例子是通过反射，遍历`helloproto.Person`的所有字段，并将名字改成`"zhangsan"`：

```go
func TestHelloProtoReflect2(t *testing.T) {
	person := &pb.Person{
		Id:    1234,
		Name:  "John Doe",
		Email: "jdoe@example.com",
		Phones: []*pb.Person_PhoneNumber{
			{Number: "555-4321", Type: pb.Person_HOME},
		},
	}
  
  // 获取Massage
	msg := person.ProtoReflect()
	msg.Range(func(fd protoreflect.FieldDescriptor, v protoreflect.Value) bool {
		if fd.Name() == "name" {
			msg.Set(fd, protoreflect.ValueOfString("zhangsan"))
		}
		return true
	})

	t.Log(msg.Interface())
}
```

甚至我们还可以利用`Message.Clear()`在`Range`中删除指定的字段，具体可以参考《A new Go API for Protocol Buffers》。

通过下图可以看到`ProtoMessage`和`Message`之间的转换关系

```bash
  ┌──────────────── New() ─────────────────┐
  │                                        │
  │         ┌─── Descriptor() ─────┐       │   ┌── Interface() ───┐
  │         │                      V       V   │                  V
╔═════════════╗  ╔═══════════════════╗  ╔═════════╗  ╔══════════════╗
║ MessageType ║  ║ MessageDescriptor ║  ║ Message ║  ║ ProtoMessage ║
╚═════════════╝  ╚═══════════════════╝  ╚═════════╝  ╚══════════════╝
       Λ           Λ                      │ │  Λ                  │
       │           └──── Descriptor() ────┘ │  └─ ProtoReflect() ─┘
       │                                    │
       └─────────────────── Type() ─────────┘
```



## gogo/protobuf

最后简单介绍一下[`gogo/protobuf`](https://github.com/gogo/protobuf)的使用。该项目提供了`protoc-gen-gofast`的生成工具，配套需要引入一下mod：

```bash
go get github.com/gogo/protobuf/protoc-gen-gofast
```

```bash
go get github.com/gogo/protobuf/proto
go get github.com/gogo/protobuf/gofast
go get github.com/gogo/protobuf/gogoproto
```

`protoc`命令也需要做相应的修改：

```makefile
PROTO_FILES=$(shell find ./helloproto/* -name *.proto)
gofast_proto:
  protoc --proto_path=. \
         --gofast_out=Mgoogle/protobuf/timestamp.proto=github.com/gogo/protobuf/types:../ \
         $(PROTO_FILES)
```

需要注意的是，这里我们使用到了`google/protobuf/*.proto`文件，需要将其替换成`gogo/protobuf/types`
除此之外，`gogo/protobuf`还提供多种不同的生成工具，来适应不同的场景：

```
protoc-gen-gogofast (same as gofast, but imports gogoprotobuf)
protoc-gen-gogofaster (same as gogofast, without XXX_unrecognized, less pointer fields)
protoc-gen-gogoslick (same as gogofaster, but with generated string, gostring and equal methods)
```

具体可以到其github仓库查看。

最后想再提一下，官方提供的两个`protobuf`版本在两个不同的仓库。v1版本在`https://github.com/golang/protobuf`，v2版本在`https://github.com/protocolbuffers/protobuf-go`。`gogo/protobuf`目前并没有兼容v2版本，也就是说，如果需要使用反射等功能则不能使用`gogo/protobuf`

# gRPC

