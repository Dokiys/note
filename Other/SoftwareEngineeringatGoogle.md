# Software Engineering at Google

# Part I. Thesis

## What Is  Software Enginerring？

Software engineering isn’t programming. Programming is certainly a significant part of software engineering. The latter not only include development but also modification, maintenance, etc.      
One way to see impact of time on a program is to think about the question, “What is the expected life span of your code?”—— We don’t mean “execution lifetime,” we mean “maintenance lifetime”—how long will the code continue to be built, executed, and maintained? How long will this software provide value? One time? One hour? Or decades? This distinction is at the core of what we call sustainability for software. If your project is capable of reacting to whatever valuable change comes along, for either technical or business reasons. When you are incapable of reacting to change, you’re placing a high-risk bet on the hope that such a change never becomes critical. For short-term projects, that might be a safe bet. Over multiple decades, it probably isn’t.    
Another way to look at software engineering is to consider scale. A programming task is often an act of individual creation, but a software engineering task is a team effort. Team collaboration presents new problems. Such scale issues are fundamental to the question of software sustainability: cost and output.The job of a software engineer, is to aim for sustainability and management of the scaling costs for the organization, the product, and the development workflow. With those inputs in mind, we might defer maintenance changes, or even embrace policies that don't scale well. Those choices should be explicit and clear about the deferred costs, but we are regularly forced to evaluate the trade-offs between several paths forward, sometimes with high stakes and often with imperfect value metrics.

### Time and Change

When a novice is learning to program, the life span of the resulting code is usually one hour or day. For most Google projects, must assume that they will live indefinitely. But for most Engineers at an early-stage startup might rightly choose to focus on immediate goals over long-term investmentss: the company might not live long enough to reap the benefits of an infrastructure investment that pays off slowly. Over time, we need to be much more aware of the difference between “happens to work” and “is maintainable.” That is unfortunate, because keeping software main‐ tainable for the long-term is a constant battle.

#### Hyrum’s Law

> With a sufficient number of users of an API, it does not matter what you promise in
> the contract: all observable behaviors of your system will be depended on by
> somebody.

As a API owner, you will gain some flexibility and freedom by being clear about interface promises, but in practice, the complexity and difficulty of a given change also depends on how useful a user finds some observable. If users cannot depend on such things, your API will be easy to change. Given enough time and enough users, even the most innocuous change will break something. Your  analysis of the value of that change must incorporate the difficulty in investigating, identifying, and resolving those breakages.    
Most programmers know that hash tables are non-obviously ordered. Per Hyrum’s Law, programmers will write programs that depend on the order in which a hash table is traversed, if they have the ability to do so. In fact over the past decade or two, the computing industry’s experience using such types has evolved. Also per Hyrum’s Law, there is code that use hash iteration ordering as an inefficient random-number generator. Removing such randomness now would break those users.Just as entropy increases in every thermodynamic system, Hyrum’s Law applies to every observable behavior.    
Thinking over the differences between code written with a “works now” and a “works indefinitely” mentality. Looking at code as an artifact with a highly variable lifetime requirement, the same code may be described "hacky", "sample", or "complicated","Dose not confrom Knuth's optimization principle". This difference depend on your varies, lifetime. 

#### Why Not Just Aim for “Nothing Changes”?

>  In this world nothing can be said to be certain, except death and taxes.



### Scale and Efficiency

Everything your organization relies upon to produce and maintain code should be scalable in terms of overall cost and resource consumption. In particular, everything your organization must do repeatedly should be scalable in terms of human effort. 

#### Policies That Don’t Scale

The traditional use of development branches is an example of policy that has built-in scaling problems. Whenever any branch is decided to be “complete,” it is tested and merged into trunk, triggering some potentially expensive work for other engineers still working on their dev branch, in the form of resyncing and testing. We’ll need a different approach as we scale up, and we will discuss that in later chapter.

#### Policies That Scale Well

One of internal policies at Google is a great enabler of infrastructure teams, pro‐tecting their ability to make infrastructure changes safely, which is called “The Beyoncé Rule".    

> If a product experiences outages or other problems as a result of infrastructure changes, but the issue wasn’t surfaced by tests in our Continuous Integration (CI) system, it is not the fault of the infrastructure change.

