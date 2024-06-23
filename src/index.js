const { World, Engine, Runner, Render, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;

const cells = 3;
const width = 600;
const height = 600;
const halfWidth = width / 2;
const halfHeight = height / 2;

const unitLength = width / cells;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
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

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false))

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);

const startColumn = Math.floor(Math.random() * cells);

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
    if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) continue;

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

    const x = (columnIndex * unitLength) + (unitLength / 2);
    const y = (rowIndex * unitLength) + unitLength;
    const wallWidth = unitLength;
    const wallHeight = wallThickness;

    const wall = Bodies.rectangle(x, y, wallWidth, wallHeight, {
      isStatic: true
    });

    World.add(world, wall)
  });
});

//vertical walls
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const x = (columnIndex * unitLength) + unitLength;
    const y = (rowIndex * unitLength) + (unitLength / 2);
    const wallWidth = wallThickness;
    const wallHeight = unitLength;
    
    const wall = Bodies.rectangle(x, y, wallWidth, wallHeight, {
      isStatic: true
    });

    World.add(world, wall);
  });
});


// Goal

const x = width - (unitLength / 2);
const y = height - (unitLength / 2);
const goalWidth = unitLength * 0.7;
const goalHeight = unitLength * 0.7;

const goal = Bodies.rectangle(x, y, goalWidth, goalHeight, {
  isStatic: true,
  fillStyle: 'green'
});

World.add(world, goal);


// Ball

const ball = Bodies.circle(unitLength / 2, unitLength /2, unitLength / 4,);
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
  if (event.key === 'w') {
    console.log('move ball up');
  } else if (event.key === 'd') {
    console.log('move ball right');
  } else if (event.key === 's') {
    console.log('move ball down');
  } else if (event.key === 'a') {
    console.log('move ball left')
  }
});