import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { propsFor } from "./scenery.js"
import { field } from "./stages.js"

const first = propsFor(field)
const second = propsFor(field)
const pines = first.filter((prop) => prop.kind === "pine")
const rocks = first.filter((prop) => prop.kind === "rock")
assert.equal(pines.length, 28)
assert.equal(rocks.length, 20)
assert.deepEqual(first, second)
assert.ok(first.some((prop) => prop.z > field.start.z))
for (const prop of first) {
  assert.ok(Math.hypot(prop.x - field.start.x, prop.z - field.start.z) >= 10)
  assert.ok(prop.x >= field.minX && prop.x <= field.maxX)
  assert.ok(prop.z >= field.minZ && prop.z <= field.maxZ)
}

const sim = readFileSync(new URL("./sim.js", import.meta.url), "utf8")
assert.equal(sim.includes("scenery"), false)
