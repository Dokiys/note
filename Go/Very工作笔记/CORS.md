# 跨源资源共享

以下是一个来自维基百科关于[跨站请求伪造](https://zh.wikipedia.org/zh-cn/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0)例子：

> 假如一家银行用以执行转账操作的URL地址如下： `https://bank.example.com/withdraw?account=AccoutName&amount=1000&for=PayeeName`
> 那么，一个恶意攻击者可以在另一个网站上放置如下代码： `<img src="https://bank.example.com/withdraw?account=Alice&amount=1000&for=Badman" />`
> 如果有账户名为Alice的用户访问了恶意站点，而她之前刚访问过银行不久，登录信息尚未过期，那么她就会损失1000资金。

类似恶意网址的形式还有很多，究其根本就是网站在没有获取用户权限的情况下，欺骗浏览器以用户的名义进行操作。

因此现代浏览器发展出了跨源资源共享（CORS）的安全机制，简单来说就是浏览器在真正向服务器发送请求之前（或同时）会先向服务器询问其是否能够接受当前来源的请求。如果服务器无法处理，浏览器则会报`CORS error`。具体流程如下：

* HTTP协议新增浏览器保留的请求头：`Origin`，其由URL中的协议、主机和端口构成，由浏览器判断初始的HTTP请求和HTML页面的请求是否为同源。如果不同源则需要考虑跨域问题。
* 浏览器会向目标服务器发送一个请求方法为`OPTIONS`的请求（Pre-Flight Request）来询问目标服务器是否能够接收请求。
* 服务器应当处理该`OPTIONS`请求，并在返回头中通过保留字段，例如`Access-Control-Allow-Origin`、`Access-Control-Allow-Methods`、`Access-Control-Allow-Headers`等，告知浏览器自己允许的跨域策略。（一些简单的`GET`、`HEAD`或者`POST`请求浏览器不会发送`OPTIONS`请求进行询问，但仍然需要服务器返回自己允许的跨域策略）
* 浏览器根据目标服务器的策略校验抛出错误或者继续请求。

让我们实际上手试试。首先我们需要构建一个HTTP服务器：

```go
func TestHttpServerMiddleware(t *testing.T) {
	s := http.NewServeMux()
  s.Handle("/hello", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello Work!"))
	}))
  
	fmt.Println("Server listening on port 8080")
	err := http.ListenAndServe(":8080", s)
	if err != nil {
		fmt.Println(err)
	}
}
```

以及一个HTML文件：

```html
<!DOCTYPE html>
<html>
<body>
<script>
    fetch('http://localhost:8080/hello')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
</script>
</body>
</html>
```

当我们用浏览器打开该HTML文件时，可以看到浏览器的URL栏，是以`file://`为前缀，并紧跟着文件路径，比如：`file:///Users/dokiy/cors.html`。此时，HTML页面会请求我们Server提供的接口，并且在开发者工具的Network中获得一个`CORS error`的请求。
就像我们此前提到的，协议也是`Origin`的构成之一，因此浏览器会该`Origin`与我们的Server属于不同来源。
我们可以如下修改我们的Server：

```go
func TestHttpServerMiddleware2(t *testing.T) {
	s := http.NewServeMux()
	s.Handle("/hello", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers for all responses
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Handle pre-flight OPTIONS request
		if r.Method == http.MethodOptions {
			// Include other necessary headers for pre-flight response
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Length, Content-Type")
			w.Header().Set("Access-Control-Max-Age", "86400") // Cache pre-flight response for 24 hours

			// Respond with HTTP 204 No Content status
			w.WriteHeader(http.StatusNoContent)
			return
		}
		w.Write([]byte("Hello Work!"))
	}))

	fmt.Println("Server listening on port 8080")
	err := http.ListenAndServe(":8080", s)
	if err != nil {
		fmt.Println(err)
	}
}
```

重新运行后刷新浏览器可以发现，请求返回成功。



此外，还可以尝试跟着[Chrome的开发者文档](https://developer.chrome.com/docs/devtools/overrides?hl=zh-cn#override-headers)使用Chrome在本地替换HTTP的响应头，以在开发测试时跳过一些跨域问题来更具体的了解跨域问题。