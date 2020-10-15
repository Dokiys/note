# Ruby中的闭包

闭包就是能够读取**其他函数内部变量**的**函数**。即，闭包是内部函数和外部函数链接的桥梁，其可以让我们在内部函数访问到外部函数的作用域。

闭包也是函数式编程的核心，这使得我们可以将函数作为参数传入另一个函数，或者将函数作为返回值返回。

Ruby 中使用`Method`和`Proc`两个类来表示函数。而故事往往要从另外一个小故事开始，就比如`block`



## Block-oriented Programming

```ruby
# 遍历输出0-5
(0..5).each do |n|
  p n
end

# 等价于
(0..5).each {|n| p n}
```

以上两种字面量（literal）即为`block`的两种常用形式。`block`为 Ruby 提供的语法糖，其中的代码并没有被赋值给某一个变量，而是在需要调用时使用`yield`调用执行。

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



## 函数式编程

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

