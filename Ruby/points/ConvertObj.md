# ConvertObj

## Object

### `tap`

该方法常用于 collections 中一些转换不返回对象本身的方法，比如`delete`

```ruby
array = [1, 2, 3]

array.delete(2)				# => 2
array.tap { |a| a.delete(2) }	# => [1, 3]
# array => [1, 3]
```

`dup`&`clone`

`dup`只获取到对象的值，而`clone`会用获取到的值调用`initialize`方法新建一个对象

需要注意的是，`dup`和`clone`都是浅拷贝，对于数组中的元素仍然是引用值

```ruby
arr = ["A", "B", "C"]

arr.dup.each { &:downcase }
# arr => ['a', 'b' , 'c']
arr.clone.each { &:downcase }
# arr => ['a', 'b' , 'c']
```

### 常用方法

```ruby
# 查看某实例或者类的所有方法
Object.methods
Object.new.methods
```

判断类型

```ruby
module M;    end
class A
  include M
end
class B < A; end
class C < B; end

# 判断某对象是否属于某类
b = B.new
b.instance_of? B	# => true
b.is_a? A         #=> true
b.is_a? M         #=> true
b.kind_of? M      #=> true

# 子父类继承
A.ancestors 			# => [A, M, Object, Kernel, BasicObject]
B.superclass			# => A
```





## Enumerable

### inject

> ```ruby
> # enum.reduce(initial, sym) -> obj
> # enum.reduce(sym)          -> obj
> # enum.reduce(initial) { |memo, obj| block }  -> obj
> # enum.reduce          { |memo, obj| block }  -> obj
> ```
>
> The <i>inject</i> and <i>reduce</i> methods are aliases.

向传入参数中依次执行传入的方法或者块，方法中的返回值作为下一次循环的传入参数，并在执行完返回

```ruby
arr = [1, 2, 3]

arr.inject(:+)
# => 6

result = arr.inject(Array.new) { |r,e| r << e+1 }
# => [2, 3, 4]

result = arr.inject(Array.new) { |r,e| r << e+1; p e }
# => 3
```



### each_with_object

对`enum` 中每一个元素操作，传入参数可以作为方法块的第二个参数使用

```ruby
arr = [1,2,3]

result = arr.each_with_object(Array.new) { |e,r| r << e+1; p e }
# => [2,3,4]
```



### each or map

```ruby
array = [1, 2, 3]

result = []
array.each { |e| result << e+1 }			# => [1, 2, 3]
array																	# => [1, 2, 3]

result = array.map { |e| e+1 }				# => [2, 3, 4]
array																	# => [1, 2, 3]
result = array.flat_map { |e| [e, -e] } 				#=> [1, -1, 2, -2, 3, -3]
array																	# => [1, 2, 3]

```



## Hash

### 创建

```ruby
h1 = {a:'1'}			# => {:a => "1"}
h2 = {:a =>'1'}		# => {:a => "1"}
h3 = {'a' => '1'}	# => {"a"=>"1"}

h1 == h2					# => true
h1 == h3 					# => false
```

定义方法时的默认Hash

 ```ruby
class MyHash
  def self.hello(var = false)
    p var
  end

  def self.work(var: false)
    p var
  end
end

MyHash.hello
=> false
MyHash.hello(Object.new)	 
=> #<Object:0x00007fc0b718ede8>


MyHash.work
=> false

MyHash.work(Object.new)
=> ArgumentError (wrong number of arguments (given 1, expected 0))

MyHash.work(var: Object.new, obj:1, str:2)
=> ArgumentError (unknown keywords: obj, str)

MyHash.work(obj: Object.new)
=> ArgumentError (unknown keyword: obj)

MyHash.work(var: Object.new)
=> #<Object:0x00007fe426835510>
 ```



### 常用方法

