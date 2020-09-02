# irb

`irb`启动时加载指定文件

```ruby
irb -r <文件名>
```

# include & extend

* `include`添加一个模块的方法到实例中
* `extend`添加一个模块的方法到类中

```ruby
module Log 
  def class_type
    "This class is of type: #{self.class}"
  end
end

```

```ruby
class TestClass 
  include Log 
end

tc = TestClass.new.class_type
puts tc #This class is of type: TestClass
```


```ruby
class TestClass
  extend Log
  # ...
end

tc = TestClass.class_type
puts tc  # This class is of type: TestClass
```

在`ruby`中使用`include`也可以增加实例方法，因为`include`有一个`self.included`的钩子函数，可以用它来修改类中对于模块的引入。

```ruby
module Foo
  def self.included(base)
    base.extend(ClassMethods)
  end
  
  def foo
    puts 'instance method'
  end

  module ClassMethods
    def bar
      puts 'class method'
    end
  end
end

class Baz
  include Foo
end

Baz.bar # class method
Baz.new.foo # instance method
Baz.foo # NoMethodError: undefined method ‘foo’ for Baz:Class
Baz.new.bar # NoMethodError: undefined method ‘bar’ for #<Baz:0x1e3d4>
```

如果引入了`ActiveSupport:;Concern`可以写成这样：

```ruby
module Foo
  extend ActiveSupport::Concern

  module ClassMethods
    def bar
      puts 'class method'
    end
  end

  def foo
    puts 'instance method'
  end
end

class Baz
  include Foo
end

Baz.bar # class method
Baz.new.foo # instance method
Baz.foo # NoMethodError: undefined method ‘foo’ for Baz:Class
Baz.new.bar # NoMethodError: undefined method ‘bar’ for #<Baz:0x1e3d4>
```

`extend`也有一个叫`self.extended`的方法,作用和`include`中的`self.included`类似。

可参考[《Ruby中include和extend的比较》](http://xuyao.club/blog/2015/06/29/include-vs-extend-in-ruby/)



# self

在类中self表示当前类对象。

在方法中表示当前实例对象，且通常可以省略。

# &. 

假设有一个 account 对象，它有一个关联的 owner 对象，现在想要获取 owner 的 address 属性。稳妥的不引发 nil 异常的写法如下：

```ruby
if account && account.owner && account.owner.address
...
end
```

我们可以使用安全调用运算符重写前面的例子：

```ruby
account&.owner&.address
```

# &:

对每一个元素执行某方法

```ruby
[1,2,3].map{ |x| x.to_s } # ['1','2','3']
[1,2,3].map(&:to_s) # 与上面等价
```



# attr

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

ruby中没有属性，实际上`attr`为我们提供的是一个名为`.name`（如果属性名为`:count`即提供的是`.count`方法）和`=`的方法。

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



# <<

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



# gets & chomp

`gets`获取下一次输入的字符串，以换行结束，且会包括换行。（输入可以是文件，和用户输入等）

`chomp`用来删除最后一行。所以`tmp.gets.chomp`通常用于获取第一行。



# \_\_send\_\_

和`send`一样使用，在`send`被重写时使用。

用来调用指定方法

# .call

调用一个`Proc`或者方法实例。

```ruby
my_lambda = ->(name, phone){ puts "Hi #{name} your phone-number is #{phone}" }
my_lambda.call('Tomas', '555-012-123')

# Hi Tomas your phone-number is 555-012-123
```





# 断点调试

安装相应`gem`包之后报错：

```bash
Cannot start debugger. Gem 'Ruby-debug-ide' isn't installed or its executable script 'rdebug-ide' doesn't exist.
```

可能是因为`RubyMine`版本和`bash`中的`ruby`版本不一致，在`RubyMine`的偏好中设置相同版本即可。

