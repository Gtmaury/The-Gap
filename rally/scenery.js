import { distanceToCourse } from "./sim.js"

const PINES = 16
const ROCKS = 12
const CLEARANCE = 4

function hash(n) {
  let x = n | 0
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d)
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b)
  return (x ^ (x >>> 16)) >>> 0
}

function seedFrom(stage) {
  let h = 2166136261
  const text = `${stage.id}:${stage.points.map((point) => `${point.x},${point.z}`).join(";")}`
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function propsFor(stage) {
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (const point of stage.points) {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minZ = Math.min(minZ, point.z)
    maxZ = Math.max(maxZ, point.z)
  }
  minX -= 40
  maxX += 40
  minZ -= 40
  maxZ += 40
  const seed = seedFrom(stage)
  const spots = []
  const columns = 28
  const rows = 28
  for (let iz = 0; iz < rows; iz++) {
    for (let ix = 0; ix < columns; ix++) {
      const jitter = hash(seed + ix * 131 + iz * 977)
      const x = minX + ((ix + ((jitter & 255) / 255) * 0.85) / columns) * (maxX - minX)
      const z = minZ + ((iz + (((jitter >>> 8) & 255) / 255) * 0.85) / rows) * (maxZ - minZ)
      if (distanceToCourse(x, z, stage) > stage.halfWidth + CLEARANCE) {
        spots.push({ x, z, jitter })
      }
    }
  }
  spots.sort((a, b) => a.jitter - b.jitter || a.x - b.x || a.z - b.z)
  const props = []
  for (const spot of spots) {
    if (props.length < PINES) props.push({ x: spot.x, z: spot.z, kind: "pine" })
    else if (props.length < PINES + ROCKS) props.push({ x: spot.x, z: spot.z, kind: "rock" })
    else break
  }
  if (props.length !== PINES + ROCKS) {
    throw new Error(`stage ${stage.id} has ${props.length} scenery spots`)
  }
  return props
}
