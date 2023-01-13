# Software Engineering at Google

## What Is  Software Enginerring？

Software engineering isn’t programming. Programming is certainly a significant part of software engineering. The latter not only include development but also modification, maintenance, etc.      
One way to see impact of time on a program is to think about the question, “What is the expected life span of your code?”—— We don’t mean “execution lifetime,” we mean “maintenance lifetime”—how long will the code continue to be built, executed, and maintained? How long will this software provide value? One time? One hour? Or decades? This distinction is at the core of what we call sustainability for software. If your project is capable of reacting to whatever valuable change comes along, for either technical or business reasons. When you are incapable of reacting to change, you’re placing a high-risk bet on the hope that such a change never becomes critical. For short-term projects, that might be a safe bet. Over multiple decades, it probably isn’t.    
Another way to look at software engineering is to consider scale. A programming task is often an act of individual creation, but a software engineering task is a team effort. Team collaboration presents new problems. Such scale issues are fundamental to the question of software sustainability: cost and output.The job of a software engineer, is to aim for sustainability and management of the scaling costs for the organization, the product, and the development workflow. With those inputs in mind, we might defer maintenance changes, or even embrace policies that don't scale well. Those choices should be explicit and clear about the deferred costs, but we are regularly forced to evaluate the trade-offs between several paths forward, sometimes with high stakes and often with imperfect value metrics.

### Time and Change 

When a novice is learning to program, the life span of the resulting code is usually one hour or day. For most Google projects, must assume that they will live indefinitely. But for most Engineers at an early-stage startup might rightly choose to focus on immediate goals over long-term investmentss: the company might not live long enough to reap the benefits of an infrastructure investment that pays off slowly. Over time, we need to be much more aware of the difference between “happens to work” and “is maintainable.” That is unfortunate, because keeping software main‐ tainable for the long-term is a constant battle.

### Hyrum’s Law

> With a sufficient number of users of an API, it does not matter what you promise in
> the contract: all observable behaviors of your system will be depended on by
> somebody.

As a API owner, you will gain some flexibility and freedom by being clear about interface promises, but in practice, the complexity and difficulty of a given change also depends on how useful a user finds some observable. If users cannot depend on such things, your API will be easy to change. Given enough time and enough users, even the most innocuous change will break something. Your  analysis of the value of that change must incorporate the difficulty in investigating, identifying, and resolving those breakages.    
Most programmers know that hash tables are non-obviously ordered. Per Hyrum’s Law, programmers will write programs that depend on the order in which a hash table is traversed, if they have the ability to do so. In fact over the past decade or two, the computing industry’s experience using such types has evolved. Also per Hyrum’s Law, there is code that use hash iteration ordering as an inefficient random-number generator. Removing such randomness now would break those users.Just as entropy increases in every thermodynamic system, Hyrum’s Law applies to every observable behavior.    
Thinking over the differences between code written with a “works now” and a “works indefinitely” mentality. Looking at code as an artifact with a highly variable lifetime requirement, the same code may be described "hacky", "sample", or "complicated","Dose not confrom Knuth's optimization principle". This difference depend on your varies, lifetime. 

### Why Not Just Aim for “Nothing Changes”?

In this world nothing can be said to be certain, except death and taxes.



## Scale and Efficiency

