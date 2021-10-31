# Git使用

Git 仓库中的提交记录保存的是你的目录下所有文件的快照，就像是把整个目录复制，然后再粘贴一样，但比复制粘贴优雅许多！

Git 希望提交记录尽可能地轻量，因此在你每次进行提交时，它并不会盲目地复制整个目录。条件允许的情况下，它会将当前版本与仓库中的上一个版本进行对比，并把所有的差异打包到一起作为一个提交记录。

Git 保存了提交的历史记录。



## Git分支

### git commit

通过`git commit`命令可以将修改保存成了一个新的提交记录 `C2`。`C2` 的父节点是 `C1`，父节点是当前提交中变更的基础。

```bash
git commit <filename> -m"提交说明"
```

Git 还可以修改最后一次提交的描述信息，当然，如果`push`之后是没法修改的：

 ```bash
git commit --amend
 ```



### git branch

Git 的分支也非常轻量。它们只是简单地指向某个提交纪录。即使创建再多分的支也不会造成储存或内存上的开销，并且按逻辑分解工作到不同的分支要比维护那些特别臃肿的分支简单多了。

创建分支：

```bash
git branch [分支名]
```

切换分支：

```bash
git checkout [分支名]
```

切换同时创建分支：

```bash
git checkout -b [分支名]
```

重命名：

```bash
git branch -m [分支名old] [分支名new]
```

查看分支来源：

```bash
git reflog show [分支名]
```

删除分支：

```bash
git branch -d [分支名]
```

删除远程分支：

```bash
git push origin --delete [分支名]
```

强制修改分支位置

```bash
git branch -f [分支名] [提交号]
# 例如：`git branch -f master HEAD~3`,将master分支强制指向当前分支的第前三个提交
```



### git merge

**没事别瞎merge！！确定需要之后再merge！！**

将指定分支合并到当前分支之后。

```bash
git merge [分支名]
```

`merge`命令只会将选择的分支合并到当前分支，当前分支中的修改不会保存到`merge`到分支中。

以下命令会将分支2合并到分支1之后：

```bash
git merge [分支1] [分支2]
```

`merge`产生冲突时放弃`merge`

```bash
git merge --abort
```



### git rebase

`rebase`会将当前分支移动到指定的分支之后，并将该分支最新提交作为指定分支的一次修改，而不是对其进行合并，`rebase`很容易出现冲突！！。

```bash
git rebase [分支名]
```

如果当前分支和制定的`rebase`分支来自同一继承，那么会将当前分支的引用直接指向制定分支。

在整理提交时，如果你不清楚你想要的提交记录的哈希值，以利用交互式的 rebase。



交互式 rebase 指的是使用带参数 `--interactive` 的 rebase 命令, 简写为 `-i`

增加了这个选项后, Git 会打开一个 UI 界面并列出将要被复制到目标分支的备选提交记录，它还会显示每个提交记录的哈希值和提交说明，提交说明有助于你理解这个提交进行了哪些更改。

```bash
git rebase -i HEAD~4
```



### 相对引用

HEAD 是一个对当前检出记录的符号引用 —— 也就是指向你正在其基础上进行工作的提交记录。

HEAD 总是指向当前分支上最近一次提交记录。

HEAD 通常情况下是指向分支名的

分离的 HEAD 就是让其指向了某个具体的提交记录而不是分支名。

可以利用`checkout`命令并指定提交记录的hash码让HEAD指向具体的提交

```bash
git checkout [提交记录hash码]
```



git的hash值基于 SHA-1，共 40 位。例如： `fed2da64c0efc5293610bdd892f82a58e8cbc5d8`

哈希值指定提交记录很不方便，所以 Git 引入了相对引用。可以从一个分支使用鲜菇蒂引用切换到具体的提交记录

- 使用 `^` 向上移动 1 个提交记录
- 使用 `~<num>` 向上移动多个提交记录，如 `~3`

```bash
git checkout [分支名]^

git checkout [分支名]~3
```



### 提交撤销

主要有两种方法用来撤销变更 —— `git reset` & `git revert`。

`git reset` 通过把分支记录回退几个提交记录来实现撤销改动。你可以将这想象成“改写历史”。`git reset` 向上移动分支，原来指向的提交记录就跟从来没有提交过一样。

```bash
git reset [提交号]
# 例如：git reset HEAD^1
git reset --hard origin/[分支名]		# => 可以将放弃本地分支为push的提交，强制拉取远程分支
```

`git revert` 会将指定的提交记录的**上一个提交记录**作为一个新的提交

