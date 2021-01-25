# CodeShow

## batch_update

记一个bug

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
_attrs = self.attribute_names.tap { |e| e.delete self.primary_key }
# => 会改变 self 中的 @attribute_names 值，应该使用拷贝值删减
_attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }
 ```

**一定要注意对底层属性的更改操作，最好使用拷贝对象**



### V1

```ruby
# Batch update <tt>ApplicationRecord</tt> with single SQL
# +params+ will be filtered by current <tt>ApplicationRecord</tt>.attributes(except primary key)
def batch_update_v2(params, relation, allow_nil = false)
  transaction do
    # Build condition by relation
    where_sql = relation.try(:where_sql) || raise(StandardError.new("Illegal parameter: #{relation}"))
    binds = relation.where_clause.binds

    # Build update columns
    params = _check_nil(params, allow_nil)
    t = self.table_name.freeze
    column_sql = (params.map { |k, v| "\"#{k}\" = " + (v.present? ? "'#{v}'" : "NULL") }).join(", ")

    # Execute SQL
    sql = <<~SQL
    UPDATE #{t} SET updated_at = NOW(), #{column_sql} #{where_sql}
    SQL
    ActiveRecord::Base.connection.exec_query(sql, 'SQL', binds)
    raise StandardError.new(sql)
  end
end

# Return params with current <tt>ApplicationRecord</tt> attribute_names(except primary key).
# If allow_nil is +true+ ,passes +nil+ value in params,
# raise Error if no columns passed
def _check_nil(params, allow_nil = false)
  _attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }

  block = "lambda { |_k, _v| (_attrs.include? _k.to_s) " + (allow_nil ? "" : "&& _v.present? ") + "}"
  params.select! &eval(block)
  params.present? ? params : raise(StandardError.new("No columns to update!"))
end
```



### V2

```ruby
# Batch update <tt>ApplicationRecord</tt> by <tt>ActionController::Parameters</tt>
# The +params+ will be filtered through all attributes(except primary key) in <tt>ApplicationRecord</tt>
# And will do nothing for blank attributes in params unless +allow_nil+ is +true+
def batch_update(params, allow_nil = false)
  ids = params.delete(:ids)

  params = _check_nil(params, allow_nil)
  self.where(:id => ids).update_all(params)
end

def _check_nil(params, allow_nil: false)
  _attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }

  block = "lambda { |_k, _v| (_attrs.include? _k.to_s) #{allow_nil ? "" : "&& _v.present?"}"
  params.select! &eval(block)
  params.present? ? params.symbolize_keys : raise(StandardError, "No columns to update!")
end
```



### V3

```ruby
def base_update(params, allow_nil = false)
  transaction do
    ids = params.require(:ids)
    attrs = HashWithIndifferentAccess.new(_check_nil(params, allow_nil))

    self.where(id: ids).update_all(attrs)
  end
end

# Return params with current <tt>ApplicationRecord</tt> attribute_names(except primary key).
# if allow_nil is +true+ ,passes blank value in params
def _check_nil(params, allow_nil = false)
  params = permit_attr!(params, primary_key)
  params.reject { |_k, v| v.blank? } unless allow_nil == true

  params
end

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

