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



## 文本三剑客

* grep：文本过滤工具
* sed：文本编辑工具
* awk：文本报告生成器

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
> `-e`：逻辑 或 ，可以添加多个条件
>
> `-w`：匹配字符为单词
>
> `-f`：根据指定文件中的内容去匹配
>
> `-o`：只显示正则表达式匹配的部分

正则表达式的内容可以参见[Regexp.md](../Other/Regexp.md)