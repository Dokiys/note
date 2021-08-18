# Algorithms

## 埃拉托斯特尼筛法

Ruby实现素数筛选

![ertosthenes](../assert/Other/Algorithms/Sieve_of_Eratosthenes_animation.gif)

```bash
index = 0
while primes[index]**2 <= primes.last
  prime = primes[index]
  primes = primes.select { |x| x == prime || x % prime != 0 }
  index += 1
end
```



## 分治

#### 快速排序

![849589-20171015230936371-1413523412](../assert/Other/Algorithms/849589-20171015230936371-1413523412.gif)

```ruby
def quick_sort(array)
  return array if array.size <= 1
  array.shuffle!
  left, right = array[1..-1].partition {|n| n <= array.first}
  quick_sort(left) + [array.first] + quick_sort(right)
end
```



#### 查找无序数组里面第K大的值

```ruby
def dc(arr, k)
  return 'err' if k > arr.length || !k.positive?
  mid = arr.pop
  left = []
  right = []
  arr.each do |e|
    e <= mid ? right << e : left << e
  end

  if left.length >= k
    dc(left, k)
  elsif left.length + 1 == k
    return mid
  else
    dc(right, k - left.length - 1)
  end
end
```

