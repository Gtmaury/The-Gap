import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { RIBBON_PERIOD, TOP_SPEED, YAW_RATE, createRun, forward, restart, step, terrainHeight } from "./sim.js"
import { field } from "./stages.js"

const idle = { accelerate: false, brake: false, steer: 0 }
const gas = { accelerate: true, brake: false, steer: 0 }
const brake = { accelerate: false, brake: true, steer: 0 }

assert.equal(TOP_SPEED, 16)
assert.equal(field.start.x, 0)
assert.equal(field.start.z, 0)
assert.equal(field.start.heading, 0)
assert.equal(field.maxX - field.minX, 180)
assert.equal(field.maxZ - field.minZ, 180)

let run = createRun(field)
assert.equal(run.car.x, 0)
assert.equal(run.car.z, 0)
assert.equal(run.car.speed, 0)
assert.equal(run.car.heading, 0)
assert.ok(run.car.y > terrainHeight(0, -45))
assert.equal(run.car.y, terrainHeight(0, 0))
assert.ok(Math.abs(terrainHeight(12, 40) - terrainHeight(12, 40 + RIBBON_PERIOD)) < 1e-6)
assert.equal(field.id, "snow-ribbon")
assert.equal(Object.hasOwn(run, "stageTime"), false)
assert.equal(Object.hasOwn(run, "penaltyTime"), false)
assert.equal(Object.hasOwn(run, "phase"), false)
assert.equal(run.field, field)

const uphill = step(run, gas, 2)
assert.ok(uphill.car.speed > 0)
assert.ok(uphill.car.speed < TOP_SPEED)
assert.ok(uphill.car.z > 0)
assert.ok(uphill.car.y > run.car.y)
const downhillStart = createRun(field)
downhillStart.car.heading = Math.PI
const downhill = step(downhillStart, gas, 2)
assert.ok(downhill.car.speed > uphill.car.speed)
run = step(uphill, gas, 1)
assert.equal(Object.hasOwn(run, "phase"), false)

run = step(run, brake, 2)
assert.equal(run.car.speed, 0)

run = createRun(field)
run = step(run, { accelerate: false, brake: false, steer: 1 }, 0.2)
assert.equal(run.car.speed, 0)
assert.equal(run.car.x, 0)
assert.equal(run.car.z, 0)
assert.ok(Math.abs(run.car.heading - YAW_RATE * 0.2) < 1e-9)
assert.equal(YAW_RATE, 2.6)

run = createRun(field)
run = step(run, gas, 0.2)
const movingZ = run.car.z
run = step(run, brake, 2)
assert.equal(run.car.speed, 0)
assert.ok(run.car.z >= movingZ)

run = createRun(field)
run = step(run, gas, 0.2)
assert.ok(run.car.speed > 0)
const movingHeading = run.car.heading
const before = forward(movingHeading)
run = step(run, { accelerate: true, brake: false, steer: 1 }, 0.5)
assert.ok(run.car.heading > movingHeading)
const after = forward(run.car.heading)
assert.ok(after.x < before.x)

run = createRun(field)
run = step(run, gas, 0.5)
assert.equal(run.car.y, terrainHeight(run.car.x, run.car.z))

const coastDown = createRun(field)
coastDown.car.heading = Math.PI
const rolled = step(coastDown, idle, 1)
assert.ok(rolled.car.speed > 0)
assert.ok(rolled.car.z < 0)
const held = step(createRun(field), idle, 1)
assert.equal(held.car.speed, 0)

run = createRun(field)
run = step(run, gas, 0.4)
run = step(run, { accelerate: true, brake: false, steer: 1 }, 0.4)
const travel = Math.atan2(-run.car.vx, run.car.vz)
let lag = Math.abs(travel - run.car.heading)
if (lag > Math.PI) lag = Math.PI * 2 - lag
assert.ok(lag > 0.05, `lag ${lag}`)

run = createRun(field)
for (let i = 0; i < 40; i++) run = step(run, gas, 0.5)
assert.equal(Object.hasOwn(run, "phase"), false)
assert.equal(Object.hasOwn(run, "penaltyTime"), false)
assert.ok(run.car.speed > 0)

let mid = createRun(field)
mid = step(mid, gas, 1)
assert.ok(mid.car.speed > 0)
const again = restart(mid)
const fresh = createRun(field)
assert.equal(again.car.speed, 0)
assert.equal(again.car.x, fresh.car.x)
assert.equal(again.car.z, fresh.car.z)
assert.equal(again.car.heading, fresh.car.heading)
assert.equal(again.field, field)
assert.equal(step(again, idle, 0.2).car.speed, 0)

const source = readFileSync(new URL("./sim.js", import.meta.url), "utf8")
assert.equal(source.includes("localStorage"), false)
assert.equal(source.includes("sessionStorage"), false)
assert.equal(source.includes("onCourse"), false)
assert.equal(source.includes("crossedFinish"), false)
