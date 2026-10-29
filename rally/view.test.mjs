import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRun, forward } from "./sim.js"
import { field } from "./stages.js"
import { projectCar, projectPoint, viewPose } from "./render.js"

function inLowerHalf(car, aspect) {
  const ndc = projectCar(car, aspect)
  assert.ok(Math.abs(ndc.x) < 0.35, `x ${ndc.x} aspect ${aspect}`)
  assert.ok(ndc.y < 0 && ndc.y > -0.45, `y ${ndc.y} aspect ${aspect}`)
  assert.ok(Math.abs(ndc.z) < 1, `z ${ndc.z}`)
}

const straight = createRun(field)
const pose = viewPose(straight.car)
assert.equal(pose.eye.x, 0)
assert.equal(pose.eye.y, 28)
assert.equal(pose.eye.z, -18)
assert.equal(pose.look.x, 0)
assert.equal(pose.look.z, 4)

for (const aspect of [1, 16 / 9, 9 / 16]) inLowerHalf(straight.car, aspect)

const farther = projectPoint(straight.car, 16 / 9, { x: 0, y: 1, z: 20 })
const bodyNow = projectPoint(straight.car, 16 / 9, { x: 0, y: 1, z: 0 })
assert.ok(farther.y > bodyNow.y)
const trunk = projectPoint(straight.car, 16 / 9, { x: 10, y: 0, z: 0 })
const crown = projectPoint(straight.car, 16 / 9, { x: 10, y: 8, z: 0 })
assert.ok(crown.y - trunk.y > 0.2)

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
assert.equal(turnedPose.eye.y, turnedCar.y + 28)
assert.equal(turnedPose.eye.z, turnedCar.z - 18)
assert.equal(turnedPose.look.x, turnedCar.x)
assert.equal(turnedPose.look.z, turnedCar.z + 4)
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
assert.equal(source.includes("0.78, 0.78, 0.8"), true)
