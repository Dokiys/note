# GitGuide

Git 仓库中的提交记录保存的是你的目录下所有文件的快照，就像是把整个目录复制，然后再粘贴一样，但比复制粘贴优雅许多！

Git 希望提交记录尽可能地轻量，因此在你每次进行提交时，它并不会盲目地复制整个目录。条件允许的情况下，它会将当前版本与仓库中的上一个版本进行对比，并把所有的差异打包到一起作为一个提交记录。

Git 保存了提交的历史记录。



## git commit

通过`git commit`命令可以将修改保存成了一个新的提交记录 `C2`（我们暂时这么叫，实际上是一串很长的hash值）。`C2` 的父节点是 `C1`，父节点是当前提交中变更的基础。Git 还可以修改最后一次提交的描述信息，当然，如果`push`之后是没法修改的：

```bash
# 进行一次提交
git commit <filename> -m"提交说明"
# 修改最近一次提交信息
git commit --amend
```

### 相对引用

HEAD 是一个对当前检出记录的符号引用，也就是指向你正在其基础上进行工作的提交记录。
HEAD 总是指向当前分支上最近一次提交记录。
HEAD 通常情况下是指向分支名的。
分离的 HEAD 就是让其指向了某个具体的提交记录而不是分支名。
可以利用`checkout`命令并指定提交记录的hash码让HEAD指向具体的提交：

```bash
git checkout [提交记录hash码]
```

git的hash值基于 SHA-1，共 40 位。例如： `fed2da64c0efc5293610bdd892f82a58e8cbc5d8`
哈希值指定提交记录很不方便，所以 Git 引入了相对引用。可以从一个分支使用相对引用切换到具体的提交记录

- 使用 `^` 表示之前 1 个提交记录
- 使用 `~<num>` 之前多个提交记录，如 `~3`

```bash
git checkout [分支名]^
git checkout [分支名]~3
```



## git branch

Git 的分支也非常轻量。它们只是简单地指向某个提交纪录。即使创建再多分的支也不会造成储存或内存上的开销，并且按逻辑分解工作到不同的分支要比维护那些特别臃肿的分支简单多了。

```bash
git branch [分支名]					# 创建分支
git checkout [分支名]				# 切换分支
git checkout -b [分支名]			# 切换同时创建分支
git branch -m [分支名old] [分支名new]		#重命名
git branch -d [分支名]				# 删除分支
```

```bash
# 删除包含dev的所有分支
git branch | grep 'dev*' | xargs git branch \-d	
# 查看分支来源
git reflog show [分支名]			

# 如果想给分支添加描述信息可以使用：
git config branch.[分支名].description '分支描述信息'
git config branch.[分支名].description  						# 查看分支描述信息
```

### 相对引用

对于分支也可以使用相对引用：

* 使用`@{-<n>}` e.g. `@{-1}` 来表示之前切换的第n个分支

```bash
git checkout branch1
git checkout branch2
git checkout @{-1} # 切换到 branch1 分支
```

### 常用示例

查找某提交存在于哪些分支：
```bash
git branch -l --contains <commit id>	// 本地分支
git branch -r --contains <commit id>	// 远程分支
git branch -all --contains <commit id>	// 所有分支
```

查询已经被合并到当前分支的其他所有分支：

```bash
gitnp branch --merged
```



## git merge

**没事别瞎merge！！确定需要之后再merge！！**

将指定分支合并到当前分支之后。`merge`命令只会将选择的分支合并到当前分支，当前分支中的修改不会保存到`merge`到分支中。

```bash
# 将分支2合并到分支1之后
git merge [分支1] [分支2]	
# 将指定分支合并到当前分支
git merge [分支名]
# merge产生冲突时放弃merge 
git merge --abort		
```

```bash
# 在提交时会将[分支名]中所有的内容作为一个新的commit提交
# 然后再合并到当前分支
git merge --no-ff [分支名]
```



## git rebase

`rebase`会将指定的提交，直接放在指定分支**之后**。`rebase`很容易出现冲突！！**不要在一个共享的分支上进行Git rebase操作。**

```bash
git rebase [提交1] [提交2] [提交3]
# 也可以直接指定分支名，按照该分支中的提交顺序将所有的提交rebase到当前分支
git rebase [分支名]
```
<a id="GitRebase" href="#GitRebaseExample">参考示例</a>。



## git cherry-pick

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

<a id="GitCherryPick" href="#GitCherryPickExample">参考示例</a>。



## git revert

主要有两种方法用来撤销变更`git reset` 和 `git revert`。
`git revert` 会将指定的提交记录的**上一个提交记录**作为一个新的提交，如果与当前分支有冲突，则需要解决冲突。

