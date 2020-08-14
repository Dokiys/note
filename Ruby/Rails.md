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

# Active Record

***

Active Record 是 [MVC](http://en.wikipedia.org/wiki/Model–view–controller) 中的 M（模型），负责处理数据和业务逻辑。Active Record 负责创建和使用需要持久存入数据库中的数据。Active Record 实现了 Active Record 模式。

在 Active Record 模式中，对象中既有持久存储的数据，也有针对数据的操作。Active Record 模式把数据存取逻辑作为对象的一部分。

Active Record提供的功能如下：

- 表示模型和其中的数据；
- 表示模型之间的关系；
- 通过相关联的模型表示继承层次结构；
- 持久存入数据库之前，验证模型；
- 以面向对象的方式处理数据库操作。

## Active Record 约定

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



## 创建 Active Record 

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



## 覆盖命名约定

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



## CRUD

### Create

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

### Read

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

### Update

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

### Delete

```ruby
user = User.find_by(name: 'David') # 获取
user.destroy # 删除
```

# Active Record迁移

***

迁移时按时间顺序修改数据库模式的一种方法。它使用 Ruby DSL ，实现与数据库无关的数据库模式的操作，同时不必手动编写SQL。

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
 
      t.timestamps
    end
  end
end
```

该迁移用于添加`products`表到数据库，其中包括`name`和`description`字段。同时按照约定`ActiveRecord::Migration`为我们自动添加了名为`id`到主键，`timestamps`添加`created_at`和`updated_at`两个字段，来记录创建时间和更新时间。

对于支持 DDL 事务的数据库，迁移会被放在事务中，不支持的数据库如果迁移失败需要手动操作回滚。

**注：**SQL 语言分为 DQL(Date Query Language)、DML(Data Manipulation Language)、DDL(Data Definition Language)、DCL(Data Control Language)

手动回滚可以采用以下方法：

```ruby
class ChangeProductsPrice < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      change_table :products do |t|
        dir.up   { t.change :price, :string }
        dir.down { t.change :price, :integer }
      end
    end
  end
end
```

```ruby
class ChangeProductsPrice < ActiveRecord::Migration[5.0]
  def up # 该方法会在运行 rails db:migrate 时执行
    change_table :products do |t|
      t.change :price, :string
    end
  end
 
  def down # 该方法会在失败的时候运行
    change_table :products do |t|
      t.change :price, :integer
    end
  end
end
```



## 创建迁移

迁移文件储存在 `db/migrate` 文件夹中，一个迁移文件包含一个迁移类。文件名采用 `YYYYMMDDHHMMSS_create_products.rb` 形式，即 UTC 时间戳加上下划线再加上迁移的名称。迁移内容对应一个类（驼峰式命名）。

**注：**Rails 根据文件名的时间戳部分确定要运行的迁移和迁移运行的顺序，当需要把迁移文件复制到其他 Rails 应用，或者自己生成迁移文件时，一定要注意迁移运行的顺序。

为避免计算时间戳，Active Record 提供了生成器：

```bash
$ bin/rails generate migration AddPartNumberToProducts
```

上面的命令会创建空的迁移，并进行适当命名：

```ruby
class AddPartNumberToProducts < ActiveRecord::Migration[5.0]
  def change
  end
end
```



### AddXXX

如果迁移名称是 `AddXXXToYYY` 或 `RemoveXXXFromYYY` 的形式，并且后面跟着字段名和类型列表，那么会生成包含合适的 `add_column` 或 `remove_column` 语句的迁移。

```bash
$ bin/rails generate migration AddPartNumberToProducts part_number:string
```

```ruby
class AddPartNumberToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :part_number, :string
  end
end
```

同样可以添加索引

```bash
$ bin/rails generate migration AddPartNumberToProducts part_number:string:index
```

```ruby
class AddPartNumberToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :part_number, :string
    add_index :products, :part_number
  end
end
```

删除字段

```bash
$ bin/rails generate migration RemovePartNumberFromProducts part_number:string
```

```ruby
class RemovePartNumberFromProducts < ActiveRecord::Migration[5.0]
  def change
    remove_column :products, :part_number, :string
  end
end
```

添加多个字段

```bash
$ bin/rails generate migration AddDetailsToProducts part_number:string price:decimal
```

```ruby
class AddDetailsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :part_number, :string
    add_column :products, :price, :decimal
  end
end
```



### CreateXXX

如果迁移名称是 `CreateXXX` 的形式，并且后面跟着字段名和类型列表，那么会生成用于创建包含指定字段的 `XXX` 数据表的迁移。

```bash
$ bin/rails generate migration CreateProducts name:string part_number:string
```

生成迁移文件：

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name
      t.string :part_number
    end
  end
end
```

命令生成的代码只是一个起点，我们可以根据需要修改 `db/migrate/YYYYMMDDHHMMSS_add_details_to_products.rb` 文件。

**JoinTable**

如果迁移名称中包含 `CreateJoinTable`，生成器会创建联结数据表：

```bash
$ bin/rails generate migration CreateJoinTableCustomerProduct customer product
```

生成：

```ruby
class CreateJoinTableCustomerProduct < ActiveRecord::Migration[5.0]
  def change
    create_join_table :customers, :products do |t|
      # t.index [:customer_id, :product_id]
      # t.index [:product_id, :customer_id]
    end
  end
end
```



### 模型生成器

模型和脚手架生成器也会自动生成新模型的迁移文件：

```bash
$ bin/rails generate model Product name:string description:text
```

生成的迁移文件：

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
 
      t.timestamps
    end
  end
end
```



### 传递修饰符

可以直接在命令行中传递常用的<a id="BModifier" href="#Modifier">字段修饰符</a>。如下：

```bash
$ bin/rails generate migration AddDetailsToProducts 'price:decimal{5,2}' supplier:references{polymorphic}
```

生成：

```ruby
class AddDetailsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :price, :decimal, precision: 5, scale: 2
    add_reference :products, :supplier, polymorphic: true
  end
end
```



## 编写迁移

### 创建数据表

`create_table` 方法是最基础、最常用的方法。用法如下：

```ruby
# 会创建拥有string类型名为name字段的products表
# 且会默认创建名为id的主键，可传入id: false禁用主键
create_table :products do |t|
  t.string :name
end
```

如果需要传递数据库特有的选项，可以在 `:options` 选项中使用 SQL 代码片段

```ruby
# 创建数据表的 SQL 语句末尾加上 ENGINE=BLACKHOLE
create_table :products, options: "ENGINE=BLACKHOLE" do |t|
  t.string :name, null: false
end
```

还可以传递带有数据表描述信息的 `:comment` 选项，这些注释会被储存在数据库中。

**创建联结表**

用于创建 HABTM（has and belongs to many）联结数据表。用法如下：

```ruby
create_join_table :products, :categories
```

这两个字段的 `:null` 选项默认设置为 `false`，可以通过 `:column_options` 选项覆盖这一设置：

```ruby
create_join_table :products, :categories, column_options: { null: true }
```

联结数据表的名称默认由 `create_join_table` 方法的前两个参数按字母顺序组合而来。可以传入 `:table_name` 选项来自定义联结数据表的名称：

```ruby
create_join_table :products, :categories, table_name: :categorization
```

也可以接受块为参数，用于添加索引（默认未创建索引）或附加字段：

```ruby
create_join_table :products, :categories do |t|
  t.index :product_id
  t.index :category_id
end
```



### 修改数据库

`change_table`用于修改数据表。和 `create_table` 类似，但传入块的对象拥有更多方法来修改数据库：

```ruby
change_table :products do |t|
  t.remove :description, :name # 删除description和name字段
  t.string :part_number	# 创建string类型的part_number字段
  t.index :part_number # 创建part_number的索引
  t.rename :upccode, :upc_code # 重新命名upccode字段为upc_code
end
```



### 修改字段

Rails 提供了与 `remove_column` 和 `add_column` 类似的 `change_column` 迁移方法。

```ruby
# 把 products 数据表的 part_number 字段修改为 :text 字段。
change_column :products, :part_number, :text
```

**注：**该命令时无法撤销的。

此外还有一些常用方法：

```ruby
# 设置products字段和name字段不为空
change_column_null :products, :name, false
# 将products字段和approved字段默认值true修改为false
change_column_default :products, :approved, from: true, to: false
```

**注：**也可以把上面的迁移写成 `change_column_default :products, :approved, false`，但这种写法是无法撤销的。



## 字段修饰符

字段修饰符可以在创建或修改字段时使用<a id="Modifier" href="#BModifier">↵</a>：

>- `limit` 修饰符：设置 `string/text/binary/integer` 字段的最大长度。
>- `precision` 修饰符：定义 `decimal` 字段的精度，表示数字的总位数。
>- `scale` 修饰符：定义 `decimal` 字段的标度，表示小数点后的位数。
>- `polymorphic` 修饰符：为 `belongs_to` 关联添加 `type` 字段。
>- `null` 修饰符：设置字段能否为 `NULL` 值。
>- `default` 修饰符：设置字段的默认值。请注意，如果使用动态值（如日期）作为默认值，那么默认值只会在第一次使时（如应用迁移的日期）计算一次。
>- `index` 修饰符：为字段添加索引。
>- `comment` 修饰符：为字段添加注释。

更多介绍请参阅相应适配器的 API 文档。



## 外键

尽管不是必需的，但有时我们需要使用外键约束以保证引用完整性<a id="Foreign" href="#BForeign">↵</a>。

```ruby
# 为 articles 数据表的 author_id 字段添加外键
# 这个外键会引用 authors 数据表的 id 字段
add_foreign_key :articles, :authors
```

如果字段名不能从表名称推导出来，我们可以使用 `:column` 和 `:primary_key` 选项。

Rails 会为每一个外键生成以 `fk_rails_` 开头并接上根据 `from_table` 和 `column` 推导出来的字符串。需要时可以使用 `:name` 来指定外键名。

删除外键：

```ruby
# 让 Active Record 找出列名
remove_foreign_key :accounts, :branches
 
# 删除特定列上的外键
remove_foreign_key :accounts, column: :owner_id
 
# 通过名称删除外键
remove_foreign_key :accounts, name: :special_fk_name
```



## SQL语句

如果 Active Record 提供的辅助方法不够用，可以使用 `excute` 方法执行任意 SQL 语句：

```ruby
Product.connection.execute("UPDATE products SET price = 'free' WHERE 1=1")
```

关于各个方法的更多介绍和例子，请参阅 API 文档。 [`ActiveRecord::ConnectionAdapters::SchemaStatements`](http://api.rubyonrails.org/v5.1.1/classes/ActiveRecord/ConnectionAdapters/SchemaStatements.html) 的文档（在 `change`、`up` 和 `down` 方法中可以使用的方法）

 的文档（在 `create_table` 方法的块中可以使用的方法）

 [`ActiveRecord::ConnectionAdapters::Table`](http://api.rubyonrails.org/v5.1.1/classes/ActiveRecord/ConnectionAdapters/Table.html) 的文档（在 `change_table` 方法的块中可以使用的方法）。



## 迁移方法

### change

> - `add_column`
> - `add_foreign_key`
> - `add_index`
> - `add_reference`
> - `add_timestamps`
> - `change_column_default`（必须提供 `:from` 和 `:to` 选项）
> - `change_column_null`
> - `create_join_table`
> - `create_table`
> - `disable_extension`
> - `drop_join_table`
> - `drop_table`（必须提供块）
> - `enable_extension`
> - `remove_column`（必须提供字段类型）
> - `remove_foreign_key`（必须提供第二个数据表）
> - `remove_index`
> - `remove_reference`
> - `remove_timestamps`
> - `rename_column`
> - `rename_index`
> - `rename_table`

如果在块中不使用 `change`、`change_default` 和 `remove` 方法，那么 `change_table` 方法也是可撤销的。
如果提供了字段类型作为第三个参数，那么 `remove_column` 是可撤销的。别忘了提供原来字段的选项，否则 Rails 在回滚时就无法准确地重建字段了：

```ruby
remove_column :posts, :slug, :string, null: false, default: '', index: true
```



### reversible

撤销复杂迁移所需的操作有一些是 Rails 无法自动完成的，这时可以使用 `reversible` 方法指定运行和撤销迁移所需的操作。例如：

```ruby
class ExampleMigration < ActiveRecord::Migration[5.0]
  def change
    create_table :distributors do |t|
      t.string :zipcode
    end

   
    reversible do |dir|
      dir.up do
        # 添加 CHECK 约束
        execute <<-SQL
ALTER TABLE distributors
ADD CONSTRAINT zipchk
CHECK (char_length(zipcode) = 5) NO INHERIT;
SQL
      end
       # 撤销迁移时，会在删除 home_page_url 字段之后、删除 distributors 数据表之前运行。
      dir.down do
        execute <<-SQL
ALTER TABLE distributors
DROP CONSTRAINT zipchk
SQL
      end
    end

    add_column :users, :home_page_url, :string
    rename_column :users, :email, :email_address
  end
end
```

如果遇到无法撤销的操作，可以在`down`块中抛出`ActiveRecord::IrreversibleMigration`异常



### up & down

`up` 方法用于描述对数据库模式所做的改变，`down` 方法用于撤销 `up` 方法所做的改变。一下例子和上面的代码完全相同：

```ruby
class ExampleMigration < ActiveRecord::Migration[5.0]
  def up
    create_table :distributors do |t|
      t.string :zipcode
    end

    # 添加 CHECK 约束
    execute <<-SQL
ALTER TABLE distributors
ADD CONSTRAINT zipchk
CHECK (char_length(zipcode) = 5);
SQL

    add_column :users, :home_page_url, :string
    rename_column :users, :email, :email_address
  end

  def down
    rename_column :users, :email_address, :email
    remove_column :users, :home_page_url

    execute <<-SQL
ALTER TABLE distributors
DROP CONSTRAINT zipchk
SQL

    drop_table :distributors
  end
end
```

同样对于无法撤销的迁移，也应该在`down`方法中抛出 `ActiveRecord::IrreversibleMigration` 异常。



## 撤销迁移

Active Record 提供了 `revert` 方法用于回滚迁移：

```ruby
require_relative '20121212123456_example_migration'
 
class FixupExampleMigration < ActiveRecord::Migration[5.0]
  def change
    # 回滚该迁移类
    revert ExampleMigration
 
    # 新建table
    create_table(:apples) do |t|
      t.string :variety
    end
  end
end
```

`revert` 方法也接受块，用于撤销之前迁移的部分操作：

```ruby
class DontUseConstraintForZipcodeValidationMigration < ActiveRecord::Migration[5.0]
  def change
    revert do
      # 从  ExampleMigration 中复制粘贴代码
      reversible do |dir|
        dir.up do
          # 添加 CHECK 约束
          execute <<-SQL
ALTER TABLE distributors
ADD CONSTRAINT zipchk
CHECK (char_length(zipcode) = 5);
SQL
        end
        dir.down do
          execute <<-SQL
ALTER TABLE distributors
DROP CONSTRAINT zipchk
SQL
        end
      end

      # ExampleMigration 中的其他操作无需撤销
    end
  end
end
```

调换 `create_table` 方法和 `reversible` 方法的顺序，用 `drop_table` 方法代替 `create_table` 方法，最后对调 `up` 和 `down` 方法。也可以撤销迁移，但一个`revert`方法就可以代替所有。



## 运行迁移

Rails 提供了一套用于运行迁移的 `bin/rails` 任务。其中最常用的是 `rails db:migrate` 任务，用于调用所有**未运行**的迁移中的 `chagne` 或 `up` 方法。

如果没有未运行的迁移，任务会直接退出。

调用顺序是根据迁移文件名的时间戳确定的。

**注：**`db:migrate` 任务时会自动执行 `db:schema:dump` 任务，这个任务用于更新 `db/schema.rb` 文件，以匹配数据库结构。

如果指定了目标版本，Active Record 会运行该版本之前的所有迁移（调用其中的 `change`、`up` 和 `down` 方法），其中版本指的是迁移文件名的数字前缀。例如，下面的命令会运行 `20080906120000` 版本之前的所有迁移：

```bash
$ bin/rails db:migrate VERSION=20080906120000
```



### 回滚

另一个常用任务是回滚最后一个迁移。例如，当发现最后一个迁移中有错误需要修正时，就可以执行回滚任务。回滚最后一个迁移不需要指定这个迁移的版本，直接执行下面的命令即可：

```bash
$ bin/rails db:rollback
```

执行后会撤销 `change` 方法或调用 `down` 方法来回滚最后一个迁移。要想取消多个迁移，可以使用 `STEP` 参数：

```bash
$ bin/rails db:rollback STEP=3 # 撤销最后三个迁移
```

`db:migrate:redo` 任务用于回滚最后一个迁移并再次运行这个迁移。和 `db:rollback` 任务一样，如果需要重做多个迁移，可以使用 `STEP` 参数，例如：

```bash
$ bin/rails db:migrate:redo STEP=3
```



### 数据库

`rails db:setup` 任务用于创建数据库，加载数据库模式，并使用种子数据初始化数据库。

`rails db:reset` 任务用于删除并重新创建数据库，其功能相当于 `rails db:drop db:setup`。

关于转储数据库模式的更多介绍，请参阅 [数据库模式转储](https://ruby-china.github.io/rails-guides/active_record_migrations.html#schema-dumping-and-you)。



### 运行指定迁移

要想运行或撤销指定迁移，指定版本即可。例如：

```bash
# 如果已经迁移已经运行过就不会执行任何操作。
$ bin/rails db:migrate:up VERSION=20080906120000
```



### 迁移环境

`bin/rails db:migrate` 任务默认在开发环境中运行迁移。 `RAILS_ENV` 环境变量说明所需环境：

```bash
$ bin/rails db:migrate RAILS_ENV=test
```



### 运行迁移输出

运行迁移时，默认会输出正在进行的操作，以及操作所花费的时间。

```bash
==  CreateProducts: migrating =================================================
-- create_table(:products)
   -> 0.0028s
==  CreateProducts: migrated (0.0028s) ========================================
```

```ruby
class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    suppress_messages do
      create_table :products do |t|
        t.string :name
        t.text :description
        t.timestamps
      end
    end
 
    say "Created a table"
 
    suppress_messages {add_index :products, :name}
    say "and an index!", true
 
    say_with_time 'Waiting for a while' do
      sleep 10
      250
    end
  end
end
```



## 修改迁移

如果编写迁移时出现错误，在重新运行迁移是无效的，Rails 已经运行过这个迁移类。必须回滚这个迁移（例如通过执行 `bin/rails db:rollback` 任务），再修改迁移中的错误，然后执行 `rails db:migrate` 任务来运行这个迁移。

通常，不能直接修改现有的迁移。如果这个迁移已在生产服务器上运行，可能带来大麻烦。可以编写一个新的迁移来执行我们想要的操作。修改还未提交到源代版本码控制系统（或者更一般地，还未传播到开发设备之外）的新生成的迁移是相对无害的。

在编写新的迁移来完全或部分撤销之前的迁移时，可以使用 `revert` 方法



## 数据库模式转储

迁移尽管很强大，但并非数据库模式的可信来源。Active Record的可信来源只有通过检查数据库生成的 db/schema.rb` 或 `db/structure.sql，这两个文件用来表示数据库的当前状态。



### 转储的类型

可以通过 `config/application.rb` 文件的 `config.active_record.schema_format` 选项来设置想要采用的方式，即 `:sql` 获得`SQL`文件或 `:ruby` 获得`rb`文件。

 `db/schema.rb` 文件类似一个巨大的迁移：

```ruby
ActiveRecord::Schema.define(version: 20080906171750) do
  create_table "authors", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end
 
  create_table "products", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "part_number"
  end
end
```

这个文件是通过检查数据库生成的，使用 `create_table`、`add_index` 等方法来表达数据库结构。这个文件是数据库无关的，可以加载到 Active Record 支持的任何一种数据库。

但它不能表达数据库的特定项目，如触发器、存储过程或检查约束。

如果在数据库中使用了以上特性，就应该把数据库模式的格式设置为 `:sql`。

`:sql` 格式的数据库模式，只能加载到和原有数据库类型相同的数据库，而不能加载到其他类型的数据库。

**注：**`db/schema.rb` 文件包含数据库的当前版本号，这样可以确保在合并两个包含数据库模式文件的分支时会发生冲突。一旦出现这种情况，就需要手动解决冲突，保留版本较高的那个数据库模式文件。



## 引用完整性

Active Record 在**模型**而不是数据库中声明关联。因此，像触发器、约束这些依赖数据库的特性没有被大量使用。

验证，如 `validates :foreign_key, uniqueness: true`，是**模型**强制数据完整性的一种方式。在关联中设置 `:dependent` 选项，可以保证父对象删除后，子对象也会被删除。和其他应用层的操作一样，这些操作无法保证引用完整性，因此有些人会在数据库中使用<a id="BForeign" href="#Foreign">外键约束</a>以加强数据完整性。

尽管 Active Record 并未提供用于直接处理这些特性的工具，但 `execute` 方法可以用于执行任意 SQL。



## 种子数据

Rails 内置的“种子”特性可以快速简便地完成创建数据库后添加初始数据的任务。

用 Ruby 代码填充 `db/seeds.rb` 文件，然后执行 `rails db:seed` 命令即可：

```ruby
5.times do |i|
  Product.create(name: "Product ##{i}", description: "A product.")
end
```

这样可以避免在创建数据库表的迁移文件中直接写入初始数据的代码。



# 数据校验

***

Active Record 会在存入数据库之前校验模型。调用`save` 或者`update`方法时会进行校验。

```ruby
class User < ApplicationRecord
  validates :name, presence: true
end
 
user = User.new
user.save  # => false 
user.save! # => ActiveRecord::RecordInvalid: Validation failed: Name can't be blank
```

[Active Record 数据验证](https://ruby-china.github.io/rails-guides/active_record_validations.html)会详细介绍数据验证。



# Active Record 关联

关联可以将两个业务上有联系的两个模块联系起来，以简化其中的数据操作。

Rails 支持六种关联：

- `belongs_to`
- `has_one`
- `has_many`
- `has_many :through`
- `has_one :through`
- `has_and_belongs_to_many`



## belongs_to

### 基本使用

建立两个模型之间一对一的关系，表示所在模型属于另一个模型实例。

```ruby
class Book < ApplicationRecord
  belongs_to :author
end
```

相应的迁移如下：

```ruby
class CreateBooks < ActiveRecord::Migration[5.0]
  def change
    create_table :authors do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :books do |t|
      t.belongs_to :author, index: true
      t.datetime :published_at
      t.timestamps
    end
  end
end
```

### 关联方法

声明 `belongs_to` 关联后，所在的类自动获得了五个和关联相关的方法：

```ruby
association
association=(associate)
build_association(attributes = {})
create_association(attributes = {})
create_association!(attributes = {})
```

以上述`Book`模型来说,每个`Book`实例都获得了这些方法：

```ruby
@author = @book.author					# 获得关联对象，如果不存在则返回nil
@book.author = @author				  # 将对象的主键赋值给book实例的关联对象
# 返回设置给该关联类型的一个新对象。但关联对象不会存入数据库。
@author = @book.build_author(author_number: 123,
                             author_name: "John Doe")
# 返回设置给该关联类型的一个新对象。这只要能通过数据验证，就会把关联对象存入数据库。
@author = @book.create_author(author_number: 123,
                                   author_name: "John Doe")
# 返回设置给该关联类型的一个新对象。没通过校验则报错。
@author = @book.create_author!(author_number: 123,
                                   author_name: "John Doe")
```

### 方法选项

`belongs_to` 关联支持下列选项：

**:autosave**

`:autosave` 选项设为 `true`，保存父对象时，会自动保存所有子对象，并把标记为析构的子对象销毁。

**:class_name**

指定模型名以使所在模型与之关联。

```ruby
class Book < ApplicationRecord
  belongs_to :author, class_name: "Patron"
end
```

**:dependent**

`:dependent` 选项控制属主销毁后怎么处理关联的对象：

- `:destroy`：也销毁关联的对象
- `:delete_all`：直接从数据库中删除关联的对象（不执行回调）
- `:nullify`：把外键设为 `NULL`（不执行回调）
- `:restrict_with_exception`：如果有关联的记录，抛出异常
- `:restrict_with_error`：如果有关联的对象，为属主添加一个错误

**:foreign_key**

按照约定，用来存储外键的字段名是关联名后加 `_id`。`:foreign_key` 选项可以设置要使用的外键名：

```ruby
class Book < ApplicationRecord
  belongs_to :author, class_name: "Patron",
                      foreign_key: "patron_id"
end
# 不管怎样，Rails 都不会自动创建外键字段，你要自己在迁移中创建。
```

**:primary_key**

按照约定，Rails 假定使用表中的 `id` 列保存主键。使用 `:primary_key` 选项可以指定使用其他列。

假如有个 `users` 表使用 `guid` 列存储主键，`todos` 想在 `guid` 列中存储用户的 ID，那么可以使用 `primary_key` 选项设置：

```ruby
class User < ApplicationRecord
  self.primary_key = 'guid' # 设置主键为 guid
end
 
class Todo < ApplicationRecord
  belongs_to :user, primary_key: 'guid' # 通过指定主键关联
end
```

执行 `@user.todos.create` 时，`@todo` 记录的用户 ID 是 `@user` 的 `guid` 值。

**:inverse_of**

用于指定 `belongs_to` 关联另一端的 `has_many` 和 `has_one` 关联名。不能和 `:polymorphic` 选项一起使用。

```ruby
class Author < ApplicationRecord
  has_many :books, inverse_of: :author
end
 
class Book < ApplicationRecord
  belongs_to :author, inverse_of: :books
end
```

**:touch**

如果把 `:touch` 选项设为 `true`，保存或销毁对象时，关联对象的 `updated_at` 或 `updated_on` 字段会自动设为当前时间。同时还可指定要更新哪个时间戳字段：

```ruby
class Book < ApplicationRecord
  belongs_to :author, touch: :books_updated_at
end
```

**:validate**

如果把 `:validate` 选项设为 `true`，保存对象时，会同时验证关联的对象。该选项的默认值是 `false`，保存对象时不验证关联的对象。



### 作用域

可以通过一些方法指定查询关联时的作用域：

**where**

`where` 方法指定关联对象必须满足的条件。

```ruby
class book < ApplicationRecord
  belongs_to :author, -> { where active: true }
end
```

**includes**

指定使用关联时要及早加载的**间接**关联 。

如有以下模型：

```ruby
class LineItem < ApplicationRecord
  belongs_to :book
end
 
class Book < ApplicationRecord
  belongs_to :author
  has_many :line_items
end
 
class Author < ApplicationRecord
  has_many :books
end
```

如果经常直接冲商品上获取作者对象时 `(@line_item.book.author)`，就可以在商品引入图书时也引入作者。

```ruby
class LineItem < ApplicationRecord
  belongs_to :book, -> { includes :author }
end
 
class Book < ApplicationRecord
  belongs_to :author
  has_many :line_items
end
 
class Author < ApplicationRecord
  has_many :books
end
```

**readonly**

使通过关联获取的对象是只读的。

**select**

`select` 方法用于覆盖检索关联对象使用的 SQL `SELECT` 子句。默认情况下，Rails 检索所有字段。如果在 `belongs_to` 关联中使用 `select` 方法，应该同时设置 `:foreign_key` 选项，确保返回的结果正确。

**注：**把对象赋值给 `belongs_to` 关联不会自动保存对象，也不会保存关联的对象。



## has_one

### 基本使用

也建立一对一关系，但语义不一样。表示所在模型拥有另一个模型实例。

```ruby
class Supplier < ApplicationRecord
  has_one :account # 在 belongs_to 关联声明中必须使用单数形式。
end
```

相应的迁移如下：

```ruby
class CreateSuppliers < ActiveRecord::Migration[5.0]
  def change
    create_table :suppliers do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :accounts do |t|
      t.belongs_to :supplier, index: true
      t.string :account_number
      t.timestamps
    end
  end
end
```

根据使用需要，可能还要为 accounts 表中的 supplier 列创建唯一性索引和（或）外键约束。

```ruby
create_table :accounts do |t|
  t.belongs_to :supplier, index: { unique: true }, foreign_key: true
  # ...
end
```

**注：**`has_one`的关联方法、方法选项、作用域几乎与`belongs_to`相同。可参见上文



## has_many

### 基本使用

用于建立模型间的一对多关系，通常用于 belongs_to 的另一端，表示所在模型包含零个或多个另一个模型的实例。

```ruby
class Author < ApplicationRecord
  has_many :books # 声明 has_many 关联时，另一个模型使用复数形式。
end
```

相应的迁移如下：

```ruby
class CreateAuthors < ActiveRecord::Migration[5.0]
  def change
    create_table :authors do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :books do |t|
      t.belongs_to :author, index: true
      t.datetime :published_at
      t.timestamps
    end
  end
end
```



### 关联方法

声明 `has_many` 关联后声明所在类获取了如下方法：

```ruby
collection
collection<<(object, ...)
collection.delete(object, ...)
collection.destroy(object, ...)
collection=(objects)
collection_singular_ids
collection_singular_ids=(ids)
collection.clear
collection.empty?
collection.size
collection.find(...)
collection.where(...)
collection.exists?(...)
collection.build(attributes = {}, ...)
collection.create(attributes = {})
collection.create!(attributes = {})
```

同样以上文`Author`为例，每个实例获得了如下方法：

```ruby
# 返回包含所有关联对想的数组，如果没有则返回空数组
@books = @author.books		

# 向关联对象数组添加一个或多个对象。并为添加对象设置外键为该对象主键
@author.books << @book1			

# 删除关联对象数组中的一个或多个对象，并设置删除对象外键为NULL
@author.books.delete(@book1)

# 直接冲数据库中删除关联的对象
@author.books.destroy(@book1)

# 设置指定的关联对象
@author.books = @books

# 返回关联对象的id数组
@book_ids = @author.book_ids

# 指定关联对象数组中的主键，会根据指定增删ID。改动会持久存入数据库。
@author.book_ids = @book_ids

# 据 dependent 选项指定的策略删除集合中的所有对象。如果没有指定这个选项，使用默认策略。has_many :through 关联的默认策略是 delete_all；has_many 关联的默认策略是，把外键设为 NULL。
@author.books.clear

# 判断是否为空
@author.books.empty?

# 返回数量
@book_count = @author.books.size

# 查找，和exists类似
@available_books = @author.books.find(1)

# 根据条件查找
@available_books = @author.books.where(available: true) # 尚未查询
@available_book = @available_books.first # 现在查询数据库

# 根据条件查找是否存在
@author.books.exists？(available: true) 
  @author.books.exists?(5) # 查找id为5
  @author.books.exists?('5') # 查找id为5
  @author.books.exists?(['name LIKE ?', "%#{query}%"]) # 条件查找数组
  @author.books.exists?(id: [1, 4, 8]) # 查找id在数组中的
  @author.books.exists?(name: 'David') # 查找指定name
  @author.books.exists?(false) # 返回false
  @author.books.exists? # 如果table为空返回false否则返回true

# 返回一个或多个此种关联类型的新对象。这些对象会使用传入的属性初始化，还会创建对应的外键，但不会保存关联的对象。
@book = @author.books.build(published_at: Time.now,
                            book_number: "A12345")
@books = @author.books.build([
  { published_at: Time.now, book_number: "A12346" },
  { published_at: Time.now, book_number: "A12347" }
])

# 返回一个或多个此种关联类型的新对象。这些对象会使用传入的属性初始化，还会创建对应的外键，通过校验则保存对象。
@book = @author.books.create(published_at: Time.now,
                             book_number: "A12345")
@books = @author.books.create([
  { published_at: Time.now, book_number: "A12346" },
  { published_at: Time.now, book_number: "A12347" }
])

# 如果没通过校验则报错
books.create!(attributes = {})
```



### 方法选项

和`belong_to`基本相似，这里介绍部分不相似的选项。

**:source**

指定 `has_many :through` 关联的源关联名称。只有无法从关联名中解出源关联的名称时才需要设置这个选项。

**:source_type**

指定通过多态关联处理 `has_many :through` 关联的源关联类型。



### 作用域

在作用域代码块中可以使用任何一个标准的查询方法。下面介绍其中几个：

**group**

指定一个属性名，用在 SQL `GROUP BY` 子句中，分组查询结果。

```ruby
class Author < ApplicationRecord
  has_many :line_items, -> { group 'books.id' },
                        through: :books
end
```

**limit**

限制通过关联获取的对象数量。

```ruby
class Author < ApplicationRecord
  has_many :recent_books,
    -> { order('published_at desc').limit(100) },
    class_name: "Book",
end
```

**offset**

指定通过关联获取对象时的偏移量。例如，`-> { offset(11) }` 会跳过前 11 个记录。

**order**

指定获取关联对象时使用的排序方式，用在 SQL `ORDER BY` 子句中。

```ruby
class Author < ApplicationRecord
  has_many :books, -> { order "date_confirmed DESC" }
end
```

**distinct**

可以确保集合中没有重复的对象。

```ruby
class Person
  has_many :readings
  has_many :articles, -> { distinct }, through: :readings
end
```



**注：**

* 把对象赋值给 `has_many` 关联时，会自动保存对象（因为要更新外键）。如果一次赋值多个对象，所有对象都会自动保存。

* 如果父对象（`has_many` 关联声明所在的模型）没保存，那么子对象也不会保存。只有保存了父对象，才会保存子对象。

* 如果没有通过数据校验则返回`false`，赋值取。

* `collection.build` 方法可以在赋值给`has_many`关联时不保存对象。

  

## has_many :through

用于建立模型间的多对多关系，表示所在模型可以借由第三个模型，包含零个或多个另一模型的实例，常作用于有中间表的关联关系数据。

```ruby
class Physician < ApplicationRecord
  has_many :appointments
  has_many :patients, through: :appointments
end
 
class Appointment < ApplicationRecord
  belongs_to :physician
  belongs_to :patient
end
 
class Patient < ApplicationRecord
  has_many :appointments
  has_many :physicians, through: :appointments
end
```

相应的迁移如下：

```ruby
class CreateAppointments < ActiveRecord::Migration[5.0]
  def change
    create_table :physicians do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :patients do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :appointments do |t|
      t.belongs_to :physician, index: true
      t.belongs_to :patient, index: true
      t.datetime :appointment_date
      t.timestamps
    end
  end
end
```

`has_many :through` 还能简化嵌套的 `has_many` 关联。例如，一个文档分为多个部分，每一部分又有多个段落，如果想使用简单的方式获取文档中的所有段落，可以这么做：

```ruby
class Document < ApplicationRecord
  has_many :sections
  has_many :paragraphs, through: :sections
end
 
class Section < ApplicationRecord
  belongs_to :document
  has_many :paragraphs
end
 
class Paragraph < ApplicationRecord
  belongs_to :section
end
```

加上 `through: :sections` 后，Rails 就能理解这段代码：

```ruby
@document.paragraphs
```



## has_one :through

用于建立两个模型间的一对一关系，表示通过第三个模型与另一个模型关联。即一对一对一建立管理，方便所在模型对需要关联模型的操作。

```ruby
class Supplier < ApplicationRecord
  has_one :account
  has_one :account_history, through: :account
end
 
class Account < ApplicationRecord
  belongs_to :supplier
  has_one :account_history
end
 
class AccountHistory < ApplicationRecord
  belongs_to :account
end
```

相应迁移如下：

```ruby
class CreateAccountHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :suppliers do |t|
      t.string :name
      t.timestamps
    end
 
    create_table :accounts do |t|
      t.belongs_to :supplier, index: true
      t.string :account_number
      t.timestamps
    end
 
    create_table :account_histories do |t|
      t.belongs_to :account, index: true
      t.integer :credit_rating
      t.timestamps
    end
  end
end
```



## has_and_belongs_to_many

用于两个模型间的多对多关系，不借用中间关联对象。

```ruby
class Assembly < ApplicationRecord
  has_and_belongs_to_many :parts
end
 
class Part < ApplicationRecord
  has_and_belongs_to_many :assemblies
end
```

**注：**其关联方法、方法选项、作用域与`has_many`相同



## 自联结

对自己建立关系。

```ruby
class Employee < ApplicationRecord
  has_many :subordinates, class_name: "Employee",
                          foreign_key: "manager_id"
 
  belongs_to :manager, class_name: "Employee"
end
```

在迁移（模式）中，要添加一个引用字段，指向模型自身：

```ruby
class CreateEmployees < ActiveRecord::Migration[5.0]
  def change
    create_table :employees do |t|
      t.references :manager, index: true
      t.timestamps
    end
  end
end
```



## 关联的作用域

默认情况下关联只会查找当前模块作用域中的对象，要想让处在不同命名空间中的模型正常建立关联，声明关联时要指定完整的类名：

```ruby
module MyApplication
  module Business
    class Supplier < ApplicationRecord
       has_one :account,
        class_name: "MyApplication::Billing::Account"
    end
  end
 
  module Billing
    class Account < ApplicationRecord
       belongs_to :supplier,
        class_name: "MyApplication::Business::Supplier"
    end
  end
end
```



## 关联回调

普通回调会介入 Active Record 对象的生命周期，在多个时刻处理对象。例如，可以使用 `:before_save` 回调在保存对象之前处理对象。和普通回调类似，关联回调由集合中的生命周期触发，有如下四种；

```ruby
before_add
after_add
before_remove
after_remove
```

关联回调在声明关联时定义。例如：

```ruby
class Author < ApplicationRecord
  has_many :books, before_add: :check_credit_limit
 
  def check_credit_limit(book) # 传入添加的对象
    ...
  end
end
```

同一事件可以触发多个回调，多个回调使用数组指定：

```ruby
class Author < ApplicationRecord
  has_many :books,
    before_add: [:check_credit_limit, :calculate_shipping_charges]
 
  def check_credit_limit(book)
    ...
  end
 
  def calculate_shipping_charges(book)
    ...
  end
end
```

如果在回调中抛出异常，不会修改集合。



# Active Record 回调

***

回调是在对象生命周期的某些时刻被调用的方法。通过回调，可以在创建、保存、更新、删除、验证或从数据库中加载 Active Record 对象时执行指定的代码。

## 注册回调

回调在使用之前需要注册。我们可以先把回调定义为普通方法，然后使用宏式类方法把这些普通方法注册为回调：

```ruby
class User < ApplicationRecord
  validates :login, :email, presence: true
 
  before_validation :ensure_login_has_a_value
 
  private # 应该把回调定义为私有方法,以体现封装原则
    def ensure_login_has_a_value
      if login.nil?
        self.login = email unless email.blank?
      end
    end
end
```

宏式类方法也接受块：

```ruby
before_create do
  self.name = login.capitalize if name.blank?
end
```

同时回调也可以指定触发事件：

```ruby
before_validation :normalize_name, on: :create
# :on 选项的值也可以是数组
after_validation :set_location, on: [ :create, :update ]
```



## 可用的回调

### 创建对象

- `before_validation`
- `after_validation`
- `before_save`
- `around_save`
- `before_create`
- `around_create`
- `after_create`
- `after_save`
- `after_commit/after_rollback`

### 更新对象

- `before_validation`
- `after_validation`
- `before_save`
- `around_save`
- `before_update`
- `around_update`
- `after_update`
- `after_save`
- `after_commit/after_rollback`

### 删除对象

- `before_destroy`
- `around_destroy`
- `after_destroy`
- `after_commit/after_rollback`



### `after_initialize` & `after_find` 

只要 Active Record 对象被实例化，不管是通过直接使用 `new` 方法还是从数据库加载记录，都会调用 `after_initialize` 回调。使用这个回调可以避免直接覆盖 Active Record 的 `initialize` 方法。

当 Active Record 从数据库中加载记录时，会调用 `after_find` 回调。`after_find` 会先于`after_initialize`回调。



### `after_touch`

`after_touch` 回调可以和 `belongs_to` 一起使用：

```ruby
class Employee < ApplicationRecord
  belongs_to :company, touch: true
  after_touch do
    puts 'An Employee was touched'
  end
end
 
class Company < ApplicationRecord
  has_many :employees
  after_touch :log_when_employees_or_company_touched
 
  private
  def log_when_employees_or_company_touched
    puts 'Employee/Company was touched'
  end
end
```

```ruby
>> @employee = Employee.last
#<Employee id: 1, company_id: 1, created_at: "2013-11-25 17:04:22", updated_at: "2013-11-25 17:05:05">
 
# triggers @employee.company.touch
>> @employee.touch
Employee/Company was touched
An Employee was touched # true
```



## 调用回调

以下方法可以触发回调：

- `create`
- `create!`
- `decrement!`
- `destroy`
- `destroy!`
- `destroy_all`
- `increment!`
- `save`
- `save!`
- `save(validate: false)`
- `toggle!`
- `update_attribute`
- `update`
- `update!`
- `valid?`

以下方法会触发`after_find`回调：

- `all`
- `first`
- `find`
- `find_by`
- `find_by_*`
- `find_by_*!`
- `find_by_sql`
- `last`

每次初始化类的新对象时都会触发 `after_initialize` 回调。



## 跳过回调

使用下面这些方法可以跳过回调：

- `decrement`
- `decrement_counter`
- `delete`
- `delete_all`
- `increment`
- `increment_counter`
- `toggle`
- `touch`
- `update_column`
- `update_columns`
- `update_all`
- `update_counters`

## 停止执行

回调链被包装在一个事物中，如果想要停止回调可以使用`throw :abort`，Rails会抛出除了 `ActiveRecord::Rollback` 和 `ActiveRecord::RecordInvalid` 之外的其他异常。这可能导致那些预期 `save` 和 `update_attributes` 等方法（通常返回 `true` 或 `false` ）不会引发异常的代码出错。



## 关联回调

在关联中也会触发回调：

```ruby
class User < ApplicationRecord
  has_many :articles, dependent: :destroy
end
 
class Article < ApplicationRecord
  after_destroy :log_destroy_action
 
  def log_destroy_action
    puts 'Article destroyed'
  end
end
```

```ruby
>> user = User.first   #<User id: 1>
>> user.articles.create!   #<Article id: 1, user_id: 1>
>> user.destroy
Article destroyed   #<User id: 1>
```



## 条件回调

可使用`:if`和`:unlese`方法，设置回调条件

同时可以设置多个条件：

```ruby
class Comment < ApplicationRecord
  after_create :send_email_to_author, if: :author_wants_emails?,
  	# Proc.new 表示将之后的代码块地实例成一个方法
    unless: Proc.new { |comment| comment.article.ignore_comments? }
end
```



## 回调类

Active Record 允许我们用类来封装回调方法。如下：

```ruby
class PictureFileCallbacks
  def after_destroy(picture_file)
    if File.exist?(picture_file.filepath)
      File.delete(picture_file.filepath)
    end
  end
end
```

```ruby
class PictureFile < ApplicationRecord
  after_destroy PictureFileCallbacks.new
end
```

也可以将回调方法设置成类的自方法

```ruby
class PictureFileCallbacks
  def self.after_destroy(picture_file)
    if File.exist?(picture_file.filepath)
      File.delete(picture_file.filepath)
    end
  end
end
```

```ruby
class PictureFile < ApplicationRecord
  after_destroy PictureFileCallbacks
end
```

可以在回调类中设置多个回调。



## 事务回调

`after_commit` 和 `after_rollback` 这两个回调会在数据库事务完成时触发。

例如，假设在下面的代码中，`picture_file_2` 对象是无效的，那么调用 `save!` 方法会引发错误：

```ruby
class PictureFile < ApplicationRecord
  # :on 指定出发方法。如果不提供，那么每个动作都会触发回调。
  # 也可以设置具体的别名指定回调方法：
  # after_create_commit
	# after_update_commit
  # after_destroy_commit
  # 如：after_destroy_commit :delete_picture_file_from_disk
  after_commit :delete_picture_file_from_disk, on: :destroy
 
  def delete_picture_file_from_disk
    if File.exist?(filepath)
      File.delete(filepath)
    end
  end
end
```

**注：**如果其中有一个回调引发异常，异常会向上冒泡，后续 `after_commit` 和 `after_rollback` 回调不再执行。如果回调代码可能引发异常，需要在回调中救援并进行适当处理，以便让其他回调继续运行。



# Action Controller

***

Action Controller 是 MVC 中的 C（控制器）。路由器决定使用哪个控制器处理请求后，控制器负责解析请求，生成相应的输出。



## 命名约定

Rails 控制器的命名约定是，最后一个单词使用复数形式。

`ApplicationController`属于例外。

例如：用 `ClientsController`，而不是 `ClientController`；用 `SiteAdminsController`，而不是 `SiteAdminController` 或 `SitesAdminsController`。

**注：**模型的名字习惯使用单数形式。



## 方法和动作

Rails 的控制器是一个继承自`ApplicationController`的类。根据请求路由决定运行哪个控制器的哪个方法，并由 Rails 创建出该控制器的实例，并运行与动作同名的方法。

 ```ruby
class ClientsController < ApplicationController
  def new
  end
end
 ```

用户访问 `/clients/new` 时，Rails 会创建一个 `ClientsController` 实例，然后调用 `new` 方法。并且执行结束后，Rails 会默认渲染`new.html.erb` 视图，且在该视图中可以直接使用控制器中的实例变量。

```ruby
def new
  @client = Client.new # @client 可以直接被视图使用
end
```

`ApplicationController` 继承自 `ActionController::Base`，其中大部分方法在`ActionController::Base`中被定义。

只有`public`方法才可以被访问，如果一个方法不需要被访问，注意要设置为`private`或者`protected`。



## 参数

Rails 中不区分`get`请求的参数和`post`请求的参数，都通过`parmas`散列来获取。

```ruby

class ClientsController < ApplicationController
  # 这个动作响应的 HTTP GET 请求
  def index
    if params[:status] == "activated"
      @clients = Client.activated
    else
      @clients = Client.inactivated
    end
  end
 
  # 这个动作使用 POST 参数
  def create
    @client = Client.new(params[:client])
    if @client.save
      redirect_to @client
    else
      # 这一行代码覆盖默认的渲染行为
      # 默认渲染的是“create”视图
      render "new"
    end
  end
end
```



### 散列和数组参数

`params` 散列可以包含数组和嵌套的散列。若想发送数组，要在键名后加上一对空方括号（`[]`）：

```http
GET /clients?ids[]=1&ids[]=2&ids[]=3
```

**注：**“[”和“]”这两个符号不允许出现在 URL 中，所以上面的地址会被编码成 `/clients?ids%5b%5d=1&ids%5b%5d=2&ids%5b%5d=3`。多数情况下，浏览器会代为编码，Rails 也会自动解码。手动向服务器发送这样的请求时一定要注意。

此时，`params[:ids]` 的值是 `["1", "2", "3"]`。注意，参数的值始终是字符串，Rails 不会尝试转换类型。

**注：**默认情况下，基于安全考虑，参数中的 `[nil]` 和 `[nil, nil, …]` 会替换成 `[]`。



### JSON 参数

如果请求的 `Content-Type` 首部是 `application/json`，Rails 会自动将其转换成 `params` 散列。

例如，发送如下JSON：

```json
{ "company": { "name": "acme", "address": "123 Carrot Street" } }
```

`params[:company]` 是 `{ "name" => "acme", "address" => "123 Carrot Street" }`

如果在初始化脚本中开启了 `config.wrap_parameters` 选项，或者在控制器中调用了 `wrap_parameters` 方法，可以省去 JSON 参数中的根元素。

Rails 会以控制器名新建一个键，复制参数，将其存入这个键名下。上面的参数可以写成：

```json
{ "name": "acme", "address": "123 Carrot Street" }
```

上述数据发给 `CompaniesController`后会存入 `:company` 键名下：

```json
{ name: "acme", address: "123 Carrot Street", company: { name: "acme", address: "123 Carrot Street" } }
```



### 路由参数

可以在路由配置中配置以使控制器可以获得到请求路径中的参数：

```ruby
get '/clients/:status' => 'clients#index', foo: 'bar'
```

此时，用户访问 `/clients/active` 时，`params[:status]` 的值是 `"active"`。同时，`params[:foo]` 的值会被设为 `"bar"`，就像通过查询字符串传入的一样。

控制器还会收到 `params[:action]`，其值为 `"index"`，以及 `params[:controller]`，其值为 `"clients"`。但一般使用 `controller_name` 和 `action_name` 方法来获得。



### default_url_options

在控制器中定义名为 `default_url_options` 的方法，可以设置所生成的 URL 中都包含的参数。这个方法必须返回一个散列，其值为所需的参数值，而且键必须使用符号：

```ruby
class ApplicationController < ActionController::Base
  def default_url_options
    { locale: I18n.locale }
  end
end
```

以上代码定义在`ApplicationController`中如果定义在具体的`Controller`中，只会影响与之相关的 URl。



### 健壮参数

健壮参数可以明确指定可以传入或需要传入的参数。

```ruby
class PeopleController < ActionController::Base
  # 这会导致 ActiveModel::ForbiddenAttributesError 异常抛出
  # 因为没有明确指明允许赋值的属性就批量更新了
  def create
    Person.create(params[:person])
  end
 
  # 只要参数中有 person 键，这个动作就能顺利执行
  # 否则，抛出 ActionController::ParameterMissing 异常
  # ActionController::Base 会捕获这个异常，返回 400 Bad Request 响应
  def update
    person = current_account.people.find(params[:id])
    person.update!(person_params)
    redirect_to person
  end
 
  private
    # 将person的参数获取封装成一个方法以便重复使用
    # 此外，可以细化这个方法，针对每个用户检查允许的属性
    def person_params
      params.require(:person).permit(:name, :age)
    end
end
```



#### 允许使用的标量值

```ruby
params.permit(:id)
```

若 `params` 中有 `:id` 键，且 `:id` 是标量值，就可以通过白名单检查。

允许使用的标量类型有：`String`、`Symbol`、`NilClass`、`Numeric`、`TrueClass`、`FalseClass`、`Date`、`Time`、`DateTime`、`StringIO`、`IO`、`ActionDispatch::Http::UploadedFile` 和 `Rack::Test::UploadedFile`。

指定 `params` 中的值必须为标量数组：

```ruby
params.permit(id: [])
```

无法或不便声明散列参数或其内部结构的有效键时，可以映射为一个空散列：

```ruby
# 但这样就允许任意输入了
params.permit(preferences: {})
```

若想允许传入整个参数散列，可以使用 `permit!` 方法：

```ruby
params.require(:log_entry).permit!
```

此时，允许传入整个 `:log_entry` 散列及嵌套散列，不再检查是不是允许的标量值。使用 `permit!` 时要特别注意，模型中所有现有的属性及后续添加的属性都允许进行批量赋值。



#### 嵌套参数

可以允许传入嵌套参数，例如：

```ruby
params.permit(:name, { emails: [] },
              friends: [ :name,
                         { family: [ :name ], hobbies: [] }])
```

允许传入 `name`、`emails` 和 `friends` 属性。其中，`emails` 是标量数组；`friends` 是一个由资源组成的数组：应该有个 `name` 属性（任何允许使用的标量值），有个 `hobbies` 属性，其值是标量数组，以及一个 `family` 属性，其值只能包含 `name` 属性（也是任何允许使用的标量值）。



## 会话

应用中的每个用户都有一个会话（session），用于存储少量数据，在多次请求中永久存储。会话只能在控制器和视图中使用，可以通过以下几种存储机制实现：

- `ActionDispatch::Session::CookieStore`：所有数据都存储在客户端
- `ActionDispatch::Session::CacheStore`：数据存储在 Rails 缓存里
- `ActionDispatch::Session::ActiveRecordStore`：使用 Active Record 把数据存储在数据库中（需要使用 `activerecord-session_store` gem）
- `ActionDispatch::Session::MemCacheStore`：数据存储在 Memcached 集群中（这是以前的实现方式，现在应该改用 CacheStore）

所有存储机制都会用到一个 cookie，存储每个会话的 ID（必须使用 cookie，因为 Rails 不允许在 URL 中传递会话 ID，这么做不安全）。

多数存储机制都会使用这个 ID 在服务器中查询会话数据，例如在数据库中查询。

Rails 使用的方式是 `CookieStroe`。它所有会话数据都存储在 cookie 中，cookie 中存储的数据会使用密令签名，以防篡改。Rails 会拒绝被篡改的`cookie`。

CookieStore 可以存储大约 4KB 数据。要避免在会话中存储复杂的对象。



#### 访问会话

在控制器中，实例方法 `session` 用于访问会话。

**注：**会话是惰性加载的。如果在动作中不访问，不会自动加载。因此任何时候都无需禁用会话，不访问即可。

会话中的数据以键值对的形式存储，与散列类似：

```ruby
class ApplicationController < ActionController::Base
 
  private
  # 使用会话中 :current_user_id  键存储的 ID 查找用户
  # Rails 应用经常这样处理用户登录
  # 登录后设定这个会话值，退出后删除这个会话值
  def current_user
    @_current_user ||= session[:current_user_id] &&
      User.find_by(id: session[:current_user_id])
  end
end
```

存入数据到会话：

```ruby
class LoginsController < ApplicationController
  # “创建”登录，即“登录用户”
  def create
    if user = User.authenticate(params[:username], params[:password])
      # 把用户的 ID 存储在会话中，以便后续请求使用
      session[:current_user_id] = user.id
      redirect_to root_url
    end
  end
end
```

删除会话中的数据，直接将属性置空即可：

```ruby
@_current_user = session[:current_user_id] = nil
```



#### 闪现消息

闪现消息每次请求都会清空。其中存储的数据只能在下次请求时使用，可用于传递错误消息等。

以退出登录为例。控制器可以发送一个消息，在下次请求时显示：

```ruby
class LoginsController < ApplicationController
  def destroy
    session[:current_user_id] = nil
    flash[:notice] = "You have successfully logged out."
    redirect_to root_url
  end
end
```

重定向也可以设置闪现消息。可以指定 `:notice`、`:alert` 或者常规的 `:flash`：

```ruby
redirect_to root_url, notice: "You have successfully logged out."
redirect_to root_url, alert: "You're stuck here!"
redirect_to root_url, flash: { referral_code: 1234 }
```



## 渲染数据

```ruby
class UsersController < ApplicationController
  def index
    @users = User.all
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render xml: @users}
      format.json { render json: @users}
    end
  end
