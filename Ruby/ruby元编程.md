# Ruby元编程

***

ruby 中的元编程，是可以在运行时动态地操作语言结构（如类、模块、实例变量等）的技术。甚至 ruby 可以在不用重启的情况下，在运行时直接键入一段新的 Ruby 代码，并执行它。

ruby的元编程，也具有“利用代码来编写代码”的作用。例如，常见的`attr_accessor`等方法就是如此。



## 实例变量

在类生成对象时才会产生的变量，同一个类的实例的实例变量通常是不一样的。

一个对象（实例）只是存储了它的实例变量和其所属类的引用。

一个对象的实例变量仅存在于对象中，方法（也就是实例方法（Instance Methods））则存在于对象所属的类中。这也就是为什么同一个类的实例都共享类中的方法，却不能共享实例变量的原因了。



## 类

- 与`Java`一样，类也是对象。
- 任何一个类都是`Class`类的实例。
- 对象的方法即是其所属类的实例方法。所以任何一个类的方法就是`Class`类的实例方法。
- 所有的类有共同的祖先`Object`类，而`Object`类又继承自`BasicObject`类，Ruby类的根本。
- 类名是**常量（Constant）**。

ruby 中类始终是开放的，可以随意更改像`String`或`Array`这种标准库中的类，但如果覆盖了方法很可能在别的地方出现错误。

在传入方法的参数前添加`*`可以将参数以数组传入。甚至可以使用于`initialize` 方法。

```ruby
class Rectangle
  def initialize(*args)
    if args.size < 2  || args.size > 3
      puts 'Sorry. This method takes either 2 or 3 arguments.'
    else
      puts 'Correct number of arguments.'
    end
  end
end
Rectangle.new([10, 23], 4, 10)
Rectangle.new([10, 23], [14, 13])
```

ruby 中的单例通常在类中以匿名的形式出现，所以也被叫做匿名类。

```ruby
# 1
class << Rubyist
  def who
    "Geek"
  end
end

# 2
class Rubyist
  class << self
    def who
      "Geek"
    end
  end
end

# 3
class Rubyist
  def self.who
    "Geek"
  end
end
```

**self**

- 在 ruby 中，`self`是一个总是指向当前对象（current object）的特殊变量
- `self`被认为是默认的 receiver。如果没有明确指出 receiver，那么系统将把`self`当做 receiver；
- 实例变量是在`self`（当前对象）中查找的。也就是说，如果我使用`@var`，那么 ruby 就会在`self`所指向的对象中去寻找此实例变量。

**注：**实例变量并不是由类定义的，它们也和子类以及继承机制无关。

当我们在调用一个明确指出 receiver 的方法时，Ruby会按照下面的步骤执行：

```ruby
obj.do_method(param)
```

- 将`self`指向`obj`；
- 在`self`所属的类中查找`do_method(param)`方法（方法是存放在类中，而不是实例中！）；
- 调用方法`do_method(param)`；



## 方法

当调用某一个方法的时候，Ruby会完成下面的步骤：

- 找到这个方法，这个过程被称作**方法查找（method lookup）**
- 执行这个方法，为了执行这个方法，Ruby需要一个叫做`self`的伪变量

**方法查找**

要理解Ruby的方法查找，需要了解以下两个概念：

> **接受者（receiver）**
>
> **祖先链（ancestors chain）**。

接受者就是方法的调用者。例如，对调用`an_object.display()`来说，`an_object`就是接受者。

祖先链则是 ruby 类中的一条所以继承关系的类集合。（祖先链中也包括模块）。

为了查找方法，ruby 会从 receiver 开始以一种被称为**“向右一步，再向上（one step to the right, then up）”**的规则（即：向右一步，进入reciver所属的类，然后再向上查找祖先链，直到找到目标方法。）进行查找

如果遍历完祖先链也没有找到方法的话，会调用`method_missing`方法，如果这个方法没有被定义，则抛出`NoMethodError`

当在一个类中包含一个模块时，ruby 会创建一个匿名类来封装这个模块，并将这个匿名类插入到祖先链中。



## 常用方法

ruby 可以通过`class`、 `instance_methods`、 `intance_variables`等方法在运行时查看对象的信息，也就是**反射**。

