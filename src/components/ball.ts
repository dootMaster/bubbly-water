import { Bodies, Body } from 'matter-js'
import { BALL_LAYER, GOAL_LAYER, DEATH_LAYER } from './collisionMasks'

const screenHeight = 1000
const screenWidth = 800

const ballRadius = 800 / 32

const ball = Bodies.circle(screenWidth / 2, screenHeight - 60, ballRadius, {
  density: 15, // Higher density for a heavier feel
  restitution: 0, // Bounciness
  friction: 0.3, // Slight friction for a more realistic feel
  mass: 1000,
  render: {
    fillStyle: '#FF6F61',
  },
})

const ballCollisionBody = Bodies.circle(
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
