# RabbitMQ

## Overview

**消息队列**（Message queue）是一种进程间通信方式。发送者的发出的消息会保存在队列中，直到接收者取走消息。正因为其保存消息的特点，自然而然的支持异步。但同时对于接收者来说，也必须轮询消息队列才能够获取到消息。
消息队列最常用于异步调用、系统解耦、消峰。

RabbitMQ是最常用的消息队列之一，其支持丰富的插件，监控UI友好，且支持分布部署。
RabbitMQ被看作为消息的代理人，其抽象出虚拟连接`channel`在消息发送者和接收者之间传输消息。其内部连接方式如下：

* 通过在发送方将`channel`连接到`exchange`(交换机)，交换机路由(routing)消息到队列。
* 而队列需要在消费方声明，并且绑定到对应的交换机上，然后消费方从队列中接收消息。

![broker](../assert/Zoo/RabbitMQ/hello-world-example-routing.png)

这里需要注意的是，在发送方连接的交换机将同一条消息路由到多个队列，而对于消费方而言始终只能从一个队列中获取消息。这也是所有消息队列的通病。通常的解决方案是通过`topic`来将多个消息分配到同一个队列。

以下是RabbitMQ最常用的一些例子，开始之前默认我们已经按照[官方文档](https://www.rabbitmq.com/download.html)在本地安装了RabbitMQ，这里使用的是docker的[3.8.19-management](https://registry.hub.docker.com/_/rabbitmq/)镜像，management的镜像会附带UI管理页面。

## Publish/Subscribe

以下将展示使用RabbitMQ的Go客户端将一条消息同时发送给两个接收者，并分别输出。结构图如下：

![PublishSubscribe](../assert/Zoo/RabbitMQ/PublishSubscribe.png)

### Producer

首先我们需要获取RabbitMQ的Go客户端：

```bash
go get github.com/streadway/amqp
```

然后引入工具包，并添加部分准备代码：

```go
import (
	"github.com/streadway/amqp"
	"log"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const ExchangeName = "HelloWorkExchange"
```

然后通过安装时设置的用户名和密码连接服务器：

```go
conn, err := amqp.Dial("amqp://user:password@localhost:5672/")
failOnErr(err, "Failed to connect RabbitMQ Server")
defer conn.Close()
```

通过连接获取一个通道：

```go
ch, err := conn.Channel()
failOnErr(err, "Failed to open a channel")
defer ch.Close()
```

逻辑上对MQ的操作都是在通道上进行的，比如现在我们需要在通道上声明一个交换机，先暂时忽略选项参数：

```go
err = ch.ExchangeDeclare(
    ExchangeName,   // name
    "fanout",		// type
    true,     	  	// durable
    false,    		// auto-deleted
    false,    		// internal
    false,    		// no-wait
    nil,      		// arguments
)
failOnErr(err, "Failed to declare a exchange")
```

需要注意的是，交换机的声明是幂等的，如果不设置交换机名称，系统将会自动设置一个名称。如果已经存在相同名称的交换机，然而选项不同，则会返回错误。
此时则需要将原来的交换机删除才能重新创建，可用通过客户端删除，然后重新创建：

```go
ch.ExchangeDelete(
    "Hello", 	// name
    true, 	// ifUnused
    false,	// noWait
)
```

最后再将消息通过指定的交换机发送，同样先忽略选项参数：

```go
msg := "Hello Work!"
// 发布信息
err = ch.Publish(
    ExchangeName,   // exchange
    "", 			// routing key
    false,  		// mandatory
    false,  		// immediate
    amqp.Publishing{
        ContentType: "text/plain",
        Body:        []byte(msg),
    },
)
failOnErr(err, "Failed to publish a msg")
```

完整的发送方的代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const ExchangeName = "HelloWorkExchange"

func main() {
	// 连接服务器
	conn, err := amqp.Dial("amqp://user:password@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	// 获取一个通道
	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	// 声明一个交换机
	err = ch.ExchangeDeclare(
		"", 		// 交换机名称
		"fanout",	// 交换机类型
		true,
		false,
		false,
		false,
		nil,
	)
	failOnErr(err, "Failed to declare a exchange")

	msg := "Hello Work!"
	// 发布信息
	err = ch.Publish(
		ExchangeName,     	// exchange
		"", 				// routing key
		false,  			// mandatory
		false,  			// immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(msg),
		},
	)
	failOnErr(err, "Failed to publish a msg")

	log.Printf("Send message: %s", msg)
}
```

### Consumer

在消费方我们需要声明一个队列，并将其绑定到交换机`HelloWorkExchange`上。
同样我们需要先获取连接和通道：

```go
conn, err := amqp.Dial("amqp://user:password@localhost:5672/")
failOnErr(err, "Fail to connect RabbitMQ Server")
defer conn.Close()

ch, err := conn.Channel()
failOnErr(err, "Failed to open a channel")
defer ch.Close()
```

然后声明一个消费方处理的队列，并将其绑定到交换机上，这里我们设置队列的名称为空字符串，让RabbitMQ为我们自动生成名称：

```go
q, err := ch.QueueDeclare(
    "",   		// name
    false, 		// durable
    true, 		// autoDelete
    false,  		// exclusive
    false, 		// no-wait
    nil,   		// arguments
)
failOnErr(err, "Failed to declare a queue")
```

通常交换机的声明应该由发送方声明，但是我们不确定消费方绑定队列到交换机时，交换机是否已经声明，并且如果没有提前声明交换机就绑定队列的话会报错。所以在绑定之前我们需要先声明交换机。并且由于交换机的声明是等幂的，我们不用担心此处的声明与发送方的声明会产生冲突：

```go
err = ch.ExchangeDeclare(
    ExchangeName,   // name
    "fanout", 		// type
    true,     		// durable
    false,    		// auto-deleted
    false,    		// internal
    false,    		// no-wait
    nil,      		// arguments
)
failOnErr(err, "Failed to declare an exchange")

err = ch.QueueBind(
    q.Name,       // name
    "",           // routing key
    ExchangeName, // exchange
    false,
    nil,
)
failOnErr(err, "Failed Failed to bind a queue")
```

此时通过将队列绑定到交换机上，逻辑上的`channel`已经连接了发送方和消费方。在消费方通过`channel`便可以消费消息：

```go
msgs, err := ch.Consume(
    q.Name,	// queue
    "",    	// consumer
    true,   // auto-ack
    false,	// exclusive
    false,	// no-local
    false,	// no-wait
    nil,	// args
)
failOnErr(err, "Failed to register a consumer")

forever := make(chan bool)

go func() {
    for d := range msgs {
        log.Printf("接收到消息: %s", d.Body)
    }
}()

log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
<-forever
```

完整的消费方代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"os"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const ExchangeName = "HelloWorkExchange"

func main() {
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"",    // name
		false, // durable
		false, // autoDelete
		true,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	failOnErr(err, "Failed to declare a queue")

	err = ch.ExchangeDeclare(
		ExchangeName,   // name
		"fanout", 		// type
		true,     		// durable
		false,    		// auto-deleted
		false,    		// internal
		false,    		// no-wait
		nil,      		// arguments
	)
	failOnErr(err, "Failed to declare an exchange")

	err = ch.QueueBind(
		q.Name,       // name
		"",           // routing key
		ExchangeName, // exchange
		false,
		nil,
	)
	failOnErr(err, "Failed Failed to bind a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",    	// consumer
		true,   // auto-ack
		false,	// exclusive
		false,	// no-local
		false,	// no-wait
		nil,	// args
	)
	failOnErr(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("%v接收到消息: %s",os.Args[1], d.Body)
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
```

### Run

我们分别使用**两个终端**来运行`consumer.go`以模仿两个消费方：

```bash
>go run consumer.go Consumer1
2021/07/24 17:23:49  [*] Waiting for messages. To exit press CTRL+C
```

```go
>go run consumer.go Consumer2
2021/07/24 17:24:08  [*] Waiting for messages. To exit press CTRL+C
```

然后再运行`peoducer.go`发送信息：

```bash
>go run producer.go
2021/07/24 17:24:31 Send message: Hello Work!
```

可以看到两个消费方都能收到消息：

```go
>go run consumer.go Consumer1
2021/07/24 17:23:49  [*] Waiting for messages. To exit press CTRL+C
2021/07/24 17:24:32 Consumer1接收到消息: Hello Work!
```

```go
>go run consumer.go Consumer2
2021/07/24 17:24:08  [*] Waiting for messages. To exit press CTRL+C
2021/07/24 17:24:32 Consumer2接收到消息: Hello Work!
```

然后通过命令`rabbitmqctl list_bindings`可以查看到RabbitMQ中的绑定情况：

```go
[root@vultr ~]# docker exec -it rabbitmq-n1 /bin/bash -c 'rabbitmqctl list_bindings'
Listing bindings for vhost /...
source_name	source_kind	destination_name	destination_kind	routing_key	arguments
HelloWorkExchange	exchange	amq.gen-1pXwmh2c6z2R6u3B9n0ZNw	queue		[]
HelloWorkExchange	exchange	amq.gen-edlbOonJs_xhK11gbD1eiA	queue		[]
```

可以看到，`HelloWorkExchange`交换机绑定了两个队列。



## Routing&Topics

上面的例子我们使用的交换机类型是`fanout`，从名字也能看出来，这是一种将消息发送到所有绑定队列的方式。RabbitMQ还提供了根据路由来发送消息到指定队列的方式——Routing，以及根据类型匹配到队列的方式——Topics。

从之前的例子我们可以看到，在绑定`fanout`类型时我们设置的`routine key`为空：

```go
err = ch.QueueBind(
    q.Name,       // name
    "",           // routing key
    ExchangeName, // exchange
    false,
    nil,
)
```

当交换机类型是`fanout`时，即使是设置了`routine key`也会被忽略。只有当类型为`direct`和`topics`时才会根据`routing key`来匹配消息到队列。

### Direct exchange

`Direct exchange`会通过`binding key`来匹配发送消息的`routing key`，然后将消息放到对应的队列中被消费方消费。需要注意的是，消息的`routing key`需要在发送的时候指定。结构图如下：

![direct-exchange](../assert/Zoo/RabbitMQ/direct-exchange.png)

#### Producer

我们先修改交换机名称：

```go
const ExchangeName = "DirectExchange"
```

对于发送方，依旧是通过连接获取`channel`，然后声明交换机。但是交换机的类型需要修改为`direct`：

```go
err = ch.ExchangeDeclare(
    ExchangeName, 	// 交换机名称
    "direct",		// 交换机类型
    true,
    false,
    false,
    false,
    nil,
)
```

此外在发送方发送消息时，需要指定`routing key`。为了更直观，我们这里将`routing key`使用系统参数传入：

```go
routingKey := os.Args[1]
msg := os.Args[2]
// 发布信息
err = ch.Publish(
    ExchangeName,     	// exchange
    routingKey, 		// routing key
    false,  	// mandatory
    false,  	// immediate
    amqp.Publishing{
        ContentType: "text/plain",
        Body:        []byte(msg),
    },
)
failOnErr(err, "Fail to publish a msg")

log.Printf("Send %d message: %s", os.Args[1], msg)
```

完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"os"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const ExchangeName = "DirectExchange"

func main() {
	// 连接服务器
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Fail to connect RabbitMQ Server")
	defer conn.Close()

	// 获取一个通道
	ch, err := conn.Channel()
	failOnErr(err, "Fail to open a channel")
	defer ch.Close()

	// 声明一个交换机
	err = ch.ExchangeDeclare(
		ExchangeName, 		// 交换机名称
		"direct",		// 交换机类型
		true,
		false,
		false,
		false,
		nil,
	)
	failOnErr(err, "Fail to declare a exchange")

	routingKey := os.Args[1]
	msg := os.Args[2]
	// 发布信息
	err = ch.Publish(
		ExchangeName,     	// exchange
		routingKey, 		// routing key
		false,  	// mandatory
		false,  	// immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(msg),
		},
	)
	failOnErr(err, "Fail to publish a msg")

	log.Printf("Send %d message: %s", os.Args[1], msg)
}
```

#### Consumer

在接收方则也需要修改交换机的声明：

```go
err = ch.ExchangeDeclare(
    ExchangeName,   // name
    "direct", 		// type
    true,     		// durable
    false,    		// auto-deleted
    false,    		// internal
    false,    		// no-wait
    nil,      		// arguments
)
```

然后将队列绑定到交换机，并设置路由。这里我们为了更直观，也将路由从系统参数传入：

```go
for _, routingKey := range os.Args[2:] {
    err = ch.QueueBind(
        q.Name,       // name
        routingKey,   // routing key
        ExchangeName, // exchange
        false,
        nil,
    )
    failOnErr(err, "Failed Failed to bind a queue")
}
```

接收方完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"os"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const ExchangeName = "DirectExchange"

func main() {
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"",    	// name
		true, 	// durable
		false, 	// autoDelete
		false,  // exclusive
		false, 	// no-wait
		nil,   	// arguments
	)
	failOnErr(err, "Failed to declare a queue")

	err = ch.ExchangeDeclare(
		ExchangeName,   // name
		"direct", 		// type
		true,     		// durable
		false,    		// auto-deleted
		false,    		// internal
		false,    		// no-wait
		nil,      		// arguments
	)
	failOnErr(err, "Failed to declare an exchange")

	// 将多个路由绑定到队列
	for _, routingKey := range os.Args[2:] {
		err = ch.QueueBind(
			q.Name,       // name
			routingKey,   // routing key
			ExchangeName, // exchange
			false,
			nil,
		)
		failOnErr(err, "Failed Failed to bind a queue")
	}

	msgs, err := ch.Consume(
		q.Name, 		// queue
		"",    // consumer
		true,   // auto-ack
		false,	// exclusive
		false,	// no-local
		false,	// no-wait
		nil,		// args
	)
	failOnErr(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("%v接收到消息: %s",os.Args[1], d.Body)
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
```

