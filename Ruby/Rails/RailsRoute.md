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

这样在`patient_path()`中传入`@patient`参数即可设置对应的请求地址。

**注：**在`patient_path()`中不需要指定`@patient`的ID。



## 资源路由

资源路由（resource routing）允许我们为资源式控制器快速声明所有常见路由，默认声明了为`index`、`show`、`new`、`edit`、`create`、`update` 和 `destroy` 等动作。



### 资源映射

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

为把同一类相关控制器放入同一个命名空间，可以利用`namespace`。例如和管理相关的控制器放入 `Admin::` 命名空间中，可以吧同一类控制器文件放入 `app/controllers/admin` 文件夹，文件中的控制器定义如下：

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

可以不在命名空间中，然后使用`scope`去掉`admin_` 前缀：

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

可以在请求的对象上创建一个方法并返回一个字符串来约束路由。

```ruby
get 'photos', to: 'photos#index', constraints: { subdomain: 'admin' }
```

如上，请求对象上调用和约束条件中散列的键同名的方法，然后比较返回值和散列的值。即在`Photoes`中存在一个`subdomain`方法，用以返回字符串并和 `'admin'`比较，以验证路由。



#### 自定义约束

如果需要复杂约束，可以使用能够响应 `matches?` 方法的对象作为约束，即对象中实现`matches?`方法。

```ruby
class BlacklistConstraint
  def initialize
    @ips = Blacklist.retrieve_ips # 假设为获取黑名单用户对列表
  end
 
  def matches?(request)
    @ips.include?(request.remote_ip)
  end
end
 
Rails.application.routes.draw do
  get '*path', to: 'blacklist#index',
    constraints: BlacklistConstraint.new
end
```





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

