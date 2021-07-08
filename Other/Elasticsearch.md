# Elasticsearch

* Elasticsearch 是一个开源的搜索引擎，建立在一个全文搜索引擎库 [Apache Lucene™](https://lucene.apache.org/core/) 基础之上。并通过HTTP提供 RESTful API 以进行通信
* 在 Elasticsearch 中，术语 *文档* 有着特定的含义。它是指最顶层或者根对象, 这个根对象被**序列化成 JSON** 并存储到 Elasticsearch 中，指定了唯一 ID。
* 在 Elasticsearch 中，数据是被存储和索引在 *分片* 中，而一个索引是逻辑上的命名空间， 这个命名空间由一个或者多个分片组合在一起。
* 文档ID可以自定义生成，也可以由 Elasticsearch 自动生成，Elasticsearch 自动生成的 ID 是 URL-safe、 基于 Base64 编码且长度为20个字符的 GUID 字符串。 这些 GUID 字符串由可修改的 [FlakeID模式](https://einverne.github.io/post/2017/11/distributed-system-generate-unique-id.html) 生成，这种模式允许多个节点并行生成唯一 ID
* 在 Elasticsearch 中文档是 *不可改变* 的，不能修改它们。相反，如果想要更新现有的文档，需要 *重建索引* 或者进行替换。`update` API 可以避免多次请求的网络开销，达到更新的目的，其内部也是*检索-修改-重建索引* 的处理过程。
  `update`还可以更新部分字段。添加`upsert`参数，可以更新或创建文档。 还可以设置更新冲突时的重试次数。
* Elasticsearch 还可以同时取回不同索引中的多个文档。当然也可以批量更新、删除或者创建。
* Elasticsearch 并不是时时更新的，而是通过向缓冲区保存`文档` 然后间隔 1s 提交的方式来更新数据。更新间隔允许修改，和关闭
  由于不是事实更新，Elasticsearch 通过`translog`来保存缓存中的数据，当缓存数据更新到文件系统时，重置`translog`。
  Elasticsearch 默认30分钟提交一次，或者`translog`太大时会自动提交。而`translog`每5s保存一次到磁盘。
* 



1. 索引管理=>类型和映射=>Lucene 如何处理文档
2. 分片内部原理
   映射和分析
3. 