```bash
git revert [提交号]
```

## git reset

`git reset` 通过把分支记录回退几个提交记录来实现撤销改动。你可以将这想象成“改写历史”。`git reset` 向上移动分支，原来指向的提交记录就跟从来没有提交过一样。

```bash
git reset [提交号]
# 例如：git reset HEAD^1
git reset --hard origin/[分支名]		# => 可以将放弃本地分支为push的提交，强制拉取远程分支
```

放弃本地未提及commit，强制拉取远程仓库分支

```bash
git fetch --all
git reset origin/master
# reset --mixed：默认参数，保留工作目录，并重置暂存区
# reset --hard：不保留暂存区和工作区
# reset --soft：保留工作区，并把重置 HEAD 所带来的差异放到暂存区
```



## git tag

`tag`可以用于永远指向某个提交记录的标识呢，比如软件发布新的大版本，或者是修正一些重要的 Bug 或是增加了某些新特性。

```bash
# 例如：git tag V1 C1
git tag [标签名] [提交号]	

# 查看当前仓库所有tag
git tag	
# 查看匹配的tag
git tag -l ‘v0.1.*’ 
# 添加标签注释
git tag [标签名] [提交号] -m '注释信息'
# 查看注释信息
git tag -n

# 删除tag
git tag -d [标签名]
# 推到远程仓库
git push --tags
```



## git describe

`git describe`用来描述离指定`ref`最近的锚点（也就是标签tag）

```bash
git describe <ref>
```

`<ref>` 可以是任何能被 Git 识别成提交记录的引用，如果你没有指定的话，Git 会以你目前所检出的位置（`HEAD`）。

它输出的结果是这样的：

>  <tag>\_<numCommits>\_g<hash>

`tag` 表示的是离 `ref` 最近的标签， `numCommits` 是表示这个 `ref` 与 `tag` 相差有多少个提交记录， `hash` 表示的是你所给定的 `ref` 所表示的提交记录哈希值的前几位。当 `ref` 提交记录上有某个标签时，则只输出标签名称。



## git stash

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

stash`drop`或`clear`之后的找回：

````bash
git fsck --lost-found 	# 列出丢失的记录
Checking object directories: 100% (256/256), done.
Checking objects: 100% (14550/14550), done.
dangling commit 19003a7aeb006c634a37706ab85fab86ef30756d
dangling blob 2b00b5e5ddff1d6d5abe7b47fac695ad9612df37
dangling blob 66009b9a39d86c8fda20d8c2cb7c2e91732b5fe7
dangling blob 7402cf89cc2b61838e9d913b516b2b13298a7549
dangling commit b403f38c84926422785ce461b01d46ba77582866
git show [COMMIT_ID]		# 查看丢失提交的详细信息
# 找到对应的体检后
git merge [COMMIT_ID] 	# 合并提交的信息
````



## git diff

```bash
git diff <版本号码1(old)> <版本号码2(new)>
git diff 	# 比较所有文件
git diff <文件路径> #比较指定文件
git diff <版本号码1(old)> <版本号码2(new)> <文件路径> # 比较指定文件指定版本的不同
git diff <版本号码1(old)> <版本号码2(new)> --stat # 比较指定版本有哪些文件修改
git diff --cached # 比较暂存区的代码和当前分支head的代码
git diff  ':!<文件/正则>' ':!<文件/正则>'# 比较时排除多个指定文件
git diff <版本号码1(old)> <版本号码2(new)> --stat  ":(exclude)<文件/正则>"	# 比较版本排除制定文件修改
git diff <版本号码1(old)> <版本号码2(new)> -G '<regexp>'	# 显示包含匹配到的文件内容
```

比较本地 `ahead` 远程的提交

```ruby
git cherry -v	# 查看当前分支ahead对应远程分支的提交及描述
git log <分支名> ^origin/<分支名> 	# 查看指定分支 ahead 指定的远程的提交详情
```



## git clean

```bash
git clean -f		# 清除untracked文件
git clean -fd		# 清除untracked文件以及目录
```



## git remote

远程仓库只是你的仓库在另个一台计算机上的拷贝。你可以通过因特网与这台计算机通信 —— 也就是增加或是获取提交记录。

- 远程仓库是一个强大的备份。本地仓库也有恢复文件到指定版本的能力, 但所有的信息都是保存在本地的。有了远程仓库以后，即使丢失了本地所有数据, 你仍可以通过远程仓库拿回你丢失的数据。
- 远程让代码社交化了! 既然你的项目被托管到别的地方了, 你的朋友可以更容易地为你的项目做贡献(或者拉取最新的变更)

