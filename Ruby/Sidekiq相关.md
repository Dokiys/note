# Sidekiq相关

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

# Worker
Sidekiq::Workers.new.each do |_, _, work|
  p work['payload']['class']
end

# Redis Acess
Sidekiq.redis { |redis| redis.keys }
 ```



## Cron Expression

```yaml
0 0 12 * * ?				Fire at 12:00 PM (noon) every day
0 15 10 ? * *				Fire at 10:15 AM every day
0 15 10 * * ?				Fire at 10:15 AM every day
0 15 10 * * ? *			Fire at 10:15 AM every day
0 15 10 * * ? 2005	Fire at 10:15 AM every day during the year 2005
0 * 14 * * ?				Fire every minute starting at 2:00 PM and ending at 2:59 PM, every day
0 0/5 14 * * ?			Fire every 5 minutes starting at 2:00 PM and ending at 2:55 PM, every day
0 0/5 14,18 * * ?		Fire every 5 minutes starting at 2:00 PM and ending at 2:55 PM, AND fire every 5 minutes starting at 6:00 PM and ending at 6:55 PM, every day
0 0-5 14 * * ?			Fire every minute starting at 2:00 PM and ending at 2:05 PM, every day
0 10,44 14 ? 3 WED	Fire at 2:10 PM and at 2:44 PM every Wednesday in the month of March
0 15 10 ? * MON-FRI	Fire at 10:15 AM every Monday, Tuesday, Wednesday, Thursday and Friday
0 15 10 15 * ?			Fire at 10:15 AM on the 15th day of every month
0 15 10 L * ?				Fire at 10:15 AM on the last day of every month
0 15 10 ? * 6L			Fire at 10:15 AM on the last Friday of every month
0 15 10 ? * 6L			Fire at 10:15 AM on the last Friday of every month
0 15 10 ? * 6L 2002-2005	Fire at 10:15 AM on every last friday of every month during the years 2002, 2003, 2004, and 2005
0 15 10 ? * 6#3			Fire at 10:15 AM on the third Friday of every month
0 0 12 1/5 * ?			Fire at 12 PM (noon) every 5 days every month, starting on the first day of the month
0 11 11 11 11 ?			Fire every November 11 at 11:11 AM
```

