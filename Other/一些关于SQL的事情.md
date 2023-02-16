

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
  SELECT * FROM users where user_id = 3 order by create_at desc LIMIT 2,10;
  SELECT * FROM users where user_id = 3 order by create_at desc LIMIT 3,10;
  ```

* 一般数据库都会专门有一个库来保存用户创建的数据库/表信息。比如，在Mysql的`infomation_schema`库中保存了所有的数据库/表信息，可以通过提供的视图来查看`tabale`信息和`column`信息：    

  ```sql
  select c.TABLE_NAME, c.COLUMN_NAME, c.COLUMN_TYPE, c.COLUMN_COMMENT
  from INFORMATION_SCHEMA.Columns c
  WHERE c.`TABLE_SCHEMA` = 'database_name'
    and c.TABLE_NAME = 'table_name'
  ```

* 单表继承和多态关联