#### Run

然后在两个终端分别启动不同路由的消费者：

```bash
>go run consumer.go Consumer1 info
2021/07/24 19:49:35  [*] Waiting for messages. To exit press CTRL+C
```

```bash
>go run consumer.go Consumer2 info error warning
2021/07/24 19:50:21  [*] Waiting for messages. To exit press CTRL+C
```

运行发送方发送消息：

```go
>go run producer.go info "This is an info"
2021/07/24 19:51:29 Send info message: This is an info

>go run producer.go error "This is an error"
2021/07/24 19:51:54 Send error message: This is an error
```

可以看到`error`类型的消息只有`Consumer2`接收到了，而`info`类型的消息连个消费方都接收到了：

```bash
>go run consumer.go Consumer1 info
2021/07/24 19:49:35  [*] Waiting for messages. To exit press CTRL+C
2021/07/24 19:51:29 Consumer1接收到消息: This is an info
```

```bash
>go run consumer.go Consumer2 info error warning
2021/07/24 19:50:21  [*] Waiting for messages. To exit press CTRL+C
2021/07/24 19:51:29 Consumer2接收到消息: This is an info
2021/07/24 19:51:54 Consumer2接收到消息: This is an error
```



### Topic exchange

`Topic exchange`可以将由`.`定界的`routing key`按照模式匹配到对应的队列。`topic exchange`接收的路由，因由两个以上的词组成，并以`.`分隔开，最大长度为255 bytes。仅一个词的`routing key`不会被`topic exchange`路由到任何队列。以下符号可以进行匹配：