Git 远程仓库相当的操作实际可以归纳为两点：

* 向远程仓库传输数据

* 从远程仓库获取数据。


`git clone` 命令在真实的环境下的作用是在**本地**创建一个远程仓库的拷贝（比如从 github.com），创建之后默认会讲ssh地址作为远程仓库。

```bash
git clone [ssh地址]
# 查看远程仓库
git remote -v
# 设置远程仓库
git remote add origin [Git远程仓库url]
```

远程仓库的分支反映了远程仓库(在你上次和它同步时)的**状态**。这会有助于你理解本地的工作与公共工作的差别。
在你检出时自动进入分离 HEAD 状态。Git 这么做是出于不能直接在这些分支上进行操作的原因, 你必须在别的地方完成你的工作, （更新了远程分支之后）再用远程分享你的工作成果。

### 远程跟踪

`master` 和 `o/master` 的关联关系就是由分支的“remote tracking”属性决定的。`master` 被设定为跟踪 `o/master`

当你克隆时，Git 会为远程仓库中的每个分支在本地仓库中创建一个远程分支（比如 `o/master`）。然后再创建一个跟踪远程仓库中活动分支的本地分支，默认情况下这个本地分支会被命名为 `master`。

可以让任意分支跟踪 `o/master`, 然后该分支会像 `master` 分支一样得到隐含的 push 目的地以及 merge 的目标。
例如：以下命令就可以创建一个名为 `totallyNotMaster` 的分支，它跟踪远程分支 `o/master`。

```bash
git checkout -b totallyNotMaster o/master
git checkout -b totallyNotMaster -t o/master
```

#### **设置远程仓库**

可以用`remote`命令查看远程是否可以fetch并用`set-url`选项来修改远程仓库，或者`add`来添加远程仓库

```bash
git remote -v
git remote set-url origin [remote repository]

git remote add [remote repository name] [remote repository]
```

#### **设置远程分支**

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

### git fetch

从远程仓库获取数据, 使远程分支更新以反映最新的远程仓库。

`git fetch` 完成了仅有的但是很重要的两步:

- 从远程仓库下载本地仓库中缺失的提交记录（但不会直接合并到对应分支）
- 更新远程分支指针（如 `o/master`）

`git fetch` 实际上将本地仓库中的远程分支更新成了远程仓库相应分支最新的状态。
`git fetch` 通常通过互联网（使用 `http://` 或 `git://` 协议) 与远程仓库通信。
`git fetch` 并不会改变你本地仓库的状态。它**不会更新你的分支**，也不会修改你磁盘上的文件。
`git fetch` 的参数和 `git push` 极其相似。他们的概念是相同的，只是方向相反罢了（因为现在你是下载，而非上传）

```bash
git fetch origin <source>:<destination>
# 例如：
# 会将远程仓库中的foo分支的上一个提交，fetch到本地的master
# 如果destination不存在的话，会在本地新建一个分支保存提交记录
git fetch origin foo^:master
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
# 例如：
git push origin master
# 切到本地仓库中的“master”分支，获取所有的提交，再到远程仓库“origin”中找到“master”分支，将远程仓库中没有的提交记录都添加上去
```

同时为源和目的地指定 `<place>` 的话，只需要用冒号 `:` 将二者连起来就可以了：

```bash
git push origin <source>:<destination>
# 例如：
# 会将foo分支的上一个提交push到远程仓库的master分支
# 如果destination不存在的话，会在远程仓库新建一个分支保存提交记录
git push origin foo^:master
```

```bash
# 在远程创建一个与当前分支同名的分支并将当前分支的修改提交
git push --set-upstream origin $(git_current_branch)
```



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



## git config

查看配置信息

```bash
git config --global  --list
```

```bash
# 修改用户名和邮箱
git config user.name 用户名
git config user.email 邮箱

# 全局修改
git config  --global user.name 用户名
git config  --global user.email 邮箱名
```

此外还可以在`~/.gitconfig`文件中直接修改



### Hooks

我们可以根据配置，在通过`git`提交或者推送代码的时候，进行一些默认的操作。在每个`git`管理的仓库的根目录下，都会有一个`.git/hooks`的文件夹，其中又一些默认的文件。我们以`pre-commit.sample`为例子。在该文件中添加内容，并将文件名改为`pre-commit`：

```
 #!/bin/sh
 echo "Hello Work!"
 # An example hook script to verify what is about to be committed.
....
```

在下次提交的时候就可以看到`Hello Work!`的输出。

