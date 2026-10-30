import { coverForChunk, propsForChunk } from "./scenery.js"
import { roadColor, routeCenter } from "./route.js"
import { forward, gradeAlong, terrainHeight } from "./sim.js"

const VERTEX = `
attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute float aShade;
uniform mat4 uViewProj;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vWorld;
varying float vShade;
void main() {
  vColor = aColor;
  vNormal = aNormal;
  vWorld = aPos;
  vShade = aShade;
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`

const FRAGMENT = `
precision mediump float;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vWorld;
varying float vShade;
uniform vec2 uCar;
uniform vec2 uNose;
uniform float uHeightBase;
uniform float uHeightAmp;
uniform float uAmbient;
uniform float uDiffuse;
uniform vec3 uLight;
uniform float uBeam;
void main() {
  vec3 light = normalize(uLight);
  float lit = uAmbient + uDiffuse * max(dot(normalize(vNormal), light), 0.0);
  vec3 color = vColor * mix(1.0, lit, vShade);
  vec2 delta = vWorld.xz - uCar;
  float along = dot(delta, uNose);
  float lat = abs(delta.x * uNose.y - delta.y * uNose.x);
  float halfW = 0.6 + along / 8.0 * 1.6;
  float head = 0.0;
  if (along > 1.2 && along < 8.0 && lat < halfW) {
    head = (1.0 - along / 8.0) * (1.0 - lat / halfW);
  }
  float groundY = uHeightBase + uHeightAmp * sin(6.2831853 * vWorld.z / 180.0);
  float onGround = 1.0 - step(1.5, abs(vWorld.y - groundY));
  color += vShade * onGround * head * uBeam * vec3(0.85, 0.72, 0.45);
  gl_FragColor = vec4(min(color, vec3(1.0)), 1.0);
}
`

const STRIDE = 10

export const NIGHT = {
  sky: [0.05, 0.06, 0.10],
  ambient: 0.15,
  diffuse: 0.55,
  light: [0.25, 0.72, -0.45],
}
export const DAY = {
  sky: [0.64, 0.76, 0.88],
  ambient: 0.42,
  diffuse: 0.75,
  light: [0.15, 0.92, 0.2],
}
const ROCK = [0.16, 0.16, 0.17]
const TAIL = [0.82, 0.08, 0.07]
const BODY = [0.9, 0.9, 0.92]

export function viewPose(car) {
  return {
    eye: {
      x: car.x,
      y: car.y + 43,
      z: car.z - 47,
    },
    look: {
      x: car.x,
      y: car.y + 0.5,
      z: car.z + 16,
    },
  }
}

export function projectPoint(car, aspect, world) {
  const pose = viewPose(car)
  const viewProj = multiply(
    perspective(0.8, aspect, 0.2, 800),
    lookAt(pose.eye, pose.look, { x: 0, y: 1, z: 0 }),
  )
  const point = [world.x, world.y, world.z, 1]
  const clip = [0, 0, 0, 0]
  for (let row = 0; row < 4; row++) {
    clip[row] =
      viewProj[row] * point[0] +
      viewProj[4 + row] * point[1] +
      viewProj[8 + row] * point[2] +
      viewProj[12 + row] * point[3]
  }
  return { x: clip[0] / clip[3], y: clip[1] / clip[3], z: clip[2] / clip[3] }
}

export function projectCar(car, aspect) {
  return projectPoint(car, aspect, { x: car.x, y: car.y + 1, z: car.z })
}

function unit(x, y, z) {
  const len = Math.hypot(x, y, z) || 1
  return [x / len, y / len, z / len]
}

export function lightFactor(normal, day = false) {
  const sun = day ? DAY : NIGHT
  const light = unit(sun.light[0], sun.light[1], sun.light[2])
  const n = unit(normal[0], normal[1], normal[2])
  const dot = Math.max(0, n[0] * light[0] + n[1] * light[1] + n[2] * light[2])
  return sun.ambient + sun.diffuse * dot
}

export function headlightAmount(car, point, place, day = false) {
  if (day) return 0
  const ground = terrainHeight(place, point.x, point.z)
  const y = point.y ?? ground
  if (Math.abs(y - ground) > 1.5) return 0
  const face = forward(car.heading)
  const dx = point.x - car.x
  const dz = point.z - car.z
  const along = dx * face.x + dz * face.z
  if (along <= 1.2 || along >= 8) return 0
  const lat = Math.abs(dx * face.z - dz * face.x)
  const half = 0.6 + (along / 8) * 1.6
  if (half <= 0 || lat >= half) return 0
  return (1 - along / 8) * (1 - lat / half)
}

