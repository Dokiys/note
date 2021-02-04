# Docker Start

## 1.创建用户

```bash
[root@vultr ~]# useradd gradpro		# => 创建名为 gradpro 的用户
[root@vultr ~]# passwd gradpro		# => 修改 gradpro 的登录密码
[root@vultr ~]# su - gradpro			# => 切换用户
```

根据[docker](https://docs.docker.com/engine/install/centos/)官网安装，我这里是`CentOS`，当安装时会提示

```bash
[gradpro@vultr ~]$ sudo yum install -y yum-utils
[sudo] password for gradpro:
gradpro is not in the sudoers file.  This incident will be reported.
```

因为`gradpro`用户没有`sudo`权限，我们需要切换回`root`为其添加权限

这里也可以参照[docker doc](https://docs.docker.com/engine/install/linux-postinstall/)中的文档，先用`root`用户执行第2步安装，然后再将用户添加到`docker`组：

```bash
[gradpro@vultr ~]$ su - root
[root@vultr ~]# sudo groupadd docker
[root@vultr ~]# sudo usermod -aG docker gradpro		# => 添加用户到docker组
[root@vultr ~]# newgrp docker 										# => 应用组修改
```

对用户单独添加权限：

```bash
[gradpro@vultr ~]$ su - root
[root@vultr ~]# chmod u+w /etc/sudoers		# => 添加root用户对 /etc/sudoers 对写权限
[root@vultr ~]# vim /etc/sudoers
## Allows members of the 'sys' group to run networking, software,
## service management apps and more.
# %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
gradpro ALL=(ALL)       ALL		# => 添加 gradpro 用户执行所有命令的权限
[root@vultr ~]# chmod u-w /etc/sudoers		# => 撤销root用户对 /etc/sudoers 对写权限
```

## 2.Install Docker

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



### 常用命令

将会用到的命令

```bash
docker -v			# 查看版本
# docker 是服务器-客户端模式的程序，所有需要先启动
systemctl start docker	# 启动
systemctl status docker	# 查看状态
systemctl restart docker	# 重启
systemctl enable docker		# 设置开机启动
systemctl disable docker	# 禁止开机启动

docker pull [IMAGE_NAME]:[VERSION]

docker images 	# 查看所有镜像
docker rmi IMAGE_ID	# 删除镜像
docker ps -a 	# 查看所有容器
docker start 容器名称		# 启动某个容器
docker stop 容器名称		# 停止某个容器
docker rm 容器id				# 删除某个容器

docker run [OPTIONS] IMAGE [COMMAND] [ARG...]		# 运行容器（可以通过--help参数查看帮助）
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]	# 进入容器（可以通过--help参数查看帮助）
```



### Tomcat

在[hub.docker.com](https://hub.docker.com/_/tomcat?tab=tags&page=1&ordering=last_updated&name=9)上选择需要的版本，然后安装`tomcat`

```bash
[gradpro@vultr ~]$ docker pull tomcat:9.0.43-jdk8-adoptopenjdk-hotspot
[gradpro@vultr ~]$ docker image list			# => 查看镜像
REPOSITORY    TAG                                IMAGE ID       CREATED         SIZE
tomcat        9.0.43-jdk8-adoptopenjdk-hotspot   6efc12bb5db8   8 hours ago     355MB
hello-world   latest                             bf756fb1ae65   13 months ago   13.3kB
```

在`gradpro` 用户的家目录中创建文件夹，便于容器挂载文件：

```bash
[gradpro@vultr ~]$ mkdir tomcat
```

运行镜像`tomcat:9.0.43-jdk8-adoptopenjdk-hotspot`

```bash
[gradpro@vultr ~]$ docker run -di --name tomcat -p 8080:8080 -v /home/gradpro/tomcat:/usr/local/tomcat/webapps --privileged=true tomcat:9.0.43-jdk8-adoptopenjdk-hotspot
```

```
-v : 将容器中的 /usr/local/tomcat 挂载到宿主机的 /usr/local/tomcat
-p : 端口映射
--name : 容器名称
-di : -d -i 可通过 docker run --help 查看
```

进入容器将`webapps.dist`中的文件拷贝到`webapps`中，

```bash
[gradpro@vultr ~]$ docker exec -it tomcat /bin/bash
root@adf685ff7f59:/usr/local/tomcat# mv webapps.dist/* webapps
# 可以看到其中的文件其实就是tomcat原来webapps中的文件，
# 因为webapps文件夹已经被我们挂载到了宿主机中所有这里开始是空的
root@adf685ff7f59:/usr/local/tomcat# ll webapps
total 32
drwxr-xr-x  7 root root 4096 Feb  3 10:04 ./
drwxr-xr-x  1 root root 4096 Feb  3 01:48 ../
drwxr-xr-x 15 root root 4096 Feb  3 01:48 docs/
drwxr-xr-x  7 root root 4096 Feb  3 01:48 examples/
drwxr-xr-x  6 root root 4096 Feb  3 01:48 host-manager/
drwxr-xr-x  6 root root 4096 Feb  3 01:48 manager/
drwxr-xr-x  3 root root 4096 Feb  3 01:48 ROOT/
root@adf685ff7f59:/usr/local/tomcat# rm -rf webapps.dist/
```

 此时退出容器在家目录中查看`tomcat`文件夹中的内容是和`tomcat`容器中`webapps`目录下一样的

在其中创建一个`myhome/index.html`页面：

```bash
<h1>Hello Work!</h1>
<p>This is my first docker container</p>
```

然后在浏览器中访问`http://IP:8080/myhome/index.html`看到html内容即部署成功！

