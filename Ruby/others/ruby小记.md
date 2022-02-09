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



# Gem



## gemfile

```ruby
source 'http://nexus.boohee.com/repository/gems-all/'
ruby '2.6.6'

gem 'rails', '~> 5.2.5'
gem 'annotate', '2.7.4'

group :development, :test do
  gem 'factory_bot_rails', '~> 4.8.2'
  gem 'pry-byebug'
end

group :development do
# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  gem 'capistrano-sidekiq', require: false,
      git: 'git@git.test.cn:ruby/capistrano-sidekiq.git',
      branch: 'v1.0.2-test-1'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
```

```ruby
* = Equal To "=1.0"
* != Not Equal To "!=1.0"
* > Greater Than ">1.0"
* < Less Than "<1.0"
* >= Greater Than or Equal To ">=1.0"
* <= Less Than or Equal To "<=1.0"
* ~> Pessimistically Greater Than or Equal To "~>1.0"
```

# Sidekiq

## start

引入`Sidekiq::worker`重写`perform`方法

```ruby
class RewardPolicyWorkers::ExportListWorker
	# 引入
  include Sidekiq::Worker

  sidekiq_options queue: queue_name, retry: 2, dead: false, backtrace: true

  def perform(params)
    # do something hither...
  end

end
```

`sidekicks_options`中的`queue`选项可在`sidekiq.yml`的`:queues:`设置并选择

调用时传入的`params`将会被序列化，传入的对象需要重新实例化：

```ruby
RewardPolicyWorkers::ExportListWorker.perform_async(params.to_json)
```

```ruby
def perform(params)
  # Init params
  params = ActionController::Parameters.new(JSON.parse(params))
  # do something hither...
end
```



## Debug

对`Worker`里的方法进行断点调试，可以在 Rubymine 中启动 `sidekiq`：

1. Rubymine `Edit Configuration` => ➕ => `Gem Commend`
2. `Configuration` 中设置 `Gem name: sidekiq`，并设置`Executable name: sidekiq`
3. `Bundler` 中勾选 `Run the script in context of the bundle (bundle exec)`
4. `Apply`



## Monitor

 ```ruby
require 'sidekiq/api'

# 1. Clear retry set
Sidekiq::RetrySet.new.clear

# 2. Clear scheduled jobs 
scheduled_queue = Sidekiq::ScheduledSet.new
scheduled_queue.clear

# 3. Clear 'Processed' and 'Failed' jobs
Sidekiq::Stats.new.reset

# 3. Clear 'Dead' jobs statistics
Sidekiq::DeadSet.new.clear

# Stats
stats = Sidekiq::Stats.new
stats.queues
# {"production_mailers"=>25, "production_default"=>1}
stats.enqueued
stats.processed
stats.failed

# Queue
queue = Sidekiq::Queue.new('queue_name')
queue.count
queue.clear
queue.each { |job| job.item } # hash content

# Worker
Sidekiq::Workers.new.each do |_, _, work|
  p work['payload']['class']
end

# Redis Acess
Sidekiq.redis { |redis| redis.keys }
 ```



# Algorithms

## 埃拉托斯特尼筛法

Ruby实现素数筛选

![ertosthenes](../../asset/Other/Algorithms/Sieve_of_Eratosthenes_animation.gif)

```bash
index = 0
while primes[index]**2 <= primes.last
  prime = primes[index]
  primes = primes.select { |x| x == prime || x % prime != 0 }
  index += 1
end
```



## 分治

#### 快速排序

![849589-20171015230936371-1413523412](../../asset/Other/Algorithms/849589-20171015230936371-1413523412.gif)

```ruby
def quick_sort(array)
  return array if array.size <= 1
  array.shuffle!
  left, right = array[1..-1].partition {|n| n <= array.first}
  quick_sort(left) + [array.first] + quick_sort(right)
end
```



#### 查找无序数组里面第K大的值

```ruby
def dc(arr, k)
  return 'err' if k > arr.length || !k.positive?
  mid = arr.pop
  left = []
  right = []
  arr.each do |e|
    e <= mid ? right << e : left << e
  end

  if left.length >= k
    dc(left, k)
  elsif left.length + 1 == k
    return mid
  else
    dc(right, k - left.length - 1)
  end
end
```

