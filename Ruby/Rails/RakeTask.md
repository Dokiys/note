# Rake Task

通过`Rails`生成`task`

```bash
 > rails generate task my_namespace mytask1 mytask2
```

执行后会生成文件`lib/tasks/my_namespace.rake`。其内容如下：

```ruby
namespace :my_namespace do
  desc "TODO"
  task mytask1: :environment do
  end

  desc "TODO"
  task mytask2: :environment do
  end

end
```

修改内容：

```ruby
desc "Hello work！"
task mytask1: :environment do
  p "Hello work!!"
end
```

执行：

```bash
> rake my_namespace:mytask1
"Hello work!!"
```

