# Ruby

## irb

`irb`启动时加载指定文件

```ruby
irb -r <文件名>
```



## 全局变量

```ruby
$/ 									# => 当前系统的换行符
$LOAD_PATH					# => 当前加载文件路径
__FILE__						# => 当前运行环境路径基名
```



## gets & chomp

`gets`获取下一次输入的字符串，以换行结束，且会包括换行。（输入可以是文件，和用户输入等）

`chomp`用来删除最后一行。所以`tmp.gets.chomp`通常用于获取第一行。



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



## ObjectSpace

```ruby
ObjectSpace.each_object(Module).flat_map(&:instance_methods).uniq.grep(/__\w+__/)
# => [:__send__, :__id__, :__method__, :__callee__, :__dir__]
```



## OpenStruct

```ruby
operators = result.inject([]) do |memo, obj|
  memo << OpenStruct.new({user_id: obj[0], real_name: obj[1]})
end
```

通过打开 irb 并运行以查找 String 上可用的所有方法:

```ruby
"".methods.sort
```



## Singleton

```ruby
require "singleton"
class A
	include Singleton

	def test
		p '1'
	end
end
A.instance
# => #<A:0x00007fa4ba900860>
A.instance
# => #<A:0x00007fa4ba900860>
```



## ``

在ruby代码中，可以使用``来执行操作系统中的命令

```ruby
result = `pwd`
# result => "/Users/aaa/railsPractice/test\n"
result.class
# => String
```



## CSV

```ruby
# 添加“\xEF\xBB\xBF ”解决excel打开 .csv 文件乱码问题
csv << ["\xEF\xBB\xBF ID","Name","AGE"] 
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

更好的方法可参见 [StyleGuide.md](points/StyleGuide.md) 中的`string`部分

