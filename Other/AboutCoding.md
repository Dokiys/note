# 关于写好代码
这个标题根据阅读的重音有两层意思。“关于写 好代码”，几乎任何一个程序员都能脱口而出几条编写代码时应该遵循的原则，并且几乎所有关于代码风格的文章也会告诉你应该如何如何编写你的代码。“关于写好 代码”的讨论却相对较少，我想基于这两个问题谈谈我自己的一些见解，所以第一个问题就是“我为什么要写好 代码？”

## 为什么要写好 代码？
被很多程序员奉为经典的《代码整洁之道》对此也相谈甚少，书中认为糟糕代码的代价是团队生产力的下降。当然我不否认这个观点，但是它并不能成为让我写好代码的理由。
### 编程如同艺术？
对于我来说，虽然这个理由比“写代码如同艺术创作”这种虚无缥缈的并带有一点哲学色彩的说教要强一些，但是不多。如果你支持“编程如同艺术”的观点，那么就如同人们将马塞尔·杜尚的《喷泉》和列奥纳多·达·芬奇的《蒙娜丽莎》都看作艺术品一样，你就应该认为“好代码”和“糟糕的代码”都是艺术创作，只不过风格不同。当然这里我不是说“好代码”和“糟糕的代码”没有区别，之后我们会再对“什么是好代码”进行讨论。
### 代码的权衡
那么回到生产力上说。持续提供生产力或许并不是所有代码的目的。我们当然不能否认咖啡馆里现磨的咖啡比速溶咖啡口感上更好，但是如果当你需要下楼并走两条街道才能花几十块买到一杯现磨咖啡时，或许你会直接选择公司免费提供的速溶咖啡。因为可能你仅仅只是想喝杯咖啡为下午繁重的工作提提神，即使是一杯速溶咖啡就已经可以满足你的需求了。在生产上，一个比较极端也是我们经常会遇到的例子，就是有时我们需要编写一些一次性的脚本来修正一些错误的数据。你当然可以花费大量的时间仔细去研究如何将代码的时间复杂度和空间复杂度控制在最优，写上完美的注释，让你的代码符合开闭原则，同时使代码中每一个空格和换行都是不可替代的，甚至同事review你代码时都发自内心不由的感叹“艺术！绝对是艺术！”但可能并不是所有同事的赞叹都那么存粹，“可以，但没必要”的质疑或许夹杂其中，因为他们可能只需要一条简单的命令就可以完成同样的事情。我喜欢没有贬义得将这种方式称为“能跑就行”。
《Google的软件工程》中提到的，编程和软件工程最大的区别之一就是权衡。但其实编程中也肯定存在需要开发者去权衡。上面这个例子中，我们追求的“代码艺术”和完成功能都可以看作是需求，我们需要的投入就是时间。如果时间不足以同时完成“代码艺术”和功能，那我相信没人会放弃功能。开发实践中常见的情况就是“来不及了，就先这样吧！”
所以从这个意义上来讲，我认为编程不当然的是艺术创作，其本质也是最核心的目的就是为了满足需求。只不过我们可以将写出诗歌一样的代码作为我们自己或者团队的要求，当然代价就是消耗更多的投入。
### 明确需求
从一个理性的经济学程序员的角度来说，只要是能满足需求，应该采取最小的投入。所以在团队开发中，当一个程序员阅读别人代码时心里永远想的都是“卧槽！这写的是个啥！谜语吗？”，因为对于大部分开发者来说，让自己编写的代码能够被别人看得懂并不是需求之一。即使有些团队对代码提出了要求，但通常这些要求基于各种原因最后真正转换成为开发人员编写代码时作为必要考虑的少之又少（试想一下有多少团队中政策性的要求，最后因为大家都逐渐不遵守而不了了之。我们之后还再会对此进行讨论）。
最后代码写出来是什么样，更多的可能是来自你自己对开发过程中追求“代码艺术”的权衡，影响其中权重的因素可能是时间（“同一段代码，三天有三天的写法，五天有五天的写法”），也可能是来开发者已经接受的观点（比如“写代码如同艺术创作”），还可能承继自团队的要求，或者是其他各种原因（比如“反正明天老子就跑路了”）。所有的这些都是基于你自己所处的环境总结的因素，最后权衡得到的结果。
所以对于“为什么要写好代码？”这个问题，并不是某个确定的答案能够回答的，毕竟“鞋子合不合脚，只有脚知道”。

