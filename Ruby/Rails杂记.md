# Rails

## 关联查询

在ActiveRecord中提供了`joins`和`includes`方法来处理查询关联的`model`

两种方法最大的区别在于

* `joins`的查询语句采用的是`INNER JOIN`来链接查询
* `includes`采用的是`LEFT OUTER JOIN`**或**通过多条语句查询



### joins

`joins`方法采用懒加载，即只有在使用到关联对象中的值时才会对调用的表进行加载：

```bash
[1] pry(main)> item = item.joins(:order).last
...
[2] pry(main)> item.order
  Order Load (8.8ms)  SELECT  "orders".* FROM "orders" WHERE "orders"."id" = $1 LIMIT $2 
```

由于`joins`采用懒加载机制，就会存在N+1问题

常见的情况例如，在`joins`查询后遍历获取关联对象的值：

```ruby
Post.joins(:comments).where(:comments => {author: 'Derek'}).map { |post| post.comments.size }
```

```bash
  Post Load (1.2ms)  SELECT  "posts".* FROM "posts" INNER JOIN "comments" ON "comments"."post_id" = "posts"."id" WHERE "comments"."author" = $1
   (1.0ms)  SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = $1
   (3.0ms)  SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = $1
   (0.3ms)  SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = $1
   (1.0ms)  SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = $1
   (2.1ms)  SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = $1
   (1.4ms)  SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = $1
=> [3,5,2,4,2,1]
```

我们可以在`joins`查询中`select`需要查询的值来(1)缩小范围以及(2)提前加载关联查询的指定字段，以防止在使用关联对象相关属性时再次查询

需要注意的是，对关联对象`:visa_counsellor`选择查询结果时，需要使用关联对象的表名：

```ruby
# 这里的order 即对应order表
Item.joins(:order).select('order.title').last
```

```bash
SELECT orders.title FROM "items" INNER JOIN "orders" ON "orders"."id" = "items"."order_id" ORDER BY "items"."id" DESC LIMIT $1 
```

如果需要获取的是关联对象整个类而不是指定的字段，可以使用`ActiveRecord`的`includes`方法来提前加载关联对象。

在`joins`方法的源码注释中可以看到更多关联的例子：

```ruby
# Performs a joins on +args+. The given symbol(s) should match the name of
# the association(s).
#
#   User.joins(:posts)
#   # SELECT "users".*
#   # FROM "users"
#   # INNER JOIN "posts" ON "posts"."user_id" = "users"."id"
#
# Multiple joins:
#
#   User.joins(:posts, :account)
#   # SELECT "users".*
#   # FROM "users"
#   # INNER JOIN "posts" ON "posts"."user_id" = "users"."id"
#   # INNER JOIN "accounts" ON "accounts"."id" = "users"."account_id"
#
# Nested joins:
#
#   User.joins(posts: [:comments])
#   # SELECT "users".*
#   # FROM "users"
#   # INNER JOIN "posts" ON "posts"."user_id" = "users"."id"
#   # INNER JOIN "comments" "comments_posts"
#   #   ON "comments_posts"."post_id" = "posts"."id"
#
# You can use strings in order to customize your joins:
#
#   User.joins("LEFT JOIN bookmarks ON bookmarks.bookmarkable_type = 'Post' AND bookmarks.user_id = users.id")
#   # SELECT "users".* FROM "users" LEFT JOIN bookmarks ON bookmarks.bookmarkable_type = 'Post' AND bookmarks.user_id = users.id
```



### includes

`includes`方法可以提前将关联对象加载，关联对象的**所有数据**将会被保存在相应的`ActiveRecord`中

所有在使用`includes`方法时并不能指定需要选择的值，只能查询(1)调用对象的所有属性以及(2)所有以参数传入的关联对象的所有属性：

```bash
[1] pry(main)>visa = StudentVisa.includes(:visa_counsellor).last
...
[2] pry(main)> visa.visa_counsellor
#<User:0x00007fb6aecf6220> {
                               :id => 2,
                         :username => "aa_admin",
                           :gender => "male",
                           :status => "active",
                             :post => "admin",
                           ...
```

`includes`的默认查询方法是`preload`，即通过一条附加的查询语句来加载关联数据：

```ruby
Post.includes(:comments).map { |post| post.comments.size }
```

```bash
Post Load (1.2ms)  SELECT  "posts".* FROM "posts"
Comment Load (2.0ms)  SELECT "comments".* FROM "comments" WHERE "comments"."post_id" IN (1, 3, 4, 5, 6)
=> [3,5,2,4,2,1]
```

由于`preload`采用第一条语句查询到调用的`ActiveRecord`的结果，再用关联的外键来查询关联对象的结果

所有`preload`并不能给查询的关联对象进行条件查询，但这并不代表`includes`不能进行条件查询

当`includes`使用`where`筛选数据时或者`order`进行排序时，会调用另一个方法`eager_load`，通过 LEFT OUTER JOIN 来进行关联查询：

```ruby
User.eager_load(:posts).to_a
# =>
SELECT "users"."id" AS t0_r0, "users"."name" AS t0_r1, "posts"."id" AS t1_r0,
       "posts"."title" AS t1_r1, "posts"."user_id" AS t1_r2, "posts"."desc" AS t1_r3
FROM "users" LEFT OUTER JOIN "posts" ON "posts"."user_id" = "users"."id"
```

