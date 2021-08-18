# 类引入

ruby 中`module`用于替代多继承的功能，是一个可以包含常量、方法、类定义以及其他模块的集合。

`module`除了不可以`new`实例，以及没有`Class`类中一些特殊的方法和`class`没什么区别。

其定义语法如下：

```ruby
module ModuleA
  constA

  def method1
    ...do something
  end
end
```

Mix-in 可以将多个模块混合到类中，即通过`include` 在类中引入模块，以获得模块的方法、常量等。

```ruby
class ClassA
  include ModuleA
  include ModuleB
  ...
end

class ClassB
  include ModuleA
  include ModuleB
  ...
end
```

每个模块具有单独的命名空间，以保证模块下的常量和方法互不影响。



## Const

在类中引入模块后，其中的常量都被引入到了所在类中，当然也可以直接通过模型的命名空间直接访问模型的常量。

```ruby
module ModuleA
  constA = 'a'
end

class ClassA
  p ModuleA::constA # => "a"
  
  include ModuleA # 引入模块
  p constA # => "a" # 直接在类中使用模块中的常量
end
```



## Method

在类中引入模块后，其中的方法可以被该类的实例调用。

同时也可以在模块中将方法定义为模块方法。

```ruby
module ModuleA
  def method1
		p "do method1.."
  end
  
  def method2
    p "do method2.."
  end
  
  module_function :method2 # 将方法2设置为模型方法
end 

class ClassA
  include ModuleA
  # 可以直接通过模型的命名空间调用模型方法
  ModuleA.method2 # => "do method2.." 
  a = ClassA.new
  a.method1 # => "do method1.."
end
```



## NameSpace

在引入多个模块时如果常量出现同名问题可以指定具体的命名空间以使用正确的常量。

否则 ruby 将使用后引入的常量，且多次引入不会重新引入。

且在模块中的非模块方法（可以直接调用的，模块的自方法）同名时，引入模块的类实例没法精准指定具体方法，所以一定要注意。

```ruby
module C
    Name = 'lisi'

    def hello(name)
        p "#{Name} : hello," << name
    end

    # module_function :hello
end 

module B
    Name = 'zhangsan'

    def self.hello(name)
        p "#{Name} : hello," << name
    end

    # module_function :hello
end 


class A
    include C
    include B
    
    p Name # => "zhangsan"
    B.hello "wangwu" # => "zhangsan : hello,wangwu"
    # C.hello "wangwu" ## => 报NoMethodError (undefined method `hello' for C:Module)
    a = A.new
    a.hello "wangwu" # => "lisi : hello,wangwu" 因为在moduleB 中hello为自方法
end
```



## include & extend

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

`extend`也有一个叫`self.extended`的方法,作用和`include`中的`self.included`类似。

同时`included`方法可以用作文件夹在时的一些初始化操作：

```ruby
module A 
    def A.included(mod)       
      puts "#{self} included in #{mod}"     
    end   
end   
module Enumerable     
  include A   
end
# => prints "A included in Enumerable"
```

---

尤其值得注意的是，`self`其实就是调用的该类的一个单例类，可以从下面的例子看到：

```ruby
car = "car"

class << car
  def f1; puts "f1"; end
  def self.f2; puts "f2"; end
  
  class << self 
    def f3; puts "f3"; end
    def self.f4; puts "f4"; end
  end
end

car.f1									# => f1
car.singleton_class.f2	# => f2
car.singleton_class.f3	# => f3
car.singleton_class.singleton_class.f4	# => f4
```



参考资料：[《Ruby中include和extend的比较》](http://xuyao.club/blog/2015/06/29/include-vs-extend-in-ruby/)



# module引入

不同于类，`module`本身不能实例对象，所以`module`通过`extend`引入别的`module`时，其中打方法会被添加到自身的`metaclass`中，并且可以通过`module`名直接调用：

```ruby
module ExM
  def hello_exm
    puts 'hello exm'
  end
end

module InM
  def hello_inm
    puts 'hello inm'
  end
end
```

```ruby
module Base
  include InM;
  extend ExM;
end

Base.hello_exm
# => hello exm
Base.hello_inm
# => NoMethodError (undefined method `hello_inm' for Base:Module)
```

而`Base`通过`include`引入到方法则会在`Base`被其他`class`通过`include`引入时添加到`class`到实例方法中：

```ruby
class KLASS_IN
  include Base;
end

KLASS_IN.hello_inm
# => NoMethodError (undefined method `hello_inm' for KLASS_IN:Class)
KLASS_IN.new.hello_inm
# => hello inm
```

---

此时在`KLASS_IN`的`self`方法和实例的方法中都不能找到`hello_exm`方法：

```ruby
KLASS_IN.hello_exm
# => NoMethodError (undefined method `hello_exm' for KLASS_IN:Class)
KLASS_IN.new.hello_exm
# => NoMethodError (undefined method `hello_exm' for #<KLASS_IN:0x00007fbebd098610>)
```

可以先看一个例子：

```ruby
module SelfM
  def self.hello_self
    puts "hello myself"
  end
