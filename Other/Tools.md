# 命令行常用工具

## scp

Linux命令行下可以通过`scp`命令传输文件，添加`-r`选项可以传输目录

从服务器下载文件

```bash
> [bysj ~]$ scp username@servername:/path/filename /tmp/local_destination
```

上传本地文件目录到服务器

```bash
> [bysj ~]$ scp -r /path/local_filename username@servername:/path 
```



## envsubst

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



## zip

用于压缩制定的文件， `-r`选项可以递归压缩目录下的文件：

```bash
zip -r myfile.zip 1.txt 2.txt Dir
```

`-m`和`-d`分别用于向某压缩文件添加/删除某文件

```bash
zip -m myfile.zip 3.txt
zip -m myfile.zip 2.txt
```

`unzip`可以将压缩文件解压缩，`-d`用于制定解压路径：

```bash
unzip -d ./doc myfile.zip
```



## tar

```bash
tar -czvf [文件名].tar.gz	1.txt 2.txt	#压缩
tar -xzvf [文件名].tar.gz							#解压缩
```

**-c** ：create、**-x** ：打开归档文件、**-z** ：压缩、**-v** ：view
**-f** ：归档文件名，应用在最后一个参数，后直接跟归档文件名，再跟需要归档的文件
如果打包的没有采用**-z**压缩，则还可以添加 **-r** 选项来追加文件：

```bash
tar -rvf [文件名].tar [被追加的文件名]
```



## pbcopy

`pbcopy`可以将输出重定向到剪切板：

```bash
cat 1.txt | pbcopy
```

对应还有`pbpaste`从剪切板输出：

```bash
# 粘贴重定向到文件流
pbpaste>1.txt
# 追加到文件末尾
pbpaste>>1.txt
```



# 使用实例

## 处理多行文本：

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

`awk`还可以对列处理

```bash
$ cat text
2 this is a test
3 Are you like awk
This's a test
10 There are orange,apple,mongo

$ awk '$1>2 && $2=="Are" {print $1,$2,$3}' log.txt
3 Are you
```



## 合并csv

```shell
# 先删除所有文件第一行
for filename in `ls`
  do
  sed -i '' 1d `echo $filename`	# 删除第一行
  done
# 将所有文件拼接到指定文件
for filename in `ls`
  do
  cat `echo $filename` >> ../f.csv	# 拼接文件
  done
```

**注！：**千万不要将`f.csv`放在操作文件夹的同一级目录下，不然会出现往`f.csv`添加数据的死循环，导致内存和磁盘爆表