import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRun, forward, terrainHeight } from "./sim.js"
import { field, places } from "./stages.js"
import { buildCarLocal, buildScenery, carPoint, chunksAround, headlightAmount, lightFactor, pineMesh, projectCar, projectPoint, viewPose } from "./render.js"

function inLowerHalf(car, aspect) {
  const ndc = projectCar(car, aspect)
  assert.ok(Math.abs(ndc.x) < 0.35, `x ${ndc.x} aspect ${aspect}`)
  assert.ok(ndc.y < 0 && ndc.y > -0.45, `y ${ndc.y} aspect ${aspect}`)
  assert.ok(Math.abs(ndc.z) < 1, `z ${ndc.z}`)
}

const straight = createRun(field)
const pose = viewPose(straight.car)
assert.equal(pose.eye.x, 0)
assert.equal(pose.eye.y, straight.car.y + 43)
assert.equal(pose.eye.z, straight.car.z - 47)
assert.equal(pose.look.x, 0)
assert.equal(pose.look.y, straight.car.y + 0.5)
assert.equal(pose.look.z, straight.car.z + 16)

for (const aspect of [1, 16 / 9, 9 / 16]) inLowerHalf(straight.car, aspect)

const farther = projectPoint(straight.car, 16 / 9, { x: 0, y: 1, z: 20 })
const bodyNow = projectPoint(straight.car, 16 / 9, { x: 0, y: 1, z: 0 })
assert.ok(farther.y > bodyNow.y)
const trunk = projectPoint(straight.car, 16 / 9, { x: 10, y: straight.car.y, z: 0 })
const crown = projectPoint(straight.car, 16 / 9, { x: 10, y: straight.car.y + 8, z: 0 })
assert.ok(crown.y - trunk.y > 0.08)

function aheadStaysUp(car) {
  const face = forward(car.heading)
  const body = projectPoint(car, 16 / 9, { x: car.x, y: car.y + 1, z: car.z })
  const ahead = projectPoint(car, 16 / 9, {
    x: car.x + face.x * 6,
    y: car.y + 1,
    z: car.z + face.z * 6,
  })
  assert.ok(ahead.y > body.y)
  assert.ok(Math.abs(ahead.x - body.x) < 0.05)
}

aheadStaysUp(straight.car)

const turnedCar = { ...straight.car, heading: Math.PI / 4 }
const turnedPose = viewPose(turnedCar)
assert.equal(turnedPose.eye.x, turnedCar.x)
assert.equal(turnedPose.eye.y, turnedCar.y + 43)
assert.equal(turnedPose.eye.z, turnedCar.z - 47)
assert.equal(turnedPose.look.x, turnedCar.x)
assert.equal(turnedPose.look.z, turnedCar.z + 16)
for (const aspect of [1, 16 / 9]) inLowerHalf(turnedCar, aspect)

const face = forward(turnedCar.heading)
const body = projectPoint(turnedCar, 16 / 9, { x: turnedCar.x, y: turnedCar.y + 1, z: turnedCar.z })
const ahead = projectPoint(turnedCar, 16 / 9, {
  x: turnedCar.x + face.x * 6,
  y: turnedCar.y + 1,
  z: turnedCar.z + face.z * 6,
})
assert.ok(Math.abs(ahead.x - body.x) > 0.05)

const source = readFileSync(new URL("./render.js", import.meta.url), "utf8")
assert.equal(source.includes("buildCourse"), false)
assert.equal(source.includes("GATE_YELLOW"), false)
assert.equal(source.includes("0.82, 0.08, 0.07"), true)
assert.equal(source.includes("0.78, 0.78, 0.8"), false)
assert.equal(source.includes("0.86, 0.89, 0.93"), false)
assert.equal(source.includes("0.05, 0.06, 0.10"), true)
const aheadLight = { x: 0, y: terrainHeight(field, 0, 4), z: 4 }
const sideLight = { x: 4, y: terrainHeight(field, 4, 0), z: 0 }
const farLight = { x: 0, y: terrainHeight(field, 0, 20), z: 20 }
assert.ok(headlightAmount(straight.car, aheadLight, field) > headlightAmount(straight.car, sideLight, field))
assert.equal(headlightAmount(straight.car, farLight, field), headlightAmount(straight.car, sideLight, field))
const noseTurned = { ...straight.car, heading: -Math.PI / 2 }
assert.ok(headlightAmount(noseTurned, sideLight, field) > headlightAmount(noseTurned, aheadLight, field))
assert.equal(source.includes("buildWedge"), false)
const nose = carPoint(straight.car, [0, 0, 1], field)
assert.ok(nose.y > straight.car.y, `nose ${nose.y} car ${straight.car.y}`)
const windowAt200 = chunksAround(200)
assert.ok(windowAt200.some((index) => -90 + 180 * index >= 90), windowAt200.join(","))
assert.equal(source.includes("aNormal"), true)
assert.equal(source.includes("mix(1.0, lit, vShade)"), true)