function multiply(a, b) {
  const out = new Array(16)
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3]
    }
  }
  return out
}

function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]
}

function lookAt(eye, center, up) {
  let zx = eye.x - center.x
  let zy = eye.y - center.y
  let zz = eye.z - center.z
  let len = Math.hypot(zx, zy, zz) || 1
  zx /= len
  zy /= len
  zz /= len
  let xx = up.y * zz - up.z * zy
  let xy = up.z * zx - up.x * zz
  let xz = up.x * zy - up.y * zx
  len = Math.hypot(xx, xy, xz) || 1
  xx /= len
  xy /= len
  xz /= len
  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx
  return [
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye.x + xy * eye.y + xz * eye.z),
    -(yx * eye.x + yy * eye.y + yz * eye.z),
    -(zx * eye.x + zy * eye.y + zz * eye.z),
    1,
  ]
}

function faceNormal(a, b, c) {
  const ux = b[0] - a[0]
  const uy = b[1] - a[1]
  const uz = b[2] - a[2]
  const vx = c[0] - a[0]
  const vy = c[1] - a[1]
  const vz = c[2] - a[2]
  return unit(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
}

function pushVertex(target, x, y, z, color, normal, shade = 1) {
  target.push(x, y, z, normal[0], normal[1], normal[2], color[0], color[1], color[2], shade)
}

function pushTri(target, a, b, c, color, shade = 1) {
  const normal = faceNormal(a, b, c)
  pushVertex(target, a[0], a[1], a[2], color, normal, shade)
  pushVertex(target, b[0], b[1], b[2], color, normal, shade)
  pushVertex(target, c[0], c[1], c[2], color, normal, shade)
}

function addFace(target, corners, color, shade = 1) {
  const [a, b, c, d] = corners
  pushTri(target, a, b, c, color, shade)
  pushTri(target, a, c, d, color, shade)
}

function addBox(target, min, max, color) {
  const [x0, y0, z0] = min
  const [x1, y1, z1] = max
  addFace(target, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], color)
  addFace(target, [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], color)
  addFace(target, [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], color)
  addFace(target, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], color)
  addFace(target, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], color)
  addFace(target, [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], color)
}

function addPrism(target, x, y, z, radius, halfLength, color) {
  const sides = 6
  const ring = []
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2
    ring.push([y + Math.cos(angle) * radius, z + Math.sin(angle) * radius])
  }
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    const y0 = ring[i][0]
    const z0 = ring[i][1]
    const y1 = ring[next][0]
    const z1 = ring[next][1]
    addFace(
      target,
      [
        [x - halfLength, y0, z0],
        [x - halfLength, y1, z1],
        [x + halfLength, y1, z1],
        [x + halfLength, y0, z0],
      ],
      color,
    )
  }
  const cap = (end, flip) => {
    for (let i = 1; i < sides - 1; i++) {
      const p0 = [end, ring[0][0], ring[0][1]]
      const p1 = [end, ring[i][0], ring[i][1]]
      const p2 = [end, ring[i + 1][0], ring[i + 1][1]]
      if (flip) pushTri(target, p0, p2, p1, color)
      else pushTri(target, p0, p1, p2, color)
    }
  }
  cap(x - halfLength, true)
  cap(x + halfLength, false)
}

function carBasis(car, place) {
  const face = forward(car.heading)
  const pitch = Math.atan(gradeAlong(place, car.x, car.z, face.x, face.z))
  const cos = Math.cos(pitch)
  const sin = Math.sin(pitch)
  return {
    right: [face.z, 0, -face.x],
    up: [-sin * face.x, cos, -sin * face.z],
    forward: [face.x * cos, sin, face.z * cos],
  }
}

function applyBasis(origin, basis, local) {
  return [
    origin[0] + basis.right[0] * local[0] + basis.up[0] * local[1] + basis.forward[0] * local[2],
    origin[1] + basis.right[1] * local[0] + basis.up[1] * local[1] + basis.forward[1] * local[2],
    origin[2] + basis.right[2] * local[0] + basis.up[2] * local[1] + basis.forward[2] * local[2],
  ]
}

export function carPoint(car, local, place) {
  const point = applyBasis([car.x, car.y, car.z], carBasis(car, place), local)
  return { x: point[0], y: point[1], z: point[2] }
}

function transformMesh(local, car, place) {
  const world = []
  const basis = carBasis(car, place)
  const origin = [car.x, car.y, car.z]
  for (let i = 0; i < local.length; i += STRIDE) {
    const point = applyBasis(origin, basis, [local[i], local[i + 1], local[i + 2]])
    const normal = applyBasis([0, 0, 0], basis, [local[i + 3], local[i + 4], local[i + 5]])
    world.push(
      point[0],
      point[1],
      point[2],
      normal[0],
      normal[1],
      normal[2],
      local[i + 6],
      local[i + 7],
      local[i + 8],
      local[i + 9],
    )
  }
  return new Float32Array(world)
}

