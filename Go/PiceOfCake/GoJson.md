# GoJson

## Json解析

Go中解析json允许存在额外的字段，但不会解析。此外不存在的字段将会被解析成对应的零值：

```go
type Ap struct {
	A int32 `json:"a"`
	B int32 `json:"b"`
  D int32 `json:"d"`
}

func TestApJson(t *testing.T)  {
	str := `{"a": 1,"b": 2, "c":3}`

	var ap Ap
	_ := json.Unmarshal([]byte(str), &ap)
  t.Log(ap)		// {1 2 0}
}
```

Go中结构体转Json可以通过`omitempty`来设置零值的字段，不转成Json。但是需要注意的是：本身就为零值的值也会被忽略(如果一个成员变量没有被赋值，本身也就是其对应的零值)；并且空的结构体同样会被转成对应的字段，即使其所有成员变量都被添加了`omitempty`，依旧会以空结构的形式出现在Json字符串中：

```go
type Ap struct {
	A int32 `json:"a"`
	B int32 `json:"b"`
	D int32 `json:"d"`
	E int32 `json:"e,omitempty"`
	F F     `json:"f,omitempty"`
}
type F struct {
	Fa int32 `json:"fa,omitempty"`
	Fb int32 `json:"fb,omitempty"`
}

func TestMarshalJson(t *testing.T) {
	ap := Ap{
		A: 1,B: 2,D: 3,
		E: 0,
		F: F{},
	}
	bytes, _ := json.Marshal(ap)
	t.Log(string(bytes))		// {"a":1,"b":2,"d":3,"f":{}}
}
```



## Map

Go中对Json中的map处理：

```go
func TestMarshalMap(t *testing.T) {
	m := make(map[int32]string, 10)
	m[1] = "a"
	m[2] = "b"
	m[3] = "c"

	j, _ := json.Marshal(m)
	t.Log(string(j))		// {"1":"a","2":"b","3":"c"}
}
```

```go
func TestUnmarshalMap(t *testing.T) {
	//str := `{'1':'a','2':'b','3':'c'}` 不支持
	str := `{"1":"a","2":"b","3":"c"}`
	var m map[int32]string

	_ = json.Unmarshal([]byte(str), &m)
	t.Log(m)		// map[1:a 2:b 3:c]
}
```



## Slice

Go中解析解析切片时需要注意，`make`和未赋值的切片变量的解析：

```go
func TestArr(t *testing.T) {
  //arr := []string{}						// []
  //arr := make([]string, 2)		// ["",""]
  var arr []string							// null
  bytes, _ := json.Marshal(arr)

  t.Log(string(bytes))
}
```



## Copy

利用json解析还可以做安全的数据拷贝

```go
func Copy(source interface{}, target interface{}) error {
	bytes, _ := json.Marshal(source)

	err = json.Unmarshal(bytes, target)
	return errors.Wrap(err, "数据拷贝失败！")
}
```

