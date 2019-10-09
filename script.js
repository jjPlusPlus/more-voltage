/*
  global paper

  ES5 vanilla javascript, nothing fancy
  listen for the button to trigger the lightning strike
  uses a (shameful) mutable global variable to store the state of the array
  start function

  reset function clears out the canvas and the tendrils array
*/

let tendrils = [];

// control defaults
let speed = 5;
let initialTendrils = 1;
let maxTendrilLength = 40;
let minTendrilLength = 10;
let maxTendrilAngle = 90;
let minTendrilAngle = 45;
let divisions = 2;

let interval;

const generateLightning = () => {
  const viewWidth = paper.view.bounds.width;
  const viewHeight = paper.view.bounds.height;
  let tendril;
  let childID;

  for (var i = 0; i < initialTendrils; i++) {
    // UUID definitely not perfect, but good enough for now
    const tendrilBaseX = Math.floor(Math.random() * (viewWidth - 100) + 50);
    childID = Date.now() + Math.floor( Math.random() * 50000 );

    tendril = {
      id: childID,
      x: tendrilBaseX,
      y: 0,
      vector: null,
      parent: null,
      children: []
    }
    tendrils.push(tendril);
    generateTendrils(tendril);
  }

  interval = setInterval(() => {
    const hasReachedBottom = tendrils.filter(t => {
      return t.vector && t.vector.y >= viewHeight;
    });

    if (hasReachedBottom.length) {
      clearInterval(interval);
      groundStrike(hasReachedBottom);
    } else {
      // for each of the leaf nodes, we want to generate new children
      console.log('still going');
      const leafNodes = tendrils.filter(t => {
        return t.children.length === 0;
      });

      leafNodes.forEach(node => {
        generateTendrils(node);
      })
    }
  }, 100);
}

const groundStrike = (winner) => {
  console.log('groundstrike!');

  // go through ALL of the tendrils, and darken them
  tendrils.forEach((t) => {
    if (t.path) {
      t.path.strokeColor = '#3c80ad';
      t.path.shadowColor = new paper.Color(0, 0, 0);
      t.path.shadowBlur = 15;
    }
  })

  // take only the first winner (doesn't matter which really), since many can get to the bottom simultaneously
  winner = winner[0];
  createBolt(winner.path);

  let fetchHeirarchy = true;
  let branch = [];
  let next = tendrils.find((t) => t.id === winner.parent);

  createBolt(next.path);
  branch.push(winner);
  branch.push(next);

  while (fetchHeirarchy) {
    if (!next.parent) {
      if (next.path) {
        createBolt(next.path);
      }
      // parent was null- this is the root node
      fetchHeirarchy = false;
    } else {
      next = tendrils.find((t) => t.id === next.parent);
      if (next.path) {
        createBolt(next.path);
      }
    }
  }

  // flash the background
  document.getElementById('atmosphere').classList.add('flash');
  document.getElementById('title').classList.add('colorFlash');

  document.getElementById('strike').disabled = false;
}


/* CREATE BOLT
 * Draws a segment the final bolt by cloning the original tendrils
 * @param source: the original tendril that this segment will sit on top of
*/
const createBolt = (source) => {
  const clone = source.clone();

  clone.strokeWidth = 2;
  clone.strokeColor = 'white';
  clone.shadowColor = new paper.Color(100, 100, 100);
  clone.shadowBlur = 20;
  clone.shadowOffset = new paper.Point(0, 1);

  // This is the same as z-index for canvas
  clone.insertAbove(tendrils[tendrils.length - 1].path);

  return;
}

/* GENERATE TENDRILS
 * Based on a previous tendril, splits into several new tendrils
 * @param tendril: a 'root', the end of which these new tendrils will split off from
*/
const generateTendrils = (tendril) => {

  // the new starting point is the previous tendril's endpoint
  const startingPoint = new paper.Point(tendril.x, tendril.y);

  // overwrite these variables in the for loop instead of creating new ones each time
  let randomAngle, randomDistance, endingPoint, vector, child, childID;

  // divisions: the number of new tendrils that will split off of the parent/root
  for (var i = 0; i < Math.floor(Math.random() * divisions) + 1 ; i++) {

    // generate a random angle (int). Keep in mind that "down" is zero.
    // values of 90 & 45 for the control variables will create angles between -45 and 45
    randomAngle = Math.floor( Math.random() * maxTendrilAngle ) - minTendrilAngle;

    // generate a random length (int) between the min and max tendril length controls
    randomDistance = Math.floor( Math.random() * maxTendrilLength ) + minTendrilLength;

    // begin by cloning the start point and moving it down 50
    endingPoint = startingPoint.clone();
    endingPoint.y += randomDistance;

    // draw a path between start and end point
    var path = new paper.Path();
      path.strokeColor = "white";
      path.strokeCap = "butt"; // lmao
      path.strokeJoin = "bevel"; // round or bevel
      path.strokeWidth = 0.25;
      path.shadowColor = new paper.Color(255, 255, 255);
      path.shadowBlur = 12;
      path.shadowOffset = new paper.Point(1, 1);
      path.moveTo(startingPoint);
      path.lineTo(endingPoint);

    // rotate the path around the starting point by the random angle
    path.rotate(randomAngle, startingPoint);

    // save the child
    vector = { x: path.segments[1].point.x, y: path.segments[1].point.y };
    childID = Math.floor( Date.now() + Math.random() * 50000 );
    child = {
      id: childID,
      x: vector.x,
      y: vector.y,
      vector: vector,
      path: path,
      parent: tendril.id,
      children: []
    }

    tendrils.push(child);
    tendril.children.push(childID);
  }
}

window.onload = function() {
  // PaperJS boilerplate
  var canvas = document.getElementById('atmosphere');
  paper.setup(canvas);

  const strikeButton = document.getElementById('strike');
  strikeButton.addEventListener('click', event => {
    event.preventDefault();
    strikeButton.disabled = true;
    tendrils = [];
    document.getElementById('atmosphere').classList.remove('flash');
    document.getElementById('title').classList.remove('colorFlash');
    paper.project.clear();
    generateLightning();
  });

}
