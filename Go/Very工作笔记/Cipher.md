# 对称块加密

我们可以通过一个加密算法的配置描述来描述一个加密操作的全部特征。比如`AES/CBC/PKCS5Padding`其中包括加密算法`AES`、工作模式`CBC`以及填充方案`PKCS5Padding`。

在对称加密中对于大部分加密算法都只能对特定大小块的数据进行加密（即BlockSize），因此当处理一个较大的数据（长度大于加密算法的BlockSize）时，就需要工作模式（BlockMode）将原始数据拆分成多个适合加密算法进行加密的块大小。当最后一个数据块长度不够BlockSize时，则需要填充方案将该数据填充到BlockSize大小。

我们可以结合Go官方提供的`crypto/cipher`中的相关设计来理解分块对称加密：

```go
// A Block represents an implementation of block cipher
// using a given key. It provides the capability to encrypt
// or decrypt individual blocks. The mode implementations
// extend that capability to streams of blocks.
type Block interface {
	// BlockSize returns the cipher's block size.
	BlockSize() int

	// Encrypt encrypts the first block in src into dst.
	// Dst and src must overlap entirely or not at all.
	Encrypt(dst, src []byte)

	// Decrypt decrypts the first block in src into dst.
	// Dst and src must overlap entirely or not at all.
	Decrypt(dst, src []byte)
}
```

```go
// A BlockMode represents a block cipher running in a block-based mode (CBC,
// ECB etc).
type BlockMode interface {
	// BlockSize returns the mode's block size.
	BlockSize() int

	// CryptBlocks encrypts or decrypts a number of blocks...
	CryptBlocks(dst, src []byte)
}
```

根据`BlockMode`的注释不难看出，整个加密流程应当是，创建一个`Block`；根据`Block`创建`BlockMode`；然后根据`Block.BlockSize()`对原始数据进行填充；最后进行加密。
下面是`AES/CBC/PKCS5Padding`加密的例子，这里需要提前了解的是不同于`ECB`直接进行分块的工作模式，`CBC`会在加密每个数据块之前，先将待加密的数据块与先前的秘文块进行（可逆的）异或运算（XOR）。因此在加密第一个数据块时需要有一个初始化向量（IV，或者叫nonce）来启动加密过程：

```go
func AESCBCPKCS5PaddingEncrypt(key, iv, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	blockMode := cipher.NewCBCEncrypter(block, iv)

	text = PKCS7Padding(text, blockMode.BlockSize())

	var crypted = make([]byte, len(text))
	blockMode.CryptBlocks(crypted, text)

	return crypted, nil
}

// PKCS7Padding 实现PKCS7填充，这也可以用于PKCS5填充
func PKCS7Padding(src []byte, blockSize int) []byte {
	padding := blockSize - len(src)%blockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(src, padtext...)
}
```

解密则是一个逆向的操作，先解密后在去填充：

```go
func AESCBCPKCS5PaddingDecrypt(key, iv, crypted []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	blockMode := cipher.NewCBCDecrypter(block, iv)

	var text = make([]byte, len(crypted))
	blockMode.CryptBlocks(text, crypted)

	return PKCS7UnPadding(text)
}


// PKCS7UnPadding 实现PKCS7去填充
func PKCS7UnPadding(src []byte) ([]byte, error) {
	length := len(src)
	if length == 0 {
		return nil, fmt.Errorf("unpadding error: input data is empty")
	}

	padding := int(src[length-1])
	if padding < 1 || padding > aes.BlockSize {
		return nil, fmt.Errorf("unpadding error: invalid padding value %v", padding)
	}

	return src[:length-padding], nil
}
```
