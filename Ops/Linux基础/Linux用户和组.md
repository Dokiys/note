# Linux用户和组

为了方便权限的管理Linux提供了用户和组来分配权限，用户和组属于多对多的关系

其权限是通过进程来限制，即进程所能访问资源的权限取决于进程的运行者身份

Linux组分为主要组（primary group）和附加组（supplementary group）

* 用户必须属于且只有一个主要组，但可以属于多个附加组
* 用户创建的时候会默认创建一个同名的私有组

通过`id`命令可以查看指定用户的组信息：

```bash
[root@guest ~]# id root
uid=0(root) gid=0(root) groups=0(root)		# 如果加入多个组groups后面会通过','隔开
```



## 配置文件

Linux中一切皆文件，用户和组信息也不例外，主要配置信息如下：

```bash
/etc/passwd  :用户及其属性信息
/etc/group   :组及其属性信息
/etc/shadow  :用户密码相关属性
/etc/gshadow :组密码相关属性
```



### passwd

可以通过`man` 命令来查看各个文件的使用说明。需要注意的是，有些系统可能默认安装了`passwd`命令用于修改密码，这时用`man`命令查看帮助文档时需要指定查看的章节：

```bash
[root@guest ~]# man 5  passwd
```

> Each line of the file describes a single user, and contains seven colon-separated fields:
>
> ```bash
>           name:password:UID:GID:GECOS:directory:shell
> ```

```bash
[root@guest ~]# vim /etc/passwd
Updating index cache for path `/usr/share/man/man5'. Wait...mandb: warning: /usr/share/man/man5/aliases.5.gz is a dangling symlink
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
...
```



### shadow

在`/etc/shadow`中保存的所有密码相关的信息，可以通过`vim`查看所有用户密码信息：

 ```bash
[root@guest ~]# vim /etc/shadow
root:$6$wMeOwklmdYVLk7mbVNweopOJkvhhL3zRjl:18547:0:99999:7:::
bin:*:18353:0:99999:7:::
daemon:*:18353:0:99999:7:::
...
 ```

也可以使用内部命令`getent`查看指定用户密码信息

```bash
[root@guest ~]# getent shadow root
root:$6$wMeOwklmdYVLk7mbVNweopOJkvhhL3zRjl:18547:0:99999:7:::
```

 `chage`命令可以修改或者添加`-l`选项查看指定用户的密码信息：

```bash
[root@guest ~]# chage -l root
Last password change					: Oct 12, 2020
Password expires					: never
Password inactive					: never
Account expires						: never
Minimum number of days between password change		: 0
Maximum number of days between password change		: 99999
Number of days of warning before password expires	: 7
```



## 用户管理

### useradd

用户的查看可以直接通过`/etc` 目录下的相关文件进入查看，也可以通过`getent`命令指定查看某用户：

```bash
[root@guest ~]# vim /etc/passwd
[root@guest ~]# getent passwd root
```

Linux下root用户享有一切权限，所有一般不会用root用户直接登录操作

而是建立各种不同的用户并为其分配对应的权限或对应的组去操作

创建用户可以通过`useradd` 命令，`-h`参数可以查看帮助信息：

```bash
[root@guest ~]# useradd zhangsan
[root@guest ~]# vim /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
...
chrony:x:998:996::/var/lib/chrony:/sbin/nologin
zhangsan:x:1000:1000::/home/zhangsan:/bin/bash
[root@guest ~]# id zhangsan			# 查看uid gid 和组信息
uid=1000(zhangsan) gid=1000(zhangsan) groups=1000(zhangsan)
[root@guest ~]# ls /home
zhangsan
```

该命令默认会创建一个名为 zhangsan 的用户并为其创建添加到同名的主组，并在`/home`下创建用户目录

通过`/etc/shadow` 可以看到：

```bash
root:$6$wMeOwklmdYVLk7mf$DA2XkvhhL3zRjlYC03S:18547:0:99999:7:::
bin:*:18353:0:99999:7:::
...
chrony:!!:18529::::::
zhangsan:!!:18548:0:99999:7:::
```

新创建的`zhangsan`用户表示密码为'! !'符号，表示密码被禁用无法登录

可以看到新建用户的有效期为99999，这是Linux的默认设置，可以通过更改`/etc/login.defs`文件来修改默认值

`useradd`命令的默认设置可以通过`/etc/default/useradd`来查看：

```bash
[root@guest ~]# vim /etc/login.defs
[root@guest ~]# vim /etc/default/useradd
 useradd defaults file
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel				# 该文件的内容会在创建用户时被默认添加在家目录下
CREATE_MAIL_SPOOL=yes
```

如果想在创建用户时自定义 `UID`、 `GID`、密码、家目录等信息，可以通过`useradd`的`-h`选项来查看帮助

对于系统用户的创建可以使用`-r`选项，不需要家目录，通常也不需要为其指定shell类型来登录：

```bash
# 创建名称为lisi的系统用户，不允许登录，默认不会创建家目录
[root@guest ~]# useradd -r lisi -s /sbin/nologin
```



`adduser`命令也可以添加用户：

```bash
[root@guest ~]# adduser wangwu
[root@guest ~]# getent passwd wangwu
wangwu:x:1001:1001::/home/wangwu:/bin/bash
[root@guest ~]# type adduser
adduser is hashed (/usr/sbin/adduser)
[root@guest ~]# ll /usr/sbin/adduser
lrwxrwxrwx. 1 root root 7 Sep 24 20:57 /usr/sbin/adduser -> useradd
```

可以看到`adduser`通过一个软链接指向了`useradd`



### usermod

通过`usermod -h`命令可以查看修改用户命令的帮助信息：

```bash
[root@guest ~]# usermod -h
Usage: usermod [options] LOGIN

