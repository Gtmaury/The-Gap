export const TOP_SPEED = 28
export const ACCEL = 14
export const BRAKE = 22
export const DRAG = 4
export const YAW_RATE = 1.8

// Heading 0 faces +z. Steer above 0 is a left turn and increases heading.
// forward = (-sin(heading), cos(heading)), so +x is to the right.
export function terrainHeight(x, z) {
  return Math.sin(x * 0.035) * 3 + Math.cos(z * 0.025) * 2
}

export function headingFromSegment(a, b) {
  const heading = Math.atan2(-(b.x - a.x), b.z - a.z)
  return heading === 0 ? 0 : heading
}

export function forward(heading) {
  return { x: -Math.sin(heading), z: Math.cos(heading) }
}

export function formatTime(seconds) {
  const centiseconds = Math.round(Math.max(0, seconds) * 100)
  const minutes = Math.floor(centiseconds / 6000)
  const remain = centiseconds % 6000
  const whole = Math.floor(remain / 100)
  const hundredths = remain % 100
  return `${minutes}:${String(whole).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`
}

function distanceToSegment(px, pz, a, b) {
  const abx = b.x - a.x
  const abz = b.z - a.z
  const len2 = abx * abx + abz * abz
  if (len2 === 0) return Math.hypot(px - a.x, pz - a.z)
  const t = Math.max(0, Math.min(1, ((px - a.x) * abx + (pz - a.z) * abz) / len2))
  return Math.hypot(px - (a.x + abx * t), pz - (a.z + abz * t))
}

export function distanceToCourse(x, z, stage) {
  let best = Infinity
  const points = stage.points
  for (let i = 0; i < points.length - 1; i++) {
    best = Math.min(best, distanceToSegment(x, z, points[i], points[i + 1]))
  }
  return best
}

export function onCourse(x, z, stage) {
  return distanceToCourse(x, z, stage) <= stage.halfWidth
}

export function crossedFinish(x, z, stage) {
  const points = stage.points
  const a = points[points.length - 2]
  const b = points[points.length - 1]
  const dx = b.x - a.x
  const dz = b.z - a.z
  const len = Math.hypot(dx, dz)
  if (len === 0) return false
  const progress = ((x - a.x) * dx + (z - a.z) * dz) / len
  return progress >= len
}

export function createRun(stage) {
  const start = stage.points[0]
  const next = stage.points[1]
  const heading = headingFromSegment(start, next)
  return {
    stage,
    car: {
      x: start.x,
      z: start.z,
      y: terrainHeight(start.x, start.z),
      heading,
      speed: 0,
    },
    stageTime: 0,
    penaltyTime: 0,
    phase: "running",
  }
}

export function restart(run) {
  return createRun(run.stage)
}

export function totalTime(run) {
  return run.stageTime + run.penaltyTime
}

export function step(run, input, dt) {
  if (run.phase === "finished") return run

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
  const inside = onCourse(x, z, run.stage)
  const finished = inside && crossedFinish(x, z, run.stage)

  return {
    stage: run.stage,
    car: {
      x,
      z,
      y: terrainHeight(x, z),
      heading,
      speed,
    },
    stageTime: run.stageTime + dt,
    penaltyTime: run.penaltyTime + (inside ? 0 : dt),
    phase: finished ? "finished" : "running",
  }
}