## 如何写 好代码？
我当然不反对“代码艺术”，只不过需要添加一些限制，即在条件允许的情况下，我们应当尽量写好 代码。很多书和文章都对“如何写 好代码”，有详细的论述。比如《代码整洁之道》之中单单是对各种文件，变量的名称都做了相当详细论述。各种功能语言的社区也会有一些推荐的规范（比如[Ruby](https://rubystyle.guide/)），但我还是想基于我自己的编程实践，给各位提供一些我自己的想法作为参考。
### 代码格式
如果代码最本质是能够运行，那么好代码的本质是用最小的成本就能让别人继续维护。代码作为机器语言，跟我们人类语言很像，同一种意思可以通过多种方式表示，比如我们可以通过陈述、倒装、反问来表达同一种意思。在生活中我们跟别人交流的时候很少有听到说“你说的这句话不应该用反问，应该使用陈述句，这样更加符合我们交流的规范”，因为语言的本质是信息交流，当其能正确表达、传递、接受的时候去关注那些细枝末节的修辞手法、语气停顿是没有意义的。但类似的情况在软件开发中却屡见不鲜，甚至一个是否换行的问题，各种规范流派的支持者们能够在论坛上讨论个三天三夜。
我当然不是说不应该使用统一的规范，相反我认为使用统一的规范可以极大的降低我们理解代码的成本。在这种格式（format）问题上较真，是没有意义的。如果你有学习第二种编程语言的经历，我想你一定会有过这种想法“这个新语言的方法定义方式很奇怪”甚至你可能会觉得这种语法不如之前的某种语言。学习一段时间之后当你再来看这种新语言的语法，或许你会有所改观感觉这种方式也还行。关于代码格式的讨论就与此很类似，或许没有好坏，只关乎是否熟悉，但似乎仍然有不少人都对这种讨论乐此不疲。而如今都可以直接将静态语法分析工具（比如GolangCI Lint，SonarLint，ESLint）集成到团队项目的CI/CD中进行政策性的限制，很多团队也确实是这么做的。

### 代码风格
然而在开发实践中，最众说纷纭的是代码风格（style）。上到一个系统、模块的设计，下到一条循环表达式，都可以装在代码风格的框里。我理解统一代码风格为什么这么难主要有以下一些原因：
#### 技术水平
相信大部分人有和我一样的经历，看到某段代码时“卧槽！这写的是啥？谜语吗？”，打开提交记录发现原来是自己写的。这种情况无外乎两种原因，一种是团队中所有人都按照同一种风格编写代码，因为时间久远你忘却了是自己写的。但我认为这种情况通常比较少，因为团队想要统一规范很难（随后我们就会讨论到）。另外一种是你写的代码根本就没有风格，这或许并不是一件坏事，因为如果换种让人更容易接受的说法就是：你在提升。我相信《代码整洁之道》中的那些规则都是作者长期经验的积累，每个开发者在编写代码过程中都或多或少有一定的积累，直到形成自己的风格。
#### 多样性
就像上一章我们讨论的，每个人的“代码艺术”都是基于自身所处环境中各种因素的权衡。甚至不同的编辑器都会对开发者写代码的方式产生很大的影响。所以每个人的代码风格不同是必然的，你必须接受这种多样性的存在。
#### 统一的困难
可能你会想，那团队中基于同一套代码风格不就行了吗？我想说，想要统一规范相当困难。首先，这种规范只可能是政策性的指导，而不是政策性的强制。我们以[uber-go规范](https://github.com/uber-go/guide/blob/master/style.md#embedding-in-structs)中的一个建议为例：该规范中建议嵌套的结构体应该放在顶部，并和其他成员变量通过空行分开。
```go
// bad 或许我们更应该将这种方式想象成风格1
type Client struct {
  version int
  http.Client
}

// good 或许我们更应该将这种方式想象成风格2
type Client struct {
  http.Client

  version int
}
```
我想讨论并不是这里这条规则是否合理，而是类似这种规范很难通过自动化工具对其强制验证，只能通过review来检查是否符合团队的规范。这不仅给reviewer带来了额外的工作量，并且人们对规范的记忆很容易被时间的洪流冲走。就像之前提到的，一个理性的经济学程序员，只会用最小的投入来满足需求。而在这个例子中的表现形式就是“啊！我忘记了我立马修改一下”。想象你们团队有多少政策是到后来渐渐的就没人提及，而不是被明确的宣布废止。
其次，即使你们团队有足够的精力来审核每个人的代码，仍然有很多情况是规范所不能覆盖的。任何规范都只是对应常见的情况，并且通常只针对语句的层面。当上升到模块设计的时候，可以说就是规范的荒漠了。比如，某种功能模块可以用工厂模式实现，也可以用抽象工厂模式实现，是没有办法来统一的，你不能简单的说以后团队中遇到这种类似的情况都适用某某模式，因为需要分析权衡后做出选择。有选择的地方就会有不同意见，有不同意见就会有“卧槽！这写的是啥？谜语吗？”

（对于代码风格的问题，我似乎有了新的看法。当一个团队发展到一定规模时，代码风格的一致性，必然对工程效率有很大的影响，所以彼时就不得不正视这个问题。谷歌的方案是通过人为驱动的代码可读性审查过程来保证代码库的风格统一，这必定会增加一定的维护成本，而且是随着组织规模的扩大而线性增长的。但对于谷歌来说，这些代价仍然是值得的。而在我们的情况下则需要我们自己去权衡其中的利弊。）

### 好代码的本质
我并不是说这些代码规范就毫无用处，相反我觉得了解这些规范对我们写 好代码帮助很大。我想表达的是不要对规范过于执着。就像语言的本质是信息交流，好代码的本质是用最小的成本就能让别人继续维护。注意这里的“别人”、“最小的成本”和“维护”。
关于“别人”，即使是你一个人维护的代码你也应该以写给别人为目标，因为一年以后的你或许不再是你。这一点在代码注释上的体现尤为明显，甚至可以直接将其作为判断是否是好注释的标准。好的注释应当是写给别人看的（当然写的清楚明白是前提），而不是为了之后让自己能够回忆起几个月前犯下的“罪行”。所以在我看来，如果在修改主要由别人维护的项目的时候，即使你坚定不移的认为他的代码不符合规范，也应该按照别人的风格写下去。
对于“最小的成本”，这里的成本包括，写代码时花费的成本，也包括某人尝试理解这段代码时所花费的成本。这通常可以通过使用一些达成共识的命名、统一的规范模式、逻辑判断中的提前返回等方式来降低，并且几乎所有规范的具体规则都是该原则的体现。
“维护”也可以理解为代码的可读性，可重用性，可扩展性。规范作为别人经验的累积，我们可以学习，但是别太拘泥于此。为了让我的观点更具说服力，我想贴一段k8s源码中的注释：

```go
// ==================================================================
// PLEASE DO NOT ATTEMPT TO SIMPLIFY THIS CODE.
// KEEP THE SPACE SHUTTLE FLYING.
// ==================================================================
//
// This controller is intentionally written in a very verbose style.  You will
// notice:
//
// 1.  Every 'if' statement has a matching 'else' (exception: simple error
//     checks for a client API call)
// 2.  Things that may seem obvious are commented explicitly
//
// We call this style 'space shuttle style'.  Space shuttle style is meant to
// ensure that every branch and condition is considered and accounted for -
// the same way code is written at NASA for applications like the space
// shuttle.
//
// Originally, the work of this controller was split amongst three
// controllers.  This controller is the result a large effort to simplify the
// PV subsystem.  During that effort, it became clear that we needed to ensure
// that every single condition was handled and accounted for in the code, even
// if it resulted in no-op code branches.
//
// As a result, the controller code may seem overly verbose, commented, and
// 'branchy'.  However, a large amount of business knowledge and context is
// recorded here in order to ensure that future maintainers can correctly
// reason through the complexities of the binding behavior.  For that reason,
// changes to this file should preserve and add to the space shuttle style.
//
// ==================================================================
// PLEASE DO NOT ATTEMPT TO SIMPLIFY THIS CODE.
// KEEP THE SPACE SHUTTLE FLYING.
// ==================================================================
```

## 写在后面的话
关于这篇文章中的思考源自朋友向我吐槽他接手的一个项目，其中有些方法有6，7个if else嵌套、没有注释、错误信息随意返回。也许大部分人接手的时候也会破口大骂之前的开发者。但是如果我告诉你，这段代码能够在公司业绩严重下滑并且大量裁员的时候让它的编写者避免被裁掉，直到他跳槽到新的公司，那么从某种意义上来说，这段代码是否也是“艺术”呢？或许商业世界中，金钱与“代码艺术”之间差别只是汇率的问题。
