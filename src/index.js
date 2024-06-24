const { World, Engine, Runner, Render, Bodies, Body, Events } = Matter;

const engine = Engine.create();
const { world } = engine;
engine.world.gravity.y = 0; //disable gravity in the y direction in the world

const cellsHorizontal = 14;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;
const halfWidth = width / 2;
const halfHeight = height / 2;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: width,
    height: height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(halfWidth, 0, width, 2, { isStatic: true}),
  Bodies.rectangle(halfWidth, height, width, 2, { isStatic: true}),
  Bodies.rectangle(0, halfHeight, 2, height, { isStatic: true}),
  Bodies.rectangle(width, halfHeight, 2, height, { isStatic: true}),
];

World.add(world, walls);

// Maze generation

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  
  return arr
}

/**
 *  side note: cellsVertical refers to the No of rows and cellsHorizontal refers to the No of column
 */
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false))

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);

const startColumn = Math.floor(Math.random() * cellsHorizontal);

// /**
//  * side note:: true in our matrix represents 'no wall'
//  */

const stepThroughCell = (row, column) => {
  // if cell at [row, column] visited, return true
  if (grid[row][column]) return
  
  // Mark cell visited, that is to true
  grid[row][column] = true;

  // Assemble randomly-ordered list of Neighbors
  const upNeighbor = [row - 1, column, 'up'];
  const rightNeighbor = [row, column + 1, 'right'];
  const downNeighbor = [row + 1, column, 'down'];
  const leftNeighbor = [row, column - 1, 'left'];

  const neighbors = shuffle([
    upNeighbor,
    rightNeighbor,
    downNeighbor,
    leftNeighbor
  ]);
  
  // for each neighbor

  for (const neighbor of neighbors) { 
    const [nextRow, nextColumn, direction] = neighbor;
    
    // check if neighbor is out of bound
    if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) continue;

    // if next neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) continue;

    // Remove a wall from horizontals or verticals array

    // For left and right walls (vertical arrays)
    if (direction === 'left') {
      verticals[row][column - 1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    }

    // For up and down walls (horizontal arrays)
    if (direction === 'up') {
      horizontals[row -1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }

    // Visit that next cell
    stepThroughCell(nextRow, nextColumn);
  }

}

stepThroughCell(startRow, startColumn);


// // Drawing to the canvas

const wallThickness = 5

// Horizontal walls
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const x = (columnIndex * unitLengthX) + (unitLengthX / 2);
    const y = (rowIndex * unitLengthY) + unitLengthY;
    const wallWidth = unitLengthX;
    const wallHeight = wallThickness;

    const wall = Bodies.rectangle(x, y, wallWidth, wallHeight, {
      label: 'wall',
      isStatic: true,
      render: {
        fillStyle: 'grey'
      }
    });

    World.add(world, wall)
  });
});

//vertical walls
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const x = (columnIndex * unitLengthX) + unitLengthX;
    const y = (rowIndex * unitLengthY) + (unitLengthY / 2);
    const wallWidth = wallThickness;
    const wallHeight = unitLengthY;
    
    const wall = Bodies.rectangle(x, y, wallWidth, wallHeight, {
      label: 'wall',
      isStatic: true,
      render: {
        fillStyle: 'grey'
      }
    });

    World.add(world, wall);
  });
});


// Goal

const x = width - (unitLengthX / 2);
const y = height - (unitLengthY / 2);
const goalWidth = unitLengthX * 0.7;
const goalHeight = unitLengthY * 0.7;

const goal = Bodies.rectangle(x, y, goalWidth, goalHeight, {
  label: 'goal',
  isStatic: true,
  render: {
    fillStyle: 'green'
  }
});

World.add(world, goal);


// Ball

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY /2, ballRadius, { 
  label: 'ball',
  render: {
    fillStyle: 'white'
  } 
});
World.add(world, ball);

// Key handling

/**
 *  Key codes
 *  w - 87
 *  d - 68
 *  s - 83
 *  a - 65
 */

document.addEventListener('keydown', event => {
  const { x, y} = ball.velocity;
  
  if (event.keyCode === 87) {
    Body.setVelocity(ball, { x, y: y - 5});
  } else if (event.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y: y});
  } else if (event.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 5});
  } else if (event.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y});
  }
});


// win condition

Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(collision => {
    const labels = ['goal', 'ball'];
    
    if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
      // display winner div
      document.querySelector('.winner').classList.remove('hidden');

      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === 'wall') {
          Body.setStatic(body, false)
        }
      })
    }
  })
})