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

### Help Me Hide My Code

The answer is insecurity. People are afraid of others seeing and judging their work in progress. In one sense, insecurity is just a part of human nature—nobody likes to be criticized, especially for things that aren’t finished. Recognizing this theme tipped us off to a more general trend within software development: insecurity is actually a symptom of a larger problem.



### The Genius Myth

Many humans have the instinct to find and worship idols. For software engineers, those might be Linus Torvalds, Guido Van Rossum, Bill Gates—all heroes who changed the world with heroic feats.     
Actually, what Linus did was write just the beginnings of a proof-of-concept Unix-like kernel. That was definitely an impressive achievement, but it was just the tip of the iceberg. Linux is hundreds of times bigger than that initial kernel and was developed by thousands of smart people. Linus’ real achievement was to lead these people and coordinate their work; Linux is the shining result not of his original idea, but of the collective labor of the community.

Humans have a natural instinct to find leaders and role models, idolize them, and attempt to imitate them. The phenomenon of “techie-celebrity” has almost spilled over into mythology. We all want to write something world-changing like Linux. Deep down, many engineers secretly wish to be seen as geniuses. This fantasy goes something like this: 

* You are struck by an awesome new concept.
* You vanish into your cave for weeks or months, slaving away at a perfect imple‐ mentation of your idea.
* You then “unleash” your software on the world, shocking everyone with your genius.
* Your peers are astonished by your cleverness.

But most people probably not a genius. And the vast majority of the work at most companies doesn’t require genius-level intellect, but 100% of the work requires a minimal level of social skills. Many programmers are afraid to share work they’ve only just started because it means peers will see their mistakes and know the author of the code is not a genius.     
Have you ever get insecure about people looking before something is done? Like they are going to seriously judge you and think you are an idiot. This is an extremely common feeling among programmers, and the natural reaction is to hide  away until your code is perfect.    
In this case, we assert that you’re doing it wrong, and it is a big deal. Here’s why.



### Hiding Considered Harmful

If you spend all of your time working alone, you’re increasing the risk of unnecessary failure and cheating your potential for growth.

#### Early Detection

If you keep coding alone until the implementation is polished, you’re taking a huge gamble.  It’s easy to make fundamental design mistakes early on. This is why people dip their toes in the water before jumping in the deep end: you need to make sure that you’re working on the right thing, you’re doing it correctly. The more feedback you solicit early on, the more you lower this risk. 

#### The Bus Factor

> Bus factor (noun): the number of people that need to get hit by a bus before your project is completely doomed.

How dispersed is the knowledge and know-how in your project? If somebody the only person who understands how the prototype code works, he might enjoy good job security—but if he gets hit by a bus, the project is toast.     
Hopefully most engineers recognize that it is better to be one part of a successful project than the critical part of a failed project(What does Marx think about this?).

Beyond the bus factor, there’s the issue of overall pace of progress. Working with other people directly increases the collective wisdom behind the effort. When you become stuck on something absurd, how much time do you waste pulling yourself out of the hole? And think about e if you had a couple of peers to look over your shoulder and tell you—instantly—how you goofed and how to get past the problem. This is exactly why teams sit together (or do pair programming) in software engineering companies. 

#### Pace of Progress

Think about one case: do you spend days writing 10,000 lines of code, and compile very first time?  Of course you don’t. I think you can imagine what sort of disaster would result. Programmers work best in tight feedback loops: write a new function, compile. Add a test, compile. Refactor some code, compile. This way, we discover and fix typos and bugs as soon as possible after generating code. The current DevOps philosophy toward tech productivity is explicit about these sorts of goals: get feedback as early as possible, test as early as possible. This is all bundled into the idea of “shifting left” in the developer workflow; the earlier we find a problem, the cheaper it is to fix it.    

The same sort of rapid feedback loop at the whole-project level, too. Projects run into unpredictable design obstacles or political hazards, or we simply discover that things aren’t working as planned. How do you get that feedback loop so that you know the instant your plans or designs need to change? Answer: by working in a team. People working in caves awaken to discover that while their original vision might be complete, the world has changed and their project has become irrelevant.

> Don’t misunderstand us—we still think engineers need uninterrupted time to focus on writing code, but we think they need a high-bandwidth, low-friction connection to their team just as much.