end
```



## 过滤器

过滤器（filter）是一种方法，在控制器动作运行之前、之后，或者前后运行。

过滤器会继承，如果在 `ApplicationController` 中定义了过滤器，那么应用的每个控制器都可使用。

过滤器定义如下：

```ruby
class ApplicationController < ActionController::Base
  before_action :require_login
 
  private
  def require_login
    unless logged_in?
      flash[:error] = "You must be logged in to access this section"
      redirect_to new_login_url # halts request cycle
    end
  end
end
```

这样所有的请求都会先验证`logged_in`，显然我们必须允许登录等操作通过过滤器：

```ruby
class LoginsController < ApplicationController
  skip_before_action :require_login, only: [:new, :create]
end
```

当然还可以加入后置过滤器和环绕过滤器：

```ruby
around_action :wrap_in_transaction, only: :show
after_action :wrap_in_transaction, only: :show
```

还可以将过滤器直接写在代码块中；

```ruby
class ApplicationController < ActionController::Base
  before_action do |controller|
    unless controller.send(:logged_in?)
      flash[:error] = "You must be logged in to access this section"
      redirect_to new_login_url
    end
  end
end
```

或者直接将过滤方法写入类中，这样能更加可读和重用：

```ruby
class ApplicationController < ActionController::Base
  before_action LoginFilter
