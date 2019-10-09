MORE VOLTAAAAGE!
=================

[@franchizzles](https://www.github.com/franchizzle) were watching the Slow Mo Guys on YouTube last night when
we came across lightning at a high frame-per-second. We talked about the behaviour of the tendrils and the final bolt,
and then naturally the conversation turned into how we could recreate it.

## How does lightning work?

I'm no expert, but going by the Slo Mo Guys video, it seems to originate from 1 to _x_ points with small tendrils of electricity.
Each tendril moves down towards the earth at a random angle _y_, traveling _n_ distance before splitting into _z_ new tendrils.
Each of these new tendrils travels at a random angle towards the ground and the pattern continues.

Once a tendril reaches the ground, a lightning bolt will follow the shortest path down to that point, and the process starts over.

## Working with HTML Canvas

To make the simplest demo for the sake of time, I will use the drawing library [PaperJS](http://paperjs.org/) to bootstrap some of the angle math and vector line work.

The logic of the app will work like this:  
- decide how many tendrils to begin with, and randomly place them along the visible x axis where y = 0
- for each tendril, choose a random angle between 100 and 250 degrees and draw a line [_n_] units along that vector.
- check to see if any tendril has "reached the earth"- or the end of the tendril's y value is greater than the canvas height
- if the ground has not been reached, repeat the second and step
- if the ground has been reached, draw a new line starting from the top and going down the tendrils until the end point is reached
- erase all of the tendrils, then the bold, and start over

There are many ways to make this work, but we are going to need a somewhat sophisticated means for keeping track of the heirarchy of the bolt. For this reason,
we will store all of the tendrils as objects in an arrays, where each tendril has it's a reference to it's parent and children by ID's.

If we build it this way, once the final tendril reaches the "ground", we can easily trace the line back to the top to draw the resulting bolt

## UI

We need sliders to control the length of each tendril, the time it takes for each new tendril set to appear, and the starting number of tendrils.
We need a button to initiate a lightning strike, that is inactive while a strike is being generated
