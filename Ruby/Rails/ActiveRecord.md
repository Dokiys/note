# ActiveRecord基础

***

Active Record 是 [MVC](http://en.wikipedia.org/wiki/Model–view–controller) 中的 M（模型），负责处理数据和业务逻辑。Active Record 负责创建和使用需要持久存入数据库中的数据。Active Record 实现了 Active Record 模式。

在 Active Record 模式中，对象中既有持久存储的数据，也有针对数据的操作。Active Record 模式把数据存取逻辑作为对象的一部分。

Active Record提供的功能如下：

- 表示模型和其中的数据；
- 表示模型之间的关系；
- 通过相关联的模型表示继承层次结构；
- 持久存入数据库之前，验证模型；
- 以面向对象的方式处理数据库操作。

## Active Record 约定

* **命名**

  Rails 把模型的类名转换成复数，然后查找对应的数据表。例如：

  | 模型/类    | 表/模式      |
  | :--------- | :----------- |
  | `Article`  | `articles`   |
  | `LineItem` | `line_items` |
  | `Deer`     | `deers`      |
  | `Mouse`    | `mice`       |
  | `Person`   | `people`     |

* #### 模式

  >  **外键**：使用 `singularized_table_name_id` 形式命名，例如 `item_id`，`order_id`。创建模型关联后，Active Record 会查找这个字段；
  >
  >  **主键**：默认情况下，Active Record 使用整数字段 `id` 作为表的主键。使用 [Active Record 迁移](https://ruby-china.github.io/rails-guides/active_record_migrations.html)创建数据库表时，会自动创建这个字段；



## 创建 Active Record 

继承 `ApplicationRecord` 类即可：

```ruby
class Product < ApplicationRecord
end
```

上面的代码会创建 `Product` 模型，对应于数据库中的 `products` 表。同时，`products` 表中的字段也映射到 `Product` 模型实例的属性上。假如 `products` 表由下面的 SQL 语句创建：

```sql
CREATE TABLE products (
   id int(11) NOT NULL auto_increment,
   name varchar(255),
   PRIMARY KEY  (id)
);
```

即可编写以下代码：

```ruby
p = Product.new
p.name = "Some Book"
puts p.name # "Some Book"
```



## 覆盖命名约定

`ApplicationRecord` 继承自 `ActiveRecord::Base`，后者定义了一系列方法。使用 `ActiveRecord::Base.table_name=` 方法可以指定要使用的表名：

```ruby
class Product < ApplicationRecord
  self.table_name = "my_products"
end
```

同时需要通过`set_fixture_class`方法指定测试固件：

```ruby
class ProductTest < ActiveSupport::TestCase
  set_fixture_class my_products: Product
  fixtures :my_products
  ...
end
```

还可以使用 `ActiveRecord::Base.primary_key=` 方法指定表的主键：

```ruby
class Product < ApplicationRecord
  self.primary_key = "product_id"
end
```



## CRUD

### Create

Active Record对象可以通过`new`方法创建对象，`create`方法创建对象并保存到数据库中。

```ruby
user = User.new
user.name = "David"
user.occupation = "Code Artist"
user.save #调用save存入数据库

user = User.create(name: "David", occupation: "Code Artist")
```

如果在 `create` 和 `new` 方法中使用块，会把新创建的对象拉入块中，初始化对象：

```ruby
myUser = MyUser.new do |u|
  u.username = "1"
end
myUser2 = MyUser.create do |u|
  u.username = "1"
end
```

### Read

```ruby
# 返回所有用户组成的集合
users = User.all
# 返回第一个用户
user = User.first
# 返回第一个名为 David 的用户
david = User.find_by(name: 'David')
# 查找所有名为 David，职业为 Code Artists 的用户，而且按照 created_at 反向排列
users = User.where(name: 'David', occupation: 'Code Artist').order(created_at: :desc)
```

### Update

```ruby
user = User.find_by(name: 'David') # 获取到数据
user.name = 'Dave' # 设置值
user.save	# 保存
```

```ruby
user = User.find_by(name: 'David')
user.update(name: 'Dave') # 直接通过对象更新
```

```ruby
# 一次更新多个字段
User.update_all "max_login_attempts = 3, must_change_password = 'true'"
```

### Delete

```ruby
user = User.find_by(name: 'David') # 获取
user.destroy # 删除
```

# ActiveRecord迁移

***

迁移时按时间顺序修改数据库模式的一种方法。它使用 Ruby DSL ，实现与数据库无关的数据库模式的操作，同时不必手动编写SQL。

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
 
      t.timestamps
    end
  end
end
```

该迁移用于添加`products`表到数据库，其中包括`name`和`description`字段。同时按照约定`ActiveRecord::Migration`为我们自动添加了名为`id`到主键，`timestamps`添加`created_at`和`updated_at`两个字段，来记录创建时间和更新时间。

对于支持 DDL 事务的数据库，迁移会被放在事务中，不支持的数据库如果迁移失败需要手动操作回滚。

**注：**SQL 语言分为 DQL(Date Query Language)、DML(Data Manipulation Language)、DDL(Data Definition Language)、DCL(Data Control Language)

手动回滚可以采用以下方法：

```ruby
class ChangeProductsPrice < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      change_table :products do |t|
        dir.up   { t.change :price, :string }
        dir.down { t.change :price, :integer }
      end
    end
  end
end
```

```ruby
class ChangeProductsPrice < ActiveRecord::Migration[5.0]
  def up # 该方法会在运行 rails db:migrate 时执行
    change_table :products do |t|
      t.change :price, :string
    end
  end
 
  def down # 该方法会在失败的时候运行
    change_table :products do |t|
      t.change :price, :integer
    end
  end
end
```



## 创建迁移

迁移文件储存在 `db/migrate` 文件夹中，一个迁移文件包含一个迁移类。文件名采用 `YYYYMMDDHHMMSS_create_products.rb` 形式，即 UTC 时间戳加上下划线再加上迁移的名称。迁移内容对应一个类（驼峰式命名）。

**注：**Rails 根据文件名的时间戳部分确定要运行的迁移和迁移运行的顺序，当需要把迁移文件复制到其他 Rails 应用，或者自己生成迁移文件时，一定要注意迁移运行的顺序。

为避免计算时间戳，Active Record 提供了生成器：

```bash
$ bin/rails generate migration AddPartNumberToProducts
```

上面的命令会创建空的迁移，并进行适当命名：

```ruby
class AddPartNumberToProducts < ActiveRecord::Migration[5.0]
  def change
  end
end
```



### AddXXX

如果迁移名称是 `AddXXXToYYY` 或 `RemoveXXXFromYYY` 的形式，并且后面跟着字段名和类型列表，那么会生成包含合适的 `add_column` 或 `remove_column` 语句的迁移。

```bash
$ bin/rails generate migration AddPartNumberToProducts part_number:string
```

```ruby
class AddPartNumberToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :part_number, :string
  end
end
```

同样可以添加索引

```bash
$ bin/rails generate migration AddPartNumberToProducts part_number:string:index
```

```ruby
class AddPartNumberToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :part_number, :string
    add_index :products, :part_number
  end
end
```

删除字段

```bash
$ bin/rails generate migration RemovePartNumberFromProducts part_number:string
```

```ruby
class RemovePartNumberFromProducts < ActiveRecord::Migration[5.0]
  def change
    remove_column :products, :part_number, :string
  end
end
```

添加多个字段

```bash
$ bin/rails generate migration AddDetailsToProducts part_number:string price:decimal
```

```ruby
class AddDetailsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :part_number, :string
    add_column :products, :price, :decimal
  end
end
```



### CreateXXX

如果迁移名称是 `CreateXXX` 的形式，并且后面跟着字段名和类型列表，那么会生成用于创建包含指定字段的 `XXX` 数据表的迁移。

```bash
$ bin/rails generate migration CreateProducts name:string part_number:string
```

生成迁移文件：

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name
      t.string :part_number
    end
  end
end
```

命令生成的代码只是一个起点，我们可以根据需要修改 `db/migrate/YYYYMMDDHHMMSS_add_details_to_products.rb` 文件。

**JoinTable**

如果迁移名称中包含 `CreateJoinTable`，生成器会创建联结数据表：

```bash
$ bin/rails generate migration CreateJoinTableCustomerProduct customer product
```

生成：

```ruby
class CreateJoinTableCustomerProduct < ActiveRecord::Migration[5.0]
  def change
    create_join_table :customers, :products do |t|
      # t.index [:customer_id, :product_id]
      # t.index [:product_id, :customer_id]
    end
  end
end
```



### 模型生成器

模型和脚手架生成器也会自动生成新模型的迁移文件：

```bash
$ bin/rails generate model Product name:string description:text
```

生成的迁移文件：

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
 
      t.timestamps
    end
  end
end
```



### 传递修饰符

可以直接在命令行中传递常用的<a id="BModifier" href="#Modifier">字段修饰符</a>。如下：

```bash
$ bin/rails generate migration AddDetailsToProducts 'price:decimal{5,2}' supplier:references{polymorphic}
```

生成：

```ruby
class AddDetailsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :price, :decimal, precision: 5, scale: 2
    add_reference :products, :supplier, polymorphic: true
  end
end
```



## 编写迁移

### 创建数据表

`create_table` 方法是最基础、最常用的方法。用法如下：

```ruby
# 会创建拥有string类型名为name字段的products表
# 且会默认创建名为id的主键，可传入id: false禁用主键
create_table :products do |t|
  t.string :name
end
```

如果需要传递数据库特有的选项，可以在 `:options` 选项中使用 SQL 代码片段

```ruby
# 创建数据表的 SQL 语句末尾加上 ENGINE=BLACKHOLE
create_table :products, options: "ENGINE=BLACKHOLE" do |t|
  t.string :name, null: false
end
```

还可以传递带有数据表描述信息的 `:comment` 选项，这些注释会被储存在数据库中。

**创建联结表**

用于创建 HABTM（has and belongs to many）联结数据表。用法如下：

```ruby
create_join_table :products, :categories
```

这两个字段的 `:null` 选项默认设置为 `false`，可以通过 `:column_options` 选项覆盖这一设置：

```ruby
create_join_table :products, :categories, column_options: { null: true }
```

联结数据表的名称默认由 `create_join_table` 方法的前两个参数按字母顺序组合而来。可以传入 `:table_name` 选项来自定义联结数据表的名称：

```ruby
create_join_table :products, :categories, table_name: :categorization
```

也可以接受块为参数，用于添加索引（默认未创建索引）或附加字段：

```ruby
create_join_table :products, :categories do |t|
  t.index :product_id
  t.index :category_id
end
```



### 修改数据库

`change_table`用于修改数据表。和 `create_table` 类似，但传入块的对象拥有更多方法来修改数据库：

```ruby
change_table :products do |t|
  t.remove :description, :name # 删除description和name字段
  t.string :part_number	# 创建string类型的part_number字段
  t.index :part_number # 创建part_number的索引
  t.rename :upccode, :upc_code # 重新命名upccode字段为upc_code
end
```



### 修改字段

Rails 提供了与 `remove_column` 和 `add_column` 类似的 `change_column` 迁移方法。

```ruby
# 把 products 数据表的 part_number 字段修改为 :text 字段。
change_column :products, :part_number, :text
```

**注：**该命令时无法撤销的。

此外还有一些常用方法：

```ruby
# 设置products字段和name字段不为空
change_column_null :products, :name, false
# 将products字段和approved字段默认值true修改为false
change_column_default :products, :approved, from: true, to: false
```

**注：**也可以把上面的迁移写成 `change_column_default :products, :approved, false`，但这种写法是无法撤销的。



## 字段修饰符

字段修饰符可以在创建或修改字段时使用<a id="Modifier" href="#BModifier">↵</a>：

>- `limit` 修饰符：设置 `string/text/binary/integer` 字段的最大长度。
>- `precision` 修饰符：定义 `decimal` 字段的精度，表示数字的总位数。
>- `scale` 修饰符：定义 `decimal` 字段的标度，表示小数点后的位数。
>- `polymorphic` 修饰符：为 `belongs_to` 关联添加 `type` 字段。
>- `null` 修饰符：设置字段能否为 `NULL` 值。
>- `default` 修饰符：设置字段的默认值。请注意，如果使用动态值（如日期）作为默认值，那么默认值只会在第一次使时（如应用迁移的日期）计算一次。
>- `index` 修饰符：为字段添加索引。
>- `comment` 修饰符：为字段添加注释。

更多介绍请参阅相应适配器的 API 文档。



## 外键

尽管不是必需的，但有时我们需要使用外键约束以保证引用完整性<a id="Foreign" href="#BForeign">↵</a>。

```ruby
# 为 articles 数据表的 author_id 字段添加外键
# 这个外键会引用 authors 数据表的 id 字段
add_foreign_key :articles, :authors
```

如果字段名不能从表名称推导出来，我们可以使用 `:column` 和 `:primary_key` 选项。

Rails 会为每一个外键生成以 `fk_rails_` 开头并接上根据 `from_table` 和 `column` 推导出来的字符串。需要时可以使用 `:name` 来指定外键名。

删除外键：

```ruby
# 让 Active Record 找出列名
remove_foreign_key :accounts, :branches
 
# 删除特定列上的外键
remove_foreign_key :accounts, column: :owner_id
 
# 通过名称删除外键
remove_foreign_key :accounts, name: :special_fk_name
```



## SQL语句

如果 Active Record 提供的辅助方法不够用，可以使用 `excute` 方法执行任意 SQL 语句：

```ruby
Product.connection.execute("UPDATE products SET price = 'free' WHERE 1=1")
```

关于各个方法的更多介绍和例子，请参阅 API 文档。 [`ActiveRecord::ConnectionAdapters::SchemaStatements`](http://api.rubyonrails.org/v5.1.1/classes/ActiveRecord/ConnectionAdapters/SchemaStatements.html) 的文档（在 `change`、`up` 和 `down` 方法中可以使用的方法）

 的文档（在 `create_table` 方法的块中可以使用的方法）

 [`ActiveRecord::ConnectionAdapters::Table`](http://api.rubyonrails.org/v5.1.1/classes/ActiveRecord/ConnectionAdapters/Table.html) 的文档（在 `change_table` 方法的块中可以使用的方法）。



## 迁移方法

### change

> - `add_column`
> - `add_foreign_key`
> - `add_index`
> - `add_reference`
> - `add_timestamps`
> - `change_column_default`（必须提供 `:from` 和 `:to` 选项）
> - `change_column_null`
> - `create_join_table`
> - `create_table`
> - `disable_extension`
> - `drop_join_table`
> - `drop_table`（必须提供块）
> - `enable_extension`
> - `remove_column`（必须提供字段类型）
> - `remove_foreign_key`（必须提供第二个数据表）
> - `remove_index`
> - `remove_reference`
> - `remove_timestamps`
> - `rename_column`
> - `rename_index`
> - `rename_table`

如果在块中不使用 `change`、`change_default` 和 `remove` 方法，那么 `change_table` 方法也是可撤销的。
如果提供了字段类型作为第三个参数，那么 `remove_column` 是可撤销的。别忘了提供原来字段的选项，否则 Rails 在回滚时就无法准确地重建字段了：

```ruby
remove_column :posts, :slug, :string, null: false, default: '', index: true
```



### reversible

撤销复杂迁移所需的操作有一些是 Rails 无法自动完成的，这时可以使用 `reversible` 方法指定运行和撤销迁移所需的操作。例如：

```ruby
class ExampleMigration < ActiveRecord::Migration[5.0]
  def change
    create_table :distributors do |t|
      t.string :zipcode
    end

   
    reversible do |dir|
      dir.up do
        # 添加 CHECK 约束
        execute <<-SQL
ALTER TABLE distributors
ADD CONSTRAINT zipchk
CHECK (char_length(zipcode) = 5) NO INHERIT;
SQL
      end
       # 撤销迁移时，会在删除 home_page_url 字段之后、删除 distributors 数据表之前运行。
      dir.down do
        execute <<-SQL
ALTER TABLE distributors
DROP CONSTRAINT zipchk
SQL
      end
    end

    add_column :users, :home_page_url, :string
    rename_column :users, :email, :email_address
  end
end
```

如果遇到无法撤销的操作，可以在`down`块中抛出`ActiveRecord::IrreversibleMigration`异常



### up & down

`up` 方法用于描述对数据库模式所做的改变，`down` 方法用于撤销 `up` 方法所做的改变。一下例子和上面的代码完全相同：

```ruby
class ExampleMigration < ActiveRecord::Migration[5.0]
  def up
    create_table :distributors do |t|
      t.string :zipcode
    end

    # 添加 CHECK 约束
    execute <<-SQL
ALTER TABLE distributors
ADD CONSTRAINT zipchk
CHECK (char_length(zipcode) = 5);
SQL

    add_column :users, :home_page_url, :string
    rename_column :users, :email, :email_address
  end

  def down
    rename_column :users, :email_address, :email
    remove_column :users, :home_page_url

    execute <<-SQL
ALTER TABLE distributors
DROP CONSTRAINT zipchk
SQL

    drop_table :distributors
  end
end
```

同样对于无法撤销的迁移，也应该在`down`方法中抛出 `ActiveRecord::IrreversibleMigration` 异常。



## 撤销迁移

Active Record 提供了 `revert` 方法用于回滚迁移：

```ruby
require_relative '20121212123456_example_migration'
 
class FixupExampleMigration < ActiveRecord::Migration[5.0]
  def change
    # 回滚该迁移类
    revert ExampleMigration
 
    # 新建table
    create_table(:apples) do |t|
      t.string :variety
    end
  end
end
```

`revert` 方法也接受块，用于撤销之前迁移的部分操作：

```ruby
class DontUseConstraintForZipcodeValidationMigration < ActiveRecord::Migration[5.0]
  def change
    revert do
      # 从  ExampleMigration 中复制粘贴代码
      reversible do |dir|
        dir.up do
          # 添加 CHECK 约束
          execute <<-SQL
ALTER TABLE distributors
ADD CONSTRAINT zipchk
CHECK (char_length(zipcode) = 5);
SQL
        end
        dir.down do
          execute <<-SQL
ALTER TABLE distributors
DROP CONSTRAINT zipchk
SQL
        end
      end

      # ExampleMigration 中的其他操作无需撤销
    end
  end
end
```

调换 `create_table` 方法和 `reversible` 方法的顺序，用 `drop_table` 方法代替 `create_table` 方法，最后对调 `up` 和 `down` 方法。也可以撤销迁移，但一个`revert`方法就可以代替所有。



## 运行迁移

Rails 提供了一套用于运行迁移的 `bin/rails` 任务。其中最常用的是 `rails db:migrate` 任务，用于调用所有**未运行**的迁移中的 `chagne` 或 `up` 方法。

如果没有未运行的迁移，任务会直接退出。

调用顺序是根据迁移文件名的时间戳确定的。

**注：**`db:migrate` 任务时会自动执行 `db:schema:dump` 任务，这个任务用于更新 `db/schema.rb` 文件，以匹配数据库结构。

如果指定了目标版本，Active Record 会运行该版本之前的所有迁移（调用其中的 `change`、`up` 和 `down` 方法），其中版本指的是迁移文件名的数字前缀。例如，下面的命令会运行 `20080906120000` 版本之前的所有迁移：

```bash
$ bin/rails db:migrate VERSION=20080906120000
```



### 回滚

另一个常用任务是回滚最后一个迁移。例如，当发现最后一个迁移中有错误需要修正时，就可以执行回滚任务。回滚最后一个迁移不需要指定这个迁移的版本，直接执行下面的命令即可：

```bash
$ bin/rails db:rollback
```

执行后会撤销 `change` 方法或调用 `down` 方法来回滚最后一个迁移。要想取消多个迁移，可以使用 `STEP` 参数：

```bash
$ bin/rails db:rollback STEP=3 # 撤销最后三个迁移
```

`db:migrate:redo` 任务用于回滚最后一个迁移并再次运行这个迁移。和 `db:rollback` 任务一样，如果需要重做多个迁移，可以使用 `STEP` 参数，例如：

```bash
$ bin/rails db:migrate:redo STEP=3
```



### 数据库

`rails db:setup` 任务用于创建数据库，加载数据库模式，并使用种子数据初始化数据库。

`rails db:reset` 任务用于删除并重新创建数据库，其功能相当于 `rails db:drop db:setup`。

关于转储数据库模式的更多介绍，请参阅 [数据库模式转储](https://ruby-china.github.io/rails-guides/active_record_migrations.html#schema-dumping-and-you)。



### 运行指定迁移

要想运行或撤销指定迁移，指定版本即可。例如：

```bash
# 如果已经迁移已经运行过就不会执行任何操作。
$ bin/rails db:migrate:up VERSION=20080906120000
```



### 迁移环境

`bin/rails db:migrate` 任务默认在开发环境中运行迁移。 `RAILS_ENV` 环境变量说明所需环境：

```bash
$ bin/rails db:migrate RAILS_ENV=test
```



### 运行迁移输出

运行迁移时，默认会输出正在进行的操作，以及操作所花费的时间。

```bash
==  CreateProducts: migrating =================================================
-- create_table(:products)
   -> 0.0028s
==  CreateProducts: migrated (0.0028s) ========================================
```

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    suppress_messages do
      create_table :products do |t|
        t.string :name
        t.text :description
        t.timestamps
      end
    end
 
    say "Created a table"
 
    suppress_messages {add_index :products, :name}
    say "and an index!", true
 
    say_with_time 'Waiting for a while' do
      sleep 10
      250
    end
  end
end
```



## 修改迁移

如果编写迁移时出现错误，在重新运行迁移是无效的，Rails 已经运行过这个迁移类。必须回滚这个迁移（例如通过执行 `bin/rails db:rollback` 任务），再修改迁移中的错误，然后执行 `rails db:migrate` 任务来运行这个迁移。

通常，不能直接修改现有的迁移。如果这个迁移已在生产服务器上运行，可能带来大麻烦。可以编写一个新的迁移来执行我们想要的操作。修改还未提交到源代版本码控制系统（或者更一般地，还未传播到开发设备之外）的新生成的迁移是相对无害的。

在编写新的迁移来完全或部分撤销之前的迁移时，可以使用 `revert` 方法



## 数据库模式转储

迁移尽管很强大，但并非数据库模式的可信来源。Active Record的可信来源只有通过检查数据库生成的 db/schema.rb` 或 `db/structure.sql，这两个文件用来表示数据库的当前状态。



### 转储的类型

可以通过 `config/application.rb` 文件的 `config.active_record.schema_format` 选项来设置想要采用的方式，即 `:sql` 获得`SQL`文件或 `:ruby` 获得`rb`文件。

 `db/schema.rb` 文件类似一个巨大的迁移：

```ruby
ActiveRecord::Schema.define(version: 20080906171750) do
  create_table "authors", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end
 
  create_table "products", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "part_number"
  end
end
```

这个文件是通过检查数据库生成的，使用 `create_table`、`add_index` 等方法来表达数据库结构。这个文件是数据库无关的，可以加载到 Active Record 支持的任何一种数据库。

但它不能表达数据库的特定项目，如触发器、存储过程或检查约束。

如果在数据库中使用了以上特性，就应该把数据库模式的格式设置为 `:sql`。

`:sql` 格式的数据库模式，只能加载到和原有数据库类型相同的数据库，而不能加载到其他类型的数据库。

**注：**`db/schema.rb` 文件包含数据库的当前版本号，这样可以确保在合并两个包含数据库模式文件的分支时会发生冲突。一旦出现这种情况，就需要手动解决冲突，保留版本较高的那个数据库模式文件。



## 引用完整性

Active Record 在**模型**而不是数据库中声明关联。因此，像触发器、约束这些依赖数据库的特性没有被大量使用。

验证，如 `validates :foreign_key, uniqueness: true`，是**模型**强制数据完整性的一种方式。在关联中设置 `:dependent` 选项，可以保证父对象删除后，子对象也会被删除。和其他应用层的操作一样，这些操作无法保证引用完整性，因此有些人会在数据库中使用<a id="BForeign" href="#Foreign">外键约束</a>以加强数据完整性。

尽管 Active Record 并未提供用于直接处理这些特性的工具，但 `execute` 方法可以用于执行任意 SQL。



## 种子数据

Rails 内置的“种子”特性可以快速简便地完成创建数据库后添加初始数据的任务。

用 Ruby 代码填充 `db/seeds.rb` 文件，然后执行 `rails db:seed` 命令即可：

```ruby
5.times do |i|
  Product.create(name: "Product ##{i}", description: "A product.")
end
```

这样可以避免在创建数据库表的迁移文件中直接写入初始数据的代码。



# 数据校验

***

Active Record 会在存入数据库之前校验模型。调用`save` 或者`update`方法时会进行校验。

```ruby
class User < ApplicationRecord
  validates :name, presence: true
end
 
user = User.new
user.save  # => false 
user.save! # => ActiveRecord::RecordInvalid: Validation failed: Name can't be blank
```

[Active Record 数据验证](https://ruby-china.github.io/rails-guides/active_record_validations.html)会详细介绍数据验证。



# ActiveRecord 关联

关联可以将两个业务上有联系的两个模块联系起来，以简化其中的数据操作。

Rails 支持六种关联：

- `belongs_to`
- `has_one`
- `has_many`
- `has_many :through`
- `has_one :through`
- `has_and_belongs_to_many`



## belongs_to

### 基本使用

建立两个模型之间一对一的关系，表示所在模型属于另一个模型实例。

```ruby
class Book < ApplicationRecord
  belongs_to :author
end
```

相应的迁移如下：

```ruby
class CreateBooks < ActiveRecord::Migration[5.0]
  def change
    create_table :authors do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :books do |t|
      t.belongs_to :author, index: true
      t.datetime :published_at
      t.timestamps
    end
  end
end
```

### 关联方法

声明 `belongs_to` 关联后，所在的类自动获得了五个和关联相关的方法：

```ruby
association
association=(associate)
build_association(attributes = {})
create_association(attributes = {})
create_association!(attributes = {})
```

以上述`Book`模型来说,每个`Book`实例都获得了这些方法：

```ruby
@author = @book.author					# 获得关联对象，如果不存在则返回nil
@book.author = @author				  # 将对象的主键赋值给book实例的关联对象
# 返回设置给该关联类型的一个新对象。但关联对象不会存入数据库。
@author = @book.build_author(author_number: 123,
                             author_name: "John Doe")
# 返回设置给该关联类型的一个新对象。这只要能通过数据验证，就会把关联对象存入数据库。
@author = @book.create_author(author_number: 123,
                                   author_name: "John Doe")
# 返回设置给该关联类型的一个新对象。没通过校验则报错。
@author = @book.create_author!(author_number: 123,
                                   author_name: "John Doe")
```

### 方法选项

`belongs_to` 关联支持下列选项：

**:autosave**

`:autosave` 选项设为 `true`，保存父对象时，会自动保存所有子对象，并把标记为析构的子对象销毁。

**:class_name**

指定模型名以使所在模型与之关联。

```ruby
class Book < ApplicationRecord
  belongs_to :author, class_name: "Patron"
end
```

**:dependent**

`:dependent` 选项控制属主销毁后怎么处理关联的对象：

- `:destroy`：也销毁关联的对象
- `:delete_all`：直接从数据库中删除关联的对象（不执行回调）
- `:nullify`：把外键设为 `NULL`（不执行回调）
- `:restrict_with_exception`：如果有关联的记录，抛出异常
- `:restrict_with_error`：如果有关联的对象，为属主添加一个错误

**:foreign_key**

按照约定，用来存储外键的字段名是关联名后加 `_id`。`:foreign_key` 选项可以设置要使用的外键名：

```ruby
class Book < ApplicationRecord
  belongs_to :author, class_name: "Patron",
                      foreign_key: "patron_id"
end
# 不管怎样，Rails 都不会自动创建外键字段，你要自己在迁移中创建。
```

**注：**Rails 并不会在数据库中添加外键约束。

**:primary_key**

按照约定，Rails 假定使用表中的 `id` 列保存主键。使用 `:primary_key` 选项可以指定使用其他列。

假如有个 `users` 表使用 `guid` 列存储主键，`todos` 想在 `guid` 列中存储用户的 ID，那么可以使用 `primary_key` 选项设置：

```ruby
class User < ApplicationRecord
  self.primary_key = 'guid' # 设置主键为 guid
end
 
class Todo < ApplicationRecord
  belongs_to :user, primary_key: 'guid' # 通过指定主键关联
end
```

执行 `@user.todos.create` 时，`@todo` 记录的用户 ID 是 `@user` 的 `guid` 值。

**:inverse_of**

用于指定 `belongs_to` 关联另一端的 `has_many` 和 `has_one` 关联名。不能和 `:polymorphic` 选项一起使用。

```ruby
class Author < ApplicationRecord
  has_many :books, inverse_of: :author
end
 
class Book < ApplicationRecord
  belongs_to :author, inverse_of: :books
end
```

**:touch**

如果把 `:touch` 选项设为 `true`，保存或销毁对象时，关联对象的 `updated_at` 或 `updated_on` 字段会自动设为当前时间。同时还可指定要更新哪个时间戳字段：

```ruby
class Book < ApplicationRecord
  belongs_to :author, touch: :books_updated_at
end
```

**:validate**

如果把 `:validate` 选项设为 `true`，保存对象时，会同时验证关联的对象。该选项的默认值是 `false`，保存对象时不验证关联的对象。



### 作用域

可以通过一些方法指定查询关联时的作用域：

**where**

`where` 方法指定关联对象必须满足的条件。

```ruby
class book < ApplicationRecord
  belongs_to :author, -> { where active: true }
end
```

**includes**

指定使用关联时要及早加载的**间接**关联 。

如有以下模型：

```ruby
class LineItem < ApplicationRecord
  belongs_to :book
end
 
class Book < ApplicationRecord
  belongs_to :author
  has_many :line_items
end
 
class Author < ApplicationRecord
  has_many :books
end
```

如果经常直接冲商品上获取作者对象时 `(@line_item.book.author)`，就可以在商品引入图书时也引入作者。

```ruby
class LineItem < ApplicationRecord
  belongs_to :book, -> { includes :author }
end
 
class Book < ApplicationRecord
  belongs_to :author
  has_many :line_items
end
 
class Author < ApplicationRecord
  has_many :books
end
```

**readonly**

使通过关联获取的对象是只读的。

**select**

`select` 方法用于覆盖检索关联对象使用的 SQL `SELECT` 子句。默认情况下，Rails 检索所有字段。如果在 `belongs_to` 关联中使用 `select` 方法，应该同时设置 `:foreign_key` 选项，确保返回的结果正确。

**注：**把对象赋值给 `belongs_to` 关联不会自动保存对象，也不会保存关联的对象。



## has_one

### 基本使用

也建立一对一关系，但语义不一样。表示所在模型拥有另一个模型实例。

```ruby
class Supplier < ApplicationRecord
  has_one :account # 在 belongs_to 关联声明中必须使用单数形式。
end
```

相应的迁移如下：

```ruby
class CreateSuppliers < ActiveRecord::Migration[5.0]
  def change
    create_table :suppliers do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :accounts do |t|
      t.belongs_to :supplier, index: true
      t.string :account_number
      t.timestamps
    end
  end
end
```

根据使用需要，可能还要为 accounts 表中的 supplier 列创建唯一性索引和（或）外键约束。

```ruby
create_table :accounts do |t|
  t.belongs_to :supplier, index: { unique: true }, foreign_key: true
  # ...
end
```

**注：**`has_one`的关联方法、方法选项、作用域几乎与`belongs_to`相同。可参见上文



## has_many

### 基本使用

用于建立模型间的一对多关系，通常用于 belongs_to 的另一端，表示所在模型包含零个或多个另一个模型的实例。

```ruby
class Author < ApplicationRecord
  has_many :books # 声明 has_many 关联时，另一个模型使用复数形式。
end
```

相应的迁移如下：

```ruby
class CreateAuthors < ActiveRecord::Migration[5.0]
  def change
    create_table :authors do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :books do |t|
      t.belongs_to :author, index: true
      t.datetime :published_at
      t.timestamps
    end
  end
end
```



### 关联方法

声明 `has_many` 关联后声明所在类获取了如下方法：

```ruby
collection
collection<<(object, ...)
collection.delete(object, ...)
collection.destroy(object, ...)
collection=(objects)
collection_singular_ids
collection_singular_ids=(ids)
collection.clear
collection.empty?
collection.size
collection.find(...)
collection.where(...)
collection.exists?(...)
collection.build(attributes = {}, ...)
collection.create(attributes = {})
collection.create!(attributes = {})
```

同样以上文`Author`为例，每个实例获得了如下方法：

```ruby
# 返回包含所有关联对想的数组，如果没有则返回空数组
@books = @author.books		

# 向关联对象数组添加一个或多个对象。并为添加对象设置外键为该对象主键
@author.books << @book1			

# 删除关联对象数组中的一个或多个对象，并设置删除对象外键为NULL
@author.books.delete(@book1)

# 直接冲数据库中删除关联的对象
@author.books.destroy(@book1)

# 设置指定的关联对象
@author.books = @books

# 返回关联对象的id数组
@book_ids = @author.book_ids

# 指定关联对象数组中的主键，会根据指定增删ID。改动会持久存入数据库。
@author.book_ids = @book_ids

# 据 dependent 选项指定的策略删除集合中的所有对象。如果没有指定这个选项，使用默认策略。has_many :through 关联的默认策略是 delete_all；has_many 关联的默认策略是，把外键设为 NULL。
@author.books.clear

# 判断是否为空
@author.books.empty?

# 返回数量
@book_count = @author.books.size

# 查找，和exists类似
@available_books = @author.books.find(1)

# 根据条件查找
@available_books = @author.books.where(available: true) # 尚未查询
@available_book = @available_books.first # 现在查询数据库

# 根据条件查找是否存在
@author.books.exists？(available: true) 
@author.books.exists?(5) # 查找id为5
@author.books.exists?('5') # 查找id为5
@author.books.exists?(['name LIKE ?', "%#{query}%"]) # 条件查找数组
@author.books.exists?(id: [1, 4, 8]) # 查找id在数组中的
@author.books.exists?(name: 'David') # 查找指定name
@author.books.exists?(false) # 返回false
@author.books.exists? # 如果table为空返回false否则返回true

# 返回一个或多个此种关联类型的新对象。这些对象会使用传入的属性初始化，还会创建对应的外键，但不会保存关联的对象。
@book = @author.books.build(published_at: Time.now,
                            book_number: "A12345")
@books = @author.books.build([
  { published_at: Time.now, book_number: "A12346" },
  { published_at: Time.now, book_number: "A12347" }
])

# 返回一个或多个此种关联类型的新对象。这些对象会使用传入的属性初始化，还会创建对应的外键，通过校验则保存对象。
@book = @author.books.create(published_at: Time.now,
                             book_number: "A12345")
@books = @author.books.create([
  { published_at: Time.now, book_number: "A12346" },
  { published_at: Time.now, book_number: "A12347" }
])

# 如果没通过校验则报错
books.create!(attributes = {})
```



### 方法选项

和`belong_to`基本相似，这里介绍部分不相似的选项。

**:source**

指定 `has_many :through` 关联的源关联名称。只有无法从关联名中解出源关联的名称时才需要设置这个选项。

**:source_type**

指定通过多态关联处理 `has_many :through` 关联的源关联类型。



### 作用域

在作用域代码块中可以使用任何一个标准的查询方法。下面介绍其中几个：

**group**

指定一个属性名，用在 SQL `GROUP BY` 子句中，分组查询结果。

```ruby
class Author < ApplicationRecord
  has_many :line_items, -> { group 'books.id' },
                        through: :books
end
```

**limit**

限制通过关联获取的对象数量。

```ruby
class Author < ApplicationRecord
  has_many :recent_books,
    -> { order('published_at desc').limit(100) },
    class_name: "Book",
end
```

**offset**

指定通过关联获取对象时的偏移量。例如，`-> { offset(11) }` 会跳过前 11 个记录。

**order**

指定获取关联对象时使用的排序方式，用在 SQL `ORDER BY` 子句中。

```ruby
class Author < ApplicationRecord
  has_many :books, -> { order "date_confirmed DESC" }
end
```

**distinct**

可以确保集合中没有重复的对象。

```ruby
class Person
  has_many :readings
  has_many :articles, -> { distinct }, through: :readings
end
```



**注：**

* 把对象赋值给 `has_many` 关联时，会自动保存对象（因为要更新外键）。如果一次赋值多个对象，所有对象都会自动保存。

* 如果父对象（`has_many` 关联声明所在的模型）没保存，那么子对象也不会保存。只有保存了父对象，才会保存子对象。

* 如果没有通过数据校验则返回`false`，赋值取。

* `collection.build` 方法可以在赋值给`has_many`关联时不保存对象。

  

## has_many :through

用于建立模型间的多对多关系，表示所在模型可以借由第三个模型，包含零个或多个另一模型的实例，常作用于有中间表的关联关系数据。

```ruby
class Physician < ApplicationRecord
  has_many :appointments
  has_many :patients, through: :appointments
end
 
class Appointment < ApplicationRecord
  belongs_to :physician
  belongs_to :patient
end
 
class Patient < ApplicationRecord
  has_many :appointments
  has_many :physicians, through: :appointments
end
```

相应的迁移如下：

```ruby
class CreateAppointments < ActiveRecord::Migration[5.0]
  def change
    create_table :physicians do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :patients do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :appointments do |t|
      t.belongs_to :physician, index: true
      t.belongs_to :patient, index: true
      t.datetime :appointment_date
      t.timestamps
    end
  end
end
```

`has_many :through` 还能简化嵌套的 `has_many` 关联。例如，一个文档分为多个部分，每一部分又有多个段落，如果想使用简单的方式获取文档中的所有段落，可以这么做：

```ruby
class Document < ApplicationRecord
  has_many :sections
  has_many :paragraphs, through: :sections
end
 
class Section < ApplicationRecord
  belongs_to :document
  has_many :paragraphs
end
 
class Paragraph < ApplicationRecord
  belongs_to :section
end
```

加上 `through: :sections` 后，Rails 就能理解这段代码：

```ruby
@document.paragraphs
```



## has_one :through

用于建立两个模型间的一对一关系，表示通过第三个模型与另一个模型关联。即一对一对一建立管理，方便所在模型对需要关联模型的操作。

```ruby
class Supplier < ApplicationRecord
  has_one :account
  has_one :account_history, through: :account
end
 
class Account < ApplicationRecord
  belongs_to :supplier
  has_one :account_history
end
 
class AccountHistory < ApplicationRecord
  belongs_to :account
end
```

相应迁移如下：

```ruby
class CreateAccountHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :suppliers do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :accounts do |t|
      t.belongs_to :supplier, index: true
      t.string :account_number
      t.timestamps
    end
 
    create_table :account_histories do |t|
      t.belongs_to :account, index: true
      t.integer :credit_rating
      t.timestamps
    end
  end
end
```



## has_and_belongs_to_many

用于两个模型间的多对多关系，不借用中间关联对象。

```ruby
class Assembly < ApplicationRecord
  has_and_belongs_to_many :parts
end
 
class Part < ApplicationRecord
  has_and_belongs_to_many :assemblies
end
```

**注：**其关联方法、方法选项、作用域与`has_many`相同



## 自联结

对自己建立关系。

```ruby
class Employee < ApplicationRecord
  has_many :subordinates, class_name: "Employee",
                          foreign_key: "manager_id"
 
  belongs_to :manager, class_name: "Employee"
end
```

在迁移（模式）中，要添加一个引用字段，指向模型自身：

```ruby
class CreateEmployees < ActiveRecord::Migration[5.0]
  def change
    create_table :employees do |t|
      t.references :manager, index: true
      t.timestamps
    end
  end
end
```



## 关联的作用域

默认情况下关联只会查找当前模块作用域中的对象，要想让处在不同命名空间中的模型正常建立关联，声明关联时要指定完整的类名：

```ruby
module MyApplication
  module Business
    class Supplier < ApplicationRecord
       has_one :account,
        class_name: "MyApplication::Billing::Account"
    end
  end
 
  module Billing
    class Account < ApplicationRecord
       belongs_to :supplier,
        class_name: "MyApplication::Business::Supplier"
    end
  end
end
```



## 关联回调

普通回调会介入 Active Record 对象的生命周期，在多个时刻处理对象。例如，可以使用 `:before_save` 回调在保存对象之前处理对象。和普通回调类似，关联回调由集合中的生命周期触发，有如下四种；

```ruby
before_add
after_add
before_remove
after_remove
```

关联回调在声明关联时定义。例如：

```ruby
class Author < ApplicationRecord
  has_many :books, before_add: :check_credit_limit
 
  def check_credit_limit(book) # 传入添加的对象
    ...
  end
end
```

同一事件可以触发多个回调，多个回调使用数组指定：

```ruby
class Author < ApplicationRecord
  has_many :books,
    before_add: [:check_credit_limit, :calculate_shipping_charges]
 
  def check_credit_limit(book)
    ...
  end
 
  def calculate_shipping_charges(book)
    ...
  end
end
```

如果在回调中抛出异常，不会修改集合。



* 

# ActiveRecord 回调

***

回调是在对象生命周期的某些时刻被调用的方法。通过回调，可以在创建、保存、更新、删除、验证或从数据库中加载 Active Record 对象时执行指定的代码。

## 注册回调

回调在使用之前需要注册。我们可以先把回调定义为普通方法，然后使用宏式类方法把这些普通方法注册为回调：

```ruby
class User < ApplicationRecord
  validates :login, :email, presence: true
 
  before_validation :ensure_login_has_a_value
 
  private # 应该把回调定义为私有方法,以体现封装原则
    def ensure_login_has_a_value
      if login.nil?
        self.login = email unless email.blank?
      end
    end
end
```

宏式类方法也接受块：

```ruby
before_create do
  self.name = login.capitalize if name.blank?
end
```

同时回调也可以指定触发事件：

```ruby
before_validation :normalize_name, on: :create
# :on 选项的值也可以是数组
after_validation :set_location, on: [ :create, :update ]
```



## 可用的回调

### 创建对象

- `before_validation`
- `after_validation`
- `before_save`
- `around_save`
- `before_create`
- `around_create`
- `after_create`
- `after_save`
- `after_commit/after_rollback`

### 更新对象

- `before_validation`
- `after_validation`
- `before_save`
- `around_save`
- `before_update`
- `around_update`
- `after_update`
- `after_save`
- `after_commit/after_rollback`

### 删除对象

- `before_destroy`
- `around_destroy`
- `after_destroy`
- `after_commit/after_rollback`



### `after_initialize` & `after_find` 

只要 Active Record 对象被实例化，不管是通过直接使用 `new` 方法还是从数据库加载记录，都会调用 `after_initialize` 回调。使用这个回调可以避免直接覆盖 Active Record 的 `initialize` 方法。

当 Active Record 从数据库中加载记录时，会调用 `after_find` 回调。`after_find` 会先于`after_initialize`回调。



### `after_touch`

`after_touch` 回调可以和 `belongs_to` 一起使用：

```ruby
class Employee < ApplicationRecord
  belongs_to :company, touch: true
  after_touch do
    puts 'An Employee was touched'
  end
end
 
class Company < ApplicationRecord
  has_many :employees
  after_touch :log_when_employees_or_company_touched
 
  private
  def log_when_employees_or_company_touched
    puts 'Employee/Company was touched'
  end
end
```

```ruby
>> @employee = Employee.last
#<Employee id: 1, company_id: 1, created_at: "2013-11-25 17:04:22", updated_at: "2013-11-25 17:05:05">
 
# triggers @employee.company.touch
>> @employee.touch
Employee/Company was touched
An Employee was touched # true
```



## 调用回调

以下方法可以触发回调：

- `create`
- `create!`
- `decrement!`
- `destroy`
- `destroy!`
- `destroy_all`
- `increment!`
- `save`
- `save!`
- `save(validate: false)`
- `toggle!`
- `update_attribute`
- `update`
- `update!`
- `valid?`

以下方法会触发`after_find`回调：

- `all`
- `first`
- `find`
- `find_by`
- `find_by_*`
- `find_by_*!`
- `find_by_sql`
- `last`

每次初始化类的新对象时都会触发 `after_initialize` 回调。



## 跳过回调

使用下面这些方法可以跳过回调：

- `decrement`
- `decrement_counter`
- `delete`
- `delete_all`
- `increment`
- `increment_counter`
- `toggle`
- `touch`
- `update_column`
- `update_columns`
- `update_all`
- `update_counters`

## 停止执行

回调链被包装在一个事物中，如果想要停止回调可以使用`throw :abort`，Rails会抛出除了 `ActiveRecord::Rollback` 和 `ActiveRecord::RecordInvalid` 之外的其他异常。这可能导致那些预期 `save` 和 `update_attributes` 等方法（通常返回 `true` 或 `false` ）不会引发异常的代码出错。



## 关联回调

在关联中也会触发回调：

```ruby
class User < ApplicationRecord
  has_many :articles, dependent: :destroy
end
 
class Article < ApplicationRecord
  after_destroy :log_destroy_action
 
  def log_destroy_action
    puts 'Article destroyed'
  end
end
```

```ruby
>> user = User.first   #<User id: 1>
>> user.articles.create!   #<Article id: 1, user_id: 1>
>> user.destroy
Article destroyed   #<User id: 1>
```



## 条件回调

可使用`:if`和`:unlese`方法，设置回调条件

同时可以设置多个条件：

```ruby
class Comment < ApplicationRecord
  after_create :send_email_to_author, if: :author_wants_emails?,
  	# Proc.new 表示将之后的代码块地实例成一个方法
    unless: Proc.new { |comment| comment.article.ignore_comments? }
end
```



## 回调类

Active Record 允许我们用类来封装回调方法。如下：

```ruby
class PictureFileCallbacks
  def after_destroy(picture_file)
    if File.exist?(picture_file.filepath)
      File.delete(picture_file.filepath)
    end
  end
end
```

```ruby
class PictureFile < ApplicationRecord
  after_destroy PictureFileCallbacks.new
end
```

也可以将回调方法设置成类的自方法

```ruby
class PictureFileCallbacks
  def self.after_destroy(picture_file)
    if File.exist?(picture_file.filepath)
      File.delete(picture_file.filepath)
    end
  end
end
```

```ruby
class PictureFile < ApplicationRecord
  after_destroy PictureFileCallbacks
end
```

可以在回调类中设置多个回调。



## 事务回调

`after_commit` 和 `after_rollback` 这两个回调会在数据库事务完成时触发。

例如，假设在下面的代码中，`picture_file_2` 对象是无效的，那么调用 `save!` 方法会引发错误：

```ruby
class PictureFile < ApplicationRecord
  # :on 指定出发方法。如果不提供，那么每个动作都会触发回调。
  # 也可以设置具体的别名指定回调方法：
  # after_create_commit
	# after_update_commit
  # after_destroy_commit
  # 如：after_destroy_commit :delete_picture_file_from_disk
  after_commit :delete_picture_file_from_disk, on: :destroy
 
  def delete_picture_file_from_disk
    if File.exist?(filepath)
      File.delete(filepath)
    end
  end
end
```

**注：**如果其中有一个回调引发异常，异常会向上冒泡，后续 `after_commit` 和 `after_rollback` 回调不再执行。如果回调代码可能引发异常，需要在回调中救援并进行适当处理，以便让其他回调继续运行。