end

module Base
  include SelfM;
  extend SelfM;
end

Base.hello_self
# => NoMethodError (undefined method `hello_self' for Base:Module)
```

可以看到在`Base`中没有找到`SelfM`中的方法。`self`的方法其实存放在`metaclass`中。而ruby中的引入不会将`metaclass`中的方法引入。

所以在上面的例子中`ExM`中的方法已经被添加到了`Base`的`metaclass`中，所以`ExM`中的方法在`KLASS_IN`的`metaclass`和实例中都找不到对应方法。

---

如果`Base`被`extend`到其他到类，同样`ExM`中的方法不会被引入到该类中，而`InM`中到方法会被添加到该类的`metaclass`中：

```ruby
class KLASS_EX
  extend Base;
end

KLASS_EX.hello_inm
# => hello inm
KLASS_EX.hello_exm
# => NoMethodError (undefined method `hello_exm' for KLASS_EX:Class)
```

---

还有一点值得注意的是，`Module`类中提供了一个名为`module_function(*args)`的方法。其可以将指定的方法添加到当前的`module`中，并且同时在该`module`被其他类引入时，将方法添加到类的实例中。

```ruby
 module_function :mehtod_name
```

在缺省情况下，`module_function`调用之后会作用于其后添加的所有方法，类似`private`。



# Rails引入

## concern

`Rails`中的`ActiveSupport::Concern`通过其中的`append_features(base)`方法：

```ruby
def append_features(base)
  if base.instance_variable_defined?(:@_dependencies)
    base.instance_variable_get(:@_dependencies) << self
    return false
  else
    return false if base < self
    @_dependencies.each { |dep| base.include(dep) }
    super
    # look here!
    base.extend const_get(:ClassMethods) if const_defined?(:ClassMethods)
    base.class_eval(&@_included_block) if instance_variable_defined?(:@_included_block)
  end
end
```

使得引入了`ActiveSupport::Concern`的`module`可以在其被其他类`include`引入时，将其中名为`ClassMethods`的`module`中的方法添加到对应类的`metaclass`中。

```ruby
module InM
  def hello_inm
    puts 'hello inm'
  end
end

module BaseModel
  extend ActiveSupport::Concern
  include InM
  
  def hello_base
    puts 'hello base module'
  end
  
  module ClassMethods
  	def hello_record
      puts 'hello record'
    end
  end
end

class Re < ApplicationRecord
    include BaseModel
end

Re.hello_record
# => hello record
```

而其中的其他方法，或者在该`module`中通过`include`引入的其他`module`中的方法可以被引入到对应类的实例中。

```ruby
Re.new.hello_base
# => hello base module
Re.new.hello_inm
# => hello inm
```



## autoload_path

通过命令行调用`rails runner 'puts ActiveSupport::Dependencies.autoload_paths'`可以看到`Rails`配置的`autoload_paths`：

```bash
$ bin/rails runner 'puts ActiveSupport::Dependencies.autoload_paths'
...
/Users/boohee/works/ruby/polestar/app/controllers
/Users/boohee/works/ruby/polestar/app/controllers/concerns
/Users/boohee/works/ruby/polestar/app/jobs
/Users/boohee/works/ruby/polestar/app/mailers
/Users/boohee/works/ruby/polestar/app/models
/Users/boohee/works/ruby/polestar/app/models/concerns
/Users/boohee/works/ruby/polestar/app/services
...
```

这些路径下的`module`将会被`Rails`自动加载，这使得我们在使用对应的`module`时不用添加表示文件结构的命名空间

例如不使用`autoload_path`的情况下，在`app/modules`下添加共用的`module`:

```bash
.
└── commons
    └── soft_delete.rb
```

`soft_delete.rb`文件中`module`，必须添加命名空间`Commons`

```ruby
module Commons::SoftDelete
  extend ActiveSupport::Concern

  def delete
    update(deleted_at: Time.now)
  end

  def delete!
    update!(deleted_at: Time.now)
  end
end
```

在其他`Record`引入时也需要添加命名空间`Commons`：

```ruby
class User < ApplicationRecord
  include Common::SoftDelete
end
```

我们可以在项目根目录的`application.rb`中指定`Rails`自动将`app/modules/commons`加载，这使得我们可以省去在引入时使用命名空间：

```ruby
config.autoload_paths += Dir["#{config.root}/app/models/[a-z]*s/"] +
  Dir[Rails.root.join("app/workers")]
```

将`app/modules/commons/soft_delete.rb`文件的`module`修改为`module SoftDelete`，`Record`的引入则可以修改为：

```ruby
class User < ApplicationRecord
  include SoftDelete
end
```

**注：**`autoload_paths` 在初始化过程中计算并缓存。目录结构发生变化时，要重启服务器。spring可能会缓存`autoload_paths`，即使是重启了服务，修改目录后需要暂时关闭`spring`

