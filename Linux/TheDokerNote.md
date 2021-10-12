# The Docker Note

## 简介

至于为什么要使用Docker网络上有很多文章都有讲道，这里就不赘述了。这里主要基于 James Turnbull 的《第一本Docker书》做一些简单的笔记。但在入门之前还是有必要先了解一下Docker的轮廓。

**Docker引擎**
Docker是一个[Client-server](https://zh.wikipedia.org/wiki/%E4%B8%BB%E5%BE%9E%E5%BC%8F%E6%9E%B6%E6%A7%8B)架构的程序。Docker客户端只需向Docker服务器或守护进程来发送请求，服务器或守护进程将完成所有工作并返回结果。这在我们的编程实践中通常表现为，通过命令行工具`docker`来完成操作对容器的操作。
Docker还提供了一整套RESTful API来与守护进程或服务器交互。这使得本地的客户端也可以链接远程的Docker守护进程。
Docker客户端和服务器也被称为Docker引擎。

**Docker镜像**
Docker镜像在概念上跟光盘很类似，每次从同一个Docker镜像中都可以获取到一样的内容。对原有的镜像执行一些列指令，可以构建出新的镜像。而最基础的镜像则是由Docker官方提供的。

**Docker仓库**
跟git仓库很类似，Docker也通过Registry来保存构建的镜像，可以从Registry中上传或者下载镜像。
[DockerHub](https://hub.docker.com/)是Docker公司运营的公共Registry。

**Docker容器**
用户基于镜像来构建自己的容器。我们可以认为，镜像是Docker生命周期中的构建或者打包阶段，而容器则是启动或执行阶段。Docker容器可以被总结为：

* 一个镜像格式；
* 一系列标准操作；
* 一个执行环境；

以上就是Docker中最核心的组件，而纵观Docker这个程序，跟集装箱的概念很相似，唯一的不同是：集装箱运输获取，而Docker运行软件。
Docker在执行上并不关心容器中的内容，无论是Web服务器，还是数据库，都将按照容器的方式去运行。
Docker也不关心运行的环境。就像集装箱在火车上，轮船上，Docker在Linux上，MacOS上。

之所以是Docker，还有以下几个重要的部分：

* 一个原生的Linux容器格式
* Linux内核命名空间，用于隔离文件系统、进程和网络
* 文件系统隔离：每个容器都有自己的root文件系统
* 进程隔离：每个容器都运行在自己的进程环境中
* 网络隔离：容器间的虚拟网络接口和IP地址都是分开的
* 资源隔离和分组：使用`cgroups`将CPU和内容之类的资源独立分配给每个Docker容器
* [写时复制](https://zh.wikipedia.org/zh-hans/%E5%AF%AB%E5%85%A5%E6%99%82%E8%A4%87%E8%A3%BD)
* 日志：容器产生的`STDOUT`、`STDERR`和`STDIN`这些IO都会被手机并计入日志用来镜像日志分析和故障排错。
* 交互式shell：用户可以创建一个伪tty终端，将其连接到`STADIN`，为容器提供一个交互式的shell



## Docker入门

