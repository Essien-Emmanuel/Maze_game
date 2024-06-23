const { World, Engine, Runner, Render, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;

const cells = 3;
const width = 600;
const height = 600;
const halfWidth = width / 2;
const halfHeight = height / 2;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    // wireframes: false,
    width: width,
    height: height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(halfWidth, 0, width, 40, { isStatic: true}),
  Bodies.rectangle(halfWidth, height, width, 40, { isStatic: true}),
  Bodies.rectangle(0, halfHeight, 40, height, { isStatic: true}),
  Bodies.rectangle(width, halfHeight, 40, height, { isStatic: true}),
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

const stepThroughCells = (row, column) => {
  // if cell at [row, column] visited, return true
  if (grid[row][column]) return

  // Mark cell visited, that is to true
  grid[row][column] = true;

  // Assemble randomly-ordered list of Neighbors
  const upNeighbor = [row - 1, column, 'up'];
  const downNeighbor = [row + 1, column, 'down'];
  const leftNeighbor = [row, column - 1, 'left'];
  const rightNeighbor = [row, column + 1, 'right'];

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
    if (grid[nextRow][nextColumn]) return;

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

    stepThroughCells(nextRow, nextColumn)
  }

  // Visit that next cell
}
stepThroughCells(startRow, startColumn)