export const ROUTE_PERIOD = 180
export const ROUTE_HALF = 7
export const ROUTE_AMP = 18
export const CAR_RADIUS = 1.1
export const PINE_RADIUS = 3
export const ROCK_RADIUS = 1.4
export const ROUTE_COLOR = [0.62, 0.48, 0.28]

export function routeCenter(z) {
  return ROUTE_AMP * Math.sin((2 * Math.PI * z) / ROUTE_PERIOD)
}

export function solidRadius(kind) {
  return kind === "rock" ? ROCK_RADIUS : PINE_RADIUS
}

export function routeClearance(kind) {
  return ROUTE_HALF + solidRadius(kind) + 0.5
}

export function onRoute(x, z, extra = 0) {
  return Math.abs(x - routeCenter(z)) < ROUTE_HALF + extra
}

export function slide(x, z, vx, vz, solids = []) {
  for (const solid of solids) {
    let dx = x - solid.x
    let dz = z - solid.z
    const reach = CAR_RADIUS + solid.radius
    let dist = Math.hypot(dx, dz)
    if (dist >= reach) continue
    if (dist < 1e-8) {
      dx = 1
      dz = 0
      dist = 1
    }
    const nx = dx / dist
    const nz = dz / dist
    x += nx * (reach - dist)
    z += nz * (reach - dist)
    const into = vx * nx + vz * nz
    if (into < 0) {
      vx -= into * nx
      vz -= into * nz
    }
  }
  const limit = ROUTE_HALF - CAR_RADIUS
  const center = routeCenter(z)
  const lateral = x - center
  if (lateral > limit) {
    x = center + limit
    if (vx > 0) vx = 0
  } else if (lateral < -limit) {
    x = center - limit
    if (vx < 0) vx = 0
  }
  return { x, z, vx, vz }
}