function cellPatch(ix, iz) {
  let n = Math.imul(ix + 1, 374761393) ^ Math.imul(iz + 1, 668265263)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) % 7 === 0
}

function boundsOf(field) {
  return { minX: field.minX, maxX: field.maxX, minZ: field.minZ, maxZ: field.maxZ }
}

export function chunksAround(z) {
  const behind = z - 400
  const ahead = z + 1200
  const span = 180
  const first = Math.floor((behind + 90) / span)
  const indexes = []
  for (let index = first; -90 + span * index < ahead; index++) {
    const end = -90 + span * (index + 1)
    if (end > behind) indexes.push(index)
  }
  return indexes
}

export function buildTerrain(field, index) {
  const cells = 40
  const bounds = boundsOf(field)
  const span = bounds.maxZ - bounds.minZ
  const zBase = bounds.minZ + span * index
  const data = []
  const dx = (bounds.maxX - bounds.minX) / cells
  const dz = span / cells
  const rows = cells + 2
  for (let iz = 0; iz < rows; iz++) {
    for (let ix = 0; ix < cells; ix++) {
      const x0 = bounds.minX + ix * dx
      const x1 = x0 + dx
      const z0 = zBase - dz + iz * dz
      const z1 = z0 + dz
      const y00 = terrainHeight(field, x0, z0)
      const y10 = terrainHeight(field, x1, z0)
      const y11 = terrainHeight(field, x1, z1)
      const y01 = terrainHeight(field, x0, z1)
      const a = [x0, y00, z0]
      const b = [x0, y01, z1]
      const c = [x1, y11, z1]
      const d = [x1, y10, z0]
      const color = cellPatch(ix, iz) ? field.patch : field.ground
      pushTri(data, a, b, c, color)
      pushTri(data, a, c, d, color)
    }
  }
  return new Float32Array(data)
}

export function buildRoute(field, index) {
  const bounds = boundsOf(field)
  const span = bounds.maxZ - bounds.minZ
  const zBase = bounds.minZ + span * index
  const step = 6
  const bands = [[-0.12, 0.12], [-5.5, -0.12], [0.12, 5.5], [-7, -5.5], [5.5, 7]]
  const data = []
  const zEnd = zBase + span + step
  const sub = 2
  for (let zBlock = zBase - step; zBlock < zEnd - 1e-6; zBlock += step) {
    for (let part = 0; part < step / sub; part++) {
      const z0 = zBlock + part * sub
      const z1 = z0 + sub
    for (const [near, far] of bands) {
      const color = roadColor((near + far) / 2, z0)
      const y = (x, z) => terrainHeight(field, x, z) + 0.05
      const x0 = routeCenter(z0)
      const x1 = routeCenter(z1)
      const a = [x0 + near, y(x0 + near, z0), z0]
      const b = [x1 + near, y(x1 + near, z1), z1]
      const c = [x1 + far, y(x1 + far, z1), z1]
      const d = [x0 + far, y(x0 + far, z0), z0]
      pushTri(data, a, b, c, color)
      pushTri(data, a, c, d, color)
    }
    }
  }
  return new Float32Array(data)
}

function addCone(data, x, z, baseY, height, radius, color) {
  const sides = 6
  const ring = []
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2
    ring.push([x + Math.cos(angle) * radius, z + Math.sin(angle) * radius])
  }
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    const a = [ring[i][0], baseY, ring[i][1]]
    const b = [x, baseY + height, z]
    const c = [ring[next][0], baseY, ring[next][1]]
    const normal = faceNormal(a, b, c)
    const midX = (a[0] + c[0]) / 2 - x
    const midZ = (a[2] + c[2]) / 2 - z
    const n = normal[0] * midX + normal[2] * midZ >= 0 ? normal : [-normal[0], -normal[1], -normal[2]]
    pushVertex(data, a[0], a[1], a[2], color, n)
    pushVertex(data, b[0], b[1], b[2], color, n)
    pushVertex(data, c[0], c[1], c[2], color, n)
  }
}