Options:
  -c, --comment COMMENT         new value of the GECOS field
  -d, --home HOME_DIR           new home directory for the user account
  -g, --gid GROUP               force use GROUP as new primary group
  -G, --groups GROUPS           new list of supplementary GROUPS
  -a, --append                  append the user to the supplemental GROUPS
                                mentioned by the -G option without removing
                                the user from other groups
  -h, --help                    display this help message and exit
  -l, --login NEW_LOGIN         new value of the login name
  -L, --lock                    lock the user account
  -m, --move-home               move contents of the home directory to the
                                new location (use only with -d)
  -o, --non-unique              allow using duplicate (non-unique) UID
  -p, --password PASSWORD       use encrypted password for the new password
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
  -s, --shell SHELL             new login shell for the user account
  -u, --uid UID                 new UID for the user account

```

`useradd`创建的新用户默认密码被'! !'禁用，可以通过`-p`选项进行修改：

```bash
[root@guest ~]# getent shadow lisi
lisi:!!:18548::::::
[root@guest ~]# usermod -p 123456 lisi
[root@guest ~]# getent shadow lisi
lisi:123456:18548::::::
```

单叹号表示对用户密码的锁定，可以通过`usermod` 命令加`-L`选项来将某用户的密码加锁：

```bash
[root@guest ~]# usermod -L root
[root@guest ~]# getent shadow root
root:!$6$wMeOwklmdYVLk7mf$DA2XkvhhL3zRjlYC03S:18547:0:99999:7:::
[root@guest ~]# usermod -U root					# 用于解锁用户密码
[root@guest ~]# getent shadow root
root:$6$wMeOwklmdYVLk7mf$DA2XkvhhL3zRjlYC03S:18547:0:99999:7:::
```

双叹号可以防止使用两次`usermod -U`命令来解锁密码后出现空密码的情况，但老版本Linux系统仍然可以被解锁

`添加-G` 选项设置附加组时，会将原来的组覆盖，可以通过`-aG`选项将用户添加到附加组：

```bash
[root@guest ~]# usermode -aG zhangsan group1 group2
```



### userdel

用于删除用户，但默认不会删除用户的家目录等文件，可以通过添加`-r`选项删除家目录和邮件：

```bash
[root@guest ~]# userdel lisi
[root@guest ~]# userdel -r lisi
```

需要注意的是，如果某用户正在登录是中，是无法被删除的



### user操作

`su`命令可以用于切换用户：

```bash
[root@guest /]# su wangwu
[wangwu@guest /]$ su root		# 普通用户切换时需要输入密码
Password:
[root@guest /]#
```

添加 ' - ' 可以使得切换用户时进入的是切换用户的家目录：

```bash
[root@guest /]# su - wangwu
Last login: Tue Oct 13 06:20:31 UTC 2020 on pts/2
[wangwu@guest ~]$
```

`passwd`命令可以用于用户命令的修改，`--help`可以查看其帮助：

```bash
[root@guest ~]# passwd --help
Usage: passwd [OPTION...] <accountName>
  -k, --keep-tokens       keep non-expired authentication tokens
  -d, --delete            delete the password for the named account (root only)
  -l, --lock              lock the password for the named account (root only)
  -u, --unlock            unlock the password for the named account (root only)
  -e, --expire            expire the password for the named account (root only)
  -f, --force             force operation
  -x, --maximum=DAYS      maximum password lifetime (root only)
  -n, --minimum=DAYS      minimum password lifetime (root only)
  -w, --warning=DAYS      number of days warning users receives before password expiration (root only)
  -i, --inactive=DAYS     number of days after password expiration when an account becomes disabled (root only)
  -S, --status            report password status on the named account (root only)
  --stdin                 read new tokens from stdin (root only)

