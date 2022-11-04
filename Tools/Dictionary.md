# 占位符

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



# Cron

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



# ANSI C Quoting

[bash manual](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#ANSI_002dC-Quoting)

| character | description  |
| :-------- | ------------ |
|`\a `|alert (bell)|
|`\b `|backspace|
|`\e `|\E an escape character (not ANSI C)|
|`\f `|form feed|
|`\n `|newline|
|`\r `|carriage return|
|`\t `|horizontal tab|
|`\v `|vertical tab|
|`\\`| backslash |
|`\' `|single quote|
|`\" `|double quote|
|`\? `|question mark|
|`\nn`|n the eight-bit character whose value is the octal value nnn (one to three octal digits)|
|`\xH`|H the eight-bit character whose value is the hexadecimal value HH (one or two hex digits)|
|`\uH`|HHH the Unicode (ISO/IEC 10646) character whose value is the hexadecimal value HHHH (one to four hex digits)|
|`\UH`|HHHHHHH the Unicode (ISO/IEC 10646) character whose value is the hexadecimal value HHHHHHHH (one to eight hex digits)|
|`\cx`| a control-x character|



# loki

基本查询：

- =: 完全匹配
- !=: 不匹配
- =~: 正则表达式匹配
- !~: 正则表达式不匹配
- |=：日志行包含的字符串
- !=：日志行不包含的字符串
- |~：日志行匹配正则表达式
- !~：日志行与正则表达式不匹配



# gitbook

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

# HotKey

## IDEA

* 代码整理：Command + Option + L
* 返回上一光标：Command + Option + &lt;-
* 折叠所有块：Command + CapsLock + ' - '
* 折叠当前快：Command + '-' / '+'
* 打开所有块：Command + CapsLock + ' + '
* 添加自定义代码块折叠：Command + Option + T  -&gt;  
* 分屏：某文件的Tab栏上右键，选择Split Vertically 或 Split Horizontally
* 查看最近文件：Command + E
* 复制代码位置：Command + Option +  CapsLock + C
* 进入方法/进入方法调用处：Command  + B
* 进入接口实现：Command + Option + B
* 搜索出的内容分屏展示：Shift + Command + F 打开搜索并选中内容后，Shift + Enter
* 运行单元测试：Shift + Control + R
* 文件重命名：Shift + F6
* 代码移行：Shift + Option + 方向上/下
* 定位到当前文件位置：Option + F1，然后数字1
* 查找代码：Command + F，然后Esc可以关闭查找窗口
* 向上一行插入空行：Command + Option + Enter
* 向下一行插入空行：Shift + Enter
* 选中行/当前行 向 上/下 移动：Shift + Option + 方向上/下
* 选中/当前所在方法 与 上/下 一个方法调换位置：Shift + Command + 方向上/下
* 批量修改某参数名：光标选中变量后Shift+F6
* 查找文件：点击Project导航框，直接输入关键字
* 打开Terminal： Option + F12
* 快速生成测试方法：光标在方法上，Command + N
* 使结构体实现某接口：光标选择到结构体，Option + Enter
* 窗口查看方法内容：Command + T
* 光标跳转到上一个方法：Shift + Ctrl + 方向上/下
* 切换Tool Window：长按Ctrl + Tab 或者 Command + E
* 提取方法：Command  + Option + M
* 在下一行复制选择的代码：Command + D
* 加选当前选中的内容：Ctrl + G
* 光标快速跳转到代码块开始/结束处：Option + 方向上 可以加选代码块，在加方向键左/右 即可
* 切换窗口： Command + Shift + `
* 复制光标 Caret Cloning： Option + Option(长按) + 方向上/下



## MAC

* Chrome检查：Command + Shift + C
* 重命名文件：选择到文件名的状态下 + Enter
* 打开文件：Command + O
* 打开访达：Command + Option + B
* 反撤销： Command + Shift + Z
* 推出当前程序：Command + Q
* 切换同一应用的不同窗口：Command + `
* 全屏窗口：Command + Control + F
* 锁屏：Command + Control + Q
* Finder查看隐藏文件： Command + Shift + .
* Finder查找文件： Command + Shift + G
* 切换屏幕：Ctrl + 方向



**命令行**

* 整理启动台

  ```bash
  defaults write com.apple.dock ResetLaunchPad -bool tru
  ```

* 图标显示异常

  ```bash
  sudo find /private/var/folders/ \( -name com.apple.dock.iconcache -or -name com.apple.iconservices \) -exec rm -rfv {} \;
  sudo rm -rf /Library/Caches/com.apple.iconservices.store;
  killall Dock
  killall Finder
  ```

  



## iTerm2

* 全屏窗口： Command + Enter
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

## VsCode

* 全局搜索帮助：Command + Shift + P
* 全局搜索文件：Command + P
* 代码格式化：Option + Shift + F
* 折叠当前代码片段：Option + Command + '['

## Chrome

* 打开最近关闭的tab页：Command + Shift + T
* 切换tab：Command + Option + <- / ->
* 放回上/下一页：Command + <- / ->
* 聚焦光标到地址栏： Command + L
* 强制刷新(不走304缓存)：Shift + Command + R
* 普通刷新：Command + R

## Postman

* 美化JSON：Command + B
* 发送请求：Command + Enter

## Linux

* 命令行光标移动：

  * 光标移动到行首：Ctrl + A
  * 光标移动到行尾：Ctrl + E
  * 光标移动到上一个单词词首：Esc 然后 + B
  * 光标移动到下一个单词词首：Esc 然后 + F
  * 删除光标后的一个单词：Esc 然后 + D
  * 删除光标前一个单词：Ctrl + W
  * 清除光标后至行尾的内容：Ctrl + K
  * 恢复删除：Ctrl + Y

* 命令参数后置：

  ```bash
  ls $(read && echo $REPLY) | grep .go # 需要手动输入
  ls $(pbpaste) | grep .go
  ```



## vim

* 跳转行首：Home 或 Shift + ^

* 跳转行尾：End 或 Shift + $

* 跳转到指定行：[行号] + gg / G 或者 :12

* 查找：normal模式下键入 `'/'`，n 查找下一个，N 查找上一个

* 插入新行：normal模式下键入 `'o'`

* 删除：

  ```bash
  dd # 删除一整行
  dw # 删除到下一个单词开头
  de # 删除到下一个单词结尾
  d0 # 删除光标到本行开头
  ```

* 复制/黏贴/撤销：yy / p / u



## Alfred

* 使用指定应用打开某文件：

  ```
  1. Alt + Space 打开Alfred搜索栏
  2. 输入 find [文件名] 搜索到对应文件
  3. Ctrl 进入到操作页面，并选择 Open 使用默认应用打开文件 
  ```

  
