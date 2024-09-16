import { Engine, Render, Runner, World, Events, Body, Pair } from 'matter-js'
import { pointA, pointB, line, updateLine } from './components/bar'
import { updateMovement } from './components/controls'
import { THE_BALL, ballCollisionBody } from './components/ball'
import {
  createNonOverlappingHoles,
  generateRandomGoalIndexes,
  holes,
  randomGoal,
  randomSeededIndexes,
  deathHoleIds,
  resetGoalSequence,
} from './components/holes'
import { debouncedLog } from './components/utils/debouncedLog'

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

generateRandomGoalIndexes(randomSeededIndexes)

let goalId = randomGoal(engine)

Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    if (
      (pair.bodyA === ballCollisionBody && pair.bodyB.id === goalId) ||
      (pair.bodyA.id === goalId && pair.bodyB === ballCollisionBody)
    ) {
      playerScore++
      updateScoreDisplay()
      RESET()
      goalId = randomGoal(engine)
    }
    if (deathHoleCollisionCheck(pair)) {
      playerLives--
      updateLivesDisplay()
      if (playerLives === 0) {
        GAMEOVER()
        return
      }
      RESET()
    }
  })
})

function deathHoleCollisionCheck(pair: Pair) {
  if (
    (pair.bodyA === ballCollisionBody && deathHoleIds.has(pair.bodyB.id)) ||
    (pair.bodyB === ballCollisionBody && deathHoleIds.has(pair.bodyA.id))
  ) {
    return true
  }
  return false
}

function resetHelper(body: Body, x: number, y: number): void {
  Body.setPosition(body, { x, y })
  Body.setVelocity(body, { x: 0, y: 0 })
}

function RESET() {
  resetHelper(pointA, 0, screenHeight - 50)
  resetHelper(pointB, screenWidth, screenHeight - 50)
  updateLine(engine)
  resetHelper(THE_BALL, screenWidth / 2, screenHeight - 60)
}

let playerLives = 3
let playerScore = 0

function GAMEOVER() {
  playerLives = 3
  playerScore = 0
  resetGoalSequence()
  updateLivesDisplay()
  updateScoreDisplay()
  RESET()
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('scoreDisplay')
  if (scoreDisplay) {
    scoreDisplay.textContent = `Score: ${playerScore}`
  } else {
    console.error('Score display element not found')
  }
}

function updateLivesDisplay() {
  const livesDisplay = document.getElementById('livesDisplay')
  if (livesDisplay) {
    livesDisplay.textContent = `Lives: ${playerLives}`
  } else {
    console.error('Lives display element not found')
  }
}

function gameLoop(): void {
  debouncedLog(goalId)
  updateMovement()
  updateLine(engine)
  Engine.update(engine)
  requestAnimationFrame(gameLoop)
}

gameLoop()