export function pineMesh(place, x = 0, z = 0, height = 0) {
  const data = []
  const y = terrainHeight(place, x, z)
  const scale = height === 1 ? 1.18 : height === 2 ? 0.82 : 1
  if (place.id === "night-forest") {
    addBox(data, [x - 0.28, y, z - 0.28], [x + 0.28, y + 1.4 * scale, z + 0.28], [0.28, 0.16, 0.1])
    addCone(data, x, z, y, 8 * scale, 3, [0.1, 0.28, 0.12])
    addCone(data, x, z, y + 3.4 * scale, 5.2 * scale, 2.1, [0.18, 0.4, 0.16])
  } else {
    addCone(data, x, z, y, 8 * scale, 3, [0.16, 0.32, 0.2])
    addCone(data, x, z, y + 5 * scale, 3.2 * scale, 1.5, [0.92, 0.93, 0.9])
  }
  return data
}

function addRock(data, x, z, field) {
  const y = terrainHeight(field, x, z)
  addBox(data, [x - 1.2, y, z - 0.7], [x + 0.3, y + 0.7, z + 0.9], ROCK)
  addBox(data, [x - 0.2, y, z - 1.1], [x + 1.3, y + 1.15, z + 0.2], ROCK)
}

export function coverMesh(field, prop) {
  const data = []
  const y = terrainHeight(field, prop.x, prop.z)
  const { x, z } = prop
  if (prop.kind === "mound") addCone(data, x, z, y, 0.55, 1.2, [0.82, 0.86, 0.9])
  else if (prop.kind === "shrub") addCone(data, x, z, y, 1.4, 0.7, [0.18, 0.22, 0.2])
  else if (prop.kind === "undergrowth") addCone(data, x, z, y, 1.2, 0.9, [0.08, 0.2, 0.1])
  else if (prop.kind === "stump") {
    addBox(data, [x - 0.35, y, z - 0.35], [x + 0.35, y + 0.6, z + 0.35], [0.28, 0.16, 0.1])
  } else addBox(data, [x - 0.4, y, z - 0.4], [x + 0.4, y + 0.45, z + 0.4], ROCK)
  return data
}

export function buildScenery(field, index) {
  const data = []
  for (const prop of propsForChunk(field, index)) {
    if (prop.kind === "pine") data.push(...pineMesh(field, prop.x, prop.z, prop.height))
    else addRock(data, prop.x, prop.z, field)
  }
  for (const prop of coverForChunk(field, index)) data.push(...coverMesh(field, prop))
  return new Float32Array(data)
}

export function buildCarLocal(kind = "hatch") {
  const data = []
  const wheel = [0.12, 0.12, 0.13]
  if (kind === "coupe") {
    addBox(data, [-0.8, 0.38, -1.7], [0.8, 0.92, 2.35], [0.75, 0.18, 0.16])
    addBox(data, [-0.55, 0.62, -1.85], [-0.2, 0.88, -1.62], TAIL)
    addBox(data, [0.2, 0.62, -1.85], [0.55, 0.88, -1.62], TAIL)
    addBox(data, [-0.55, 0.92, -0.15], [0.55, 1.35, 1.2], [0.12, 0.14, 0.16])
  } else if (kind === "wagon") {
    addBox(data, [-0.88, 0.45, -1.8], [0.88, 1.05, 1.7], [0.18, 0.28, 0.48])
    addBox(data, [-0.55, 0.62, -1.95], [-0.2, 0.92, -1.72], TAIL)
    addBox(data, [0.2, 0.62, -1.95], [0.55, 0.92, -1.72], TAIL)
    addBox(data, [-0.78, 1.05, -1.7], [0.78, 2.15, 0.2], [0.14, 0.2, 0.36])
  } else {
    addBox(data, [-0.85, 0.45, -1.8], [0.85, 1.05, 1.9], BODY)
    addBox(data, [-0.55, 0.62, -1.95], [-0.2, 0.92, -1.72], TAIL)
    addBox(data, [0.2, 0.62, -1.95], [0.55, 0.92, -1.72], TAIL)
    addBox(data, [-0.62, 1.05, -0.45], [0.62, 1.7, 1.05], [0.16, 0.2, 0.24])
  }
  for (const [x, z] of [[-0.95, -1.15], [0.95, -1.15], [-0.95, 1.2], [0.95, 1.2]]) {
    addPrism(data, x, 0.38, z, 0.38, 0.18, wheel)
  }
  return data
}

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "shader failed")
  }
  return shader
}

function upload(gl, data) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  return { buffer, count: data.length / STRIDE }
}

