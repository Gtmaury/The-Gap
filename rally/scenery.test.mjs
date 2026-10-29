import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { propsForChunk } from "./scenery.js"
import { ROUTE_HALF, routeCenter, routeClearance, solidRadius } from "./route.js"
import { field, places } from "./stages.js"

const first = propsForChunk(field, 0)
const second = propsForChunk(field, 0)
const pines = first.filter((prop) => prop.kind === "pine")
const rocks = first.filter((prop) => prop.kind === "rock")
assert.equal(pines.length, 48)
assert.equal(rocks.length, 0)
assert.equal(first.length, 48)
assert.deepEqual(first, second)
assert.ok(first.some((prop) => prop.z > field.start.z))
for (const prop of first) {
  assert.ok(Math.hypot(prop.x - field.start.x, prop.z - field.start.z) >= 10)
  assert.ok(prop.x >= field.minX && prop.x <= field.maxX)
  assert.ok(prop.z >= field.minZ && prop.z < field.maxZ)
}

const next = propsForChunk(field, 1)
assert.equal(next.length, 48)
assert.equal(next.some((prop) => prop.kind === "rock"), false)
assert.deepEqual(next, propsForChunk(field, 1))
assert.ok(next.every((prop) => prop.z >= field.maxZ && prop.z < field.maxZ + 180))
assert.ok(Math.min(...next.map((prop) => prop.z)) > Math.max(...first.map((prop) => prop.z)))

const forest = places.find((place) => place.id === "night-forest")
const rock = places.find((place) => place.id === "night-rock")
for (const place of places) {
  const chunk = propsForChunk(place, 0)
  assert.equal(chunk.length, place.count)
  assert.deepEqual(chunk, propsForChunk(place, 0))
  assert.ok(chunk.some((prop) => prop.z > place.start.z))
  for (const prop of chunk) {
    assert.equal(prop.kind, place.kind)
    assert.ok(Math.hypot(prop.x - place.start.x, prop.z - place.start.z) >= 10)
  }
}
const forestPines = propsForChunk(forest, 0).filter((prop) => prop.kind === "pine")
const snowPines = first.filter((prop) => prop.kind === "pine")
assert.ok(forestPines.length > snowPines.length)
assert.equal(propsForChunk(forest, 0).some((prop) => prop.kind === "rock"), false)
assert.ok(propsForChunk(rock, 0).some((prop) => prop.kind === "rock"))
assert.equal(routeCenter(field.start.z), 0)
assert.ok(Math.abs(routeCenter(40) - routeCenter(40 + 180)) < 1e-6)
for (const place of places) {
  for (const prop of propsForChunk(place, 0)) {
    const gap = Math.abs(prop.x - routeCenter(prop.z))
    assert.ok(gap >= ROUTE_HALF + solidRadius(prop.kind) + 0.5, `${place.id} ${gap}`)
  }
}
const routeSource = readFileSync(new URL("./route.js", import.meta.url), "utf8")
const render = readFileSync(new URL("./render.js", import.meta.url), "utf8")
assert.equal(routeSource.includes("0.62, 0.48, 0.28"), true)
assert.equal(render.includes("buildRoute"), true)
assert.equal(render.includes("ROUTE_COLOR"), true)
assert.equal(routeClearance("pine") > routeClearance("rock"), true)

const sim = readFileSync(new URL("./sim.js", import.meta.url), "utf8")
assert.equal(sim.includes("scenery"), false)