> - \* ：能够匹配任意一个词
> - \# ：能够匹配任意0个或多个词

例如如下的绑定：

![topic-exchange](../assert/Zoo/RabbitMQ/topic-exchange.png)

Q1队列将接收所有橙色的动物，Q2队列将会接收所有懒惰的动物，以及所有兔子。

#### Producer

`topic exchange`跟`direct exchange`几乎一模一样，只需要将声明的交换机类型改为`topic`，然后在设置对应的路由即可。我们对Direct exchange中的代码做适当修改：

```go
const ExchangeName = "TopicExchange"
```

```go
err = ch.ExchangeDeclare(
    ExchangeName, 	// 交换机名称
    "topic",		// 交换机类型
    true,
    false,
    false,
    false,
    nil,
)
```

发送方完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"os"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const ExchangeName = "TopicExchange"

func main() {
	// 连接服务器
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Fail to connect RabbitMQ Server")
	defer conn.Close()

	// 获取一个通道
	ch, err := conn.Channel()
	failOnErr(err, "Fail to open a channel")
	defer ch.Close()

	// 声明一个交换机
	err = ch.ExchangeDeclare(
		ExchangeName, 		// 交换机名称
		"topic",		// 交换机类型
		true,
		false,
		false,
		false,
		nil,
	)
	failOnErr(err, "Fail to declare a exchange")

	routingKey := os.Args[1]
	msg := os.Args[2]
	// 发布信息
	err = ch.Publish(
		ExchangeName,     	// exchange
		routingKey, 		// routing key
		false,  	// mandatory
		false,  	// immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(msg),
		},
	)
	failOnErr(err, "Fail to publish a msg")

	log.Printf("Send %v message: %s", os.Args[1], msg)
}
```

#### Consumer

消费方完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"os"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const ExchangeName = "TopicExchange"

func main() {
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"",    // name
		true, // durable
		false, // autoDelete
		false,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	failOnErr(err, "Failed to declare a queue")

	err = ch.ExchangeDeclare(
		ExchangeName,   	// name
		"topic", 		// type
		true,     	// durable
		false,    // auto-deleted
		false,    	// internal
		false,    	// no-wait
		nil,      		// arguments
	)
	failOnErr(err, "Failed to declare an exchange")

	// 将多个路由绑定到队列
	for _, routingKey := range os.Args[2:] {
		err = ch.QueueBind(
			q.Name,       // name
			routingKey,   // routing key
			ExchangeName, // exchange
			false,
			nil,
		)
		failOnErr(err, "Failed Failed to bind a queue")
	}

	msgs, err := ch.Consume(
		q.Name, 		// queue
		"",    // consumer
		true,   // auto-ack
		false,	// exclusive
		false,	// no-local
		false,	// no-wait
		nil,		// args
	)
	failOnErr(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("%v接收到消息: %s",os.Args[1], d.Body)
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
```

