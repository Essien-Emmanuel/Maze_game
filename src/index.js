const { World, Engine, Runner, Render, Bodies, MouseConstraint, Mouse } = Matter;

const engine = Engine.create();
const { world } = engine;

const worldWidth = 800;
const worldHeight = 600;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: worldWidth,
    height: worldHeight
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

World.add(world, MouseConstraint.create(engine, {
  mouse: Mouse.create(render.canvas)
}))

// Walls
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true}),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true}),
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true}),
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true}),
];

World.add(world, walls);

// random 20 circle and rectangle shapes

for (let i = 0; i < 70; i++) {
  const randomWidth = Math.random() * worldWidth;
  const randomHeight = Math.random() * worldHeight;
  
  if (Math.random() > 0.5) {

    World.add(world, Bodies.rectangle(randomWidth, randomHeight, 50, 50))
  
  } else {
  
    World.add(world, Bodies.circle(randomWidth, randomHeight, 35, {
      render: {
        fillStyle: 'green'
      }
    }))
  
  }
}