```bash
git revert [提交号]
# 例如`git revert HEAD
```

放弃本地未提及commit，强制拉取远程仓库分支

```bash
git fetch --all
git reset origin/master
# reset --mixed：默认参数，保留工作目录，并重置暂存区
# reset --hard：不保留暂存区和工作区
# reset --soft：保留工作区，并把重置 HEAD 所带来的差异放到暂存区
```



### cherry-pick

实现“我想要把这个提交放到这里, 那个提交放到刚才那个提交的后面”

```bash
git cherry-pick <提交号>...
# 例如：git cherry-pick C1 C4
```

相较于`rebase`，`git cherry-pick`可以指定提交的记录，

例如将需要使用的代码提交到了存在不确定使用的代码分支中

```bash
git log # 查看需要的提交的 commit id
git checkout [需要使用该代码的分支]
git cherry-pick [commit id] # 提交该 commit 到当前分支
```



### 分支归档

`tag`可以用于永远指向某个提交记录的标识呢，比如软件发布新的大版本，或者是修正一些重要的 Bug 或是增加了某些新特性。

```bash
git tag [标签名] [提交号]
# 例如：`git tag V1 C1`
```

`tag`查看：

```bash
git tag	# => 查看当前仓库所有tag
git tag -l ‘v0.1.*’ # => 查看匹配的tag
```

`tag`命令还可以用来归档文件，通过`-m`选项可以添加标签注释，`-n`选项来查看注释信息

```bash
git tag [标签名] [提交号] -m '注释信息'
git tag -n
```

`-d`选项用于删除`tag`

 ```bash
git tag -d [标签名]
 ```





### Git Describe

`git describe`用来描述离你最近的锚点（也就是标签tag）

```bash
git describe <ref>
```

`<ref>` 可以是任何能被 Git 识别成提交记录的引用，如果你没有指定的话，Git 会以你目前所检出的位置（`HEAD`）。

它输出的结果是这样的：

>  <tag>\_<numCommits>\_g<hash>

`tag` 表示的是离 `ref` 最近的标签， `numCommits` 是表示这个 `ref` 与 `tag` 相差有多少个提交记录， `hash` 表示的是你所给定的 `ref` 所表示的提交记录哈希值的前几位。

当 `ref` 提交记录上有某个标签时，则只输出标签名称

如果想给分支添加描述信息可以使用：

```bash
git config branch.[分支名].description '分支描述信息'
git config branch.[分支名].description  						# 查看分支描述信息
```



## Git文件

### 文件撤销

1. 未使用 git add 缓存代码时

   ```bash
   git checkout -- [filepathname]
   git checkout head . //撤销所有文件
   ```

2. 已经使用了 git add 缓存了代码

   ```bash
   git reset HEAD filepathname //放弃文件的缓存
   git reset HEAD //放弃所有缓存
   ```

3. 已经用 git commit 提交了代码，需要全部撤回

   ```bash
   git reset --hard HEAD^
   ```

4. 对单个已提交文件撤回

   ```bash
   $ git log <fileName>
   $ git checkout <commit-id> <fileName>
   $ git commit
   ```

   如果不行修改提交记录并撤回某文件可以：

   ```bash
   $ git log <fileName>
   $ git reset <commit-id> <fileName>
   ```

   再撤销对此文件的修改

   ```bash
   $ git checkout <fileName>
   ```

   最后amend一下

   ```bash
   //对上一次的提交进行修改，可以使用该命令。也可以修改提交说明。
   $ git commit --amend 
   ```

5. [撤销提交记录](#提交撤销)



### 进度暂存

`git stash`可以将对当前分支的缓存区和工作区的修改保存到`list`，此时`git status`查看当前工作区是干净的。

 ```bash
