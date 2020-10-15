# Ruby中的变量

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

