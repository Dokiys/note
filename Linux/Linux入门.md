# Linux入门

* 一切皆文件
* 小程序
* 链接程序，完成复杂任务
* 避免交互
* 文本配置（想保存，必文件）



## Linux入门

### 界面

在Windows系统中图形界面是和操作系统完全绑定的，而Linux的图形界面只是一个软件。

可以通过以下命令查看运行的环境：

```bash
[root@guest ~]# runlevel
N 3											# 3 => terminal命令行，5 => 图形界面
```

同时，Linux设计的目的就是为了进行多线程计算，所有它可以支持**同时**使用多个终端键入命令，也可以在不同终端登录不同用户。在大部分ssh客户端上即为打开一个新的命令行窗口，同时可以通过`tty`命令查看当前是拿个终端窗口：

```bash
[root@guest ~]# tty
/dev/pts/1

[/Users/atyun/.ssh] tty
/dev/ttys008
```



### 用户

Linux中的 root 用户对操作系统有绝对的权限，误操作对系统破坏性很大，除非万不得已，都不要在 root 用户下操作

查看 root 账户可以通过`id -u`命令：

```bash
[root@guest ~]# id -u
0											# 0 => 即为管理员账户

➜  [/Users/atyun] id -u
501										# 非0则为普通账户
```

通过命令行的符号也可以分辨是否为 root 账户：

```bash
[root@guest ~]# 			# '#'符号代表管理员账户
[zhang@guest ~]$ 			# '$'符号代表普通账户
```



### 查看硬件

```bash
[root@guest ~]# lscpu			# 查看cpu
[root@guest ~]# lsblk			# 查看磁盘
[root@guest ~]# df				# 查看磁盘分区
```





## Shell简介

Shell 是一种高级程序设计语言

Shell 提供了用户与内核进行交互操作的接口

在Linux中键入的命令需要被解释器翻译成二进制的机器语言才可以被操作系统识别运行

可以在`/etc/shells`中查看本机已安装的 Shell 软件：

```bash
➜  [/etc] cat /etc/shells
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```

`echo $SHELL`命令可以查看当前的 Shell ：

```bash
➜  [/etc] echo $SHELL
/bin/zsh
```



### 命令执行

键入命令后，shell 程序将会找到命令对应的程序或代码，并翻译后交由内核分配资源并执行

 Shell 中可执行的命令分为内部命令（即操作系统自带的命令，且存储在内存中）和外部命令（系统中对应路径下的可执行文件，即安装的程序提供的命令）`type`命令可以查看命令类型：

```bash
[root@guest ~]# type nano
nano is hashed (/usr/bin/nano)
[root@guest ~]# type echo
echo is a shell builtin
```

Shell 会先调用在内存中调用内部命令，如果没找到再去外部命令查找

内部命令可以通过`enable`命令查看以及禁用内部命令:

```bash
[root@guest ~]# enable -n echo				# => 禁用 echo 命令
[root@guest ~]# enable -n							# => 查看全部禁用
enable -n echo												
[root@guest ~]# enable echo						# => 启用 echo 命令
```

**命令查找顺序**

> alias --> 内部命令 --> hash表 --> $PATH --> 命令找不到



### Hash

外部命令的执行需要到磁盘找到命令的路径，由于每次执行都会从`$PATH`路径下寻找该命令

由于效率低下，所以在找到一个命令之后会将其记录到一个hash表并加载到内存中，之后执行命令时会先到hash表中查找是否存在该命令。此过程称为Hash，可以通过`hash`命令查看：

```bash
[root@guest ~]# hash
hits	command
   2	/usr/bin/nano
   3	/usr/bin/whereis
   3	/usr/bin/ls
[root@guest ~]# hash -r 			# => 清空hash
[root@guest ~]# hash -d whereis			# => 删除指定命令缓存
```





## Linux基本命令

Linux 中绝大部分命令都是以下形式：

> COMMAND [OPTIONS...] [ARGUMENTS]
>
> [OPTIONS..] : 用于启动或关闭某功能
>
> * 短选项：-c, -l, -h 等，相同等短命令可以合在一起写，如 -al
>
> * 长选项：--all, --help等
>
> [ARGUMENTS] : 一般用于指定命令作用等对象，比如文件，用户名等

