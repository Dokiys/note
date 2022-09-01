# 常用工具

## expect

expect可以对程序输出做出回应，以达到用脚本实现一些交互式命令的使用：

```bash
echo '#!/usr/bin/expect
set timeout -1
spawn apt-get -y --no-install-recommends install libreoffice
expect {
"Geographic area:" {exp_send "6\r";exp_continue}
"Time zone:" {exp_send "70\r"}
"Processing triggers for libc-bin (2.34-0ubuntu3) ..." {}
}
expect eof' > libreoffice.exp
```



## envsubst

envsubst会根据环境变量替换模板中的变量，然后生成指定名称的文件。
在MacOS，CentOS等系统中，起包含在gettext工具中。

```bash
$ cat temp.yml
vars:
  ADD: ${ADD}
$ export ADD=1.1.1.1
$ envsubst <temp.yml> add.yml
$ cat add.yml
vars:
  ADD: 1.1.1.1
```

当文件中有多个变量时，需要制定替换的具体变量名：

```bash
$ envsubst 'ADD' <temp.yml> add.yml
```



## goreman

[Goreman](https://github.com/mattn/goreman) 是一个[Foreman](https://github.com/ddollar/foreman)的Go语言的克隆版本，一般在开发过程中的调试多个进程时使用。
安装：

```bash
$ go get github.com/mattn/goreman
```

Goreman基于命令行同级目录下的`Procfile`文件来运行，采用`[进程名]:[shell脚本]`的格式：

```procfile
server1: ./server -name="S1"
server1: ./server -name="S2"
```

常用命令：

```bash
goreman check				# 检查Procfile配置
goreman start				# 运行
goreman -f myprocfile start				# 通过指定文件运行(默认为Procfile)
goreman run status	# 查看状态
goreman run stop PROCESS_NAME			# 停止某个进程
goreman run start PROCESS_NAME		# 启动某个进程
goreman run restart PROCESS_NAME	# 重启某个进程
```



## libreoffice

[Libreoffice](https://www.libreoffice.org/)是一个免费开源的办公套件，其提供的命令行工具`soffice`可以用于文档对`pdf`、`html`、`txt`甚至图片的转换，以下是在ubuntu系统下安装libreoffice的Dockerfile文件和使用示例：

```dockerfile
FROM ubuntu:jammy-20211029
WORKDIR ~/
RUN apt-get update \
	&& apt-get -y --no-install-recommends install libreoffice
RUN mkdir -p /data/file
VOLUME ["/data/file"]
```

```bash
$ build -t libreoffice .
$ docker run -it -v /Users/admin/dokiy/test/file:/data/file libreoffice /bin/bash
root@a316d1f6e778:soffice --headless --convert-to html --outdir /data/file /data/file/1.xlsx
```



## openssl

利用`openssl`可以生成一个随机密码：

```bash
openssl rand -base64 10
```



## pbcopy

`pbcopy`可以将输出重定向到剪切板：

```bash
cat 1.txt | pbcopy
```

对应还有`pbpaste`从剪切板输出：

```bash
# 粘贴重定向到文件流
pbpaste>1.txt
# 追加到文件末尾
pbpaste>>1.txt
```



## pushd、popd、dirs

`dirs`：查看当前记录的文件目录栈，返回的第一个目录始终是当前所在目录
`pushd`：进入指定目录并添加到文件目录栈
`popd`：进入文件目录栈中第一个目录推出

```bash
➜  ~												# 初始目录
➜  ~ dirs										# 查看文件目录栈
~
➜  ~ pushd ./dokiy/010			# 将目录[./dokiy/010]推入文件目录栈
~/dokiy/010 ~
➜  ~/dokiy/010 popd					# 将[./dokiy/010]推出文件目录栈
~
➜  ~
```

此外，如果`pushd`没有指定参数，可以在最近的两个目录中来回切换

```bahs
➜  ~ cd dokiy/010
➜  ~/dokiy/010 dirs
~/dokiy/010 ~
➜  ~/dokiy/010 pushd
~ ~/dokiy/010
➜  ~ pushd
~/dokiy/010 ~
➜  ~/dokiy/010
```



## scp

Linux命令行下可以通过`scp`命令传输文件，添加`-r`选项可以传输目录

从服务器下载文件

```bash
> [bysj ~]$ scp username@servername:/path/filename /tmp/local_destination
```

上传本地文件目录到服务器

```bash
> [bysj ~]$ scp -r /path/local_filename username@servername:/path 
```



## tar & zip

```bash
tar -czvf [文件名].tar.gz	1.txt 2.txt					#压缩
tar -xzvf [文件名].tar.gz	-C [指定解压路径]			#解压缩
```

**-c** ：create、**-x** ：打开归档文件、**-z** ：压缩、**-v** ：view
**-f** ：归档文件名，应用在最后一个参数，后直接跟归档文件名，再跟需要归档的文件
**-C**：指定指定解压路径
如果打包的没有采用**-z**压缩，则还可以添加 **-r** 选项来追加文件：

```bash
tar -rvf [文件名].tar [被追加的文件名]
```



zpi 用于压缩制定的文件， `-r`选项可以递归压缩目录下的文件：

```bash
zip -r myfile.zip 1.txt 2.txt Dir
```

`-m`和`-d`分别用于向某压缩文件添加/删除某文件

```bash
zip -m myfile.zip 3.txt
zip -m myfile.zip 2.txt
```

`unzip`可以将压缩文件解压缩，`-d`用于制定解压路径：

```bash
unzip -d ./doc myfile.zip
```



## terminalizer

`terminalizer`可以记录我们的命令行信息，并生成gif图片：

```bash
npm install -g terminalizer
```

开始记录：

```bash
$ terminalizer record demo -d 'zsh'
...
$ exit
```

完成后将会自动在当前目录生成demo.yml文件，保存相关信息。然后根据再根据该文件生成图片：

```bash
$ terminalizer render demo -o=./demo.gif
```

生成gif示例：

![demo](../asset/Other/Tools/demo.gif)

# 使用实例

## 处理多行文本：

```bash
➜  [/Users/atyun/railsPractice/test] cat text
中国985高校
中国211高校
中国非211高校
中国C9高校
中外合作办学高校
中国普通高中

cat text | while read line
do
	echo "\"${line}\": \"${line}\"",
done
"中国985高校": "中国985高校",
"中国211高校": "中国211高校",
"中国非211高校": "中国非211高校",
"中国C9高校": "中国C9高校",
"中外合作办学高校": "中外合作办学高校",
"中国普通高中": "中国普通高中",
```

`awk`还可以对列处理

```bash
$ cat text
2 this is a test
3 Are you like awk
This's a test
10 There are orange,apple,mongo

$ awk '$1>2 && $2=="Are" {print $1,$2,$3}' log.txt
3 Are you
```



## 合并csv

```shell
# 先删除所有文件第一行
for filename in `ls`
  do
  sed -i '' 1d `echo $filename`	# 删除第一行
  done
# 将所有文件拼接到指定文件
for filename in `ls`
  do
  cat `echo $filename` >> ../f.csv	# 拼接文件
  done
```

**注！：**千万不要将`f.csv`放在操作文件夹的同一级目录下，不然会出现往`f.csv`添加数据的死循环，导致内存和磁盘爆表



##  zshrc alias

```zsh
# protofmt buf format ./*.proto file
function protofmt() {
  for filename in $(find . -name "*.proto"); do \
    buf format $filename -o $filename;
  done
}
# gnum generate 1..N num
function gnum(){echo {1..$1} | tr ' ' "\n" | pbcopy}
```

