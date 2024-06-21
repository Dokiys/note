# 分布式ID生成算法

Snowflake算法

> Snowflake，雪花算法是由Twitter开源的分布式ID生成算法，以划分命名空间的方式将 64-bit位分割成多个部分，每个部分代表不同的含义。
>
> * 第1位占用1bit，其值始终是0，可看做是符号位不使用。
> * 第2位开始的41位是时间戳，41-bit位可表示2^41个数，每个数代表毫秒，那么雪花算法可用的时间年限是`(1L<<41)/(1000L360024*365)`=69 年的时间。
> * 中间的10-bit位可表示机器数，即2^10 = 1024台机器，但是一般情况下我们不会部署这么台机器。如果我们对IDC（互联网数据中心）有需求，还可以将 10-bit 分 5-bit 给 IDC，分5-bit给工作机器。这样就可以表示32个IDC，每个IDC下可以有32台机器，具体的划分可以根据自身需求定义。
> * 最后12-bit位是自增序列，可表示2^12 = 4096个数。

该算法可以被用于安全性要求不太高的ID生成，如果是支付码、用户身份等需要防猜的场景下则需要对该算法进行一些修改。因此我们对生成的ID明确需求如下：

* 固定长度，且允许有统一前缀
* 需要防猜
* 支持高并发生成（允许极小概率的冲突）

我们可以对雪花算法进行适当的改进以符合我们的需求。对于时间部分可以有多种不同的获取方式比如：

```go
// sn(14) = 日期(6) + 当日秒(5) + 毫秒(3)
// sn(10) = 两位年(2) + 当前时间在今年的秒数(8)
```

```go
// sn(10) = 两位年(2) + 当前时间在今年的秒数(8)
func (g *Generator) timestamp(now time.Time) string {
	// 两位年
	year := now.Year() % 100
	// 当前时间在今年的秒数
	tmStart := time.Date(now.Year(), 0, 0, 0, 0, 0, 0, time.Local)
	seconds := now.Sub(tmStart).Nanoseconds() / 1e9
	return fmt.Sprintf("%d", int64(year*1e8)+seconds)
}
```

然后是机器码的生成，根据服务的数量确定机器码的位数。这里我们两位的机器码，也就是最多允许100个服务同时发码。机器码的获取方式有很多，比如通过redis或者自己生成，这里我们模拟使用最简单的方式直接从内存里面获取。

```go
var atomInt32 atomic.Int32
var _ WorkIdPicker = (*localWorkIdPicker)(nil)

type localWorkIdPicker struct{}

func (l *localWorkIdPicker) PickWorkId() uint32 {
	return uint32(atomInt32.Add(1))
}
```

```go
// sn(2) = 两位机器码
func (g *Generator) workerId() string {
	return fmt.Sprintf("%02d", g.picker.PickWorkId()%100)
}
```

接下来是序列号的生成。按照我们此前设置的时间戳，序列号的位数决定了单个发码服务在一秒的时间内所允许的最大发码量。
值得注意的是，这里如果直接采用循环计数来设置序列号在高并发场景下会有冲突的可能，尤其是当序列号位数不多的情况下。比如当序列号仅1位的时候，当每秒生成序列号的次数超过10则必然会有重复的序列号被生成。我们可以增加序列号位数以及设置更精确的时间戳（毫秒）来减少重复的可能。但这并没有从根本上解决重复的问题。
一种常用的解决方案是，每当单位时间内序列号已经到达上限，则等待下一个单位时间再继续生成。如果细心的话可能会发现在生成时间戳的方法中我们将时间由外部传入，这正是因为生成ID的时间是由这里的序列号生成时间决定的。

```go
func (r *Ring) init() {
	go func() {
		const interval = 1 * time.Second
		var begin = time.Now()
		var ticker = time.NewTicker(interval)
		var i = r.Min
		for {
			select {
			case begin = <-ticker.C:
				i = r.Min
			case r.ch <- ringResult{i, begin}:
				i++
				if i <= r.Max {
					continue
				}

				// 取完一轮后等待到下一个单位时间
				begin = <-ticker.C
				i = r.Min
			}
		}
	}()
}

func (r *Ring) Code() (time.Time, uint32) {
	next := <-r.ch
	return next.now, next.seq
}
```

最后由于需要防猜因此需要将生成的ID进行哈希散列计算，这里采用`djb算法`。哈希计算时加入密码盐进行计算，然后截取指定长度：

```go
func djbHash64(str []byte) uint64 {
	var hash uint64 = 5381
	for i := 0; i < len(str); i++ {
		hash = (hash<<5 + hash) + uint64(str[i])
	}
	return hash
}

func hash16(str []byte) string {
	return fmt.Sprintf("%016d", djbHash64(str))
}
```

```go
hash16([]byte(sn+g.hashSalt))
```