#### Run

同样我们在两个不同的终端运行消费方的代码：

 ```bash
 >go run consumer.go Consumer1 "*.orange.*"
 ```

```bash
>go run consumer.go Consumer2 "*.*.rabbit" "lazy.#"
```

然后运行发送方代码：

```bash
e>go run producer.go "clever.orange.tiger" "This is a tiger"
2021/07/24 21:58:48 Send clever.orange.tiger message: This is a tiger
>go run producer.go "fool.orange.rabbit" "This is a rabbit"
2021/07/24 21:58:57 Send fool.orange.rabbit message: This is a rabbit
>go run producer.go "lazy" "This is lazy"
2021/07/24 21:59:38 Send lazy message: This is lazy
```

可以看到输出如下：

```bash
>go run consumer.go Consumer1 "*.orange.*"
2021/07/24 21:56:48  [*] Waiting for messages. To exit press CTRL+C
2021/07/24 21:58:57 Consumer1接收到消息: This is a tiger
2021/07/24 21:59:05 Consumer1接收到消息: This is a rabbit
```

```bash
>go run consumer.go Consumer2 "*.*.rabbit" "lazy.#"
2021/07/24 21:58:15  [*] Waiting for messages. To exit press CTRL+C
2021/07/24 21:58:24 Consumer2接收到消息: This is a lazy horse
2021/07/24 21:58:58 Consumer2接收到消息: This is a rabbit
2021/07/24 21:59:38 Consumer2接收到消息: This is lazy
```



