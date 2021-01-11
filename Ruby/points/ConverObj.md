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



## Enumerable

### inject

```ruby
array = [1, 2, 3]

result = []
array.each { |e| result << e+1 }

result = array.inject(Array.new) { |r,e| r << e+1 }
# => [2, 3, 4]
```



### each or map

```ruby
array = [1, 2, 3]

result = []
array.each { |e| result << e+1 }			# => [1, 2, 3]
array																	# => [1, 2, 3]

result = array.map { |e| e+1 }				# => [2, 3, 4]
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



## Array

### 常用方法

```ruby
array = [1, 2, 3]

array.append(4)				# => [1, 2, 3, 4]
array.push(5)					# => [1, 2, 3, 4, 5]
```



### iterate

#### map

```ruby

```



### to_hash

一维数组转Hash

```ruby
array = [1, 2, 3]

hashs = array.inject([]) do |r, e|
  r << {num: e}
end
# hashs => [
#     [0] { :num => 1 },
#     [1] { :num => 2 },
#     [2] { :num => 3 }
# ]
```

二维数组转一维Hash数组

```ruby
array = [['a', 1], ['b', 2],['c',3]]

hashs = array.inject([]) do |r, e|
  r << {en: e[0], num: e[1]}
end	
# hashs => [
#    [0] { :a => 1, :b => 2 },
#    [1] { :a => 3, :b => 4 }
# ]
```



### to_str

```ruby
array = [1, 2, 3]

array.join()				# => "123"
```

### str_to

```ruby
str = "1,2,3"

str.split(',')			# => ["1","2","3"]
```



### merge

```ruby
a = [1,2,3] 
a |= [2,4]
# => [1,2,3,4]
```



### 去除空元素

```ruby
a = [nil, 1, [], 2, 'a', 'b', nil, '', "", 0]
nil_arr = [nil, '', []]

a -= nil_arr
```