或者可以通过`references`方法来指定使用 LEFT OUTER JOIN 方法来查询结果：

```ruby
User.includes(:posts).references(:posts)
```



参考资料

* [《Making sense of ActiveRecord joins, includes, preload, and eager_load》](https://scoutapm.com/blog/activerecord-includes-vs-joins-vs-preload-vs-eager_load-when-and-where) 
* [《rails 中 preload、includes、Eager load、Joins 的区别》](https://blog.csdn.net/weixin_30301183/article/details/96068446?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.nonecase)



## 不常用方法

```ruby
Student.none.class
# => Student::ActiveRecord_Relation < ActiveRecord::Relation
StudentVisa.name.tableize
"student_visas"

''.presence || false
# => false
```



## console

查看当前迁移版本：

```ruby
# Rails 5.2
ApplicationRecord.connection.migration_context.current_version
ApplicationRecord.connection.migration_context.get_all_versions

# Rails 5.1.7
ActiveRecord::Migrator.current_version
ActiveRecord::Migrator.get_all_versions
```



## Rails 中的安全存取

```ruby
[1] pry(main)> params = {user: 2}
{
    :user => 2
}
[2] pry(main)> params[:search]
nil
# parmas[:search].present? => NoMethodError: undefined method for nil:NilClass
[3] pry(main)> params[:search] ||= {}
{}
[4] pry(main)> params[:search].present?
false
[5] pry(main)> "zhangsan".presence
"zhangsan"
[6] pry(main)> params[:search].nil?
false
[7] pry(main)> params[:search].blank?
true

```



## 空检查

表格内容摘自[《empty？blank？nil？傻傻分不清楚》](http://sibevin.github.io/posts/2014-11-11-103928-rails-empty-vs-blank-vs-nil)

| Method      | nil?    | if()    | empty?                | any?            | blank?     | present=!blank? |
| ----------- | ------- | ------- | --------------------- | --------------- | ---------- | --------------- |
| Scope       | ruby    |         |                       |                 | rails only |                 |
| `Object`    | `all`   |         | `String, Array, Hash` | `Enumerable`    | `all`      |                 |
| `nil`       | `true`  | `false` | `NoMethodError`       | `NoMethodError` | `true`     | `false`         |
| `false`     | `false` | `false` | `NoMethodError`       | `NoMethodError` | `true`     | `false`         |
| `true`      | `false` | `true`  | `NoMethodError`       | `NoMethodError` | `false`    | `true`          |
| `0`         | `false` | `true`  | `NoMethodError`       | `NoMethodError` | `false`    | `true`          |
| `1`         | `false` | `true`  | `NoMethodError`       | `NoMethodError` | `false`    | `true`          |
| `""`        | `false` | `true`  | `true`                | `NoMethodError` | `true`     | `false`         |
| `" "`       | `false` | `true`  | `false`               | `NoMethodError` | `true`     | `false`         |
| `[]`        | `false` | `true`  | `true`                | `false`         | `true`     | `false`         |
| `[nil]`     | `false` | `true`  | `false`               | `false`         | `false`    | `true`          |
| `{}`        | `false` | `true`  | `true`                | `false`         | `true`     | `false`         |
| `{ a:nil }` | `false` | `true`  | `false`               | `true`          | `false`    | `true`          |
| `[[],[]]`   | `false` | `true`  | `false`               | `true`          | `false`    | `true`          |



## 调用环境：

```ruby
# 在 action_controller 环境中执行 wrap_paramters
ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: [:json] if respond_to?(:wrap_parameters)
end
```



## `Arel`

```ruby
relation = RewardPolicy.where(:id => 27, :seq => 2)
# a = relation.arel
connection = ActiveRecord::Base.connection
b = connection.combine_bind_parameters( where_clause: relation.where_clause.binds )
result = connection.exec_params(relation.where_sql, connection.type_casted_bind(b))
connection.exec_no_cache(relation.where_sql),
# table = Arel::Table.new(:reward_policies)
# sql = connection.to_sql(relation)
p result
# # c = Arel::Nodes::And.new(a.constraints).to_sql(Arel::Table.engine)
# c = Arel::Nodes::SqlLiteral.new("WHERE #{Arel::Nodes::And.new(a.constraints).to_sql(Arel::Table.engine)}")
# # b = a.where_sql
collector = connection.collector()
# # sql, binds = connection.visitor.compile(b)
collected = connection.visitor.accept(a, collector)
result = collected.compile(b.dup, connection)

# connection.to_sql(c, b)
# sql,b,c = connection.to_sql_and_binds(a, [], nil)
# sql, binds, preparable = ActiveRecord::Base.connection.select_all(a, "SQL")
# sql, binds, preparable = to_sql_and_binds(a, [], nil)
# b = a.where_sql
# c = a.constraints
# Arel::Visitors::ToSql.new(self)
# collector = Arel::Collectors::SQLString.new
```



## 事务嵌套

为了保证一个子事务的 rollback 被父事务知晓，必须手动在子事务中添加 :require_new => true 选项。比如下面的写法：

```ruby
User.transaction do
  User.create(:username => 'Kotori')
  User.transaction(:requires_new => true) do
    User.create(:username => 'Nemu')
    raise ActiveRecord::Rollback
  end
end
```



