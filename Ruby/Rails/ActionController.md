

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

