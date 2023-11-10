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

-



## How to Lead a Team

### Managers and Tech Leads (and Both)

At Google, we recognize two different leader‐ ship roles. A Manager is a leader of people, whereas a Tech Lead leads technology efforts.

### Moving from an Individual Contributor Role to a Leadership Role

“servant leadership,” which is a nice way of saying the most important thing you can do as a leader is to serve your team. As a servant leader, you should strive to create an atmosphere of humility, respect, and trust. This might mean removing bureaucratic obstacles that a team member can’t remove by themselves, helping a team achieve consensus, or even buying dinner for the team when they’re working late at the office.

#### The Engineering Manager

The present-day concept of the pointy-haired manager is partially a carryover, first from military hierarchy and later adopted by the Industrial Revolution—more than a hundred years ago! Factories began popping up everywhere, and workers required supervisors to manage them, and because it was easy to replace these workers, the managers had little motivation to treat their employees well or improve conditions for them. And this method worked well for many years.

The [carrot-and-stick](https://zh.wikipedia.org/zh-tw/%E8%83%A1%E8%98%BF%E8%94%94%E5%8A%A0%E5%A4%A7%E6%A3%92) method of management survived the transition from the factory to the modern office in the middle part of the twentieth century when employees would work at the same job for years and years. This continues today in some industries. 

Unlike the replaceable assembly-line worker, software engineers need nurturing, time, and space to think and create. If there’s one thing you remember from this chapter, make it this:

> Traditional managers worry about how to get things done, whereas great managers worry about what things get done (and trust their team to figure out how to do it).



### Antipatterns

And nowhere is hope more overused as a strategy than in dealing with a low performer. Most team leaders grit their teeth, avert their eyes, and just hope that the low performer either magically improves or just goes away. The benefit of dealing with a low performer as quickly as possible is that you can put yourself in the position of helping them up or out. 

Many leads sometimes work extra hard to maintain friendships with their team members. This can be a recipe for disaster. Don’t confuse friendship with leading with a soft touch: when you hold power over someone’s career, they might feel pressure to artificially reciprocate gestures of friendship. Remember that you can lead a team and build consensus without being a close friend of your team.  If the friend who is being managed is not selfmanaging and is not a hard worker, it can be stressful for everyone. 

Big personal egos are difficult to handle on any team, especially in the team’s leader. 



### Positive Patterns

You’ll usually gain respect from people when you apologize, because apologizing tells people that you are level headed, good at assessing situations, and—coming back to humility, respect, and trust—humble.

Another way of thinking about this is the maxim that the leader is always on stage. You are always being watched: not just when you run a meeting or give a talk, but even when you’re just sitting at your desk answering emails. Your peers are watching you for subtle clues in your body language, your reactions to small talk, and your signals as you eat lunch.

When a team member asks you for advice, you usually go leaping into solution mode, but that is the last place you should be. The person asking for advice typically doesn’t want *you* to solve their problem, but rather to help them solve it.

One of the most common things a team leader does is to build consensus, it’s one way you can lead without any actual authority. If your team is looking to move quickly, sometimes it will voluntarily concede authority and direction to one or more team leads. Even though this might look like a dictatorship or oligarchy, when it’s done voluntarily, it’s a form of consensus.

 “I won’t lie to you, but I will tell you when I can’t tell you something or if I just don’t know.”

Giving a little extra slack to a team member who is currently having a tough time at home can make them a lot more willing to put in longer hours when your team has a tight deadline to hit later.

There are two types of motivation: *extrinsic* and *intrinsic*. In his book *Drive*, Dan Pink explains that the way to make people the happiest and most productive isn’t to motivate them extrinsically (e.g., throw piles of cash at them); rather, you need to work to increase their intrinsic motivation(e.g., make them make them want something).

Of course, all the autonomy and mastery in the world isn’t going to help motivate someone if they’re doing work for no reason at all, which is why you need to give their work purpose.



## Leading at Scale

Leading a team of teams is often more about organizing people rather than being a technical wizard.



## Measuring Engineering Productivity

### Why Should We Measure Engineering Productivity?

Adding more people will be necessary to increase the scope of your business, but, the communication overhead costs will not scale linearly as you add additional personnel. As a result, you won’t be able to scale the scope of your business linearly to the size of your engineering organization.
So let's think about: What should we measure? How identifies meaningful metrics that will identify the problematic. And how to use this metric to track improvements to productivity.

### Triage: Is It Even Worth Measuring?

Before measuring, we must consider followering questions: 

* If the data supports your expected result, what action will be taken?
* Who is going to decide to take action on the result, and when would they do it?

For most time, you will found there are many good reasons to not measure:

* You can’t afford to change the process/tools right now
* Any results will soon be invalidated by other factors
* The only metrics available are not precise enough to measure the problem and can be confounded by other factors

### Selecting Meaningful Metrics with Goals and Signals

Google uses the Goals/Signals/Metrics (GSM) framework to guide metrics creation.

* A goal is a desired end result(It should be written in terms of a desired property, without reference to any metric).
* A signal is how you might know that you’ve achieved the end result(It is the way that we will know we’ve achieved our goal). 
* A metric is proxy for a signal witch we actually can measure(It is where we finally determine how we will measure the signal.).

The GSM framework encourages several desirable properties when creating metrics. First, by creating goals first, then signals, and finally metrics, it prevents the streetlight effect(If you look only where you can see, you might not be looking in the right place). 
There is not a 1:1 relationship between signals and goals. And usually, neither of metrics really provide the underlying truth.  If some metrics show different results, it signals that possibly one of them is incorrect and we need to explore further. If they are the same, we just have more confidence that we have reached some kind of truth. Additionally, some signals might not have any associated metric, so that the metrics selected are not telling the complete story. Google uses qualitative data to validate metrics and ensure that they are capturing the intended signal.

### Using Data to Validate Metrics

-

### Taking Action and Tracking Results

We should always assume that engineers will make the appropriate trade-offs if they
have the proper data available and the suitable tools at their disposal.



# Part III. Processes

## Style Guides and Rules

### Why Have Rules?

As an organization grows, the established rules and guidelines shape the common vocabulary of coding. A common vocabulary allows engineers to concentrate on what their code needs to say rather than how they’re saying it.
The interpretation of “good” and “bad” varies by organization, depending on what the organization cares about. We must first recognize what a given organization values; we use rules and guidance to encourage and discourage behavior accordingly. So when defining a set of rules, the first question is "What goal are we trying to advance?".

### Creating the Rules

#### Guiding Principles

There is a number of overarching principles that guide the development of our rules, which must:

* Pull their weight
* Optimize for the reader
* Be consistent
* Avoid error-prone and surprising constructs
* Concede to practicalities when necessary

**Pull their weight**: Not everything should go into a style guide. There is a nonzero cost in asking all of the engineers in an organization to learn and adapt to any new rule that is set. If just one or two engineers are getting something wrong, adding to everyone’s mental load by creating new rules doesn’t scale.

**Optimize for the reader**: Given the passage of time, our code will be read far more frequently than it is written. Google engineers value “simple to read” over “simple to write.” Given the style guide rule, require that engineers leave explicit evidence of intended behavior in their code.  We aim for local reasoning, where the goal is clear understanding of what’s happening at the call site without needing to find and reference other code, including the function’s implementation.
Most style guide rules covering comments are also designed to support this goal of in-place evidence for readers. Documentation comments describe the design or intent of the code that follows. Implementation comments justify or highlight nonobvious choices, explain tricky bits, and underscore important parts of the code. 

**Be consistent**: Consistency is what enables any engi‐ neer to jump into an unfamiliar part of the codebase and get to work fairly quickly. A local project can have its unique personality, but its tools are the same, its techniques are the same, its libraries are the same, and it all Just Works.

**Avoid error-prone and surprising constructs**: Complex features often have subtle pitfalls not obvious at first glance. Using these features without thoroughly understanding their complexities makes it easy to misuse them and introduce bugs. 

**Concede to practicalities**: Some of the rules in our style guides will encounter cases that warrant exceptions, and that’s OK. 

#### The Style Guide

Google's style guides also include limitations on new and not-yet-well-understood language features. For these new features, at the outset, we are sometimes not sure of the proper guidance to give. The goal is to preemptively install safety fences around a feature’s potential pitfalls while we all go through the learning process. At the same time, before everyone takes off running, limiting use gives us a chance to watch the usage patterns that develop and extract best practices from the examples we observe. As adoption spreads, engineers wanting to use the new features in different ways discuss their examples with the style guide owners, asking for allowances to permit additional use cases beyond those covered by the initial restrictions. Watching the waiver requests that come in, we get a sense of how the feature is getting used and eventually collect enough examples to generalize good practice from bad. After we have that information, we can circle back to the restrictive ruling and amend it to allow wider use.

### Changing the Rules

If a rule is causing engineers to invest effort to circumvent it, we might need to reexamine the benefits the rule was supposed to provide. Noticing when a rule is ready for another look is an important part of the process that keeps our rule set relevant and up to date. 
Documenting the reasoning behind a given decision gives us the advantage of being able to recognize when things need to change. With influencing factors clearly noted, we are able to identify when changes related to one or more of these factors warrant reevaluating the rule.

### The Process

Proposals for style guide updates are framed with this view, identifying an existing problem and presenting the proposed change as a way to fix it. “Problems,” in this process are proven with patterns found in existing code. Given a demonstrated problem, because we have the detailed reasoning behind the existing style guide decision, we can reevaluate, checking whether a differ‐ ent conclusion now makes more sense.

At Google, most changes to our style guides begin with community discussion. In fact, the C++ style arbiter group currently consists of four members. This might seem strange: having an odd number of committee members would prevent tied votes in case of a split decision. However, because of the nature of the decision making approach, where nothing is “because I think it should be this way” and everything is an evaluation of trade-off, decisions are made by consensus rather than by voting. The four-member group is happily functional as-is.

### Applying the Rules

Automated rule enforcement ensures that rules are not dropped or forgotten as time passes or as an organization scales up. An engineer checking for rule compliance depends on either memory or documentation, both of which can fail. As long as our tooling stays up to date, in sync with our rule changes, we know that our rules are being applied by all our engineers for all our projects.

Many rules covering language usage can be enforced with static analysis tools. 
Error checking tools take a set of rules or patterns and verify that a given code sample fully complies. Everybody must comply with the rules, so everybody uses the tools that check them.
Automated style checkers and formatters enforce consistent formatting within code. Everybody enforce use of these formatters with presubmit checks.



## Code Review

A well-designed code review process and a culture of taking code review seriously provides the following benefits:

* Checks code correctness 
* Ensures the code change is comprehensible to other engineers 
* Enforces consistency across the codebase 
* Psychologically promotes team ownership 
* Enables knowledge sharing 
* Provides a historical record of the code review itself

**Code correctness**
A reviewer shouldn’t propose alternatives because of personal opinion. Reviewers can propose alternatives, but only if they improve comprehension (by being less complex, for example) or functionality (by being more efficient, for example). In general, engineers are encouraged to approve changes that improve the codebase rather than wait for consensus on a more “perfect” solution. This focus tends to speed up code reviews.

**Comprehension of Code**
Unlike the deference reviewers should give authors regarding design decisions, it’s often useful to treat questions on code comprehension using the maxim “the customer is always right.” This doesn’t mean that you need to change your approach or your logic in response to the criticism, but it does mean that you might
need to explain it more clearly.

**Code Consistency**
A readability approver is tasked with reviewing code to ensure that it follows agreedon best practices for that particular programming language, is consistent with the codebase for that language within Google’s code repository, and avoids being overly complex. Having code that is consistent across the codebase improves comprehension for all of engineering, and this consistency even affects the process of code review itself. 

**Psychological and Cultural Benefits**
The code review process forces an author to not only let others have input, but to compromise for the sake of the greater good.  The code review process provides a mechanism to mitigate what might otherwise be an emotionally charged interaction. Code review, when it works best, provides not only a challenge to an engineer’s assumptions, but also does so in a prescribed, neutral manner, acting to temper any criticism which might otherwise be directed to the author if provided in an unsolicited manner. 
The process of initiating a code review also forces all authors to take a little extra care with their changes. Many software engineers are not perfectionists; most will admit that code that “gets the job done” is better than code that is perfect but that takes too long to develop. Without code review, it’s natural that many of us would cut corners, even with the full intention of correcting such defects later. 

**Knowledge Sharing**
Part of the code review process of feedback and confirmation involves asking ques‐ tions on why the change is done in a particular way. This exchange of information facilitates knowledge sharing. 

### Code Review Best Practices

In general, reviewers should defer to authors on particular approaches and only point out alternatives if the author’s approach is deficient. Reviewers should be careful about jumping to conclusions based on a code author’s particular approach. It’s better to ask questions on why something was done the way it was before assuming that approach is wrong.

To write code for peers. Remember that part of the responsibility of an author is to make sure this code is understandable and maintainable for the future. 

If you disagree with a reviewer’s comment, let them know, and let them know why and don’t mark a comment as resolved until each side has had a chance to offer alternatives. One common way is to offer an alternative and ask the reviewer to PTAL(please take another look). Remember that code review is a learning opportunity for both the reviewer and the author.

The first line of change description should be a summary of the entire change. And the description should still go into detail on what is being changed and why. A description of “Bug fix” is not helpful to a reviewer or a future code archeologist. 

### Types of Code Reviews

* Greenfield reviews and new feature development 
* Behavioral changes, improvements, and optimizations 
* Bug fixes and rollbacks 
* Refactorings and large-scale changes

**Greenfiedl Code Reviews**:
A greenfield review should ensure that an API matches an agreed design and is tested fully, with all API endpoints having some form of unit test, and that those tests fail when the code’s assumptions change.    

Of course, the introduction of entirely new code should not come as a surprise. 
A code review is not the time to debate design decisions already made in the past.    

**Bug fixes and rollbacks**:
At Google, we’ve seen developers start to depend on new code very quickly after it is submitted, and rollbacks sometimes break these developers as a result.



## Documentation

### What Qualifies as Documentation?

When we refer to “documentation,” we’re talking about every supplemental text that an engineer needs to write to do their job: not only standalone documents, but code comments as well.

### Why Is Documentation Needed

Unlike testing, which quickly provides benefits to a programmer, documentation generally requires more effort up front and doesn’t provide clear benefits to an author until later. But, like investments in testing, the investment made in documentation will pay for itself over time. After all, you might write a document only once, but it will be read hundreds, perhaps thousands of times afterward; its initial cost is amortized across all the future readers. Documentation should help answer questions like these:

* Why were these design decisions made?
* Why did we implement this code in this manner?
* Why did I implement this code in this manner, if you’re looking at your own code two years later?

Even to the writer, documentation provides the following benefits:

* Often, the writing of the documentation itself leads engineers to reevaluate design decisions that otherwise wouldn’t be questioned. If you can’t explain it and can’t define it, you probably haven’t designed it well enough.
* Tricks in code should be avoided, in any case, but good comments help out a great deal when you’re staring at code you wrote two years ago, trying to figure out what’s wrong.

### Documentation Is Like Code

Documentation should be no different: it’s a tool, written in a different language (usually English) to accomplish a particular task. Like a programming language, it has rules, a particular syntax, and style decisions, often to accomplish a similar purpose as that within code: enforce consistency, improve clarity, and avoid (comprehension) errors. Within technical documentation, grammar is important not because one needs rules, but to standardize the voice and avoid confusing or distracting the reader. 
Of course, documents with different owners can still conflict with one another (like most code style conflict). In those cases (also like most code style conflict), it is important to designate canonical documentation: determine the primary source and consolidate other associated documents into that primary source (or deprecate the duplicates). 
One other way to promote canonical documents is to associate them directly with the code they document by placing them directly under source control and alongside the source code itself.

The more engineers treat documentation as “one of ” the necessary tasks of software development, the less they will resent the upfront costs of writing, and the more they will reap the long-term benefits.

> #### Case Study: The Google Wiki
>
> When Google was much smaller and leaner, it had few technical writers. The easiest way to share information was through our own internal wiki (GooWiki). But as Google scaled, problems with a wiki-style approach became apparent.
> There were no true owners for documents, many became obsolete, only a few of which seemed to be maintained, and most were specific to certain teams with certain permissions and assumptions.
> The people who could fix the documents were not the people who used them. New users discovering bad documents either couldn’t confirm that the documents were wrong or didn’t have an easy way to report errors.
> The way to improve the situation was to move important documentation under the same sort of source control that was being used to track code changes. Documents began to have their own owners.

### Know Your Audience

One of the most important mistakes that engineers make when writing documentation is to write only for themselves. Think about writing like you do about testing or any other process you need to do as an engineer. Write to your audience, in the voice and style that they expect. 

#### Types of Audiences

In some cases, different audiences require different writing styles, but in most cases, the trick is to write in a way that applies as broadly to your different audience groups as possible. Write descriptively enough to explain complex topics to people unfamiliar with the topic, but don’t lose or annoy experts. Writing a short document often requires you to write a longer one (getting all the information down) and then doing an edit pass, removing duplicate information where you can.
Another important audience distinction is based on how a user encounters a document:

* Seekers are engineers who know what they want and want to know if what they are looking at fits the bill. 
* Stumblers might not know exactly what they want. They might have only a vague idea of how to implement what they are working with.

It’s also useful to identify when a doc is not appropriate for an audience. A lot of documents at Google begin with a “TL;DR statement” such as “TL;DR: if you are not interested in C++ compilers at Google, you can stop reading now.”

### Documentation Types

Design documents, code comments, how-to documents, project pages, and more. These all count as “documentation.” Make sure your document has a singular purpose, and if adding something to that page doesn’t make sense, you probably want to find, or even create, another document for that purpose.

#### Reference Documentation

Reference documentation should be single-sourced as much as possible. Most reference documentation, even when provided as separate documentation from the code, is generated from comments within the codebase itself.
The key win for seekers(who know what they want) is a consistently commented codebase so that they can quickly scan an API and find what they are looking for. The key win for stumblers(who don’t know what they want) is clearly identifying the purpose of an API, often at the top of a file header.

**File comments**
Generally, a file comment should begin with an outline of what’s contained in the code you are reading.(Any API that cannot be succinctly described in the first paragraph or two is usually the sign of an API that is not well thought out.)

```
// -----------------------------------------------------------------------------
// str_cat.h
// -----------------------------------------------------------------------------
//
// This header file contains functions for efficiently concatenating and appending
// strings: StrCat() and StrAppend(). Most of the work within these routines is
// actually handled through use of a special AlphaNum type, which was designed
// to be used as a parameter type that efficiently manages conversion to
// strings and avoids copies in the above operations.
```

**Class comments**
Generally, class com‐ ments should be “nouned” with documentation emphasizing their object aspect. That is, say, “The Foo class contains x, y, z, allows you to do Bar, and has the following Baz aspects,” and so on.

```
// -----------------------------------------------------------------------------
// AlphaNum
// -----------------------------------------------------------------------------
//
// The AlphaNum class acts as the main parameter type for StrCat() and
// StrAppend(), providing efficient conversion of numeric, boolean, and
// hexadecimal values (through the Hex type) into strings.
```

**Function comments**
Function comments should stress the active nature of their use, beginning with an indicative verb describing what the function does and what is returned.

```
// StrCat()
//
// Merges the given strings or numbers, using no delimiter(s),
// returning the merged result as a string.
```

#### Design Docs

The development of a design document is one of the first processes an engi‐ neer undertakes before deploying a new system. A good design document should cover the goals of the design, its implementation strategy, and propose key design decisions with an emphasis on their individual trade-offs.

#### Tutorials

Every software engineer, when they join a new team, will want to get up to speed as quickly as possible. 
Often, the best time to write a tutorial, if one does not yet exist, is when you first join a team. Get a notepad to take notes, and write down everything you need to do along the way; try not to assume any particular setup, permissions, or domain knowledge(or state that clearly in the beginning of the tutorial as a set of prerequisites.).

**Example: A bad tutorial** 

1. Download the package from our server at http://example.com 
2. Copy the shell script to your home directory 
3. Execute the shell script 
4. The foobar system will communicate with the authentication system 
5. Once authenticated, foobar will bootstrap a new database named “baz” 
6. Test “baz” by executing a SQL command on the command line 
7. Type: CREATE DATABASE my_foobar_db;

Steps 4 and 5 happen on the server end. It’s unclear whether the user needs to do anything(but actually they don’t), so those side effects can be mentioned as part of step 3. As well, it’s unclear whether step 6 and step 7 are different. (Actually they aren’t.) Combine all atomic user operations into single steps so that the user knows they need to do something at each step in the process.

**Example: A bad tutorial made better** 

1. Download the package from our server at http://example.com: 
   ```bash
   $ curl -I http://example.com 
   ```

2. Copy the shell script to your home directory: 
   ```bash
   $ cp foobar.sh 
   ```

3. Execute the shell script in your home directory:
   ```bash
   $ cd ~; foobar.sh
   ```

   The foobar system will first communicate with the authentication system. Once authenticated, foobar will bootstrap a new database named “baz” and open an input shell.

4. Test “baz” by executing a SQL command on the command line:
   ```bash
   baz:$ CREATE DATABASE my_foobar_db;
   ```

#### Conceptual Documentation

One problem engineers face when writing conceptual documentation is that it often cannot be embedded directly within the source code because there isn’t a canonical location to place it. The only logical place to document such complex behavior is through a separate conceptual document. (The package comments provided by godoc in the Go allow to write conceptual documents very well. Such as [doc.go](https://go.dev/src/pkg/encoding/gob/doc.go))

### Documentation Philosophy

#### Deprecating Documents

When a document no longer serves any purpose, either remove it or identify it as obsolete (and, if available, indicate where to go for new information). 
At Google, documents note the last time a document was reviewed.



## Testing Overview

Teams with good tests can review and accept changes to their project with confidence because all important behaviors of their project are continuously verified. 

We define a "flaky" test result as a test that exhibits both a passing and a failing result with the same code. If test flakiness continues to grow, team will experience a loss of confidence in the tests. After that happens, engi‐ neers will stop reacting to test failures, eliminating any value the test suite provided.

Tests should assume as little as possible about the outside environment.(Such as the order in which the tests are run;  should not rely on a shared database).
“a test should be obvious upon inspection.” Because there are no tests for the tests themselves, they are often revisited only when something breaks and require manual review as an important check on correctness. So so make sure you write the test you’d like to read!

There are two distinct dimensions for every test case: size and scope. Size refers to the resources that are required to run a test case: things like memory, processes, and time. Scope refers to the specific code paths we are verifying. 

### Designing a Test Suite

To recap, size refers to the resources consumed by a test and what it is allowed to do, and scope refers to how much code a test is intended to validate.

#### Test Size

A test’s size is determined not by its number of lines of code, but by how it runs, what it is allowed to do, and how many resources it consumes. In brief, small tests run in a single process, medium tests run on a single machine, and large tests run wherever they want.

**Small tests:** The primary constraint is that small tests must run in a single shread. This means that you can’t run a server and have a separate test process connect to it. And they aren’t allowed to sleep, perform I/O operations, and access the network or disk. All this is to make sure the tests can effectively run as fast as the CPU can handle.
**Medium tests:** It can span multiple processes, use threads, and can make blocking calls, including network calls, to localhost(but aren’t allowed to make network calls to any system which isn’t something we can guarantee in general). 
**Large tests:** Large tests remove the localhost restriction. Teams at Google will frequently isolate their large tests from their small or medium tests, running them only during the build and release process so as not to impact developer workflow.

#### Test Scope

**Narrow-scoped tests:** Commonly called “unit tests”, are designed to focus an individual class or method.
**Medium-scoped tests:** Commonly called integration tests, are designed to verify interactions between a small number of components; It’s possible to write a business logic.
**Large-scoped tests:** Commonly referred to by names like functional tests, end-to-end tests, or system tests, are designed to validate the interaction of several distinct parts of the system.

Google recommended mix of tests is determined by our two primary goals: engineering productivity and product confidence. When considering your own mix, you might want a different balance.

#### The Beyoncé Rule

“If you liked it, then you shoulda put a test on it.” The Beyoncé Rule is often invoked by infrastructure teams that are responsible for making changes across the entire codebase. If unrelated infrastructure changes pass all of your tests but still break your team’s product, you are on the hook for fixing it and adding the additional tests.

#### A Note on Code Coverage

Code coverage is often held up as the gold standard metric for understanding test quality, and that is somewhat unfortunate. It is possible to exercise a lot of lines of code with a few tests, never checking that each line is doing anything useful. That’s because code coverage only measures that a line was invoked, not what happened as a result. 
It is common for teams to establish a bar for expected code coverage—for instance, 80%. At first, that sounds eminently reason‐ able; surely you want to have at least that much coverage. In practice, what happens is that instead of treating 80% like a floor, engineers treat it like a ceiling. Soon, changes begin landing with no more than 80% coverage. After all, why do more work than the metric requires? 
A better way to approach the quality of your test suite is to think about the behaviors that are tested.

### Testing at Google Scale

#### The Pitfalls of a Large Test Suite

Brittle tests—those that over-specify expected outcomes or rely on extensive and complicated boilerplate—can actually resist change. These poorly written tests can fail even when unrelated changes are made(Brittle tests usually appear in an abuse of mocking frameworks). 
If a test suite is causing more harm than good, eventually engineers will find a way to get their job done, tests or no tests.

### History of Testing at Google

#### Orientation Classes

The pioneers of automated testing at Google knew that at the rate the company was growing, new engineers would quickly outnumber existing team members. If they could reach all the new hires in the company, it could be an extremely effective avenue for introducing cultural change. 
The new hires had no idea that they were being used as trojan horses to sneak this idea into their unsuspecting teams. As Nooglers joined their teams following orientation, they began writing tests and questioning those on the team who didn’t.

#### Testing on the Toilet

The goal of TotT was fairly simple: actively raise awareness about testing across the entire company. The Testing Grouplet considered the idea of a regular email newsletter, but given the heavy volume of email everyone deals with at Google, it was likely to become lost in the noise. But the bathroom is one place that everyone must visit at least once each day, no matter what. 
To say the reaction was polarized is an understatement; some saw it as an invasion of personal space, and they objected strongly. Mailing lists lit up with complaints, but the TotT creators were content: the people complaining were still talking about testing.
A good TotT episode contains something an engineer can take back to the desk immediately and try. 

### The Limits of Automated Testing

Automated testing is not suitable for all testing tasks. For example, testing the quality of search results often involves human judgment. 
Exploratory Testing does not apply either. Exploratory Testing is a fundamentally creative endeavor in which someone treats the application under test as a puzzle to be broken, maybe by executing an unexpected set of steps or by inserting unexpected data. 



## Unit Testing

Compared to broader-scoped tests, unit tests have many properties that make them an excellent way to optimize productivity:

* They can serve as documentation and examples, showing engineers how to use the part of the system being tested and how that system is intended to work.

### The Importance of Maintainability

Imagine this scenario: 

> Mary wants to add a simple new feature to the product. Perhaps requiring only a couple dozen lines of code. But when she goes to check in her change, she gets a screen full of errors back from the automated testing system. 
> She spends the rest of the day going through those failures one by one. In each case, the change introduced no actual bug, but broke some of the assumptions that the test made about the internal structure of the code, requiring those tests to be updated. 
> Often, she has difficulty figuring out what the tests were trying to do in the first place, and the hacks she adds to fix them make those tests even more difficult to understand in the future. Ultimately, what should have been a quick job ends up taking hours or even days of busywork.

Here, testing had the opposite of its intended effect by draining productivity rather than improving it while not meaningfully increasing the quality of the code under test. The problems Mary ran into weren’t her fault, and there was nothing she could have done to avoid them: bad tests must be fixed before they are checked in, lest they impose a drag on future engineers.  
Broadly speaking, the issues she encountered fall into two categories. First, the tests she was working with were brittle: they broke in response to a harmless and unrelated change that introduced no real bugs. Second, the tests were unclear: after they were failing, it was difficult to determine what was wrong, how to fix it, and what those tests were supposed to be doing in the first place.

### Preventing Brittle Tests

A brittle test is one that fails in the face of an unrelated change to production code that does not introduce any real bugs. Such tests must be diagnosed and fixed by engineers as part of their work. If a team regularly writes brittle tests, test maintenance will inevitably consume a larger and larger proportion of the team’s time as they are forced to comb through an increasing number of failures in an ever-growing test suite.

#### Strive for Unchanging Tests

The ideal test is unchanging: after it’s written, it never needs to change unless the requirements of the system under test change. Fundamentally, there are four kinds of changes and we should expect tests to respond to:

* *Pure refactorings:* The system’s tests shouldn’t need to change. 
* *New features:* The engineer must write new tests to cover the new behaviors, but they shouldn’t need to change any existing tests.
* *Bug fixes:* The bug fix should include that missing test case. Typically shouldn’t require updates to existing tests .
* *Behavior changes:* Note that such changes tend to be significantly more expensive than the other three types. It's the one case when we expect to have to make updates to the system’s existing tests.

#### Test via Public APIs

Consider follows example, which validates a transaction and saves it to a database.

```java
public void processTransaction(Transaction transaction) {
    if (isValid(transaction)) {
        saveToDatabase(transaction);
    }
}
private boolean isValid(Transaction t) {
    return t.getAmount() < t.getSender().getBalance();
}
private void saveToDatabase(Transaction t) {
    String s = t.getSender() + "," + t.getRecipient() + "," + t.getAmount();
    database.put(t.getId(), s);
}
public void setAccountBalance(String accountName, int balance) {
    // Write the balance to the database directly
}
public void getAccountBalance(String accountName) {
    // Read transactions from the database to determine the account balance
}
```

A tempting way to test this code would be to remove the “private” visibility modifiers and test the implementation logic directly, as follows:

```java
@Test
public void emptyAccountShouldNotBeValid() {
    assertThat(processor.isValid(newTransaction().setSender(EMPTY_ACCOUNT)))
        .isFalse();
}
@Test
public void shouldSaveSerializedData() {
    processor.saveToDatabase(newTransaction()
        .setId(123)
        .setSender("me")
        .setRecipient("you")
        .setAmount(100));
    assertThat(database.get(123)).isEqualTo("me,you,100");
}
```

This test is brittle. It interacts with the transaction processor in a much different way than its real users would: it peers into the system’s internal state and calls methods that aren’t publicly exposed as part of the system’s API. And almost any refactoring of the system under test would cause the test to break(such as renaming its methods, factoring them out into a helper class, or changing the serialization format), even if such a change would be invisible to the class’s real users. 
Instead, the same test coverage can be achieved by testing only against the class’s pub‐ lic API, as follows:

```java
@Test
public void shouldTransferFunds() {
    processor.setAccountBalance("me", 150);
    processor.setAccountBalance("you", 20);
    processor.processTransaction(newTransaction()
        .setSender("me")
        .setRecipient("you")
        .setAmount(100));
    assertThat(processor.getAccountBalance("me")).isEqualTo(50);
    assertThat(processor.getAccountBalance("you")).isEqualTo(120);
}
@Test
public void shouldNotPerformInvalidTransactions() {
    processor.setAccountBalance("me", 50);
    processor.setAccountBalance("you", 20);
    processor.processTransaction(newTransaction()
        .setSender("me")
        .setRecipient("you")
        .setAmount(100));
    assertThat(processor.getAccountBalance("me")).isEqualTo(50);
    assertThat(processor.getAccountBalance("you")).isEqualTo(20);
}
```

Such tests are more realistic and less brittle because they form explicit contracts: if such a test breaks, it implies that an existing user of the system will also be broken. Testing only these contracts means that you’re free to do whatever internal refactoring of the system you want without having to worry about making tedious changes to tests. 

It’s not always clear what constitutes a “public API,” and the question really gets to the heart of what a “unit” is in unit testing. **Units can be as small as an individual function or as broad as a set of several related packages/modules.** When we say “public API” in this context, we’re really talking about the API exposed by that unit to third parties outside of the team that owns the code(This doesn’t align with the notion of visibility provided by some programming languages; Such as implicit and explicit in Go). 

Defining an appropriate scope for a unit and hence what should be considered the public API is more art than science, but here are some rules of thumb:

* If a method or class exists only to support one or two other classes (i.e., it is a “helper class”), it probably shouldn’t be considered its own unit, and its function‐ ality should be tested through those classes instead of directly.
* If a package or class is designed to be accessible by anyone without having to consult with its owners, it almost certainly constitutes a unit that should be tested directly, where its tests access the unit in the same way that the users would.
* If a package or class can be accessed only by the people who own it, but it is designed to provide a general piece of functionality useful in a range of contexts (i.e., it is a “middleware”), it should also be considered a unit and tested directly. Without this unit test, a gap in test coverage could be introduced if one of the library’s users (and its tests) were ever removed.

At Google, we’ve found that engineers sometimes need to be persuaded that testing via public APIs is better than testing against implementation details. The reluctance is understandable because it’s often much easier to write tests focused on the piece of code you just wrote rather than figuring out how that code affects the system as a whole. Nevertheless, it valuable to encourage such practices, as the extra upfront effort pays for itself many times over in reduced maintenance burden. Testing against public APIs make ensure that your tests fail only in the event of meaningful changes to your system.

#### Test State, Not Interactions

 In general, there are two ways to verify that a system under test behaves as expected. *With state testing*, you observe the system itself to see what it looks like after invoking with it(Such as test a function with a success return). *With interaction testing*, you instead check that the system took an expected sequence of actions on its collaborators in response to invoking it(Such as test a function return different errors). 
Interaction tests tend to be more brittle than state tests for the same reason that it’s more brittle to test a private method than to test a public method: interaction tests check *how* a system arrived at its result, whereas usually you should care only *what* the result is. For example: 

```java
@Test
public void shouldWriteToDatabase() {
    accounts.createUser("foobar");
  
    // just verify is database put 'foobar' into storage
    verify(database).put("foobar"); 
}
```

There are a couple different ways it could go wrong:

* If a bug in the system under test causes the record to be deleted from the data‐ base shortly after it was written, the test will pass even though we would have wanted it to fail.
* If the system under test is refactored to call a slightly different API to write an equivalent record, the test will fail even though we would have wanted it to pass.

It’s much less brittle to directly test against the state of the system, as demonstrated in follows:

```java
@Test
public void shouldCreateUsers() {
    accounts.createUser("foobar");
    assertThat(accounts.getUser("foobar")).isNotNull();
}
```

The most common reason for problematic interaction tests is an over reliance on mocking frameworks. We tend to prefer the use of real objects in favor of mocked objects, as long as the real objects are fast and deterministic.

### Writing Clear Tests

Failure is a good thing—test failures provide useful signals to engineers, and are one of the main ways that a unit test provides value. Test failures happen for one of two reasons:

* The system under test has a problem or is incomplete. This is exactly what tests are designed for. 
* The test itself is flawed, this means that the test is brittle. 

When a test fails, an engineer’s first job is to identify which of these cases the failure falls into and then to diagnose the actual problem. A clear test is one whose purpose for existing and reason for failing is immediately clear to the engineer diagnosing a failure. 
As code database, it’s entirely possible that a failing test might have been written years ago by an engineer no longer on the team, leaving no way to figure out its purpose. In the worst case, these obscure tests just end up getting deleted when engineers can’t figure out how to fix them. It indicates that the test has been providing zero value for perhaps the entire period it has existed (which could have been years).

#### Make Your Tests Complete and Concise

