# Aliyun SLS查询与分析

## 索引

只有[**配置索引**](https://help.aliyun.com/document_detail/90732.html)后，才能进行查询和分析操作。索引类型分为：  
全文索引：根据设置的分词符将整条日志拆分成多个词并构建索引。查询时，不区分字段名称和字段值。    
字段索引：可以指定字段名称和字段值（Key:Value）进行查询。

`__XXX__`为保留字段，不支持全文索引，如果需要查询必须设置字段索引。

在搜索页面的【查询分析属性】中配置索引时，可以设置大小写敏感、是否包含中文、分词符等信息。



## 数据类型

建立索引时，可将字段的[**数据类型**](https://help.aliyun.com/document_detail/92078.html)设置为`text`、`long`、`double`或`JSON`。

字符串类型的字段可以为其建立`text`索引，`Boolean`类型的字段也可以设置成`text`。  
随后可以进行如下查询：

```
# 查询非GET请求的日志
not request_method : GET
```

```
# 某text类型的索引字段以cn开头的日志
cn*
```

建立`long`或者`double`类型的索引后，可以通过`>`, `<`, `=`, `in`等关键字对字段进行搜索。比如：

```
# 查询请求时间大于等于60秒，并且小于200秒的日志
request_time in [60 200)
request_time >= 60 and request_time < 200
```

**注：**`long`和`double`无法模糊查询，并且如果实际值不是设置类型，则无法查询该字段。

`JSON`类型的索引，也可以为其中的字段单独设置类型。`JSON`类型中的孙节点，数组字段都无法建立索引。  
但是对于`JSON`中的嵌套字段可以使用`.`的方式在子节点上建立索引，比如 data.**param.projectName** :

```
# 查询usedTime字段的值大于60秒且projectName的值不为project01的日志
data.usedTime > 60 not data.param.projectName : project01
```

---



## 基本语法

基本查询语法分为如下两个部分，通过`|`分割：

```
查询语句|分析语句
```

查询语句用于指定日志查询时的过滤规则，返回符合条件的日志。分析语句用于对查询结果或全量数据进行计算和统计



### 查询语句

根据索引配置方式可分为全文查询和字段查询，根据查询精确程度可分为精确查询和模糊查询。 

全文查询：配置全文索引后，可以直接使用关键词（字段名、字段值）进行查询。 `PUT and cn-shanghai`表示查询同时包含关键字**PUT**和**cn-shanghai**的日志  
字段查询：可以指定字段名称和字段值（Key:Value）进行查询。比如：`request_time>60 and request_method:Ge*`表示查询**request_time**字段值大于**60**且**request_method**字段值以**Ge**开头的日志。

精确查询：使用完整的词进行查询。 比如：`PUT and cn-shanghai`表示查询同时包含关键字**PUT**和**cn-shanghai**的日志    
模糊查询：对于全文索引或者`text`类型的字段索引，可以使用`*(任意字符)`, `?(单个字符)`的通配符进行模糊搜索。搜索的内容必须限制在64个字符以内。比如：`host:www.yl*`表示在所有日志中查找**host**字段值以**www.yl**开头的100个词，并返回包含这些词的日志。

日志查询是基于分词的，比如如下的查询，其实是等价的都是查询**http_user_agent**字段值中包含**Linux**和**Chrome**的日志：

```
http_user_agent:"Linux Chrome"
http_user_agent:Linux and http_user_agent:Chrome
```

如果像查询整个字符串"Linux Chrome"可以使用短语查询：

```
http_user_agent:#"Linux Chrome"
```

[查询语句支持的运算符](https://help.aliyun.com/document_detail/29060.html#title-eqq-r6a-x2z)  
[常见查询示例](https://help.aliyun.com/document_detail/29060.htm#h3-url-3)  
[常见查询示例2](https://help.aliyun.com/document_detail/29060.htm#h3-url-4)



### 分析语句

分析语句可以对查询结果或全量数据进行计算和统计。比如：

```
* | SELECT status, count(*) AS PV GROUP BY status
```

**注：**分析语句中使用`""`来包裹字段名称，使用`''`来包裹字符串

绝大部分SQL函数都是被支持的（[**支持的分析函数和语法**](https://help.aliyun.com/document_detail/53608.html#title-ib1-pbz-27l)），并且还支持在SQL分析语句中定义Lambda表达式，需要与数组函数和map函数一起使用。比如：

```
* | SELECT filter(array[5, null, 7, null], x -> x is not null)
```

分析语句也支持[部分SQL语法](https://help.aliyun.com/document_detail/322174.html)，比如常见的`GROUP BY`, `HAVING`, `JOIN`, `LIMIT`, `ORDER BY`等。  
分析语句还支持嵌套子查询，但是在子查询语句中，需要指定`FROM log`来表示在当前`Logstore`中执行SQL分析。比如：

```
* | SELECT min(PV) FROM  (SELECT count(1) as PV FROM log GROUP BY request_method)
```

[优化查询](https://help.aliyun.com/document_detail/63794.html)   
[分析案例](https://help.aliyun.com/document_detail/63662.html)