#### In Short, Don’t Hide

-



### It’s All About the Team

> software engineering is a team endeavor

#### The Three Pillars of Social Interaction

 These three principles aren’t just about greasing the wheels of relationships; they’re the foundation on which all healthy interaction and collaboration are based:

* Pillar 1 Humility: You are not the center of the universe (nor is your code!). You’re neither omnis‐ cient nor infallible. You’re open to self-improvement.    
* Pillar 2 Respect: You genuinely care about others you work with. You treat them kindly and appreciate their abilities and accomplishments.
* Pillar 3 Trust: You believe others are competent and will do the right thing, and you’re OK with letting them drive when appropriate.5

#### Why Do These Pillars Matter?

When you’ve got richer relationships with your coworkers, they’ll be more willing to go the extra mile when you need them.

#### Humility, Respect, and Trust in Practice

Criticism is almost never per‐ sonal—it’s usually just part of the process of making a better project. The trick is to make sure you (and those around you) understand the difference between a constructive criticism of someone’s creative output and a flat-out assault against some‐ one’s character. The latter is useless—it’s petty and nearly impossible to act on. The former can (and should!) be helpful and give guidance on how to improve. And, most important, it’s imbued with respect.

> "What’s this?" asks the CEO.
> "My resignation,” says the executive. “I assume you called me in here to fire me."
> "Fire you?" responds the CEO, incredulously. "Why would I fire you? I just spent $10 million training you!"

At Google, one of our favorite mottos is that “Failure is an option.”    

#### Blameless Post-Mortem Culture

The key to learning from your mistakes is to document your failures. Take extra care to make sure the postmortem document isn’t just a useless list of apologies or excuses or finger-pointing—that’s not its purpose. A proper postmortem should keep others avoid some mistakes on similar issues. So, don’t erase your tracks—light them up like a runway for those who follow you. 

The more open you are to influence, the more you are able to influence. There is someone that no matter how much people try to persuade them, they dig their heels in even more. In our experience, people stop listening to their opinions or objections gradully. So keep this idea in your head: it’s OK for someone else to change your mind. We said that engineering is inherently about trade-offs, and it’s impossible for you to be right about everything all the time, so of course you should change your mind when presented with new evidence.

The more vulnerable you are, the stronger you appear. In fact, the willingness to express vulnera‐ bility is an outward show of humility, it demonstrates accountability and the willing‐ ness to take responsibility, and it’s a signal that you trust others’ opinions. Sometimes, the best thing you can do is just say, “I don’t know.” Professional politicians  admitting error may are constantly under attack by their opponents. But when you’re writing software, however, you don’t need to be continually on the defensive—your teammates are collaborators, not competitors. You all have the same goal. 

#### Being Googley

At Google, we have our own internal version of the principles of “humility, respect, and trust” when it comes to behavior and human interactions. Google eventually  defining a rubric for what we mean by “Googleyness”—a set of attributes and behaviors that we look for that represent strong leadership and exemplify “humility, respect, and trust”:

* Thrives in ambiguity: Can deal with conflicting messages or directions, build consensus, and make progress against a problem, even when the environment is constantly shifting.
* Values feedback: Has humility to both receive and give feedback gracefully and understands how valuable feedback is for personal (and team) development.
* Challenges status quo: Is able to set ambitious goals and pursue them even when there might be resist‐ ance or inertia from others.
* Puts the user first: Has empathy and respect for users of Google’s products and pursues actions that are in their best interests. 
* Cares about the team: Has empathy and respect for coworkers and actively works to help them without being asked, improving team cohesion.
* Does the right thing: Has a strong sense of ethics about everything they do; willing to make difficult or inconvenient decisions to protect the integrity of the team and product.



## Knowledge Sharing

Your organization understands your problem domain better than some random person on the internet; your organization should be able to answer most of its own questions and permits people to admit to a lack of knowledge.

### Challenges to Learning

Sharing expertise across an organization is not an easy task. Google has experienced a number of these challenges, especially as the company has scaled:    

* Lack of psychological safety: 
  An environment in which people are afraid to take risks or make mistakes in front of others because they fear being punished for it.
  
