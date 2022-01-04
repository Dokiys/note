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

所以`preload`并不能给查询的关联对象进行条件查询，但这并不代表`includes`不能进行条件查询

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



## 多态&STI

### STI

通常一张表对应一个类，如果两个表几乎一摸一样，则可以使用`STI(Singel Table Inheritance)单表继承`，即将一张表可以通过继承的方式，提供给多给类使用。

例如我想使用`animals`表，同时保存`Cat`和`Duck`便可以使用rails提供的保留column`type` 来实现`SIT`:

```ruby
class CreateAnimals < ActiveRecord::Migration
  create_table :animals do |t|
    t.string :type	# type 为rails保留的字段，用于实现SIT
  	t.integer :foot
  end
end
```

```ruby
# 定义基础类
class Animal < ActiveRecord::Base
	def who_am_i
  	p "I am a #{type}"
  end
end
```

```ruby
# Cat子类
class Cat < Animal
	def miaomiao
    p "miaomiao"
  end
end

# Duck子类
class Duck < Animal 
	def gaga
    p "gaga"
  end
end
```

```ruby
tomcat = Cat.create!(name: "Tom", foot:4)
donald = Duck.create!(name: "Donald", foot:2)
animal = Animal.create!(name:'animal', foot: nil)

tomcat.who_am_i # => "I am a Cat"
tomcat.miaomiao # => "miaomiao"

donald.who_am_i # => "I am a Duck"
donald.gaga 	# => "gaga"

animal.who_am_i # => "I am a Animal"
animal.type   # => nil
```

### 多态

当某个对象时可以同时属于多个对象同时可以使用多态关联。同时需要制定所属表的主键，和类型。

例如，一只唐老鸭可以有很多`foods`，一只tomcat也可以有很多`foods`。可以创建`foods`表如下：

```ruby
class CreateFoods < ActiveRecord::Migration
  create_table :foods do |t|
    t.string :name	
  	t.bigint :owner_id			# 所属对象id
    t.string :owner_type		# 所属对象类型
  end
end
```

```ruby
# 定义食物类
class Foods < ActiveRecord::Base
  belongs_to :owner, polymorphic: true
end
```

```ruby
# 添加关联关系
class Cat < ActiveRecord::Base
  has_many :foods, as: :owner
end
class Duck < ActiveRecord::Base
  has_many :foods, as: :owner
end
```

```ruby
fish = Food.create!(name:'fish')
Cat.foods = [fish]
```

每个人都可以有很多唐老鸭和tomcat，唐老鸭和tomcat也属于每一个人，即一个多对多的关系。我们也可以将`foods`作为中间表，将动物和人做多对多关联。

```ruby
class CreateUser < ActiveRecord::Migration
  create_table :user do |t|
    t.string :name
  end
  
  add_column :foods, :user_id, :bigint
end
```

```ruby
class Foods < ActiveRecord::Base
  belongs_to :user
  belongs_to :owner, polymorphic: true
end
class User < ActiveRecord::Base
  has_many :foods
  has_many :cats, through: :foods, :source => :owner, :source_type => Cats.name
  has_many :ducks, through: :foods, :source => :owner, :source_type => Ducks.name
end
```





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



## 执行SQL

```ruby
ActiveRecord::Base.connection.execute("SELECT * FROM users WHERE id = 1")
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



## Rake Task

通过`Rails`生成`task`

```bash
 > rails generate task my_namespace mytask1 mytask2
```

执行后会生成文件`lib/tasks/my_namespace.rake`。其内容如下：

```ruby
namespace :my_namespace do
  desc "TODO"
  task mytask1: :environment do
  end

  desc "TODO"
  task mytask2: :environment do
  end

end
```

修改内容：

```ruby
desc "Hello work！"
task mytask1: :environment do
  p "Hello work!!"
end
```

执行：

```bash
> rake my_namespace:mytask1
"Hello work!!"
```



## RSpec Rails

`ActionController::TestCase::ActiveSupport::TestCase`

```ruby
require 'rails_helper'

RSpec.describe Api::SchoolsController, type: :controller do
  render_views

  # 1.获取学校以及课程列表
  describe 'GET #index' do
    it 'responds successfully with an Status 20000 code' do

      user = User.first
      user_session_key, token = login_user!(user)

      params = {
        format: :json,
        access_token: token,
        user_session_key: user_session_key,
        page: '1',
        per: '6'
      }
      get :index, params
      p '************************************************************************'
      p JSON.parse(response.body)
      p '************************************************************************'
      code = JSON.parse(response.body)['status']['code']
      expect_success(code)

      get_result = JSON.parse(response.body)['data']['schools']
      schools = School.all
      expect_result = JSON.parse(ApplicationController.render(
          template: 'api/schools/index',
          assigns: { schools: schools }
      ))['data']['schools']
      expect(get_result == expect_result).to eq(true)
    end
  end
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

### 外键关联

```ruby
has_many :order_items, :class_name => 'OrderItem', primary_key: :tid, foreign_key: :tid
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



## 查询删除数据

 ```ruby
 OpenPlatform.unscoped.last
#	<OpenPlatform:0x00007fa38c384ca8> {
# 	           :id => 1,
#   	     :openid => "orufdasdfasdfjkljzg",
#     	  :unionid => nil,
#     	 :platform => "weapp",
#     	 :app_name => 'aa_assistant',
#     	  :user_id => 2518,
#	   	 :created_at => Fri, 26 Mar 2021 11:42:53 CST +08:00,
# 	   :updated_at => Fri, 26 Mar 2021 11:46:32 CST +08:00,
#   	 :deleted_at => Fri, 26 Mar 2021 11:46:32 CST +08:00
#	}
 ```



## 复制一个Record

```ruby
#rails >= 3.1
new_record = old_record.dup
```



## 迁移限制字符串长度

```ruby
change_column :users, :login, :string, :limit => 55
```



## 迁移默认值

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

