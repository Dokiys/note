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







```ruby
# 申请待递交
application_pending

# 申请已递交
application_delivered

# 已收到结果
result_received

# 已收到注册函
registration_received
```



