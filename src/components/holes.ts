import { Body, Bodies } from 'matter-js'
import { BALL_LAYER, GOAL_LAYER, DEATH_LAYER } from './collisionMasks'

const screenHeight = 1000
const screenWidth = 800

export const holes: Body[] = []
const ballRadius = 800 / 32
const holeRadius = ballRadius + 5 // Slightly larger than the ball
const numberOfHoles = 50 // Number of holes

export const goalHole = Bodies.circle(screenWidth / 2, 50, holeRadius, {
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

holes.push(goalHole)

function isOverlapping(x: number, y: number): boolean {
  for (const hole of holes) {
    const dx = hole.position.x - x
    const dy = hole.position.y - y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const radius = hole.circleRadius || 0 // Access the radius safely

    // If the distance between centers is less than the sum of the radii, they overlap
    if (distance < radius * 2.2) {
      return true
    }
  }
  return false
}

export function createNonOverlappingHoles() {
  let attempts = 0
  while (holes.length < numberOfHoles && attempts < 1000) {
    // Limit attempts to prevent infinite loops
    const x = Math.random() * (screenWidth - 2 * holeRadius) + holeRadius
    const y =
      Math.random() * (screenHeight - 200 - 2 * holeRadius) + holeRadius + 80 // Avoid top and bottom

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
