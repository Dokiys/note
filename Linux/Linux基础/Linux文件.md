# Linux文件

## 标准目录结构

![Linux标准目录结构](../../image/Linux/Linux文件/d0c50-linux2bfile2bsystem2bhierarchy.jpg)

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
*  l：符号连接文件
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





