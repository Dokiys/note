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



## Shell

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