#### Shifting Left

The Beyoncé Rule did not avoid compatibility issues, but throw them earlier.     
Consider a timeline of the developer workflow for a feature that progresses from left to right, starting from conception and design, progressing through implementation, review, testing, commit, canary, and eventual production deployment. Shifting problem detection to the “left” earlier on this timeline makes it cheaper to fix than waiting longer.     

<svg width="240" height="140" xmlns="http://www.w3.org/2000/svg">
 <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
 <g>
  <title>background</title>
  <rect fill="#fff" id="canvas_background" height="142" width="242" y="-1" x="-1"/>
  <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
   <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>
  </g>
 </g>
 <g>
  <title>Layer 1</title>
  <line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="122.817463" x2="227.666503" y1="122.817463" x1="10.333761" stroke-width="2" stroke="#000" fill="none"/>
  <line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_3" y2="121.844065" x2="11.333757" y1="19.484533" x1="11.333757" fill-opacity="null" stroke-opacity="null" stroke-width="2" stroke="#000" fill="none"/>
  <path id="svg_5" d="m-66.332607,45.817764" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="3" stroke="#000" fill="none"/>
  <path id="svg_10" d="m20.333722,106.150862c162.999364,0.333332 190.332591,-82.666344 190.332126,-82.817619" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="3" stroke="#000" fill="none"/>
  <text stroke="#000" transform="matrix(0.4719219025577672,0,0,0.39729771036214956,106.52899520367028,85.15398309883545) " xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_11" y="135.817452" x="201.99968" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#000000"/>
  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="10" id="svg_12" y="134.484123" x="188.333067" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">workflow</text>
  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="10" id="svg_13" y="15.151256" x="6.333777" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">defect cost</text>
 </g>
</svg>

So when we scale can assume a defense-in-depth approach, hopefully catching as many defects on the left side of the graph as possible. 



### Trade-offs and Costs

This seems obvious: in software engineering, as in life, good choices lead to good out‐ comes. So it's important that we should be able to explain how we can come to that choice when deciding between the general costs for two engineering options. It's a distaste “because everyone else does it this way”. The choice should always be the result of a trade-off based on known factors. These factors are usually cost and typically involve any or all of these factors:     

* Financial costs (e.g., money) 
* Resource costs (e.g., CPU time) 
* Personnel costs (e.g., engineering effort) 
* Transaction costs (e.g., what does it cost to take action?) 
* Opportunity costs (e.g., what does it cost to not take action?) 
* Societal costs (e.g., what impact will this choice have on society at large?)

#### Inputs to Decision Making

For some scenarios it's easy to measure costs and benefits. Such as "If I spend two weeks changing this linked-list into a higher-performance structure, I’m going to use five gibibytes more production RAM but save two thou‐ sand CPUs." At this time, we can do trade-offs"Should I do?".    
For more scenarios is that we don’t know how to measure costs and benefits. For example, “We don’t know how much engineer-time this will take.” or how do you measure the engineering cost of a poorly designed API? Or the societal impact of a product choice? We rely on experience, lead‐ership, and precedent to negotiate these issues. They are often just as important, but more difficult to manage.



#### Revisiting Decisions, Making Mistakes

A decision will be made at some point, based on the currently available data. As new data comes in, contexts change,  or assumptions are dispelled, it might become clear that a decision was in error or that it made sense at the time but no longer does. We believe strongly in data informing decisions, but the data will change over time. This means, inherently, that decisions will need to be revisited from time to time over the life span of the system in question. For long-lived projects, it’s often critical to have the ability to change directions after an initial decision is made. And, importantly, it means that the deciders need to have the right to admit mistakes. 



### Software Engineering Versus Programming

As said at the beginning, software engineering isn’t programming. Our point is not that software engineering is superior, merely that these represent two different problem domains with distinct constraints, values, and best practices. We believe it is important to differentiate between the related-but-distinct terms “programming” and “software engineering.” Much of that difference stems from the management of code over time, the impact of time on scale, and decision making in the face of those ideas. Programming is the immediate act of producing code. Software engineering is the set of policies, practices, and tools that are necessary to make that code useful for as long as it needs to be used and allowing collaboration across a team.



# Part II. Culture

## How to Work Well on Teams
