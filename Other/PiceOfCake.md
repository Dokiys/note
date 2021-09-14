## Cron

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



## loki

基本查询：

- =: 完全匹配
- !=: 不匹配
- =~: 正则表达式匹配
- !~: 正则表达式不匹配
- |=：日志行包含的字符串
- !=：日志行不包含的字符串
- |~：日志行匹配正则表达式
- !~：日志行与正则表达式不匹配



## Postman

手动设置`Authorization`认证`token`

```js
// set request params
const postRequest = {
  url: 'http://localhost:5450/oauth/token.json?',	//请求token的接口
  method: 'POST',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    mode: 'raw',
    raw: JSON.stringify({
        client_id:"2642d4c1ebed62755b352d2b6a42c9096372450370b387c56f158423e6612552",
        client_secret:"17ec1e2ead9b396da8463723b979664d8b2d8d0e7712fafcc97f154c7f0b5d41",
        grant_type:"client_credentials",
        scope: "" 
    })
  }
};

pm.sendRequest(postRequest, (error, response) => {
    error ? console.log(error) : setUserSessionKey(response)
});

// set user_session_key
function setUserSessionKey(response){
    var result = response.json()
    pm.request.headers.add({
        key:"Authorization",
        value: "Bearer "+result.access_token
    })
}
```



## gitbook

添加`tab`，只在`gitbook`自动生成的页面可以展示：

{% tabs %}

{% tab title="Text Tab" %}

`gitbook`中一行的宽度和`Markdown`通用格式中的宽度规定是一样的，也就是说，在 Typroa 中换行时，在`gitbook`页面上也会相应的换行。但是在`tab`会比原来的宽度稍短一些。

{% endtab %} 



{% tab title="Code Tab" %}

```
hello work!
============================== there is 83 charaters ==============================
通常一行不超过80个字符
```

{% endtab %} 



{% tab title="Image Tab" %}

tab中的图片宽度：

![700px](/Users/admin/dokiy/note/assert/Other/Other/700px.png)

{% endtab %} 



{% tab title="Tabs Template" %}

```gitbook
{% tabs %}

{% tab title="First Tab" %}

The first content...

{% endtab %} 



{% tab title="Second Tab" %}

The second content...

{% endtab %} 



{% tab title="Third Tab" %}

The third content...

{% endtab %} 

{% endtabs %}
```

{% endtab %} 

{% endtabs %}



图片宽度：

![750px](../assert/Other/Other/750px.png)

