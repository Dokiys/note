# 日常笔记

## 终端命令

### 查找

#### 端口占用

```bash
$ lsof -i:[端口]
$ ps -ef | grep [查找的字符串]

[root@guest ~]# ls -a			# 查看所以文件（.开头的文件为隐藏文件 ls 命令不会显示）

[root@guest ~] man ascii  # 查看 ascii 编码表
```

#### 历史命令

~~~
history | grep [查找内容]
~~~

#### 路径

```bash
[root@guest kernel]# pwd 						# =>  查看当前路径
/lib/kernel
[root@guest ~]# which nano					# => 查看外部命令路径
/usr/bin/nano
[root@guest ~]# whereis nano				# => 查看外部命令路径，同时列出相关配置文件
nano: /usr/bin/nano /usr/share/nano	
```

#### 文件路径

```
find <查找路径> -name <查找文件名>
```

#### redis-cli

```bash
# 查找运行的redis
➜  [/etc] ps aux | grep redis
root 67 0.0 0.0 4310532 532 ?? Ss 4Aug20 6:03.16 /usr/local/bin/redis-server 127.0.0.1:6379
atyun 0891 0.0 0.0 4278524 704 s005  S+ 3:06PM 0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox redis
➜  [/etc] cd /usr/local/bin
➜  [/usr/local/bin] git:(master) ✗ ls
aclocal                             gecho                               hostid                              pgbench
aclocal-1.15                        genv                                hyperkit                            pinky
acyclic                             gettext                             idn2                                pkg-config
annotate                            gettext.sh                          ifnames                             pltcl_delmod
apm                                 gettextize                          img2webp                            pltcl_listmod
autoconf                            gexpand                             initdb                              pltcl_loadmod	 。。省略
➜  [/usr/local/bin] git:(master) ✗
➜  [/usr/local/bin] git:(master) ✗
➜  [/usr/local/bin] git:(master) ✗ ll | grep redis
lrwxr-xr-x  1 postgres  admin    41B Aug 14  2017 redis-benchmark -> ../Cellar/redis/4.0.1/bin/redis-benchmark
lrwxr-xr-x  1 postgres  admin    41B Aug 14  2017 redis-check-aof -> ../Cellar/redis/4.0.1/bin/redis-check-aof
lrwxr-xr-x  1 postgres  admin    42B Dec 17  2015 redis-check-dump -> ../Cellar/redis/3.0.5/bin/redis-check-dump
lrwxr-xr-x  1 postgres  admin    41B Aug 14  2017 redis-check-rdb -> ../Cellar/redis/4.0.1/bin/redis-check-rdb
lrwxr-xr-x  1 postgres  admin    35B Aug 14  2017 redis-cli -> ../Cellar/redis/4.0.1/bin/redis-cli
lrwxr-xr-x  1 postgres  admin    40B Aug 14  2017 redis-sentinel -> ../Cellar/redis/4.0.1/bin/redis-sentinel
lrwxr-xr-x  1 postgres  admin    38B Aug 14  2017 redis-server -> ../Cellar/redis/4.0.1/bin/redis-server
➜  [/usr/local/bin] git:(master) ✗
➜  [/usr/local/bin] git:(master) ✗
➜  [/usr/local/bin] git:(master) ✗ cd ../Cellar/redis/4.0.1/bin
➜  [/usr/local/Cellar/redis/4.0.1/bin] git:(master) ✗ redis-cli
```



### 操作

#### 文件：

```bash
➜  [/Users/atyun] cp ai.json /Users/atyun/works/ai.json 		# 复制文件到指定路径
➜  [/Users/atyun] mv ai.json /Users/atyun/works/ai.json 		# 移动文件到指定路径

[root@guest ~]# source .tcshrc 			# 使.tcshrc文件立即生效
[root@guest ~]# . .tcshrc  					# 可以用'.'代替‘source'
```



# 快捷键

## RubyMine

* 代码整理：Command + Option + L
* 返回上一光标：Command + Option + <-
* 折叠所有块：Command + CapsLock + ‘-’
* 折叠当前快：Command + '-' / '+'
* 打开所有块：Command + CapsLock + ’+‘
* 添加自定义代码块折叠：Command + Option + T  ->  <editor-fold...>

## MAC

* 反撤销： Command + Shift + Z
* Chrome检查：Command + Shift + C

## iterm2

* 新建窗口： Command + T
* 水平分屏： Command + D
* 垂直分屏： Command + Shift + D
* 在最近使用的分屏直接切换.：Command + '['
* 切换标签页： Command +  <-
* 清屏：Ctrl + L
* 复制字符串：双击添加到粘贴板 or 选中 + Command + 鼠标拖动到指定位置



## VsCode

* 全局搜索帮助：Command + Shift + P
* 全局搜索文件：Command + P