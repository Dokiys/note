# Ruby

## irb

`irb`启动时加载指定文件

```ruby
irb -r <文件名>
```

在`rails console`中可以使用`reload!`命令重新加载更新过的文件：

```bash
[1] pry(main)> reload!
Reloading...
true
```

## <<

as an ordinary method

```ruby
"a" << "b" # 连接字符串
io << "A line of text\n" # io输入输出
```

Singleton class definition

```ruby
class A
  class << self
    puts self # self is the singleton class of A
  end
end

a = A.new
class << a
  puts self # now it's the singleton class of object a
end
```

## gets & chomp

`gets`获取下一次输入的字符串，以换行结束，且会包括换行。（输入可以是文件，和用户输入等）

`chomp`用来删除最后一行。所以`tmp.gets.chomp`通常用于获取第一行。

## _\_send\_\_

和`send`一样使用，在`send`被重写时使用。

用来调用指定方法

## .call

调用一个`Proc`或者方法实例。

```ruby
my_lambda = ->(name, phone){ puts "Hi #{name} your phone-number is #{phone}" }
my_lambda.call('Tomas', '555-012-123')

# Hi Tomas your phone-number is 555-012-123
```

## 断点调试

安装相应`gem`包之后报错：

```bash
Cannot start debugger. Gem 'Ruby-debug-ide' isn't installed or its executable script 'rdebug-ide' doesn't exist.
```

可能是因为`RubyMine`版本和`bash`中的`ruby`版本不一致，在`RubyMine`的偏好中设置相同版本即可。



## attr

类似 Java 中的`@Data`，为属性提供`get` & `set`方法。类似方法有如下四个：

```ruby
class A
  # 给 name 提供 getter 方法
  attr :name
  # 给 name 提供 getter 和 setter 方法（不推荐）
  attr :name, true
  
  # 给 name 提供 getter 方法
  attr_reader :name
  
  # 给 name 提供 setter 方法
  attr_writer :name
  
   # 给 name 提供 getter 和 setter 方法
  attr_accessor :name
end
```

```ruby
class A
    attr_accessor :name
end
a1 = A.new
a1.name = "zhangsan" # setter
puts a1.name # getter
```

ruby中没有属性！！！实际上`attr`为我们提供的是一个名为`.name`（如果属性名为`:count`即提供的是`.count`方法）和`=`的方法。

由于`ruby`中没有属性，我们使用的都是实例变量（或类变量）。

需要时直接在方法中使用`@`加上变量名即可，或者在`initialize`中定义。类似于下面的 2 。

```ruby
### 注意！！下面的# 1和# 2是不一样的变量

class B
  # 在类中定义的实例变量
  # Ruby 在方法中是无法访问到类中作用域的，也就是说这里的@count无法被方法访问到
  @count = 0 # 1

  def initialize
    # 实例变量，且不能在类里面声明或调用
    # 但可以在任何实例方法里面去使用
    # attr等方法声明的也是实例变量
    @count = 0 # 2
  end
end
```



### ObjecSpace

```ruby
ObjectSpace.each_object(Module).flat_map(&:instance_methods).uniq.grep(/__\w+__/)
# => [:__send__, :__id__, :__method__, :__callee__, :__dir__]
```



# Rails

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



## Rails 中的安全存取：

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
[5] pry(main)> params[:search].nil?
false
[6] pry(main)> params[:search].blank?
true
```



## 调用环境：

```ruby
# 在 action_controller 环境中执行 wrap_paramters
ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: [:json] if respond_to?(:wrap_parameters)
end
```



## 字符换行

```ruby
method_def <<
  "def #{method_name}(#{definition})" <<
  "  _ = #{to}" <<
  "  _.#{method}(#{definition})" <<
  "rescue NoMethodError => e" <<
  "  if _.nil? && e.name == :#{method}" <<
  %(   raise DelegationError, "#{self}##{method_name} delegated to #{to}.#{method}, but #{to} is nil: \#{self.inspect}") <<
  "  else" <<
  "    raise" <<
  "  end" <<
  "end"
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



## OpenStruct

```ruby
operators = result.inject([]) do |memo, obj|
  memo << OpenStruct.new({user_id: obj[0], real_name: obj[1]})
end
```





