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



# Rails

Rails 中的安全存取：

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

调用环境：

```ruby
# 在 action_controller 环境中执行 wrap_paramters
ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: [:json] if respond_to?(:wrap_parameters)
end
```

字符换行

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

`Arel`

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







