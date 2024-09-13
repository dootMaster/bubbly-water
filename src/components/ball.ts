import { Bodies, Body } from 'matter-js'
import { BALL_LAYER, GOAL_LAYER, DEATH_LAYER } from './collisionMasks'

const screenHeight = 1000
const screenWidth = 800

const ballRadius = 800 / 32

const ball = Bodies.circle(screenWidth / 2, screenHeight - 60, ballRadius, {
  // density: 0.015,
  restitution: 0.05,
  friction: 0.05,
  // mass: Math.PI * Math.pow(ballRadius, 2) * 0.015,
  render: {
    fillStyle: '#FF6F61', // Color of the ball
  },
})

export const ballCollisionBody = Bodies.circle(
  screenWidth / 2,
  screenHeight - 60,
  ballRadius * 0.2,
  {
    isSensor: true, // This smaller body won't cause physical collisions
    render: {
      visible: true, // Hidden smaller collision body
      fillStyle: '#ffffff',
    },
    collisionFilter: {
      category: BALL_LAYER,
      mask: GOAL_LAYER | DEATH_LAYER,
    },
  }
)

export const THE_BALL = Body.create({
  parts: [ball, ballCollisionBody], // Attach both the visual and collision bodies
})
