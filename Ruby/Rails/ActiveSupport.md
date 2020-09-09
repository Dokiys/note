# Active Support核心扩展

## 概述

`Ruby on Rails `的一个扩展组件，默认不会加载任何功能，可以根据所需的功能自行加载。

`active support`gem包结构如下：

```bash
activesupport
  ├─lib
  │  ├─active_support       # 包含各种扩展功能对文件夹
  │  ├─active_support.rb		# 引入文件
```

甚至`active support`可以精确到只加载某方法：

```ruby
# 如 blank？方法在 active_support/core_ext/object/blank.rb 文件中定义
require 'active_support'
require 'active_support/core_ext/object/blank'
```

如果需要加载`active support`对`object`或者`class`所有对扩展可以将对应的文件夹引入：

```ruby
require 'active_support'
require 'active_support/core_ext/object'
require 'active_support/core_ext/class'
```

加入所有核心扩展或者所有扩展：

```ruby
require 'active_support'
require 'active_support/core_ext'		# 引入核心扩展

# 该引入并不会一下将所有扩展加入，有些功能通过 autoload 加入，会在真正使用的时候加载
require 'active_support/all' 				# 引入所有扩展
```

除非把 `config.active_support.bare` 设为 `true`，否则 Rails 应用不会加载 Active Support 提供的所有功能。即便全部加载，也是根据框架框架的设置加载所需功能。



## 对象扩展

### blank？& present？

Rails 应用中的空值：

- `nil` 和 `false`
- 只有空白的字符串 
- 空数组和空散列
- 其他能响应 `empty?` 方法，而且返回值为 `true` 的对象

**注：**0 和 0.0 等数字不是空值。

这两个方法分别用于判断空值或者值存在：

```ruby
token.blank? 			# token未空返回true
token.present?		# token存在返回true
```



### presence

`present?`返回的是`boolean`，而`presence`返回的是对象：

```ruby
host = config[:host].presence || 'localhost'
```



#### deep_dup

Ruby 在复制时不会拷贝内部对象，即浅拷贝：

```ruby
array     = ['string']
duplicate = array.dup
 
duplicate.push 'another-string'
 
# 创建了对象副本，因此元素只添加到副本中
array     # => ['string']
duplicate # => ['string', 'another-string']
 
duplicate.first.gsub!('string', 'foo')
 
# 第一个元素没有副本，因此两个数组都会变
array     # => ['foo']
duplicate # => ['foo', 'another-string']
```

`deep_dup`可以实现对象的深拷贝：

```ruby

array     = ['string']
duplicate = array.deep_dup
 
duplicate.first.gsub!('string', 'foo')
 
array     # => ['string']
duplicate # => ['foo']
```

如果复制的对象本身就不可复制，那么`deep_dup`直接返回该对象本身。



### try

`try`方法可以帮我们判断当前对象不为空时再执行调用的方法：

```ruby
unless @number.nil?
  @number.next
end

@number.try[:next]
```

`try`也可以接收代码块：

```ruby
@person.try { |p| "#{p.first_name} #{p.last_name}"}
```

**注：**`try`会吞没`NoMethodError`，如果想抛出该错误可以使用`try!`



### in?

测试某个对象是否在另一个对象中。如果传入的对象不能响应 `include?` 方法，抛出 `ArgumentError` 异常:

```ruby
1.in?([1,2])        # => true
"lo".in?("hello")   # => true
25.in?(30..50)      # => false
1.in?(1)            # => ArgumentError
```





## Module扩展

### 内部属性

Active Support 提供了 `attr_internal_reader`、`attr_internal_writer` 和 `attr_internal_accessor` 三个方法，其行为与 Ruby 内置的 `attr_*` 方法类似，但使用其他方式命名实例变量，从而减少重名的几率：

```ruby

# 库
class ThirdPartyLibrary::Crawler
  attr_internal :log_level # attr_internal 是 attr_internal_accessor 的别名
end
 
# 客户代码
class MyCrawler < ThirdPartyLibrary::Crawler
  attr_accessor :log_level
end
```

默认情况下，内部变量的名字前面有个下划线，上例中的内部变量名为 `@_log_level`。不过可使用 `Module.attr_internal_naming_format` 重新设置，可以传入任何 `sprintf` 方法能理解的格式，开头加上 `@` 符号，并在某处放入 `%s`（代表原变量名）。默认的设置为 `"@_%s"`。



### 方法委托

`delegate`提供了一种方法转发方式，即将某方法的调用转发给指定的关联对象：

```ruby
class User < ApplicationRecord
  has_one :profile
 
  def name
    profile.name		# 调用profile中的name方法并返回
  end
end
```

```ruby
# 使用delegate提供的方法转发
class User < ApplicationRecord
  has_one :profile
 
  delegate :name, to: :profile # 将调用的 name 方法转发给profile调用并返回值
end
```

`delegate` 方法可接受多个参数，委托多个方法：

```ruby
delegate :name, :age, :address, :twitter, to: :profile
```

`:prefix`选项可以给生成方法添加指定前缀：

```ruby
delegate :name, to: :profile, prefix: :my_prefix  => # 生成方法为：my_prefix_name
delegate :name, to: :profile, prefix: true  => # 生成方法为：profile_name
```

`:allow_nil`选项可以设置在委托对象抛出`NoMethodError`时，返回`nil`还是抛出`NoMethodError`错误：

