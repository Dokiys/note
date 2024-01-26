# 金额相关

### 丢失精度

我们先来看下面这一段代码：

```go
	var num float64
	num = num + 0.2
	num = num + 0.1
	fmt.Println(num) 
```

输出到结果是：`0.30000000000000004`，这是似乎有点出乎人的意料。这是因为浮点数在计算的时候会有丢失精度的问题，并且丢失精度可能出现在任何浮点数的加减乘除运算中。
因此在涉及金额的浮点数计算的时候，务必要将金额转换成最小单位的整数类型的值。比如RMB：5.46元，应当转换成546分，然后进行计算。

```go
	var num float64
	num = num + 0.2
	num = num + 0.1
	fmt.Println(math.Round(num*100) / 100)	// 这里的100就是元和分的进制计算
```



### 减除法

假如有个需求：一笔11块钱的订单，要平均分配成三份给不同的渠道商。在计算的时候就需要考虑余数的问题。每个供应商都会至少被分配到3.66元，如此一来就会余出两分钱无法分配。为了使分配尽量平均，惯用的做法就是将这两分钱再平均分配下去（当然这必然导致其中一个供应商分配不到），而不是直接将余数两分钱直接分配给其中一个供应商。
由此我们可以引出减除法，即循环将剩余待分配的值除以剩余待分配的份数，将得到的商作为结果之一，并从分配的值中减去，然后进行下一步计算。

```go
// subDivided 减除法
func subDivided(amount, count int) []int {
	if count == 1 {
		return []int{amount}
	}

	ans := make([]int, 0, count)
	for count > 0 {
		aPart := amount / count
		amount = amount - aPart
		ans = append(ans, aPart)
		count--
	}

	return ans
}
```

```go
func TestSubDivided(t *testing.T) {
	t.Log(subDivided(8, 3))  // []int{2, 3, 3}
	t.Log(subDivided(9, 3))  // []int{3, 3, 3}
	t.Log(subDivided(10, 3)) // []int{3, 3, 4}
	t.Log(subDivided(11, 3)) // []int{3, 4, 4}
}
```



