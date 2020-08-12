# Rails

Rails 是使用 Ruby 语言编写的 Web 应用开发框架，目的是通过解决快速开发中的共通问题，简化 Web 应用的开发。



## Hello, World!

### 创建 Blog 应用

Rails 提供了许多名为生成器（generator）的脚本，这些脚本可以为特定任务生成所需的全部文件。其中包括新应用生成器，这个脚本用于创建 Rails 应用骨架，避免了手动编写基础代码。

新应用生成器的使用：

```bash
//终端具有写权限的文件夹 输入以下命令
$ rails new blog //blog为项目名
$ bundle install //用于安装Gemfile中所列出的gem及依赖
```

`blog` 文件夹中自动生成的文件和文件夹，组成了 Rails 应用的结构。新应用生成器默认选项生成的文件和文件夹的功能如下：

| 文件/文件夹               | 作用                                                         |
| :------------------------ | :----------------------------------------------------------- |
| `app/`                    | 包含应用的控制器、模型、视图、辅助方法、邮件程序、频道、作业和静态资源文件。 |
| `bin/`                    | 包含用于启动应用的 rails 脚本，以及用于安装、更新、部署或运行应用的其他脚本。 |
| `config/`                 | 配置应用的路由、数据库等。详情请参阅[配置 Rails 应用](https://ruby-china.github.io/rails-guides/configuring.html)。 |
| `config.ru`               | 基于 Rack 的服务器所需的 Rack 配置，用于启动应用。           |
| `db/`                     | 包含当前数据库的模式，以及数据库迁移文件。                   |
| `Gemfile`, `Gemfile.lock` | 这两个文件用于指定 Rails 应用所需的 gem 依赖。Bundler gem 需要用到这两个文件。关于 Bundler 的更多介绍，请访问 [Bundler 官网](http://bundler.io/)。 |
| `lib/`                    | 应用的扩展模块。                                             |
| `log/`                    | 应用日志文件。                                               |
| `public/`                 | 仅有的可以直接从外部访问的文件夹，包含静态文件和编译后的静态资源文件。 |
| `Rakefile`                | 定位并加载可在命令行中执行的任务。这些任务在 Rails 的各个组件中定义。如果要添加自定义任务，请不要修改 Rakefile，直接把自定义任务保存在 `lib/tasks` 文件夹中即可。 |
| `README.md`               | 应用的自述文件，说明应用的用途、安装方法等。                 |
| `test/`                   | 单元测试、固件和其他测试装置。详情请参阅[Rails 应用测试指南](https://ruby-china.github.io/rails-guides/testing.html)。 |
| `tmp/`                    | 临时文件（如缓存和 PID 文件）。                              |
| `vendor/`                 | 包含第三方代码，如第三方 gem。                               |
| `.gitignore`              | 告诉 Git 要忽略的文件（或模式）。详情参见 [GitHub 帮助文档](https://help.github.com/articles/ignoring-files)。 |



### 启动服务器

启动 Web 服务器

```bash
$ bin/rails server
```

访问 [http://localhost:3000](http://localhost:3000/)。这时应该看到默认的 Rails 欢迎页面。

要让 Rails 显示“Hello, World!”，需要创建**控制器**和**视图**。

控制器

> 控制器接受向应用发起的特定访问请求。
>
> 路由决定哪些访问请求被哪些控制器接收。
>
> 一般情况下，一个控制器会对应多个路由，不同路由对应不同动作。动作搜集数据并把数据提供给视图。

视图

> 渲染，显示数据。
>
> 数据是在控制器而不是视图中获取的，视图只是显示数据。
>
> 默认情况下，视图模板使用 eRuby（嵌入式 Ruby）语言编写，经由 Rails 解析后，再发送给用户。

可以用控制器生成器来创建控制器。

```bash
//让控制器生成器创建一个包含“index”动作的“Welcome”控制器：
$ bin/rails generate controller Welcome index
```

执行上述命令后Rails会自动生成一系列文件和路由。

其中最重要的是控制器和视图。控制器位于 `app/controllers/welcome_controller.rb` 文件 ，视图位于 `app/views/welcome/index.html.erb` 文件 。

在文本编辑器中打开 `app/views/welcome/index.html.erb` 文件，然后写入想显示的内容。例如：

```erb
<h1>Hello, World!</h1>
```

创建控制器和视图之后还需要配置路由，在编辑器中打开 `config/routes.rb` 文件：

```ruby
Rails.application.routes.draw do
  get 'welcome/index' #配置welcome/index的请求发送到welcome控制器的index方法
  root 'welcome#index' #访问根路径时跳转到welcome控制器的index方法
end
```

访问http://localhost:3000即可显示index.html.erb页面。



## 启动并运行

### 资源(Resource)

资源表示一系列类似对象的集合，如文章、人或动物。

资源中的项目可以被创建、读取、更新和删除，这些操作简称 CRUD（Create, Read, Update, Delete）。

Rails 提供了 `resources` 方法，用于声明标准的 REST 资源。把 articles 资源添加到 `config/routes.rb` 文件

```ruby
Rails.application.routes.draw do
  get 'welcome/index'
  resources :articles #声明REST资源 （注意resources为复数形式）
  root 'welcome#index'
end
```



### 路由(Route)

Rails 提供了自动生成资源对应数据的脚本，执行以下命令：

```bash
$ bin/rails routes 
Prefix Verb   URI Pattern                  Controller#Action
    articles GET    /articles(.:format)          articles#index
             POST   /articles(.:format)          articles#create
 new_article GET    /articles/new(.:format)      articles#new
edit_article GET    /articles/:id/edit(.:format) articles#edit
     article GET    /articles/:id(.:format)      articles#show
             PATCH  /articles/:id(.:format)      articles#update
             PUT    /articles/:id(.:format)      articles#update
             DELETE /articles/:id(.:format)      articles#destroy
        root GET    /  
```

Rails为我们自动生成了article 资源对应的路由。



### 控制器(Controller)

但是对应的控制器还没有定义，我们需要定义自己的控制器。可以使用刚刚提到的脚本生产Articles控制器

```bash
$ bin/rails generate controller Articles
```

执行后，自动在`app/controllers/articles_controller.rb`中生成了一个空的`Articles`控制器：

```ruby
class ArticlesController < ApplicationController
end
```

新建一个article，可以利用刚刚刚刚之行脚本自动配置的路由和自动生成的控制器完成。新建可以使用路由new，但是自动配置的路由在控制器中还没有对应的方法，可以在`ArticleController`中添加对于的new方法；

```ruby
class ArticlesController < ApplicationController
  def new
  end
end
```

此时访问http://localhost:3000/articles/new仍然会报错：

```
ArticlesController#new is missing a template for this request format and variant. request.formats: ["text/html"] request.variant: [] NOTE! For XHR/Ajax or API requests, this action would normally respond with 204 No Content: an empty white screen. Since you’re loading it in a web browser, we assume that you expected to actually render a template, not… nothing, so we’re showing an error to be extra-clear. If you expect 204 No Content, carry on. That’s what you’ll get from an XHR or API request. Give it a shot.
```



### 模版(Template)

我们请求的是一个HTML，但是控制器Articles中的new方法返回空，所有Rails为抛出了错误。我们需要用模版处理器来返回一个模版。

由于访问http://localhost:3000/articles/new路径。Rails会在`app/views/`中查找`articles/new`模版。我们需要在其中创建一个`articles/new.html.erb` 文件。其中第一个扩展名是模版格式，且只能是HTML。第二个扩展名是模版处理器。

>  `:erb` 是最常用的 HTML 模板处理器，
>
> `:builder` 是 XML 模板处理器，
>
> `:coffee` 模板处理器用 CoffeeScript 创建 JavaScript 模板。

模版处理器会被Rails运行后返回一个模版。

新建 `app/views/articles/new.html.erb` 文件，添加下面的代码：

```erb
<h1>New Article</h1>
```

再次访问http://localhost:3000/articles/new路径，可以看到页面了。

添加表单：

```erb
<!-- articles_path是一个辅助方法，可以得到articles资源的路径 -->
<!-- 默认情况下表单会向这个路径发送post请求-->
<%= form_for :article,url: articles_path do |f| %>
  <p>
    <%= f.label :title %><br>
    <%= f.text_field :title %>
  </p>

  <p>
    <%= f.label :text %><br>
    <%= f.text_area :text %>
  </p>
 
  <p>
    <%= f.submit %>
  </p>
<% end %>
```

在脚本添加路由的信息中我们可以看到，post请求对应的方法为`create`，为了接收该请求，我们需要在`ArticlesController`中添加`create`方法。

在`create`方法中我们可以执行保存Article的方法。



### 模型(Modal)

Rails中的模型类似Java中的POJO，其与数据库中的articles表对应。

Rails也提供了生成模型的模型生成器脚本

```bash
$ bin/rails generate model Article title:string text:text
# 添加一个string类型的title字段和一个text类型的text字段
```

以上添加的属性会自动添加到数据库的`articles`表中，并映射到Article模型上。

为此 Rails 会创建一堆文件。这里我们只关注 `app/models/article.rb` 和 `db/migrate/20200807071358_create_articles` 这两个文件 



### 迁移

迁移是用于简化创建和修改数据库表操作的 Ruby 类。（并不是对数据进行操作）迁移作用于数据库之后还可以撤销迁移。

模型生成的`db/migrate/20200807071358_create_articles` 文件即为数据库迁移文件。

```ruby
class CreateArticles < ActiveRecord::Migration[6.0]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :text

      t.timestamps
    end
  end
end
```

在迁移时会调用以上的`change`方法。其中定义的操作都是可逆的，在需要时 Rails 知道如何撤销这些操作。运行迁移后会创建 `articles` 表，这个表包括一个字符串字段和一个文本字段，以及两个用于跟踪文章创建和更新时间的时间戳字段。

运行迁移：

```bash
$ bin/rails db:migrate
```

执行结果；

```bahs
==  CreateArticles: migrating ==================================================
-- create_table(:articles)
   -> 0.0019s
==  CreateArticles: migrated (0.0020s) =========================================
```



### 持久化

现在可以将Rails的模型通过控制器保存到数据库中了。

修改`ArticlesContorller`中的`create`方法。

```ruby
def create
  # 获取parmas中的值，并通过Article实例化
  @article = Article.new(params[:article])
 
  @article.save	#持久化article ，会返回boolean值表示是否成功
  redirect_to @article #重定向到article资源的页面
end
```

但Rails提供了多种安全特性，上面代码运行时会报`ForbiddenAttributesError`，因为一种叫做**健壮参数**的安全特性，Rails要求我们明确指定允许在`Controller`中使用的参数，以防止脚本注入。我们可以对参数的获取方式进行修改：

```ruby
@article = Article.new(params.require(:article).permit(:title, :text))
```

由于该参数经常会被使用，可以提取成一个私有的方法来获取：

```ruby
private
  def article_params
    params.require(:article).permit(:title, :text)
  end
```

**注**：常见的做法是按照以下顺序在控制器中放置标准的 CRUD 动作：`index`，`show`，`new`，`edit`，`create`，`update` 和 `destroy`。也可以按照自己的顺序放置这些动作，但必须放在私有方法之前才能正常工作。

自动生成的`Article`提供了一系列方法，如：

```ruby
@articles = Article.all #获取所有articles
@article = Article.find(parmas[:id]) #获取指定的article

@article.update(params) #更新article
@article.destroy #删除article
```

同时Rails也提供了对数据的校验。在 `app/models/article.rb` 文件中做如下修改：

```ruby
class Article < ApplicationRecord
  validates :title, presence: true,
                    length: { minimum: 5 }
end
```

即可验证`title`必须存在，且长度必须大于5。关于验证的更多介绍，请参阅[Active Record 数据验证](https://ruby-china.github.io/rails-guides/active_record_validations.html)。

添加校验后对`create`进行修改；

```ruby
def create
  @article = Article.new(article_params)
 
  if @article.save
    redirect_to @article
  else
    render 'new' # 该函数会将@article在new.html.erb中渲染并返回结果
  end
end
```



### 模型关联

使用`modal`生成器生成一个与`article`关联的模型`comment`

```bash
$ bin/rails generate model Comment commenter:string body:text article:references
```

`references` 关键字是一种特殊的模型数据类型，用于在数据表中新建字段。这个字段以提供的模型名加上 `_id` 后缀作为字段名，保存整数值，与对应的模型向关联。

在生成的`app/models/comment.rb` 文件中，可以看到与之前`article`不同的地方：

```ruby
class Comment < ApplicationRecord
  belongs_to :article
end
```

`Comment`明确指明了属于`article`

在迁移文件`db/migrate/20200810081046_create_comments`中：

```ruby
class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.string :commenter
      t.text :body
      t.references :article, foreign_key: true
 
      t.timestamps
    end
  end
end
```

`t.references` 这行代码创建 `article_id` 整数字段，为这个字段建立索引，并建立指向 `articles` 表的 `id` 字段的外键约束。

在运行迁移命令`$ bin/rails db:migrate`以后Rails为我们创建了`comment`的表，但现在`article`还没有和`comment`关联。修改`app/models/article.rb` 以使之关联：

```ruby
class Article < ApplicationRecord
  has_many :comments
  validates :title, presence: true,
                    length: { minimum: 5 }
end
```

除了模型，关联对象的路由也需要关联：

```ruby
resources :articles do
  resources :comments
end
```

这种方式被称为嵌套资源。

再次利用脚本生成控制器；

```bash
$ bin/rails generate controller Comments
```

同样在`Controller`中创建`create`方法：

```ruby
class CommentsController < ApplicationController
  def create
    #先获取到article
    @article = Article.find(params[:article_id])
    @comment = @article.comments.create(comment_params)
    redirect_to article_path(@article)
  end
 
  private
    def comment_params
      params.require(:comment).permit(:commenter, :body)
    end
end
```

在删除方法中同样需要获取到`article`在通过`id`获取到对应的`comment`。

```ruby
 def destroy
    #由于在CommentsController中，所以需要通过article_id来获取article的id
    @article = Article.find(params[:article_id])
    #由于在CommentsController中，所以可以通过id直接获取comment的id 
    @comment = @article.comments.find(params[:id]) 
    @comment.destroy
    redirect_to article_path(@article)
  end
```

删除关联对象则只需要在`article`模型中配置即可：

```ruby
class Article < ApplicationRecord
  has_many :comments, dependent: :destroy
  validates :title, presence: true,
                    length: { minimum: 5 }
end
```



## Active Record

Active Record 是 [MVC](http://en.wikipedia.org/wiki/Model–view–controller) 中的 M（模型），负责处理数据和业务逻辑。Active Record 负责创建和使用需要持久存入数据库中的数据。Active Record 实现了 Active Record 模式。

在 Active Record 模式中，对象中既有持久存储的数据，也有针对数据的操作。Active Record 模式把数据存取逻辑作为对象的一部分。

Active Record提供的功能如下：

- 表示模型和其中的数据；
- 表示模型之间的关系；
- 通过相关联的模型表示继承层次结构；
- 持久存入数据库之前，验证模型；
- 以面向对象的方式处理数据库操作。

### Active Record 约定

* **命名**

  Rails 把模型的类名转换成复数，然后查找对应的数据表。例如：

  | 模型/类    | 表/模式      |
  | :--------- | :----------- |
  | `Article`  | `articles`   |
  | `LineItem` | `line_items` |
  | `Deer`     | `deers`      |
  | `Mouse`    | `mice`       |
  | `Person`   | `people`     |

* #### 模式
  >  **外键**：使用 `singularized_table_name_id` 形式命名，例如 `item_id`，`order_id`。创建模型关联后，Active Record 会查找这个字段；
  >
  >  **主键**：默认情况下，Active Record 使用整数字段 `id` 作为表的主键。使用 [Active Record 迁移](https://ruby-china.github.io/rails-guides/active_record_migrations.html)创建数据库表时，会自动创建这个字段；



### 创建 Active Record 

继承 `ApplicationRecord` 类即可：

```ruby
class Product < ApplicationRecord
end
```

上面的代码会创建 `Product` 模型，对应于数据库中的 `products` 表。同时，`products` 表中的字段也映射到 `Product` 模型实例的属性上。假如 `products` 表由下面的 SQL 语句创建：

```sql
CREATE TABLE products (
   id int(11) NOT NULL auto_increment,
   name varchar(255),
   PRIMARY KEY  (id)
);
```

即可编写以下代码：

```ruby
p = Product.new
p.name = "Some Book"
puts p.name # "Some Book"
```



### 覆盖命名约定

`ApplicationRecord` 继承自 `ActiveRecord::Base`，后者定义了一系列方法。使用 `ActiveRecord::Base.table_name=` 方法可以指定要使用的表名：

```ruby
class Product < ApplicationRecord
  self.table_name = "my_products"
end
```

同时需要通过`set_fixture_class`方法指定测试固件：

```ruby
class ProductTest < ActiveSupport::TestCase
  set_fixture_class my_products: Product
  fixtures :my_products
  ...
end
```

还可以使用 `ActiveRecord::Base.primary_key=` 方法指定表的主键：

```ruby
class Product < ApplicationRecord
  self.primary_key = "product_id"
end
```



### CRUD

#### Create

Active Record对象可以通过`new`方法创建对象，`create`方法创建对象并保存到数据库中。

```ruby
user = User.new
user.name = "David"
user.occupation = "Code Artist"
user.save #调用save存入数据库

user = User.create(name: "David", occupation: "Code Artist")
```

如果在 `create` 和 `new` 方法中使用块，会把新创建的对象拉入块中，初始化对象：

```ruby
myUser = MyUser.new do |u|
  u.username = "1"
end
myUser2 = MyUser.create do |u|
  u.username = "1"
end
```

#### Read

```ruby
# 返回所有用户组成的集合
users = User.all
# 返回第一个用户
user = User.first
# 返回第一个名为 David 的用户
david = User.find_by(name: 'David')
# 查找所有名为 David，职业为 Code Artists 的用户，而且按照 created_at 反向排列
users = User.where(name: 'David', occupation: 'Code Artist').order(created_at: :desc)
```

#### Update

```ruby
user = User.find_by(name: 'David') # 获取到数据
user.name = 'Dave' # 设置值
user.save	# 保存
```

```ruby
user = User.find_by(name: 'David')
user.update(name: 'Dave') # 直接通过对象更新
```

```ruby
# 一次更新多个字段
User.update_all "max_login_attempts = 3, must_change_password = 'true'"
```

#### Delete

```ruby
user = User.find_by(name: 'David') # 获取
user.destroy # 删除
```



### 数据校验

Active Record 开业在存入数据库之前校验模型。调用`save` 或者`update`方法时会进行校验。

```ruby
class User < ApplicationRecord
  validates :name, presence: true
end
 
user = User.new
user.save  # => false 
user.save! # => ActiveRecord::RecordInvalid: Validation failed: Name can't be blank
```

[Active Record 数据验证](https://ruby-china.github.io/rails-guides/active_record_validations.html)会详细介绍数据验证。



### 回调

[Active Record 回调](https://ruby-china.github.io/rails-guides/active_record_callbacks.html)会详细介绍回调



### 迁移



关于迁移的详细介绍，参阅[Active Record 迁移](https://ruby-china.github.io/rails-guides/active_record_migrations.html)。