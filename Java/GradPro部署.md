# GradPro部署

记录一下之前做的一个项目的部署过程，源码地址 [![Github stars](https://img.shields.io/github/stars/Dokiys/note?style=social)](https://github.com/Dokiys/GradPro) 

分别需要部署`nignx`、`mysql5.7`、`redis`以及`tomcat9`

本文的所以部署，只为能将以前一个项目能访问，只为做个记录，并非最佳实践。

代码打包和部署都可参考[Jeecg-Boot技术文档V2.0](http://jeecg-boot.mydoc.io/?t=345683)，这里采用的war包部署方式



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

## 2.安装环境

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

安装`docker-compose`

```bash
 sudo yum install docker-compose
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
[gradpro@vultr ~]$ docker run -di --name tomcat -p 8080:8080 \
-v /home/gradpro/tomcat/webapps:/usr/local/tomcat/webapps \
-v /home/gradpro/tomcat/logs:/usr/local/tomcat/logs \
--privileged=true tomcat:9.0.43-jdk8-adoptopenjdk-hotspot
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



### redis

同样的方式安装`redis`

```bash
[gradpro@vultr ~]$ docker pull redis:5.0
```

启动`redis`容器并设置密码

```bash
docker run -d --name redis -p 6379:6379 -v /home/gradpro/redis:/usr/local/redis redis:5.0 --requirepass "3887541fd098"
```

进入`redis`容器

```bash
[gradpro@vultr ~]$ docker exec -it redis redis-cli
```



### mysql

```bash
[gradpro@vultr ~]$ docker pull mysql:5.7.30
```

```bash
[gradpro@vultr ~]$ docker run -d --name mysql57 \
-p 3306:3306 \
-v /home/gradpro/docker/mysql57/conf:/etc/mysql \
-v /home/gradpro/docker/mysql57/logs:/var/log/mysql \
-v /home/gradpro/docker/mysql57/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=3887541fd098 \
-e TZ=Asia/Shanghai \
--restart always  \
mysql:5.7.30 \
--lower_case_table_names=1 \
--default-time_zone='+8:00'
```

进入`mysql`容器

```bash
[gradpro@vultr ~]$ docker exec -it mysql57 /bin/bash
root@833f62192e95:/# mysql -u root -p				# => 输入密码[3887541fd098]登录mysql
```

能登录成功之后就可以利用`navicat`等工具远程连接`mysql`创建相关`DATABASE`和数据表，这里导入的是项目目录下的`jeecg-boot/db/2jeecgboot_mysql5.7.sql`



### nginx

```bash
docker pull nginx:stable
```

```bash
docker run -d --name nginx \
-p 80:80 \
-v /home/gradpro/nginx/html:/usr/share/nginx/html \
nginx:stable
```

```bash
docker exec -it nginx /bin/bash
```

因为我需要修改`nginx`中的配置，进入到`nginx`容器中查看`/etc/nginx/nginx.conf`文件可以看到：

```bash
include /etc/nginx/conf.d/*.conf;
```

其中引入了`conf.d`下的所有配置文件，进入到该目录，可以看到一个`default.conf`的配置，将我们需要的配置替换掉即可。当然该操作不应该在容器中进行。

我们可以新建一个`default.conf`文件其内容如下：

```conf
server {
    listen       80;
    server_name  207.148.117.37;

    #后台服务配置，配置了这个location便可以通过http://域名/jeecg-boot/xxxx 访问
    location ^~ /jeecg-boot {
        proxy_pass              http://207.148.117.37:8080/jeecg-boot/;
        proxy_set_header        Host 207.148.117.37;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    #解决Router(mode: 'history')模式下，刷新路由地址不能找到页面的问题
    location / {
    		# 如下的root配置如果在docker容器中可能会被定位到/etc/nginx/html
        # root   html; 
        root		/usr/share/nginx/html;
        index  index.html index.htm;
        if (!-e $request_filename) {
            rewrite ^(.*)$ /index.html?s=$1 last;
            break;
        }
    }
}
```

然后将该文件copy到容器中：

```bash
docker cp default.conf nginx:/etc/nginx/conf.d/
# 重启容器
docker restart nginx
```



## 3.启动项目

可以先用`navicat`,`rdm`等工具远程连接数据库和redis，以检查是否能连接。

确保可以连接后开始部署项目。

### 后台项目

1. pom.xml文件中项目打包格式设置为war

<packaging>war</packaging> 具体配置如下：

```xml
  <modelVersion>4.0.0</modelVersion>
    <groupId>org.jeecgframework.boot</groupId>
    <artifactId>jeecg-boot-module-system</artifactId>
    <version>2.0.0</version>
    <packaging>war</packaging>
```

2. pom.xml文件删除插件spring-boot-maven-plugin 下面配置删除

```xml
<build>
   <plugins>
    <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
   </plugins>
</build>
```

3. 增加项目web容器部署的支持： 修改类/src/main/java/org/jeecg/JeecgApplication.java 代码如下：

```java
package org.jeecg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
public class JeecgApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(JeecgApplication.class);
    }


    public static void main(String[] args) {
        System.setProperty("spring.devtools.restart.enabled", "true");
        SpringApplication.run(JeecgApplication.class, args);
    }
}
```

4. 修改配置文件，然后` maven package `打war包

最后将生成的war包更名为`jeecg-boot.war`放入tomcat的`webapps`目录下，运行tomcat



### 前台项目

确定能连接以后将前端项目`build`，然后将生成的文件放入`nginx`的`html `文件夹中。

然后修改nginx的配置文件`nginx.conf`，我这里是在`/etc/nginx`目录下

```js
server {
        listen       80;
        server_name  你的域名;

        #后台服务配置，配置了这个location便可以通过http://域名/jeecg-boot/xxxx 访问        
        location ^~ /jeecg-boot {
            proxy_pass              http://127.0.0.1:8080/jeecg-boot/;
            proxy_set_header        Host 127.0.0.1;
            proxy_set_header        X-Real-IP $remote_addr;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        #解决Router(mode: 'history')模式下，刷新路由地址不能找到页面的问题
        location / {
            root   html;
            index  index.html index.htm;
            if (!-e $request_filename) {
                rewrite ^(.*)$ /index.html?s=$1 last;
                break;
            }
        }
    }
```



## 4.总结

在实际部署过程中，由于之前的服务器配置太低，最后将tomcat和nginx直接部署在了一台服务器上，docker启动redis容器，又单独一台服务器用docker运行mysql容器。

这里也记录一下Tomcat和Nginx的安装过程

### Tomcat

以下内容摘抄自[如何在CentOS 7上安装Tomcat 9](https://www.myfreax.com/how-to-install-tomcat-9-on-centos-7/)

1. 安装jdk

```bash
sudo yum install java-1.8.0-openjdk-devel
```

2. 安装tomcat

```bash
wget https://www-eu.apache.org/dist/tomcat/tomcat-9/v9.0.41/bin/apache-tomcat-9.0.41.tar.gz
tar -xf apache-tomcat-9.0.14.tar.gz
```

使用的项目代码使用 `systemctl`启动`logback`会报错，暂时没找到原因。所以这里没有按照教程中的让Tomcat作为服务启动，直接在其根目录下用`./startup.sh`启动的

3. 设置防火墙

```bash
sudo firewall-cmd --zone=public --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

4. 设置Tomcat Web管理

```xml
# 在tomcat根目录下 /conf/tomcat-users.xml 文件中添加管理角色
<tomcat-users>
<!--
    Comments
-->
   <role rolename="admin-gui"/>
   <role rolename="manager-gui"/>
   <user username="admin" password="admin_password" roles="admin-gui,manager-gui"/>
</tomcat-users>
```

```xml
# 在tomcat的默认项目manager中修改配置文件 /webapps/manager/META-INF/context.xml
# 允许IP访问Web页面
<Context antiResourceLocking="false" privileged="true" >
<!--
  <Valve className="org.apache.catalina.valves.RemoteAddrValve"
         allow="127\.\d+\.\d+\.\d+|::1|0:0:0:0:0:0:0:1" />
-->
</Context>
```



### Nginx

以下内容摘抄自[[2019 年如何在 CentOS 7 上安装最新版 Nginx](https://segmentfault.com/a/1190000018109309)]

1. 安装`EPEL`仓库，然后用`yum`安装`nginx`

```bash
sudo yum install epel-release
sudo yum install nginx
```

2. 以服务启动`nginx`

```bash
sudo systemctl enable nginx
```

在安装nginx的时候应会有一个名为`nginx.service`的文件，在上文[如何在CentOS 7上安装Tomcat 9](https://www.myfreax.com/how-to-install-tomcat-9-on-centos-7/)中有将Tomcat作为服务启动的例子，其中就有手动创建`tomcat.service`文件。然后利用`systemctl`便可以启动和查看nginx运行状态

其他`systemctl`命令可以参考[Docker命令](#Docker命令)

3. 设置防火墙

```bash
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload
```

安装完成后可以使用

```bash
whereis nginx
```

来查看nginx的路径，其中 `/etc/nginx/nginx.conf`为主配置文件，项目存放在`/usr/share/nginx/html`



### Docker命令

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

docker pull [IMAGE_NAME]:[VERSION]

docker images 						# 查看所有镜像
docker rmi IMAGE_ID				# 删除镜像
docker ps -a 							# 查看所有容器
docker start 容器名称			 # 启动某个容器
docker stop 容器名称			 # 停止某个容器
docker stop $(docker ps -qa)	
docker rm $(docker ps -qa)
docker images
docker restart $(docker ps -qa)	
docker rm 容器id					 # 删除某个容器
docker stats							# 查看容器内存占用

docker run [OPTIONS] IMAGE [COMMAND] [ARG...]				# 运行容器（可以通过--help参数查看帮助）
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]		# 进入容器（可以通过--help参数查看帮助）
docker logs [OPTIONS] CONTAINER											# 查看容器日志
docker cp FILE CONTAINER_ID:CONTAINER_PATH					# 将宿主机中的文件复制到容器中
```



### 使用到的Linux命令

```bash
tar -czvf ***.tar.gz		#压缩
tar -xzvf ***.tar.gz		#解压缩
```

> **-c** ：create
>
> **-x** ：打开归档文件
>
> **-z** ：压缩
>
> **-v** ：view
>
> **-f** ：归档名，应用在最后一个参数，后直接跟归档文件名，再跟需要归档的文件

```bash
# 手动清理系统缓存
echo 1 > /proc/sys/vm/drop_caches
echo 1 > /proc/sys/vm/compact_memory

# 查看内存使用
ps aux --sort -rss
free -h

# 上传文件
scp -r /path/local_filename username@servername:/path 
```

