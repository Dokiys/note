# CodeShow

## Ruby

### raise_error

```ruby
class Response
  def initialize(code = Code::SUCCESS, message = '', messages = [])
    @code = code
    @message = message
    @messages = messages
    @uuid = RequestStore.store[:request]&.uuid || SecureRandom.uuid
  end
  
  # 幽灵函数
  def method_missing(method_id, *arguments, &block)
    method_message = *arguments.join
    if (method_id.to_s =~ /^raise_[\w]+/) == 0
      error_type = method_id.to_s.split('raise_')[1].upcase!
      @code = "Response::Code::#{error_type}".constantize
      @message = method_message
      error_messages = arguments.first
      @messages = error_messages if error_messages.is_a?(Array)

      yield if block_given?

      raise StandardError.new(method_message)
    else
      super
    end
  end

  def self.rescue(catch_block = nil)
    response = self.new
    begin
      yield(response)
    rescue AtyunError => e
      log(e)
      catch_block.call if catch_block.present?
      response.code = Code::CUSTOM_ERROR
      response.message = e.message
    rescue => e
      log(e)
      catch_block.call if catch_block.present?
      response.code = Code::ERROR
      response.message = e.message
    end

    response
  end
end
```



### rescue_error

```ruby
5.times do |i|
  if_2_raise_error rescue StandardError and next
  log "run #{i}"
end
```



### catch_error

```ruby
def io
  yield
rescue TimeoutError => e1
  # Add a message to the exception without destroying the original stack
  e2 = TimeoutError.new("Connection timed out")
  e2.set_backtrace(e1.backtrace)
  raise e2
rescue Errno::ECONNRESET, Errno::EPIPE, Errno::ECONNABORTED, Errno::EBADF, Errno::EINVAL => e
  raise ConnectionError, "Connection lost (%s)" % [e.class.name.split("::").last]
end

def read
  io do
    value = connection.read
    @pending_reads -= 1
    value
  end
end

def write(command)
  io do
    @pending_reads += 1
    connection.write(command)
  end
end
```



### 默认参数选项

```ruby
def pop(timeout = 0.5, options = {})
  options, timeout = timeout, 0.5 if Hash === timeout
  timeout = options.fetch :timeout, timeout
  ...
end
```



### 循环

```ruby
# until
do_something until true_condition
# Example:
#		a = 0; b = []; b << a+=1 until (a == 3) 	#	b => [1 2 3]
  
# next
arr = ["A","2B","3C"]
arr = arr.each_with_object(Array.new) do |e, r|
  next r if (e.length == 1) && (r << e)
  next r if is_B_end? && (r << e.slice(-1))
end
# arr => ["A","B"]
```



### 循环缓存

```ruby
def current_trade(id)
  return @trade_cache[id] if @trade_cache[id].present?
  @trade_cache = {}
  @trade_cache = trades.find { |t| t.id == id }

  @trade_cache
end
```



### 测量消耗

```ruby
require 'benchmark'

def measure_gc_times
  yield && (return puts("GC: disabled")) if (ARGV[0] == "--no-gc")

  GC.start(full_mark: true, immediate_sweep: true, immediate_mark: false)
  c0 = GC.stat[:count]
  yield
  c1 = GC.stat[:count]

  puts "GC: #{c1 - c0} 次"
end

def measure_new_objects
  c0 = ObjectSpace.count_objects[:T_OBJECT]
  yield
  c1 = ObjectSpace.count_objects[:T_OBJECT]

  puts "new_object: #{c1 - c0}"
end

def measure_memory_usage
  # m0 = `ps -o rss= -p #{Process.pid}`.to_i
  m0 = `ps ax -o pid,rss | grep -E "^[[:space:]]*#{$$}"`.strip.split.map(&:to_i)[1]
  yield
  # m1 = `ps -o rss= -p #{Process.pid}`.to_i
  m1 = `ps ax -o pid,rss | grep -E "^[[:space:]]*#{$$}"`.strip.split.map(&:to_i)[1]

  puts("Memory: #{m1 - m0} KB")
