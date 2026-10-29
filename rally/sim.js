export const TOP_SPEED = 16
export const ACCEL = 14
export const BRAKE = 22
export const DRAG = 4
export const YAW_RATE = 1.8

// Heading 0 faces +z. Steer above 0 is a left turn and increases heading.
// forward = (-sin(heading), cos(heading)), so +x is to the right.
export function terrainHeight() {
  return 0
}

export function forward(heading) {
  return { x: -Math.sin(heading), z: Math.cos(heading) }
}

export function createRun(field) {
  const start = field.start
  return {
    field,
    car: {
      x: start.x,
      z: start.z,
      y: terrainHeight(start.x, start.z),
      heading: start.heading,
      speed: 0,
    },
  }
}

export function restart(run) {
  return createRun(run.field)
}

export function step(run, input, dt) {
  const accelerate = Boolean(input.accelerate)
  const brake = Boolean(input.brake)
  const steer = Math.max(-1, Math.min(1, input.steer || 0))

  let speed = run.car.speed
  if (brake) speed -= BRAKE * dt
  else if (accelerate) speed += ACCEL * dt
  else speed -= DRAG * dt
  if (speed < 0) speed = 0
  if (speed > TOP_SPEED) speed = TOP_SPEED

  let heading = run.car.heading
  if (speed > 0 && steer !== 0) heading += steer * YAW_RATE * dt

  const face = forward(heading)
  const x = run.car.x + face.x * speed * dt
  const z = run.car.z + face.z * speed * dt

  return {
    field: run.field,
    car: {
      x,
      z,
      y: terrainHeight(x, z),
      heading,
      speed,
    },
  }
}
