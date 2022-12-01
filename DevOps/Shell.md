# Shell

Shell programming can be accomplished by **directly executing shell commands at the shell prompt** or **by storing them in the order of execution, in a text file, called a shell script**, a command-line interpreter (CLI) . To execute, simply write the shell script file name, once the file has execute permission (`chmod +x filename`).

There is different types of shells, such as sh, bash, zsh etc. 

* The Bourne shell (sh) is regarded as the first UNIX shell ever. The Bourne shell has some major drawbacks, for example it doesn't have in-built functionality to handle logical and arthmetic operations. 
* More popularly known as the Bash shell, the GNU Bourne-Again shell (bash) was designed to be compatible with the Bourne shell. It allows us to automatically recall previously used commands and edit them with help of arrow keys, unlike the Bourne shell.
* The Z Shell (zsh) is a sh shell extension with more improvements for customization, including some features of Bash.

We will discusses shell programming in general with focus on **Bash** shell as the main shell interpreter.

## Hello, Work!

It is common to name the shell script with the ".sh" extension. And the first line begins with a "sha-bang" (#!) which proclaim where the shell interpreter is located. It like this:

```bash
#!/bin/bash
```

or

```bash
#!/usr/bin/env bash
```

The latter finds `bash` in current `env`, lends you some flexibility on different systems.
To add a shell command like following:

```bash
#!/bin/bash
#!/usr/bin/env bash		# comment

# To print Hello Work!
echo 'Hello Work!'
```

And any text following the "#" is considered a comment expect "sha-bang" at first line.
Excuting this shell programming by:

```bash
$ chmod +x hello_work.sh
$ ./hello_work.sh
Hello Work!
```



## Variables

### Basic

Shell variables are created once are assigned,  case sensitive and can consist of a combination of letters and the underscore "_". A variable can contain a number, a character or a string of characters. 

```bash
PRICE_PER_APPLE=5
MyFirstLetters=ABC
single_quote='Hello        world!'		# Won't interpolate anything.
double_quote="Hello   $MyFirstLetters     world!"		# Will interpolate.
escape_special_character="Hello   \$MyFirstLetters     world!"		# Use backslash.
```

Variables can be assigned with the value of a command output, called **substitution**. Substitution can be done by encapsulating the command with `` ` ` ``(known as back-ticks) or with `$()`. When the script runs, it will run the command inside the` $()`parenthesis or  `` ` ` `` and capture its output.

```bash
one=`echo 1`
FileWithTimeStamp=/tmp/my-dir/file_$(/bin/date +%Y-%m-%d).txt
```

### Arrays

An array is initialized by assign space-delimited values enclosed in `()`. Array members need not be consecutive or contiguous. Some members of the array can be left uninitialized.

```bash
my_array=(apple banana "Fruit Basket" orange)
new_array[2]=apricot
```

The array elements can be accessed with their numeric index. The index of the first element is 0.

```bash
echo ${my_array[3]}                     # orange - note that curly brackets are needed
# adding another array element
my_array[4]="carrot"                    # value assignment without a $ and curly brackets

# Double quote array expansions to avoid re-splitting elements.
echo "${my_array[@]}"                   # => apple banana Fruit Basket carrot
echo ${#my_array[@]}                    # => 5
echo ${my_array[${#my_array[@]}-1]}     # => carrot
```



### Special variables

Here are some special variables in shell:

* `$0` - The filename of the current script.
* `$n` - The Nth argument passed to script was invoked or function was called.
* `$#` - The number of argument passed to script or function.
* `$@` - All arguments passed to script or function.
* `$*` - All arguments passed to script or function.
* `$?` - The exit status of the last command executed.
* `$$` - The process ID of the current shell. For shell scripts, this is the process ID under which they are executing.
* `$!` - The process number of the last background command.

```bash
# => $ ./variables.sh 1 "2 2" 3
echo "Script Name: $0"              # => Script Name: ./variables.sh
echo "Second arg: $2"               # => Second arg: 2 2
echo "Arg Num: $#"                  # => Arg Num: 3
echo "Exit status: $?"              # => Exit status: 0
echo "The process ID: $$"           # => The process ID: 4589
echo "As a separate argument: $@"   # => As a separate argument: 1 2 2 3
echo "As a one argument: $*"        # => As a one argument: 1 2 2 3
```

The following shows the defference between `$@` and `$*`:

```bash
# => $ ./variables.sh 1 "2 2" 3
echo '--- $*'
for ARG in "$*"; do
  echo $ARG
done
# => 
# --- $*
# 1 2 2 3

echo '--- $@'
for ARG in "$@"; do
  echo $ARG
done
# => 
# --- $@
# 1
# 2 2
# 3
```



## Operators

### Arithmetic

To calculate simple arithmetics on variables should use: `$((expression))`

```bash
A=3
B=$((100 * $A + 5)) # 305
```

The basic operators include:

* **a + b** addition (a plus b)
* **a - b** substraction (a minus b)
* **a \* b** multiplication (a times b)
* **a / b** division (integer) (a divided by b)
* **a % b** modulo (the integer remainder of a divided by b)
* **a** ****** **b** exponentiation (a to the power of b)



### String

**Length**

```bash
STRING="this is a string"
echo "length STRING: ${#STRING}" # => length STRING: 16
```

**Extraction**
Extract substring of length `$LEN` from `$STRING` starting after position `$POS`:

```bash
STRING="this is a string"
POS=0
LEN=4
echo ${STRING:$POS:$LEN} # => this
```

 If `$LEN` is omitted, extract substring from `$POS` to end of line:

```bash
STRING="this is a string"
echo ${STRING:10}        # => this
echo ${STRING:(-6)}      # => this
```

**Replacement**
Replace `all/firest/beginning/end` or delete occurrences of substring:

```bash
REPLACE_STRING="to be or not to be"
echo "Replace first:      ${REPLACE_STRING[*]/be/eat}"        # => to eat or not to be
echo "Replace all:        ${REPLACE_STRING[*]//be/eat}"       # => to eat or not to eat
echo "Delete:             ${REPLACE_STRING[*]// not}"         # => to be or to be
echo "Replace beginning:  ${REPLACE_STRING[*]/%to be/to eat}" # => to be or not to eat
echo "Replace end:        ${REPLACE_STRING[*]/#to be/to eat}" # => to eat or not to be
```



### File Test

Shell provide you with several useful commands to do some file tests on file system. The file test operators are mostly used in the if clause. The syntax likes below:

```bash
# file test operators
if [ -e "function.sh" ]; then			# => or if [ ! -e "function.sh" ];
  echo "function.sh is exist!"		# => function.sh is exist!
fi
```

Common options are as follows:

* `-e`: True if the file exists.
* `-d`: True if the file exists and is a directory.
* `-f`: True if the file exists and is a regular file.
* `-r`: True if the file exists and is readable.
* `-w`: True if the file exists and is writable.
* `-x`: True if the file exists and is executable.



## Expression

### Comparisons

**Number**

```bash
comparison   Evaluated to true when
$a -lt $b    $a < $b
$a -gt $b    $a > $b
$a -le $b    $a <= $b
$a -ge $b    $a >= $b
$a -eq $b    $a is equal to $b
$a -ne $b    $a is not equal to $b
```

**String**

```bash
comparison    	Evaluated to true when
"$a" = "$b"     $a is the same as $b
"$a" == "$b"    $a is the same as $b
"$a" != "$b"    $a is different from $b
-z "$a"         $a is empty
```



### Decision Making

The shell supports logical decision making. Baisc use:

```bash
if [ "$NAME" = "Zhangsan" ]; then
  echo "Hello Zhangsan!"
elif [ "$NAME" = "Lisi" ]; then
  echo "Hi Lisi!"
else
  echo "Wow"
fi
```

The expression used by the conditional construct is evaluated to either true or false. The expression can be a single string or variable. A **empty string** or a string consisting of **spaces** or an **undefined variable** name, are evaluated as false.

**Logical combination**
The expression can be a logical combination of comparisons, **negation** is denoted by `!`, ogical AND (**conjunction**) is `&&`, logical OR (**disjunction**) is `||`. Conditional expressions should be surrounded by double brackets `[[ ]]`:

```bash
VAR_A=(1 2 3)
VAR_B="be"
VAR_C="cat"
if [[ ${VAR_A[0]} -eq 1 && ($VAR_B = "bee" || $VAR_C = "cat") ]] ; then
    echo "True"
fi
```

**Case structure**
Case structure support more cases:

```bash
CASE_CONDITION="one"
case $CASE_CONDITION in
"one") echo "You selected bash" ;;
"two") echo "You selected perl" ;;
"three") echo "You selected python" ;;
"four") echo "You selected c++" ;;
"five") exit ;;
esac
```



### Loops

**`for`** support array or command output results:

```bash
NAMES=('Joe Ham' Jenny Sara Tony)
for N in "${NAMES[@]}" ; do
  echo "My name is $N"
done
```

```bash
for N in $(echo -e 'Joe Ham' Jenny Sara Tony) ; do
  echo "My name is $N"
done
```

**`while`** if condition is true, **`until`** if condition is false, executes commands:

```bash
WHILE_COUNT=3
while [ $WHILE_COUNT -gt 0 ]; do
  echo "Value of count is: $WHILE_COUNT"
  WHILE_COUNT=$(($WHILE_COUNT - 1))
done
```

```bash
UNTIL_COUNT=1
until [ $UNTIL_COUNT -gt 3 ]; do
  echo "Value of count is: $UNTIL_COUNT"
  UNTIL_COUNT=$(($UNTIL_COUNT + 1))
done
```

**break** and **continue**, like most language, can be used to control loop execution:

```bash
echo
CTRL_COUNT=3
while [ $CTRL_COUNT -gt 0 ]; do
  if [ $CTRL_COUNT -eq 1 ]; then
    CTRL_COUNT=$(($CTRL_COUNT - 1))
    continue
  fi
  echo "Value of count is: $CTRL_COUNT"
  if [ $CTRL_COUNT -eq 3 ]; then
      break
  fi
done
```



## Function

The function syntax likes below:

```bash
function add {
  echo "$(($1 + $2))"
}
```

A function call is equivalent to a command. Parameters may be passed to a function, by specifying them after the function name. 

```bash
echo "$(add 1 2)"		# => 3
```

By default all variables are global. You can create a local variables using the `local`:

```bash
function Hello {
	local NAME="zhangsan"
	echo $NAME
}
echo $NAME	# => (NULL)
```



## Pipelines

**Background**
As we know, under normal circumstances every Linux program has three streams opened when it starts; one for input; one for output; and one for printing diagnostic or error messages. The three as special file descriptors, which are represented by:

* stdin:  `0`
* stdout: `1`
* stderr: `2` 

By default, `stdout` and `stderr` are printed to your terminal, that's why we can see them at all. `>` operator can help us redirect them to a other `file descriptor`. For example: 

```bash
$ echo "hello work!" 1> hello 		# default stdstream is stdout, '1>' equal `>`
$ cat hello
hello
```

Redirect to stdstream use `>&`, such as: `echo "hello work!" 1>&2`.
We can referene below to understand stdstream, to avoid stderr print to terminal, I redirect stderr to `/dev/null`:

```bash
function out() {
  echo "Standard output"
}

function err() {
  echo "Standard error" 1>&2
}
```

```bash
echo "out stdout: $(out 2>/dev/null)"		# => out stdout: Standard output
echo "err stdout: $(err 2>/dev/null)"		# => err stdout: 
```



## Pipes

Pipelines is a way to chain commands and connect stdout from one command to the stdin of the next. By default pipelines redirects standard output only.
A pipeline is represented by the pipe character: `|`. To show pipes, we use a command `read`，which will help us read from stdin:

```bash
function isNull() {
  read in		# rean from stdin and assign to $in
  if [[ ${#in} -eq 0 ]]; then
    echo "True"
  else
    echo "False"
  fi
}
```

```bash
echo "out isNull: $(out 2>/dev/null | isNull)"		# => out isNull: False
echo "err isNull: $(err 2>/dev/null | isNull)"		# => err isNull: True
```

If you want to include the standard error need to use the form `2>&1 |`:

```bash
echo "err redirect isNull: $(err 2>&1 | isNull)"	# => err redirect isNull: False
```



## Built-in

Shell builtin commands are commands that can be executed within the running shell's process. Most builtin commands will be used directly. Some time Shell will use external commands, for example `echo`. Under macOS `echo` just support `-n` option. The following shows how to use builtin `echo`：

```bash
$ builtin echo -e "123\\\111/asd/"
123\111/asd/
$ bash -c "echo -e \"123
\\\111/asd/\""
123\111/asd/
```

# Programs

## Builtin

### `&&,||,;`

```
&& => 左边命令返回true，执行右边命令
|| => 左边命令返回false， 执行右边命令
;  => 多个命令单独执行
```

### awk

```bash
$ cat 1.txt
1 a
2 b
3 c
$ cat 1.txt | awk -v OFS='\t,\t' '{print$1,$2}'
1	,	a
2	,	b
3	,	c
```

添加筛选条件：

```bash
$ cat 1.txt | awk '$2=="1" || $2=="2" {print $0}'
```



### dirname

```bash
# 打印出文件夹路径
$ dirname deploy/report/rpc/Dockerfile
deploy/report/rpc
```

### du

```bash
# 查看文件夹下的文件大小
du -sh *
du -s * | awk -v OFS='\t' '{print$1,$2}' | sort -n | awk '{print$2}'
```

### envsubst

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

### grep

按行查找内容

```bash
$ cat 1.txt 
1
2
3
$ cat 1.txt | grep -v '1' | grep '2'		# 先排除'1'，再查找'2'
3
```

### read

接收控制台输入，并按照指定名称创建参数：

```bash
$ read var_name && echo $var_name
123
123
```

### scp

Linux命令行下可以通过`scp`命令传输文件，添加`-r`选项可以传输目录

从服务器下载文件

```bash
> [bysj ~]$ scp username@servername:/path/filename /tmp/local_destination
```

上传本地文件目录到服务器

```bash
> [bysj ~]$ scp -r /path/local_filename username@servername:/path 
```

### shift

```bash
#!/usr/bin/env bash

while [ $# != 0 ]; do
  echo "args: $*"
  shift
done
```

```bash
./shift.sh 1 2 3
args: 1 2 3
args: 2 3
args: 3
```

### tar & zip

```bash
tar -czvf [文件名].tar.gz	1.txt 2.txt					#压缩
tar -xzvf [文件名].tar.gz	-C [指定解压路径]			#解压缩
```

```bash
# -c ：create、-x ：打开归档文件、-z ：压缩、-v ：view
# -f ：归档文件名，应用在最后一个参数，后直接跟归档文件名，再跟需要归档的文件
# -C：指定指定解压路径
# 如果打包的没有采用-z压缩，则还可以添加 -r 选项来追加文件：
tar -rvf [文件名].tar [被追加的文件名]
```

zpi 用于压缩制定的文件， `-r`选项可以递归压缩目录下的文件：

```bash
zip -r myfile.zip 1.txt 2.txt Dir
```

```bash
# 添加/删除某文件
zip -m myfile.zip 3.txt
zip -d myfile.zip 2.txt
```

`unzip`可以将压缩文件解压缩，`-d`用于制定解压路径：

```bash
unzip -d ./doc myfile.zip
```

### trap

`trap`可以捕获系统信号，比如：

* `Ctrl+C`可以触发`SIGINT`
* `Ctrl+Z`可以触发`SIGSTOP`，`SIGKILL`/`SIGSTOP` 不会被捕获
* *`Ctrl+D`仅仅只是输入`EOF`，不会触发系统信号

```bash
#!/usr/bin/env bash

trap "echo Booh!" SIGINT SIGSTOP
echo "it's going to run until you hit Ctrl+Z"
echo "hit Ctrl+C to be blown away!"

while true
do
    sleep 60
done
```

```bash
$ ./trap.sh
it's going to run until you hit Ctrl+Z
hit Ctrl+C to be blown away!
^CBooh!
^CBooh!
^CBooh!
^Z
[2]  + 55377 suspended  ./trap.sh
```



### tr & sed

`tr`按照给定的**字符**，对标准入进行替换：

```bash
$ echo 'Hello work!' | tr a-z A-Z | tr ' ' '\n'
HELLO
WORK!
```

`sed`根据指定的参数修改标准输入并写入标准输出：

```bash
$ echo 'Hello work!' | sed 's/Hello/Hola/g'
Hola work!
```

```bash
# -i 直接修改原文件
$ echo 'Hello work!' > temp.txt && sed -i 's/Hello/Hola/g' temp.txt && cat temp.txt
Hola work!
# 删除/向后新增/向前新增
$ sed -i '/target_content/d' temp.txt
$ sed -i '/target_content/a new_content' temp.txt
$ sed -i '/target_content/i new_content' temp.txt
# 匹配行中替换某个字符串
$ sed -i '/target_line/s/target_content/new_content/g' temp.txt
```



## Others

### goreman

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

### terminalizer

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



###  zshrc alias

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



