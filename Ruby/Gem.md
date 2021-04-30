# Gem



## gemfile

```ruby
source 'http://nexus.boohee.com/repository/gems-all/'
ruby '2.6.6'

gem 'rails', '~> 5.2.5'
gem 'annotate', '2.7.4'

group :development, :test do
  gem 'factory_bot_rails', '~> 4.8.2'
  gem 'pry-byebug'
end

group :development do
# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  gem 'capistrano-sidekiq', require: false,
      git: 'git@git.test.cn:ruby/capistrano-sidekiq.git',
      branch: 'v1.0.2-test-1'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
```

```ruby
* = Equal To "=1.0"
* != Not Equal To "!=1.0"
* > Greater Than ">1.0"
* < Less Than "<1.0"
* >= Greater Than or Equal To ">=1.0"
* <= Less Than or Equal To "<=1.0"
* ~> Pessimistically Greater Than or Equal To "~>1.0"
```