Help options:
  -?, --help              Show this help message
  --usage                 Display brief usage message
```

修改密码信息可以使用`chage`命令：

```bash
[root@guest ~]# chage -h
Usage: chage [options] LOGIN

Options:
  -d, --lastday LAST_DAY        set date of last password change to LAST_DAY
  -E, --expiredate EXPIRE_DATE  set account expiration date to EXPIRE_DATE
  -h, --help                    display this help message and exit
  -I, --inactive INACTIVE       set password inactive after expiration
                                to INACTIVE
  -l, --list                    show account aging information
  -m, --mindays MIN_DAYS        set minimum number of days before password
                                change to MIN_DAYS
  -M, --maxdays MAX_DAYS        set maximum number of days before password
                                change to MAX_DAYS
  -R, --root CHROOT_DIR         directory to chroot into
  -W, --warndays WARN_DAYS      set expiration warning days to WARN_DAYS
```



## 组管理

### groupadd

组的创建方式跟用户的创建方式很类似，`-r`用于创建系统组，即GID < 1000 

也可以使用`-g`指定GID：

```bash
[root@guest ~]# groupadd g1 -g 2000
[root@guest ~]# getent group g1
g1:x:2000:
```

更多选项可以通过`-h`选项查看：

```bash
[root@guest ~]# groupadd -h
Usage: groupadd [options] GROUP

Options:
  -f, --force                   exit successfully if the group already exists,
                                and cancel -g if the GID is already used
  -g, --gid GID                 use GID for the new group
  -h, --help                    display this help message and exit
  -K, --key KEY=VALUE           override /etc/login.defs defaults
  -o, --non-unique              allow to create groups with duplicate
                                (non-unique) GID
  -p, --password PASSWORD       use this encrypted password for the new group
  -r, --system                  create a system account
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       directory prefix
```



### groupmod

用于组信息的修改：

```bash
[root@guest ~]# groupmod -h
Usage: groupmod [options] GROUP

