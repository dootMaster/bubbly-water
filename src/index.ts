import { Engine, Render, Runner, World, Events, Body } from 'matter-js'
import { pointA, pointB, line, updateLine } from './components/bar'
import { updateMovement } from './components/controls'
import { THE_BALL, ballCollisionBody } from './components/ball'
import {
  createNonOverlappingHoles,
  holes,
  randomGoal,
} from './components/holes'

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
World.add(engine.world, [...holes, THE_BALL])
let goalId = randomGoal(engine)

Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    // console.log('Collision pair:', pair.bodyA, pair.bodyB)
    if (
      (pair.bodyA === ballCollisionBody && pair.bodyB.id === goalId) ||
      (pair.bodyA.id === goalId && pair.bodyB === ballCollisionBody)
    ) {
      console.log('Goal reached!')
      RESET()
      goalId = randomGoal(engine)
    }

    // if (pair.bodyA === compositeBall && pair.bodyB === deathHole) {
    //   console.log('Goal reached!')
    //   // Reset ball or trigger win event
    // }
  })
})

function resetHelper(body: Body, x: number, y: number): void {
  Body.setPosition(body, { x, y })
  Body.setVelocity(body, { x: 0, y: 0 })
}

function RESET() {
  console.log('reset')
  resetHelper(pointA, 0, screenHeight - 50)
  resetHelper(pointB, screenWidth, screenHeight - 50)
  updateLine(engine)
  resetHelper(THE_BALL, screenWidth / 2, screenHeight - 60)
}

function gameLoop(): void {
  updateMovement()
  updateLine(engine)
  Engine.update(engine)
  requestAnimationFrame(gameLoop)
}

gameLoop()