* Information islands: 
  Knowledge fragmentation that occurs in different parts of an organization that don’t communicate with one another, each group develops its own way of doing things, and and these might or might not conflict.
  
* Single point of failure (SPOF):
  A bottleneck that occurs when critical information is available from only a single person. This is related to bus factor.
  
* All or nothing expertise: 
  A group of people that is split between people who know “everything” and novices. This problem often reinforces itself if experts always do everything themselves and don’t take the time to develop new experts through mentoring or documentation. This cause knowledge continue to accumulate on those who already have expertise and and new team members ramp up more slowly.

* Parroting:
  Mimicry without understanding, or code is needed for unknown reasons.

* Haunted graveyards:

  Places, often in code, that people avoid touching or changing because they are afraid that something might go wrong. 

### Philosophy

Software engineering can be defined as the multiperson development of multiversion programs.2 People are at the core of software engineering: code is an important output but only a small part of building a product. Code and expertise does not emerge spontaneously out of nothing. An organization’s success depends on growing and investing in its people.

Personalized, one-to-one advice from an expert is always invaluable. And although one person might be able to provide personalized help for one-to-many, this doesn’t scale and is limited to small numbers of “many.” Documented knowledge, on the other hand, can better scale not just to the team but to the entire organization. If we document that knowledge, it is now available to anybody who can view the documentation and to find answers or they might know who does.

### Setting the Stage: Psychological Safety

In a healthy environment, people feel comfortable asking questions, being wrong, and learning new things. A mentor—someone who is not their manager or tech lead—whose responsibilities explicitly include answering questions and helping the new team member ramp up. This mentor is not on the same team as the mentee, which can make the mentee feel more comfortable about asking for help in tricky situations. 
We find the [Recurse Center’s social](https://www.recurse.com/manual#sub-sec-social-rules) rules to be helpful.

### Growing Your Knowledge

If you take away only a single thing from this chapter, it is this: always be learning; always be asking questions.

### Scaling Your Questions: Ask the Community

-

### Scaling Your Knowledge: You Always Have Something to Teach

Office hours are a regularly scheduled (typically weekly) event during which one or more people make themselves available to answer questions about a particular topic. 

Documentation is written knowledge whose primary goal is to help its readers learn something. You can then make it easier for others to follow in your path by pointing them at your document and make sure there’s a mechanism for feedback.

Code documentation is one way to share knowledge; clear documentation not only benefits consumers of the library, but also future maintainers. Code reviews  are often a learning opportunity for both author and reviewer(s).

### Scaling Your Organization’s Knowledge

Good culture must be actively nurtured, and encouraging a culture of knowledge sharing requires a commitment to recognizing and rewarding it at a systemic level.

Canonical sources of information are centralized, company-wide corpuses of information that provide a way to standardize and propagate expert knowledge. Providing centralized references counters problems with information fragmentation that can arise when multiple teams grappling with similar problems produce their own—often conflicting—guides. 
Not all content needs to be shared at an organizational level. When considering how much effort to invest in this resource, consider your audience. Who benefits from this information? You? Your team? Your product area? All engineers?

Static analysis tools are a powerful way to share best practices that can be checked programmatically. When a check for a best practice is added to a tool, every engineer using that tool becomes aware of that best practice. This also frees up engineers to teach other things. 

### Readability: Standardized Mentorship Through Code Review

At Google. Every changelist(CL) requires readability approval. This requirement was added after Google grew to a point where it was no longer possible to enforce that every engineer received code reviews that taught best practices to the desired rigor.

Anyone with readability is welcome to selfnominate to become a readability reviewer. They are expected to treat readability as first and foremost a mentoring and cooperative process, not a gatekeeping or adversarial one. Reviewers provide relevant citations for their comments so that authors can learn about the rationales that went into the style guidelines.

Code is read far more than it is written. An important feature of documented best practices is that they provide consistent standards for all Google code to follow. Readability is both an enforcement and propagation mechanism for these standards, it easier to enforce consistency, avoid islands, and drifting from established norms.

These benefits come with some costs: readability is a heavyweight human-driven process, and is potential for additional rounds of code review for authors. 
But as with most—or perhaps all—engineering processes, there’s always room for improvement. As we continue to invest in static analysis, readability reviewers can increasingly focus on higher-order areas.



## Engineering for Equity

todo