Options:
  -g, --gid GID                 change the group ID to GID
  -h, --help                    display this help message and exit
  -n, --new-name NEW_GROUP      change the name to NEW_GROUP
  -o, --non-unique              allow to use a duplicate (non-unique) GID
  -p, --password PASSWORD       change the password to this (encrypted)
                                PASSWORD
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
```

例如修改刚刚新建的`g1`组名称，并修改GID：

```bash
[root@guest ~]# getent group g1
g1:x:2000:
[root@guest ~]# groupmod -g 20001 -n newgroup1 g1
[root@guest ~]# getent group
root:x:0:
bin:x:1:
...
zhangsan:x:1000:
lisi:x:994:
wangwu:x:1001:
newgroup1:x:20001:
```



### groupdel

用于删除组，需要注意的是主组是无法被删除的：

```bash
[root@guest ~]# groupdel wangwu
groupdel: cannot remove the primary group of user 'wangwu'
[root@guest ~]# groupdel newgroup1
```



### 组操作

`gpasswd`可以用于更改组的密码、添加用户、删除用户等操作：

```bash
[root@guest ~]# gpasswd g1										# 更改组密码
Changing the password for group g1
New Password:
Re-enter new password:
[root@guest ~]# gpasswd -a wangwu g1
Adding user wangwu to group g1
[root@guest ~]# gpasswd -d wangwu g1
Removing user wangwu from group g1
[root@guest ~]# gpasswd -A wangwu g1 					# 设置 wangwu 为 g1 组的管理员可以操作组
```

临时切换主组可以使用`newgrp`命令，如果当前用户不在此组中需要输入密码

更改查看组成员通常使用`groupmems`命令，由于只有`root`用户才可以管理组，所以在`root`用户使用`groupmems`命令时需要使用`-g`选项指定某个组：

```bash
[root@guest ~]# groupmems -a wangwu -g g2			# 添加用户到g2组
[root@guest ~]# groupmems -l -g g2						# 查看g2组成员
wangwu
```



## 权限

### 概述

网络、应用、文件都可以通过用户和组来设置访问权限，这里只讨论关于文件的权限

通过`ls -l`命令可以查看到文件的元数据，其中第一行就包含了权限信息：

```bash
[root@guest ~]# ls -l
total 128
-rw-r--r--. 1 root root 72411 Oct 12 01:34 shadowsocks-all.log
-rwxr-xr-x. 1 root root 46729 Oct 12 01:31 shadowsocks-all.sh
-rw-r--r--. 1 root root   619 Oct 12 01:34 shadowsocks_r_qr.png
```

从第一列我们可以看到共占有10个字符，第一个字符表示文件类型，后9个字符每三个分别表示对不同类型用户对权限划分，其分别代表：

* 文件所属用户
* 文件所属组用户
* 其他用户

其中`r(read)`代表可读权限，`w(write)`代表可写权限，`x(excute)`代表可执行权限

对于目录文件的权限比较特殊，其所有权限都是针对于目录下的文件：

* 比如与Windows相比，Linux下即使没有读权限也可以分配写权限，且删除文件也属于写权限的范畴，只不过是对当前目录文件的内容的修改。也就是说，如果对当前目录文件有写权限，便可以删除当前目录下的文件，与被删除文件的读写权限无关。
* 对于目录文件，其读权限代表可浏览文件列表，但无法查看目录下文件的元数据信息。
* 写权限可以运行在目录下创建，删除文件，但必须要有可执行权限
* 目录内的文件访问（包括元数据信息），修改等操作需要可执行权限



以`shadowsocks-all.sh`文件为例，我们可以从元数据中看到，文件所有者为`root`，所属组为`root`。其权限分别为：

* 文件所属用户：rwx
* 文件所属组用户：r-x
* 其他用户：r-x

**注：**权限的顺序是根据以上顺序来判断的，即先判断所有者，再判断所属组，最后判断其他用户，如果一个文件的组权限不可读，但是在其他用户的权限中可读，那么当改组用户访问该文件时是无法获取的

通过查看`/etc/shadow`的元数据我们发现，该文件并没有任何权限：

```bash
[root@guest data]# ll /etc/shadow
----------. 1 root root 697 Oct 13 06:18 /etc/shadow
```

这可以解释为什么普通用户不可以访问该文件，但奇怪的是`root`却依然可以访问该文件。这是因为Linux中`root`用户拥有所有权限，我们所说的权限设置是针对于普通用户的。但是出于安全考虑，对于执行权限，即使是`root`用户，如果没有权限也无法执行。



### chmod

新建一个`f1`文件以后我们可以通过`ll`命令看到，其默认权限：

```bash
[root@guest /]# touch /data/test
[root@guest data]# ll
total 0
-rw-r--r--. 1 root root 0 Oct 13 07:44 test
```

当切换到其他用户时是没有写权限的，也就时说无法修改文件内容；

```bash
[wangwu@guest /]$ vim /data/test
# "/data/test" E212: Can't open file for writing
```



通过`chmod`命令可以修改用户权限，其语法如下：

```bash
chmod [WHO] [OPTION] [PERM] [FILE]
WHO：u g o a
OPTION: + - =
PERM: r(4) w(2) x(1) X #X表示对文件添加执行权限，而文件不添加执行权限
FILE: 文件名
```

现在需要给`wangwu`用户添加一个`test`文件的写权限：

```bash
[root@guest data]# chmod o+w test
[root@guest data]# ll
-rw-r--rw-. 1 root root 0 Oct 13 07:44 test
```

这时`wangwu` 用户即可以修改`test`文件了

`chown` 命令可以修改文件的所有者(以及所有组)：

```bash
[root@guest data]# ll
-rw-r--rw-. 1 root root 0 Oct 13 07:44 test
[root@guest data]# chown wangwu test
[root@guest data]# ll
-rw-r--rw-. 1 wangwu root 0 Oct 13 07:44 test
[root@guest data]# chown wangwu.bin test
[root@guest data]# ll
-rw-r--rw-. 1 wangwu bin 0 Oct 13 07:44 test
```

如果只修改所以组可以使用`chgrp`命令：

```bash
[root@guest data]# ll
-rw-r--rw-. 1 root root 0 Oct 13 07:44 test
[root@guest data]# chgrp bin test
[root@guest data]# ll
-rw-r--rw-. 1 root bin 0 Oct 13 07:44 test
```

**注：**`chown`和`chgrp`命令都可以添加`-R`选项来将目录下的所有文件修改所有者

现在我们将文件的所有者改成`wangwu`以后会发现，该用户不能访问该文件：

  ```bash