```ruby
delegate :name, to: :profile, allow_nil: true		=> # profile没有name方法时返回nil
```



## Class扩展

### class_attribute

`class_attribute` 方法声明一个或多个可继承的类属性，它们可以在继承树的任一层级获取或覆盖：

```ruby
class A
  class_attribute :x
end
 
class B < A; end
 
class C < B; end
 
A.x = :a
B.x # => :a
C.x # => :a
 
C.x = :c
A.x # => :a
B.x # => :b
```

类属性还可以通过实例访问和覆盖：

```ruby
A.x = 1
 
a1 = A.new
a2 = A.new
a2.x = 2
 
a1.x # => 1, comes from A
a2.x # => 2, overridden in a2
```

类属性的选项可以设置是否可读或是否可写：

```ruby

class A
  class_attribute :a, instance_writer: false		# 不设置a的可写方法
  class_attribute :b, instance_reader: false		# 不设置b的可读方法
  # instance_reader 默认创建判断方法，即 c？可设置instance_predicate: false 取消创建判断方法
  class_attribute :c 
end
 
A.new.x = 1
A.new.b # NoMethodError
```



### cattr_*

`cattr_reader`、`cattr_writer` 和 `cattr_accessor` 的作用与相应的 `attr_*` 方法类似，不过是针对类的

它们声明的类属性，初始值为 `nil`，除非在此之前类属性已经存在，而且会生成相应的访问方法：

```ruby
class MysqlAdapter < AbstractAdapter
  # 生成访问 @@emulate_booleans 的类方法
  cattr_accessor :emulate_booleans
  self.emulate_booleans = true
end
```

可以把一个块传给 `cattr_*` 方法，设定属性的默认值：

```ruby

class MysqlAdapter < AbstractAdapter
  # 生成访问 @@emulate_booleans 的类方法，其默认值为 true
  cattr_accessor(:emulate_booleans) { true }
end
```

`catt_*`同`class_attribute`一样可以设置`:instance_reader`和`:instance_writer`选项以限制可读可写方法：

```ruby
module A
  class B
    # 不生成实例读值方法 first_name
    cattr_accessor :first_name, instance_reader: false
    # 不生成实例设值方法 last_name=
    cattr_accessor :last_name, instance_writer: false
    # 不生成实例读值方法 surname 和实例设值方法 surname=
    cattr_accessor :surname, instance_accessor: false
  end
end
```



## Numeric 的扩展

### 时间

使用 `from_now`、`ago` 等精确计算日期

以及增减 `Time` 对象时使用 `Time#advance`，例如：

```ruby
# 等价于 Time.current.advance(months: 1)
1.month.from_now
 
# 等价于 Time.current.advance(years: 2)
2.years.from_now
 
# 等价于 Time.current.advance(months: 4, years: 5)
(4.months + 5.years).from_now
```



### 格式化

一各种形式格式化数字：

```ruby

5551234.to_s(:phone)	# => 555-1234

1234567890.50.to_s(:currency)  # => $1,234,567,890.50

100.to_s(:percentage)		# => 100.000%

12345678.to_s(:delimited) 	 # => 12,345,678

111.2345.to_s(:rounded) 	# => 111.235

123.to_s(:human_size) 	# => 123 Bytes

1234.to_s(:human)		# => "1.23 Thousand"
```



## Array的扩展

### 获取

```ruby
%w(a b c d).to(2) # => %w(a b c)
[].to(7)          # => []


%w(a b c d).from(2)  # => %w(c d)
%w(a b c d).from(10) # => []
[].from(0)           # => []


# second_to_last 和 third_to_last 也是（first 和 last 是内置的）
%w(a b c d).third # => c
%w(a b c d).fifth # => nil
```

#### 添加

```ruby
# prepend 是Array#unshift的别名
%w(a b c d).prepend('e')  # => ["e", "a", "b", "c", "d"]
[].prepend(10)            # => [10]

# append 是Array#<<的别名
%w(a b c d).append('e')  # => ["a", "b", "c", "d", "e"]
[].append([1,2])         # => [[1, 2]]
```

#### 包装

`Array.wrap` 方法把参数包装成一个数组，除非参数已经是数组：

```ruby
Array.wrap(nil)       # => []
Array.wrap([1, 2, 3]) # => [1, 2, 3]
Array.wrap(0)         # => [0]
```

这个方法的作用与 `Kernel#Array` 类似，不过二者之间有些区别：

- 如果参数响应 `to_ary`，调用`to_ary`。如果 `to_ary` 的返回值是 `nil`，`Kernel#Array` 接着调用 `to_a`，`Array.wrap` 把参数作为数组的唯一元素，并将其返回。
- 如果 `to_ary` 的返回值既不是 `nil`，也不是 `Array` 对象，`Kernel#Array` 抛出异常，`Array.wrap` 返回那个值。



## Hash 的扩展

### 合并

Ruby 有个内置的方法，`Hash#merge`，用于合并两个散列：

```ruby
{a: 1, b: 1}.merge(a: 0, c: 2)		# => {:a=>0, :b=>1, :c=>2}

# merge可用于提供默认值
options = {length: 30, omission: "..."}.merge(options)

# ActiveSupport提供了reverse_merge方法，以防以上的相反的合并
options = options.reverse_merge(length: 30, omission: "...") 	#与上一行代码等价
```