通过一下命令可以设置（全局）的hooks，其命令的执行路径是相对于项目的`.git`所在路径：

```bash
 git config core.hooksPath [PATH]
 git config --global core.hooksPath [PATH]
```

#### **pre-push**

```bash
# 添加push前的golint检查
# 添加到全局
wget -qO ~/workspace/git/hooks/pre-push  https://raw.githubusercontent.com/Dokiys/example/main/shell/git_hooks/pre_push_check && git config --global core.hooksPath ~/workspace/git/hooks && chmod +x ~/workspace/git/hooks/pre-push
# 添加到项目
wget -qO .git/hooks/pre-push  https://raw.githubusercontent.com/Dokiys/example/main/shell/git_hooks/pre_push_check && git config core.hooksPath .git/hooks && chmod +x .git/hooks/pre-push
```

#### **pre-commit**

```bash
wget -qO .git/hooks/pre-commit  https://raw.githubusercontent.com/Dokiys/example/main/shell/git_hooks/pre_commit_filesize_check && git config core.hooksPath .git/hooks && chmod +x .git/hooks/pre-commit
```

**参考：**[Git禁止大文件提交到仓库中](https://vra.github.io/2019/03/10/git-reject-large-file-when-commit/)



### gitignore

#### .gitigonre

在一个项目中，可能有些文件的修改我们并不想将其推送到远程仓库。于是我们可以在`.gitignore`文件配置相应的规则

`.gitignore`是一个没有后缀的文本文件，需要更`.git`文件夹放在同一级目录。具体语法如下，更多例子可参考[这里](https://www.atlassian.com/git/tutorials/saving-changes/gitignore)：

```bash
#: 表示注释行
# 表示忽略整个dir文件夹
dir/ 
# 忽略当前目录下的README文件
/README 
# 忽略所有目录下的cover.out文件
**/cover.out 
# 忽略所有以png为后缀的文件
*.png 
# 不忽略a.png文件
!a.png 
# 忽略以1或2或3开头的文件
[123]* 
# 忽略以a或b或c开头的并且只有两个字符的文件名的文件
[abc]? 
```

**注：**需要注意的是，`.gitignore`默认会搜索所有路径下的文件。比如项目根目录与一级目录下存在同名文件夹：

```bash
.
├── Lib
└── build
    └── Lib
```

如果只想忽略更目录下的`Lib`文件夹中的内容，需要指定为`/Lib/`

#### core.excludesFile

`.gitignore`只能对应一个仓库，如果想全局忽略所有仓库中的某些文件，可以通过配置`core.excludesFile`来设置：

```bash
git config --global core.excludesFile "~/workspace/git/.global_ignore" # 设置忽略配置文件路径
git config --get core.excludesFile		# 查看忽略配置文件路径
```

需要注意的是，这里的配置文件中每条配置跟`.gitignore`一样，是相对于每个仓库而言的，而不是绝对路径。



## git log

```bash
# 查看某文件变更记录
git log -- [filepath]

# 图形化查看当前分支体检记录
git log --graph --oneline		
# 只查看当前分支的提交和Merge提交
git log --graph --oneline --min-pare
# 只查看当前分支的提交和Merge提交nts=2	
git log --graph --oneline --merges	
# 按照自定义格式输出 
git config --global alias.logline "log --pretty='%C(yellow)%h%C(cyan) %aN%C(reset)%C(auto)%d %Creset%s' --graph"
```

参考：
https://git-scm.com/docs/git-log#_pretty_formats
https://www.cnblogs.com/bellkosmos/p/5923439.html



## git submodule

`submodule`允许将一个`git`仓库作为另外一个`git`仓库的子目录，且两个仓库具有独立的提交。可以通过如下命令根据一个已有仓库在当前仓库中创建同名的子模块：

```shell
# 也可以通过submodule_name进行重命令
git submodule add git@github.com:Dokiys/sub1.git [submodule_name]
```

主仓库和子模块的关联会体现在执行命令后新生成的`.gitsubmodule`文件、当前仓库的`.git/config`配置信息、`.git/modules/submodule_name`文件夹中。

由于子模块独立于主仓库，因此子模块中的提交、远程同步都是独立的。在子模块中提交更改后，才能在主仓库中体现出来有更改。并且在主仓库中是依照子模块提交的hash码进行关联的，所以如果子模块的提交没有推送到远程仓库，而主仓库已经推送到了远程仓库，则可能导致其他开发人员无法获取到对应的子模块提交。

彻底移除子模块

```shell
git config -f .gitmodules --remove-section submodule.[submodule_name] # 在.gitmodules文件中移除子模块
git config --remove-section submodule.[submodule_name] # 移除仓库config中的子模块配置
rm .git/modules/[submodule_name]	# 移除子模块关联文件
git rm --cached [submodule_name] # 清除索引
```

本地取消子模块关联
```bash
rm -rf [submodule_name] # 删除子模块目录
git submodule deinit [submodule_name] # 取消子模块的初始化
git rm --cached [submodule_name] # 清除索引
```

重新初始化并更新子模块

```bash
git submodule update --init [submodule_name]
# 等价于 
git submodule init [submodule_name]
git submodule update -- [submodule_name]
```

根据主仓库拉取子模块代码

```bash
git submodule update # 拉去所有已经初始化过的子模块
git submodule update -- [submodule_name] # 拉取指定的子模块
git pull --recurse-submodules # 在拉去主仓库时拉去所有已经初始化过的子模块
```





# Git规范

## Commit 规范

`git commit` 时应当使用`-a` 进入交互界面编辑提交信息。基本格式：

```text
<type>[optional scope]: <description>
// 空行
[optional body]
// 空行
[optional footer(s)]
```

示例：

```git
commit d54d1fd68eb4a2bb32dbd107f639ef15966cf9d4
Author: Sumit Arora <er.sumitarora@gmail.com>
Date:   Thu Feb 17 22:56:33 2022 -0500

    feat(devtools): dynamic build support for devtools (#44952)

    * Updating build to support both browsers firefox & chrome.
    * Added new `config_setting` to support build.
    * Added new genrule `copy_manifest` to `prodapp` pkg_web.

    PR Close #44952
```

**Head**

| Type         | Description                                      |
| ------------ | ------------------------------------------------ |
| feat/feature | 新增功能                                         |
| fix          | bug修复                                          |
| perf         | 提高代码性能                                     |
| style        | 代码格式类变更                                   |
| refactor     | 其他代码类变更，如简化代码、删除溶于重命名变量等 |
| test         | 修改测试用例                                     |
| ci           | 持续集成和部署相关变更                           |
| docs         | 文档类更新                                       |
| chore        | 对构建过程或辅助工具和库(如文档生成)的更改       |

**Body**

动词开头、使用现在时。必须包括修改的动机、跟上一版本相比的改动点。
如果当前 commit 还原了先前的 commit，则应以 revert: 开头，后跟还原的 commit 的 Header。
而且，在 Body 中必须写成 `This reverts commit <hash>` ，其中 hash 是要还原的 commit 的 SHA 标识。

```git
commit 7a37fe9f2855b2b09fb478c05be213211c0a1cb2
Author: Jessica Janiuk <jessicajaniuk@google.com>
Date:   Fri Apr 8 18:46:46 2022 +0000

    Revert "build: update to jasmine 4.0 (#45558)" (#45566)

    This reverts commit a248df06824db1c40346b84de07ff905b0d0606f.

    PR Close #45566
```



**Footer**

如当前代码跟上一个版本不兼容，需要在 footer 部分以 BREAKING CHANG: 开头，跟上不兼容改动的摘要。其他部分需要说明变动的描述、变动的理由和迁移方法：

```git
commit 9add714b13740db621eb2b200d72be74cc7eb630 (origin/g3)
Author: Andrew Kushnir <akushnir@google.com>
Date:   Wed Mar 30 19:13:39 2022 -0700

    refactor(core): remove deprecated `aotSummaries` fields in TestBed config (#45487)

    BREAKING CHANGE:

    Since Ivy, TestBed doesn't use AOT summaries. The `aotSummaries` fields in TestBed APIs were present, but unused. The fields were deprecated in previous major version and in v14 those fields are removed. The `aotSummaries` fields were completely unused, so you can just drop them from the TestBed APIs usage.

    PR Close #45487
```



## 分支管理

通常在非开源项目中一般会根据不同的环境来设置分支，比如:

| 分支名  | 描述                                                         |
| ------- | ------------------------------------------------------------ |
| master  | 该分支上的最新代码永远是发布状态，不能直接在该分支上开发<br />master分支每合并一个hotfix/release分支，都会打一个版本标签 |
| develop | 该分支上的代码是开发中的最新代码，该分支只做合并操作，不能直接在该分支上开发 |
| feature | 在研发阶段来做功能开发的分支<br />新功能的feature分支基于该分支创建，分支名通常为feature/xxxx-xxx<br />开发完成之后，先pull一下develop分支，解决冲突后再合并到develop分支并删除。 |
| release | 基于develop分支创建的发布阶段作版本发布的预发布分支，分支名建议命名为：release/xxxx-xxxø<br/>例如，v1.0.0版本的功能全部开发测试完成后，提交到develop分支<br />然后基于develop分支创建release/1.0.0分支，并提交测试，测试中遇到的问题在release分支修改<br />最终通过测试后，将release分支合并到master和develop，并在master分支打上v1.0.0标签 |
| hotfix  | 基于master分支上创建的维护阶段作紧急bug修复分支<br />修复完成后合并到master。分支名通常为hotfix/xxxx-xxxo<br />例如：当线上某个版本出现Bug后，从master检出对应版本的代码，创建hotfix分支并修复问题<br />问题修复后，将hotfix分支合并到master和develop分支，并在master分支打上修复后的版本标签 |

基本流程：

```bash
# 1. 创建要给常驻分支
git checkout -b develop master

# 2. 基于 develop 分支，新建一个功能分支：feature/hello-world。
git checkout -b feature/hello-world develop

# 3. feature/hello-world 分支上开发
echo "feature1" >> test.txt 

# 4. 开发过程中需要先紧急修复线上代码的 bug
git stash                                         # 临时保存修改至堆栈区
git checkout -b hotfix/error master               # 从 master 建立 hotfix 分支
echo "hotfix" >> test.txt                         # 修复 bug
git commit -a -m 'fix print message error bug'    # 提交修复
git checkout develop                              # 切换到 develop 分支
git merge --no-ff hotfix/error                    # 把 hotfix 分支合并到 develop 分支
git checkout master                               # 切换到 master 分支
git merge --no-ff hotfix/error                    # 把 hotfix 分支合并到 master
git tag -a v0.9.1 -m "fix log bug"                # 在 master 分支打上 tag
scp test root@target:/opt/                        # 编译并部署代码
git branch -d hotfix/error                        # 修复完成后删除 hotfix/xxx 分支
git checkout feature/hello-world                  # 切换到 feature 分支下
git merge --no-ff develop                         # develop 有更新，需要同步更新下
git stash pop                                     # 恢复到修复前的工作状态

# 5. 继续开发
echo "feature2" >> test.txt 

# 6. 提交代码到 feature/hello-world 分支
git commit -a -m "print 'hello world'"

# 7. 在 feature/hello-world 分支上做 code review
git push origin feature/print-hello-world         # 提交到远程仓库
# 创建 PR、指定 Reviewers 进行 CR

# 8. CR 过后，由代码仓库 Matainer 将功能分支合并到 develop 分支
git checkout develop
git merge --no-ff feature/hello-world

# 9. 基于 develop 分支创建 release 分支，测试代码
git checkout -b release/1.0.0 develop
cat test.txt 

# 10. 如果测试失败，直接在 release/1.0.0 分支修改代码，完成后提交并编译部署
git commit -a -m "fix bug"
scp test root@target:/opt/

# 11. 测试通过后，将 release/1.0.0 分支合并到 master 分支和 develop 分支
git checkout develop
git merge --no-ff release/1.0.0
git checkout master
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "add print hello world" # master 分支打 tag

# 12. 删除 feature/hello-world 分支，也可以选择性删除 release/1.0.0 分支
git branch -d feature/hello-world
# git branch -d release/1.0.0
```



## 语义化版本

参考：[semantic versioning](https://semver.org/spec/v2.0.0.html)



# 常用示例

## Github基于别人分支修改

```bash
# 1. 从远程仓库拉取别人提交的PR分支
# pbpaste为PR号
git fetch origin pull/$(pbpaste)/head:$(pbpaste) && git checkout $(pbpaste)
```

```bash
# 直接修改别人的PR
git remote set-url origin [other_repository_url]					# 2. 先修改remote
git push origin $(git_current_branch):main								# 3. 推到别人分支
git remote set-url origin [repository_url]								# 4. 设置回来
```



## 撤销

```bash
# 未使用 git add 缓存代码时
git checkout -- [文件名/路径]
# 撤销所有文件
git checkout head . 
```

```bash
# 已经使用了 git add 缓存了代码
git reset HEAD [文件名/路径] 
# 放弃所有缓存
git reset HEAD 
```

```bash
# 已经用 git commit 提交了代码，需要全部撤回
git reset --hard HEAD^
```

```bash
# 对单个已提交文件撤回
git checkout [提交] [文件名/路径]
git reset [提交] [文件名/路径]
```

```bash
# 对上一次的提交进行修改，可以使用该命令。也可以修改提交说明。
$ git commit --amend 
```

如果要撤销或者重新排序提交记录可以参考[撤销提交记录](#git reset)和[git cherry-pick](#git cherry-pick)。



## 删除历史提交大文件

```bash
# 1. 清除缓存
git gc --prune=now	
```

```bash
# 2. 查找大文件
$ git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -3 | awk '{print$1}')"
```

`git rev-list --objects —all`显示所有commit及其所关联的所有对象  
`verify-pack -v *.idx`：查看压缩包内容  

```bash
# 3. 删除指定的大文件
git filer-branch --force --index-filter "git rm -rf --cached --ignore-unmatch [filename]" --prune-empty --tag-name-filter cat -- --all
```

`filter-branch` ：命令通过一个`filter`来重写历史提交，这个`filter`针对指定的所有分支运行  
`--index-filter`：过滤命令作用于`git rm -rf --cached --ignore-unmatch [filename]`  
`git rm -rf --cached --ignore-unmatch [filename]`： 删除`index`中的文件，并且忽略没有匹配的`index`  
`--prune-empty`：指示`git filter-branch` 完全删除所有的空commit  
`-–tag-name-filter`：将每个tag指向重写后的commit  
`cat`命令会在收到tag时返回tag名称  
`–-`选项用来分割 rev-list 和 filter-branch 选项  
`--all`参数告诉Git我们需要重写所有分支（或引用）

```bash
# 4. 删除缓存
# 移除本地仓库中指向旧提交的剩余refs
$ git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
# 清除reflog
$ git reflog expire --expire=now --all
# Git的垃圾回收器清理没有引用指向的对象。
$ git gc --prune=now
```

此时就已经完成了对文件的删除，但是提交到远程仓库时**一定要先备份原来的仓库，一旦提交后就再也没有办法恢复了！！一旦提交后就再也没有办法恢复了！！一旦提交后就再也没有办法恢复了！！**

```bash
# 5. 覆盖远程的提交
$ git push --all --force
$ git push --tags --force
```

```bash
# 6. 其他的存储库拉取时也需要删除旧的提交，清理本地仓库
$ git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
$ git reflog expire --expire=now --all
$ git gc --prune=now·
```

参考：[Git清理删除历史提交文件](https://www.jianshu.com/p/7ace3767986a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)



## rebase实践

### 合并提交

添加参数 `--interactive`或者`-i`可以进入交互式的 rebase。<a id="GitRebaseExample" href="#GitRebase">↵</a>
增加了这个选项后, Git 会打开一个 UI 界面并列出将要被复制到目标分支的备选提交记录，它还会显示每个提交记录的哈希值和提交说明，提交说明有助于你理解这个提交进行了哪些更改。假设我们有如下提交：

```bash
git log 
commit 4232037057c6805805547366a1d7a05a0df4a63a (HEAD -> feature/t)
Author: Dokiy <zhang@fanal.com.cn>
Date:   Wed Apr 13 10:51:27 2022 +0800

    2

commit 84076eb827eddbb8735472924bde9ced976dc88f
Author: Dokiy <zhang@fanal.com.cn>
Date:   Wed Apr 13 10:51:22 2022 +0800

    1

commit a6ab3f7beb2c16caff1433ba224f6e96f873b6ec (origin/master, origin/HEAD, master)
Author: 4javier <4javiereg4@gmail.com>
Date:   Wed Apr 13 01:23:33 2022 +0200

    docs: fix grammar (#45455)
    PR Close #45455
```

从`HEAD～2`到最新提交开始修改：

```bash
git rebase -i HEAD~2
###[Dokiy]: 修改一下内容并保存将会改变顺序
pick 84076eb827 1
pick 4232037057 2

###[Dokiy]: 以下是指令说明
# Rebase a6ab3f7beb..4232037057 onto a6ab3f7beb (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
...
```

修改内容为一下内容并保存：

```bash
pick 84076eb827 1
squash 4232037057 2
```

进入到修改提交注释的界面，直接保存：

```bash
# This is a combination of 2 commits.
# This is the 1st commit message:

1

# This is the commit message #2:

2
```

```bash
git log
commit 493a535d93b041b3693cdf0c3b520ce9112b2a3a (HEAD -> feature/t)
Author: Dokiy <zhangzongqi@fancydigital.com.cn>
Date:   Wed Apr 13 10:51:22 2022 +0800

    1

    2

commit a6ab3f7beb2c16caff1433ba224f6e96f873b6ec (origin/master, origin/HEAD, master)
Author: 4javier <4javiereg4@gmail.com>
Date:   Wed Apr 13 01:23:33 2022 +0200

    docs: fix grammar (#45455)
    PR Close #45455
```

最后两个分支被合并了

#### 修改之前 的提交信息

首先通过`git log`找到需要更改的上一个提交记录的hash，比如`6ea8799`

然后通过`git rebase -i 6ea8799`进入到交互页面，将对应的提交从`pick`修改为`edit`：

```
  1 pick f851603 feat: build pe
  2 pick 05a7a09 fix: go mod
  3 edit 6ea8799 fmt: domain
```

通过`git commit --amend`重新修改提交的信息

最后使用`git rebase --continue` 结束



## 一次cherry-pick实践

背景：在共享的开发中，二进制文件通常不应该被提交到远程仓库。一旦提交之后就会被git保存在历史记录中，这将占用大量的空间。并且即使在后续的提交中进行了删除，之前的二进制文件记录也会被保存在历史记录中。<a id="GitCherryPickExample" href="#GitCherryPick">↵</a>

在一次开发中，不小心吧二进制文件提交到了远程仓库，好在还没有合并到主分支。坏在提交二进制文件的记录之后已经有了十几次提交。
重新修改的思路就是，找到提交二进制文件的位置，然后切出一个新的分支。修改之后，将原来分支之后每一个提交记录`cherry-pick`到新切出的分支。

```bash
# 首先我们需要找到需要修改的提交并修改，比如我这里是
➜  workspace git:(error_branch) git checout 14ddcb9 && git checkout -b fix_cherry_pick
# 修改完成后强制覆盖原来的提交
➜  workspace git:(fix_cherry_pick) git add . && git commit --amend
# 这时候我们需要回到原来的分支查看[14ddcb9]之后所有的提交
➜  workspace git:(fix_cherry_pick) git checkout feat/add_api
```

```bash
# 查询自【14ddcb9】之后的提交记录
➜  workspace git:(error_branch) git --no-pager log --after="$(git show -s --format='%at' 14ddcb9)" --first-parent --format=format:"%h" --reverse feat/eticket_api_migration_archive ^14ddcb9 | tr '\n' ' '
641eef3 418022f 81b1e50...6b781f7 77441cd
#### 这里解释一下这条命令 ####
# --no-pager: 指定一次输出所有的记录，而不采用分页
# --after="$(git show -s --format='%at' 14ddcb9)"： 设置查看从某某时间开始的记录
# git show -s --format='%at' 14ddcb9： 可以获取到<commit:14ddcb9>的提交时间
# --first-parent： 因为我这个提交里面存在merge其他分支的情况，所有只查看merge的那一条提交
# --format=format:"%h" 设置log输出的格式， %H指定输出完整的hash值
# --reverse：设置倒序输出提交，方便进行cherry-pick
# ^14ddcb9: 排除<commit:14ddcb9>这个提交
# | tr '\n' ' '： 将换行输出转变成空格输出
```

获取到这这些提交记录之后，我们可以回到刚刚的`fix_cherry_pick`直接使用`cherry-pick`整理提交：

```bash
➜  workspace git:(error_branch) git checkout fix_cherry_pick
➜  workspace git:(fix_cherry_pick) git cherry_pick 641eef3 418022f 81b1e50...6b781f7 77441cd
[fix_cherry_pick 192ded3] Add
 Date: Thu Aug 11 10:09:28 2022 +0800
 1 file changed, 208 insertions(+), 249 deletions(-)
error: commit c28e6e04726decdd52e6514bf4e58c594a907d5d is a merge but no -m option was given.
```

这时候遇到了一个错误，这是因为`<commit:c28e6e0>`这个提交是一个merge的操作，而merge有可能会出现冲突，git并不知道如何去处理这些冲突，所以需要我们手动去处理：

```bash
➜  workspace git:(fix_cherry_pick) git merge c28e6e04726decdd52e6514bf4e58c594a907d5d
Auto-merging a.go
Auto-merging b.go
CONFLICT (content): Merge conflict in b.go
Automatic merge failed; fix conflicts and then commit the result.
```

处理完冲突之后提交，并继续`cherry-pick`，直到完成所有的提交即可：

```bash
➜  workspace git:(fix_cherry_pick) git cherry-pick --continue
```



## 统计用户提交

统计某用户提交：

```bash
git log --author="$(git config --get user.name)" --pretty=tformat: --numstat | awk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "增加的行数:%s 删除的行数:%s 总行数: %s\n",add,subs,loc }'
```

统计某用户时间范围内的提交：

```bash
git log --author="$(git config --get user.name)" --since='2021-04-01' --until='2021-07-01' --pretty=tformat: --numstat | awk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "增加的行数:%s 删除的行数:%s 总行数: %s\n",add,subs,loc }'
```

统计所有用户提交：

```bash
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