end
 
class LoginFilter
  def self.before(controller)
    unless controller.send(:logged_in?)
      controller.flash[:error] = "You must be logged in to access this section"
      controller.redirect_to controller.new_login_url
    end
  end
end
```

这种方式也不是定义 `require_login` 过滤器的理想方式，因为与控制器不在同一作用域，要把控制器作为参数传入。

定义过滤器的类，必须有一个和过滤器种类同名的方法。对于 `before_action` 过滤器，类中必须定义 `before` 方法。其他类型的过滤器以此类推。`around` 方法必须调用 `yield` 方法执行动作。



## 请求伪造防护

跨站请求伪造（Cross-Site Request Forgery，CSRF）是一种攻击方式，A 网站的用户伪装成 B 网站的用户发送请求，在 B 站中添加、修改或删除数据，而 B 站的用户浑然不知。

防止跨站攻击的方式是，在各个请求中添加一个只有服务器才知道的令牌。如果请求中没有正确的令牌，服务器会拒绝访问。

Rails 表单自动添加了隐藏字段设定令牌。如果想自己设置可以通过 `form_authenticity_token` 生成一个有效的令牌。 Ajax 等就可以使用这个方法。



## 请求和响应对象

在每个控制器中都有两个存取方法，分别用于获取当前请求循环的请求对象和响应对象。

`request` 方法的返回值是一个 `ActionDispatch::Request` 实例。

`response` 方法的返回值是一个响应对象，表示回送客户端的数据。



### request

`request` 对象中有很多客户端请求的信息。

可用方法的完整列表参阅 [Rails API 文档](http://api.rubyonrails.org/v5.1.1/classes/ActionDispatch/Request.html)和 [Rack 文档](http://www.rubydoc.info/github/rack/rack/Rack/Request)。下面说明部分属性：

| `request` 对象的属性                                  | 作用                                                         |
| :---------------------------------------------------- | :----------------------------------------------------------- |
| `host`                                                | 请求的主机名                                                 |
| `domain(n=2)`                                         | 主机名的前 `n` 个片段，从顶级域名的右侧算起                  |
| `format`                                              | 客户端请求的内容类型                                         |
| `method`                                              | 请求使用的 HTTP 方法                                         |
| `get?`, `post?`, `patch?`, `put?`, `delete?`, `head?` | 如果 HTTP 方法是 GET/POST/PATCH/PUT/DELETE/HEAD，返回 `true` |
| `headers`                                             | 返回一个散列，包含请求的首部                                 |
| `port`                                                | 请求的端口号（整数）                                         |
| `protocol`                                            | 返回所用的协议外加 `"://"`，例如 `"http://"`                 |
| `query_string`                                        | URL 中的查询字符串，即 `?` 后面的全部内容                    |
| `remote_ip`                                           | 客户端的 IP 地址                                             |
| `url`                                                 | 请求的完整 URL                                               |

不管请求中的参数通过查询字符串发送，还是通过 POST 主体提交，Rails 都会把这些参数存入 `params` 散列中。

`request` 对象有三个存取方法，用于获取参数。

`query_parameters` 散列中的参数来自查询参数；

`request_parameters` 散列中的参数来自 POST 主体；

`path_parameters` 散列中的参数来自路由，传入相应的控制器和动作。



### response

`response` 对象通常不直接使用。

`response` 对象在动作的执行过程中构建，把渲染的数据回送给用户。

不过有时可能需要直接访问响应，比如在后置过滤器中。`response` 对象上的方法有些可以用于赋值。若想了解全部可用方法，参阅 [Rails API 文档](http://api.rubyonrails.org/v5.1.1/classes/ActionDispatch/Response.html)和 [Rack 文档](http://www.rubydoc.info/github/rack/rack/Rack/Response)。

| `response` 对象的属性 | 作用                                                         |
| :-------------------- | :----------------------------------------------------------- |
| `body`                | 回送客户端的数据，字符串格式。                               |
| `status`              | 响应的 HTTP 状态码，例如，请求成功时是 200，文件未找到时是 404。 |
| `location`            | 重定向的 URL（如果重定向的话）。                             |
| `content_type`        | 响应的内容类型。                                             |
| `charset`             | 响应使用的字符集。默认是 `"utf-8"`。                         |
| `headers`             | 响应的首部。                                                 |

可以使用 `response.headers` 方法设置自定义首部。

`headers` 属性是一个散列，键为首部名，值为首部的值。Rails 会自动设置一些首部。如果想添加或者修改首部，赋值给 `response.headers` 即可，例如：

```ruby
response.headers["Content-Type"] = "application/pdf"
```



## 异常处理

在 Rails 中，异常的默认处理方式是显示“500 Server Error”消息。

如果应用在本地运行，出错后会显示一个精美的调用跟踪。如果应用已经上线，Rails 则会简单地显示“500 Server Error”消息；如果是路由错误或记录不存在，则显示“404 Not Found”。

在 Rails 中，有很多层异常处理，如下。



### 默认的 500 和 404 模板

默认情况下，生产环境中的应用出错时会显示 404 或 500 错误消息，在开发环境中则抛出未捕获的异常。错误消息在 `public` 文件夹里的静态 HTML 文件中，分别是 `404.html` 和 `500.html`。



### rescue_from

可以使用 `rescue_from`。`rescue_from` 可以处理整个控制器及其子类中的异常。

异常发生时，会被 `rescue_from` 捕获，异常对象会传入处理程序。处理程序可以是方法，也可以是 `Proc` 对象，由 `:with` 选项指定。也可以不用 `Proc` 对象，直接使用块。

```ruby
class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
 
  private
    def record_not_found
      render plain: "404 Not Found", status: 404
    end