## RPC

RabbitMQ还经常用于实现RPC。客户端通过向一个队列发送一条消息，被服务端处理后在由另一个队列将结果返回给客户端。其中有几个问题需要注意：

* 请求的消息与返回的消息需要唯一对应
* 保证消息不丢失
* 多个服务端监听一个请求队列时，需要做负载均衡

而RabbitMQ很好的解决了这三个问题：

* RabbitMQ提供了一套较完整的`amqp`协议，可以在发送信息的中设置头部`correlation_id`，返回时通过将发送的`correlation_id`接收的`correlation_id`做比较便可以判断是否为请求返回的结果。
* `amqp`协议还提供了`delivery_mode`的字段，当被设置为`persistent`时，RabbitMQ 会将消息保存到磁盘中，即使是RabbitMQ 服务器重启，也不会造成消息丢失。（**注：RabbitMQ 并不能完全保证消息不丢失，在接收消息但还没保存到磁盘时出现故障，RabbitMQ可能来不及将保存到磁盘中**）
* 设置RabbitMQ的Qos可以控制队列将消息推送到消费方的数量，`perfetch count`可以设置消费方正在处理的消息的最大数量，`perfetch size`可以设置每次推送给消费方的消息数量，以此来实现负载均衡。

让我们使用RabbitMQ实现一个简单RPC调用，其架构图如下：

![rpc](../assert/Zoo/RabbitMQ/rpc.png)

* 客户端需要创建一个接收消息的队列，供服务端返回消息
* 客户端请求时需要将唯一的`correlation_id`发送到队列，并且附上接收返回的队列名称
* 服务端获取消息并完成调用以后将结果发送到返回的队列中
* 客户端将返回的`correlation_id`和发送的`coorelation_id`比较，以获取到正确的结果

让我们通过一个RPC调用计算Fibonacci数列的例子来看看RabbitMQ如何实现RPC。

### Client

我们需要先声明一个消息队列用于接收返回信息：

```go
replyTo, err := ch.QueueDeclare(
    "",		// name
    false,	// durable
    true,	// autoDelete
    false,	// exclusive
    false,	// noWait
    nil,	// args
)
```

然后准备一个唯一的`correlation_id`用于确定请求的返回信息：

```go
corrId := strconv.Itoa(rand.Int())
```

将消息发送到指定队列中，我们这里将其命名为`rpc_queue`。并通过设置`DeliveryMode`将消息持久化，防止消息丢失：

```go
const RoutingKey = "rpc_queue"
```

```go
err = ch.Publish(
    "",         // exchange
    RoutingKey, // routing key
    false,      // mandatory
    false,      // immediate
    amqp.Publishing{
        ContentType:   "text/plain",
        CorrelationId: corrId,
        DeliveryMode: amqp.Persistent,
        ReplyTo:       replyTo.Name,
        Body:          []byte(strconv.Itoa(n)),
    },
)
```

需要注意的是，当消息发送方和接收方之间只有一个队列关联时，RabbitMQ允许发送方之间将队列名称作为路由，并为我们创建一个临时的交换机，然后将消息发送到对应队列。所以我们填写的交换机为空，然后将队列名称设置为路由。

最后，消息的发送方还需要接收`replyTo`队列中返回的消息：

```go
msgs, err := ch.Consume(
    replyTo.Name, // name
    "",           // consumer
    true,         // auto-ack
    false,        // exclusive
    false,        // no-local
    false,        // no-wait
    nil,          // args
)
failOnErr(err, "Failed to register a consumer")
for msg := range msgs {
    if corrId == msg.CorrelationId {
        res, err = strconv.Atoi(string(msg.Body))
        failOnErr(err, "Failed to convert body to integer")
        break
    }
}
```

客户端完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"math/rand"
	"strconv"
	"sync"
	"time"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const RoutingKey = "rpc_queue"

