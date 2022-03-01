# Linux基础

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



### 命令的帮助

对于一个不熟悉的命令，需要查看其帮助文档，可以通过以下一系列方式：

```bash
[root@guest ~]# type nano
nano is /usr/bin/nano								# => 外部命令，一般会提供 -h/-H 或 --help 的选项来查看帮助文档

[root@guest ~]# type history
history is a shell builtin					# => 内部命令
[root@guest ~]# help history				# => 内部命令可以通过 内部命令 help 来查看
```





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

➜  [/Users/atyun] !ls				# 获取上一条以l开头的命令

➜  [/Users/atyun] !-1:2-3				# 获取上一条命令的第2，3个参数
```

**环境变量**

>HISTSIZE: 命令历史记录条数
>
>HISTFILE: 指定历史文件
>
>HISTFILESIZE: 命令历史文件记录条数
>
>HISTTIMEFORMAT=" %F %T" 显示时间
>
>HISTIGNORE= "str1:str2" 忽略str1命令
>
>HISTCONTROL = [ ignoredups | ignorespace | ignoreboth | erasedups]
>
>* ignoredups : 默认，忽略连续重复命令
>* ignorespace : 忽略空白开头命令
>* ignoreboth : = ignoredups + ignorespace
>* erasedups : 删除重复命令

环境变量的修改只是针对内存的，如本文开始的Linux思想一样，需要长期修改必须添加到配置文件

`/etc/profile`下的配置文件会影响当前主机的所有用户，一般修改`~/.bash_profile`



# Linux文本

## 文本查看

### cat

`cat`命令用于查看文件内容，它会将文件的全部内容输出到控制台：

```bash
> [bysj ~]$ cat f1
Hello Work!


```

可以通过`--help`选项查看参数

其中`-E`会在末尾行显示`'$'`，该选项可以排除空格的误添加

`-T`会将制表符用`^i`表示

`-A`则会同时使用`-E`和`-T`参数

```bash
> [bysj ~]$ cat f1 -A
Hello Work! $
^I$
 $
```

`tac`命令与 `cat`命令相反，会将文件中的内容从最后一行开始输出：

```bash
> [bysj ~]$ tac f1


Hello Work!
```

`rev`则是将每一行的输入，倒序输出：

 ```bash
> [bysj ~]$ rev
12345
54321
> [bysj ~]$ rev f1
 !kroW olleH


> [bysj ~]$ echo {1..9} | rev
9 8 7 6 5 4 3 2 1
 ```



### less & more

而`more`和`less`命令可以用于分页查看文件内容

其区别在于`more` 命令查看到最后一页自动退出，而`less`则可以通过`/`搜索内容`n/N`匹配 下/上 一个结果

两者都可以对标准输出进行处理：

```bash
> [bysj ~]$ ll /etc | more
> [bysj ~]$ ll /etc | less
```

`head`命令用于从开始显示文件到指定位置`-c`，`-n`分别用于指定字符和行

默认情况下`head`会查前10行数据，使用`-`加上一个数字可以指定显示 行/字符 数

```bash
> [bysj ~]$ head f1 -n1
Hello Work!
> [bysj ~]$ head f1 -c5
Hello
```

` tail`则是用于从末尾显示文件到指定位置，用法与`head`相同

但是相较于`head`，`tail`多了一个`-f`和`-F`选项，用于跟踪指定文件内容变化

`-F`跟踪的是文件名，即使跟踪文件被删除，或者新创建也会跟踪其内容

```bash
> [bysj ~]$ tail -F f3
tail: cannot open 'f3' for reading: No such file or directory

> [bysj ~]$ cp /etc/sysctl.conf f3
tail: 'f3' has appeared;  following end of new file
# sysctl settings are defined through files in
# /usr/lib/sysctl.d/, /run/sysctl.d/, and /etc/sysctl.d/.
#
# Vendors settings live in /usr/lib/sysctl.d/.
```



## 文本处理

### cut

类似于 Windows 系统中的剪切，Linux 中也有`cut`命令来执行剪切操作

`cut`命令默认使用`TAB`作为分隔符，可以通过`-d`选项修改分隔符

且 `-f`选项可以用于指定列。比如查看`/etc/passwd`下的 用户名、uid、描述以及 shell 类型:

```bash
> [bysj ~]$ cut -d : -f 1,3,5-7 /etc/passwd | head -2
root:0:root:/root:/bin/bash
bin:1:bin:/bin:/sbin/nologin
```

对于像`df`命令这样输出格式没有明确分隔符的可以先使用`tr`命令压缩并替换空格，然后在`cut`：

```bash
> [bysj ~]$ df | head -4
Filesystem     1K-blocks    Used Available Use% Mounted on
devtmpfs          238892       0    238892   0% /dev
tmpfs             249300       0    249300   0% /dev/shm
tmpfs             249300   33328    215972  14% /run
```

```bash
> [bysj ~]$ df | tr -s ' ' : | cut -d : -f 5 | head -4
Use%
0%
0%
14%
```

 `cut`还可以添加`-c`选项直接指定剪切的字符位置：

```bash
> [bysj ~]$ df | cut -c 44-47 | head -4
Use%
  0%
  0%
 14%
```

`cut`命令还可以添加`--output-delimiter=[指定字符]`来指定输出的分隔符：

 ```bash
> [bysj ~]$ cut -d: -f1,3,5-7 --output-delimiter=: /etc/passwd | head -2
root:0:root:/root:/bin/bash
bin:1:bin:/bin:/sbin/nologin

 ```



### paste

如果`cat`命令同时查看两个文件，会将两个文件内容纵向合并在一起：

```bash
> [bysj ~]$ cut -d: -f1,3,5-7 --output-delimiter=: /etc/passwd | head -2 > f1
> [bysj ~]$ cut -d: -f1,3,5-7 --output-delimiter=: /etc/passwd | head -3 > f3
> [bysj ~]$ cat f1 f3
root:0:root:/root:/bin/bash
bin:1:bin:/bin:/sbin/nologin
root:0:root:/root:/bin/bash
bin:1:bin:/bin:/sbin/nologin
daemon:2:daemon:/sbin:/sbin/nologin
```

想要将文件横向合并可以使用`paste`，且可以使用`-d`自定义分隔符:

```bash
> [bysj ~]$ paste -d '|' f1 f3
root:0:root:/root:/bin/bash|root:0:root:/root:/bin/bash
bin:1:bin:/bin:/sbin/nologin|bin:1:bin:/bin:/sbin/nologin
|daemon:2:daemon:/sbin:/sbin/nologin
```

`paste`的`-s`选项还可以将行列互换：

```bash
> [bysj ~]$ echo {1..9} | tr ' ' "\n" > f1
> [bysj ~]$ echo {a..i} | tr ' ' "\n" > f3
> [bysj ~]$ paste -s -d "|" f1 f3
1|2|3|4|5|6|7|8|9
a|b|c|d|e|f|g|h|i
```



## 文本分析

### wc

`wc`可以用于统计文件的行，字符数，字节数等数据：

```bash
> [bysj ~]$ wc f1
 9  9 18 f1
```

可以通过`--help`查看`wc`命令的选项，选择只统计某项数据

其中`-L`选项可以显示最长行的长度



### sort

`sort`命令可以用于文本的排序，和去重。与`cat`命令一样可以选择行列，但选项名不一样

例如，对`/etc/passwd`中以`:`作为分隔符，对第 3 列进行数字排序：

```bash
> [bysj ~]$ sort -t : -k 3 -n /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
```

默认情况下`sort`会采用字符串排序，`-n`选项会指定数字排序。

`-r`选项也可以反向输出，`-R`则是随机排序：

```bash
> [bysj ~]$ cat f1
1
1
5
4
8
9
1
8
9
> [bysj ~]$ cat f1 | sort -ur
9
8
5
4
1
```



### uniq

`uniq`命令用于连续重复行的操作：

  ```bash
> [bysj ~]$ cat f1
1
1
8
4
8
8
8
8
9
> [bysj ~]$ uniq -c f1
      2 1
      1 8
      1 4
      4 8
      1 9
  ```

`-c`选项可以查看连续重复次数，`-d`，`-u`选项可以分别仅显示重复过的行和不曾重复过的行：

通常`uniq`命令经常和`sort`命令一起使用来查询某文件中各数据出现的次数：

```bash
> [bysj ~]$ sort -n f1 | uniq -c
      2 1
      1 4
      5 8
      1 9
```



### diff

`diff`可以比较两个文件的不同：

```bash
> [bysj ~]$ cat f1
1
1
2
3
> [bysj ~]$ cat f3
11
1
2
4
```

```bash
> [bysj ~]$ diff f1 f3
1c1
< 1
---
> 11
4c4
< 3
---
> 4
```

`-u`选项可以查看详细信息：

```bash
> [bysj ~]$ diff -u f1 f3
--- f1	2020-10-23 09:43:55.749193056 +0000
+++ f3	2020-10-23 09:44:38.803346293 +0000
@@ -1,4 +1,4 @@
-1
+11
 1
 2
