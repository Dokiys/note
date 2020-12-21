# RubyStyleGuide

## raise error

```ruby
raise SomeException, 'message'

# 捕获异常返回 nil
do_something rescue nil
```

## swap var

```ruby
a = 'foo'
b = 'bar'

a, b = b, a
puts a # => 'bar'
puts b # => 'foo'
```

## 数组

### flatten

```ruby
def flatten_once!
  res = []

  each do |e|
    [*e].each { |f| res << f }
  end

  replace(res)
end
```

### 获取

```ruby
# good - use with splat
first, *list = [1, 2, 3, 4] # first => 1, list => [2, 3, 4]

hello_array = *'Hello' # => ["Hello"]

a = *(1..3) # => [1, 2, 3]
```

### `||=`

```ruby
# WARNING: would set enabled to true even if it was false
enabled ||= true
```

### `&&=`

如果存在则赋值

 ```ruby
# bad
something = something ? something.downcase : nil

# ok
something = something.downcase if something

# better（just nil）
something &&= something.downcase
 ```

### 解构

```ruby
# good - this comma is meaningful for array destructuring
[[1, 2, 3], [4, 5, 6]].map { |a,| a }
# => [
# 	[0] 1,
#		[1] 4
# ]
```



## Class

`Class` definitions

```ruby
class Person
  # extend and include go first
  extend SomeModule
  include AnotherModule

  # inner classes
  CustomError = Class.new(StandardError)

  # constants are next
  SOME_CONSTANT = 20

  # afterwards we have attribute macros
  attr_reader :name

  # followed by other macros (if any)
  validates :name

  # public class methods are next in line
  def self.some_method
  end

  # initialization goes between class methods and other instance methods
  def initialize
  end

  # followed by other public instance methods
  def some_method
  end

  # protected and private methods are grouped near the end
  protected

  def some_protected_method
  end

  private

  def some_private_method
  end
end
```

`Class`structrue

```ruby
# foo.rb
class Foo
  # 30 methods inside
end

# foo/bar.rb
class Foo
  class Bar
    # 30 methods inside
  end
end

# foo/car.rb
class Foo
  class Car
    # 20 methods inside
  end
end
```

`Class`namespace

```ruby
module Utilities
  class Queue
  end
end

# bad
class Utilities::Store
  Module.nesting # => [Utilities::Store]

  def initialize
    # Refers to the top level ::Queue class because Utilities isn't in the
    # current nesting chain.
    @queue = Queue.new
  end
end

# good
module Utilities
  class WaitingList
    Module.nesting # => [Utilities::WaitingList, Utilities]

    def initialize
      @queue = Queue.new # Refers to Utilities::Queue
    end
  end
end
```

### to_s

Always supply a proper `to_s` method for classes that represent domain objects.

## Module

`module_function`

```ruby
# good
module Utilities
  module_function

  def parse_something(string)
    # do stuff here
  end

  def other_utility_method(number, string)
    # do some more stuff
  end
end
```



## Hash

```ruby
# bad
hash.keys.each { |k| p k }
hash.values.each { |v| p v }
hash.each { |k, _v| p k }
hash.each { |_k, v| p v }

# good
hash.each_key { |k| p k }
hash.each_value { |v| p v }
```

### 获取

```ruby
heroes = { batman: 'Bruce Wayne', superman: 'Clark Kent' }
# bad
heroes[:supermann] # => nil

# good - fetch raises a KeyError making the problem obvious
heroes.fetch(:supermann)
heroes.fetch(:supermann, 'Defualt Value')
# good - blocks are lazy evaluated, so only triggered in case of KeyError exception
batman.fetch(:powers) { obtain_batman_powers }
```

### 转换

```ruby
# good
{a: 1, b: 2}.transform_values { |v| v * v }
{a: 1, b: 2}.transform_keys { |k| k.to_s }
```



## Number

```ruby
# good - much easier to parse for the human brain
num = 1_000_000
```

```ruby
# bad
a.to_f / b.to_f

# good
a.fdiv(b)
```

```ruby
# bad
x == 0.1
x != 0.1

# good - using BigDecimal
x.to_d == 0.1.to_d
# good
tolerance = 0.0001
(x - 0.1).abs < tolerance
```

```ruby
# bad
do_something if x >= 1000 && x <= 2000

# good
do_something if (1000..2000).include?(x)

# good
do_something if x.between?(1000, 2000)
```

## String

### 引号

```ruby
a = 1
"#{a}" # => "1"
'#{a}' # => "\#{a}"

"'#{a}' test" # => "'1' test"
```

### new

```ruby
# bad
email_with_name = user.name + ' <' + user.email + '>'

# good
email_with_name = "#{user.name} <#{user.email}>"
```

### 拼接

When you need to construct large data chunks, use `String#<<`.  `String#+` creates a bunch of new string objects.

```ruby
html = ''
html += '<h1>Page title</h1>'

# bad
paragraphs.each do |paragraph|
  html += "<p>#{paragraph}</p>"
end

# good and also fast
paragraphs.each do |paragraph|
  html << "<p>#{paragraph}</p>"
end
```

同时也不应该在长字符串中使用`+`，因为这会创建多个字符串

```ruby
# bad
str = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
"when an unknown printer took a galley of type and scrambled it to make a type."

# good
str = <<~LOREM
  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
  when an unknown printer took a galley of type and scrambled it to make a type.
LOREM
```

长字符替换

```ruby
str = <<~LOREM.gsub('Lorem','AAAAA')
  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
  when an unknown printer took a galley of type and scrambled it to make a type.
LOREM
```

```ruby

# good
foo(<<~SQL)
  select foo from bar
SQL
```

### 替换

```ruby
url = 'http://example.com'
str = 'lisp-case-rules'

# bad
url.gsub('http://', 'https://')
str.gsub('-', '_')

# good
url.sub('http://', 'https://')
str.tr('-', '_')
```

### 匹配

```ruby
foo = 'I am an example string'

# bad - using a regular expression is an overkill here
foo ~= /example/

# good
foo['example']
foo[/a.*s/]
```

```ruby
# bad
/(regexp)/ =~ string
# some code
process Regexp.last_match(1)

# good
/(?<meaningful_var>regexp)/ =~ string
# some code
process meaningful_var

m = /(?<a>FOO)(?<b>BAR)/.match('FOOBAR')
=> #<MatchData "FOOBAR" a:"FOO" b:"BAR">
```

```ruby
str = "111 100a 11bb"
r = %r|\w{1,2}\d{2,5}|	# => /\w{1,2}\d{2,5}/

str.match(t)						# => #<MatchData "111">
```

