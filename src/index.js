const { World, Engine, Runner, Render, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;

const cells = 5;
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

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false))

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);

const startColumn = Math.floor(Math.random() * cells);

const stepThroughCells = (row, column) => {

}
stepThroughCells(startRow, startColumn)