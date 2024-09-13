import { Engine, Render, Runner, World, Events } from 'matter-js'
import { pointA, pointB, line, updateLine } from './components/bar'
import { updateMovement } from './components/controls'
import { THE_BALL, ballCollisionBody } from './components/ball'
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

Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    // console.log('Collision pair:', pair.bodyA, pair.bodyB)
    if (
      (pair.bodyA === ballCollisionBody && pair.bodyB === goalHole) ||
      (pair.bodyA === goalHole && pair.bodyB === ballCollisionBody)
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
  console.log('reset')
}

function gameLoop(): void {
  updateMovement()
  updateLine(engine)
  Engine.update(engine)
  requestAnimationFrame(gameLoop)
}

gameLoop()