func fibRPC(n int, ch *amqp.Channel) (res int, err error) {
	replyTo, err := ch.QueueDeclare(
		"",
		false,
		true,
		false,
		false,
		nil,
	)
	failOnErr(err, "Failed to declare a queue")

	log.Printf("Call fib(%d)", n)
	corrId := strconv.Itoa(rand.Int())
	err = ch.Publish(
		"",         // exchange
		RoutingKey, // routing key
		false,      // mandatory
		false,      // immediate
		amqp.Publishing{
			ContentType:   "text/plain",
			CorrelationId: corrId,
            DeliveryMode: amqp.Persistent,
			ReplyTo:       replyTo.Name,
			Body:          []byte(strconv.Itoa(n)),
		},
	)
	failOnErr(err, "Failed to publish a msg")

	msgs, err := ch.Consume(
		replyTo.Name, // name
		"",           // consumer
		true,         // auto-ack
		false,        // exclusive
		false,        // no-local
		false,        // no-wait
		nil,          // args
	)
	failOnErr(err, "Failed to register a consumer")
	for msg := range msgs {
		if corrId == msg.CorrelationId {
			res, err = strconv.Atoi(string(msg.Body))
			failOnErr(err, "Failed to convert body to integer")
			break
		}
	}
	return
}

func main() {
	var wg sync.WaitGroup
	wg.Add(4)

    // 将连接共用减少开销
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()
    
    ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	f := func(n int) {
		res, err := fibRPC(n, ch)
		failOnErr(err, "Failed to handle RPC request")
		log.Printf(" [.] Got %d", res)
		wg.Done()
	}
	go f(45)
    // 为演示RabbitMQ的负载均衡,这里等待一会儿，让某服务方先计算f(45)
	time.Sleep(1 * time.Millisecond)
	go f(0)
	go f(1)
	go f(2)

	wg.Wait()
}
```

### Server

在服务方需要准备一个计算Fibonacci数列的方法：

```go
func fib(n int) (res int) {
	if n <= 1 { return n }

	return fib(n-1) + fib(n-2)
}
```

然后声明一个接收RPC消息的队列：

```go
q, err := ch.QueueDeclare(
    RouteQueueName, // name
    true,           // durable
    false,          // autoDelete
    false,          // exclusive
    false,          // no-wait
    nil,            // arguments
)
```

此时，我们需要在服务方维护`Qos`，以实现负载均衡。
`prefetchCount`设置每次从队列中取出消息的个数，`prefetchSize`设置可以预取出的消息个数。`global`将设置当前的配置是作用于整个`Connection`连接还是当前`channel`：

```go
err = ch.Qos(
    1,     // prefetchCount
    0,     // prefetchSize
    false, // global
)
```

**注：如果在没有设置Qos的情况下，一个队列绑定了多个消费方，RabbitMQ会采用轮询的方式，将消息逐个发送到所有消费方，并等到确认之后再次发送**

然后便从`rpc_queue`队列中取出消息：

```go
msgs, err := ch.Consume(
    q.Name, // queue
    "",     // consumer
    false,  // auto-ack
    false,  // exclusive
    false,  // no-local
    false,  // no-wait
    nil,    // args
)
```

值得注意的是，这里我们并没有将`auto-ack`设置为`true`。因为我们需要在计算完程并返回到消息队列后，再确认消息，以防止消息丢失。接下来便将计算后将结果返回到`replyTo`队列中：

```go
for d := range msgs {
    n, err := strconv.Atoi(string(d.Body))
    failOnErr(err, "Failed to convert msg.Body to int")

    log.Printf(" [%v] fib(%d)", os.Args[1], n)
    res := fib(n)

    err = ch.Publish(
        "",			// exchange
        d.ReplyTo,	// routing key
        false,		// mandatory
        false,		// immediate
        amqp.Publishing{
            ContentType:   "text/plain",
            CorrelationId: d.CorrelationId,
            Body:          []byte(strconv.Itoa(res)),
        })
    failOnErr(err, "Failed to publish a msg")

    d.Ack(false)	// 确认消息
}
```

服务方完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"os"
	"strconv"
)

func fib(n int) (res int) {
	if n <= 1 { return n }

	return fib(n-1) + fib(n-2)
}

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const RouteQueueName = "rpc_queue"

func main() {
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		RouteQueueName, // name
		true,           // durable
		false,          // autoDelete
		false,          // exclusive
		false,          // no-wait
		nil,            // arguments
	)
	failOnErr(err, "Failed to declare a queue")

	err = ch.Qos(
		1,     // prefetchCount
		0,     // prefetchSize
		false, // global
	)
	failOnErr(err, "Failed to set Qos")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnErr(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			n, err := strconv.Atoi(string(d.Body))
			failOnErr(err, "Failed to convert msg.Body to int")

			log.Printf(" [%v] fib(%d)", os.Args[1], n)
			res := fib(n)

			err = ch.Publish(
                "",			// exchange
                d.ReplyTo,	// routing key
                false,		// mandatory
                false,		// immediate
				amqp.Publishing{
					ContentType:   "text/plain",
					CorrelationId: d.CorrelationId,
					Body:          []byte(strconv.Itoa(res)),
				})
			failOnErr(err, "Failed to publish a msg")

			d.Ack(false)
		}
	}()

	log.Printf(" [*] Waiting for RPC request. To exit press CTRL+C")
	<-forever
}
```