end

def measure_time_spend
  time = Benchmark.realtime do
    yield
  end

  puts "Time: #{time.round(4)}"
end
```

```ruby
def measure(redo_times = 1)
  measure_gc_times do
    measure_new_objects do
      measure_memory_usage do
        measure_time_spend do
          yield until (redo_times -= 1).negative?
        end
      end
    end
  end
end
  
measure(5) do
  # do something...
end
# => Time: 5.9761
# => Memory: 16684 KB
# => new_object: 6389
# => GC: 1 次
```

### 事件回调

```ruby
#
# Callbacks
#

# 定义事件
EVENTS = [
  :row_success, :row_error, :row_processing, :row_skipped, :row_processed,
  :import_started, :import_finished, :import_failed, :import_aborted,
]

# sidekiq 中的事件直接保存为 hash-value 存方法，
# 这里 value 存数组，可以在一个事件上执行多个方法
def self.event_handlers
  @event_handlers ||= EVENTS.inject({}) { |hash, event| hash.merge({event => []}) }
end

# 挂载
def self.on(event, &block)
  raise "Unknown ActiveImporter event '#{event}'" unless EVENTS.include?(event)
  event_handlers[event] << block
end

# 触发事件
# 感觉这里的实例方法应该跟类方法分开，只让其中一个触发事件
# 注意这里传入的 param ，便于之后扩展
def fire_event(event, param = nil)
  self.class.send(:fire_event, self, event, param)
  unless self.class == ActiveImporter::Base
    self.class.superclass.send(:fire_event, self, event, param)
  end
end

def self.fire_event(instance, event, param = nil)
  event_handlers[event].each do |block|
    # instance_exec 执行事件代码
    # 在 sidekiq 中是 Proc 实例调用 call() 方法
    # block 也是一个 Proc 实例，也可以调用 call() 方法
    # 这里的 instance_exec() 也是一个 call() 相关的封装方法
    instance.instance_exec(param, &block)
  end
end

# 私有化
private :fire_event

class << self
  private :fire_event
end

# 执行方法
def import
  # 通过事务开启状态调用导入 module 的事务
  transaction do
    return if @book.nil?
    # 开始事件
    fire_event :import_started
    @data_row_indices.each do |index|
      @row_index = index
      @row = row_to_hash @book.row(index)
      if skip_row?
        # 跳过行事件
        fire_event :row_skipped
        next
      end
      import_row
      if aborted?
        # 放弃事件
        fire_event :import_aborted, @abort_message
        break
      end
    end
  end
rescue => e
  # 放弃事件
  fire_event :import_aborted, e.message
  raise
ensure
  # 结束事件
  fire_event :import_finished
end

def import_row
  begin
		# 保存记录
		# 这里可以扩展一下，读取数据并做自定义操作
    @model = fetch_model
    build_model
    save_model unless aborted?
  rescue => e
    @row_errors << { row_index: row_index, error_message: e.message }
    # 失败回调
    fire_event :row_error, e
    raise if transactional?
    return false
  end
  # 行保存完成回调
  fire_event :row_success
  true
ensure
  # 执行完回调
  fire_event :row_processed
end
```



### 随机等待重试

```ruby
def retries(times)
  result = nil
  times.times do |i|
    yield result if block_given?

    sleep_a_while i
  end

  result
end
```

```ruby
def sleep_a_while(i)
  # https://www.geogebra.org/graphing?lang=zh_CN
  # v1
  # f(x)=0.1 (0.3 (x-9)-3)^(2) (0.3 (x-9)+3)^(2)
  # x = i - rand
  # y = 0.1 * ((0.3 * (x - 9) - 3) ** 2) * ((0.3 * (x - 9) + 3) ** 2)

  # p "sleep #{y} seconds..."
  # sleep y
  
  # todo RangeError (NaN out of Time range)
  # v2
  # f(x)=log(1.4,x)+(0.2)/(x)
  # g(x)=log(1.6,x)+(0)/(x)
  c = 1.4 + (rand / 5)
  x = i
  y = Math.log(x, c) + (c / x)

  now = Time.now
	p "sleep #{y} seconds..."
  sleep y
  p "#{Time.now - now}"
