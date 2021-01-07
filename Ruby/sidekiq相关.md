# sidekiq相关

## start

引入`Sidekiq::worker`重写`perform`方法

```ruby
class RewardPolicyWorkers::ExportListWorker
	# 引入
  include Sidekiq::Worker

  sidekiq_options queue: queue_name, retry: 2, dead: false, backtrace: true

  def perform(params)
    # do something hither...
  end
```

`sidekicks_options`中的`queue`选项可在`sidekiq.yml`的`:queues:`设置并选择

调用时传入的`params`将会被序列化，传入的对象需要重新实例化：

```ruby
RewardPolicyWorkers::ExportListWorker.perform_async(params.to_json)
```

```ruby
def perform(params)
  # Init params
  params = ActionController::Parameters.new(JSON.parse(params))
  # do something hither...
end
```



## Debug

对`Worker`里的方法进行断点调试，可以在 Rubymine 中启动 `sidekiq`：

1. Rubymine `Edit Configuration` => ➕ => `Gem Commend`
2. `Configuration` 中设置 `Gem name: sidekiq`，并设置`Executable name: sidekiq`
3. `Bundler` 中勾选 `Run the script in context of the bundle (bundle exec)`
4. `Apply`



## Monitor

 ```ruby
require 'sidekiq/api'

# 1. Clear retry set
Sidekiq::RetrySet.new.clear

# 2. Clear scheduled jobs 
scheduled_queue = Sidekiq::ScheduledSet.new
scheduled_queue.clear

# 3. Clear 'Processed' and 'Failed' jobs
Sidekiq::Stats.new.reset

# 3. Clear 'Dead' jobs statistics
Sidekiq::DeadSet.new.clear

# Stats
stats = Sidekiq::Stats.new
stats.queues
# {"production_mailers"=>25, "production_default"=>1}
stats.enqueued
stats.processed
stats.failed

# Queue
queue = Sidekiq::Queue.new('queue_name')
queue.count
queue.clear
queue.each { |job| job.item } # hash content

# Redis Acess
Sidekiq.redis { |redis| redis.keys }
 ```

