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

网络上有很多文章来介绍如何安装Docker程序，这里就不再做介绍。在安装好Docker后，可以通过以下命令来查看其运行情况：

```bash
$ docker info
```

正如之前我们的介绍，Docker基于是C/S架构的。所以如果Docker正常运行，我们可以在返回的信息中看到Client的信息和Server的信息。

### 运行第一个容器

让我们通过Docker提供的命令行工具来向守护进程发送运行容器的指令，来运行我们的第一个容器：

```bash
$ docker run -i -t ubuntu /bin/bash
Unable to find image 'ubuntu:latest' locally
latest: Pulling from library/ubuntu
f3ef4ff62e0d: Pull complete
Digest: sha256:a0d9e826ab87bd665cfc640598a871b748b4b70a01a4f3d174d4fb02adad07a9
Status: Downloaded newer image for ubuntu:latest
root@f4ccf6b2b6f7:/#
```

`docker run`命令可以用来运行一个容器；`-i`参数使得运行的容器中`STDIN`是开启的；`-t`参数则会给创建的容器分配一个伪tty终端，以使得新容器能够提供一个交互式shell；`ubuntu`表示基于名称为`ubuntu`的镜像来运行容器；最后启动后的容器将会运行`/bin/bash`命令启动一个Bash shell。
我们还可以看到，首先Docker在本地没有检查到`ubuntu`的镜像，于是到Docker官方维护的仓库中去找该镜像并保存到本地。`library`则是Docker Hub上Docker官方的用户名。最后便进入到了容器内部的shell。

### 重新启动容器

该容器是一个完整的Ubuntu系统，可以用来做任何Ubuntu系统上能做的事情。在shell中输入`exit`可以返回到宿主机中，容器也随之停止。但是容器依然存在，`docker ps`命令会列出运行的容器，添加`-a`选项则可以查看所有的容器：

```bash
CONTAINER ID   IMAGE    COMMAND       CREATED   STATUS  PORTS  NAMES
f4ccf6b2b6f7   ubuntu   "/bin/bash"   A minut   Exited 	       ecstatic_agnesi
```

容器名称和ID都可以用来指定唯一的容器，`ecstatic_agnesi`启动容器时Docker随机生成的名称，也可以在`docker run`命令中添加`--name`来设置名称：

```bash
$ docker run --name my_ubuntu -i -t ubuntu /bin/bash
root@67cf6a654b21:/# exit
```

此时我们可以通过`docker start`来指定名称或者ID来运行已经停止的容器，也可以通过`docker restart`来重启一个容器，或者`docker create`来创建，但不运行一个容器：

```bash
$ docker start my_ubuntu
my_ubuntu
```

Docker容器重新启动时会沿用`docker run`指定的参数来运行，因此重启时容器会创建一个新的会话shell。此时可以通过`docker attach`命令指定名称或者ID来重新链接到某容器的会话上：

```bash
$ docker attach my_ubuntu
root@67cf6a654b21:/#
```

### 创建守护式容器

通过`docker start`我们是使停止的容器重新在后台启动了起来。同时我们也可以在`docker run`命令中添加`-d`选项来让容器在后台启动。为了使创建的容器便于验证，我们额外添加`-c`选项来指定一个在容器创建后执行的脚本：

```bash
$ docker run --name deamon_dave -d ubuntu /bin/bash -c "while true;do echo hello world;sleep 1;done"
5346fe34abd8b853dbfb6871b0a5f9da84bf80e228b0b8319eb0d0976e6bffa0
```

此时名称为deamon_dave的容器正在后台运行，我们可以通过提到的`docker ps`来查看正在运行的容器。

默认情况下如果容器创建失败是不会自动重试的，通过`--restart`选项，可以检查容器的推出代码，并判断是否需要重启容器：

```bash
$ docker run --restart=always --name deamon_dave -d ubuntu /bin/bash
```

如此以来，在容器退出的时候总会自动重启该容器。除了`always`还有`on-failure`可供选择，并且`on-failure`还可以接受一个重启次数的参数：

```bash
--restart=on-failure:2
```

### 容器日志

由于在 `-c`选项中，我们让容器启动后便循环输向`STDOUT`输出`hello world`，所以我们可以通过`docker log`命令来查看容器的输出：

```bash
$ docker logs deamon_dave
hello world
hello world
hello world
...
```

`docker log`和`tail`命令一样，也可以添加`-f`选项来跟踪容器内部的标准输出。还可以添加`--tail`选项来指定读取的最后几行内容，两条命令可以同时使用，来最终最新的日志输出；此外`-t`参数还可以为输出添加时间戳：

```bash
$ docker logs --tails 0 -f deamon_dave
$ docker logs -ft deamon_dave
```

自Docker1.6开始，可以通过`--log-driver`来选择日志驱动。除了默认的`json-file`还可以选择`syslog`来将日志输出重定向到`Syslog`；以及`none`来禁用容器中的日志输出。

### 容器内部进程

通过`docker exec`可以在容器内部启动一个新的进程：

```bash
$ docker exec -d deamon_dave touch /etc/new_config_file
```

`-d`表示在后台启动进程，之后紧跟的是需要执行的容器以及执行的命令。`touch`命令将会创建一个新的名为`/etc/new_config_file`的文件夹。从Docker1.7之后还允许添加`-u`来为执行的命令指定一个用户所属。
此外，通过`-t`和`-i`命令，还可以为我们执行进程创建tty并捕捉`STDIN`:

```bash
$ docker exec -it deamon_dave /bin/bash
```

此外`docker top`可以查看运行的容器内进程，`docker stat`可以查看容器的统计信息。

### 容器信息

除了之前提到的`docker ps`以外，`docker inspect`可以查看更加详细的容器信息：

```bash
docker inspect deamon_dave
[
    {
        "Id": "5346fe34abd8b853dbfb6871b0a5f9da84bf80e228b0b8319eb0d0976e6bffa0",
        "Created": "2021-10-17T21:41:53.586701741Z",
        "Path": "/bin/bash",
        "Args": [
            "-c",
            "while true;do echo hello world;sleep 1;done"
        ],
        "State": {
            "Status": "running",
            "Running": true,
...
```

`docker inspcet`命令还支持同时查看多个容器的信息，并且可以通过`--fomat`来选定查看结果，该选项支持任何完整的Go语言模版：

 ```bash
 $ docker inspect --format '{{ .ID.Created }}' deamon_dave deamon_dave2
 ```

### 删除守护式容器

删除容器之前必须先停止容器。`docker stop`命令将会向Docker容器发`SIGTERM`信息，停止容器。还可以使用`docker kill`发送`SIGKILL`信号来停止容器，然后通过`docker rm`删除已经停止运行的容器：

```bash
$ docker stop deamon_dave
deamon_dave
$ docker rm deamon_dave
deamon_dave
```

从Docker1.6,2开始，可以添加`-f`参数来强制删除正在运行的容器。目前还没办法一次删除所有的容器，不过可以通过以下命令来实现：

```bash
$ docker rm `docker ps -a -q`
```

`-q`选项只会返回容器的ID。



## Docker镜像和仓库
