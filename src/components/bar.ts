import { Bodies, Engine, World } from 'matter-js'
import { BALL_LAYER, BAR_LAYER } from './collisionMasks'

const screenHeight = 1000
const screenWidth = 800
const barSpaceFromBottom = 50
const barColor = '#4682B4'

export const pointA = Bodies.circle(0, screenHeight - barSpaceFromBottom, 10, {
  isStatic: true,
  render: {
    visible: false,
  },
})

export const pointB = Bodies.circle(
  screenWidth,
  screenHeight - barSpaceFromBottom,
  10,
  {
    isStatic: true,
    render: {
      visible: false,
    },
  }
)

const width = Math.abs(pointB.position.x - pointA.position.x)
const height = 10

export let line = Bodies.rectangle(
  (pointA.position.x + pointB.position.x) / 2,
  (pointA.position.y + pointB.position.y) / 2,
  width,
  height,
  {
    isStatic: true,
    render: {
      fillStyle: barColor,
    },
  }
)

export function updateLine(engine: Engine): void {
  const xA = pointA.position.x
  const yA = pointA.position.y
  const xB = pointB.position.x
  const yB = pointB.position.y

  // Calculate the center of the line
  const x = (xA + xB) / 2
  const y = (yA + yB) / 2

  // Calculate the width of the line (distance between pointA and pointB)
  const width = Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2))
  const height = 5 // Line thickness

  // Calculate the angle of the line
  const angle = Math.atan2(yB - yA, xB - xA)

  // Remove the old line
  World.remove(engine.world, line)

  // Create a new line with the updated width
  line = Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    angle: angle,
    render: {
      fillStyle: barColor,
    },
  })

  // Add the new line back to the world
  World.add(engine.world, line)
}
