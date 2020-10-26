#### 忌！

切记在命令行乱敲回车！

如果需要空白换行，应该先使用`Ctrl + c`



#### scp

Linux命令行下可以通过`scp`命令传输文件，添加`-r`选项可以传输目录

从服务器下载文件

```bash
> [bysj ~]$ scp username@servername:/path/filename /tmp/local_destination
```

上传本地文件目录到服务器

```bash
> [bysj ~]$ scp -r /path/local_filename username@servername:/path 
```



#### $PS1

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



#### bc

 `bc`命令可以在命令行交互计算



#### words

Linux 下的`/usr/share/dict/words`中保存了几乎所有英语单词，例如密码校验的时候的单词校验就有用到



#### 不使用命令别名

可以在别名命令前多添加一个`\`来使用原本的命令执行



#### seq

`seq`跟一个数字可以输出 1 到 该数字。

```bash
> [bysj ~]$ seq 4
1
2
3
4
```



