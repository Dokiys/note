# batch_update

```ruby
# Batch update <tt>ApplicationRecord</tt> by <tt>ActionController::Parameters</tt>
# The +params+ will be filtered through all attributes(except primary key) in <tt>ApplicationRecord</tt>
# And it will do nothing for blank attributes in params unless +allow_nil+ is +true+
#
#   params = ActionController::Parameters.new({
#     user_session_key: "dq12x8w1sa3ds81da3h6",
#     ids: [1235, 1681, 1456],
#     aus_id: "",
#     invoice_id: 15
#   })
#   School.batch_update(params)
#   # => #<Response:0x007feb7b049638 @code="20000", @message="", @messages=[]>
#
# Above, just will update invoice_company_id in schools
# To update columns with +nil+ or empty string:
#
#   params = ActionController::Parameters.new({
#     ids: [1235, 1681, 1456],
#     aus_id: ""
#   })
#   School.batch_update(params, true)
#   # => #<Response:0x007feb7b049638 @code="20000", @message="", @messages=[]>
def batch_update(params, allow_nil = false)
  response = Response.rescue do |res|
    transaction do
      ids = params.delete(:ids)
      # Check ids not nil and check class type
      res.raise_error("ids in params must exist and be an Array!") unless ids.is_a? Array

      # Get hash from columns which need to update
      # _attrs = self.attribute_names.tap { |e| e.delete self.primary_key }
			_attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }

      block = "lambda { |_k, _v| (_attrs.include? _k) " + (allow_nil ? "" : "&& _v.present? ") + "}"
      params.select! &eval(block)
      res.raise_error("No columns to update!") if params.blank?

      # Build sql
      t = self.table_name
      ids_sql = ids.join("','")
      column_sql = (params.map { |k, v| "#{k} = " + (v.present? ? "'#{v}'" : "NULL") }).join(", ")

      sql = <<~SQL
      UPDATE #{t} SET #{column_sql} WHERE #{t}.id IN ('#{ids_sql}');
      SQL
      ActiveRecord::Base.connection.execute(sql)
    end
  end

  response
end
```



### 记一个bug

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
# _attrs = self.attribute_names.tap { |e| e.delete self.primary_key }
# # => 会改变 self 中的 @attribute_names 值，应该使用拷贝值删减
_attrs = self.attribute_names.dup.tap { |e| e.delete self.primary_key }
 ```

### 一定要注意对底层属性的更改操作，最好使用拷贝对象

