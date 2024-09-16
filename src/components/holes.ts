import { Body, Bodies, World, Engine } from 'matter-js'
const seedrandom = require('seedrandom')
import { BALL_LAYER, GOAL_LAYER } from './collisionMasks'

const SEED = 'keep making things'
export const rng = seedrandom(SEED)

const screenHeight = 1000
const screenWidth = 800

export const holes: Body[] = []
const ballRadius = 800 / 32
const holeRadius = ballRadius + 5 // Slightly larger than the ball
const numberOfHoles = 60 // Number of holes

function isOverlapping(x: number, y: number): boolean {
  for (const hole of holes) {
    const dx = hole.position.x - x
    const dy = hole.position.y - y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const radius = hole.circleRadius || 0 // Access the radius safely

    // If the distance between centers is less than the sum of the radii, they overlap
    if (distance < radius * 2.1) {
      return true
    }
  }
  return false
}

export const deathHoleIds = new Set()

export function createNonOverlappingHoles() {
  let attempts = 0
  while (holes.length < numberOfHoles && attempts < 1000) {
    const x = rng() * (screenWidth - 2 * holeRadius) + holeRadius
    const y = rng() * (screenHeight - 200 - 2 * holeRadius) + holeRadius + 80 // Avoid top and bottom

    if (!isOverlapping(x, y)) {
      const hole = Bodies.circle(x, y, holeRadius, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#000' },
      })
      holes.push(hole as Body)
      deathHoleIds.add(hole.id)
    }
    attempts++
  }
}

let holeder: Body | null = null
let goalder: Body | null = null
export const randomSeededIndexes: number[] = []
const totalGoals = 10
export let currentGoal = 0

export function generateRandomGoalIndexes(array: number[]) {
  const set = new Set()
  while (array.length < totalGoals) {
    const randomIndex = Math.floor(rng() * holes.length)
    const hasIndex = set.has(randomIndex)
    if (!hasIndex) {
      array.push(randomIndex)
      set.add(randomIndex)
    }
  }
}

function generateGoal(x: number, y: number): Body {
  return Bodies.circle(x, y, holeRadius, {
    isStatic: true,
    isSensor: true,
    render: {
      fillStyle: '#32CD32',
    },
    collisionFilter: {
      category: GOAL_LAYER,
      mask: BALL_LAYER,
    },
  })
}

export function randomGoal(engine: Engine): number {
  const randomHole = holes[randomSeededIndexes[currentGoal]]
  const newGoal = generateGoal(randomHole.position.x, randomHole.position.y)

  if (goalder && holeder) {
    World.remove(engine.world, goalder)
    World.add(engine.world, holeder)
  }

  holeder = randomHole
  goalder = newGoal

  World.remove(engine.world, randomHole)
  World.add(engine.world, newGoal)

  if (currentGoal < 10) {
    currentGoal++
  }

  return newGoal.id
}

export function resetGoalSequence() {
  currentGoal = 0
}