```ruby
class Rubyist
  def what_does_he_do
    @person = 'A Rubyist'
    'Ruby programming'
  end
end

an_object = Rubyist.new
puts an_object.class # => Rubyist
puts an_object.class.instance_methods(false) # => what_does_he_do
an_object.what_does_he_do
puts an_object.instance_variables # => @person
```



### responde_to?

`respond_to?`方法是反射机制中的常用方法。通过`respond_to?`方法，可以提前知道对象能否处理要交予它执行的信息。

所有的对象都有此方法。

```ruby
obj = Object.new
if obj.respond_to?(:program)
  obj.program
else
  puts "Sorry, the object doesn't understand the 'program' message."
end
```



### send

`send`是`Object`类的实例方法。

`send`方法的第一个参数是你期望对象执行的方法的名称。可以是一个**字符串（String）**或者**符号（Symbol）**，通常使用符号。剩余的参数就直接传递给所指定的方法。

 ```ruby
class Rubyist
  def welcome(*args)
    "Welcome " + args.join(' ')
  end
end

obj = Rubyist.new
puts(obj.send(:welcome, "famous", "Rubyists"))   # => Welcome famous Rubyists
 ```

　使用`send`方法，可以将需要调用的方法以参数传入。可以在运行时，决定到底调用哪个方法。

```ruby
class Rubyist
end

rubyist = Rubyist.new
if rubyist.respond_to?(:also_railist)
  puts rubyist.send(:also_railist)
else
  puts "No such information available"
end
```

`send`方法可以调用任何方法，即使是私有方法。

```ruby
class Rubyist
  private
    def say_hello(name)
      "#{name} rocks!!"
    end
end

obj = Rubyist.new
puts obj.send(:say_hello, 'Matz')
```



### define_method

`Module#define_method`是`Module`类实例的私有方法，所以仅能由类或者模块使用。

可以通过`define_method`动态的在`receiver`中定义实例方法。仅需要传递需要定义的方法的名字，以及一个代码块（block），如下：

```ruby
class Rubyist
  define_method :hello do |my_arg|
    my_arg
  end
end

obj = Rubyist.new
puts(obj.hello('Matz')) # => Matz
```



### method_missing

如果 ruby 在`look-up`机制中没有找到对应的方法，将会在原 receiver 中自行调用一个叫做`method_missing`的方法。

`method_missing`方法会以符号的形式传递被调用的那个不存在的方法的名字，以数组的形式传递调用时的参数，以及原调用中传递的块。

`method_missing`是由`Kernel`模块提供的方法，因此任意对象都有此方法。

`Kernel#method_missing`方法能响应`NoMethodError`错误。重载`method_missing`方法允许你对不存在的方法进行处理。

```ruby
class Rubyist
  def method_missing(m, *args, &block)
    puts "Called #{m} with #{args.inspect} and #{block}"
  end
end

Rubyist.new.anything # => Called anything with [] and
Rubyist.new.anything(3, 4) { something } # => Called anything with [3, 4] and #<Proc:0x02efd664@tmp2.rb:7>
```

如下有一个漂亮的例子：

```ruby
car = Car.new
car.go_to_taipei
# go to taipei
car.go_to_shanghai
# go to shanghai
car.go_to_japan
# go to japan

class Car
  def go(place)
    puts "go to #{place}"
  end

  def method_missing(name, *args)
    if name.to_s =~ /^go_to_(.*)/
      go($1) # $l 表示最后一次正则表达式匹配的第1-9次结果
    else
      super
    end
  end
end
```

**注：**`method_missing`方法的效率不甚理想，对效率敏感的项目尽量要避免使用此方法。



### remove_method & undef_method

可以在一个打开的类的**作用域（Scope）**内使用`remove_method`方法以移除已存在的方法。但父类以及父类的父类等先祖中有同名的方法不会被移除。

而`undef_method`会阻止任何对指定方法的访问，包括其父类及其先祖类。

