import { forward, terrainHeight } from "./sim.js"

const VERTEX = `
attribute vec3 aPos;
attribute vec3 aColor;
uniform mat4 uViewProj;
varying vec3 vColor;
void main() {
  vColor = aColor;
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`

const FRAGMENT = `
precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`

const POST = [0.93, 0.9, 0.78]
const GATE_BLACK = [0.06, 0.06, 0.07]
const GATE_YELLOW = [0.95, 0.78, 0.08]

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

function pushVertex(target, x, y, z, color) {
  target.push(x, y, z, color[0], color[1], color[2])
}

function addFace(target, corners, color) {
  const [a, b, c, d] = corners
  for (const point of [a, b, c, a, c, d]) pushVertex(target, point[0], point[1], point[2], color)
}

function addBox(target, min, max, color) {
  const [x0, y0, z0] = min
  const [x1, y1, z1] = max
  addFace(target, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], color)
  addFace(target, [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], color)
  addFace(target, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], color)
  addFace(target, [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]], color)
  addFace(target, [[x0, y0, z1], [x0, y1, z1], [x1, y1, z1], [x1, y0, z1]], color)
  addFace(target, [[x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z0]], color)
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
        [x + halfLength, y0, z0],
        [x + halfLength, y1, z1],
        [x - halfLength, y1, z1],
      ],
      color,
    )
  }
  const cap = (end) => {
    for (let i = 1; i < sides - 1; i++) {
      pushVertex(target, end, ring[0][0], ring[0][1], color)
      pushVertex(target, end, ring[i][0], ring[i][1], color)
      pushVertex(target, end, ring[i + 1][0], ring[i + 1][1], color)
    }
  }
  cap(x - halfLength)
  cap(x + halfLength)
}

function transformPoint(point, car) {
  const face = forward(car.heading)
  const rightX = face.z
  const rightZ = -face.x
  return [
    car.x + rightX * point[0] + face.x * point[2],
    car.y + point[1],
    car.z + rightZ * point[0] + face.z * point[2],
  ]
}

function transformMesh(local, car) {
  const world = []
  for (let i = 0; i < local.length; i += 6) {
    const point = transformPoint([local[i], local[i + 1], local[i + 2]], car)
    world.push(point[0], point[1], point[2], local[i + 3], local[i + 4], local[i + 5])
  }
  return new Float32Array(world)
}

function groundColor(height) {
  if (height < 0.4) return [0.28, 0.48, 0.24]
  if (height < 2) return [0.36, 0.5, 0.22]
  return [0.46, 0.36, 0.22]
}

function boundsOf(stage) {
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
  return { minX: minX - 70, maxX: maxX + 70, minZ: minZ - 70, maxZ: maxZ + 70 }
}

function buildTerrain(stage) {
  const cells = 40
  const bounds = boundsOf(stage)
  const data = []
  const dx = (bounds.maxX - bounds.minX) / cells
  const dz = (bounds.maxZ - bounds.minZ) / cells
  for (let iz = 0; iz < cells; iz++) {
    for (let ix = 0; ix < cells; ix++) {
      const x0 = bounds.minX + ix * dx
      const x1 = x0 + dx
      const z0 = bounds.minZ + iz * dz
      const z1 = z0 + dz
      const corners = [
        [x0, terrainHeight(x0, z0), z0],
        [x1, terrainHeight(x1, z0), z0],
        [x1, terrainHeight(x1, z1), z1],
        [x0, terrainHeight(x0, z1), z1],
      ]
      const midA = (corners[0][1] + corners[1][1] + corners[2][1]) / 3
      const midB = (corners[0][1] + corners[2][1] + corners[3][1]) / 3
      pushVertex(data, corners[0][0], corners[0][1], corners[0][2], groundColor(midA))
      pushVertex(data, corners[1][0], corners[1][1], corners[1][2], groundColor(midA))
      pushVertex(data, corners[2][0], corners[2][1], corners[2][2], groundColor(midA))
      pushVertex(data, corners[0][0], corners[0][1], corners[0][2], groundColor(midB))
      pushVertex(data, corners[2][0], corners[2][1], corners[2][2], groundColor(midB))
      pushVertex(data, corners[3][0], corners[3][1], corners[3][2], groundColor(midB))
    }
  }
  return new Float32Array(data)
}

function samplePolyline(points, spacing) {
  const samples = []
  let carried = 0
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const dx = b.x - a.x
    const dz = b.z - a.z
    const len = Math.hypot(dx, dz)
    if (len === 0) continue
    let traveled = carried
    while (traveled <= len) {
      const t = traveled / len
      samples.push({
        x: a.x + dx * t,
        z: a.z + dz * t,
        px: -dz / len,
        pz: dx / len,
      })
      traveled += spacing
    }
    carried = traveled - len
  }
  return samples
}

