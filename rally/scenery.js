const PINES = 28
const ROCKS = 20
const CLEARANCE = 10

function hash(n) {
  let x = n | 0
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d)
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b)
  return (x ^ (x >>> 16)) >>> 0
}

function seedFrom(field) {
  let h = 2166136261
  const text = `${field.id}:${field.minX},${field.maxX},${field.minZ},${field.maxZ}`
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function propsFor(field) {
  const seed = seedFrom(field)
  const spots = []
  const columns = 24
  const rows = 24
  const width = field.maxX - field.minX
  const depth = field.maxZ - field.minZ
  for (let iz = 0; iz < rows; iz++) {
    for (let ix = 0; ix < columns; ix++) {
      const jitter = hash(seed + ix * 131 + iz * 977)
      const x = field.minX + ((ix + ((jitter & 255) / 255) * 0.85) / columns) * width
      const z = field.minZ + ((iz + (((jitter >>> 8) & 255) / 255) * 0.85) / rows) * depth
      if (Math.hypot(x - field.start.x, z - field.start.z) >= CLEARANCE) {
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
    throw new Error(`field ${field.id} has ${props.length} scenery spots`)
  }
  if (!props.some((prop) => prop.z > field.start.z)) {
    throw new Error(`field ${field.id} has no scenery ahead of the start`)
  }
  return props
}