```ruby
class Rubyist
  def method_missing(m, *args, &block)
    puts "Method Missing: Called #{m} with #{args.inspect} and #{block}"
  end

  def hello
    puts "Hello from class Rubyist"
  end
end

class IndianRubyist < Rubyist
  def hello
    puts "Hello from class IndianRubyist"
  end
end

obj = IndianRubyist.new
obj.hello # => Hello from class IndianRubyist

class IndianRubyist
  remove_method :hello  # removed from IndianRubyist, but still in Rubyist
end
obj.hello # => Hello from class Rubyist

class IndianRubyist
  undef_method :hello   # prevent any calls to 'hello'
end
obj.hello # => Method Missing: Called hello with [] and
```



### eval

用于执行一个用字符串表示的代码，由`Kernel`模块提供。

`eval`方法可以计算多行代码，使得将整个程序代码嵌入到字符串中并执行成为了可能。

`eval`方法很慢，在执行字符串前最好对其预先求值。

`eval`方法可能会出现注入问题，在万般无奈的情况下才会被选择。

```ruby
str = "Hello"
puts eval("str + ' Rubyist'") # => "Hello Rubyist"
```



* `instance_eval`，`module_eval`和`class_eval`是`eval`方法的特殊形式。

### instance_eval

`instance_eval`方法可被一个实例调用，并通过传入字符串或者传递一个代码块来操作对象的实例变量。该方法由`Object`类提供。

```ruby
class Rubyist
  def initialize
    @geek = "Matz"
  end
end
obj = Rubyist.new

# instance_eval可以操纵obj的私有方法以及实例变量

obj.instance_eval do
  puts self # => #<Rubyist:0x2ef83d0>
  puts @geek # => Matz
end
```

通过`instance_eval`传递的代码块使得可以在对象内部操作任何方法和数据，包括私有方法。甚至可以添加方法：

```ruby
class Rubyist
end

Rubyist.instance_eval do
  def who
    "Geek"
  end
end

puts Rubyist.who # => Geek
```



### *_eval

`module_eval`和`class_eval`方法用于模块和类，而不是对象。

`class_eval`是`module_eval`的一个别名。

`module_eval`和`class_eval`可用于从外部检索类变量。

```ruby
class Rubyist
  @@geek = "Ruby's Matz"
end
puts Rubyist.class_eval("@@geek") # => Ruby's Matz
```

`module_eval`和`class_eval`方法也可用于添加类或模块的实例方法。

```ruby
class Rubyist
end
Rubyist.class_eval do
  def who
    "Geek"
  end
end
obj = Rubyist.new
puts obj.who # => Geek
```

**注：**当作用于类时，`class_eval`将会定义实例方法，而`instance_eval`定义类方法。



### class_variable_*

`class_variable_get`方法需要一个代表变量名称的符号作为参数，其返回变量的值。

`class_variable_set`方法也需要一个代表变量名称的符号作为参数，同时要求传递一个值，作为欲设定的值。

```ruby
class Rubyist
  @@geek = "Ruby's Matz"
end

Rubyist.class_variable_set(:@@geek, 'Matz rocks!')
puts Rubyist.class_variable_get(:@@geek) # => Matz rocks!
```



### class_variables

以**符号（Symbol）**的形式返回类变量的名称的数组。

```ruby
class Rubyist
  @@geek = "Ruby's Matz"
  @@country = "USA"
end

class Child < Rubyist
  @@city = "Nashville"
end
print Rubyist.class_variables # => [:@@geek, :@@country]
puts
p Child.class_variables # => [:@@city] ## 并没有输出父类的类变量
```



### instance_variable_*

可以使用`instance_variable_get`方法查询实例变量的值。

可以使用`instance_variable_set`来设置一个对象的实例变量的值。

```ruby
class Rubyist
  def initialize(p1, p2)
    @geek, @country = p1, p2
  end
end
obj = Rubyist.new('Matz', 'USA')
puts obj.instance_variable_get(:@country) # => USA

obj.instance_variable_set(:@country, 'Japan')
puts obj.inspect # => #<Rubyist:0x2ef8038 @country="Japan", @geek="Matz">
```

这样可以不使用`attr_accessor`等方法为访问实例变量建立接口，而操作对象。



### const_*

`const_get`返回指定常量的值。

`const_set`为指定的常量设置指定的值，并返回该对象，如果常量不存在，那么他会创建该常量。

```ruby
puts Float.const_get(:MIN) # => 2.2250738585072e-308

class Rubyist
end
puts Rubyist.const_set("PI", 22.0/7.0) # => 3.14285714285714
```