end
```



## Rails

### 懒事务

```ruby
#
# Transactions
#
def self.transactional(flag = true)
  if flag
    raise "Model class does not support transactions" unless @model_class.respond_to?(:transaction)
  end
  @transactional = !!flag
end

def self.transactional?
  @transactional || false
end

def transactional?
  @transactional || self.class.transactional?
end

def transaction
  if transactional?
    model_class.transaction { yield }
  else
    yield
  end
end

private :transaction
```



### 大表添加索引

```sql
-- 假设需要添加索引的表为`fea_moni_res`
-- 1. 新建与表`fea_moni_res`同结构的表
CREATE TABLE fea_moni_res_tmp LIKE fea_moni_res;

-- 2. 新表上添加索引
ALTER TABLE fea_moni_res_tmp ADD INDEX idx_index_name (col_name);

-- 3. *rename*新表为原表的表名，原表换新的名称
RENAME TABLE fea_moni_res TO fea_moni_res_1, fea_moni_res_tmp TO fea_moni_res;

-- 4. 为原表新增索引，此步耗时较长
ALTER TABLE fea_moni_res_1 ADD INDEX idx_index_name (col_name);

-- 5. 待索引创建成功后，rename原表为原来的名称，并将新表里的数据导入到原表中
RENAME TABLE fea_moni_res TO fea_moni_res_tmp, fea_moni_res_1 TO fea_moni_res;
-- 需要根据业务来确定如果导入数据
INSERT INTO fea_moni_res(col_name1, col_name2) SELECT col_name1, col_name2 FROM fea_moni_res_tmp;
```



### batch_update

先记一个bug

```ruby
# obj.tap {|x| block }    -> obj
# 
# Yields self to the block, and then returns self.
# The primary purpose of this method is to "tap into" a method chain,
# in order to perform operations on intermediate results within the chain.
# 
#    (1..10)                  .tap {|x| puts "original: #{x}" }
#      .to_a                  .tap {|x| puts "array:    #{x}" }
#      .select {|x| x.even? } .tap {|x| puts "evens:    #{x}" }
#      .map {|x| x*x }        .tap {|x| puts "squares:  #{x}" }
def tap
  # This is a stub implementation, used for type inference (actual method behavior may differ)
  yield self; self
end
```

`tap`会改变`self`

 ```ruby
attrs = self.attribute_names.tap { |e| e.delete self.primary_key }
# => 会改变 self 中的 @attribute_names 值，应该使用拷贝值删减
attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }
 ```

**一定要注意对底层属性的更改操作，最好使用拷贝对象**

```ruby
def base_update(params, allow_nil = false)
  transaction do
    ids = params.require(:ids)
    attrs = check_nil(params, allow_nil).deep_symbolize_keys

    self.where(id: ids).update_all(attrs)
  end
end

# Return params with current <tt>ApplicationRecord</tt> attribute_names(except primary key).
# if allow_nil is +true+ ,passes blank value in params
def check_nil(params, allow_nil = false)
  params = permit_attr!(params, primary_key)
  params.reject { |_k, v| v.blank? } unless allow_nil == true

  params
end
```

```ruby
# Permit Record

# Return +params+ instance that include only record attributes
# and except given +args+ , no attributes permitted return {}
def permit_attr(params, *args)
  permit_attr!(params, args) rescue nil
end

# Performance as +permit_attr+, but raise error while illegal +params+
def permit_attr!(params, *args)
  params.permit(attribute_names - args.map(&:to_s))
