import { Engine, Render, Runner, World, Events } from 'matter-js'
import { pointA, pointB, line, updateLine } from './components/bar'
import { updateMovement } from './components/controls'
import { THE_BALL } from './components/ball'
import { createNonOverlappingHoles, goalHole, holes } from './components/holes'

const engine = Engine.create()
const world = engine.world

const screenHeight = 1000
const screenWidth = 800

const render = Render.create({
  element: document.body,
  canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
  engine: engine,
  options: {
    width: screenWidth,
    height: screenHeight,
    wireframes: false,
    background: '#f0f0f0',
  },
})

Render.run(render)
const runner = Runner.create()
Runner.run(runner, engine)
World.add(world, [pointA, pointB, line])
createNonOverlappingHoles()
World.add(engine.world, [...holes, goalHole, THE_BALL])
console.log(THE_BALL, goalHole)

Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    // console.log('Collision pair:', pair.bodyA.label, pair.bodyB.label)
    if (
      (pair.bodyA === THE_BALL && pair.bodyB === goalHole) ||
      (pair.bodyA === goalHole && pair.bodyB === THE_BALL)
    ) {
      console.log('Goal reached!')
      RESET() // Call your reset function or handle the goal logic
    }

    // if (pair.bodyA === compositeBall && pair.bodyB === deathHole) {
    //   console.log('Goal reached!')
    //   // Reset ball or trigger win event
    // }
  })
})

function RESET() {
  World.remove(world, [pointA, pointB, line, THE_BALL])
  World.add(world, [pointA, pointB, line, THE_BALL])
}

function gameLoop(): void {
  updateMovement()
  updateLine(engine)
  Engine.update(engine)
  requestAnimationFrame(gameLoop)
}

gameLoop()