### Run

接下来先启动两个服务端：

```bash
>go run server.go S1
2021/07/25 15:01:42  [*] Waiting for RPC request. To exit press CTRL+C
```

```bash
>go run server.go S2
2021/07/25 15:01:40  [*] Waiting for RPC request. To exit press CTRL+C
```

然后再启动客户端（客户端将调用封装在了`main()`函数中，以便更直观的展示负载均衡）：

```bash
>go run clint.go
2021/07/25 15:03:25 Call fib(45)
2021/07/25 15:03:25 Call fib(2)
2021/07/25 15:03:25 Call fib(0)
2021/07/25 15:03:25 Call fib(1)
2021/07/25 15:03:26  [.] Got 1
2021/07/25 15:03:26  [.] Got 0
2021/07/25 15:03:27  [.] Got 1
2021/07/25 15:03:35  [.] Got 1134903170
```

查看两个服务端的执行结果，可以看到S1消费了三个耗时较短的方法，S2消费了耗时较长的`fib(45)`：

```bash
>go run server.go S1
2021/07/25 15:01:42  [*] Waiting for RPC request. To exit press CTRL+C
2021/07/25 15:03:25  [S1] fib(2)
2021/07/25 15:03:26  [S1] fib(0)
2021/07/25 15:03:26  [S1] fib(1)
```

```bash
>go run server.go S2
2021/07/25 15:01:40  [*] Waiting for RPC request. To exit press CTRL+C
2021/07/25 15:03:25  [S2] fib(45)
```



## Dead letter

`dead letter`被译为”死信“。是RabbitMQ中的一种消息机制。有时候我们在队列中的消息可能出现以下情况：

* 消息被接收方拒绝
* 消息在队列中存活时间超过设置的TTL时间
* 消息队列中的数量已满，发送方仍然在发送消息

那么这些消息会成为死信，如果不进行特殊处理，这些消息将会被丢弃。通常这类消息我们应对对其进行特殊的处理，而不是直接丢弃。
RabbitMQ允许将死信发送到指定队列，这些队列称之为”死信队列“。

让我们来实现一个系统，实现客户端发送消息通知服务端进行某操作。如果有死信的产生，则将死信转发到死信队列，并由专门的服务器发出预警。其结构图如下：

![dead-letter](../assert/Zoo/RabbitMQ/dead-letter.png)

### Producer

对于发送方，只需要将消息发送到`MsgQueue`并在消息头部设置过期时间`Expiration`即可。过期时间可以设置在队列上，具体可参考[Time-To-Live and Expiration](https://www.rabbitmq.com/ttl.html#per-queue-message-ttl)。但设置在消息上可以更精确控制每条消息的过期时间。
发送方完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"strconv"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const MsgQueueName = "MsgQueue"

func sendEvent(n int, ch *amqp.Channel) {
	err := ch.Publish(
		"",           // exchange
		MsgQueueName, // routing key
		false,        // mandatory
		false,        // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(strconv.Itoa(n)),
			Expiration:  "3000", // 设置消息过期时间，单位为毫秒
		},
	)
	failOnErr(err, "Failed to publish a msg")
}

