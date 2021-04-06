# Hello Docker

Docker 两个最基本的概念`镜像(Image)`和`容器(Container)`，就类似于类跟实例的关系。

从远程仓库拉取下来的同一个镜像可以运行多个不同名称的容器。通常在运行容器时，会通过`数据卷(Volume)`将容器中的文件与宿主机的文件进行挂载，然后在宿主机中进行各种操作。Docker的镜像都是Docker的用户制作然后上传到仓库的，其使用一般都可以在[hub.docker.com](https://hub.docker.com/_/tomcat?tab=tags&page=1&ordering=last_updated&name=9)对应的容器描述中找到。

## Install

按照[docker](https://docs.docker.com/engine/install/centos/)官网步骤安装

```ruby
sudo yum install -y yum-utils

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io
# 这里选的是 20.10.3 版本
sudo yum install docker-ce-20.10.3 docker-ce-cli-20.10.3 containerd.io

sudo systemctl start docker
sudo docker run hello-world
```



## Start

### 创建用户

这里以运行一个`tomcat`的容器为例，首先创建一个名为`gradpro` 的用户

```bash
[root@vultr ~]# useradd gradpro		# => 创建名为 gradpro 的用户
[root@vultr ~]# passwd gradpro		# => 修改 gradpro 的登录密码
[root@vultr ~]# chmod u+w /etc/sudoers		# => 添加root用户对 /etc/sudoers 的写权限
[root@vultr ~]# vim /etc/sudoers
## Allows members of the 'sys' group to run networking, software,
## service management apps and more.
# %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
gradpro ALL=(ALL)       ALL		# => 添加 gradpro 用户执行所有命令的权限
[root@vultr ~]# chmod u-w /etc/sudoers		# => 撤销root用户对 /etc/sudoers 的写权限
[root@vultr ~]# su - gradpro			# => 切换用户
```



### 拉取镜像

然后在[hub.docker.com](https://hub.docker.com/_/tomcat?tab=tags&page=1&ordering=last_updated&name=9)上选择需要的版本，安装`tomcat`

```bash
[gradpro@vultr ~]$ docker pull tomcat:9.0.43-jdk8-adoptopenjdk-hotspot	# => 从远程仓库拉取镜像
```

通过`docker images `命令可以查看本地的镜像

```bash
[gradpro@vultr ~]$ docker images
REPOSITORY    TAG                                IMAGE ID       CREATED         SIZE
tomcat        9.0.43-jdk8-adoptopenjdk-hotspot   6efc12bb5db8   8 hours ago     355MB
```



### 运行容器

在`gradpro` 用户的家目录中创建文件夹，便于容器挂载文件：

```bash
[gradpro@vultr ~]$ mkdir tomcat
```

使用[`docker run`](https://docs.docker.com/engine/reference/run/)命令可以利用镜像创建容器并运行

```bash
[gradpro@vultr ~]$ docker run \
-di \								# => 后台运行，保持容器运行
--name tomcat \			# => 设置容器名
-p 8080:8080 \			# => 映射端口
-v /home/gradpro/tomcat/webapps:/usr/local/tomcat/webapps \		# 挂载Volume
-v /home/gradpro/tomcat/logs:/usr/local/tomcat/logs \
--privileged=true tomcat:9.0.43-jdk8-adoptopenjdk-hotspot			# tomcat参数

# 对于更多run的参数可以通过` docker run --help` 来查看帮助
```

执行之后通过`docker ps -a`可以查看所有容器，可以发现tomcat的容器就已经在docker中运行了，但是在页面上访问服务器的8080端口发现并没有任何响应。



### 进入容器

这个时候我们可以通过以下命令进入到容器内部查看一下：

```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]		# 添加`--help`参数查看帮助信息
```

进入容器的内部：

```bash
[gradpro@vultr ~]$ docker exec -it tomcat bash
root@adf685ff7f59:/usr/local/tomcat# 
```

查看当前目录下的`webapps`会发现是空文件。我们可以尝试在`webapps`中添加`index.html`页面，然后新启动tomcat容器，再访问页面。

其实不难发现容器内部其实就是只运行了一个tomcat的Linux环境，通常我们不会也没有必要在容器内部直接进行操作，因为容器只保证了某项目最基本的运行环境，通过数据卷的挂载，我们可以在宿主机中利用宿主机的各种工具对容器内的文件进行操作。

```bash
root@adf685ff7f59:/usr/local/tomcat# exit
```

 此时退出容器在`webapps`中创建一个`myhome/index.html`页面：

```bash
<h1>Hello Work!</h1>
<p>This is my first docker container</p>
```

然后在浏览器中访问`http://IP:8080/myhome/index.html`看到html内容



## Dockerfile

通过`Dockerfile`可以在已有镜像的基础上构建自己的镜像。以构建一个自定义的nginx镜像为例子，现有配置文件和打包项目如下：

```bash
.
├── default.conf
└── html
    ├── avatar2.jpg
    ├── color.less
    ├── css
    ├── goright.png
    ├── img
    ├── index.html
    ├── js
    ├── logo.png
    ├── tinymce
    └── v2.js
```

在当前目录创建`Dockerfile`文件：

```
FROM nginx:stable
COPY default.conf /etc/nginx/conf.d
VOLUME html
EXPOSE 80
```

需要注意的是这里的`EXPOSE`命令只是说明该镜像需要用到80端口，`VOLUME`也只是创建了一个当前目录下html文件的数据卷，只有在镜像运行并且指定端口和数据去的时候才会实际占用端口和挂载。

当前目录结构：

```bash
.
├── Dockerfile
├── default.conf
└── html
```

构建镜像，`-t`指定tag，`.`表示当前目录下构建。查看镜像列表即可看到构建的镜像：

```bash
[root@vultr ~]# docker build -t mynginx:2.0 .
....
[root@vultr ~]# docker images
REPOSITORY   TAG                                IMAGE ID       CREATED          SIZE
mynginx      2.0                                5cc5f4f9f2c9   34 minutes ago   133MB
```

运行镜像：

```bash
[root@vultr ~]# docker run -d --name mynginx -p 80:80 -v $PWD/html:/usr/share/nginx/html mynginx:2.0
```



## docker-compose

有些时候，启动一个容器会有大量的参数设置，维护起来相当困难，并且当有多个容器需要部署时，会很麻烦。

`docker-compose`就是用于「定义和运行多个 Docker 容器的应用」 

首先安装`docker-compose`

```bash
 sudo yum install docker-compose
```

添加`docker-compose.yml`

```yaml
version: "3.9"
services:
  app:
    build: ./nginx
    ports:
      - 80:80
    volumes:
      - $PWD/nginx/html:/usr/share/nginx/html
```

```bash
.
├── docker-compose.yml
└── nginx
```

运行

```bash
[root@vultr ~]# docker-compose up -d
[root@vultr ~]# docker ps -a
CONTAINER ID   IMAGE                                     COMMAND                  CREATED          STATUS                    PORTS                NAMES
d904f1786a9a   docker_app                                "/docker-entrypoint.…"   39 seconds ago   Up 37 seconds             0.0.0.0:80->80/tcp   docker_app_1
```

`docker-compose.yml`文件中的配置其实就相当于`docker run`命令中的各项配置



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
docker rmi IMAGE_ID				# 删除镜像
docker ps -a 							# 查看所有容器
docker start 容器名称			 # 启动某个容器
docker stop 容器名称			 # 停止某个容器
docker stop $(docker ps -qa)			# 停止所有容器
docker rm $(docker ps -qa)				# 删除所有容器
docker restart $(docker ps -qa)		# 重启所有容器
docker rm 容器id					 # 删除某个容器
docker stats							# 查看容器内存占用

docker run [OPTIONS] IMAGE [COMMAND] [ARG...]				# 运行容器（可以通过--help参数查看帮助）
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]		# 进入容器（可以通过--help参数查看帮助）
docker logs [OPTIONS] CONTAINER											# 查看容器日志
docker cp FILE CONTAINER_ID:CONTAINER_PATH					# 将宿主机中的文件复制到容器中
docker cp CONTAINER_ID:CONTAINER_FILE PATH					# 将容器中的文件复制到宿主机中
```
