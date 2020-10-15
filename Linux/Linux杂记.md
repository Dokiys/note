# $PS1

`$PS1`参数可以更改命令行的提示前缀，在内存中修改只影响当前会话，可以将修改保存至`~/.bashrc`中

加入:

```bash
export PS1='\[\e[32;40m\]> \[\e[36;40m\][\[\e[36;40m\]\u \[\e[36;40m\]\w]\$ \[\e[37;40m\]'
```



```bash
> [root ~]$ vim .bashrc

# User specific aliases and functions
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
export PS1='\[\e[32;40m\]> \[\e[36;40m\][\[\e[36;40m\]\u \[\e[36;40m\]\w]\$ \[\e[37;40m\]'
# Source global definitions
> [root ~]# . .bashrc 			# 将配置文件重新加载到内存，使修改立即生效
```

