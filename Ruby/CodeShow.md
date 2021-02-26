# CodeShow

## raise_error

```ruby
class Response
  def initialize(code = Code::SUCCESS, message = '', messages = [])
    @code = code
    @message = message
    @messages = messages
    @uuid = RequestStore.store[:request]&.uuid || SecureRandom.uuid
  end

  def method_missing(method_id, *arguments, &block)
    method_message = *arguments.join
    if (method_id.to_s =~ /^raise_[\w]+/) == 0
      error_type = method_id.to_s.split('raise_')[1].upcase!
      @code = "Response::Code::#{error_type}".constantize
      @message = method_message
      error_messages = arguments.first
      @messages = error_messages if error_messages.is_a?(Array)

      # FIXME: 兼容邮件处理转发的情况，可能需要传递block
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
      response.code = Code::ATYUN_ERROR
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



## next

```ruby
arr = ["A","2B","3C"]
arr = arr.inject(Array.new) do |r, e|
  next r if (e.length == 1) && (r << e)
  next r if is_B_end? && (r << e.slice(-1))

  r
end
# arr => ["A","B"]
```



## 默认参数选项

```ruby
  def pop(timeout = 0.5, options = {})
    options, timeout = timeout, 0.5 if Hash === timeout
    timeout = options.fetch :timeout, timeout
    ...
  end
```



## 循环

```ruby
do_something until true_condition
# Example:
#		a = 0; b = []; b << a+=1 until (a == 3) 	#	b => [1 2 3]
```



## 前置操作

```ruby
def process(commands)
  logging(commands) do
    ensure_connected do
      # ... do something
    end
  end
end
```



## Catch Error

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



## 测量消耗

```ruby
# helpers.rb
require 'benchmark'

def print_memory_usage
  memory_before = `ps -o rss= -p #{Process.pid}`.to_i
  yield
  memory_after = `ps -o rss= -p #{Process.pid}`.to_i

  puts "Memory: #{((memory_after - memory_before) / 1024.0).round(2)} MB"
end

def print_time_spent
  time = Benchmark.realtime do
    yield
  end

  puts "Time: #{time.round(2)}"
end
```

```ruby
print_memory_usage do
  print_time_spent do
    p "hello work!"
  end
end
# => "hello work!"
# => Time: 0.0
# => Memory: 0.0 MB
```



## 懒事务

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



## 事件回调

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



## 埃拉托斯特尼筛法

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

