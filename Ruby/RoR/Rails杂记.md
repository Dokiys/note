# Rails

## 关联查询

在ActiveRecord中提供了四种方法来处理查询关联的`model`

* `preload`条件查询当前`model`，并将结果作为查询条件去查询关联对象（不能对关联对象设置查询条件）
* `eager_load`使用`LEFT OUTER JOIN`通过一条SQL语句将所有关联对象查询出来
* `includes`会根据查询条件采用`preload`或者`eager_load`来查询记录
* `joins`的查询语句采用的是`INNER JOIN`来链接查询



### includes

`includes`方法可以提前将关联对象加载，关联对象的**所有数据**将会被保存在相应的`ActiveRecord`中

所有在使用`includes`方法时并不能指定需要选择的值，只能查询调用对象的所有属性以及所有以参数传入的关联对象的所有属性：

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

当`includes`使用`where`筛选**关联对象**数据时或者`order`进行排序时，会调用另一个方法`eager_load`，使用` LEFT OUTER JOIN` 生成一条SQL语句进行查询：

```ruby
User.eager_load(:posts).to_a
# =>
SELECT "users"."id" AS t0_r0, "users"."name" AS t0_r1, "posts"."id" AS t1_r0,
       "posts"."title" AS t1_r1, "posts"."user_id" AS t1_r2, "posts"."desc" AS t1_r3
FROM "users" LEFT OUTER JOIN "posts" ON "posts"."user_id" = "users"."id"
```

或者也可以通过`references`方法来指定使用` LEFT OUTER JOIN` 生成一条SQL语句查询结果：

```ruby
User.includes(:posts).references(:posts)
# =>
SELECT "users"."id" AS t0_r0, "users"."name" AS t0_r1, "posts"."id" AS t1_r0,
       "posts"."title" AS t1_r1, "posts"."user_id" AS t1_r2, "posts"."desc" AS t1_r3
FROM "users" LEFT OUTER JOIN "posts" ON "posts"."user_id" = "users"."id"
```



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

我们可以在`joins`查询中`select`需要查询的值来缩小范围以及提前加载关联查询的指定字段，以防止在使用关联对象相关属性时再次查询

需要注意的是，对关联对象`:visa_counsellor`选择查询结果时，需要使用关联对象的表名：

```ruby
# 这里的order 即对应order表
Item.joins(:order).select('orders.title').last
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



### 参考资料

* [《Making sense of ActiveRecord joins, includes, preload, and eager_load》](https://scoutapm.com/blog/activerecord-includes-vs-joins-vs-preload-vs-eager_load-when-and-where) 
* [《Preload, Eagerload, Includes and Joins》](https://bigbinary.com/blog/preload-vs-eager-load-vs-joins-vs-includes)



## 类名转换

```ruby
# 类名转表名
Student.none.class
# => Student::ActiveRecord_Relation < ActiveRecord::Relation
StudentVisa.name.tableize
"student_visas"

# 驼峰转蛇形
"CamelCasedName".underscore
# => camel_cased_name

# 蛇形转驼峰
"camel_cased_name".camelize
# => CamelCasedName

# 复数
'person'.pluralize
# => "people"
```



## 查看迁移版本

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

非空获取

```ruby
''.presence || false
# => false
```



## 调用环境

```ruby
# 在 action_controller 环境中执行 wrap_paramters
ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: [:json] if respond_to?(:wrap_parameters)
end
```



## batch_update

记一个bug

```ruby
# obj.tap {|x| block }    -> obj
# 
# Yields self to the block, and then returns self.
# The primary purpose of this method is to "tap into" a method chain,
# in order to perform operations on intermediate results within the chain.
# 
#    (1..10)                  .tap {|x| puts "original: #{x}" }
#      .to_a                  .tap {|x| puts "array:    #{x}" }
#      .select {|x| x.even? } .tap {|x| puts "evens:    #{x}" }
#      .map {|x| x*x }        .tap {|x| puts "squares:  #{x}" }
def tap
  # This is a stub implementation, used for type inference (actual method behavior may differ)
  yield self; self
end
```

`tap`会改变`self`

 ```ruby
_attrs = self.attribute_names.tap { |e| e.delete self.primary_key }
# => 会改变 self 中的 @attribute_names 值，应该使用拷贝值删减
_attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }
 ```

**一定要注意对底层属性的更改操作，最好使用拷贝对象**



### V1

```ruby
# Batch update <tt>ApplicationRecord</tt> with single SQL
# +params+ will be filtered by current <tt>ApplicationRecord</tt>.attributes(except primary key)
def batch_update_v2(params, relation, allow_nil = false)
  transaction do
    # Build condition by relation
    where_sql = relation.try(:where_sql) || raise(StandardError.new("Illegal parameter: #{relation}"))
    binds = relation.where_clause.binds

    # Build update columns
    params = _check_nil(params, allow_nil)
    t = self.table_name.freeze
    column_sql = (params.map { |k, v| "\"#{k}\" = " + (v.present? ? "'#{v}'" : "NULL") }).join(", ")

    # Execute SQL
    sql = <<~SQL
    UPDATE #{t} SET updated_at = NOW(), #{column_sql} #{where_sql}
    SQL
    ActiveRecord::Base.connection.exec_query(sql, 'SQL', binds)
    raise StandardError.new(sql)
  end
