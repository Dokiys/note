# 常见加密算法

**对称加密**

```
DES、3DES、DESX、Blowfish、IDEA、RC4、RC5、RC6、AES
```

**非对称加密**

```
RSA、ECC（移动设备用）、Diffie-Hellman、El Gamal、DSA（数字签名用）
```

**Hash算法（摘要算法）**

```
MD2、MD4、MD5、HAVAL、SHA、SHA-1、HMAC、HMAC-MD5、HMAC-SHA1、bcrypt
```



# 常见场景

### 用户密码

用户密码以明文直接存入数据库极不安全，通常采用Hash算法进行加密然后存入。为增加暴力破解的难度，可以增加密码盐进行加密：

```ruby
password_hash = hash(password, salt)
```

加盐也只是增加了破解的复杂度，目前更常用的方法是在此基础上增加计算强度的`bcrypt`算法，其原理是增加计算的复杂度，以提高单次解密的时间，从而使暴力方式破解密文的时间极大的增加。



### 加密内容

对某些敏感内容可以采用独立密码对方式，先对独立密码进行校验（方法同用户密码）

```ruby
# 通过不同的Hash算法或者密码盐, 校验身份
password_hash = hash1(password, salt1)
# 再通过不同的hash算法或者密码盐生成hash_code
hash_code = hash2(password, salt2)
# 对敏感内容对称加密
encryption_text = symmetric(text,h2)
```



### 加密内容搜索

有一个实用的可搜索加密方案`SWP`，其大概思路是：

>  对内容进行拆词，加密每个单词。服务器对搜索内容进行加密计算，然后去内容中匹配对应的数据。

但该方案目前还没有落地使用。目前常用的搜索系统采用同步数据的方式，将数据库的数据单向同步到如`elasticsearch`的搜索引擎中。

还有一种思路就是：`同态加密`

> 它允许人们对密文进行特定形式的代数运算得到仍然是加密的结果，将其解密所得到的结果与对[明文](https://zh.wikipedia.org/wiki/明文)进行同样的运算结果一样。换言之，这项技术令人们可以在加密的数据中进行诸如检索、比较等操作，得出正确的结果，而在整个处理过程中无需对数据进行[解密](https://zh.wikipedia.org/wiki/解密)。其意义在于，真正从根本上解决将数据及其操作委托给第三方时的保密问题，例如对于各种[云计算](https://zh.wikipedia.org/wiki/云计算)的应用。

但目前来说该技术还不成熟。