export function createView(canvas, gl) {
  const program = gl.createProgram()
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "program failed")
  }
  const posLoc = gl.getAttribLocation(program, "aPos")
  const normalLoc = gl.getAttribLocation(program, "aNormal")
  const colorLoc = gl.getAttribLocation(program, "aColor")
  const shadeLoc = gl.getAttribLocation(program, "aShade")
  const viewLoc = gl.getUniformLocation(program, "uViewProj")
  const carLoc = gl.getUniformLocation(program, "uCar")
  const noseLoc = gl.getUniformLocation(program, "uNose")
  const heightBaseLoc = gl.getUniformLocation(program, "uHeightBase")
  const heightAmpLoc = gl.getUniformLocation(program, "uHeightAmp")
  const ambientLoc = gl.getUniformLocation(program, "uAmbient")
  const diffuseLoc = gl.getUniformLocation(program, "uDiffuse")
  const lightLoc = gl.getUniformLocation(program, "uLight")
  const beamLoc = gl.getUniformLocation(program, "uBeam")
  let time = NIGHT
  let carLocal = buildCarLocal("hatch")
  const carBuffer = gl.createBuffer()
  let staticMeshes = []
  let chunkKey = ""
  let activeField = null
  let eye = null
  let look = null
  let aspect = 1

  function bind(mesh) {
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer)
    gl.enableVertexAttribArray(posLoc)
    gl.enableVertexAttribArray(normalLoc)
    gl.enableVertexAttribArray(colorLoc)
    gl.enableVertexAttribArray(shadeLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, STRIDE * 4, 0)
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, STRIDE * 4, 12)
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, STRIDE * 4, 24)
    gl.vertexAttribPointer(shadeLoc, 1, gl.FLOAT, false, STRIDE * 4, 36)
    gl.drawArrays(gl.TRIANGLES, 0, mesh.count)
  }

  return {
    setField(field) {
      activeField = field
      for (const mesh of staticMeshes) gl.deleteBuffer(mesh.buffer)
      staticMeshes = []
      chunkKey = ""
      eye = null
    },
    setTime(day) {
      time = day ? DAY : NIGHT
    },
    setCar(kind) {
      carLocal = buildCarLocal(kind)
    },
    draw(run, dt) {
      const width = Math.max(1, canvas.clientWidth)
      const height = Math.max(1, canvas.clientHeight)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const pixelsW = Math.floor(width * dpr)
      const pixelsH = Math.floor(height * dpr)
      if (canvas.width !== pixelsW || canvas.height !== pixelsH) {
        canvas.width = pixelsW
        canvas.height = pixelsH
      }
      aspect = pixelsW / pixelsH
      const desiredPose = viewPose(run.car)
      const desired = desiredPose.eye
      if (!eye) eye = { ...desired }
      const blend = 1 - Math.exp(-8 * Math.max(0, dt))
      eye.x += (desired.x - eye.x) * blend
      eye.y += (desired.y - eye.y) * blend
      eye.z += (desired.z - eye.z) * blend
      look = desiredPose.look
      const viewProj = multiply(
        perspective(0.8, aspect, 0.2, 800),
        lookAt(eye, look, { x: 0, y: 1, z: 0 }),
      )
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(time.sky[0], time.sky[1], time.sky[2], 1)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.enable(gl.DEPTH_TEST)
      gl.disable(gl.CULL_FACE)
      gl.useProgram(program)
      gl.uniformMatrix4fv(viewLoc, false, new Float32Array(viewProj))
      const face = forward(run.car.heading)
      gl.uniform2f(carLoc, run.car.x, run.car.z)
      gl.uniform2f(noseLoc, face.x, face.z)
      gl.uniform1f(heightBaseLoc, activeField?.heightBase ?? 14)
      gl.uniform1f(heightAmpLoc, activeField?.heightAmp ?? 10)
      gl.uniform1f(ambientLoc, time.ambient)
      gl.uniform1f(diffuseLoc, time.diffuse)
      gl.uniform3f(lightLoc, time.light[0], time.light[1], time.light[2])
      gl.uniform1f(beamLoc, time === DAY ? 0 : 1)
      const indexes = chunksAround(run.car.z)
      const key = indexes.join(",")
      if (key !== chunkKey) {
        for (const mesh of staticMeshes) gl.deleteBuffer(mesh.buffer)
        staticMeshes = []
        for (const index of indexes) {
          staticMeshes.push(upload(gl, buildTerrain(activeField, index)))
          staticMeshes.push(upload(gl, buildRoute(activeField, index)))
          staticMeshes.push(upload(gl, buildScenery(activeField, index)))
        }
        chunkKey = key
      }
      for (const mesh of staticMeshes) bind(mesh)
      const carData = transformMesh(carLocal, run.car, activeField)
      gl.bindBuffer(gl.ARRAY_BUFFER, carBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, carData, gl.DYNAMIC_DRAW)
      bind({ buffer: carBuffer, count: carData.length / STRIDE })
    },
  }
}
