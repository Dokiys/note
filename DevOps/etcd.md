# etcd

etcd是一个用于存储关键元数据的分布式key-value存储系统。etcd 以一致和容错的方式存储元数据，设计用于可靠存储**不频繁更新**的数据，并提供可靠的观察查询。
所以etcd通常被用于配置管理，服务发现和协调分布式工作，而不是像redis或memcached一样的数据存储。



## Hello etcd

让我先搭建一个搭建本地集群，来简单了解一下etcd。
首先需要下载etcd发行版本，进行安装。我这里使用的是3.5.0，[github](https://github.com/etcd-io/etcd/releases/tag/v3.5.0)上提供了安装的脚本，我这里使用的是Mac。安装好后进入`/tmp/etcd-download-test`文件夹，检查是否安装成功：：

```bash
ETCD_VER=v3.5.0

# choose either URL
GOOGLE_URL=https://storage.googleapis.com/etcd
GITHUB_URL=https://github.com/etcd-io/etcd/releases/download
DOWNLOAD_URL=${GOOGLE_URL}

rm -f /tmp/etcd-${ETCD_VER}-darwin-amd64.zip
rm -rf /tmp/etcd-download-test && mkdir -p /tmp/etcd-download-test

curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-darwin-amd64.zip -o /tmp/etcd-${ETCD_VER}-darwin-amd64.zip
unzip /tmp/etcd-${ETCD_VER}-darwin-amd64.zip -d /tmp && rm -f /tmp/etcd-${ETCD_VER}-darwin-amd64.zip
mv /tmp/etcd-${ETCD_VER}-darwin-amd64/* /tmp/etcd-download-test && rm -rf mv /tmp/etcd-${ETCD_VER}-darwin-amd64

# 进入目录，检查是否安装成功
cd /tmp/etcd-download-test
./etcd --version
```

然后我们通过`goreman`来启动多成员集群：
`Procfile`文件可以通过 [etcd 的 gitub 项目的根目录下](https://github.com/coreos/etcd/blob/master/Procfile)找到，但是我们需要做一些修改：

```vim
etcd1: ./etcd --name infra1 --listen-client-urls http://127.0.0.1:2379 --advertise-client-urls http://127.0.0.1:2379 --listen-peer-urls http://127.0.0.1:2380 --initial-advertise-peer-urls http://127.0.0.1:2380 --initial-cluster-token etcd-cluster-1 --initial-cluster 'infra1=http://127.0.0.1:2380,infra2=http://127.0.0.1:22380,infra3=http://127.0.0.1:32380' --initial-cluster-state new --enable-pprof --logger=zap --log-outputs=stderr
etcd2: ./etcd --name infra2 --listen-client-urls http://127.0.0.1:22379 --advertise-client-urls http://127.0.0.1:22379 --listen-peer-urls http://127.0.0.1:22380 --initial-advertise-peer-urls http://127.0.0.1:22380 --initial-cluster-token etcd-cluster-1 --initial-cluster 'infra1=http://127.0.0.1:2380,infra2=http://127.0.0.1:22380,infra3=http://127.0.0.1:32380' --initial-cluster-state new --enable-pprof --logger=zap --log-outputs=stderr
etcd3: ./etcd --name infra3 --listen-client-urls http://127.0.0.1:32379 --advertise-client-urls http://127.0.0.1:32379 --listen-peer-urls http://127.0.0.1:32380 --initial-advertise-peer-urls http://127.0.0.1:32380 --initial-cluster-token etcd-cluster-1 --initial-cluster 'infra1=http://127.0.0.1:2380,infra2=http://127.0.0.1:22380,infra3=http://127.0.0.1:32380' --initial-cluster-state new --enable-pprof --logger=zap --log-outputs=stderr
```

然后通过`goreman`启动

```bash
$ go get github.com/mattn/goreman		# 安装goreman
$ goreman start
```

查看启动信息：

```bash
$ export ETCDCTL_API=3
$ ./etcdctl --write-out=table --endpoints=localhost:2379 member list
+------------------+---------+--------+------------------------+------------------------+------------+
|        ID        | STATUS  |  NAME  |       PEER ADDRS       |      CLIENT ADDRS      | IS LEARNER |
+------------------+---------+--------+------------------------+------------------------+------------+
| 8211f1d0f64f3269 | started | infra1 | http://127.0.0.1:12380 |  http://127.0.0.1:2379 |      false |
| 91bc3c398fb3c146 | started | infra2 | http://127.0.0.1:22380 | http://127.0.0.1:22379 |      false |
| fd422379fda50e48 | started | infra3 | http://127.0.0.1:32380 | http://127.0.0.1:32379 |      false |
+------------------+---------+--------+------------------------+------------------------+------------+
```

让我们通过删除一个节点来体验一下etcd的容错性和一致性：

```bash
$ goreman run stop etcd2		# 删除第二个成员
$ ./etcdctl --endpoints=localhost:22379 get key		# 请求一下第二个节点，确认节点已经无法访问
... 
Error: context deadline exceeded

$ ./etcdctl --endpoints=localhost:2379 put key hello		# 向第一个节点存入数据
OK
$ ./etcdctl --endpoints=localhost:32379 get key					# 从第三个节点取出数据
key
hello
$ ./etcdctl --endpoints=localhost:22379 get key					# 向第二个节点取出数据
...
Error: context deadline exceeded

$ goreman run start etcd2 	# 启动第二个成员
$ ./etcdctl --endpoints=localhost:22379 get key					# 成功从第二个节点获取到数据
key
hello
```



## API

接下来让我们通过`etcdctl`提供的API来与`etcd`进行更深入的交互。

首先我们需要通过环境变量的方式设置使用的API版本：

```bash
$ export ETCDCTL_API=3
$ ./etcdctl version
etcdctl version: 3.5.0
API version: 3.5
```

### 写入键

`etcd`会将每个存储的键通过 Raft 协议复制到 etcd 集群的所有成员来实现一致性和可靠性。
所有我们不用像之前的例子那样指定`--endpoints`来向集群中的某个成员写入键。但是需要注意的是，`etcd`默认使用2379接口，如果修改了接口仍然需要指定成员才能进行交互：

```bash
$ ./etcdctl put foo bar
OK
```

### 读取键

通过`get`指定key可以获取到key对应的值，这个命令将同时返回key和value：

```bash
$ ./etcdctl get foo
foo
bar
```

`etcdctl`还提供了更多功能的读取：

```bash
etcdctl get --prefix ""									# 获取所有值
etcdctl get --prefix foo								# 获取foo前缀多所有值
etcdctl get --prefix --limit=2 foo			# 限制获取数量
etcdctl get foo --print-value-only			# 只获取key对应的value
etcdctl get foo --keys-only							# 只获取key
etcdctl get foo foo3										# 获取key在[foo, foo3)之间的所有值
```

### 版本

`etcd`集群内部维护了一个全局的修订版本，每次对键的修改操作都会增加版本号。可以通过指定版本号来获取对应版本key-value的信息。
我们可以通过添加`-w=json`查看到当前的全局修订版本：

```bash
$ ./etcdctl get foo -w=json
{"header":{"cluster_id":17237436991929493444,"member_id":9372538179322589801,"revision":3,"raft_term":6},"kvs":[{"key":"Zm9v","create_revision":3,"mod_revision":3,"version":1,"value":"YmFy"}],"count":1}
```

可以从`header`里面看到，当前的`reversion`是3，让我们再进行一些操作：

```bash
$ ./etcdctl put foo1 bar1
$ ./etcdctl put foo bar_new
$ ./etcdctl put foo1 bar1_new
```

`etcd`的key-value版本应该如下：

```bash
foo = bar         # revision = 3
foo1 = bar1       # revision = 4
foo = bar_new     # revision = 5
foo1 = bar1_new   # revision = 6
```

让我们先看一下当前所有的key：

```bash
$ ./etcdctl get --keys-only --prefix ""				
foo
foo1
key
```

再看看版本为3时所有的key

```bash
$ ./etcdctl get --keys-only --rev=3 --prefix "" 
foo
key
```

### 删除键

通过`del`可以删除键，并且将返回删除个数：

```bash
$ ./etcdctl del foo1
1
```

添加`--prev-kv`选项可以返回删除的key-value：

```bash
$ ./etcdctl del --prev-kv foo
1
foo
bar_new
```

更多的删除：

```bash
etcdctl del foo foo3						# 获取key在[foo, foo3)之间的所有值
etcdctl del --prefix foo				# 删除指定前缀的key
```

### 监听键

`etcdctl`还可以时时监听某些值的变化：

```bash
$ ./etcdctl watch foo
```

新开一个终端，放入键值：

```bash
$ ./etcdctl put foo bar_watch
OK
```

监听到key-value：

```bash
$ ./etcdctl watch foo
PUT
foo
bar_watch
```

当然，监听也可以使用`--prefix`指定前缀以同时监听多个key，或者通过`etcdctl watch foo foo3`来监听多个key。
如果想监听多个不同的key，可以使用以下方式：

```bash
$ ./etcdctl watch -i
watch foo
watch zoo
```

我们也可以从某个版本开始监听某个或某些key的变动，这将先输出从指定版本到当前版本的所有变动，然后再继续监听：

```bash
./etcdctl watch --rev=2 foo
PUT
foo
bar
PUT
foo
bar_new
DELETE
foo

PUT
foo
bar_watch
```

### 压缩版本

从上面的监听可以看到，如果key频繁的修改，将会累积历史版本的数据。`etcd`可以对历史版本进行压缩，删除之前的历史版本，以释放资源。

```bash
$ ./etcdctl compact 5
compacted revision 5
$ ./etcdctl watch --rev=2 foo				# 访问之前版本将报错
watch was canceled (etcdserver: mvcc: required revision has been compacted)
Error: watch is canceled by the server

$ ./etcdctl watch --rev=5 foo				# 再次监听历史版本
PUT
foo
bar_new
DELETE
foo

PUT
foo
bar_watch
```

### 租约

`etcd`可以通过租约来设置key的存活时间。租约需要提前申请，然后附加到某个或某些键上。一旦租约过期，这些键也将会被删除。

```bash
$ ./etcdctl lease grant 60													# 申请一个60秒的租约
lease 32697f4428077d17 granted with TTL(60s)
$ ./etcdctl put --lease=32697f4428077d17 foo bar		# 将租约附加到key
OK
```

60秒后，租约对应的key将会被删除。可以通过续租来延长租约时间：

```bash
$ ./etcdctl lease keep-alive 32697f4428077d17
lease 32697f4428077d17 keepalived with TTL(60)
lease 32697f4428077d17 keepalived with TTL(60)
lease 32697f4428077d17 keepalived with TTL(60)
```

当然也可以主动停止租约：

```bash
$ ./etcdctl lease revok 32697f4428077d17
lease 32697f4428077d17 revoked
$ ./etcdctl get foo			# 应答为空
```

可以通过以下命令获取到租约的信息：

```bash
$ ./etcdctl lease grant 500
lease 32697f4428077d1c granted with TTL(500s)
$ ./etcdctl put zoo1 val1 --lease=32697f4428077d1c			# 附加租约
$ ./etcdctl put zoo2 val2 --lease=32697f4428077d1c			# 附加租约

$ ./etcdctl lease timetolive 32697f4428077d1c						# 获取租约信息
lease 32697f4428077d1c granted with TTL(500s), remaining(460s)
$ ./etcdctl lease timetolive --keys 32697f4428077d1c		# 获取租约以及附加key的信息
lease 32697f4428077d1c granted with TTL(500s), remaining(391s), attached keys([zoo1 zoo2])
```



## 认证

`etcd`可以通过以下命令开启认证，设置角色权限：

```bash
$ ./etcdctl auth enable
```

但是开启之前必须设置root角色和用户，否则将会报错。我们先创建三种角色：

```bash
$ ./etcdctl role add root
$ ./etcdctl role add admin
$ ./etcdctl role add usr
```

再分别赋予admin读写权限，usr只读权限。需要注意的是，必须要制定允许访问的key，这里通过`--prefix`指定了可以访问所有的`/`为前缀的key：

```bash
$ ./etcdctl role grant-permission admin readwrite --prefix=true /
$ ./etcdctl role grant-permission usr read --prefix=true /
```

接下来需要创建用户并设置角色：

```bash
$ ./etcdctl user add root:123456
$ ./etcdctl user add admin:123456
$ ./etcdctl user add usr:123456

$ ./etcdctl user grant-role root root
$ ./etcdctl user grant-role admin admin
$ ./etcdctl user grant-role usr usr
```

开启认证：

```bash
$ ./etcdctl auth enable
```

之后的操作需要添加`--user`选项来登录用户，才能操作。并且只能操作以`/`前缀开头的key。否则会报错：

```bash
$ ./etcdctl --user=admin:123456 put foo bar
Error: etcdserver: permission denied
$ ./etcdctl --user=admin:123456 put /foo bar
OK
```

如果用usr来写入数据，依旧会报错：

```bash
$ ./etcdctl --user=usr:123456 get /foo
/foo
bar
$ ./etcdctl --user=usr:123456 put /foo bar_new
Error: etcdserver: permission denied
```



## RESTful

`etcd`通过gRPC-gateway提供了RESTful接口来进行操作，具体可以参考 [rpc.swagger.json](https://github.com/coreos/etcd/blob/master/Documentation/dev-guide/apispec/swagger/rpc.swagger.json) 。