end
```

可以创建自定义异常类，避免使用 `rescue_from Exception` 或 `rescue_from StandardError`以保证错误跟踪：

```ruby

class ApplicationController < ActionController::Base
  rescue_from User::NotAuthorized, with: :user_not_authorized
 
  private
 
    def user_not_authorized
      flash[:error] = "You don't have access to this section."
      redirect_back(fallback_location: root_path)
    end
end
 
class ClientsController < ApplicationController
  # 检查是否授权用户访问客户信息
  before_action :check_authorization
 
  # 注意，这个动作无需关心任何身份验证操作
  def edit
    @client = Client.find(params[:id])
  end
 
  private
 
    # 如果用户没有授权，抛出异常
    def check_authorization
      raise User::NotAuthorized unless current_user.admin?
    end
end
```



# Rails 路由

***

Rails 路由用于识别 URL 地址，把它们分派给控制器动作或 Rack 应用进行处理。

它还能生成路径和 URL 地址，从而避免在视图中硬编码字符串。



## 路由的作用

Rails 路由会将接收到的请求与配置的控制器动作连接起来，当接收到请求时会将请求分配给相应的控制器的对应动作。例如：

```ruby
get '/patients/:id', to: 'patients#show'
```

如上配置会将请求分配给`patients`的`show`动作。

Rails 路由还可以生成 URL 地址：

```ruby
get '/patients/:id', to: 'patients#show', as: 'patient'
```

这样在`patient_path()`中传入`@patient`参数即可设置对应的请求。

**注：**在`patient_path()`中不需要指定`@patient`的ID。



## 资源路由

资源路由（resource routing）允许我们为资源式控制器快速声明所有常见路由，默认声明了为`index`、`show`、`new`、`edit`、`create`、`update` 和 `destroy` 等动作。



### 路由映射

Rails 资源路由把 HTTP 方法和 URL 地址映射到控制器动作上。每个控制器动作也会映射到对应的数据库 CRUD 操作上。路由文件中的单行声明，例如；

```ruby
resources :photos
```

会创建如下路由并映射到`Photos`控制器上：

| HTTP 方法     | 路径               | 控制器#动作      | 用途                         |
| :------------ | :----------------- | :--------------- | :--------------------------- |
| `GET`         | `/photos`          | `photos#index`   | 显示所有照片的列表           |
| `GET`         | `/photos/new`      | `photos#new`     | 返回用于新建照片的 HTML 表单 |
| `POST`        | `/photos`          | `photos#create`  | 新建照片                     |
| `GET`         | `/photos/:id`      | `photos#show`    | 显示指定照片                 |
| `GET`         | `/photos/:id/edit` | `photos#edit`    | 返回用于修改照片的 HTML 表单 |
| `PATCH`/`PUT` | `/photos/:id`      | `photos#update`  | 更新指定照片                 |
| `DELETE`      | `/photos/:id`      | `photos#destroy` | 删除指定照片                 |

