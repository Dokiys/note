

# 一些关于SQL的事情

* 创建一个在将来可能会用于数据分析，同比数据或者数据量比较大的表时。都需要对`created_at`和`updated_at`字段添加索引。

* 唯一键无法对`NULL`值生效，使用时需要与`not null`同时使用。

* `datatime`和`timestamp`类型插入数据的精度比表设置的精度高时都有出现四舍五入的情况。

* 事务修改需要添加`FOR UPDATE`来加行锁进行查询`SELECT * FROM user WHERE id = 1 FOR UPDATE`。

* 查看mysql状态`SHOW STATUS`，刷新mysql状态`FLUSH STATUS`

* 可以通过Hints来影响一个查询，例如：

  ```sql
  SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
    FROM t3 WHERE f1 > 30 AND f1 < 33;
  SELECT /*+ BKA(t1) NO_BKA(t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
  SELECT /*+ NO_ICP(t1, t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
  SELECT /*+ SEMIJOIN(FIRSTMATCH, LOOSESCAN) */ * FROM t1 ...;
  EXPLAIN SELECT /*+ NO_ICP(t1) */ * FROM t1 WHERE ...;
  SELECT /*+ MERGE(dt) */ * FROM (SELECT * FROM t1) AS dt;
  INSERT /*+ SET_VAR(foreign_key_checks=OFF) */ INTO t2 VALUES(2);
  ```

  对索引的Hints：

  ```sql
  SELECT * FROM table1 USE INDEX (col1_index,col2_index)
    WHERE col1=1 AND col2=2 AND col3=3;
  
  SELECT * FROM table1 IGNORE INDEX (col3_index)
    WHERE col1=1 AND col2=2 AND col3=3;
  ```

