import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { propsFor } from "./scenery.js"
import { distanceToCourse } from "./sim.js"
import { stages } from "./stages.js"

for (const stage of stages) {
  const first = propsFor(stage)
  const second = propsFor(stage)
  const pines = first.filter((prop) => prop.kind === "pine")
  const rocks = first.filter((prop) => prop.kind === "rock")
  assert.equal(pines.length, 16, stage.name)
  assert.equal(rocks.length, 12, stage.name)
  assert.deepEqual(first, second)
  for (const prop of first) {
    assert.ok(distanceToCourse(prop.x, prop.z, stage) > stage.halfWidth + 4, stage.name)
  }
}

const sim = readFileSync(new URL("./sim.js", import.meta.url), "utf8")
assert.equal(sim.includes("scenery"), false)