[root@guest data]# ll
----r--rw-. 1 wangwu root 0 Oct 13 07:44 test
[wangwu@guest data]$ vim test
# "test" [Permission Denied]
  ```

但由于`wangwu`用户是文件所有者，所以该用户可以自己修改文件权限后访问

权限的修改也可以直接用三个数字分别表示三种用户，每个数字用权限所对应数字相加即可：

 ```bash
[wangwu@guest data]$ chmod 755 test		# 7 = 4 + 2 + 1 即表示所有权限 5 同理
[wangwu@guest data]$ ll				
total 4
-rwxr-xr-x. 1 wangwu root 21 Oct 13 08:08 test
 ```

`chmod`命令还可以在给某文件添加权限时使用`--reference`来参考某文件的权限：

```bash
[root@guest data]# ll
drwxr--r-x. 2 root   root 4096 Oct 13 08:49 dir1
[root@guest data]# touch test2
[root@guest data]# chmod --reference dir1 test2
[root@guest data]# ll
drwxr--r-x. 2 root   root 4096 Oct 13 08:49 dir1
-rwxr--r-x. 1 root   root    0 Oct 13 09:05 test2
```



### 默认权限

新建文件或者目录的时候都会有默认的访问权限，可以通过`umask`命令来设置默认的访问权限。

`umask`的设置规则与网络中的子网掩码类似，即`umask`设置的权限位对应的默认权限会被抹去。

默认情况下`root`的`umask`为0022，普通用户为0002（第一位为特殊权限）：

```bash
[root@guest ~]# umask
0022
[wangwu@guest root]$ umask
0002
```

出于安全考虑文件的可执行权限默认为限制，所以新建的文件权限会将可读和可写权限与`umask`做匹配，例如`root`用户下默认：

```bash
666	=> 110 110 110 
022 => 000 010 010
------------------
644 => 110 100 100
```

而对于文件目录则是以全部权限与`umask`做匹配，比如普通用户下：

```bash
777 => 111 111 111
002 => 000 000 010
------------------
775 => 111 111 101
```

修改`umask`值即使得文件或文件目录在创建时默认设置权限

`umask`值的修改可以在运行直接键入`umask [权限]`设置：

```bash
[root@guest ~]# umask 002
[root@guest ~]# umask
0002
```

此时的修改仅存于内存中，想保存到全局设置或用户设置，可以分别写入文件`/etc/bashrc`和`~/.bashrc/`

`umask`还提供了`-S` 选项来避免计算，直接设置权限：

```bash
root@guest ~]# umask u=rw g=r o=
[root@guest ~]# umask
0122
[root@guest ~]# touch f2
[root@guest ~]# ll
-rw-r--r--. 1 root root     0 Oct 14 03:04 f2
```



### 特殊权限

通过查看`/etc/shadow`元数据可以看到，其访问权限为空：

```bash
[root@guest ~]# ll /etc/shadow
----------. 1 root root 697 Oct 13 06:18 /etc/shadow
```

那么问题来了，用户仍然可以通过`passwd`命令修改自己的密码，`/etc/shadow`中的文件依然会被修改？

通过查看`passwd`我们可以看到：

 ```bash
