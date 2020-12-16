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

![](../image/Linux/Linux文本/vim_mode.png)



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
*  `%`：全文

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



## 文本处理小工具

### 批量对多行文件进行相同处理：

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