利用`const_get`返回常量的值的特性，可以通过该方法获得一个类的名字并为这个类添加一个新的实例化对象的方法。这样就可以在运行时创建类并对其进行实例化。

```ruby
# Let us call our new class 'Rubyist'
# (we could have prompted the user for a class name)
class_name = "rubyist".capitalize
Object.const_set(class_name, Class.new)
# Let us create a method 'who'
# (we could have prompted the user for a method name)
class_name = Object.const_get(class_name)
puts class_name # => Rubyist
class_name.class_eval do
  define_method :who do |my_arg|
    my_arg
  end
end
obj = class_name.new
puts obj.who('Matz') # => Matz
```



## 绑定

在 ruby 中，`Kernel`有一个方法`binding`，它返回一个`Binding`类型的对象。

这个`Binding`对象封装了当前执行上下文中的所有绑定（变量、方法、语句块、`self`的名称绑定），而这些绑定直接决定了面向对象语言中的执行环境。

比如，当我们调用`p`时，实际上是进行了`self`和`p`的绑定，而`p`具体是哪个方法，是由`self`的类型来决定的，如果我们在顶层，而`Kernel#p`又没有被重写，那`p`就是一个用来显示对象细节的方法。可以说有了一个绑定的列表，我们就有了一个完整的面向对象上下文的拷贝。

ruby 的`Binding`对象的概念和 `Continuation`有共通之处，但`Continuation`主要用于实际堆、栈内存的环境跳转，而`Binding`则比较高层。

`Binding`对象主要是用于`eval`这个函数。

`eval`的第一个参数是需要`eval`的一段脚本字符串，第二个可选参数接收一个`Binding`对象。当指定了`Binding`时，`eval`会在传递给它的`Binding`所封装的执行环境里执行脚本，否则是在调用者的执行环境里执行。

我们可以通过这个机制来进行一些不同上下文之间的通信，或者是在一个上下文即将被销毁之前保存该上下文环境以留他用，如：

```ruby
def foo
  bar = 'baz'
  return binding
end

eval('p bar', foo)
```

通过`foo`返回的`Binding`获取到了局部上下文销毁前的局部变量`bar`的值，而在不使用`binding`的情况下，局部变量`bar`在`foo`外层是不可见的。

ruby 有一个预定义的常量：`TOPLEVEL_BINDING`，它指向一个封装了顶层绑定的对象，通过它我们可以在其它上下文中通过`eval`在顶层上下文环境中执行脚本。

```ruby
a = 42
p binding.local_variable_defined?(:a) # => true
p TOPLEVEL_BINDING.local_variable_defined?(:a) # => true

def example_method
  p binding.local_variable_defined?(:a) # => false
  p TOPLEVEL_BINDING.local_variable_defined?(:a) # => true
end

example_method
```



## 块和绑定

ruby 块中，包含了代码以及对应的绑定。

当定义一个块的时候，它会获得当时环境的绑定，当你执行一个带块的方法的时候，它将这个绑定传入。

```ruby
def who
  person = "Matz"
  yield("rocks")
end

person = "Matsumoto"

who do |y|
  puts("#{person}, #{y} the world") # => Matsumoto, rocks the world
  city = "Tokyo"
end

puts city
# => undefined local variable or method 'city' for main:Object (NameError)
```

**注：**在块内部定义的变量不能用于块外部。而预先在块外部定义的变量，经过块的操作后，值会发生改变。



# Ruby中的闭包

闭包就是能够读取**其他函数内部变量**的**函数**。即，闭包是内部函数和外部函数链接的桥梁，其可以让我们在内部函数访问到外部函数的作用域。

闭包也是函数式编程的核心，这使得我们可以将函数作为参数传入另一个函数，或者将函数作为返回值返回。

Ruby 中使用`Method`和`Proc`两个类来表示函数。而故事往往要从另外一个小故事开始，就比如`block`



## 函数式编程

### block

```ruby
# 遍历输出0-5
(0..5).each do |n|
  p n
end

# 等价于
(0..5).each {|n| p n}
```