```ruby
hash = {a: '1', b: false}

hash.each_key { |k| block }
hash.each_value { |v| block }
hash.each_pair	{ |k, v| block }
hash.each { |e| block }
hash.transform_key { |k| block }
hash.transform_values { |v| block }

hash.fetch(:b, true)					# => false
hash.values_at(:a, :b)				# => ["1", false]
```



### hash_to_obj

```ruby
hash = {user_id: 1, real_name:'zhangsan'}
obj = OpenStruct.new(hsh)
obj.user_id	# => 1
```



### ActiveRecorde _to_hash

```ruby
user = User.first
attr = user.attributes
attr.class
# => Hash < Object
```



### deep_values

```ruby
def deep_values(obj, &block)
  case obj
  when Hash
    obj.keys.each do |k|
      obj[k] = yield deep_values(obj[k], &block)
    end
    obj
  when Array
    obj.map! { |e| deep_values(e, &block) }
  else
    yield obj
  end
end
```



## Array

### 常用方法

```ruby
arr = [1, 2, 3]
arr = [*1..3]

arr.append(4)				# => [1, 2, 3, 4]
arr.push(5)					# => [1, 2, 3, 4, 5]
arr.any? { |e| e = 2}	# => true
arr.delete(4)				# => 4
arr.delete_at(3)		# => 5

array.product([1,2])		# => [[1, 1], [1, 2], [2, 1], [2, 2], [3, 1], [3, 2]]
array.each_slice(2) { |e1,e2| p "#{e1},#{e2}" } 	
# => "1,2"
# => "3,"
```



### 遍历

```ruby
# 组遍历
(1..3).each_cons(2) { |a, b| p a: a, b: b }
# => {:a=>1, :b=>2}
# => {:a=>2, :b=>3}
(1..3).each_slice(2) { |a, b| p a: a, b: b }
# => {:a=>1, :b=>2}
# => {:a=>3, :b=>nil}

# range遍历
arr = ['a','b','c']
(1..arr.size).step(2).map{|i| arr[i-1]}		# => ['a', 'c']
1.step(arr.length, 2) { |i| print "#{arr[i]}," }	# => 'a','c',
```



### merge

```ruby
a = [1,2,3] 
a |= [2,4]
# => [1,2,3,4]
```

某些情况下对某个有可能为`nil`的变量添加值或者创建数组：

```ruby
arr = ["AA1","BB2","BB3"]
arr.inject({}) do |r, e|
  k = e[0..-2]
  v = e[-1]
  # r.merge!(k => (r[k].nil? ? [] << v : r[k] << v))
  r.merge!(k => ([v] | r[k].to_a))
end
```





### 去除空元素

```ruby
a = [nil, 1, [], 2, 'a', 'b', nil, '', "", 0]
nil_arr = [nil, '', []]

a -= nil_arr
```



## String

### 字符串替换

```ruby
# 字符串占位替换
str = "Hello %{what}%{operator}"
params = { what:'Work', operator:'!' }

str % params		# => "Hello Work!"
```

### 分组正则匹配替换

```ruby
str = "-2x-x+3x-6x=-x+2"

# 将系数为1的x添加1 
str.gsub(/([=+-])x/,'\11x')		# => "-2x-1x+3x-6x=-1x+2"
```

​	其中`([=+-])`在替换的字符串中的表示为`\1`



## Time

### 常用方法

```ruby
Time.now					# => 当前时间
Date.today				# => 今天
Time.now.utc			# => UTC时间，国际标准时间
(Time.now - 1.day).now.beginning_of_day		# => 昨天的开始
(Time.now - 1.week).at_end_of_week	# => 上周的结束
```

### 日期格式输出

```ruby
Time.now.strftime('%Y-%m-%d %H:%M:%S')
# => "2021-03-05 18:08:08"
Time.now.strftime('%Y-%m-%d')
# => "2021-03-05"
Time.now.strftime('%Y年%m月%d日 %H:%M:%S')
# => "2021年03月05日 18:09:03"
```

