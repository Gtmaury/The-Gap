import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRun, forward, step } from "./sim.js"
import { field } from "./stages.js"
import { projectCar, projectPoint, viewPose } from "./render.js"

function nearCenter(car, aspect) {
  const ndc = projectCar(car, aspect)
  assert.ok(Math.abs(ndc.x) < 0.35, `x ${ndc.x} aspect ${aspect}`)
  assert.ok(Math.abs(ndc.y) < 0.35, `y ${ndc.y} aspect ${aspect}`)
  assert.ok(Math.abs(ndc.z) < 1, `z ${ndc.z}`)
}

const straight = createRun(field)
const pose = viewPose(straight.car)
assert.equal(pose.eye.x, 0)
assert.equal(pose.eye.y, 62)
assert.equal(pose.eye.z, -6)
assert.equal(pose.look.x, 0)
assert.equal(pose.look.z, 8)

for (const aspect of [1, 16 / 9, 9 / 16]) nearCenter(straight.car, aspect)

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

let turning = step(straight, { accelerate: true, brake: false, steer: 1 }, 0.4)
turning = step(turning, { accelerate: true, brake: false, steer: 1 }, 0.8)
assert.notEqual(turning.car.heading, 0)
for (const aspect of [1, 16 / 9]) nearCenter(turning.car, aspect)
aheadStaysUp(turning.car)

const source = readFileSync(new URL("./render.js", import.meta.url), "utf8")
assert.equal(source.includes("buildCourse"), false)
assert.equal(source.includes("GATE_YELLOW"), false)
assert.equal(source.includes("0.82, 0.08, 0.07"), true)
assert.equal(source.includes("0.78, 0.78, 0.8"), true)
