

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