[root@guest ~]# stat `which passwd`
stat `which passwd`
  File: ‘/usr/bin/passwd’
  Size: 27856     	Blocks: 56         IO Block: 4096   regular file
Device: fd01h/64769d	Inode: 12213       Links: 1
Access: (4755/-rwsr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)
Context: system_u:object_r:passwd_exec_t:s0
Access: 2020-10-13 06:23:01.094108340 +0000
Modify: 2020-04-01 03:57:19.000000000 +0000
Change: 2020-09-24 20:57:39.582579650 +0000
 Birth: -
 ```

其中访问权限为`4755/-rwsr-xr-x`，特殊权限位为4，通过`man passwd`以及`man chmod`可以查找到，特殊权限位对应的字段：

```bash 
Octal Mode Bit Octal Mode Bit Octal Mode Bit Octal Mode Bit
4000  S_ISUID  0400  S_IRUSR  0040  S_IRGRP  0004  S_IROTH
2000  S_ISGID  0200  S_IWUSR  0020  S_IWGRP  0002  S_IWOTH
1000  S_ISVTX  0100  S_IXUSR  0010  S_IXGRP  0001  S_IXOTH
```

> This  volume  of  IEEE Std 1003.1-2001  allows the chmod utility to choose to modify these bits before calling chmod() (or some function providing equivalent capabilities) for non-regular files. Among other things, this allows implementations that use the set-user-ID and set-group-ID bits on directories to  enable  extended features to handle these extensions in an intelligent manner.

`SUID`和`SGID`即`set-user-ID-on-execution` 和 `set-group-ID-on-execution`表示在运行的时候将允许一些特殊的文件在运行权限检查或其他类似方法之前修改文件的访问方式，这里的`/usr/bin/passwd`即可以在运行某文件前修改文件的`UID`，这样即使是普通用户在调用`/usr/bin/passwd`时也可以将`/etc/shadow`修改

`SGID`有一个常见的应用场景，即设置在目录上，使得该组用户在此目录下新建的文件都属于该组：

```bash
[root@guest ~]# useradd user1
[root@guest ~]# useradd user2
[root@guest ~]# groupadd webgroup
[root@guest ~]# groupmems -a user1 -g webgroup
[root@guest ~]# groupmems -a user2 -g webgroup

[root@guest ~]# mkdir /data/web
[root@guest ~]# chgrp webgroup /data/web
[root@guest ~]# chmod 2774 /data/web
[root@guest ~]# ll /data
drwxrwsr--. 2 root webgroup 4096 Oct 14 07:04 web