func main() {
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

    // 同时发送多个请求
	for i := 1; i <= 6; i++ {
		log.Printf(" [.] Send event %v", i)
		sendEvent(i, ch)
	}
}
```

### Consumer1

消费者C1中则需要设置拒绝策略。这里我们直接将消息为2的信息拒绝：

```go
for d := range msgs {
    n, err := strconv.Atoi(string(d.Body))
    failOnErr(err, "Failed to convert msg.Body to int")

    if n == 2 {
        log.Printf(" [C1] reject msg: %v", n)
        d.Reject(false)
        continue
    }

    doSomething()	// 模拟运行某方法
    log.Printf(" [C1] %v doSomething finished", n)
    d.Ack(false)
}
```

C1中还需要设置`MsgQueue`需要转发的死信交换机：

```go
msgQueue, err := ch.QueueDeclare(
    MsgQueueName, // name
    true,         // durable
    false,        // autoDelete
    false,        // exclusive
    false,        // no-wait
    amqp.Table{
        "x-dead-letter-exchange": DeadLetterExchangeName, // 设置死信交换机
    }, // arguments
)
```

C1完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
	"strconv"
	"time"
)

func doSomething() {
	time.Sleep(1 * time.Second)
}

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const MsgQueueName = "MsgQueue"
const DeadLetterExchangeName = "DeadLetterExchange"

func main() {
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	err = ch.Qos(
		1,     // prefetchCount
		0,     // prefetchSize
		false, // global
	)

	msgQueue, err := ch.QueueDeclare(
		MsgQueueName, // name
		true,         // durable
		false,        // autoDelete
		false,        // exclusive
		false,        // no-wait
		amqp.Table{
			"x-dead-letter-exchange": DeadLetterExchangeName, // 设置死信交换机
		}, // arguments
	)
	failOnErr(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		msgQueue.Name, // queue
		"",            // consumer
		false,          // auto-ack
		false,         // exclusive
		false,         // no-local
		false,         // no-wait
		nil,           // args
	)
	failOnErr(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			n, err := strconv.Atoi(string(d.Body))
			failOnErr(err, "Failed to convert msg.Body to int")

			if n == 2 {
				log.Printf(" [C1] reject msg: %v", n)
				d.Reject(false)
				continue
			}

			doSomething()
			log.Printf(" [C1] %v doSomething finished", n)
			d.Ack(false)
		}
	}()

	log.Printf(" [*] Waiting for RPC request. To exit press CTRL+C")
	<-forever
}
```

### Consumer2

对于C2我们需要将死信队列绑定到死信交换机。然后从死信队列获取消息处理。完整代码如下：

```go
package main

import (
	"github.com/streadway/amqp"
	"log"
)

func failOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

const DeadLetterExchangeName = "DeadLetterExchange"
const DeadLetterQueueName = "DeadLetter"

func main() {
	conn, err := amqp.Dial("amqp://user:123@localhost:5672/")
	failOnErr(err, "Failed to connect RabbitMQ Server")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErr(err, "Failed to open a channel")
	defer ch.Close()

	err = ch.ExchangeDeclare(
		DeadLetterExchangeName, // name
		"fanout",               // type
		true,                   // durable
		false,                  // auto-deleted
		false,                  // internal
		false,                  // no-wait
		nil,                    // arguments
	)
	failOnErr(err, "Failed to declare a exchange")

	deadQueue, err := ch.QueueDeclare(
		DeadLetterQueueName, // name
		true,                // durable
		false,               // autoDelete
		false,               // exclusive
		false,               // no-wait
		nil,                 // arguments
	)
	failOnErr(err, "Failed to declare a queue")

	err = ch.QueueBind(
		deadQueue.Name,         // name
		"",                     // routing key
		DeadLetterExchangeName, // exchange
		false,
		nil,
	)
	failOnErr(err, "Failed Failed to bind a queue")

	msgs, err := ch.Consume(
		deadQueue.Name, // queue
		"",             // consumer
		true,           // auto-ack
		false,          // exclusive
		false,          // no-local
		false,          // no-wait
		nil,            // args
	)
	failOnErr(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			str := string(d.Body)
			log.Printf(" [C2] Get dead letter: (%s)", str)
		}
	}()

	log.Printf(" [*] Waiting for RPC request. To exit press CTRL+C")
	<-forever
}
```

### Run

我们在发送方设置的消息过期时间为3s，同时发送了六条消息。在C1中处理每条消息需要1s，并且会拒绝消息2。因为设置端消息过期时间为3s，所有消息5，6被接收时以及过期，会被直接发送到死信队列中。也就是说最后C1将会执行消息1，3，4。死信交换机将会收到消息2，5，6。我们在终端运行以下，来验证一下结果：

```bash
>go run consumer1.go
```

```bash
>go run consumer2.go
```

发送方运行：

```bash
>go run producer.go
2021/07/25 19:11:15  [.] Send event 1
2021/07/25 19:11:15  [.] Send event 2
2021/07/25 19:11:15  [.] Send event 3
2021/07/25 19:11:15  [.] Send event 4
2021/07/25 19:11:15  [.] Send event 5
2021/07/25 19:11:15  [.] Send event 6
```

可以看到最终的运行结果：

```bash
>go run consumer1.go
2021/07/25 19:11:01  [*] Waiting for RPC request. To exit press CTRL+C
2021/07/25 19:11:16  [C1] 1 doSomething finished
2021/07/25 19:11:16  [C1] reject msg: 2
2021/07/25 19:11:17  [C1] 3 doSomething finished
2021/07/25 19:11:18  [C1] 4 doSomething finished
```

```bash
>go run consumer1.go
2021/07/25 19:11:02  [*] Waiting for RPC request. To exit press CTRL+C
2021/07/25 19:11:16  [C2] Get dead letter: (2)
2021/07/25 19:11:18  [C2] Get dead letter: (5)
2021/07/25 19:11:18  [C2] Get dead letter: (6)
```



