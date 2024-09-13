import { Body } from 'matter-js'
import { pointA, pointB } from './bar'

const screenTop = 0
const screenHeight = 1000
const screenBottom = screenHeight

const keyState: Record<string, boolean> = {
  r: false,
  f: false,
  u: false,
  j: false,
}

export function handleKeyDown(event: KeyboardEvent): void {
  if (keyState.hasOwnProperty(event.key)) {
    keyState[event.key] = true
  }
}

export function handleKeyUp(event: KeyboardEvent): void {
  if (keyState.hasOwnProperty(event.key)) {
    keyState[event.key] = false
  }
}

export function updateMovement(): void {
  const moveSpeed = 0.8

  if (keyState['r'] && pointA.position.y - moveSpeed > screenTop) {
    Body.translate(pointA, { x: 0, y: -moveSpeed }) // Move point A up
  }
  if (keyState['f'] && pointA.position.y + moveSpeed < screenBottom) {
    Body.translate(pointA, { x: 0, y: moveSpeed }) // Move point A down
  }

  if (keyState['u'] && pointB.position.y - moveSpeed > screenTop) {
    Body.translate(pointB, { x: 0, y: -moveSpeed }) // Move point B up
  }
  if (keyState['j'] && pointB.position.y + moveSpeed < screenBottom) {
    Body.translate(pointB, { x: 0, y: moveSpeed }) // Move point B down
  }
}

window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)