[user1@guest data]$ touch ./web/file
[user1@guest data]$ ll web
-rw-rw-r--. 1 user1 webgroup 0 Oct 14 07:04 file
```

还有一个特殊的权限`SVTX`，表示仅文件所有者可以执行文件：

```bash
[root@guest ~]# chmod 1777 /data
[wangwu@guest data]$ ll
drwxr-xr-x. 2 root   root 4096 Oct 14 06:21 t
-rw-r-xr-x. 1 wangwu root   21 Oct 13 08:08 test
[wangwu@guest data]$ rm -rf t
rm: cannot remove ‘t’: Operation not permitted
[wangwu@guest data]$ rm -rf test
[wangwu@guest data]$ ll
drwxr-xr-x. 2 root root 4096 Oct 14 06:21 t
```

由于`root`用户的权限过大，可能出现一些对文件的误操作，可以使用`chattr`命令来设置`root`用户对文件的访问权限，常用参数有`'-a'`仅运行追加文件，`'-i'`不允许任何操作：

```bash
[root@guest data]# chattr +i t
[root@guest data]# rm -rf t
rm: cannot remove ‘t’: Operation not permitted
[root@guest data]# chattr -i t
[root@guest data]# rm -rf t
```



## ACL

以上的权限设置策略并不灵活，比如需要对某个用户单独设置某个文件的权限，通过用户和组的方式就很难实现。于是有了ACL(Access Control List)访问控制列表，来对文件设置额外的访问权限。其命令为`setfacl`，可以通过`-h` 选项来查看帮助

对`wangwu`用户单独设置对`/data/dir1`文件夹下的访问权限：

```bash
[root@guest data]# setfacl -m u:wangwu:- /data/dir1
[root@guest data]# su wangwu
[wangwu@guest data]$ ll dir1
ls: cannot open directory dir1: Permission denied
```

也可以对组进行设置`setfacl -m g:webgroup:5 /data/dir1`

对某个文件的访问权限可以通过`getfacl`来查看：

```bash
[wangwu@guest data]$ getfacl dir1
# file: dir1
# owner: root
# group: root
user::rwx
user:wangwu:---
group::r--
mask::r--
other::r-x
```

`ACL`的生效顺序就如同输出结果：所有者>自定义组>自定义组>其他人

当一个用户属于多个组时，`ACL`中的配置策略将会叠加，即如果`user` 用户数据可读组和一个可写组，那么该用户对此文件同时拥有读写权限

对`ACL`策略删除可以使用`'x'`选项或者`'-b'`清空所以权限：

```bash
[root@guest data]# setfacl -x u:wangwu dir1
[root@guest data]# setfacl -b dir1
```

`ACL`还可以解决递归设置权限的问题， 可以使用`-R`选项对某用户和某目录下的所有文件设置权限：

```bash
[root@guest data]# setfacl -R -m u:wangwu:6 web
[root@guest data]# setfacl -R -x u:wangwu web
```

还可以通过 `-d`选项设置目录下新建文件的默认`ACL`策略

```bash
[root@guest data]# setfacl -R -m d:u:wangwu:7 web
```

`setback`还可以设置`mask`值来设置指定用户和组的最高权限，但是其他用户和文件所有者不受影响：

 ```bash
[root@guest data]# setfacl -R -m mask::r web
[root@guest data]# getfacl web
# file: web
# owner: root
# group: webgroup
# flags: -s-
user::rwx
group::rwx			#effective:r--
mask::r--
other::rwx
default:user::rwx
default:user:wangwu:rwx
default:group::rwx
default:mask::rwx
default:other::r--
 ```

`cp`和`mv`等命令都支持`ACL`，只需要加上参数`-p`即可，但是像`tar`之类的备份工具不会保留目录和文件的`ACL`信息。我们可以将其中的`ACL`信息导出到某个文件，然后在重新设置：

```bash

```

**注：**不是所有文件系统都支持`ACL`，CentOS7 中的 xfs 和 ext4 是支持的。