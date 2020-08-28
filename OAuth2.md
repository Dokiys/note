# OAuth2.0

## 概述

`OAuth`是一个关于授权（authorization）的开放网络标准。

> The OAuth 2.0 authorization framework enables a third-party   application to obtain limited access to an HTTP service, either on   behalf of a resource owner by orchestrating an approval interaction   between the resource owner and the HTTP service, or by allowing the   third-party application to obtain access on its own behalf.  											——《[RFC 6749](http://www.rfcreader.com/#rfc6749)》

即：用于给`Resource Owner`提供校验授权给第三方程序以访问其`HTTP`资源，此间不需要向第三方应用程序提供账户密码。



### 场景

假设有个“云冲印”的网站，可以将用户在 Google 的照片，冲印出来。用户为了使用该服务，必须让"云冲印"读取自己储存在 Google 上的照片。

但 Google 肯定不会允许“云冲印”随意获取到用户的照片，所以必须要经过用户的同意，Google才会将照片的访问权限交给“云冲印”

如果用传统方法，用户可以直接将账号，密码告诉“云冲印”，但这样“云冲印”就获得了用户的全部权限，甚至可以修改密码，这样并不安全。

而 OAuth 则是在“云冲印”和 Google 之间的中间层，通过用户在 Google 认证后，Google 给“云冲印”授权的令牌（token）的方式，允许“云冲印”有限的使用用户资源。



### 名词定义

* **Third-party Application**：第三方应用程序，本文中又称"客户端"（client）
* **HTTP Service**：HTTP服务提供商
* **Resource Owner**：资源所有者，即"用户"（user）。
* **User Agent**：用户代理，一般是浏览器。
* **Authorization Server**：认证服务器，即服务提供商专门用来处理认证的服务器。
* **Resource Server**：资源服务器，即服务提供商存放用户生成的资源的服务器。



### 授权机制

`OAuth`在第三方应用和服务提供商之间设置了一个授权层，以将用户的登录和第三方应用区分开。

即`OAuth`允许用户告诉服务提供商，同意授权第三方应用获取某些数据。此后服务提供商生成一个有一定期限以及一定权限的令牌（token）给第三方应用，以代替用户的密码。



## 授权模式

客户端必须得到用户的授权（authorization grant），才能获得令牌（access token）。`OAuth2.0`定义了四种授权方式。

- 授权码模式（authorization code）
- 简化模式（implicit）
- 密码模式（resource owner password credentials）
- 客户端模式（client credentials）

**注：**为防止令牌滥用，不管哪一种授权方式，第三方应用申请令牌之前，都必须先到 Authorization Server 备案，然后会拿到两个身份识别码：客户端 ID（client ID）和客户端密钥（client secret）。 Authorization Server 通过 client ID 和 client secret 验证第三方身份之后再在需要的时候为其发放 Token。



### code

最常用的模式，安全性也最高，适用于那些有后端的 Web 应用。授权码通过前端传送，令牌储存在后端，所有与资源服务器的通信都在后端完成。这样可以避免令牌泄漏。

以“云冲印”为例：

**Step1：**在“云冲印”需要访问用户 Google 上的照片时，会将用户引导跳转到 Google 认证用户信息的页面。示意跳转链接如下：

```url
https://google.com/oauth/authorize?
  response_type=code&  					## 要求返回code
  client_id=CLIENT_ID&					## CLIENT_ID为在认证服务器上备案时获得的client_id
  redirect_uri=CALLBACK_URL&		## 认证服务器认证后的重定向地址
  scope=read										## 授权范围
```

**Step2：**用户访问以上链接并在认证服务器认证通过后，认证服务器会将用户重定向到访问时传入的`redirect_uri`地址，即`CALLBACK_URL`。示例如下：

```url
https://yunprint.com/callback?
	code=AUTHORIZATION_CODE				## code即为认证服务器返回的授权码
```

**Step3：**这时“云冲印”即可通过授权码、client_id、client_secret以及验证通过后让 Google 重定向的地址在后端向 Google 请求`token`。（涉及到了在 Google 注册的 clien_secret ，为保证安全，所以在后端请求 token）示例请求如下：

```url
https://google.com/oauth/token?
 client_id=CLIENT_ID&						## 在认证服务器备案获得的id
 client_secret=CLIENT_SECRET&		## 在认证服务器备案获得的secret
 grant_type=authorization_code& ## 获得的授权类型
 code=AUTHORIZATION_CODE&				## 请求模式
 redirect_uri=CALLBACK_URL			## 生成令牌后的回调地址
```

**Step4：**Google 收到请求并校验信息后，会向`CALLBACK_URL`发送一个 JSON 字符串：

```json
{    
  "access_token":"ACCESS_TOKEN",
  "token_type":"bearer",
  "expires_in":2592000,
  "refresh_token":"REFRESH_TOKEN",
  "scope":"read",
  "uid":100101,
  "info":{...}
}
```

其中 access_token 即为令牌。



### implicit

对于某些纯前端应用，允许直接向前端办法令牌。这种方式没有获得授权码这个步骤，即“隐藏式”（implicit）

**Step1：**“云冲印”引导用户访问 Google 授权页面：

```url
https://google.com/oauth/authorize?
  response_type=token&  				## 要求直接返回token
  client_id=CLIENT_ID&					## CLIENT_ID为在认证服务器上备案时获得的client_id
  redirect_uri=CALLBACK_URL&    ## 认证服务器认证后的重定向地址
  scope=read										## 授权范围
```

**Step2：**用户访问以上链接并在认证服务器认证通过后，认证服务器会将用户重定向到访问时传入的`redirect_uri`地址，即`CALLBACK_URL`。示例如下：

```url
https://yunprint.com/callback#token=ACCESS_TOKEN
```

**注：**牌的位置是 URL 锚点（fragment），而不是查询字符串（querystring）。OAuth 2.0 允许跳转网址是 HTTP 协议，因此存在"中间人攻击"的风险，浏览器跳转时，锚点不会被发到服务器，以此来减少泄漏令牌的风险。

这种方法很不安全，只能适用一些安全性不高的场景，且 token 时间必须很短。



### password

RFC 6749 也允许用户把用户名和密码，直接告诉第三方应用。该应用使用你的密码，申请令牌，这种方式称为"密码式"（password）。

**Step1：**“云冲印”直接将用户的账号发送给 Google 获取令牌即可：

```url
https://oauth.google.com/token?
  grant_type=password& 					## 请求模式
  username=USERNAME&						## 用户在 Google 的用户名
  password=PASSWORD&   					## 用户在 Google 的密码
  client_id=CLIENT_ID						## 备案client_id
```

Google 认证通过后直接返回包含 token 的JSON字符串给“云冲印”。

这种方式风险相当大，必须是用户高度信任的应用。



### client credentials

直接通过在认证服务器备案获得的 client_id 和 client_secret来获得 token，即凭证式（client credentials）。

一般适用于在后端直接认证的情况，这种方式是对第三方应用的认证而非对用户的。

**Step1：**“云冲印”直接给 Google 发送带有client_id 和 client_secret 的请求，Google 认证通过后直接返回带有 token 的JSON字符串：

```url
https://oauth.b.com/token?
  grant_type=client_credentials& ## 请求模式
  client_id=CLIENT_ID&					## 在认证服务器上备案时获得的client_id
  client_secret=CLIENT_SECRET		## 在认证服务器上备案时获得的client_secret
```



## 令牌的使用

第三方应用拿到令牌后将令牌在请求头上添加一个`Authorization`的字段即可：

```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" \
"https://api.google.com"
```



## 令牌更新

OAuth 2.0 允许用户自动更新令牌。在认证服务器颁发 token 时一次性颁发两个令牌，一个用于获取数据，另一个用于获取新的令牌（refresh token 字段）。令牌到期前，用户使用 refresh token 发一个请求，去更新令牌。

```url
https://b.com/oauth/token?
  grant_type=refresh_token&				## 请求模式
  client_id=CLIENT_ID&						## 在认证服务器上备案时获得的client_id
  client_secret=CLIENT_SECRET&		## 在认证服务器上备案时获得的client_secret
  refresh_token=REFRESH_TOKEN			## 获取令牌时一并获得的刷新令牌
```

验证通过以后，就会颁发新的令牌。



# doorkeeper

在`Rails`中利用`doorkeeper`模拟实现第三方登录。



## 搭建doorkeeper

### 安装

可以参考[doorkeeper官网](https://doorkeeper.gitbook.io/guides/ruby-on-rails/getting-started)



### 路由

在`config/routes.rb`中添加

```ruby
Rails.application.routes.draw do
  use_doorkeeper
  # your routes below
end
```

运行路由后得到：

| 具名辅助方法                       | method | uri                                          | action                                     |
| ---------------------------------- | ------ | -------------------------------------------- | ------------------------------------------ |
|                                    | GET    | /oauth/authorize/:code(.:format)             | doorkeeper/authorizations#show             |
| oauth_authorization_path           | GET    | /oauth/authorize(.:format)                   | doorkeeper/authorizations#new              |
|                                    | DELETE | /oauth/authorize(.:format)                   | doorkeeper/authorizations#destroy          |
|                                    | POST   | /oauth/authorize(.:format)                   | doorkeeper/authorizations#create           |
| oauth_token_path                   | POST   | /oauth/token(.:format)                       | doorkeeper/tokens#create                   |
| oauth_revoke_path                  | POST   | /oauth/revoke(.:format)                      | doorkeeper/tokens#revoke                   |
| oauth_applications_path            | GET    | /oauth/applications(.:format)                | doorkeeper/applications#index              |
|                                    | POST   | /oauth/applications(.:format)                | doorkeeper/applications#create             |
| new_oauth_application_path         | GET    | /oauth/applications/new(.:format)            | doorkeeper/applications#new                |
| edit_oauth_application_path        | GET    | /oauth/applications/:id/edit(.:format)       | doorkeeper/applications#edit               |
| oauth_application_path             | GET    | /oauth/applications/:id(.:format)            | doorkeeper/applications#show               |
|                                    | PATCH  | /oauth/applications/:id(.:format)            | doorkeeper/applications#update             |
|                                    | PUT    | /oauth/applications/:id(.:format)            | doorkeeper/applications#update             |
|                                    | DELETE | /oauth/applications/:id(.:format)            | doorkeeper/applications#destroy            |
| oauth_authorized_applications_path | GET    | /oauth/authorized_applications(.:format)     | doorkeeper/authorized_applications#index   |
| oauth_authorized_application_path  | DELETE | /oauth/authorized_applications/:id(.:format) | doorkeeper/authorized_applications#destroy |
| oauth_token_info_path              | GET    | /oauth/token/info(.:format)                  | doorkeeper/token_info#show                 |
|                                    | POST   | /oauth/token(.:format)                       | doorkeeper/tokens#create                   |
|                                    | POST   | /oauth/revoke(.:format)                      | doorkeeper/tokens#revoke                   |
|                                    | GET    | /oauth/token/info(.:format)                  | doorkeeper/token_info#showoauth_token_path |

其中：

* 路径带有`application`的请求与在`doorkeeper`注册相关
* 路径带有`authorized`的请求与用户认证相关
* 路径带有`token`的请求与获取`token`相关



### 配置

doorkeeper.rb为其配置文件，其中有详细说明。在本案例中会对用到的配置进行详细说明。



## Getting Started

### 注册登记

第三方应用想通过doorkeeper获取访问权限必须现在`application`中注册登记，以获得`client_id`和`secret`。

可以通过访问路径`http://localhost:4000/oauth/applications/new`进入注册`application`的页面，进行注册。填写应用名和跳转地址（应该将该地址设置为后端的某个接口）等信息后，点击提交即可获得注册登记的`client_id`和`secret`等信息。

也可以通过访问路径`http://localhost:4000/oauth/applications`进入管理注册的`application`页面。

当然我们不希望任何人都可以访问管理页面，这时我们需要在`doorkeeper`的配置文件`doorkeeper.rb`中进行配置：

```ruby
Doorkeeper.configure do

  admin_authenticator do
    # 此处写验证允许访问通过对逻辑
    # 例如我们需要对用户进行验证，只有admin用户才可以登录
    user = User.find_by_username("admin")
  end
  
end

```

但此时会报错，因为`User`为`ActiveRecord`我们必须先引入`ActiveRecord`。

`doorkeeper`对`ActiveRecord`默认支持，所以我们只需要通过`orm`引入即可：

```ruby
Doorkeeper.configure do
  orm :active_record
  
  admin_authenticator do
    # doorkeeper在验证的时候会调用到该返回对象的id
    user = User.find_by_username(params[:username])
    # 此处返回的对象必须带有id
    user.try('is_admin?') ? user || redirect_to(login_url)
  end

end

```

这样就只有admin用户可以登录管理注册应用页面了。



### 请求code

现在我们需要让用户去`doorkeeper`认证，并拿到`doorkeeper`返回的`code`

获取`code`的请求路径为`http://0.0.0.0:8008/oauth/authorize`同时附上注册登记获得的`client_id`注册时填写的`redirect_uri`以及`response_type`（值为code）:

```ruby
http://0.0.0.0:8008/oauth/authorize?client_id=2642d4c1ebed62755b352d2b6a42c9096372450370b387c56f158423e6612552
&response_type=code
&redirect_uri=http://localhost:3000
```

这时访问的时候会直接跳转到`doorkeeper`到认证页面，我们并没有验证用户的身份信息。

所以还需要在`doorkeeper.rb`中添加验证用户身份的逻辑：

```ruby
  resource_owner_authenticator do
    # 官方给出的例子
    # 也可以通过其他方式获取，如在Redis中获取用户的登录信息等
    User.find_by_id(session[:user_id]) || redirect_to(new_user_session_url)
  end
```

在通过以上验证以后，就跳转到`doorkeeper`的认证页面，用户可以选择是否同意认证。

在同意之后，`doorkeeper`会重定向到应用登记注册时填写的返回地址。

```uri
http://localhost:3000?code=7eab38fb47564354d4ebbc979574e4a9c84a3b8a0f02d6e3bef34f2cc2cb6ec2
```

应该将该地址设为后端用来获取`token`的接口。此处为了简单演示地址是随便填写的。



### 请求token

有了`code`之后就可以通过`POST`请求来请求`token`了：

```uri
http://0.0.0.0:8008/oauth/token?
# 参数
client_id => # 注册登记时的client_id
code => # 用户认证后获取到的code
redirect_uri => # 注册时填写的返回地址
grant_type => authorization_code
```

但此时请求仍然会报错，提示`invalid_client`

这是因为请求`token`时需要`secret`来验证第三方的应用信息，我们需要在请求的头里添加`Authorization`信息，这里是在 postman 中通过`Basic Auth`添加`client_id`和`secret`添加后再次请求得到`doorkeeper`返回的JSON字符串：

```json
{
    "access_token": "62ab068b3239e2ff4347999843aeb3ad91f0ae87ec0e10b59fb12e941d3947ed",
    "token_type": "bearer",
    "expires_in": 7200,
    "created_at": 1598606307
}
```





## 





