export const GEAR_TOP = [8, 12, 16, 20, 24, 28, 32]
export const GEAR_PULL = [22, 18, 15, 12, 10, 8, 6]
export const BRAKE = 22
export const DRAG = 1.5
export const YAW_RATE = 2.6
export const SNOW_GRIP = 0.65
export const LATERAL_DECAY = 2.5
export const SLOPE_GRAVITY = 9.8

import { slide } from "./route.js"

export const RIBBON_PERIOD = 180

// Heading 0 faces +z. Steer above 0 is a left turn and increases heading.
// forward = (-sin(heading), cos(heading)), so +x is to the right.
export function terrainHeight(place, _x, z) {
  return place.heightBase + place.heightAmp * Math.sin((2 * Math.PI * z) / RIBBON_PERIOD)
}

export function gradeAlong(place, x, z, dirX, dirZ) {
  const step = 0.5
  return (terrainHeight(place, x + dirX * step, z + dirZ * step) - terrainHeight(place, x, z)) / step
}

export function forward(heading) {
  return { x: -Math.sin(heading), z: Math.cos(heading) }
}

function slopeAccel(grade) {
  return (-SLOPE_GRAVITY * grade) / Math.hypot(1, grade)
}

export function createRun(field) {
  const start = field.start
  return {
    field,
    car: {
      x: start.x,
      z: start.z,
      y: terrainHeight(field, start.x, start.z),
      heading: start.heading,
      speed: 0,
      vx: 0,
      vz: 0,
      gear: 0,
    },
  }
}

export function restart(run) {
  return createRun(run.field)
}

export function step(run, input, dt, solids = []) {
  const accelerate = Boolean(input.accelerate)
  const brake = Boolean(input.brake)
  const steer = Math.max(-1, Math.min(1, input.steer || 0))

  let heading = run.car.heading
  if (steer !== 0) heading += steer * YAW_RATE * dt

  const face = forward(heading)
  const vx0 = run.car.vx || 0
  const vz0 = run.car.vz || 0
  const along = vx0 * face.x + vz0 * face.z
  let latX = vx0 - face.x * along
  let latZ = vz0 - face.z * along

  const grade = gradeAlong(run.field, run.car.x, run.car.z, face.x, face.z)
  let gear = run.car.gear ?? 0
  const shift = Math.max(-1, Math.min(1, Number(input.shift) || 0))
  gear = Math.max(0, Math.min(GEAR_TOP.length - 1, gear + shift))
  let alongSpeed = along
  if (brake) alongSpeed -= BRAKE * dt
  else if (accelerate) alongSpeed += GEAR_PULL[gear] * run.field.grip * dt
  else alongSpeed -= DRAG * dt
  alongSpeed += slopeAccel(grade) * dt
  if (alongSpeed < 0) alongSpeed = 0
  if (alongSpeed > GEAR_TOP[gear]) alongSpeed = GEAR_TOP[gear]

  if (alongSpeed === 0) {
    latX = 0
    latZ = 0
  } else {
    const keep = Math.exp(-LATERAL_DECAY * dt)
    latX *= keep
    latZ *= keep
  }

  let vx = face.x * alongSpeed + latX
  let vz = face.z * alongSpeed + latZ
  let x = run.car.x + vx * dt
  let z = run.car.z + vz * dt
  const resolved = slide(x, z, vx, vz, solids)
  x = resolved.x
  z = resolved.z
  vx = resolved.vx
  vz = resolved.vz
  const speed = Math.hypot(vx, vz)

  return {
    field: run.field,
    car: {
      x,
      z,
      y: terrainHeight(run.field, x, z),
      heading,
      speed,
      vx,
      vz,
      gear,
    },
  }
}