**注：**多个命令可以用`’;‘`隔开，一个命令分多行可以用`'\'`隔开

终止命令执行可以用`Ctrl + C`



### screen

该命令可以将连接在同一台主机上的两个终端共享屏幕

需要在一个终端新建会话，然后另外一个 或多个终端加入该会话，命令如下：

```bash
➜  [/Users/atyun] screen -S test						# 新建一个名为 test 的session

➜  [/Users/atyun/.ssh] screen -ls						# 查看session列表
There are screens on:
	42962.ttys012.new-frontier-8	(Detached)
	44459.test	(Attached)
2 Sockets in /var/folders/_7/4rk2fsjs34z_v5kh5w7zhbm40000gn/T/.screen.
➜  [/Users/atyun/.ssh] screen -x test				# 加入名为 test 的session，以及有连接的会话只能用-x加入
➜  [/Users/atyun] screen -d									# Detached 当前会话
➜  [/Users/atyun] screen -r	46159						# 恢复detached 的会话（如果只有一个可以不加）
➜  [/Users/atyun] exit											# 退出并关闭当前会话
```

`screen`命令仅用于同步命令，加入的任意一个终端都可以键入命令



### echo

显示字符串，会将输入的字符串送往标准输出。输出的字符串间以空白字符串隔开，并在最后加上换行符

> echo [Option] [Stirng]
>
> Option：
>
> * -E: 默认，
> * -n:  取消默认换行
> * -e： 识别`'\'`的转义
>
> String：
>
> * 单引号: 内容不会被转义，需要添加 -e 参数进行强制转义
> * 双引号: 内容会被转义
> * 反向单引号: 调用命令，与$()等价
>
> **注：**如果添加 -e 且用双引号，则会对字符串进行两次转转义

常见转义符：

> \a 响铃(BEL) 007
> \b 退格(BS) 008
> \n 换行(LF) 010			# 换行是到下一行的行首
> \r 回车(CR) 013			# 回车是指到行首
> \t 水平制表(HT) 009
> \v 垂直制表(VT) 011
> \\ 反斜杠 092
> \? 问号字符 063
> \\' 单引号字符 039
> \\" 双引号字符 034
> \0 空字符(NULL) 000

**注：**Windows系统的文本换行格式和Linux系统中不同，Windows用"\r \n"表示换行，Linux用"\n"表示。



**{ }**

花括号可以将括号前的字符串和括号里的字符串拼接：

```bash
➜  [/Users/atyun] echo file{1,2,3}
file1 file2 file3

➜  [/Users/atyun] echo file{1..5}
file1 file2 file3 file4 file5

➜  [/Users/atyun] echo file {a..h}
file a b c d e f g h

➜  [/Users/atyun] echo file{a..h}
filea fileb filec filed filee filef fileg fileh

➜  [/Users/atyun] echo file{1,2,3}.{txt,log}
file1.txt file1.log file2.txt file2.log file3.txt file3.log

➜  [/Users/atyun] echo file{H..A}
fileH fileG fileF fileE fileD fileC fileB fileA

➜  [/Users/atyun] echo {1..10..2}
1 3 5 7 9

➜  [/Users/atyun] echo {001..10..2}
001 003 005 007 009
```





### history

在bash中执行的命令会被保存，可以通过`history`来查看：

```bash
➜  [/Users/atyun] history
```

登录 Shell 时会在`~/.bash_history`文件中去读取记录下的命令

获取一个命令可以使用：

```bash
➜  [/Users/atyun] !!					# 获取上一个命令，与'↑'效果一样
➜  [/Users/atyun] ls -a

➜  [/Users/atyun] !-10				# 获取倒数第10条命令
➜  [/Users/atyun] history

➜  [/Users/atyun] !2788				# ! + history 查看到的行号，可以获取到该行的命令
➜  [/Users/atyun] ls -a


![String] => # 查找最近一条执行过的且以 [String] 开头的命令
!?[String]:p => # 查找最近一条执行过的且包含 [String] 的命令，并以字符串打印



➜  [/Users/atyun] !-2$				# $表示最后一个参数
➜  [/Users/atyun] .rvm

➜  [/Users/atyun] !!*					# *表示所以参数
➜  [/Users/atyun] Sites bundler

➜  [/Users/atyun] !-1:2				# 获取上一条命令的第二个参数


```

