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



