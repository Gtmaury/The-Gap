const start = { x: 0, z: 0, heading: 0 }
const span = { minX: -90, maxX: 90, minZ: -90, maxZ: 90 }

export const places = [
  {
    id: "night-snow",
    ...span,
    start,
    grip: 0.65,
    heightBase: 14,
    heightAmp: 10,
    ground: [0.45, 0.52, 0.62],
    kind: "pine",
    count: 48,
  },
  {
    id: "night-forest",
    ...span,
    start,
    grip: 1,
    heightBase: 8,
    heightAmp: 4,
    ground: [0.1, 0.16, 0.11],
    kind: "pine",
    count: 80,
  },
  {
    id: "night-rock",
    ...span,
    start,
    grip: 0.4,
    heightBase: 16,
    heightAmp: 14,
    ground: [0.28, 0.28, 0.3],
    kind: "rock",
    count: 36,
  },
]

export const field = places[0]