git stash 
git stash save 'test'	# 对保存内容添加注释信息
 ```

`git stash`默认会将所有的文件变动暂存起来。如果只想要部分文件可以使用：

```bash
git stash push <file1> <file2>
```

`git stash list`可以查看保存的所有进度

```bash
git stash list
stash@{0}: On dit: test
```

需要恢复时可以通过`pop`或`apply`恢复修改内容。

```bash
git stash pop							# 会在list中删除 stash
git stash pop stash@{0}		# 序号0是通过list查看得到的
git stash apply						# 不会删除list中的 stash
git stash apply stash@{0}	# 序号0是通过list查看得到的
```

进度删除可以使用`drop`或者`clear`

```bash
git stash drop stash@{0} # 删除序号为0的 stash
git stash clear # 清除list中所有 stash
```



### diff 比较文件

```bash
git diff <版本号码1(old)> <版本号码2(new)>
git diff 	# 比较所有文件
git diff <文件路径> #比较指定文件
git diff <版本号码1(old)> <版本号码2(new)> <文件路径> # 比较指定文件指定版本的不同
git diff <版本号码1(old)> <版本号码2(new)> --stat # 比较指定版本有哪些文件修改
git diff --cached # 比较暂存区的代码和当前分支head的代码
git diff . ":(exclude)<文件/正则>" # 比较时排除指定文件
git diff <版本号码1(old)> <版本号码2(new)> --stat  ":(exclude)<文件/正则>"	# 比较版本排除制定文件修改
```

比较本地 `ahead` 远程的提交

```ruby
git cherry -v	# 查看当前分支ahead对应远程分支的提交及描述
git log <分支名> ^origin/<分支名> 	# 查看指定分支 ahead 指定的远程的提交详情
```



### Untracked文件

```bash
git clean -f		# 清除untracked文件
git clean -fd		# 清除untracked文件以及目录
```



## Git远程

远程仓库只是你的仓库在另个一台计算机上的拷贝。你可以通过因特网与这台计算机通信 —— 也就是增加或是获取提交记录。

- 远程仓库是一个强大的备份。本地仓库也有恢复文件到指定版本的能力, 但所有的信息都是保存在本地的。有了远程仓库以后，即使丢失了本地所有数据, 你仍可以通过远程仓库拿回你丢失的数据。
- 远程让代码社交化了! 既然你的项目被托管到别的地方了, 你的朋友可以更容易地为你的项目做贡献(或者拉取最新的变更)

Git 远程仓库相当的操作实际可以归纳为两点：

* 向远程仓库传输数据

* 从远程仓库获取数据。

  

### git clone

`git clone` 命令在真实的环境下的作用是在**本地**创建一个远程仓库的拷贝（比如从 github.com）

```bash
git clone [ssh地址]
```

如果忘记了当前项目对应远程仓库可以通过以下命令查看：

```bash
git remote -v
```

以及存在的本地仓库想要与远程管理可以使用：

```bash
git remote add origin [Git远程仓库url]
```



### 远程分支

远程分支反映了远程仓库(在你上次和它通信时)的**状态**。这会有助于你理解本地的工作与公共工作的差别。

在你检出时自动进入分离 HEAD 状态。Git 这么做是出于不能直接在这些分支上进行操作的原因, 你必须在别的地方完成你的工作, （更新了远程分支之后）再用远程分享你的工作成果。



### git fetch

从远程仓库获取数据, 使远程分支更新以反映最新的远程仓库。

`git fetch` 完成了仅有的但是很重要的两步:

- 从远程仓库下载本地仓库中缺失的提交记录
- 更新远程分支指针(如 `o/master`)

`git fetch` 实际上将本地仓库中的远程分支更新成了远程仓库相应分支最新的状态。

`git fetch` 通常通过互联网（使用 `http://` 或 `git://` 协议) 与远程仓库通信。

`git fetch` 并不会改变你本地仓库的状态。它不会更新你的 `master` 分支，也不会修改你磁盘上的文件。

`git fetch` 的参数和 `git push` 极其相似。他们的概念是相同的，只是方向相反罢了（因为现在你是下载，而非上传）

```bash
git fetch origin <source>:<destination>
# 例如：
git fetch origin foo^:master
# 会将远程仓库中的foo分支的上一个提交，fetch到本地的master
# 如果destination不存在的话，会在本地新建一个分支保存提交记录
```

如果不指定 <source>的话即将本地的分支删除

```bash
git fetch origin :bar			#即从远程仓库fetch空到分支bar，即删除bar分支。
```



### git pull

当远程分支中有新的提交时，你可以像合并本地分支那样来合并远程分支。也就是说就是你可以执行以下命令:

- `git cherry-pick o/master`
- `git rebase o/master`
- `git merge o/master`

Git 提供了一个专门的命令 `git pull`来完成这两个操作。

`git pull` 就是  `git fetch` 和 `git merge` 的缩写

所以以下命令是等价的：

```
git pull origin foo 相当于：
git fetch origin foo; git merge o/foo
```

```bash
git pull origin bar~1:bugFix 			# 从远程的bar分支的上一个提交 pull到本地的bugFix分支
# 相当于：
git fetch origin bar~1:bugFix; git merge bugFix
```

`git pull`还可以和`rebase`一起使用，即

```bash
git pull --rebase 
```

该命令会从远程仓库获取到最新的提交并将当前分支合并到该提交上。



### git push

负责将变更上传到指定的远程仓库，并在远程仓库上合并你的新提交记录。

`push`之前必须要保证当前分支获取了最新的`original/master`

否则需要先通过`pull`命令获取到最新的远程提交，然后在`push`

同时可以为 push 指定参数，语法是：

```bash
git push <remote> <place>
例如：
git push origin master
//切到本地仓库中的“master”分支，获取所有的提交，再到远程仓库“origin”中找到“master”分支，将远程仓库中没有的提交记录都添加上去
```

同时为源和目的地指定 `<place>` 的话，只需要用冒号 `:` 将二者连起来就可以了：

```bash
git push origin <source>:<destination>
例如：
git push origin foo^:master
//会将foo分支的上一个提交push到远程仓库的master分支
//如果destination不存在的话，会在远程仓库新建一个分支保存提交记录
```