可以同时定义多个资源：

```ruby
resources :photos, :books, :videos

# 等同于
resources :photos
resources :books
resources :videos
```



### 单数路由

单数路由用于不需要使用 ID 就可以查询信息的情况。例如想让 `/profile` 总是显示当前登录用户的个人信息，可以做如下配置：

```ruby
get 'profile', to: 'user#show'
```

如上配置可以指定访问`/profile`时访问`user`的`;show`动作。

也可以通过如下配置实现以上代码：

```ruby
get 'profile', to: :show, controller: 'user'
```

利用`resource`可以自动创建如下 6 个单数路由：

```ruby
resource :geocoder
```

| HTTP 方法     | 路径             | 控制器#动作         | 用途                               |
| :------------ | :--------------- | :------------------ | :--------------------------------- |
| `GET`         | `/geocoder/new`  | `geocoders#new`     | 返回用于创建 geocoder 的 HTML 表单 |
| `POST`        | `/geocoder`      | `geocoders#create`  | 新建 geocoder                      |
| `GET`         | `/geocoder`      | `geocoders#show`    | 显示唯一的 geocoder 资源           |
| `GET`         | `/geocoder/edit` | `geocoders#edit`    | 返回用于修改 geocoder 的 HTML 表单 |
| `PATCH`/`PUT` | `/geocoder`      | `geocoders#update`  | 更新唯一的 geocoder 资源           |
| `DELETE`      | `/geocoder`      | `geocoders#destroy` | 删除 geocoder 资源                 |