end
```



### 关联替换

有Record如下：

```ruby
class AttachmentGroup < ApplicationRecord
  has_many :attachments, dependent: :destroy
  
  ...
end
```

其实例方法替换关联对象：

```ruby
def replace_atch(files, &_block)
  return [] if files.nil?
  # deal files to be replace
  temp_atchs = files.inject(Array.new) do |r, file|
    atch_params = Attachment.check_file(file)
    r << Attachment.find_or_initialize_by(atch_params) do |a|
      yield(a) if block_given?
      a.attachment_group_id = self.id
    end
  end

  # return replaced records
  proxy = self.attachments
  old_atchs = proxy.load_target.dup
  new_atchs = proxy.replace(temp_atchs)

  old_atchs - new_atchs
end
```



### 多数据源

```ruby
module OtherDB
  class BaseModel < ActiveRecord::Base
    self.abstract_class = true
    establish_connection "other_#{Rails.env}".to_sym
  end
end
```

```ruby
module OtherDB
  class SomeTable < BaseModel
    # ...
  end
end
```



### 间隔下载

```ruby
Rails.cache.fetch("download_interval", expires_in: 20.minutes) do
  # do download
  return render_success
end

render_fail('每次下载文件需要间隔20分钟！')
```



## 算法

### 埃拉托斯特尼筛法

Ruby实现素数筛选

![ertosthenes](../image/Ruby/CodeShow/Sieve_of_Eratosthenes_animation.gif)

```bash
index = 0
while primes[index]**2 <= primes.last
  prime = primes[index]
  primes = primes.select { |x| x == prime || x % prime != 0 }
  index += 1
end
```



### 快速排序

![849589-20171015230936371-1413523412](../image/Ruby/CodeShow/849589-20171015230936371-1413523412.gif)

```ruby
def quick_sort(array)
  return array if array.size <= 1
  array.shuffle!
  left, right = array[1..-1].partition {|n| n <= array.first}
  quick_sort(left) + [array.first] + quick_sort(right)
end
```



### 机器人指令

```ruby
class Robot
  module Sign
    LEFT = :left
    RIGHT = :right
    GO = :go
    BACK = :back
  end
  DIRECTION = ['N','E','S','W']
  DefualtOptions = {dist: 1}
  
  def initialize(signs)
    @direction = 0;
    @x, @y = 0, 0
    @signs = signs
    
    @options = DefualtOptions
  end
  
  def parse(opt = {})
    @options.merge!(opt)
  end
  
  def run
    return if @signs.length <= 0
    p 'star running'
    @signs.delete_if { |e| fire(e) }
  end
  
  def add_sign(sign)
    @signs << sign
    
    self
  end

  def where_am_i
    puts "My location is: (#{@x},#{@y})"
  end
  
  def what_is_my_direction
    puts "My direction is #{DIRECTION[@direction]}"
  end
  
  def my_signs
    puts "My signs: #{@signs}"
  end
  
  private
  
  def fire(event)
    send(event)
  end
  
  def left
    @direction = (@direction + 4 - 1) % 4
  end
  
  def right
    @direction = (@direction + 4 + 1) % 4
  end
  
  def go
    move()
  end
  
  def back
    move(flag: false)
  end
  
  def move(flag: true)
    dist = @options[:dist]
    union = dist * (flag ? 1 : -1)
    
    case DIRECTION[@direction]
    when 'N'
      @y += union
    when 'E'
      @x += union
    when 'S'
      @y -= union
    when 'W'
      @x -= union
    else
      raise StandardError,'no support command'
    end
    
  end
end

signs = [:back, :back, :right]
r = Robot.new(signs)
r.add_sign(Robot::Sign::GO).add_sign(Robot::Sign::GO)
# r.parse(dist: 2)

r.my_signs
r.what_is_my_direction
r.where_am_i
r.run
r.where_am_i
r.what_is_my_direction
r.my_signs
```

