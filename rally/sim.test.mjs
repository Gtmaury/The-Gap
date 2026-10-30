import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  TOP_SPEED,
  createRun,
  crossedFinish,
  forward,
  onCourse,
  restart,
  step,
  terrainHeight,
  totalTime,
} from "./sim.js"
import { stages } from "./stages.js"

const straight = {
  id: "straight",
  name: "Straight",
  halfWidth: 8,
  points: [
    { x: 0, z: 0 },
    { x: 0, z: 80 },
    { x: 0, z: 160 },
  ],
}

const idle = { accelerate: false, brake: false, steer: 0 }
const gas = { accelerate: true, brake: false, steer: 0 }
const brake = { accelerate: false, brake: true, steer: 0 }

let run = createRun(straight)
assert.equal(run.car.x, 0)
assert.equal(run.car.z, 0)
assert.equal(run.car.speed, 0)
assert.equal(run.car.heading, 0)
assert.equal(run.stageTime, 0)
assert.equal(run.penaltyTime, 0)
assert.equal(run.phase, "running")
assert.equal(Object.hasOwn(run, "car"), true)

run = step(run, gas, 2)
assert.equal(run.car.speed, TOP_SPEED)
assert.ok(run.car.z > 0)
run = step(run, gas, 1)
assert.equal(run.car.speed, TOP_SPEED)

run = step(run, brake, 2)
assert.equal(run.car.speed, 0)

run = createRun(straight)
const stoppedHeading = run.car.heading
run = step(run, { accelerate: false, brake: false, steer: 1 }, 1)
assert.equal(run.car.speed, 0)
assert.equal(run.car.heading, stoppedHeading)

run = createRun(straight)
run = step(run, gas, 0.2)
assert.ok(run.car.speed > 0)
const movingHeading = run.car.heading
const before = forward(movingHeading)
run = step(run, { accelerate: true, brake: false, steer: 1 }, 0.5)
assert.ok(run.car.heading > movingHeading)
const after = forward(run.car.heading)
assert.ok(after.x < before.x)

run = createRun(straight)
run = step(run, gas, 0.5)
assert.notEqual(terrainHeight(0, 0), terrainHeight(run.car.x, run.car.z))
assert.equal(run.car.y, terrainHeight(run.car.x, run.car.z))

assert.equal(onCourse(0, 40, straight), true)
assert.equal(onCourse(8, 40, straight), true)
assert.equal(onCourse(8.01, 40, straight), false)

run = createRun(straight)
run = {
  ...run,
  car: { ...run.car, x: 20, y: terrainHeight(20, 0) },
}
run = step(run, brake, 0.4)
assert.ok(Math.abs(run.penaltyTime - 0.4) < 1e-9)
assert.ok(Math.abs(run.stageTime - 0.4) < 1e-9)

run = createRun(straight)
run = step(run, idle, 0.4)
assert.equal(run.penaltyTime, 0)
assert.ok(Math.abs(run.stageTime - 0.4) < 1e-9)

run = createRun(straight)
run = {
  ...run,
  car: { x: 0, z: 159, y: 0, heading: 0, speed: 10 },
  stageTime: 4,
  penaltyTime: 1,
}
run = step(run, gas, 0.2)
assert.equal(run.phase, "finished")
assert.equal(crossedFinish(run.car.x, run.car.z, straight), true)
assert.ok(Math.abs(run.stageTime - 4.2) < 1e-9)
assert.ok(Math.abs(run.penaltyTime - 1) < 1e-9)
assert.equal(totalTime(run), run.stageTime + run.penaltyTime)
const frozen = step(run, { accelerate: true, brake: false, steer: 1 }, 1)
assert.equal(frozen.car.x, run.car.x)
assert.equal(frozen.car.z, run.car.z)
assert.equal(frozen.car.speed, run.car.speed)
assert.equal(frozen.car.heading, run.car.heading)
assert.equal(frozen.stageTime, run.stageTime)
assert.equal(frozen.penaltyTime, run.penaltyTime)

run = createRun(straight)
run = {
  ...run,
  car: { x: 20, z: 159, y: 0, heading: 0, speed: 10 },
}
const missed = step(run, gas, 0.2)
assert.equal(missed.phase, "running")
assert.ok(missed.car.z > 159)
assert.ok(missed.car.speed > 0)

let mid = createRun(straight)
mid = step(mid, gas, 1)
assert.ok(mid.car.speed > 0)
assert.ok(mid.stageTime > 0)
for (const again of [restart(mid), restart(frozen)]) {
  const fresh = createRun(straight)
  assert.equal(again.car.speed, 0)
  assert.equal(again.stageTime, 0)
  assert.equal(again.penaltyTime, 0)
  assert.equal(again.phase, "running")
  assert.equal(again.car.x, fresh.car.x)
  assert.equal(again.car.z, fresh.car.z)
  assert.equal(again.car.heading, fresh.car.heading)
  assert.equal(again.stage, straight)
}

assert.equal(stages.length, 3)
assert.equal(new Set(stages.map((stage) => stage.name)).size, 3)
for (const stage of stages) {
  assert.equal(stage.halfWidth, 8)
  assert.ok(stage.points.length >= 2)
  const start = stage.points[0]
  const finish = stage.points[stage.points.length - 1]
  assert.ok(Math.hypot(finish.x - start.x, finish.z - start.z) > stage.halfWidth)
  let maxTurn = 0
  for (let i = 1; i < stage.points.length - 1; i++) {
    const ax = stage.points[i].x - stage.points[i - 1].x
    const az = stage.points[i].z - stage.points[i - 1].z
    const bx = stage.points[i + 1].x - stage.points[i].x
    const bz = stage.points[i + 1].z - stage.points[i].z
    const cos = (ax * bx + az * bz) / (Math.hypot(ax, az) * Math.hypot(bx, bz))
    maxTurn = Math.max(maxTurn, (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI)
  }
  assert.ok(maxTurn < 45, `${stage.name} corner ${maxTurn}`)
}

const source = readFileSync(new URL("./sim.js", import.meta.url), "utf8")
assert.equal(source.includes("localStorage"), false)
assert.equal(source.includes("sessionStorage"), false)