### 辅助方法

Rails 创建资源路由时也会查滚进相应获取路径的辅助方法，例如如上资源`photos`会创建如下辅助方法：

```ruby
# 返回值为 /photos
photos_path 
# 返回值为 /photos/new
new_photo_path 
# 返回值为 /photos/:id/edit（例如，edit_photo_path(10) 的返回值为 /photos/10/edit）
edit_photo_path(:id) 
# 返回值为 /photos/:id（例如，photo_path(10) 的返回值为 /photos/10）
photo_path(:id)
```

以上方法都有对应的 `_url` 形式（例如 `photos_url`）。其返回的是：

```ruby
<主机名> + <端口> + <路径>
```



### 嵌套

Rails 允许路由嵌套，但维护困难：

```ruby
resources :publishers do
  resources :magazines do
    resources :photos
  end
end
```

对应路径为`/publishers/1/magazines/2/photos/3`

所以嵌套不应超过一层。



#### 浅层嵌套

嵌套路由应该准确嵌套最少的信息：

```ruby
resources :articles do
  resources :comments, only: [:index, :new, :create]
end
resources :comments, only: [:show, :edit, :update, :destroy]
```

以上代码可以利用`:shallow`选项简写：

```ruby
resources :articles do
  resources :comments, shallow: true
end
```