const upward = lightFactor([0, 1, 0])
const downward = lightFactor([0, -1, 0])
const away = lightFactor([-0.15, -0.9, 0.35])
assert.ok(upward > downward, `up ${upward} down ${downward}`)
assert.ok(upward > away, `up ${upward} away ${away}`)
assert.ok(lightFactor([0, 1, 0], true) > upward)
assert.equal(headlightAmount(straight.car, aheadLight, field, true), headlightAmount(straight.car, sideLight, field, true))

function meshSpan(kind) {
  const mesh = buildCarLocal(kind)
  let maxY = -Infinity
  let maxZ = -Infinity
  const colors = new Set()
  for (let i = 0; i < mesh.length; i += 10) {
    maxY = Math.max(maxY, mesh[i + 1])
    maxZ = Math.max(maxZ, mesh[i + 2])
    colors.add(`${mesh[i + 6]},${mesh[i + 7]},${mesh[i + 8]}`)
  }
  return { maxY, maxZ, colors }
}

const hatch = meshSpan("hatch")
const coupe = meshSpan("coupe")
const wagon = meshSpan("wagon")
assert.ok(hatch.colors.has("0.9,0.9,0.92"))
assert.ok(coupe.colors.has("0.75,0.18,0.16"))
assert.ok(coupe.maxZ > hatch.maxZ)
assert.ok(wagon.colors.has("0.18,0.28,0.48"))
assert.ok(wagon.maxY > hatch.maxY)

function pineColors(place) {
  const mesh = pineMesh(place)
  let maxY = -Infinity
  let capY = -Infinity
  const colors = new Set()
  for (let i = 0; i < mesh.length; i += 10) {
    const y = mesh[i + 1]
    const color = `${mesh[i + 6]},${mesh[i + 7]},${mesh[i + 8]}`
    maxY = Math.max(maxY, y)
    colors.add(color)
    if (color === "0.92,0.93,0.9") capY = Math.max(capY, y)
  }
  return { maxY, capY, colors }
}

const snowPine = pineColors(field)
const forestPlace = places.find((place) => place.id === "night-forest")
const forestPine = pineColors(forestPlace)
assert.ok(snowPine.colors.has("0.16,0.32,0.2"))
assert.ok(snowPine.colors.has("0.92,0.93,0.9"))
assert.equal(snowPine.capY, snowPine.maxY)
assert.ok(forestPine.colors.has("0.28,0.16,0.1"))
assert.ok(forestPine.colors.has("0.1,0.28,0.12"))
assert.ok(forestPine.colors.has("0.18,0.4,0.16"))
assert.equal(forestPine.colors.has("0.92,0.93,0.9"), false)
const rockPlace = places.find((place) => place.id === "night-rock")
const rockMesh = buildScenery(rockPlace, 0)
let rockStone = false
let rockCap = false
for (let i = 6; i < rockMesh.length; i += 10) {
  const [r, g, b] = [rockMesh[i], rockMesh[i + 1], rockMesh[i + 2]]
  if (Math.abs(r - 0.16) < 1e-5 && Math.abs(g - 0.16) < 1e-5 && Math.abs(b - 0.17) < 1e-5) rockStone = true
  if (Math.abs(r - 0.92) < 1e-5 && Math.abs(g - 0.93) < 1e-5 && Math.abs(b - 0.9) < 1e-5) rockCap = true
}
assert.equal(rockStone, true)
assert.equal(rockCap, false)