-3
+4
```

前两行表示文件的修改时间，以及对应的符号(`---|+++`)

第三行表示第一个文件(` -1`)是 1 - 4  行，第二个文件(`+1`)是 1 - 4 行

后面内容将对应文件符号加上没有符号到部分则是完整的文件内容

例如`f1`文件则是首字符带有`-`号到两行加上中间的两行，即 1 1 2 3

同理`f3`则是 11 1 2 4



在没有如`Git`，`SVN`等版本控制工具之前，一般通过`diff`和 `patch`命令来比较文件的修改和恢复：

```bash
[bysj ~]$ diff -u f1 f3 > diff.log
> [bysj ~]$ rm -f f3
> [bysj ~]$ patch -b f1 diff.log
patching file f1
> [bysj ~]$ ll
total 16
-rw-rw-r--. 1 bysj bysj  121 Oct 23 09:56 diff.log
-rw-rw-r--. 1 bysj bysj    9 Oct 23 09:58 f1
-rw-rw-r--. 1 bysj bysj    8 Oct 23 09:43 f1.orig
```

首先通过`diff`命令将文件的比较信息存到`diff.log`

然后在`f3`被删除以后，使用`patch`命令通过`diff.log`文件将`f3`找回。

`patch`默认会根据`diff.log`中的信息将`f1`修改，修改后即为原来 `f3`的内容

`patch`命令的`-b`选项会将原本 `f1`中的内容保存到备份文件中，即`f1.orig`



### grep 

`grep`文本搜索工具，`egrep`,`fgrep`等同于 `grep` 添加`-e`,`-f`等参数。可以通过`man`命令查看其帮助。

其可以根据指定的模式匹配对应的文本行。例如查找`/etc/passwd`中带有`"root"`的行：

```bash
> [bysj ~]$ grep root /etc/passwd
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
```

通常`grep`与别的标准输出一起使用，以此来过滤内容：

```bash
> [bysj ~]$ ll | grep f1
-rw-rw-r--. 1 bysj bysj    9 Oct 23 09:58 f1
-rw-rw-r--. 1 bysj bysj    8 Oct 23 09:43 f1.orig
```

`grep`添加 AND 条件可以通过多次`grep`实现，添加 OR 条件可以通过一下方式将`|`转义：

```bash
➜  [/Users/atyun/Library] ll Logs | grep 'a\|r'
```

`grep`的`-r`选项可以用于查找文件目录下存在某字符的文件，及位置：

```bash
➜  [/Users/atyun/railsPractice/nginx] grep -r localhost /usr/local/nginx/conf
/usr/local/nginx/conf/nginx.conf.default:        server_name  localhost;
/usr/local/nginx/conf/nginx.conf.default:    #    server_name  localhost;
/usr/local/nginx/conf/nginx.conf:    #    server_name  localhost;
```



常用的`grep`命令参数如下：

> `--color=auto`:默认别名添加了该参数，对匹配的文本着色显示
>
> `-v`：只显示不被匹配的行
>
> `-i`：忽略匹配字符串的大小写
>
> `-n`：显示匹配的行号
>
> `-c`：统计匹配的行数
>
> `-q`：不输出任何信息，如果匹配不成功会将全局参数`$?`设置为 1
>
> `-B|A｜C[num]`：同时输出匹配的 前｜后｜前后`num`行
>
> `-e`：正则匹配
>
> `-w`：匹配字符为单词
>
> `-f`：根据指定文件中的内容去匹配
>
> `-o`：只显示正则表达式匹配的部分

正则表达式的内容可以参见[Regexp.md](../Other/Regexp.md)

## vim

`vi`(Visual Interface)文本编辑器，`vim`(Vi Improved)增强版

针对`ASCLL`，`Unicode`等编码内容编辑，`vim`甚至可以添加`-b`选项编辑二进制文件

三剑客中的`sed`为行编辑器，`vim`,`nano`为全屏编辑器

还有`gedit`，`gvim`等其他编辑工具

可以使用`vimtutor`工具来查看`vim`的使用说明书

```bash
[root@vultr ~]$ vimtutor
```



### 模式

`vim`是一个模式编辑器，键入信息会根据模式匹配对应行为，主要模式有三种：

* 命令模式(Normal)：默认模式，移动光标，剪切/粘贴文本
* 插入模式(Insert)或编辑模式：修改文本
* 扩展命令模式(Extended Command)：保存，退出等

模式间的相互转化：

![vim_mode](/Users/admin/dokiy/note/asset/DevOps/Linux基础/vim_mode.png)

命令模式 => 插入模式

* `i|a`：光标 出/后 输入
* `I|A`：光标行的行 首|尾 输入

* `o|O`：在光标坐在行 上/下 方打开新行

`Esc`退出当前模式，`Esc Esc`总是返回命令模式



### 命令模式

命令模式下通过定位和命令修改文件：

> <star position> <command> <end position>



#### 地址定界

* `w`：跳转下一个单词词首
* `b|e`：跳转当前或下一个单词词 首/尾 
* `(|)`：跳转至 上/下 一个`.`后
* `{|}`：跳转至段 首/尾
* `0｜$`：跳转行 首/尾
* `^`：跳转至行首的第一个非空白字符处
* `#G`：跳转到 尾行/第 # 行
* `#[k|j|h|l]`：上/下/左/右 移动光标，指定跳转 # 个字符/ # 行数
* `H|M|L`：跳转页 首/中/尾 
* `Ctrl + b|f`：向文件 首/尾 部翻一屏
* `Ctrl + u|d`：向文件 首/尾 部翻半屏
* `zt|zz|zb`：将光标所在行移动到屏幕 顶/中/底 部

#### 编辑

