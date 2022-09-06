# Shell

Shell programming can be accomplished by **directly executing shell commands at the shell prompt** or **by storing them in the order of execution, in a text file, called a shell script**, a command-line interpreter (CLI) . To execute, simply write the shell script file name, once the file has execute permission (`chmod +x filename`).

There is different types of shells, such as sh, bash, zsh etc. 
The Bourne shell (sh) is regarded as the first UNIX shell ever. The Bourne shell has some major drawbacks, for example it doesn't have in-built functionality to handle logical and arthmetic operations. 
More popularly known as the Bash shell, the GNU Bourne-Again shell (bash) was designed to be compatible with the Bourne shell. It allows us to automatically recall previously used commands and edit them with help of arrow keys, unlike the Bourne shell.
The Z Shell (zsh) is a sh shell extension with more improvements for customization, including some features of Bash.

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
echo ${#my_array[@]}                    # 5
echo ${my_array[${#my_array[@]}-1]}     # carrot
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

### Arithmetic Operators

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

### String Operations





## 一行执行多个命令

`;`用于区分多个命令，各命令直接的执行互不影响

```bash
> cat 1.txt; ls
cat: 1.txt: No such file or directory
2.txt
```

**&&**前面的命令执行成功才会执行后面的命令

```bash
> cat 1.txt && ls
cat: 1.txt: No such file or directory
```

`||`当前面的命令执行失败后才会执行后面的命令

```bash
> cat 1.txt || touch 1.txt; ls
cat: 1.txt: No such file or directory
1.txt 2.txt
```



## 默认确认

有些命令在执行时需要键入Y/n进行确认，在执行命令时添加`-y`参数，可以默认进行确认
