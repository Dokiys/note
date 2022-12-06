# FrontEnd小记

## CSS选择器

### 类型

| 选择器类型                                                   | 用法         | 说明                                           |
| ------------------------------------------------------------ | ------------ | ---------------------------------------------- |
| ID选择器                                                     | #myid        | 选择`id='myid'`的标签                          |
| 类选择器                                                     | .myclassname | 选择`class='myclassname'`的标签                |
| 标签选择器                                                   | div,h1,p     | 选择`div`、`h1`以及`p`标签                     |
| 相邻选择器                                                   | h1+p         | 选择紧跟在`h1`标签同级的`p`标签                |
| 子选择器                                                     | ul > li      | 选择`ul`标签的子标签中的`li`标签               |
| 后代选择器                                                   | li a         | 选择`li`标签的子孙标签中的`a`标签              |
| 通配符选择器                                                 | *            | 选择所有标签，也可以用来选择某元素的所有子标签 |
| 属性选择器                                                   | a[title]     | 选择`a`标签中，有`title`属性的标签             |
| 伪类选择器[(参考)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes) | button:hover | 选择鼠标悬停的`button`标签                     |

CSS对于ID选择器、类选择器、标签选择器的优先级分别为100、10、1

选择器越特殊，优先级越高。所以如下直接写在标签里的CSS优先级最高：

```html
<div style="color:red">hello css</div>
```

但是应遵循样式和内容分离的原则，不应将样式写在标签内。

### 

### 示例

```css
<style>
    /* 1 */
    * {
        color: darkgrey;
    }

    /* 2 */
    .container * {
        color: blueviolet;
    }

    /* 3 */
    #head {
        color: blue
    }

    /* 4 */
    .preference {
        color: brown
    }

    /* 5 */
    div p {
        color: darkorange
    }

    /* 6 */
    ul {
        color: darkseagreen
    }

    /* 7 */
    ul>li {
        color: deeppink
    }

    /* 8 */
    ul+span {
        color: darkturquoise
    }

    /* 9 */
    ul~a {
        color: gold
    }

    /* 10 */
    a[href^='https'] {
        color: green
    }

    /* 11 */
    ul li:nth-of-type(2) {
        color: indigo
    }

    /* 12 */
    ul li:nth-last-child(1) {
        color: indianred
    }
</style>
```

```html
<body>
    <!-- 1 -->
    <span>*</span>
    <div class="container">
        <!-- 2 -->
        <p>.container *</p>
        <!-- 3 -->
        <p id='head'>#head</p>
        <!-- 4 -->
        <p class='preference'>.preference</p>
    </div>
    <div>
        <!-- 5 -->
        <p>div p </p>
    </div>
    <ul>
        <!-- 6 -->
        ul
        <!-- 7 -->
        <li>ul>li</li>
        <!-- 11 -->
        <li>ul li:nth-of-type(2) </li>
        <!-- 12 -->
        <li>ul li:nth-last-child(1) </li>
    </ul>
    <!-- 8 -->
    <span>ul+span</span>
    <br />
    <!-- 9 -->
    <a href="http://www.4399.com">ul~a</a>
    <!-- 10 -->
    <a href="https://www.4399.com">a[href^='https']</a>
</body>
```



## CodeShow

### 点击复制

```js
copy_info() {
  let oInput = document.createElement('input')
  oInput.value = `id: ${this.id}, name: "${this.name}"`
  document.body.appendChild(oInput)
  oInput.select()
  document.execCommand('Copy')
  this.$message('复制成功！')
},
```



## JS日期

```js
new Date().toISOString()				// => "2021-06-11T07:20:06.642Z"
new Date().toISOString().slice(0,10)  // => "2021-06-11"
```



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

