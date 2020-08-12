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



### 迁移



关于迁移的详细介绍，参阅[Active Record 迁移](https://ruby-china.github.io/rails-guides/active_record_migrations.html)。



## Active Record 关联

关联可以将两个业务上有联系的两个模块联系起来，以简化其中的数据操作。

Rails 支持六种关联：

- `belongs_to`
- `has_one`
- `has_many`
- `has_many :through`
- `has_one :through`
- `has_and_belongs_to_many`



### belongs_to

#### 基本使用

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

#### 关联方法

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

#### 方法选项

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

#### 作用域

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

### has_one

#### 基本使用

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



### has_many

#### 基本使用

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

#### 关联方法

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

#### 方法选项

和`belong_to`基本相似，这里介绍部分不相似的选项。

**:source**

指定 `has_many :through` 关联的源关联名称。只有无法从关联名中解出源关联的名称时才需要设置这个选项。

**:source_type**

指定通过多态关联处理 `has_many :through` 关联的源关联类型。

#### 作用域

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

  

### has_many :through

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



### has_one :through

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



### has_and_belongs_to_many

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



### 自联结

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



### 关联的作用域

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



### 关联回调

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



## Active Record 回调

回调是在对象生命周期的某些时刻被调用的方法。通过回调，可以在创建、保存、更新、删除、验证或从数据库中加载 Active Record 对象时执行指定的代码。

### 注册回调

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



### 可用的回调

#### 创建对象

- `before_validation`
- `after_validation`
- `before_save`
- `around_save`
- `before_create`
- `around_create`
- `after_create`
- `after_save`
- `after_commit/after_rollback`

#### 更新对象

- `before_validation`
- `after_validation`
- `before_save`
- `around_save`
- `before_update`
- `around_update`
- `after_update`
- `after_save`
- `after_commit/after_rollback`

#### 删除对象

- `before_destroy`
- `around_destroy`
- `after_destroy`
- `after_commit/after_rollback`

#### `after_initialize` & `after_find` 

只要 Active Record 对象被实例化，不管是通过直接使用 `new` 方法还是从数据库加载记录，都会调用 `after_initialize` 回调。使用这个回调可以避免直接覆盖 Active Record 的 `initialize` 方法。

当 Active Record 从数据库中加载记录时，会调用 `after_find` 回调。`after_find` 会先于`after_initialize`回调。

#### `after_touch`

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



### 调用回调

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



### 跳过回调

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

### 停止执行

回调链被包装在一个事物中，如果想要停止回调可以使用`throw :abort`，Rails会抛出除了 `ActiveRecord::Rollback` 和 `ActiveRecord::RecordInvalid` 之外的其他异常。这可能导致那些预期 `save` 和 `update_attributes` 等方法（通常返回 `true` 或 `false` ）不会引发异常的代码出错。



### 关联回调

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



### 条件回调

可使用`:if`和`:unlese`方法，设置回调条件

同时可以设置多个条件：

```ruby
class Comment < ApplicationRecord
  after_create :send_email_to_author, if: :author_wants_emails?,
  	# Proc.new 表示将之后的代码块地实例成一个方法
    unless: Proc.new { |comment| comment.article.ignore_comments? }
end
```



### 回调类

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



### 事务回调

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



## Active Model

Active Model 库用于开发要在 Active Record 中存储的类。可在 Rails 框架外部使用。

Rails引入了Active Model以调用其中的回调，数据验证等方法：

```ruby
require "active_model"
require "active_model/attribute_set"

module ActiveRecord
  extend ActiveSupport::Autoload
  
  autoload :Base
  autoload :Callbacks
  ...
```

当我们的类继承ActiveRecord的时候便可以调用这些方法。

详细可参阅[Active Model 基础](https://ruby-china.github.io/rails-guides/active_model_basics.html)