* `d`：删除内容，`c`会在删除之后进入编辑模式
* `y`：复制内容，详见[vim寄存器](#vim寄存器)
* `v`：选中内容
* `p`：粘贴内容

示例，`@`代替以上字符，`@^`代表大写：

* `@$｜@^`：command 到行尾， `@w`：command 到下一个单词词首

* `#@@`：command 当前行/第 # 行

* `@i + " or ( or [`：command `""`,`()`,`[]`之间的内容

#### 常用命令

* `#u`：撤销修改，撤销直接 # 次修改 
* `U`：撤销所在行内容为打开文件的内容
* `Ctrl + r`：重做撤销
* `#>> | #<<`：可用于当前行及后 # 行的缩进
* `#.`：重复前 # 次操作，不包括撤销

* `#x`： 剪切光标处字符，键入 # 剪切光标处 # 个字符，`xp`一起用可以交换字符位置

* `#p|P`： 粘贴字符到光标 后/前，键入 # 重复粘贴字符到光标处 # 次
* `~`：转化大小写
* `J`；删除当前行最后的换行符
* `r`：单个替换光标处字符，`R`进入替换模式，输入会替换光标位置的字符
* `ZZ`：保存退出
* `ZQ`：不保存退出



#### vim寄存器

`vim`提供了 26 个字母寄存器分别名为 a，b，c.... 和 1 个无名寄存器，用于存放剪切内容

如果指定 [寄存器名] 将使用无名寄存器

可以在扩展命令模式中键入`reg`查看所有寄存器的值，即在命令模式下键入`:reg`

使用格式：

> `" + [寄存器名（a,b,c...）] + <star position> <command> <end position>`

例如：

> `# + " + a + y`		=> 复制(`y`表示复制)当前光标行及前 # 行到寄存器`a`中

> `" + a + p`					=> 将寄存器`a`中的内容粘贴(`p`表示粘贴)到当前位置

> `" + a + d + e`		=> 将光标位置到单词结尾处的内容删除，并存入寄存器`a`中





#### 标记和宏(macro)

标记可以记录某个位置并利用`'`来跳转

* `m + [字母]`：在当前位置做标记，标记名为 [字母]
* `' + [字母]`：将光标跳转到标记名为 [字母] 的位置

宏则是使用`q + [字母]`命令之后开启宏录制，直到再次在命令模式下键入`q`前的所有操作都会被记录到名为 [字母] 宏中。

使用`@ + [字母]`可以调用对应宏中的所有操作，即将对应宏中的操作重复一遍。



### 扩展模式

键入`:`可以进入该模式

命令模式下通过定位和命令修改文件：

> <star position><end position> <command> 



#### 地址定界

* `#`：第 # 行
* `#1,#2`：第 #1 行到第 #2 行 
* `#1,±#2`：第 #1 行到 前/后 #2 行
* `.`：当前行
* `$`：最后一行
* `%`：全文

` vim`扩展命令的地址定界还支持正则匹配：`/pat1/,/pat2/`从第一个被`pat1`匹配到的模式到第一个被`pat2`匹配到的模式，也可混用 `/pat1/,+#`

#### 编辑

* `d`：删除
* `y`：复制
* `w [filename]`：存入指定文件中
* `r [filename]`：指定位置替换为文件中的内容
* `s/[查找内容]/[替换内容]/[修饰符]`：搜索并替换
  * 查找内容可以使用正则表达式匹配
  * 替换内容则不行，但可以使用`&`获取`[查找内容]`中的内容，也可以使用`/1`，`/2`来表示正则中的分组
  * 修饰符：
    * `i`：忽略大小写
    * `g`：全局替换(默认每行只替换第一次匹配内容)
    * `gc`：每次替换之前询问
  * 命令中的分隔符`'/'`可以替换成其他符号。如`@`,`#`等

#### 查找

* `/|?`：从光标处向文件 尾部/首部 搜索指定字符，部分字符需要使用`'\'`转义
* `n|N`：搜索中与命令 同/反 方向查找下一个匹配内容

#### 替换

* `:%s/目标内容/替换内容/g`：全局替换指定内容

#### 常用命令

* `:q` ：退出
* `:q!` ：强制退出
* `:wq|:x` ：保存bi退出
* `:r [filename]`：读取指定文件内容到当前文件中
* `:w [filename]`：另存为
* `! [command]`：在不关闭文件到情况下执行其他命令命令
* `r! [command]`：将其他命令的输入读入到文件中（注意不能输入别名命令）



#### 偏好设置

扩展模式下可以设置`vim`的工作特性，比如显示行好，自动缩进等。设置只对当前进程有效，将设置写入配置文件可以永久保存，`/etc/vimrc`和`~./vimrc`分别针对全局和用户配置

常用的设置如下：

* `set cul|no cul`：启用/禁用 当前光标行标识线(cursorline)
* `set paste|nopast`：启用/禁用 保留格式复制（常用语复制某些换行代码时出现的格式错误）

* `set nu|nonu`：显示/不显示 行号
* `set ai|noai`：启用/禁用 自动缩进(auto indent)
* `set si|nosi`：启用/禁用 智能缩进(smart indent)
* `set hlsearch|nohlsearch`：启用/禁用 高亮搜索
* `syntax on|syntax off`：启用/禁用 语法高亮
* `set list|nolist`：启用/禁用 换行符，空格等显示
* `set fileformat=dos|unix`：启用 windows/unix 文本格式

* `set textwidth=#`：设置文本宽度
* `set ic|noic`：启用/忽略 大小写

更多偏好设置可以使用`help option-list`来查看各参数说明，`set all`来查看当前设置的所有参数值



### 可视化模式

通过`v`，`V`，`Ctrl + v`等命令可以从命令模式进入到可视化模式，该模式通常用于选择指定文本块的复制、删除、修改等操作。

`v`命令进入的可视化模式面向字符选择，`V`则是面向行。`Ctrl + v`则是面向块，通常用于带有缩进格式的文本。

可视化模式可以使用[命令模式](#命令模式)中的[地址定界](#地址定界)来选择范围，也可以使用[命令模式](#命令模式)中的[编辑命令](#编辑)来操作选择的内容



### 多操作

可以使用一下命令来选择多文件同时操作，默认只在当前页面显示第一个文件：

```bash
vim [File1] [File2] [File3]
```

`-o|O`选项用于选择 水平分割/垂直分隔 多个文件的窗口，使用`Ctrl + w; [Arrow]`指定窗口间切换

打开多个窗口时在扩展命令模式下有一下命令：

* `:next|prev`：跳转到下/上 一个窗口
* `:first|last`：跳转到第一\最后 一个窗口
* `:wqall`：保存并退出所有窗口



单个文件可以使用`Ctrl + w; s|v`来 水平/垂直 分割窗口

关闭分割窗口使用`Ctrl + w; q|o`，其中`q`删除相邻窗口，`o`删除所有窗口



# Linux文件

## 标准目录结构

![Linux标准目录结构](/Users/admin/dokiy/note/asset/DevOps/Linux基础/d0c50-linux2bfile2bsystem2bhierarchy.jpg)

> /  --- 根目录
>
> * boot --- 存放引导数据
> * dev --- 设备文件目录
> * etc --- 配置文件
>   - skel --- home目录建立，该目录初始化
>   - sysconfig --- 网络，时间，键盘等配置目录
> * home --- 存储普通用户的数据
> * bin --- 所有用户可执行的二进制文件
> * sbin --- root 管理员可执行的二进制文件
> * tmp --- 临时文件目录，系统启动后的临时文件存放在/var/tmp
> * var --- 存放变量，缓存等
>   - file
>   - lib --- 该目录下的文件在系统运行时，会改变
>   - local --- 安装在/usr/local的程序数据，变化的
>   - lock --- 文件使用特定外设或文件，为其上锁，其他文件暂时不能访问
>   - log --- 记录日志
>   - run --- 系统运行合法信息
>   - spool --- 打印机、邮件、代理服务器等假脱机目录
>   - tmp
>   - catman --- 缓存目录
> * root --- 启动[Linux](http://linux-wiki.cn/wiki/Linux)时使用的一些核心文件。如操作系统[内核](http://linux-wiki.cn/index.php?title=内核&action=edit&redlink=1)、引导程序[Grub](http://linux-wiki.cn/wiki/Category:Grub)等。
> * usr --- 用户目录，存放用户级的文件
>   - bin --- 几乎所有用户所用命令，另外存在与/bin，/usr/local/bin
>   - sbin --- 系统管理员命令，与用户相关，例如，大部分服务器程序
>   - local --- 本地安装软件保存位置
>   - tmp ---  临时文件
> * proc --- 虚拟，存在linux内核镜像；保存所有内核参数以及系统配置信息
>   - 1 --- 进程编号
> * mnt --- 用于临时挂载文件系统。

文件有两类数据：

* 元数据：用于描述文件
* 数据：即存放的内容

**文件名规则**

* 文件名最多255个字节
* 包括路径最长4095个字节



## 文件目录

### 查看

通过`alias`命令可以看到，bash 为我们自动设置了别名，`ll`其实是对`ls -lh`的调用

```bash
➜  [/Users/atyun/railsPractice] alias
l='ls -lah'
la='ls -lAh'
ll='ls -lh'
ls='ls -G'
lsa='ls -lah'
```

通过`ll`命令可以查看当前文件夹下的文件详细信息：

```bash
[root@guest ~]# ll
#							所有者			 大小	 文件最后修改时间
drwxr-xr-x. 2 root root  4096 Oct 13 07:38 f1
-rw-r--r--. 1 root root     0 Oct 14 03:04 f2
-rw-r--r--. 1 root root 72411 Oct 12 01:34 shadowsocks-all.log
-rwxr-xr-x. 1 root root 46729 Oct 12 01:31 shadowsocks-all.sh
-rw-r--r--. 1 root root   619 Oct 12 01:34 shadowsocks_r_qr.png
```

如果需要查看某个文件完整的元数据信息，可以使用`stat`命令：

```bash
[root@guest ~]# stat f1
  File: ‘f1’
  Size: 4096      	Blocks: 8          IO Block: 4096   directory
Device: fd01h/64769d	Inode: 520031      Links: 2
Access: (0755/drwxr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:admin_home_t:s0
Access: 2020-10-13 07:40:59.531969540 +0000
Modify: 2020-10-13 07:38:22.909424142 +0000
Change: 2020-10-13 07:38:22.909424142 +0000
 Birth: -
```

其中显示出的第一个字母表示的是**文件类型**<a id="FileType" href="#BFileType">↵</a>，Linux下的文件类型如下；

* \- ：普通文件
* d：目录文件
* b：块设备
* c：字符设备
* l：符号连接文件
* p：管道文件
* s：套接字文件

在查看当前文件目录内容的时候添加`-a`选项会列出两个特殊的文件：

```bash
➜  [/Users/atyun/railsPractice/test] ll -a
total 80
drwxr-xr-x  13 atyun  staff   416B Sep 24 19:51 .				# => 表示当前目录
drwxr-xr-x   9 atyun  staff   288B Sep 17 21:40 ..			# => 表示上一级目录
```

文件目录分为基名和目录名，基名为文件目录最后的一部分，前面的即路径即为目录名

`basename`和`dirname`可以分别用来获取基名和目录名：

```bash
# 以路径/Users/atyun/railsPractice/test为例

➜  [/Users/atyun/railsPractice/test] basename `pwd`		# => 获取当前路径基名
test	# => 基名
➜  [/Users/atyun/railsPractice/test] dirname !-1:1		# => 获取上一条命令的第一个参数
➜  [/Users/atyun/railsPractice/test] dirname `pwd`		# => 获取当前路径目录名
/Users/atyun/railsPractice	# => 目录名
```



### cd

常用的文件目录命令还有`cd`(chang directory)，用于进入到某目录

`cd`的参数可以接相对路径也可以接绝对路径

```bash
➜  [/Users/atyun/railsPractice/test] cd ../		# `.`代表当前目录，`..`代表上一级目录。
➜  [/Users/atyun/railsPractice] cd /Users/atyun/railsPractice/test	# 绝对路径
➜  [/Users/atyun/railsPractice/test] cd ~			# 不接参数或接'~'，会进入到当前用户的家目录
➜  [/Users/atyun]
➜  [/Users/atyun] cd -		# '-'表示进入到以 $OLDPWD 变量表示的上一次所在的目录
~/railsPractice
➜  [/Users/atyun/railsPractice]
```

正如上面所述。

如果`cd`不接参数，会进入到当前用户的家目录，当然也可以用`~`表示当前家目录。



### 通配符

 在查询文件时可以通过通配符来筛选需要查询的文件：

```bash
➜  [/Users/atyun/test] ls aA*				# 匹配以 aA 开头的任意文件
➜  [/Users/atyun/test] ls a?9*			# 以 a 开头后面接任意字符 在接 9 再跟任意字符的文件
➜  [/Users/atyun/test] ls ~					# 表示当前家目录 
➜  [/Users/atyun/test] ls ~zhang		# 表示用户 zhang的家目录 
➜  [/Users/atyun/test] ls ~-				# 表示前一个工作目录 
➜  [/Users/atyun/test] ls ~-				# 表示前一个工作目录 
➜  [/Users/atyun/test] ls a[A-Z]*		# 匹配 a开头的第二个字符为A-Z的文件
➜  [/Users/atyun/test] ls aA[0-9]]*	# 匹配 aA开头的第三个字符为0-9的文件
➜  [/Users/atyun/test] ls a[ABC]*		# 匹配 a开头的第二个字符为 ABC 中的任意一个字符的文件
➜  [/Users/atyun/test] ls a[^BC]*		# 匹配 a开头的第二个字符不为 ABC 中的任意一个字符的文件
```

Linux也提供了一些与定义的字符类，常用的如下：

* `[:digit:]`：任意数字
* `[:lower:]`：任意小写字母
* `[:upper:]`：任意大些字母
* `[:alpha:]`：任意字母
* `[:alnum:]`：任意数字或字母

以上字符类定义的是所有字符而不是单个字符，使用的时候需要再添加`[]`来表示匹配单个字符：

```bash
➜  [/Users/atyun/test] ls aA[[:digit:]].txt			# 匹配 aA开头的第三个字符为数字 并以.txt结尾的文件
aA0.txt aA1.txt aA2.txt aA3.txt aA4.txt aA5.txt aA6.txt aA7.txt aA8.txt aA9.txt
```

查看当前目录的所有`.`开头的文件：

```bash
➜  [/Users/atyun] ls -d .[^.]* # -d 表示只显示当前目录，.[^.]* 表示'.' 开头的第二个字符不为'.'的文件
```

匹配时`[]`表示获取 1 个字符，`{}`表示获取字符，所以`[1-10]`并不能表示 1到10



## 文件管理

### cp

`cp`用于文件的复制：

```bash
[root@guest ~]# cp --help
Usage: cp [OPTION]... [-T] SOURCE DEST					# 复制指定文件到某路径
  or:  cp [OPTION]... SOURCE... DIRECTORY				# 复制多个指定文件到某文件夹
  or:  cp [OPTION]... -t DIRECTORY SOURCE...		# 向某个文件复制多个文件
Copy SOURCE to DEST, or multiple SOURCE(s) to DIRECTORY.
```

在复制过程中，如果目标文件存在会提示是否覆盖：

```bash
➜  [/Users/atyun/test] cp -i aA0.txt ./b.txt		# root 用户不会提示
overwrite ./b.txt? (y/n [n])
```

并且可以添加`--backup`参数来生成将要被覆盖文件到备份：

```bash
[root@guest ~]# cp 1.txt 2.txt --backup
cp: overwrite ‘2.txt’? y
[root@guest ~]# ll *.txt*
-rw-r--r--. 1 root root 0 Sep 27 03:15 1.txt
-rw-r--r--. 1 root root 0 Sep 27 03:17 2.txt
-rw-r--r--. 1 root root 0 Sep 27 03:16 2.txt~
[root@guest ~]# cp 1.txt 2.txt --backup=numbered		# 定义备份格式
[root@guest ~]# ll *.txt*
-rw-r--r--. 1 root root 0 Sep 27 03:15 1.txt
-rw-r--r--. 1 root root 0 Sep 27 03:20 2.txt
-rw-r--r--. 1 root root 0 Sep 27 03:16 2.txt~
-rw-r--r--. 1 root root 0 Sep 27 03:17 2.txt.~1~
```

如果复制的为文件夹需要添加`-r`参数，以将文件夹下的所有文件都复制：

```bash
➜  [/Users/atyun] cp test test2
cp: test is a directory (not copied).
➜  [/Users/atyun] cp -r test test2
➜  [/Users/atyun] ls -d test*
test  test2
```

在复制过程中默认并不会保留文件的`元数据`，可以通过`-a`命令来指定元数据的复制：

```bash
➜  [/Users/atyun] ll -d test*
drwxr-xr-x  64 atyun  staff   2.0K Sep 27 10:24 test
drwxr-xr-x  64 atyun  staff   2.0K Sep 27 10:28 test2
➜  [/Users/atyun] cp -a test test3
➜  [/Users/atyun] cp -a test2{,.bak}			# 也可以用于创建test2的备份
➜  [/Users/atyun] ll -d test*
drwxr-xr-x  64 atyun  staff   2.0K Sep 27 10:24 test
drwxr-xr-x  64 atyun  staff   2.0K Sep 27 10:28 test2
drwxr-xr-x  64 atyun  staff   2.0K Sep 27 10:28 test2.bak
drwxr-xr-x  65 atyun  staff   2.0K Sep 27 11:10 test3
drwxr-xr-x  64 atyun  staff   2.0K Sep 27 10:24 test4

```

**注：**`-a`选项经常用于文件的备份和归档，如果只想保留权限可以使用`-p`选项

Linux命令执行一般没有提示，如果想查看复制过程可以使用`-v`选项

对于文件夹中的软链接复制的时候并不会复制链接信息，而是将被链接文件直接以连接文件名复制，可以添加`-d`选项复制



### mv

`mv`命令用于文件的移动，用法和`cp`很相似：

```bash
[root@guest ~]# mv --help
Usage: mv [OPTION]... [-T] SOURCE DEST					# 移动指定文件到某路径
  or:  mv [OPTION]... SOURCE... DIRECTORY				# 移动多个指定文件到某文件夹
  or:  mv [OPTION]... -t DIRECTORY SOURCE...		# 向某个文件移动多个文件
Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.
```

如果文件在同一文件夹内移动则为改名；

```bash
➜  [/Users/atyun] mv -r test test4
➜  [/Users/atyun] ls -d test*
test2 test3 test4 
```

与Windows一样，如果文件的移动在同一分区，不会更改数据的磁盘位置



### rm

`rm`命令用于删除文件， 能不使用`rm`命令就不要使用，因为经常会产生一些误操作

即使在`CentOS6`开始已经禁止了如`rm -rf /`的使用，但是如果键入了`rm -rf /*`仍然会删除根目录下的所有数据

在操作过程中很有可能出现如下误操作：

```bash
[root@guest ~]#rm -rf /data /*		
```

以上命令可能想删除`/data`下的所有数据，但是在`/data`和`/*`之间不小心添加了一个空格，这条命令就将会先删除`/data/`下的所有数据，然后在删除`/`目录下的所有数据。

可以将`rm`命令设置别名为`mv`命令，将需要删除的数据都存到一个指定的文件夹：

```bash
➜  [/Users/atyun] alias rm='mv -t /test'
```

`rm`执行的删除如果被删除文件正在被使用，那该文件并不会被立刻删除，知道关闭了文件才会被删除

且，如果该文件在此期间被保存了，那么文件依旧会存在

如果想要在文件被使用时删除，可以先使用`>`将文件清空，之后再删除，但是如果文件依旧被保存，仍然无法删除：

```bash
[root@guest test]# vim 1.txt				# terminal-1
[root@guest test]# > 1.txt					# terminal-2
[root@guest test]# rm -f 1.txt			# terminal-2
# terminal-1 保存后
[root@guest test]# ll 1.txt
-rw-r--r--. 1 root root 66 Sep 27 04:15 1.txt
```



### mkdir

该命令用于文件目录的创建：

```bash
[root@guest test]# mkdir /a/b
```

如果`/a`文件目录不存在，会报错：

```bash
mkdir: cannot create directory ‘/a/b’: No such file or directory
```

可以添加`-p`选项来创建相关的文件目录：

```bash
[root@guest test]# mkdir -p /a/b
[root@guest test]# tree /a		# tree 命令可以用于查看文件目录结构，可以通过 yum install tree 来安装
/a
└── b
```



## 链接

在 Windows 中有快捷方式，是我们快速访问某个路径下的文件，而在 Linux 也有类似的方式被称为链接

Linux 中的链接分为：

* 硬链接：硬链接指通过索引节点来进行连接
* 软链接：通过含有另一个文件位置信息的文本文件来链接到该文件



### 硬链接

硬链接通过文件的`inode`，即 Linux 中每个文件的唯一标识（可以理解为id）来进行链接

可以通过`ln`命令（link）来创建硬链接：

```bash
➜  [/Users/atyun/test] ln 1.txt 2
➜  [/Users/atyun/test] ll -i				# -i 选项用于查看文件 inode 信息
total 0
# inode 							# 链接数
12888644381 -rw-r--r--  2 atyun  staff     0B Sep 27 15:08 1.txt
12888644381 -rw-r--r--  2 atyun  staff     0B Sep 27 15:08 2
```

可以看到两个文件的 `inode`完全一样，都为`12888644381`。所以指向的是同一块物理磁盘

如果被链接的文件不在同一分区不能使用硬链接，因为不同分区文件的`inode`都是隔离的

硬链接不允许链接文件夹，因为有可能出现循环嵌套

但是 Linux 中的上一级目录`..`和当前目录`.`属于例外，它们会被硬链接到相应的文件，对应文件的链接数也会随之改变

```bash
➜  [/Users/atyun/test] mkdir dir1
➜  [/Users/atyun/test] ls -ild */
12888647048 drwxr-xr-x  2 atyun  staff  64 Sep 27 15:37 dir1/
➜  [/Users/atyun/test] mkdir dir1/a
➜  [/Users/atyun/test] ls -ild */
12888647048 drwxr-xr-x  3 atyun  staff  96 Sep 27 15:37 dir1/
➜  [/Users/atyun/test] mkdir dir1/a/b
➜  [/Users/atyun/test] ls -ild */
12888647048 drwxr-xr-x  3 atyun  staff  96 Sep 27 15:37 dir1/
```



### 软链接

软链接实际上是一个新的文件，其中内容描述所指向文件的地址信息，软链接文件和原文件是两个不同的文件

所以软链接可以指向文件夹，也可以跨分区

软链接可以通过`ln -s`来创建：

```bash
➜  [/Users/atyun/test] ln -s dir1 sl
➜  [/Users/atyun/test] ll -i
total 0
12888647048 drwxr-xr-x  4 atyun  staff   128B Sep 27 15:44 dir1
12888647503 lrwxr-xr-x  1 atyun  staff     4B Sep 27 15:45 sl -> dir1
```

创建出来的`sl`文件类型为`l`，表示链接文件

软链接的创建几乎都是使用相对路径，需要特别注意的是，这里的相对路径指的是被链接文件相对于链接文件的路

比如，在文件`/a/b/c`中创建对`/a/linked`文件的软链接：

```bash
➜  [/Users/atyun/test] ln -s ../linked ./a/b/c/link
➜  [/Users/atyun/test] tree a
a
├── b
│   └── c
│       └── link -> ../linked
└── linked
```

其中第二个参数指的是创建的链接文件的名称以及相对于当前目录的路径

第一个参数指的是被链接文件相对于第二个参数，即链接文件所在的路径



## I/O

> 程序 = 指令 + 数据

### Output

打开的文件在`/proc`中都有一个`fd`（file descriptior）文件描述符，其中包含了Linux提供的标准输入输出：

* 标准输入（STDIN）- 0 默认接受来自键盘的输入
* 标准输出（STDOUT）- 1 默认输出到终端窗口
* 标准错误（STDERR）-2 默认输出到终端窗口

```bash
[root@guest test]# vim 2.txt
[root@guest proc]# ps aux | grep vim
root     11782  0.1  1.0 149376  5128 pts/1    S+   01:27   0:00 vim 2.txt
root     11808  0.0  0.1 112808   968 pts/2    S+   01:28   0:00 grep --color=auto vim
[root@guest ~]# cd /proc/11782/fd
[root@guest fd]# ll
total 0
lrwx------. 1 root root 64 Sep 29 01:28 0 -> /dev/pts/1
lrwx------. 1 root root 64 Sep 29 01:28 1 -> /dev/pts/1
lrwx------. 1 root root 64 Sep 29 01:28 2 -> /dev/pts/1
lrwx------. 1 root root 64 Sep 29 01:28 4 -> /root/test/.2.txt.swp
```

当然，我们可以通过**重定向**来将标准输出，输出到指定位置。比如将`ls`到内容重定向到另外的终端窗口：

```bash
[root@guest test]# tty
/dev/pts/1
[root@guest fd]# tty
/dev/pts/2
[root@guest fd]# ls > /dev/pts/1				# 重定向符号 '>'
[root@guest test]# 0  1  2  4
```

指定的输出也可以为文件，如果文件存在则会将其中内容覆盖，如果想要在文件后面添加内容可以使用`'>>'`:

```bash
[root@guest fd]# ls > ~/ls.txt
[root@guest ~]# vim ls.txt
0
1
2
4
[root@guest fd]# ls >> ~/ls.txt
[root@guest ~]# vim ls.txt
0
1
2
4
0
1
2
4
```

这样就可以实现将输出内容存到某个文件

标准错误是不会被`'>'`重定向的。如果想重定向错误需要指定输出类型

比如执行某条可能出现错误的命令，并且想将错误信息保存到某个文件中：

```bash
[root@guest fd]# cmd > ~/ls.txt
-bash: cmd: command not found
[root@guest fd]# cmd 2> ~/ls.txt				# 也可以使用 >> 进行追加
[root@guest ~]# vim ls.txt
-bash: cmd: command not found
```

如果一条命令中可能同时出现标准输出和标准错误输出，可以将`'>'`和`'2>'`同时添加：

```bash
[root@guest ~]# ls  /boot /djfaks 2> ~/error.log  > info.log
# 多条命令可以使用() 来将所有信息输出到同一个位置
[root@guest ~]# (cal 09 1752;cal 09 2020) > /dev/null		#/null文件类似windows中的回收站，只是不可撤销
```

也可也将所有信息存放在一个文件里：

```bash
[root@guest ~]# ls  /boot /djfaks &> ~/error.log
```

还可以将标准错误转化成标准输出：

```bash
[root@guest ~]# ls  /boot /djfaks > ~/info.log 2>&1
#  但是如下写法不行
#  因为在执行标准错误输出的时候，并没有被转向到标准输出
[root@guest ~]# ls  /boot /djfaks 2>&1 > ~/info.log 	
```



### Input

对于接收的输入可以使用`'<'`来接收，比如使用`cat`命令，接收来自某个文件的输入，并输出到指定位置：

```bash
[root@guest ~]# vim input.txt
hello work!
[root@guest ~]# cat < input.txt > info.log
[root@guest ~]# vim info.log
hello work!
```

`cat`命令还可以使用`<<[终止符]`实现多行重定向，也被称为就地文本（heretext）：

```bash
[root@guest ~]# cat > info.log <<EOF		# 可以自定义任意终止符，通常使用'EOF'（end of file）
> hello
> work
> !
> EOF
```

`tr`是一个与输入输出常用的外部命令，其可以将指定的字符进行转换：

```bash
[root@guest ~]# tr 'abc' '1234'
abcde
123de
```

`tr`的`-c`选项可以指定去反，例如；

```bash
> [bysj ~]$ cat f1 | tr -c '2' '3'
323333> [bysj ~]$
```

`-s`选项还可以压缩相同的字符

需要注意的是，`tr`只能一个字符对应一个字符替，上面这个例子最后的换行符`\n`也被替换成了 3



### pipe ｜

pipe 即管道，一种通信机制。表示符号为`'|'`

其可以将前一个进程的标准输出作为后一个进程的标准输入，由于socket也使用标准输入输出，所有也可以用于网络通信。Java NIO 中的 pipe 与此有些类似。

```bash
[root@guest ~]# cat < info.log | tr 'a-z' 'A-Z'
HELLO
WORK
!
```

标准错误不能通过管道转发，但可以通过`2>&1`或者`|&`的方式实现

对于一些相对比较大的文件的查看可以使用`less`命令，如果是标准输入，就可以通过管道传入`less`再进行查看：

```bash
[root@guest ~]# ls -l /etc | less
```

还可以使用`tee`命令来实现重定向到多个目标，`tee`命令会将标准输入作为标准输出输出，并且输出到指定文件：

```bash
[root@guest ~]# ls -l /etc | tee -a info.log			# -a 表示在info.log文件内容后添加内容而不是覆盖
[root@guest ~]# ls -l /etc | tee info.log ｜ tee info2.log	# 重复使用tee实现多目标重定向
```



`grep`和`|`经常一起联用

`grep`可以用来查找标准输出中的指定字符，`-E`选项可以添加或条件，与条件则多次使用`grep`即可

```bash
# 查找含有'20200929'的一行
➜  [/Users/atyun/works/boko] git branch -vv | grep 20200929		
# 查找含有'20200929'或者'2020100'的一行
➜  [/Users/atyun/works/boko] git branch -vv | grep -E '20200929|2020100'
# 查找含有'202009'且包含'add'的一行
➜  [/Users/atyun/works/boko] git branch -vv | grep 202009 | grep add
```





## 文件的查找

### locate命令

`locate`命令基于`mlocate`数据库来查找文件，所以具有快速，延迟的特点：

```bash
[root@guest ~]# yum install mlocate				# 安装mlocate
[root@guest ~]# updatedb									# 更新数据库 对于新添加的文件，在updatedb之前是查找不到的
[root@guest ~]# locate info.log
/root/info.log
```

也可以通过正则表达式来搜索：

```bash
[root@guest ~]# locate -r '\mit.conf$'
/etc/security/sepermit.conf
```



### find命令

`find`命令会遍历指定的路径进行搜索，可以精确的实时搜索，但速度相对较慢且执行命令的用户必须要有相应权限

`find`默认会搜索当前目录下的所有目录：

```bash
[root@guest test]# find
.
./2.txt
./sl
./td
./td/x
./td/x/2
./td/x/1
./td/y
```

可以添加选项`-maxdepth [number]`和`-mindepth [number]`来指定查找的层级：

```bash
# 设定查找的最大层级和最小层级都为2，即指查找第二层的文件
[root@guest test]# find -maxdepth 2 -mindepth 2		
./td/x
./td/y
```

也可以添加`-name`选项来指定查找文件的名称：

```bash
[root@guest test]# find ./ -name "s*"		# 查找s开头的文件或目录
./sl
```

`-type`可以指定搜索<a id="BFileType" href="#FileType">文件类型</a>：

```bash
[root@guest test]# find ./ -type f			# file
./2.txt
[root@guest test]# find ./ -type d			# directory
./
./td
./td/x
./td/x/2
./td/x/1
./td/y
```

还可以通过正则表达式来搜索：

```bash
[root@guest test]# find ./ -regex '.*\x$'
./td/x
```

`-user [USERNAME]`，`-group [GRPNAME]`，`-uid [UserID]`，`-gid [GroupID]`等选项可以搜索对应的用户或组：

```bash
[root@guest test]# find ./ -user root -ls
527247    4 drwxr-xr-x   3 root     root         4096 Sep 29 06:10 ./
519945    0 -rw-r--r--   1 root     root            0 Sep 29 01:27 ./2.txt
527275    0 lrwxrwxrwx   1 root     root            5 Sep 27 07:51 ./sl -> 1.txt
527270    4 drwxr-xr-x   4 root     root         4096 Sep 27 06:25 ./td
527271    4 drwxr-xr-x   4 root     root         4096 Sep 27 06:25 ./td/x
527273    4 drwxr-xr-x   2 root     root         4096 Sep 27 06:25 ./td/x/2
527272    4 drwxr-xr-x   2 root     root         4096 Sep 27 06:25 ./td/x/1
527274    4 drwxr-xr-x   2 root     root         4096 Sep 27 06:25 ./td/y
```

也可以用`-nouser`，`-nogroup`等命令搜索没有用户或者组的文件

`find`的查询条件可以通过与`-a`(默认，可省略)、或`-o`、非`-not,!`来实现，且遵循德·摩根定律：

```bash
[root@guest test]# find ./ ( -type d -a -name "*t*" )
-bash: syntax error near unexpected token `('
[root@guest test]# find ./ \( -type d -a -name "*t*" \)
./td
```



# Linux用户和组

为了方便权限的管理Linux提供了用户和组来分配权限，用户和组属于多对多的关系

其权限是通过进程来限制，即进程所能访问资源的权限取决于进程的运行者身份

Linux组分为主要组（primary group）和附加组（supplementary group）

* 用户必须属于且只有一个主要组，但可以属于多个附加组
* 用户创建的时候会默认创建一个同名的私有组

通过`id`命令可以查看指定用户的组信息：

```bash
[root@guest ~]# id root
uid=0(root) gid=0(root) groups=0(root)		# 如果加入多个组groups后面会通过','隔开
```



## 配置文件

Linux中一切皆文件，用户和组信息也不例外，主要配置信息如下：

```bash
/etc/passwd  :用户及其属性信息
/etc/group   :组及其属性信息
/etc/shadow  :用户密码相关属性
/etc/gshadow :组密码相关属性
```



### passwd

可以通过`man` 命令来查看各个文件的使用说明。需要注意的是，有些系统可能默认安装了`passwd`命令用于修改密码，这时用`man`命令查看帮助文档时需要指定查看的章节：

```bash
[root@guest ~]# man 5  passwd
```

> Each line of the file describes a single user, and contains seven colon-separated fields:
>
> ```bash
>        name:password:UID:GID:GECOS:directory:shell
> ```

```bash
[root@guest ~]# vim /etc/passwd
Updating index cache for path `/usr/share/man/man5'. Wait...mandb: warning: /usr/share/man/man5/aliases.5.gz is a dangling symlink
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
...
```



### shadow

在`/etc/shadow`中保存的所有密码相关的信息，可以通过`vim`查看所有用户密码信息：

 ```bash
[root@guest ~]# vim /etc/shadow
root:$6$wMeOwklmdYVLk7mbVNweopOJkvhhL3zRjl:18547:0:99999:7:::
bin:*:18353:0:99999:7:::
daemon:*:18353:0:99999:7:::
...
 ```

也可以使用内部命令`getent`查看指定用户密码信息

```bash
[root@guest ~]# getent shadow root
root:$6$wMeOwklmdYVLk7mbVNweopOJkvhhL3zRjl:18547:0:99999:7:::
```

 `chage`命令可以修改或者添加`-l`选项查看指定用户的密码信息：

```bash
[root@guest ~]# chage -l root
Last password change					: Oct 12, 2020
Password expires					: never
Password inactive					: never
Account expires						: never
Minimum number of days between password change		: 0
Maximum number of days between password change		: 99999
Number of days of warning before password expires	: 7
```



## 用户管理

### useradd

用户的查看可以直接通过`/etc` 目录下的相关文件进入查看，也可以通过`getent`命令指定查看某用户：

```bash
[root@guest ~]# vim /etc/passwd
[root@guest ~]# getent passwd root
```

Linux下root用户享有一切权限，所有一般不会用root用户直接登录操作

而是建立各种不同的用户并为其分配对应的权限或对应的组去操作

创建用户可以通过`useradd` 命令，`-h`参数可以查看帮助信息：

```bash
[root@guest ~]# useradd zhangsan
[root@guest ~]# vim /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
...
chrony:x:998:996::/var/lib/chrony:/sbin/nologin
zhangsan:x:1000:1000::/home/zhangsan:/bin/bash
[root@guest ~]# id zhangsan			# 查看uid gid 和组信息
uid=1000(zhangsan) gid=1000(zhangsan) groups=1000(zhangsan)
[root@guest ~]# ls /home
zhangsan
```

该命令默认会创建一个名为 zhangsan 的用户并为其创建添加到同名的主组，并在`/home`下创建用户目录

通过`/etc/shadow` 可以看到：

```bash
root:$6$wMeOwklmdYVLk7mf$DA2XkvhhL3zRjlYC03S:18547:0:99999:7:::
bin:*:18353:0:99999:7:::
...
chrony:!!:18529::::::
zhangsan:!!:18548:0:99999:7:::
```

新创建的`zhangsan`用户表示密码为'! !'符号，表示密码被禁用无法登录

可以看到新建用户的有效期为99999，这是Linux的默认设置，可以通过更改`/etc/login.defs`文件来修改默认值

`useradd`命令的默认设置可以通过`/etc/default/useradd`来查看：

```bash
[root@guest ~]# vim /etc/login.defs
[root@guest ~]# vim /etc/default/useradd
 useradd defaults file
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel				# 该文件的内容会在创建用户时被默认添加在家目录下
CREATE_MAIL_SPOOL=yes
```

如果想在创建用户时自定义 `UID`、 `GID`、密码、家目录等信息，可以通过`useradd`的`-h`选项来查看帮助

对于系统用户的创建可以使用`-r`选项，不需要家目录，通常也不需要为其指定shell类型来登录：

```bash
# 创建名称为lisi的系统用户，不允许登录，默认不会创建家目录
[root@guest ~]# useradd -r lisi -s /sbin/nologin
```



`adduser`命令也可以添加用户：

```bash
[root@guest ~]# adduser wangwu
[root@guest ~]# getent passwd wangwu
wangwu:x:1001:1001::/home/wangwu:/bin/bash
[root@guest ~]# type adduser
adduser is hashed (/usr/sbin/adduser)
[root@guest ~]# ll /usr/sbin/adduser
lrwxrwxrwx. 1 root root 7 Sep 24 20:57 /usr/sbin/adduser -> useradd
```

可以看到`adduser`通过一个软链接指向了`useradd`



### usermod

通过`usermod -h`命令可以查看修改用户命令的帮助信息：

```bash
[root@guest ~]# usermod -h
Usage: usermod [options] LOGIN

Options:
  -c, --comment COMMENT         new value of the GECOS field
  -d, --home HOME_DIR           new home directory for the user account
  -g, --gid GROUP               force use GROUP as new primary group
  -G, --groups GROUPS           new list of supplementary GROUPS
  -a, --append                  append the user to the supplemental GROUPS
                                mentioned by the -G option without removing
                                the user from other groups
  -h, --help                    display this help message and exit
  -l, --login NEW_LOGIN         new value of the login name
  -L, --lock                    lock the user account
  -m, --move-home               move contents of the home directory to the
                                new location (use only with -d)
  -o, --non-unique              allow using duplicate (non-unique) UID
  -p, --password PASSWORD       use encrypted password for the new password
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
  -s, --shell SHELL             new login shell for the user account
  -u, --uid UID                 new UID for the user account

```

`useradd`创建的新用户默认密码被'! !'禁用，可以通过`-p`选项进行修改：

```bash
[root@guest ~]# getent shadow lisi
lisi:!!:18548::::::
[root@guest ~]# usermod -p 123456 lisi
[root@guest ~]# getent shadow lisi
lisi:123456:18548::::::
```

单叹号表示对用户密码的锁定，可以通过`usermod` 命令加`-L`选项来将某用户的密码加锁：

```bash
[root@guest ~]# usermod -L root
[root@guest ~]# getent shadow root
root:!$6$wMeOwklmdYVLk7mf$DA2XkvhhL3zRjlYC03S:18547:0:99999:7:::
[root@guest ~]# usermod -U root					# 用于解锁用户密码
[root@guest ~]# getent shadow root
root:$6$wMeOwklmdYVLk7mf$DA2XkvhhL3zRjlYC03S:18547:0:99999:7:::
```

双叹号可以防止使用两次`usermod -U`命令来解锁密码后出现空密码的情况，但老版本Linux系统仍然可以被解锁

`添加-G` 选项设置附加组时，会将原来的组覆盖，可以通过`-aG`选项将用户添加到附加组：

```bash
[root@guest ~]# usermode -aG zhangsan group1 group2
```



### userdel

用于删除用户，但默认不会删除用户的家目录等文件，可以通过添加`-r`选项删除家目录和邮件：

```bash
[root@guest ~]# userdel lisi
[root@guest ~]# userdel -r lisi
```

需要注意的是，如果某用户正在登录是中，是无法被删除的



### user操作

`su`命令可以用于切换用户：

```bash
[root@guest /]# su wangwu
[wangwu@guest /]$ su root		# 普通用户切换时需要输入密码
Password:
[root@guest /]#
```

添加 ' - ' 可以使得切换用户时进入的是切换用户的家目录：

```bash
[root@guest /]# su - wangwu
Last login: Tue Oct 13 06:20:31 UTC 2020 on pts/2
[wangwu@guest ~]$
```

`passwd`命令可以用于用户命令的修改，`--help`可以查看其帮助：

```bash
[root@guest ~]# passwd --help
Usage: passwd [OPTION...] <accountName>
  -k, --keep-tokens       keep non-expired authentication tokens
  -d, --delete            delete the password for the named account (root only)
  -l, --lock              lock the password for the named account (root only)
  -u, --unlock            unlock the password for the named account (root only)
  -e, --expire            expire the password for the named account (root only)
  -f, --force             force operation
  -x, --maximum=DAYS      maximum password lifetime (root only)
  -n, --minimum=DAYS      minimum password lifetime (root only)
  -w, --warning=DAYS      number of days warning users receives before password expiration (root only)
  -i, --inactive=DAYS     number of days after password expiration when an account becomes disabled (root only)
  -S, --status            report password status on the named account (root only)
  --stdin                 read new tokens from stdin (root only)

Help options:
  -?, --help              Show this help message
  --usage                 Display brief usage message
```

修改密码信息可以使用`chage`命令：

```bash
[root@guest ~]# chage -h
Usage: chage [options] LOGIN

Options:
  -d, --lastday LAST_DAY        set date of last password change to LAST_DAY
  -E, --expiredate EXPIRE_DATE  set account expiration date to EXPIRE_DATE
  -h, --help                    display this help message and exit
  -I, --inactive INACTIVE       set password inactive after expiration
                                to INACTIVE
  -l, --list                    show account aging information
  -m, --mindays MIN_DAYS        set minimum number of days before password
                                change to MIN_DAYS
  -M, --maxdays MAX_DAYS        set maximum number of days before password
                                change to MAX_DAYS
  -R, --root CHROOT_DIR         directory to chroot into
  -W, --warndays WARN_DAYS      set expiration warning days to WARN_DAYS
```



## 组管理

### groupadd

组的创建方式跟用户的创建方式很类似，`-r`用于创建系统组，即GID < 1000 

也可以使用`-g`指定GID：

```bash
[root@guest ~]# groupadd g1 -g 2000
[root@guest ~]# getent group g1
g1:x:2000:
```

更多选项可以通过`-h`选项查看：

```bash
[root@guest ~]# groupadd -h
Usage: groupadd [options] GROUP

Options:
  -f, --force                   exit successfully if the group already exists,
                                and cancel -g if the GID is already used
  -g, --gid GID                 use GID for the new group
  -h, --help                    display this help message and exit
  -K, --key KEY=VALUE           override /etc/login.defs defaults
  -o, --non-unique              allow to create groups with duplicate
                                (non-unique) GID
  -p, --password PASSWORD       use this encrypted password for the new group
  -r, --system                  create a system account
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       directory prefix
```



### groupmod

用于组信息的修改：

```bash
[root@guest ~]# groupmod -h
Usage: groupmod [options] GROUP

Options:
  -g, --gid GID                 change the group ID to GID
  -h, --help                    display this help message and exit
  -n, --new-name NEW_GROUP      change the name to NEW_GROUP
  -o, --non-unique              allow to use a duplicate (non-unique) GID
  -p, --password PASSWORD       change the password to this (encrypted)
                                PASSWORD
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
```

例如修改刚刚新建的`g1`组名称，并修改GID：

```bash
[root@guest ~]# getent group g1
g1:x:2000:
[root@guest ~]# groupmod -g 20001 -n newgroup1 g1
[root@guest ~]# getent group
root:x:0:
bin:x:1:
...
zhangsan:x:1000:
lisi:x:994:
wangwu:x:1001:
newgroup1:x:20001:
```



### groupdel

用于删除组，需要注意的是主组是无法被删除的：

```bash
[root@guest ~]# groupdel wangwu
groupdel: cannot remove the primary group of user 'wangwu'
[root@guest ~]# groupdel newgroup1
```



### 组操作

`gpasswd`可以用于更改组的密码、添加用户、删除用户等操作：

```bash
[root@guest ~]# gpasswd g1										# 更改组密码
Changing the password for group g1
New Password:
Re-enter new password:
[root@guest ~]# gpasswd -a wangwu g1
Adding user wangwu to group g1
[root@guest ~]# gpasswd -d wangwu g1
Removing user wangwu from group g1
[root@guest ~]# gpasswd -A wangwu g1 					# 设置 wangwu 为 g1 组的管理员可以操作组
```

临时切换主组可以使用`newgrp`命令，如果当前用户不在此组中需要输入密码

更改查看组成员通常使用`groupmems`命令，由于只有`root`用户才可以管理组，所以在`root`用户使用`groupmems`命令时需要使用`-g`选项指定某个组：

```bash
[root@guest ~]# groupmems -a wangwu -g g2			# 添加用户到g2组
[root@guest ~]# groupmems -l -g g2						# 查看g2组成员
wangwu
```



## 权限

### 概述

网络、应用、文件都可以通过用户和组来设置访问权限，这里只讨论关于文件的权限

通过`ls -l`命令可以查看到文件的元数据，其中第一行就包含了权限信息：

```bash
[root@guest ~]# ls -l
total 128
-rw-r--r--. 1 root root 72411 Oct 12 01:34 shadowsocks-all.log
-rwxr-xr-x. 1 root root 46729 Oct 12 01:31 shadowsocks-all.sh
-rw-r--r--. 1 root root   619 Oct 12 01:34 shadowsocks_r_qr.png
```

从第一列我们可以看到共占有10个字符，第一个字符表示文件类型，后9个字符每三个分别表示对不同类型用户对权限划分，其分别代表：

* 文件所属用户
* 文件所属组用户
* 其他用户

其中`r(read)`代表可读权限，`w(write)`代表可写权限，`x(excute)`代表可执行权限

对于目录文件的权限比较特殊，其所有权限都是针对于目录下的文件：

* 比如与Windows相比，Linux下即使没有读权限也可以分配写权限，且删除文件也属于写权限的范畴，只不过是对当前目录文件的内容的修改。也就是说，如果对当前目录文件有写权限，便可以删除当前目录下的文件，与被删除文件的读写权限无关。
* 对于目录文件，其读权限代表可浏览文件列表，但无法查看目录下文件的元数据信息。
* 写权限可以运行在目录下创建，删除文件，但必须要有可执行权限
* 目录内的文件访问（包括元数据信息），修改等操作需要可执行权限



以`shadowsocks-all.sh`文件为例，我们可以从元数据中看到，文件所有者为`root`，所属组为`root`。其权限分别为：

* 文件所属用户：rwx
* 文件所属组用户：r-x
* 其他用户：r-x

**注：**权限的顺序是根据以上顺序来判断的，即先判断所有者，再判断所属组，最后判断其他用户，如果一个文件的组权限不可读，但是在其他用户的权限中可读，那么当改组用户访问该文件时是无法获取的

通过查看`/etc/shadow`的元数据我们发现，该文件并没有任何权限：

```bash
[root@guest data]# ll /etc/shadow
----------. 1 root root 697 Oct 13 06:18 /etc/shadow
```

这可以解释为什么普通用户不可以访问该文件，但奇怪的是`root`却依然可以访问该文件。这是因为Linux中`root`用户拥有所有权限，我们所说的权限设置是针对于普通用户的。但是出于安全考虑，对于执行权限，即使是`root`用户，如果没有权限也无法执行。



### chmod

新建一个`f1`文件以后我们可以通过`ll`命令看到，其默认权限：

```bash
[root@guest /]# touch /data/test
[root@guest data]# ll
total 0
-rw-r--r--. 1 root root 0 Oct 13 07:44 test
```

当切换到其他用户时是没有写权限的，也就时说无法修改文件内容；

```bash
[wangwu@guest /]$ vim /data/test
# "/data/test" E212: Can't open file for writing
```



通过`chmod`命令可以修改用户权限，其语法如下：

```bash
chmod [WHO] [OPTION] [PERM] [FILE]
WHO：u g o a
OPTION: + - =
PERM: r(4) w(2) x(1) X #X表示对文件添加执行权限，而文件不添加执行权限
FILE: 文件名
```

现在需要给`wangwu`用户添加一个`test`文件的写权限：

```bash
[root@guest data]# chmod o+w test
[root@guest data]# ll
-rw-r--rw-. 1 root root 0 Oct 13 07:44 test
```

这时`wangwu` 用户即可以修改`test`文件了

`chown` 命令可以修改文件的所有者(以及所有组)：

```bash
[root@guest data]# ll
-rw-r--rw-. 1 root root 0 Oct 13 07:44 test
[root@guest data]# chown wangwu test
[root@guest data]# ll
-rw-r--rw-. 1 wangwu root 0 Oct 13 07:44 test
[root@guest data]# chown wangwu.bin test
[root@guest data]# ll
-rw-r--rw-. 1 wangwu bin 0 Oct 13 07:44 test
```

如果只修改所以组可以使用`chgrp`命令：

```bash
[root@guest data]# ll
-rw-r--rw-. 1 root root 0 Oct 13 07:44 test
[root@guest data]# chgrp bin test
[root@guest data]# ll
-rw-r--rw-. 1 root bin 0 Oct 13 07:44 test
```

**注：**`chown`和`chgrp`命令都可以添加`-R`选项来将目录下的所有文件修改所有者

现在我们将文件的所有者改成`wangwu`以后会发现，该用户不能访问该文件：

  ```bash
[root@guest data]# ll
----r--rw-. 1 wangwu root 0 Oct 13 07:44 test
[wangwu@guest data]$ vim test
# "test" [Permission Denied]
  ```

但由于`wangwu`用户是文件所有者，所以该用户可以自己修改文件权限后访问

权限的修改也可以直接用三个数字分别表示三种用户，每个数字用权限所对应数字相加即可：

 ```bash
[wangwu@guest data]$ chmod 755 test		# 7 = 4 + 2 + 1 即表示所有权限 5 同理
[wangwu@guest data]$ ll				
total 4
-rwxr-xr-x. 1 wangwu root 21 Oct 13 08:08 test
 ```

`chmod`命令还可以在给某文件添加权限时使用`--reference`来参考某文件的权限：

```bash
[root@guest data]# ll
drwxr--r-x. 2 root   root 4096 Oct 13 08:49 dir1
[root@guest data]# touch test2
[root@guest data]# chmod --reference dir1 test2
[root@guest data]# ll
drwxr--r-x. 2 root   root 4096 Oct 13 08:49 dir1
-rwxr--r-x. 1 root   root    0 Oct 13 09:05 test2
```



### 默认权限

新建文件或者目录的时候都会有默认的访问权限，可以通过`umask`命令来设置默认的访问权限。

`umask`的设置规则与网络中的子网掩码类似，即`umask`设置的权限位对应的默认权限会被抹去。

默认情况下`root`的`umask`为0022，普通用户为0002（第一位为特殊权限）：

```bash
[root@guest ~]# umask
0022
[wangwu@guest root]$ umask
0002
```

出于安全考虑文件的可执行权限默认为限制，所以新建的文件权限会将可读和可写权限与`umask`做匹配，例如`root`用户下默认：

```bash
666	=> 110 110 110 
022 => 000 010 010
------------------
644 => 110 100 100
```

而对于文件目录则是以全部权限与`umask`做匹配，比如普通用户下：

```bash
777 => 111 111 111
002 => 000 000 010
------------------
775 => 111 111 101
```

修改`umask`值即使得文件或文件目录在创建时默认设置权限

`umask`值的修改可以在运行直接键入`umask [权限]`设置：

```bash
[root@guest ~]# umask 002
[root@guest ~]# umask
0002
```

此时的修改仅存于内存中，想保存到全局设置或用户设置，可以分别写入文件`/etc/bashrc`和`~/.bashrc/`

`umask`还提供了`-S` 选项来避免计算，直接设置权限：

```bash
root@guest ~]# umask u=rw g=r o=
[root@guest ~]# umask
0122
[root@guest ~]# touch f2
[root@guest ~]# ll
-rw-r--r--. 1 root root     0 Oct 14 03:04 f2
```



### 特殊权限

通过查看`/etc/shadow`元数据可以看到，其访问权限为空：

```bash
[root@guest ~]# ll /etc/shadow
----------. 1 root root 697 Oct 13 06:18 /etc/shadow
```

那么问题来了，用户仍然可以通过`passwd`命令修改自己的密码，`/etc/shadow`中的文件依然会被修改？

通过查看`passwd`我们可以看到：

 ```bash
[root@guest ~]# stat `which passwd`
stat `which passwd`
  File: ‘/usr/bin/passwd’
  Size: 27856     	Blocks: 56         IO Block: 4096   regular file
Device: fd01h/64769d	Inode: 12213       Links: 1
Access: (4755/-rwsr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)
Context: system_u:object_r:passwd_exec_t:s0
Access: 2020-10-13 06:23:01.094108340 +0000
Modify: 2020-04-01 03:57:19.000000000 +0000
Change: 2020-09-24 20:57:39.582579650 +0000
 Birth: -
 ```

其中访问权限为`4755/-rwsr-xr-x`，特殊权限位为4，通过`man passwd`以及`man chmod`可以查找到，特殊权限位对应的字段：

```bash 
Octal Mode Bit Octal Mode Bit Octal Mode Bit Octal Mode Bit
4000  S_ISUID  0400  S_IRUSR  0040  S_IRGRP  0004  S_IROTH
2000  S_ISGID  0200  S_IWUSR  0020  S_IWGRP  0002  S_IWOTH
1000  S_ISVTX  0100  S_IXUSR  0010  S_IXGRP  0001  S_IXOTH
```

> This  volume  of  IEEE Std 1003.1-2001  allows the chmod utility to choose to modify these bits before calling chmod() (or some function providing equivalent capabilities) for non-regular files. Among other things, this allows implementations that use the set-user-ID and set-group-ID bits on directories to  enable  extended features to handle these extensions in an intelligent manner.

`SUID`和`SGID`即`set-user-ID-on-execution` 和 `set-group-ID-on-execution`表示在运行的时候将允许一些特殊的文件在运行权限检查或其他类似方法之前修改文件的访问方式，这里的`/usr/bin/passwd`即可以在运行某文件前修改文件的`UID`，这样即使是普通用户在调用`/usr/bin/passwd`时也可以将`/etc/shadow`修改

`SGID`有一个常见的应用场景，即设置在目录上，使得该组用户在此目录下新建的文件都属于该组：

```bash
[root@guest ~]# useradd user1
[root@guest ~]# useradd user2
[root@guest ~]# groupadd webgroup
[root@guest ~]# groupmems -a user1 -g webgroup
[root@guest ~]# groupmems -a user2 -g webgroup

[root@guest ~]# mkdir /data/web
[root@guest ~]# chgrp webgroup /data/web
[root@guest ~]# chmod 2774 /data/web
[root@guest ~]# ll /data
drwxrwsr--. 2 root webgroup 4096 Oct 14 07:04 web

[user1@guest data]$ touch ./web/file
[user1@guest data]$ ll web
-rw-rw-r--. 1 user1 webgroup 0 Oct 14 07:04 file
```

还有一个特殊的权限`SVTX`，表示仅文件所有者可以执行文件：

```bash
[root@guest ~]# chmod 1777 /data
[wangwu@guest data]$ ll
drwxr-xr-x. 2 root   root 4096 Oct 14 06:21 t
-rw-r-xr-x. 1 wangwu root   21 Oct 13 08:08 test
[wangwu@guest data]$ rm -rf t
rm: cannot remove ‘t’: Operation not permitted
[wangwu@guest data]$ rm -rf test
[wangwu@guest data]$ ll
drwxr-xr-x. 2 root root 4096 Oct 14 06:21 t
```

由于`root`用户的权限过大，可能出现一些对文件的误操作，可以使用`chattr`命令来设置`root`用户对文件的访问权限，常用参数有`'-a'`仅运行追加文件，`'-i'`不允许任何操作：

```bash
[root@guest data]# chattr +i t
[root@guest data]# rm -rf t
rm: cannot remove ‘t’: Operation not permitted
[root@guest data]# chattr -i t
[root@guest data]# rm -rf t
```



## ACL

以上的权限设置策略并不灵活，比如需要对某个用户单独设置某个文件的权限，通过用户和组的方式就很难实现。于是有了ACL(Access Control List)访问控制列表，来对文件设置额外的访问权限。其命令为`setfacl`，可以通过`-h` 选项来查看帮助

对`wangwu`用户单独设置对`/data/dir1`文件夹下的访问权限：

```bash
[root@guest data]# setfacl -m u:wangwu:- /data/dir1
[root@guest data]# su wangwu
[wangwu@guest data]$ ll dir1
ls: cannot open directory dir1: Permission denied
```

也可以对组进行设置`setfacl -m g:webgroup:5 /data/dir1`

对某个文件的访问权限可以通过`getfacl`来查看：

```bash
[wangwu@guest data]$ getfacl dir1
# file: dir1
# owner: root
# group: root
user::rwx
user:wangwu:---
group::r--
mask::r--
other::r-x
```

`ACL`的生效顺序就如同输出结果：所有者>自定义组>自定义组>其他人

当一个用户属于多个组时，`ACL`中的配置策略将会叠加，即如果`user` 用户数据可读组和一个可写组，那么该用户对此文件同时拥有读写权限

对`ACL`策略删除可以使用`'x'`选项或者`'-b'`清空所以权限：

```bash
[root@guest data]# setfacl -x u:wangwu dir1
[root@guest data]# setfacl -b dir1
```

`ACL`还可以解决递归设置权限的问题， 可以使用`-R`选项对某用户和某目录下的所有文件设置权限：

```bash
[root@guest data]# setfacl -R -m u:wangwu:6 web
[root@guest data]# setfacl -R -x u:wangwu web
```

还可以通过 `-d`选项设置目录下新建文件的默认`ACL`策略

```bash
[root@guest data]# setfacl -R -m d:u:wangwu:7 web
```

`setback`还可以设置`mask`值来设置指定用户和组的最高权限，但是其他用户和文件所有者不受影响：

 ```bash
[root@guest data]# setfacl -R -m mask::r web
[root@guest data]# getfacl web
# file: web
# owner: root
# group: webgroup
# flags: -s-
user::rwx
group::rwx			#effective:r--
mask::r--
other::rwx
default:user::rwx
default:user:wangwu:rwx
default:group::rwx
default:mask::rwx
default:other::r--
 ```

`cp`和`mv`等命令都支持`ACL`，只需要加上参数`-p`即可，但是像`tar`之类的备份工具不会保留目录和文件的`ACL`信息。我们可以将其中的`ACL`信息导出到某个文件，然后在重新设置：

```bash

```

**注：**不是所有文件系统都支持`ACL`，CentOS7 中的 xfs 和 ext4 是支持的。
