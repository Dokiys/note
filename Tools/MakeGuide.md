## MakeGuide

## 概述

对于像C这样需要编译的语言来说，编写的代码，需要编译器将其编译为能够被计算机识别的二进制文件。当一个相当庞大的项目因为某个文件细微的修改，并且需要被重新编译的时候，`make`便产生了。正如`make`的`man`文档里面说的：

> The purpose of the make utility is to determine automatically which pieces of a large program need to be recompiled, and issue the commands to recompile them.



## Makefile与规则语法

`make`会尝试依次寻找当前执行目录下的`GNUmakefile`, `makefile`, `Makefile`，并在找到后根据内容执行。（通常都会使用官方建议的`Makefile`来命名）

`Makefile`由`rules`组成，其语法如下：

```
target … : prerequisites …
        recipe
        …
        …
```

`target`表示期望生成的文件，至少有一项，多项通过空格区分  
`prerequisites`表示生成`target`所依赖的文件，可以有任意项，通过空格区分  
`recipe`表示是`make`需要执行的`shell`命令，以生成`target`，如果此项为空则仅表示有依赖关系。（`Makefile`使用基于行的语法，`recipe`如果有多行，需要通过`\`进行换行）

`make`将会在 1. 自从上一次`target`被修改后，如果`prerequisites`有过变动；或者 2. `target`不存在的情况下在此执行对应的`recipe`。

对于一组相同的文件，可以通过**模式符`%`**设置`Static Pattern Rules`，利用通配符统一设置：

```
targets …: target-pattern: prereq-patterns …
        recipe
        …
```

其表示`targets`与`target-pattern`匹配过滤之后再和`prereq-patterns`组成一条`rule`。比如：

```
objects = foo.o bar.o
all: $(objects)

$(objects): %.o: %.m
	@echo $< && touch $@
```

表示，在`objects`中，能够成功匹配`%.o`的`target`依赖于`%.m`的文件（`%`表示能够匹配的部分，比如`foo.o`依赖于`foo.m`）  
在这条规则中`recipe`中的**`$<`**表示`prereq-patterns`匹配的`prerequisites`（`foo.m`或者`bar.m`）。**`$@`**表示`target-pattern`匹配的`target`（`foo.o`或者`bar.o`）  （可参考[Automatic Variables](https://www.gnu.org/software/make/manual/make.html#Automatic-Variables)）

`make`中一条规则只能被执行一次，所以这里额外使用了一条规则，让`target`依赖于`objects`中的每一个元素。  
`recipe`默认会先输出内容再执行，以`@`关键字开头，可以避免`recipe`输出。



## .PHONY

如果你不是在为一个C语言的程序准备`Makefile`，那以上的内容似乎都不太重要。至少在我绝大部分使用场景中，不将文件作为`Makefile`中一条规则的`target`，取而代之的是伪目标`.PHONY`。

`·PHONY`用于指定一些`rule`的`target`为伪目标（通常一个`.PHONY`指会指定一条`rule`），即没有真正与之对应的文件名。这样当我们执行`make`或者 `make [target]`的时候，无论是否存在名为`target`的文件，该条`rule`都会被执行。

```
.PHONY: clean
clean:
	@rm -f *.o
```

也许这是`make`多年来在各种语言便携的项目中仍然这么受欢迎的原因。我们可以通过`.PHONY`定义一些常用的命令，然后通过`make`执行，这比起便携`shell`脚本相当便捷。并且`rule`的`recipe`也可以指定`shell`脚本：

```
.PHONY: shell
shell:
	@make.sh
```



## include

`Makefile`可以通过`include`关键字引入任一符合`Makefile`语法的文本文件（通常设定后缀为`.mk`）  
比如文件`include_mk`如下：

```makefile
B='b'

.PHONY: a
a:
	@echo "a"
```

在`Makefile`中可以引入并使用`A`变量和`target b`：

```makefile
include include_mk
.PHONY: b
b: a
	@echo $(B)
```

```bash
$ make b
b
a
```



## Variables

之前我们已经接触到了如`objects`这样直接定义变量的方式，其作用域为整个`Makefile`文件，以及将该文件引入的其他文件。默认的变量定义为导出的，即可以被引入该文件的其他`Makefile`直接使用。当然我们可以指定改变量是否可以被引入者使用，比如如下的`var.mk`中的变量定义：

```makefile
unexport UNEXP_VAR=null
export EXP_VAR=exp
DEFEXP_VAR=defexp
```

`Makefile`中引入并使用：

```makefile
include var.mk
.PHONY: var
var:
	@echo "UNEXP_VAR: $(UNEXP_VAR)" && \
	echo "EXP_VAR: $(EXP_VAR)" && \
	echo "DEFEXP_VAR: $(DEFEXP_VAR)" 
```

```bash
$ make var
UNEXP_VAR: 
EXP_VAR: exp
DEFEXP_VAR: defexp
```

**Target Variables**

此外还可以定义作用域为`target`的变量，其语法如下：

```
target … : variable-assignment
```

```makefile
.PHONY: target_var
target_var: TARGET_VAR=1
target_var: TARGET_VAR2=2
target_var:
	@echo "TARGET_VAR: $(TARGET_VAR)\nTARGET_VAR2: $(TARGET_VAR2)"
```

**Variables from the Environment**

`make`可以直接获取到运行时的环境变量：

```makefile
.PHONY: env_var
env_var:
	@echo "ENV_VAR: $(GOVERSION)"
```

所以我们可以指定一些参数，并且在运行时通过环境变量的方式传入。比如：

```makefile
BASH=/bin/bash
.PHONY: make_bash
make_bash:
	$(BASH) $(GFLAGS) '$(CMD)'
```

```bash
$ make make_bash GFLAGS='-c' CMD='echo 123'
/bin/bash -c 'echo 123'
123
```

甚至我们可以通过模式匹配的方式，来设置一系列的`target`：

```makefile
.PHONY: %
%:
	/bin/$* $(GFLAGS) '$(CMD)'
```

```bash
$ make bash  GFLAGS='-c' CMD='echo 123'     
/bin/bash -c 'echo 123'
123
```

`$*`表示匹配的内容。



## Example

**使用`buf`整理`proto`文件格式**

```makefile
.PHONY: protofmt
protofmt:
   @(buf --version > /dev/null 2>&1 || ( echo "make protofmt: command not found: buf" && echo "  (run \`go install github.com/bufbuild/buf/cmd/buf@latest\` to install)" && exit 2; )) && \
   for file in `find proto -name '*.proto'`; do \
      buf format $$file -o $$file; \
   done; \
```



**urfave/cli的测试脚本**

```makefile
GO_RUN_BUILD := go run internal/build/build.go

# NOTE: this is a special catch-all rule to run any of the commands
# defined in internal/build/build.go with optional arguments passed
# via GFLAGS (global flags) and FLAGS (command-specific flags), e.g.:
#
#   $ make test GFLAGS='--packages cli'
%:
	$(GO_RUN_BUILD) $(GFLAGS) $* $(FLAGS)
```

