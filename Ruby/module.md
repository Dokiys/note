# Module

***

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

## 模型中的常量

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



## 模块中的方法

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



## 模块中的同名问题

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