以上两种字面量（literal）即为`block`的两种常用形式。`block`是 Ruby 提供的语法糖，其中的代码并没有被赋值给某一个变量，而是在需要调用时使用`yield`调用执行。

```ruby
# 在 Array 类中添加自定义函数
class Array
  def my_each
    # 从第0号位置每次自增size然后执行do中的方法
    0.upto(size) do |i|
      yield self[i]
    end
  end
end

%w(a b c).my_each do |item|
  puts item
end
```



### Proc

很明显，`block`并不能保存到变量然后复用，为了解决这个问题 Ruby 提供了`Proc`对象以保存其中的代码：

```ruby
my_proc = Proc.new { |e| p e}
# 等价于
my_proc = proc { |e| p e}
  
[1,2,3].map(&my_proc)
```

在将`my_proc`传入的时候并不是直接将对象传入，而是利用`&`符号将其后的参数转化为`Proc`然后再转换成`block`传入给调用者。

> `&`在C语言中为取地址符，Ruby 中的函数参数后面可以跟一个 block，由于这个 block 不是参数的一部分，所以没有名字，这很理所当然可以把 block 理解为一内存地址，`block_given?` 函数可以检查这个`block`是否存在。`&myinc` 可以理解为取 Proc 的地址传给 map 函数。

当然，也可以在函数的参数中添加`&达到相同的效果：

```ruby
def my_puts(str, &validator)
  validator.call(str)
  end
end

my_puts("my_puts") {|str| p str}		# => my_puts
```



### lambda

Ruby 除了 `Proc`还提供了`lambda`来得到`Proc`对象：

```ruby
my_lambda = lambda{ |e| p e}
```

于 `Proc.new`和`proc`方式不同的是，`lambda`对于调用的检验更加严格：

```ruby
 my_proc = proc {|x, y| puts x}
 my_proc.call(1)        # => 1
 my_proc.call(1, 2)     # => 1
 my_proc.call(1, 2, 3)  # => 1

 my_lambada = lambda {|x, y| puts x}
 my_lambada.call(1)        # ArgumentError
 my_lambada.call(1, 2)     # => 1
 my_lambada.call(1, 2, 3)  # ArgumentError
```

且对`return`的响应也不同，`lambda`中的`return`只会返回其本身：

```ruby
 def test(my_proc)
   my_proc.call
   p "finished"
 end

my_proc = proc{return}

my_lambda = lambda{return}

test(my_proc)			# => LocalJumpError (unexpected return)
test(my_lambda)		# => "finished"
```



## 面向对象编程

Ruby 中使用`def`定义的“函数”为`Method`类型，专为面向对象特性设计，面向对象更一般的说法是消息传递，通过给一对象发送不同消息，对象作出不同相应。

```ruby
class A
  def dosome
    p 'do something'
  end
end

a = A.new
# 传统方式
p a.dosome
# 消息传递方式
p a.send :dosome
```

Ruby 中方法名表示的是调用，所以一般可用与方法同名的`Symbol`来表示:

```ruby
p a.method(:dosome) 		# method 为Object中的方法，用于获取与传入symbol同名的方法
#<Method: A#dosome>
```

我们同样可以通过`&`来将`Method`类型转换成`block`：

```ruby
def myMethod(e)
  p e
end

[1,2,3].map(&method(:myMethod))  # => [1,2,3]
# 在 Ruby 源文件的顶层定义的函数属于 Object 对象，所以上面的调用相当于：
# [1,2,3].map(&Object.method(:myMethod))
```



参考资料：[辨析 Ruby 中的 Method 与 Proc](https://juejin.im/post/6844903466142269453)





## 闭包与对象

> “过程与数据的结合”是形容面向对象中的“对象”时经常使用的表达。
>
> 对象是在数据中以方法的形式内含了过程，而闭包则是在过程中以环境的形式内含了数据。

```ruby
def get_closure
  var = 0;
  Proc.new { var += 1 }
end
add_cls = get_closure
add_cls.call
# => 1
```

```ruby
def get_obj
  var = 0
  obj = Object.new
  obj.instance_eval {
    @var = var
    def add; @var += 1; end
  }
  
  obj
end
adder = get_obj
adder.add
# => 1
```



参考资料：[《代码的未来》——松本行弘](https://github.com/yiibook/future-of-code)