```ruby
# 在所有嵌套子资源中使用 :shallow 选项
resources :articles, shallow: true do
  resources :comments
  resources :quotes
  resources :drafts
end
```

```ruby
# 利用 ;shallow 方法创建作用域效果同上
shallow do
  resources :articles do
    resources :comments
    resources :quotes
    resources :drafts
  end
end
```



#### 自定义浅层嵌套

`scope`方法有两个方法用于自定义浅层路由：

`:shallow_path` 选项会为成员路径添加指定前缀：

```ruby
scope shallow_path: "sekret" do
  resources :articles do
    resources :comments, shallow: true
  end
end
```

上面的代码会为 `comments` 资源生成下列路由：

| HTTP 方法     | 路径                                           | 控制器#动作        | 具名辅助方法               |
| :------------ | :--------------------------------------------- | :----------------- | :------------------------- |
| `GET`         | `/articles/:article_id/comments(.:format)`     | `comments#index`   | `article_comments_path`    |
| `POST`        | `/articles/:article_id/comments(.:format)`     | `comments#create`  | `article_comments_path`    |
| `GET`         | `/articles/:article_id/comments/new(.:format)` | `comments#new`     | `new_article_comment_path` |
| `GET`         | `/sekret/comments/:id/edit(.:format)`          | `comments#edit`    | `edit_comment_path`        |
| `GET`         | `/sekret/comments/:id(.:format)`               | `comments#show`    | `comment_path`             |
| `PATCH`/`PUT` | `/sekret/comments/:id(.:format)`               | `comments#update`  | `comment_path`             |
| `DELETE`      | `/sekret/comments/:id(.:format)`               | `comments#destroy` | `comment_path`             |

`:shallow_prefix` 选项会为具名辅助方法添加指定前缀：

```ruby
scope shallow_prefix: "sekret" do
  resources :articles do
    resources :comments, shallow: true
  end
end
```

上面的代码会为 `comments` 资源生成下列路由：

| HTTP 方法     | 路径                                           | 控制器#动作        | 具名辅助方法               |
| :------------ | :--------------------------------------------- | :----------------- | :------------------------- |
| `GET`         | `/articles/:article_id/comments(.:format)`     | `comments#index`   | `article_comments_path`    |
| `POST`        | `/articles/:article_id/comments(.:format)`     | `comments#create`  | `article_comments_path`    |
| `GET`         | `/articles/:article_id/comments/new(.:format)` | `comments#new`     | `new_article_comment_path` |
| `GET`         | `/comments/:id/edit(.:format)`                 | `comments#edit`    | `edit_sekret_comment_path` |
| `GET`         | `/comments/:id(.:format)`                      | `comments#show`    | `sekret_comment_path`      |
| `PATCH`/`PUT` | `/comments/:id(.:format)`                      | `comments#update`  | `sekret_comment_path`      |
| `DELETE`      | `/comments/:id(.:format)`                      | `comments#destroy` | `sekret_comment_path`      |



### 命名空间

为把同一类相关控制器放入同一个命名空间，可以利用`namespace`。例如和管理相关的控制器放入 `Admin::` 命名空间中，可以吧同一类控制器文件放入 `app/controllers/admin` 文件夹，文件中的控制器定义如下;

```ruby
class Admin::ArticlesController < ApplicationController
# 多层文件夹
class Admin::Api::ArticlesController < ApplicationController  
```

然后在路由文件中作如下声明：

```ruby
namespace :admin do
  resources :articles, :comments
end
```

上面的代码会为 `articles` 和 `comments` 控制器分别创建多个路由。对于 `Admin::Articles` 控制器，Rails 会创建下列路由：

| HTTP 方法     | 路径                       | 控制器#动作              | 具名辅助方法                   |
| :------------ | :------------------------- | :----------------------- | :----------------------------- |
| `GET`         | `/admin/articles`          | `admin/articles#index`   | `admin_articles_path`          |
| `GET`         | `/admin/articles/new`      | `admin/articles#new`     | `new_admin_article_path`       |
| `POST`        | `/admin/articles`          | `admin/articles#create`  | `admin_articles_path`          |
| `GET`         | `/admin/articles/:id`      | `admin/articles#show`    | `admin_article_path(:id)`      |
| `GET`         | `/admin/articles/:id/edit` | `admin/articles#edit`    | `edit_admin_article_path(:id)` |
| `PATCH`/`PUT` | `/admin/articles/:id`      | `admin/articles#update`  | `admin_article_path(:id)`      |
| `DELETE`      | `/admin/articles/:id`      | `admin/articles#destroy` | `admin_article_path(:id)`      |

可以不再命名空间中使用`scope`去掉`admin_` 前缀：

```ruby
# 设置默认模块
scope module: 'admin/api' do
  resources :articles, :comments
end

#单个资源
resources :articles, module: 'admin'
resources :articles, module: 'admin/api' # 多层文件夹
```

`scope`也可以把 `/admin/articles` 路径映射到 `Articles` 控制器上（不带 `Admin::` 前缀）：

```ruby
# 设置默认路径
scope '/admin' do
  resources :articles, :comments
end

# 单个资源
resources :articles, path: '/admin/articles'
```

在下列路径会被映射到 `Articles` 控制器上：

| HTTP 方法     | 路径                       | 控制器#动作        | 具名辅助方法             |
| :------------ | :------------------------- | :----------------- | :----------------------- |
| `GET`         | `/admin/articles`          | `articles#index`   | `articles_path`          |
| `GET`         | `/admin/articles/new`      | `articles#new`     | `new_article_path`       |
| `POST`        | `/admin/articles`          | `articles#create`  | `articles_path`          |
| `GET`         | `/admin/articles/:id`      | `articles#show`    | `article_path(:id)`      |
| `GET`         | `/admin/articles/:id/edit` | `articles#edit`    | `edit_article_path(:id)` |
| `PATCH`/`PUT` | `/admin/articles/:id`      | `articles#update`  | `article_path(:id)`      |
| `DELETE`      | `/admin/articles/:id`      | `articles#destroy` | `article_path(:id)`      |

**注：**如果想在命名空间代码块中使用另一个控制器命名空间，可以指定控制器的绝对路径，例如 `get '/foo' => '/foo#index'`。



### 添加路由

我们可以根据需要添加其他路由，包括集合路由（collection route）和成员路由（member route）。



##### 成员路由

用于某个资源下更明确的，具体某个对象的路由划分，比如为了让 Rails 路由能够识别 `/photos/1/preview` 路径上的 `GET` 请求，我们可以作如下配置：

```ruby
resources :photos do
  member do
    get 'preview'
  end
end

# 如果只有一个成员路由也可也省略 member 块
resources :photos do
  get 'preview', on: :member # 如果不使用 on: 获取 ID 必须通过 params[:photo_id] 
end
```

配置后请求会被发送给`Photos`控制器的`preview`动作上，并创建 `preview_photo_url` 和 `preview_photo_path` 辅助方法，同时可以通过`:params[:id]`获取`photo`的 ID。



##### 集合路由

用于某个资源下更明确的划分，比如为了让 Rails 路由能够识别 `/photos/search` 路径上的 `GET` 请求，

我们可以作如下配置：

```ruby
resources :photos do
  collection do
    get 'search'
  end
end

# 如果只有一个成员路由也可也省略 collection 块
resources :photos do
  get 'search', on: :collection
end
```

配置后请求会被发送给`Photos` 控制器的 `search` 动作上，同时创建 `search_photos_url` 和 `search_photos_path` 辅助方法。



#### 动作路由

可以通过 `:on` 选项，为附加的 `new` 动作添加路由：

```ruby
resources :comments do
  get 'preview', on: :new
end
```

Rails 路由能够识别 `/comments/new/preview` 路径上的 `GET` 请求，并把请求映射到 `Comments` 控制器的 `preview` 动作上，同时创建 `preview_new_comment_url` 和 `preview_new_comment_path` 辅助方法。

**注：**最好不要在一个资源路由中添加过多路由，可以考虑新建资源。



## 非资源式路由

Rails 也支持将任意 URL 映射到控制器动作。这需要我们分别声明路径和对应的动作。

### 参数

#### 绑定参数

在声明普通路由时，我们也可以将参数绑定到请求中：

```ruby
get 'photos(/:id)', to: :display
```

`photos/1`到请求会被映射到`Photos`控制器的`display`动作上，且通过`params[:id]`获得路径参数 1。

Rails 也可以获得到请求 URL 中绑定到参数，例如；`/photos/1?user_id=2`到请求，Rails 会将`user_id`保存到`parmas`中。此时，`params` 的值是 

```json
`{ controller: 'photos', action: 'show', id: '1', user_id: '2' }`
```



#### 默认值

`:defaults`选项用于设定请求到默认值。

```ruby
get 'photos/:id', to: 'photos#show', defaults: { format: 'jpg' }
```

Rails 会把 `/photos/12` 路径映射到 `Photos` 控制器的 `show` 动作上，并把 `params[:format]` 设为 `"jpg"`。

`defaults` 还有块的形式，可为多个路由定义默认值：

```ruby
defaults format: :json do
  resources :photos
end
```



### 片段

#### 动态片段

Rails 路由允许使用多个动态片段（dynamic segment）。动态片段会传入 `params`，以便在控制器动作中使用。

```ruby
get 'photos/:id/:user_id', to: 'photos#show'
```

`/photos/1/2` 路径会被映射到 `Photos` 控制器的 `show` 动作上。此时，`params[:id]` 的值是 `"1"`，`params[:user_id]` 的值是 `"2"`。



#### 静态片段

可以用不带冒号的片段来指定静态片段（static segment）：

```ruby
get 'photos/:id/with_user/:user_id', to: 'photos#show'
```

 `/photos/1/with_user/2` 路径会被映射到 `Photos` 控制器的 `show` 动作上。此时，`params` 的值为 

```json
{ controller: 'photos', action: 'show', id: '1', user_id: '2' }
```



### 路由命名

`:as` 选项可以为路由命名：

```ruby
get 'exit', to: 'sessions#destroy', as: :logout
```

