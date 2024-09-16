import { Bodies, Body } from 'matter-js'
import { BALL_LAYER, GOAL_LAYER, DEATH_LAYER } from './collisionMasks'

const screenHeight = 1000
const screenWidth = 800

const ballRadius = 800 / 32

const ball = Bodies.circle(screenWidth / 2, screenHeight - 60, ballRadius, {
  density: 0.3,
  friction: 0.05,
  mass: 300,
  render: {
    fillStyle: '#FF6F61',
  },
})

export const ballCollisionBody = Bodies.circle(
  screenWidth / 2,
  screenHeight - 60,
  ballRadius * 0.2,
  {
    isSensor: true,
    render: {
      visible: true,
      fillStyle: '#ffffff',
    },
    collisionFilter: {
      category: BALL_LAYER,
      mask: GOAL_LAYER | DEATH_LAYER,
    },
  }
)

export const THE_BALL = Body.create({
  parts: [ball, ballCollisionBody],
})
