# Collections

## Object

### `tap`

该方法常用于 collections 中一些转换不返回对象本身的方法，比如`delete`

```ruby
array = [1, 2, 3]

array.delete(2)				# => 2
array.tap { |a| a.delete(2) }	# => [1, 3]
# array => [1, 3]
```



## Hash

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



## Array

### 常用方法

```ruby
array = [1, 2, 3]

array.append(4)				# => [1, 2, 3, 4]
array.push(5)					# => [1, 2, 3, 4, 5]
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