这个路由声明会创建 `logout_path` 和 `logout_url` 具名辅助方法。其中，`logout_path` 辅助方法的返回值是 `/exit`。

路由命名还可以覆盖由资源路由定义的路由辅助方法，例如：

```ruby
get ':username', to: 'users#show', as: :user
```

这个路由声明会定义 `user_path` 辅助方法，此方法可以在控制器、辅助方法和视图中使用，其返回值类似 `/bob`。在 `Users` 控制器的 `show` 动作中，`params[:username]` 的值是用户名。如果不想使用 `:username` 作为参数名，可以在路由声明中把 `:username` 改为其他名字。



### 约束

#### 请求方法约束

通过`match`方法和`:via`选项，可以一次匹配多个 HTTP 的请求方法：

```ruby
match 'photos', to: 'photos#show', via: [:get, :post]

match 'photos', to: 'photos#show', via: :all # 用于匹配所有 HTTP 请求方法。
```

**注：**Rails 在处理 `GET` 请求时不会检查 CSRF 令牌。在处理 `GET` 请求时绝对不可以对数据库进行写操作。



#### 片段约束

`:constraints` 选项可以通过设置正则表达式来约束动态片段的格式：

```ruby
get 'photos/:id', to: 'photos#show', constraints: { id: /[A-Z]\d{5}/ }

get 'photos/:id', to: 'photos#show', id: /[A-Z]\d{5}/ # 简写
```

这个路由会匹配 `/photos/A12345` 路径，但不会匹配 `/photos/893` 路径。

`:constraints` 选项中的正则表达式不能使用 `^` 符号。



#### 请求约束



#### 自定义约束



### 通配符

Rails 路由还支持通配符形式：

```ruby
get 'photos/*other', to: 'photos#unknown'
```

这个路由会匹配 `photos/12` 和 `/photos/long/path/to/12` 路径，并把 `params[:other]` 分别设置为 `"12"` 和 `"long/path/to/12"`。

像 `*other` 这样以星号开头的片段，称作“通配符片段”。

通配符片段可以出现在路由中的任何位置。例如：

```ruby
get 'books/*section/:title', to: 'books#show'
```

这个路由会匹配 `books/some/section/last-words-a-memoir` 路径，此时：

````ruby
params[:section] = 'some/section'
params[:title] = 'last-words-a-memoir'
````

路由中可以有多个通配符片段：

```ruby
get '*a/foo/*b', to: 'test#index'
```

会匹配 `zoo/woo/foo/bar/baz` 路径，此时：

```ruby
params[:a] = 'zoo/woo'
params[:b] = 'bar/baz'
```



### Rack 路由

实际上，路由中的配置`to: 'articles#index'` 会被展开为 `ArticlesController.action(:index)`，其返回值是一个 Rack 应用。

也就是说，路由响应的是一个 Rack 应用。我们完全可以自定义一个可以响应`call`方法的类，并放回一个`[status, headers, body]`数组，来取代控制器的动作。

```ruby
match '/application.js', to: MyRackApp, via: :all
```

但这样路由所匹配的路径，就是 Rack 应用接收的路径。例如，对于下面的路由，Rack 应用接收的路径是 `/admin`：

```ruby
match '/admin', to: AdminApp, via: :all
```

`mount` 方法可以使 Rack 应用接收根路径上的请求：

```ruby
mount AdminApp, at: '/admin'
```



### 根路径请求

`root` 方法用于处理根路径（`/`）上的请求：

```ruby
root to: 'pages#main'
root 'pages#main' # 简写
```

`root` 路由只处理 `GET` 请求。

命名空间中同样可以使用`root`方法：

```ruby
namespace :admin do
  root to: "admin#index"
end
 
root to: "home#index"
```



## 自定义资源路由

Rails 允许我们通过各种方式自定义资源式辅助方法（resourceful helper）。

### 指定控制器

`:controller` 选项用于显式指定资源使用的控制器，例如：

```ruby
resources :photos, controller: 'images'

# 命名空间中可以通过目录指定 controller
namespace 'user' do
  # 该路由会被映射到 Admin::UserPermissions 控制器
	resources :user_permissions, controller: 'admin/user_permissions'
end
```

| HTTP 方法     | 路径               | 控制器#动作      | 具名辅助方法           |
| :------------ | :----------------- | :--------------- | :--------------------- |
| `GET`         | `/photos`          | `images#index`   | `photos_path`          |
| `GET`         | `/photos/new`      | `images#new`     | `new_photo_path`       |
| `POST`        | `/photos`          | `images#create`  | `photos_path`          |
| `GET`         | `/photos/:id`      | `images#show`    | `photo_path(:id)`      |
| `GET`         | `/photos/:id/edit` | `images#edit`    | `edit_photo_path(:id)` |
| `PATCH`/`PUT` | `/photos/:id`      | `images#update`  | `photo_path(:id)`      |
| `DELETE`      | `/photos/:id`      | `images#destroy` | `photo_path(:id)`      |



### 指定约束

`:constraints` 选项用于指定隐式 ID 必须满足的格式要求。例如：

```ruby
resources :photos, constraints: { id: /[A-Z][A-Z][0-9]+/ }
```

这个路由声明使用正则表达式来约束 `:id` 参数。此时，路由将不会匹配 `/photos/1` 路径，但会匹配 `/photos/RR27` 路径。

也可以通过块把一个约束应用于多个路由：

```ruby
constraints(id: /[A-Z][A-Z][0-9]+/) do
  resources :photos
  resources :accounts
end
```



### 修改辅助方法

```ruby
resources :photos, as: 'images'
```

| HTTP 方法     | 路径               | 控制器#动作      | 具名辅助方法           |
| :------------ | :----------------- | :--------------- | :--------------------- |
| `GET`         | `/photos`          | `photos#index`   | `images_path`          |
| `GET`         | `/photos/new`      | `photos#new`     | `new_image_path`       |
| `POST`        | `/photos`          | `photos#create`  | `images_path`          |
| `GET`         | `/photos/:id`      | `photos#show`    | `image_path(:id)`      |
| `GET`         | `/photos/:id/edit` | `photos#edit`    | `edit_image_path(:id)` |
| `PATCH`/`PUT` | `/photos/:id`      | `photos#update`  | `image_path(:id)`      |
| `DELETE`      | `/photos/:id`      | `photos#destroy` | `image_path(:id)`      |

嵌套资源中也可以通过`:as`修改辅助方法

```ruby
resources :magazines do
  resources :ads, as: 'periodical_ads'
end
```

会生成 `magazine_periodical_ads_url` 和 `edit_magazine_periodical_ad_path` 等辅助方法。



### 修改路径

可以通过`path_names`修改请求路径的片段

```ruby
resources :photos, path_names: { new: 'make', edit: 'change' }
```

```ruby
/photos/make # 还是会被分配到 new 动作
/photos/1/change # 还是会被分配到 edit 动作
```

也可以通过作用域覆盖多个路由：

```ruby
scope path_names: { new: 'make' } do
  # 路由
end
```

在`scope`中还可以直接修改请求路径：

```ruby
scope(path_names: { new: 'neu', edit: 'bearbeiten' }) do
  resources :categories, path: 'kategorien'
end
```

| HTTP 方法     | 路径                         | 控制器#动作          | 具名辅助方法              |
| :------------ | :--------------------------- | :------------------- | :------------------------ |
| `GET`         | `/kategorien`                | `categories#index`   | `categories_path`         |
| `GET`         | `/kategorien/neu`            | `categories#new`     | `new_category_path`       |
| `POST`        | `/kategorien`                | `categories#create`  | `categories_path`         |
| `GET`         | `/kategorien/:id`            | `categories#show`    | `category_path(:id)`      |
| `GET`         | `/kategorien/:id/bearbeiten` | `categories#edit`    | `edit_category_path(:id)` |
| `PATCH`/`PUT` | `/kategorien/:id`            | `categories#update`  | `category_path(:id)`      |
| `DELETE`      | `/kategorien/:id`            | `categories#destroy` | `category_path(:id)`      |



### 添加前缀

`scope`方法用于添加路由的前缀：

```ruby
# 访问路径为 /admin/photos
scope 'admin' do
  resources :photos
end
```

`scope`的`as:`选项可以设置辅助方法的前缀

```ruby
# 访问路径为 /admin/photos
# 辅助方法为 admin_photos_path，其返回地址为 /admin/photos
scope 'admin', as: 'admin' do
  resources :photos
  # resources :photos, :accounts ## 可作用于多个资源
end
```

`scope`还可以指定参数前缀：

```ruby
scope ':username' do
  resources :articles
end
```

这个路由能够识别 `/bob/articles/1` 路径，同时，在控制器、辅助方法和视图中，可以使通过`params[:username]` 获取路径中的参数`bob`。



### 限制路由

Rails 路由默认会创建 7 个默认动作（`index`、`show`、`new`、`create`、`edit`、`update` 和 `destroy`）。可以使用 `:only` 和 `:except` 选项来微调此行为。

```ruby
# :only 选项用于指定想要生成的路由
resources :photos, only: [:index, :show]

# :except 选项用于指定不想生成的路由
resources :photos, except: :destroy
```



## 测试路由

启动服务器后在浏览器中访问 http://localhost:3000/rails/info/routes 可以查看所有路由。

在终端中执行`rails routes` 命令也可以查看所有路由。

两种方式都会按照路由在 `config/routes.rb` 文件中的声明顺序，列出所有路由。每个路由都包含以下信息：

- 路由名称（如果有的话）
- 所使用的 HTTP 方法（如果路由不响应所有的 HTTP 方法）
- 所匹配的 URL 模式
- 路由参数

例如，下面是执行 `rails routes` 命令后，REST 式路由的一部分输出结果：

```bash
  users GET    /users(.:format)          users#index
          POST   /users(.:format)          users#create
 new_user GET    /users/new(.:format)      users#new
edit_user GET    /users/:id/edit(.:format) users#edit
```

可以使用 `grep` 选项（即 `-g`）搜索路由。只要路由的 URL 辅助方法的名称、HTTP 方法或 URL 路径中有部分匹配，该路由就会显示在搜索结果中。

```bash
$ bin/rails routes -g new_comment
$ bin/rails routes -g POST
$ bin/rails routes -g admin
```

要想查看映射到指定控制器的路由，可以使用 `-c` 选项：

```bash
$ bin/rails routes -c users
$ bin/rails routes -c admin/users
$ bin/rails routes -c Comments
$ bin/rails routes -c Articles::CommentsController
```

Rails 提供的三个内置断言可以用于测试路由：

- `assert_generates` 断言
- `assert_recognizes` 断言
- `assert_routing` 断言

```ruby
# 断定所指定的路径可以生成指定的控制器
assert_generates '/photos/1', { controller: 'photos', action: 'show', id: '1' }

# 断定提供的控制器动作可以识别路径
assert_recognizes({controller：'photos'，action：'create'}，
									{path：'photos'，method：：post})

# 双向测试，同时测试 assert_generates 和 assert_recognizes
assert_routing({ path: 'photos', method: :post }, 
							 { controller: 'photos', action: 'create' })
```



