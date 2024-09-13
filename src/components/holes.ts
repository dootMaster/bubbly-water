import { Body, Bodies, World, Engine } from 'matter-js'
const seedrandom = require('seedrandom')
import { BALL_LAYER, GOAL_LAYER, DEATH_LAYER } from './collisionMasks'

const SEED = 'keep making things'
const rng = seedrandom(SEED)

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

export function createNonOverlappingHoles() {
  let attempts = 0
  while (holes.length < numberOfHoles && attempts < 1000) {
    // Limit attempts to prevent infinite loops
    const x = rng() * (screenWidth - 2 * holeRadius) + holeRadius
    const y = rng() * (screenHeight - 200 - 2 * holeRadius) + holeRadius + 80 // Avoid top and bottom

    // Check if the new hole overlaps with any existing holes
    if (!isOverlapping(x, y)) {
      const hole = Bodies.circle(x, y, holeRadius, {
        collisionFilter: {
          category: DEATH_LAYER,
          mask: BALL_LAYER,
        },
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#000' },
      })
      holes.push(hole as Body)
    }
    attempts++
  }
}

let holeder: Body | null = null
let goalder: Body | null = null
const randomSeededIndexes: number[] = []
const totalGoals = 10
export let currentGoal = 0

for (let i = 0; i < totalGoals; i++) {
  randomSeededIndexes.push(Math.floor(rng() * holes.length))
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
  const goal = generateGoal(randomHole.position.x, randomHole.position.y)
  if (!holeder) {
    holeder = randomHole
    goalder = goal
    World.remove(engine.world, randomHole)
    World.add(engine.world, goal)
  } else {
    World.remove(engine.world, goal)
    World.add(engine.world, holeder)

    currentGoal++
    World.remove(engine.world, randomHole)
    World.add(engine.world, goal)
  }
  console.log(currentGoal)
  return goal.id
}
