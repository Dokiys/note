

# READING

## Code Style

[rails_style](https://rails.rubystyle.guide)

[ruby_style](https://rubystyle.guide)

## 面向对象设计的六大原则

https://cloud.tencent.com/developer/article/1428120

> 单一职责原则：一个类应该只负责一件事情。
>
> 开闭原则：对于扩展是开放的，但是对于修改是关闭的。
>
> 里氏替换原则：所有引用基类的地方必须能够透明地使用其子类的对象。
>
> 依赖倒置原则：高层模块不应该依赖底层模块，两者都应该依赖其抽象 抽象不应该依赖细节 细节应该依赖抽象
>
> 接口隔离原则：客户端不应该依赖他不需要的接口
>
> 迪米特原则：一个对象应该对其他对象保持最小的了解。



## IT技术两大难题：命名和缓存。

如何运用Rails cache来提升RESTful API JSON响应速度，可参考：

[1] [Caching with Rails: An Overview — Ruby on Rails Guides - https://guides.rubyonrails.org/caching_with_rails.html](https://guides.rubyonrails.org/caching_with_rails.html)

[2] [How to Improve Website Performance With Caching in Rails ― Scotch.io - https://scotch.io/tutorials/how-to-improve-website-performance-with-caching-in-rails](https://scotch.io/tutorials/how-to-improve-website-performance-with-caching-in-rails)

[3] [rails/jbuilder: Jbuilder: generate JSON objects with a Builder-style DSL - https://github.com/rails/jbuilder](https://github.com/rails/jbuilder)

[4] [yonahforst/jbuilder_cache_multi - https://github.com/yonahforst/jbuilder_cache_multi](https://github.com/yonahforst/jbuilder_cache_multi)

[5] [yonahforst/scope_cache_key: Add cache_key functionality to ActiveRecord scopes - https://github.com/yonahforst/scope_cache_key - https://github.com/yonahforst/scope_cache_key](https://github.com/yonahforst/scope_cache_key)



## Ruby & YAML

[YAML.rb is YAML for Ruby | Cookbook - https://yaml.org/YAML_for_ruby.html](https://yaml.org/YAML_for_ruby.html)

[1] [3 YAML tips for better pipelines | GitLab - https://about.gitlab.com/blog/2020/10/01/three-yaml-tips-better-pipelines/](https://about.gitlab.com/blog/2020/10/01/three-yaml-tips-better-pipelines/)

https://stackoverflow.com/questions/5866015/rails-3-how-use-an-env-config-vars-in-a-settings-yml-file



## Rails 单元测试

Rails单元测试、功能测试和端到端测试可以参考这些

Testing Rails Applications — Ruby on Rails Guides
https://guides.rubyonrails.org/testing.html

https://rspec.info/documentation/4.0/rspec-rails/
File: README — Documentation by YARD 0.9.24

DatabaseCleaner/database_cleaner: Strategies for cleaning databases in Ruby. Can be used to ensure a clean state for testing.
https://github.com/DatabaseCleaner/database_cleaner



## JWT

[JWT入门与实战](https://libin1991.github.io/2018/11/02/JWT%E5%85%A5%E9%97%A8%E4%B8%8E%E5%AE%9E%E6%88%98/)

[JSON Web Token (JWT)生成Token及解密实战。](https://zhuanlan.zhihu.com/p/64809302)



## Other

[优秀架构师必须掌握的架构思维](http://www.uml.org.cn/zjjs/201807034.asp)

[如何精确评估开发时间](https://cloud.tencent.com/developer/article/1449477)

> 运行rails db:migration执行迁移后，记得运行 $ annotate 来自动更新注释

[Bulk insert support in Rails 6 | BigBinary Blog](https://blog.bigbinary.com/2019/04/15/bulk-insert-support-in-rails-6.html)

Rails Spring缓存加速

[Flexible authentication solution for Rails with Warden.](https://github.com/heartcombo/devise)

[bullet:help to kill N+1 queries and unused eager loading](https://github.com/flyerhzm/bullet)



## Rails Enum

[Rails 关于在 Rails Model 中使用 Enum (枚举) 的若干总结](https://ruby-china.org/topics/28654#)



## Redis

[Redis 为什么变慢了？](https://mp.weixin.qq.com/s/YLIW06y6f2ufgyeWUMWdYg)

