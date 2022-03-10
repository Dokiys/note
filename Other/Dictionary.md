## 占位符

**普通占位符**

| 占位符 | 说明                     | 举例                  | 输出                        |
| ------ | ------------------------ | --------------------- | --------------------------- |
| %v     | 相应值的默认格式         | Printf("%v", people)  | {zhangsan}                  |
| %+v    | 打印结构体时添加字段名   | Printf("%+v", people) | {Name:zhangsan}             |
| %#v    | 相应值的Go语法表示       | Printf("#v", people)  | main.Human{Name:"zhangsan"} |
| %T     | 相应值的类型的Go语法表示 | Printf("%T", people)  | main.Human                  |
| %%     | 转义%                    | Printf("%%")          | %                           |

**整数占位符**

| 占位符 | 说明                                 | 举例                 | 输出   |
| ------ | ------------------------------------ | -------------------- | ------ |
| %b     | 二进制表示                           | Printf("%t", true)   | true   |
| %c     | 相应Unicode码所表示的字符            | Printf("%c", 0x4E2D) | 中     |
| %d     | 十进制表示                           | Printf("%d", 0x12)   | 18     |
| %o     | 八进制表示                           | Printf("%d", 10)     | 12     |
| %q     | 单引号围绕的字符字面值，由Go语法转义 | Printf("%q", 0x4E2D) | '中'   |
| %x     | 十六进制表示，字母形式为小写 a-f     | Printf("%x", 13)     | d      |
| %X     | 十六进制表示，字母形式为大写 A-F     | Printf("%x", 13)     | D      |
| %U     | Unicode格式：U+1234，等同于 "U+%04X" | Printf("%U", 0x4E2D) | U+4E2D |

**浮点数**

| 占位符 | 说明       | 举例               | 输出         |
| ------ | ---------- | ------------------ | ------------ |
| %e     | 科学计数法 | Printf("%e", 10.2) | 1.020000e+01 |
| %E     | 科学计数法 | Printf("%E", 10.2) | 1.020000E+01 |
| %f     | 包括小数   | Printf("%f", 10.2) | 10.200000    |

**字符串与字节切片**

| 占位符 | 说明                                | 举例                           | 输出         |
| ------ | ----------------------------------- | ------------------------------ | ------------ |
| %s     | 输出字符串表示（string类型或[]byte) | Printf("%s", []byte("Go语言")) | Go语言       |
| %q     | 双引号围绕的字符串，由Go语法转义    | Printf("%q", "Go语言")         | "Go语言"     |
| %x     | 十六进制，小写字母，每字节两个字符  | Printf("%x", "golang")         | 676f6c616e67 |
| %X     | 十六进制，大写字母，每字节两个字符  | Printf("%X", "golang")         | 676F6C616E67 |

 **其他占位符**

| 占位符 | 说明                  | 举例                  | 输出     |
| ------ | --------------------- | --------------------- | -------- |
| %t     | bool值                | Printf("%t", true)    | true     |
| %p     | 十六进制表示，前缀 0x | 十六进制表示，前缀 0x | 0x4f57f0 |







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

![700px](../asset/Other/Dictionary/700px.png)

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

![750px](../asset/Other/Dictionary/750px.png)