* [Aliyun RDS性能诊断](https://help.aliyun.com/document_detail/128447.html)

* `TRUNCATE TABLE [tbl_name]`可以删除某个表中的所有数据

* 有些表的状态（比如：已过期）可以通过软状态表示。实际为某个状态，后端查出来之后再根据业务重新赋值。但是这样会增加状态查询的难度，会使得SQL必须包含业务逻辑。

* 自 MySQL 8.0.12 版本引入`ALGORITHM`用于快速执行Online DDL。[参考](http://www.weijingbiji.com/2100/)

* ORDER BY 处理相同值的数据时，服务器会以任意顺序返回。当 ORDER BY 与 LIMIT 一起用时，可能会影响总体的执行计划，从而导致返回的顺序不一样。比如：    

  ```sql
  SELECT * FROM users WHERE user_id = 3 ORDER BY create_at DESC LIMIT 2,10;
  SELECT * FROM users WHERE user_id = 3 ORDER BY create_at DESC LIMIT 3,10;
  ```

* 一般数据库都会专门有一个库来保存用户创建的数据库/表信息。比如，在Mysql的`infomation_schema`库中保存了所有的数据库/表信息，可以通过提供的视图来查看`tabale`信息和`column`信息：    

  ```sql
  SELECT c.TABLE_NAME, c.COLUMN_NAME, c.COLUMN_TYPE, c.COLUMN_COMMENT
  FROM INFORMATION_SCHEMA.Columns c
  WHERE c.`TABLE_SCHEMA` = 'database_name'
    AND c.TABLE_NAME = 'table_name'
  ```

* 单表继承和多态关联

* SQL中的`in`查询需要注意长度

* 在`MYSQL8`中，窗口函数可以在不减少原表的行数的前提下进行分组和排序：

  ```
  <窗口函数> over (partition by <用于分组的列名>
                  order by <用于排序的列名>)
  ```
  
* 目前的绝大部分数据库都支持生成列（Generated Column）的语法，生成列是在存储时计算并存储结果，因此可以在查询中直接引用生成列，而不需要额外的计算开销，并且支持在生成列上创建索引。

  ```mysql
  CREATE TABLE mytable (
    id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(100) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) VIRTUAL,
    INDEX idx_full_name (full_name)
  );
  ```

  ```mysql
  ALTER TABLE mytable
  	ADD COLUMN full_name VARCHAR(128) GENERATED ALWAYS AS (IFNULL(JSON_UNQUOTE(JSON_EXTRACT(customer_info, '$.openid')), '')) VIRTUAL,
  	ADD INDEX idx_openid (openid);
  ```

* 与生成列相关的还有虚拟列（Virtual Column），虚拟列在表中并不实际存储数据，它只是在查询时计算并返回结果。
  ```mysql
  CREATE TABLE example (
      id INT,
      data JSON,
      virtual_col INT AS (JSON_EXTRACT(data, '$.value')) VIRTUAL
  );
  ```

* 关于JSON的一些SQL
  ```sql
  UPDATE person p
  SET p.rule=JSON_SET(p.rule, '$.info.age',
  						  CAST(p.rule -> '$.info.age' - 10 AS UNSIGNED))
  WHERE p.id = 1
    AND (p.rule -> '$.info.age' - 10) >= 0;
  ```

* 在`ORDER BY`中，可以利用`CASE WHEN`或者`IF`来对某个列进行指定值的排序， 比如希望将18岁的人优先展示：
  ```sql
  ORDER BY IF(age = 18, 0, 1) DESC;
  ```
  
* 通过一个冗余表去做某些操作的幂等。比如有一个操作需要幂等，请求时携带一个`request_no`，且一次请求可能会入库多条记录。我们可以创建一个冗余表，比如叫`record_idempotent`其中就一个主键`request_no`。另外有一个记录表`record`记录实际的业务信息同时也需要有`request_no`用于幂等返回，但在`record`表中`request_no`并不是唯一键。也就是说`record_idempotent.request_no`用于做并发写入，`record.request_no`用于幂等返回。
  执行操作时，在一个事务里向`record_idempotent`插入数据，同时插入一条或者多条`record`记录。如果存在并发则后插入的数据因为`record_idempotent`表的唯一键抛出错误而回滚。
  但是在执行插入数据之前，应当先在`record`中根据`request_no`查询是否存在，以保证幂等返回。
  
* MySQL在`ORDER BY`进行排序时，通常还需要判断是否符合`WHERE`条件。所以某种意义上只要进行了排序，就需要对数据进行全部扫描才能保证排序的准确，这种情形就是`Using filesort`。
  由于索引是自带排序的，所以就会有一种特殊的情况，即排序的字段被索引字段全包含。此时MySQL就不再需要对数据进行全部扫描。
  
* 关联表可以减少数据写操作，但会增加读数据的负担。减轻读数据的负担可以考虑不使用关联表，通过冗余的数据以及在写操作时的预先处理，减轻数据库读操作的负担。

* 如下语法可以将查询出来的SQL直接插入数据表
  ```sql
  INSERT INTO target_table (column1, column2, column3, ...)
  SELECT column1, column2, column3, ...
  FROM source_table
  WHERE condition;
  ```

* `INSERT INTO`通过`IGNORE`关键字可以忽略掉插入时遇到的主键重复错误：

  ```sql
  INSERT IGNORE INTO target_table (column1, column2, column3, ...)
  ```

* 对于设置了自增主键的表，如果频繁使用`INSERT INTO ... ON DUPLICATE KEY UPDATE`刷新数据，可能会带来的主键增长过快的问题。假如在应用中使用`int`类型的字段来接收主键，其能允许的最大值为`2147483647`，有可能会溢出。同时由于设置数据库表的`AUTO_INCREMENT` 的起始值只能是大于或等于当前表中已有数据的最大值。因此没有办法在原表内重置`AUTO_INCREMENT`，可以将现存数据通过`INSERT INTO`的方式，带上主键值，迁移到新表，以达到重置`AUTO_INCREMENT`的目的。

* MYSQL使用`JSON_EXTRACT()`和`->`的方式取JSON字段里的字符串值都会带有引号，如果希望取出的值不带引号，可以使用`->>`来取。在对某JSON字段中的字符串变量进行替换时尤其需要注意使用`->>`来避免`JSON_REPLACE`时的转义：
  ```sql
  SET @json = '{"name": "John", "age": 30}';
  SELECT @json->'$.name';  -- 结果: "John"（注意字符串值包含双引号）
  SELECT @json->>'$.name';  -- 结果: John（字符串值，不包含双引号）
  ```

* `DELETE`语句也可以通过连表查询来筛选条件：

  ```sql
  DELETE a
  FROM a
  INNER JOIN b ON a.b_id = b.id
  WHERE b.name = 'zhangsan'
  ```

* 在Mysql中，`DATETIME`类型不会保存毫秒值，会根据毫秒四舍五入设置时间。因此可能会造成存入的时间和实际落库的时间不一致的情况。

* 通过数据库事务保证mq消息的一致性
  ```
  1、开启事务
  2、执行业务操作
  3、向消息表插入消息行
  4、事务提交
  5、推送成功后（或者推送消息并收到成功的回应后）删除消息
  6、定时扫描未发送消息并补偿消息
  ```

* 在一条UPDATE的SQL语句中，某列同时被更新和作为条件，不同的顺序会有影响，比如：

  ```sql
  UPDATE user
  SET age= IF(id == 2, 10, 20),id = 1	// 执行后age=20
  WHERE id = 2;
  
  UPDATE user
  SET id = 1,age= IF(id == 2, 10, 20)	// 执行后age=10
  WHERE id = 2;
  ```

* 在A OR B的条件查询中，如果有建立索引，A条件和B条件都是会走到索引的。

* 可以利用`case when`来实现对某列数据值范围的分组，比如：

  ```sql
  SELECT  COUNT(*) as '请求数量', CASE
  	WHEN request_duration > 0 THEN '0-0.01'
  	WHEN request_duration > 0.01 THEN '0.01-0.1'
  	ELSE '其他' END as '请求时间段'
  FROM log
  GROUP BY CASE
  	WHEN request_duration > 0 THEN '0-0.01'
  	WHEN request_duration > 0.01 THEN '0.01-0.1'
  	ELSE '其他' END
  ```

* 可以通过如下语句来查询某个表的列信息：

  ```sql
  show full columns from `table_name`
  ```

* 在一些数据量较大的分页查询中，在查询偏后的数据时（比如`limit 1000000,10`）往往会因为需要对前面1000000条数据进行筛选排序等操作而较慢。所以可以采用有序列做游标的方式来进行查询（通常是pk），比如：
  ```sql
  SELECT *
  FROM test_page t
  WHERE id > 0
    AND updated_at BETWEEN '2024-07-17' AND '2024-07-18'
  ORDER BY created_at ASC, id ASC
  LIMIT 10
  ```

  在这个sql通常会由于id是主键，MySQL的解释器会走到主键索引。但如果数据量较大的情况下，会导致不必要的行扫描从而降低效率。一般情况下我们都需要对数据表中的`created_at`和`updated_at`两个字段添加索引，因此在这种情况下我们可以强制走`updated_at`的索引：

  ```sql
  SELECT *
  FROM test_page t
  FORCE INDEX(idex_updated_at)
  WHERE id > 0
    AND updated_at BETWEEN '2024-07-17' AND '2024-07-18'
  ORDER BY created_at ASC, id ASC
  LIMIT 10
  ```

* `show processlist`可以查看当前执行的SQL进程，并且可以使用`kill [ProcessId]`来停止正在执行的进程。

* 驱动表（Driving Table）指在多表连接（JOIN）操作中，优化器选择作为扫描基础的那张表。例如，如果一个表的数据量非常大，而另一个表的数据量较小且有高效的索引，优化器通常会选择较小的表作为驱动表。可以通过`STRAIGHT_JOIN`强制选择驱动表，比如：

  ```sql
  SELECT * FROM customers
  STRAIGHT_JOIN orders ON customers.id = orders.customer_id
  WHERE customers.region = 'North America';
  ```

  并且通常`LEFT JOIN`查询左表将会作为驱动表，但在某些特殊情况或特定的查询优化策略下，可能会有不同的执行计划。例如，如果右表非常小且完全可以加载到内存中，而左表非常大，则优化器可能会考虑先扫描右表。然而，这种情况比较少见，大多数情况下 `LEFT JOIN` 的执行都是以左表为驱动表开始的。并且目前没有办法直接判断SQL执行使用那一个表作为驱动表，只能通过`EXPLAIN`来大致推测为是查询中第一个被处理的表，这在 `EXPLAIN` 的输出中通常是 `type` 列显示最优访问方法（非 "ALL"）的表，或者是 `id` 值最小的一行。

  **在实践中，对于任何复杂的或性能敏感的查询，定期运行 `EXPLAIN` 并分析其输出应成为常规维护任务的一部分。**
  
* MySQL从8.0.12.版本开始支持online DDL，以减少一些DDL语句的锁表操作，通常情况下online DDL 是默认的，我们不需要关心MySQL具体做了什么。在我们有明确的需求的情况下可以通过子语句设置不同的更新表策略。
  比如下面这条语句通过设置`ALGORITHM=INPLACE`让MySQL在原表上进行添加索引，并且通过`LOCK=NONE`设置在更新过程中允许对数据表进行读写操作：

  ```sql
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  `ALGORITHM`对应有三个不同的算法选项分别是： 

  `ALGORITHM=COPY`：MySQL 会创建原表的一个完整拷贝，并在这个拷贝上应用结构变更。在变更完成后，MySQL 将新表替换旧表（这将产生大量的IO和磁盘使用）。
  `ALGORITHM=INPLACE`：允许 MySQL 尽可能在原表上直接进行更改，而不是复制整个表，但在修改过程中仍可能需要对表加锁。
  `ALGORITHM=INSTANT`：允许对表结构进行即时更改，没有锁表，几乎不影响表的使用。
  在需要锁表的情况下，可以添加子语句`LOCK`。`LOCK`也有三个选项：`NONE`, `SHARED`（只读）, `EXCLUSIVE`。

  对于不同的DDL语句（比如修改列，修改索引等），可设置的`ALGORITHM`和`LOCK`都有一定的限制，非法的参数可能会返回错误。比如：
  ```sql
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

  具体的DDL所执行的默认策略可以通过[MySQL文档查看](https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html)。
  
* 一种库内搜索任意表列名的方法：
  
  ```sql
  SELECT c.TABLE_SCHEMA, c.TABLE_NAME, c.COLUMN_NAME
  FROM information_schema.COLUMNS c
  JOIN information_schema.TABLES t ON c.TABLE_NAME = t.TABLE_NAME AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
  WHERE c.TABLE_SCHEMA = 'DATABASE_NAME' 
  AND t.TABLE_ROWS > 1000000 and COLUMN_NAME LIKE '%COLUMN_NAME%'
  ```
  
* 对于MySQL，像`\n`，`\t`，`"`，`\`等特殊字符在插入或者查询的的时候需要进行转义：
  ```sql
  mysql> INSERT INTO `demo` (`id`, `text`) VALUES (1, '1:\ 2:\\ 3:\\\ 4:\\\\ ');
  mysql> INSERT INTO `demo` (`id`, `text`) VALUES (2, '\\\\');
  mysql> SELECT * FROM demo WHERE text = '\\\\'; /* 注意这里是用的'='进行比较 */
  +----+-----------------------+
  | id | text                  |
  +----+-----------------------+
  |  2 | \\                    |
  +----+-----------------------+
  ```

  以上的转义来自于MySQL的语法解析器解析的时候进行的转义，当使用`LIKE`进行条件查询时，`LIKE`语句还会进行一次转义。比如：
  ```sql
  mysql> SELECT * FROM demo WHERE text LIKE '%\\\\\\\\\\\\\\\\%'; /* 16个\ */
  +----+-----------------------+
  | id | text                  |
  +----+-----------------------+
  |  1 | 1: 2:\ 3:\ 4:\\       |
  +----+-----------------------+
  ```

  如下是一个刷新转义的例子：
  
  ```sql
  UPDATE demo
  SET text = REPLACE(REPLACE(REPLACE(text, '\\"', ''), '\\\\n', '\\n'), '\\\\t', '\\t')
  WHERE text LIKE '%\\\\"%'
  ```
  
  
