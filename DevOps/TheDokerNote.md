# The Docker Note

## 简介

至于为什么要使用Docker网络上有很多文章都有讲到，这里就不赘述了。这里主要基于 James Turnbull 的《第一本Docker书》做一些简单的笔记。但在入门之前还是有必要先了解一下Docker的轮廓。

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



## Docker镜像

Docker镜像是由文件系统叠加而成的。在Docker里，root文件系统永远只能是读状态， 并且利用[联合加载](https://en.wikipedia.org/wiki/Union_mount)技术，在root文件系统层上加载更多的只读文件。利用联合加载将各层文件系统叠加在一起，最终的文件系统会包含所有底层的文件和目录，Docker将这样的文件称为镜像。
一个镜像可以基于另外一个镜像创建，最底部的镜像被称为基础镜像。当从一个镜像启动容器时，Docker会在镜像的最顶层加载一个读写文件系统。第一次启动该容器时，该读写文件系统是空的，当文件系统发生变化时，对应发生变化的文件会先从该读写层下吗的只读层复制到该读写层，然后这些变化都会应用在当前层上。这种机制通常被称为写时复制。
写时复制使得每一层Docker镜像生成之后都是只读到，并且之后也不会发生变化。利用Docker镜像的分层架构，加上容器可以修改并持有自己状态的特点，用户可以快速构建包含我们自己应用程序的容器。

### 获取镜像

镜像保存在仓库中，可以从仓库下载下来。仓库存在于Registry中，默认的Registry是Docker Hub，有Docker公司运营。Docker的Registry跟Git仓库很相似，用于保存包括镜像、层以及关于镜像的元数据。

在上一章中我们通过`docker run`自动拉取并运行了`ubuntu`的镜像。现在我们可以通过以下命令来拉取指定版本的镜像：

```bash
$ docker pull ubuntu:12.04
```

我们拉取了版本为12.04的`ubuntu`镜像，其中的版本被称为`tag`。在通过镜像启动容器时也可以指定镜像的tag：

```bash
$ docker run -it --name new_ubuntu ubuntu:12.04 /bin/bash
```

如果在运行`docker pull`或者`docker run`命令时没有指定`tag`，则默认使用的是`lates`标签。然后可以通过以下任意一条命令列出所有的已经下载到本地的镜像，添加镜像名还可以指定查看某些镜像：

```bash
$ docker images <镜像名>
$ docker image list <镜像名>
```

通过以下命令还可以在Docker Hub上查找公共的可用镜像：

```bash
$ docker search <镜像名>
```

### **构建镜像**

正如之前提到的，通常构建镜像并不是真的创建镜像，而是基于一些镜像构建新的镜像。构建镜像有以下两种方式：

* 使用`docker build`和`Dockerfile`文件构建
* 使用`docker commit`命令

通过`docker commit`命令来构建镜像的弊端在于，构建的过程并没有行程配置。不能快速直观的再次构建一个类似的镜像，因此通常不推荐此种做法。目前使用最多的是通过`Dockerfile`和`docker build`命令来构建镜像。
首先我们需要在Docker Hub创建账号并通过命令登录：

```bash
$ docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: xxx
Password:
```

#### **基于Dockerfile构建**

`Dockerfile`使用基本DSL（Domain Specific Language）语法指令来构建镜像，这使得镜像的构建过程更具备可重复性，透明性以及**幂等性**。

让我们用`Dockerfile`的方式来重新构建一下刚才的镜像。首先创建一个文件夹，并在其中创建一个`Dockerfile`文件：

```bash
$ mkdir my_apache2 && cd my_apache2 && touch Dockerfile
```

然后在`Dockerfile`文件中添加一下内容：

```dockerfile
FROM ubuntu:22.04
MAINTAINER Dokiy "dokiy@4399.com"
ENV REFRESHED_AT 2021-12-11
RUN apt-get -y update 
RUN apt-get -y install apache2
```

最后在`Dockerfile`同级目录执行`docker build`命令：

```bash
$ docker build -t="dokiy/my_apache:webserver2" .
...
 => [1/3] FROM docker.io/library/ubuntu:22.04@sha256:f154feaf13b51d1
 => [2/3] RUN apt-get -y update
 => [3/3] RUN apt-get -y install apache2
...
```

其中`-t`选项指定用户名和仓库以及标签；命令最后的是所执行的路径，也就是`Dockerfile`所在的路径。并且可以通过`-f`选项来指定该文件路径。

此外通过`docker build`构建镜像时会将当前目录作为构建上下文。通常有些文件我们并不希望在构建时被加入，可以在构建上下文中添加一个名为`.dockerignore`的文件，并设置匹配过滤文件的规则，这和`.gitignore`非常相似。

如果在构建镜像时发生了错误，比如`apache2`写成了`apachee2`，在构建时也会输出错误信息：

```bash
$ docker build -t="dokiy/my_apache:webserver2" .
...
 => [1/3] FROM docker.io/library/ubuntu:22.04@sha256:f154feaf13b51d16e2b4
 => CACHED [2/3] RUN apt-get -y update
=> ERROR [3/3] RUN apt-get -y install apachee2
------
 > [3/3] RUN apt-get -y install apachee2:
#6 0.336 Reading package lists...
#6 0.983 Building dependency tree...
#6 1.140 Reading state information...
#6 1.152 E: Unable to locate package apachee2
------
```

此时我们可以根据错误信息修改`Dockerfile`文件中的相关指令，并再次尝试构建。

#### 构建缓存

此外我们可以发现，在执行构建命令`RUN apt-get -y update`时，使用了cache。
`docker build`在构建镜像时，会默认将之前创建过的镜像当作缓存，并作为新镜像的开始点。如果想略过缓存构建的话，可以添加`--no-cache`选项 :

```bash
$ docker build -t="dokiy/my_apache:webserver2" --no-cache .
```

还有一种方法略过缓存的方法就是利用之前我们在`Dockerfile`中添加的`ENV REFRESHED_AT`。
Docker的缓存构建是基于该层的指令没有改变的情况下运行的。也就是说，如果我们更新了任意一层的指令，该层包括其后的指令都将重新构建。所以当我们修改`ENV REFRESHED_AT`时，后面的指令也将跳过缓存重新构建镜像层。

还有一点之前没有提到的就是，在当前的`Dockerfile`中，两个`RUN`指令都构建了单独的镜像层。在需要多次调试构建镜像的情况下，可以有效的利用到之前构建的缓存。但每层镜像层都会需要额外的资源开销，所以通常会在最终的确定构建中，将两条`RUN`合并成一条。`Dockerfile`内容如下：

```dockerfile
FROM ubuntu:22.04
MAINTAINER Dokiy "dokiy@4399.com"
ENV REFRESHED_AT 2021-12-11
RUN apt-get -y update \
    && apt-get -y install apache2
```

#### 逆构建

如果想查看一个镜像的构建过程，可以通过`docker history`来查看，例如：

```bash
$ docker history dokiy/my_apache:webserver2
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
d0dfe98c7d4f   5 seconds ago   RUN /bin/sh -c apt-get -y update     && apt-…   143MB     buildkit.dockerfile.v0
<missing>      5 seconds ago   ENV REFRESHED_AT=2021-12-11                     0B        buildkit.dockerfile.v0
<missing>      5 seconds ago   MAINTAINER Dokiy "dokiy@4399.com"               0B        buildkit.dockerfile.v0
<missing>      7 days ago      /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>      7 days ago      /bin/sh -c #(nop) ADD file:1e60bfbe5a32672bf…   76.3MB
```

还有一些开源的工具，可以直接根具镜像生成对应的`Dockerfile`，比如[dfimage](https://github.com/LanikSJ/dfimage)。用法也相当简单：

```bash
$ docker run -v /var/run/docker.sock:/var/run/docker.sock dfimage dokiy/my_apache:webserver2
```

```bash
Analyzing dokiy/my_apache:webserver2
Docker Version:
GraphDriver: overlay2
Environment Variables
|PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
|REFRESHED_AT=2021-12-11

Image user
|User is root

Potential secrets:
|Found match etc/ssl/private/ssl-cert-snakeoil.key openssl .key, apple .keychain, etc. \.key$ c6ba8162047db0ce0a0346c22611329fbbf11765f72c90d9d32d5443bf969f10/layer.tar
Dockerfile:
CMD ["bash"]
MAINTAINER Dokiy "dokiy@4399.com"
ENV REFRESHED_AT=2021-12-11
RUN apt-get -y update  \
	&& apt-get -y install apache2 # buildkit
```



### Dockerfile指令

#### RUN

`RUN`命令用于指定在镜像在构建中需要执行的命令。`RUN`命令有两种形式：

```bash
RUN <command>
RUN ["executable", "param1", "param2"]
```

如果采用command的形式，默认会使用`/bin/sh -c`来运行命令，这有可能导致一些意料之外的行为，所以Docker一直建议使用第二种方式来设置需要执行的命令。
正如之前提到的，每条`RUN`指令都会构建单独的镜像层，所以通常会把多条`RUN`指令合并。

#### CMD

`CMD`用来指定一个容器启动时需要执行的命令。`CMD`指令只能指定一条，如果指定了多条则只有最后一条会生效。
此外，`CMD`指令跟`docker run`指定的命令很类似，同时也可以被`docker run`命令覆盖，比如一下两种方式是等价的：

```dockerfile
CMD ["/bin/bash"]
```

```bash
$ docker run -it ubuntu:22.04 /bin/bash
```

可以看到`CMD`指令也可以通过数组的方式来指定。

#### ENTRYPOINT

`ENTRYPOINT`跟`CMD`很类似，都是用于指定容器启动时需要执行的命令，但是`ENTRYPOINT`指令提供的指令不容易在容器启动时被覆盖。
`docker run`命令指定的参数会被当作参数传入`ENTRYPOINT`指令。如果确实需要，也可以通过`docker run`的`--entrypoint`选项来覆盖。
`ENTRYPOINT`可以和`CMD`同时使用：

```dockerfile
ENTRYPOINT ["/bin/bash","ls"]
CMD ["-a"]
```

通常使用`ENTRYPOINT`在容器中运行特定的程序以占用`PID1`进程，以防止出现僵尸进程，比如[`tini`](https://github.com/krallin/tini)。具体可参见：[What is advantage of Tini?](https://github.com/krallin/tini/issues/8)

#### WORKDIR

`WORKDIR`用来设置容器内部的工作目录，`/`、`ENTRYPOINT`或`CMD`指定的程序会在该目录下执行。`WORKDIR`可以多次设置切换目录。同时可以通过`docker run`的`-w`选项来覆盖。

#### ENV

`ENV`用于在镜像构建过程中设置环境变量，设置的环境变量可以在后续的指令中使用。并且可以同时设置多个环境变量。

```dockerfile
ENV VERSION=1.0 WORK_PATH=/home/dokiy
WORKDIR $WORK_PATH
```

设置的变量将会被持久的保存到镜像构建的容器中。同时也可以通过`docker run`的`-e`选项来设置环境变量，但是这样设置的变量只会在运行时有效。

#### USER

`USER`用于指定该镜像会以什么用户去运行。可以指定用户或UID以及组或GID，甚至是两者的组合：

```dockerfile
USER uid
USER group
USER uid:gid
```

如果没有指定，默认会以`root`账户来运行。同时也可以通过`docker run`的`-u`选项来覆盖指定的值。

#### VOLUME

`VOLUME`指令用来向基于镜像创建的容器添加卷。一个卷是可以存在于一个或者多个容器内的特定的目录，这个目录可以跳过联合文件系统，将容器内的数据持久化到宿主机或者在多个容器中共享数据。可以通过一下方式来创建卷：

```dockerfile
VOLUMNE ["/data"]
VOLUMNE ["/opt/project","/data"]		#  创建多个卷
```

值得注意的是，`VOLUME`指令创建的数据卷默认会写到 `/var/lib/docker/volumes`中，并且是无法指定宿主机上的目录的。这与`docker run`的`-v`选项不同，通过`-v`指定的数据卷可以与宿主机上的目录绑定，但只能对创建的容器生效。

#### ADD

`ADD`指令会基于构建环境的下的文件或者目录复制到镜像中。`ADD`需要指定源文件地址和目标地址，也可以直接使用URL来作为源文件地址。

```dockerfile
ADD software.lic /opt/application/software.lic
ADD http://www.4399.com/test.zip /root/test.zip
```

如果指定的目标地址不存在，Docker会为我们自动创建该路径，并且如果将一个归档文件制定为源文件，Docker会自动将文件解包，但目标地址已经存在了同名文件则不会将其覆盖。

#### COPY

`COPY`指令与`ADD`非常类似，但`COPY`只会将构建上下文中复制本地文件，而不会对归档文件做提取和解压。用法如下：

```dockerfile
COPY conf.d/  /etc/apache2/
```

此外`COPY`的源文件地址只能是当前构建路径同一目录下的文件，并且目标地址必须是容器内部的一个绝对路径。

#### ONBUILD

`ONBUILD`可以为镜像添加一个触发器，当该镜像被用作基础镜像时才会被执行。

```docker
ONBUILD RUN echo 'hello work!'
```

`ONBUILD`指令会在被作为基础镜像的`FROM`指令后执行。但是这也只能被触发一次，也就是说只会在子镜像中执行，而不会在孙子镜像中执行。此外，`ONBUILD`不能递归调用，也不能指定`FROM`、`MAINTAINER`命令。



### Docker Registry

只需要运行一下的代码就可启动一个本地Registry应用的容器：

```bash
docker run -p 5000:5000 registry
```

如果我们需要将自己构建的镜像推送到本地的仓库，则需要先对镜像打上标签，然后在进行推送： 

```bash
docker tag d0dfe98c7d4f localhost:5000/dokiy/myapache
docker push localhost:5000/dokiy/myapache
```

标签必须是`[仓库地址]/[用户名]/[镜像名]`。如果缺少仓库地址，Docker会默认推送到Docker Hub。如果缺少用户名，Docker会默认推送到官方用户`library`下。

```bash
docker push myapache
Using default tag: latest
The push refers to repository [docker.io/library/myapache]
tag does not exist: myapache:latest
```



# 常用命令

## Docker命令

```bash
docker -v			# 查看版本
# docker 是服务器-客户端模式的程序，所有需要先启动
systemctl start docker		# 启动
systemctl stop docker			# 启动
systemctl status docker		# 查看状态
systemctl restart docker	# 重启
systemctl reload docker		# 修改配置后重新加载
systemctl enable docker		# 设置开机启动
systemctl disable docker	# 禁止开机启动

docker pull [IMAGE_NAME]:[VERSION]		# 拉取镜像

docker images 						# 查看所有镜像
docker rmi [IMAGE_ID]		  # 删除镜像
docker ps -a 							# 查看所有容器
docker start [容器名称]		 # 启动某个容器
docker stop [容器名称]		 # 停止某个容器
docker stop $(docker ps -qa)			# 停止所有容器
docker rm $(docker ps -qa)				# 删除所有容器
docker rmi $(docker images | grep "lalal" | awk '{print $3}') # 删除名称带'lalal'的镜像
docker restart $(docker ps -qa)		# 重启所有容器
docker rm 容器id					 # 删除某个容器
docker stats							# 查看容器内存占用

docker run [OPTIONS] IMAGE [COMMAND] [ARG...]				# 运行容器（可以通过--help参数查看帮助）
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]		# 进入容器（可以通过--help参数查看帮助）
docker logs [OPTIONS] CONTAINER											# 查看容器日志
docker cp FILE CONTAINER_ID:CONTAINER_PATH					# 将宿主机中的文件复制到容器中
docker cp CONTAINER_ID:CONTAINER_FILE PATH					# 将容器中的文件复制到宿主机中
```



## Docker-compose命令

```bash
docker-compose up			# 启动服务
docker-compose up	-d	# 后台启动服务
docker-compose stop		# 停止服务
docker-compose down		# 停止并删除容器
docker-compose -f [文件路径]	[COMMAND] # 制定文件路径
```



## log

```bash
$ docker logs [OPTIONS] CONTAINER
  Options:
      --details        Show extra details provided to logs
  -f, --follow         Follow log output
      --since string   显示某时间之后的日志(e.g. 2013-01-02T13:23:37Z) or (e.g. 42m for 42 minutes)
  -n, --tail string    显示最后N行的日志，默认为显示所有
  -t, --timestamps     显示时间戳
      --until string   显示某时间之前的日志(e.g. 2013-01-02T13:23:37Z) or (e.g. 42m for 42 minutes)
```

查看某时间段段日志：

```bash
$ docker logs -t --since="2018-02-08T13:23:37" --until "2018-02-09T12:23:37" CONTAINER_ID
$ docker logs -t --since="42m" CONTAINER_ID
```

查看后100行日志：

```bash
$ docker -n=100
$ docker --tail=100
```

跟踪最新日志输出：

```bash
$ docekr -n=0 -f
```