end

# Return params with current <tt>ApplicationRecord</tt> attribute_names(except primary key).
# If allow_nil is +true+ ,passes +nil+ value in params,
# raise Error if no columns passed
def _check_nil(params, allow_nil = false)
  _attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }

  block = "lambda { |_k, _v| (_attrs.include? _k.to_s) " + (allow_nil ? "" : "&& _v.present? ") + "}"
  params.select! &eval(block)
  params.present? ? params : raise(StandardError.new("No columns to update!"))
end
```



### V2

```ruby
# Batch update <tt>ApplicationRecord</tt> by <tt>ActionController::Parameters</tt>
# The +params+ will be filtered through all attributes(except primary key) in <tt>ApplicationRecord</tt>
# And will do nothing for blank attributes in params unless +allow_nil+ is +true+
def batch_update(params, allow_nil = false)
  ids = params.delete(:ids)

  params = _check_nil(params, allow_nil)
  self.where(:id => ids).update_all(params)
end

def _check_nil(params, allow_nil: false)
  _attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }

  block = "lambda { |_k, _v| (_attrs.include? _k.to_s) #{allow_nil ? "" : "&& _v.present?"}"
  params.select! &eval(block)
  params.present? ? params.symbolize_keys : raise(StandardError, "No columns to update!")
end
```



### V3

```ruby
def base_update(params, allow_nil = false)
  transaction do
    ids = params.require(:ids)
    attrs = HashWithIndifferentAccess.new(check_nil(params, allow_nil))

    self.where(id: ids).update_all(attrs)
  end
end

# Return params with current <tt>ApplicationRecord</tt> attribute_names(except primary key).
# if allow_nil is +true+ ,passes blank value in params
def check_nil(params, allow_nil = false)
  params = permit_attr!(params, primary_key)
  params.reject { |_k, v| v.blank? } unless allow_nil == true

  params
end

# Return +params+ instance that include only record attributes
# and except given +args+ , no attributes permitted return {}
def permit_attr(params, *args)
  permit_attr!(params, args) rescue nil
end

# Performance as +permit_attr+, but raise error while illegal +params+
def permit_attr!(params, *args)
  params.permit(attribute_names - args.map(&:to_s))
end
```



### `Arel`

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

设置事务隔离级别：

```ruby
transaction isolation: :repeatable_read do
	# do something...
end
```



## PSQL

### 数组查询

[Array Functions and Operators](https://www.postgresql.org/docs/8.2/functions-array.html)

```ruby
School.where("school_type && ?","{group_pathway}").to_sql
# => "SELECT \"schools\".* FROM \"schools\" WHERE \"schools\".\"deleted_at\" IS NULL AND (school_type && '{group_pathway}')"
```

### 查询索引

```sql
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE  schemaname = 'public'
ORDER BY tablename,  indexname;
```

### 添加索引

```ruby
add_index :attachments, [:status, :is_view, :parent_id, :owner_id],
	name: 'atch_com_idx',
	order:{is_view: :desc, owner_id: :asc}
```





## 不更新updated_at

```ruby
ActiveRecord::Base.record_timestamps = false
begin
  run_the_code_that_imports_the_data
ensure
  ActiveRecord::Base.record_timestamps = true  # don't forget to enable it again!
end
```

```ruby
>> user.updated_at
=> Wed, 16 Mar 2016 09:15:30 UTC +00:00

>> user.name = "Dan"
>> user.save(touch: false)
  UPDATE "users" SET "name" = ? WHERE "users"."id" = ?  [["name", "Dan"], ["id", 12]]
=> true

>> user.updated_at
=> Wed, 16 Mar 2016 09:15:30 UTC +00:00
```



## 迁移限制字符串长度

```ruby
change_column :users, :login, :string, :limit => 55s
```



## 迁移设置值

利用迁移设置默认值和初始值：

```ruby
class AddSomethingToMyModule < ActiveRecord::Migration[5.0]
  def up
    add_column :my_modules, :something, :string, default: 'default_value'
    change_column_default :my_modules, :something, nil
  end

  def down
    remove_column :my_modules, :something
  end
  
  # 迁移中也可执行sql
  # def down
  #   execute <<-SQL
  #     DROP INDEX IF EXISTS index_products_on_category_id_and_name_and_tags;
  #     DROP FUNCTION IF EXISTS sort_array(unsorted_array anyarray);
  #   SQL
  # end
end
```

