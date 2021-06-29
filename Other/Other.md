# Other

### loki

基本查询：

- =: 完全匹配
- !=: 不匹配
- =~: 正则表达式匹配
- !~: 正则表达式不匹配
- |=：日志行包含的字符串
- !=：日志行不包含的字符串
- |~：日志行匹配正则表达式
- !~：日志行与正则表达式不匹配



### Postman

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



### gitbook

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

![700px](../image/Other/Other/700px.png)

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

![750px](../image/Other/Other/750px.png)



## 快捷键

### Linux

* vim中跳转行首：Home 或 Shift + ^
* vim中跳转行尾：End 或 Shift + $
* vim中查找：normal模式下键入 `'/'`，n 查找下一个，N 查找上一个
* 命令行光标移动：
  * 光标移动到行首：Ctrl + A
  * 光标移动到行尾：Ctrl + E
  * 光标移动到上一个单词词首：Esc 然后 + B
  * 光标移动到下一个单词词首：Esc 然后 + F
  * 删除光标后的一个单词：Esc 然后 + D
  * 删除光标前一个单词：Ctrl + W
  * 清除光标后至行尾的内容：Ctrl + K
  * 恢复删除：Ctrl + Y

### RubyMine

* 代码整理：Command + Option + L
* 返回上一光标：Command + Option + &lt;-
* 折叠所有块：Command + CapsLock + ' - '
* 折叠当前快：Command + '-' / '+'
* 打开所有块：Command + CapsLock + ' + '
* 添加自定义代码块折叠：Command + Option + T  -&gt;  
* 分屏：某文件的Tab栏上右键，选择Split Vertically 或 Split Horizontally
* 查看最近文件：Command + E
* 复制代码位置：Command + Option +  CapsLock + C
* 进入方法：Command  + B
* 搜索出的内容分屏展示：Shift + Command + F 打开搜索并选中内容后，Shift + Enter
*  运行单元测试：Shift + Control + R

### MAC

* 反撤销： Command + Shift + Z
* Chrome检查：Command + Shift + C
* 推出当前程序：Command + Q
* 切换同一应用的不同窗口：Command + `
* 重命名文件：选择到文件名的状态下 + Enter
* 

### iTerm2

* 新建窗口： Command + T
* 水平分屏： Command + D
* 垂直分屏： Command + Shift + D
* 在最近使用的分屏直接切换.：Command + ' \[ '
* 切换标签页： Command +  &lt;-
* 清屏：Ctrl + L
* 复制字符串：双击添加到粘贴板 or 选中 + Command + 鼠标拖动到指定位置
* 光标跳转下/上一个单词： Esc + F/B
* 光标跳转行首：Ctrl + a
* 光标跳转行尾：Ctrl + e
* 从光标删除到命令行尾：Ctrl + k
* 在当前目录打开Finder：键入`open .`

### VsCode

* 全局搜索帮助：Command + Shift + P
* 全局搜索文件：Command + P
* 代码格式化：Option + Shift + F
* 折叠当前代码片段：Option + Command + '['

### Postman

* 美化JSON：Command + B

### Chrome

* 打开最近关闭的tab页：Command + Shift + T
* 聚焦光标到地址栏： Command + L
* 强制刷新(不走304缓存)：Shift + Command + R