在远程创建一个与当前分支同名的分支并将当前分支的修改提交可以使用`gpsup`命令：

```bash
➜  [/Users/atyun/works/boko] git:(feature/zhangzongqi-pm33816-20200828) gpsup
➜  [/Users/atyun/works/boko] git:(feature/zhangzongqi-pm33816-20200828) alias gpsup
gpsup='git push --set-upstream origin $(git_current_branch)'

➜  [/Users/atyun/works/boko] git:(feature/zhangzongqi-pm33q816-20200828) git branch -vv
  feature/zhangzognqi-debug-20200824   797e3dd Merge branch 'hotfix/wanglu-20200817-fix' into 'dit'
* feature/zhangzongqi-pm33816-20200828 db1f4fc [origin/feature/zhangzongqi-pm33816-20200828] 添加学生端状态
```

执行后当前分支会跟踪远程的新建的同名分支。



**注：**这个参数实际的值是个 refspec，“refspec” 是一个自造的词，意思是 Git 能识别的位置（比如分支 `foo` 或者 `HEAD~1`）

如果不指定`<source>的话会将远程仓库的分支删除

```bash
git push origin :foo
//提交空到远程分支foo，即删除远程仓库的foo分支
```

删除远程分支还可以使用：

```bash
git push origin --delete <分支名>
```





### 远程跟踪

`master` 和 `o/master` 的关联关系就是由分支的“remote tracking”属性决定的。`master` 被设定为跟踪 `o/master`

当你克隆时, Git 会为远程仓库中的每个分支在本地仓库中创建一个远程分支（比如 `o/master`）。然后再创建一个跟踪远程仓库中活动分支的本地分支，默认情况下这个本地分支会被命名为 `master`。

可以让任意分支跟踪 `o/master`, 然后该分支会像 `master` 分支一样得到隐含的 push 目的地以及 merge 的目标。

例如：以下命令就可以创建一个名为 `totallyNotMaster` 的分支，它跟踪远程分支 `o/master`。

```bash
git checkout -b totallyNotMaster o/master
git checkout -b totallyNotMaster -t o/master
```

如果遇到报错

```bash
git checkout -b test -t origin/master
fatal: Cannot update paths and switch to branch 'test' at the same time.
Did you intend to checkout 'origin/master' which can not be resolved as commit?
```

可以用`remote`命令查看远程是否可以fetch并用`set-url`选项来修改远程仓库

```bash
git remote -v
git remote set-url origin [remote repository]
```

另一种设置远程追踪分支的方法就是使用：`git branch -u` 命令，

```bash
git branch -u o/master foo
//如果当前就在 foo 分支上, 还可以省略 foo：
git branch -u o/master
```

远程有分支更新时，本地可能没有获取新的分支，可以使用：

```bash
# 更新本地的远程仓库列表
git fetch --all
```



## Git配置

### 用户信息

 修改用户名和邮箱

```bash
git config user.name 用户名
git config user.email 邮箱
```

全局修改添加`--gloabl`参数：

```bash
git config  --global user.name 用户名
git config  --global user.email 邮箱名
```

此外还可以在`~/.gitconfig`文件中直接修改



## Git日志

### 统计提交

统计某用户提交：

```bash
git log --author="$(git config --get user.name)" --pretty=tformat: --numstat | gawk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "增加的行数:%s 删除的行数:%s 总行数: %s\n",add,subs,loc }'
```

统计某用户时间范围内的提交：

```bash
git log --author="$(git config --get user.name)" --since='2021-04-01' --until='2021-07-01' --pretty=tformat: --numstat | gawk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "增加的行数:%s 删除的行数:%s 总行数: %s\n",add,subs,loc }'
```

统计所有用户提交：

```bash
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

### 文件变更记录

```bash
git log -- [filepath]
```





## .gitignore

在一个项目中，可能有些文件的修改我们并不想将其推送到远程仓库。于是我们可以在`.gitignore`文件配置相应的规则

`.gitignore`是一个没有后缀的文本文件，需要更`.git`文件夹放在同一级目录。具体语法如下：

>`#`: 表示注释行
>
>`dir/`: 表示忽略整个`dir`文件夹
>
>`/README`: 忽略当前目录下的`README`文件
>
>`*.png`: 忽略所有以png为后缀的文件
>
>`!a.png`：不忽略`a.png`文件
>
>`[123]*`: 忽略以1或2或3开头的文件
>
>`[abc]?`: 忽略以a或b或c开头的并且只有两个字符的文件名的文件

**注：**需要注意的是，`.gitignore`默认会搜索所有路径下的文件。比如项目根目录与一级目录下存在同名文件夹：

```bash
.
├── Lib
└── build
    └── Lib
```

如果只想忽略更目录下的`Lib`文件夹中的内容，需要制定为`/Lib/`