function addPost(data, x, z, height, size, color) {
  const y = terrainHeight(x, z)
  addBox(data, [x - size, y, z - size], [x + size, y + height, z + size], color)
}

function buildCourse(stage) {
  const data = []
  for (const sample of samplePolyline(stage.points, 18)) {
    addPost(data, sample.x + sample.px * stage.halfWidth, sample.z + sample.pz * stage.halfWidth, 2.2, 0.28, POST)
    addPost(data, sample.x - sample.px * stage.halfWidth, sample.z - sample.pz * stage.halfWidth, 2.2, 0.28, POST)
  }
  const points = stage.points
  const a = points[points.length - 2]
  const b = points[points.length - 1]
  const dx = b.x - a.x
  const dz = b.z - a.z
  const len = Math.hypot(dx, dz) || 1
  const px = -dz / len
  const pz = dx / len
  const left = { x: b.x + px * stage.halfWidth, z: b.z + pz * stage.halfWidth }
  const right = { x: b.x - px * stage.halfWidth, z: b.z - pz * stage.halfWidth }
  addPost(data, left.x, left.z, 5, 0.4, GATE_BLACK)
  addPost(data, right.x, right.z, 5, 0.4, GATE_YELLOW)
  const barY = terrainHeight(b.x, b.z) + 4.2
  const segments = 8
  for (let i = 0; i < segments; i++) {
    const t0 = i / segments
    const t1 = (i + 1) / segments
    const x0 = left.x + (right.x - left.x) * t0
    const z0 = left.z + (right.z - left.z) * t0
    const x1 = left.x + (right.x - left.x) * t1
    const z1 = left.z + (right.z - left.z) * t1
    const color = i % 2 === 0 ? GATE_YELLOW : GATE_BLACK
    addBox(data, [Math.min(x0, x1) - 0.15, barY, Math.min(z0, z1) - 0.15], [Math.max(x0, x1) + 0.15, barY + 0.55, Math.max(z0, z1) + 0.15], color)
  }
  return new Float32Array(data)
}

function buildCarLocal() {
  const data = []
  addBox(data, [-0.85, 0.45, -1.8], [0.85, 1.05, 1.9], [0.74, 0.16, 0.12])
  addBox(data, [-0.62, 1.05, -0.45], [0.62, 1.7, 1.05], [0.16, 0.2, 0.24])
  const wheel = [0.12, 0.12, 0.13]
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
  return { buffer, count: data.length / 6 }
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
  const colorLoc = gl.getAttribLocation(program, "aColor")
  const viewLoc = gl.getUniformLocation(program, "uViewProj")
  const carLocal = buildCarLocal()
  const carBuffer = gl.createBuffer()
  let staticMeshes = []
  let eye = null
  let look = null
  let aspect = 1

  function bind(mesh) {
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer)
    gl.enableVertexAttribArray(posLoc)
    gl.enableVertexAttribArray(colorLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0)
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 24, 12)
    gl.drawArrays(gl.TRIANGLES, 0, mesh.count)
  }

  return {
    setStage(stage) {
      staticMeshes = [upload(gl, buildTerrain(stage)), upload(gl, buildCourse(stage))]
      eye = null
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
      const face = forward(run.car.heading)
      const desired = {
        x: run.car.x - face.x * 12,
        y: run.car.y + 6,
        z: run.car.z - face.z * 12,
      }
      if (!eye) eye = { ...desired }
      const blend = 1 - Math.exp(-8 * Math.max(0, dt))
      eye.x += (desired.x - eye.x) * blend
      eye.y += (desired.y - eye.y) * blend
      eye.z += (desired.z - eye.z) * blend
      look = {
        x: run.car.x + face.x * 8,
        y: run.car.y + 1.4,
        z: run.car.z + face.z * 8,
      }
      const viewProj = multiply(
        perspective(Math.PI / 3, aspect, 0.2, 800),
        lookAt(eye, look, { x: 0, y: 1, z: 0 }),
      )
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.55, 0.76, 0.95, 1)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.enable(gl.DEPTH_TEST)
      gl.disable(gl.CULL_FACE)
      gl.useProgram(program)
      gl.uniformMatrix4fv(viewLoc, false, new Float32Array(viewProj))
      for (const mesh of staticMeshes) bind(mesh)
      const carData = transformMesh(carLocal, run.car)
      gl.bindBuffer(gl.ARRAY_BUFFER, carBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, carData, gl.DYNAMIC_DRAW)
      bind({ buffer: carBuffer, count: carData.length / 6 })
    },
  }
}
