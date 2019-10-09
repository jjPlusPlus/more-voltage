MORE VOLTAAAAGE!
=================

[@franchizzles](https://www.github.com/franchizzle) were watching the Slow Mo Guys on YouTube last night when
we came across lightning at a high frame-per-second. We talked about the behavior of the tendrils and the final bolt,
and then naturally the conversation turned into how we could recreate it.

[![Link to the SloMoGuys video](https://img.youtube.com/vi/qQKhIK4pvYo/0.jpg)](https://www.youtube.com/watch?v=qQKhIK4pvYo?t=298)

## How does lightning work?

I'm no expert, but going by the Slo Mo Guys video, it seems to originate from 1 to _x_ points with small tendrils of electricity.
Each tendril moves down towards the earth at a random angle _y_, traveling _n_ distance before splitting into _z_ new tendrils.
Each of these new tendrils travels at a random angle towards the ground and the pattern continues.

Once a tendril reaches the ground, a lightning bolt will follow the shortest path down to that point, and the process starts over.

## Working with HTML Canvas via PaperJS

To make the simplest demo for the sake of time, I will use the drawing library [PaperJS](http://paperjs.org/) to bootstrap some of the angle math and vector line work.

The logic of the app will work like this:  
- begin with a single tendril, randomly placed along the visible x axis (with a buffer) where y = 0
- for each tendril, choose a random angle between [_a_] and [_b_] degrees and draw a line [_n_] units along that vector.
- check to see if any tendril has "reached the earth"- called a "groundstrike"- where the end of the tendril's y value is greater than the canvas height
- if the ground has not been reached, repeat the second and third steps
- for each tier of the "tree", prune any branches over a certain threshold for performance reasons
- if the ground has been reached, draw a new line starting from the top and going down the tendrils until the end point is reached
- erase all of the tendrils, then the bold, and start over

There are many ways to make this work, but I chose to use a global array for keeping track of the heirarchy of the bolt. For this reason,
all of the tendrils are stored as objects in the "tendrils" array, where each tendril has it's a reference to it's parent and children by ID's.

built this way, once the final tendril reaches the "ground", we can easily trace the line back to the top to draw the resulting final bolt

### A Note on Animation via PaperJS  
I was a little disappointed in the ability to animate the tendrils using PaperJS. Paper relies on a global onFrame handler to run animations; I think the most common use-case is to have all of the paper objects drawn on page initialization instead of procedurally at run-time. I would like to animate each tendril as it is drawn to more closely represent the lightning pattern, but until I figure out a way around this I'm stuck.

## UI
Simply a button to initiate a lightning strike, that is inactive while a strike is being generated.
I will be adding sliders to control:
 - the length of each tendril (min & max)
 - the angle of each tendril (min & max)
 - the maximum number of branches per level of the tree (pruning)
 - the number of new divisions that each tendril can have
 - the time it takes for each new tendril set to appear
