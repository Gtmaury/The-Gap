import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { buildRoute, buildTerrain, coverMesh } from "./render.js"
import { coverForChunk, propsForChunk } from "./scenery.js"
import { ASPHALT, DASH, ROUTE_HALF, SHOULDER, roadColor, routeCenter, routeClearance, solidRadius } from "./route.js"
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
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8")
assert.equal(routeSource.includes("0.62, 0.48, 0.28"), false)
assert.equal(render.includes("0.62, 0.48, 0.28"), false)
assert.equal(render.includes("buildRoute"), true)
assert.deepEqual(roadColor(6, 0), SHOULDER)
assert.deepEqual(roadColor(3, 0), ASPHALT)
assert.deepEqual(roadColor(0, 0), DASH)
assert.deepEqual(roadColor(0, 6), ASPHALT)
assert.match(css, /\.road[\s\S]*#38393f/)
assert.equal(routeClearance("pine") > routeClearance("rock"), true)

function coversZ(mesh, z) {
  let below = false
  let above = false
  for (let i = 2; i < mesh.length; i += 10) {
    if (mesh[i] < z - 1e-6) below = true
    if (mesh[i] > z + 1e-6) above = true
  }
  return below && above
}

for (const index of [0, 1]) {
  for (const z of [86, 94]) {
    assert.equal(coversZ(buildTerrain(field, index), z), true, `ground ${index} ${z}`)
    assert.equal(coversZ(buildRoute(field, index), z), true, `road ${index} ${z}`)
  }
}

function hasColor(mesh, color) {
  for (let i = 6; i < mesh.length; i += 10) {
    if (
      Math.abs(mesh[i] - color[0]) < 1e-5 &&
      Math.abs(mesh[i + 1] - color[1]) < 1e-5 &&
      Math.abs(mesh[i + 2] - color[2]) < 1e-5
    ) {
      return true
    }
  }
  return false
}

for (const place of places) {
  const ground = buildTerrain(place, 0)
  assert.equal(hasColor(ground, place.ground), true, `${place.id} ground`)
  assert.equal(hasColor(ground, place.patch), true, `${place.id} patch`)
}
const snowRoad = buildRoute(field, 0)
assert.equal(hasColor(snowRoad, ASPHALT), true)
assert.equal(hasColor(snowRoad, DASH), true)
assert.equal(hasColor(snowRoad, SHOULDER), true)
assert.equal(hasColor(snowRoad, field.patch), false)

const sim = readFileSync(new URL("./sim.js", import.meta.url), "utf8")
assert.equal(sim.includes("scenery"), false)
const main = readFileSync(new URL("./main.js", import.meta.url), "utf8")
assert.equal(main.includes("coverForChunk"), false)

function missesSolids(place, cover) {
  const solids = propsForChunk(place, 0)
  for (const prop of cover) {
    assert.equal(solids.some((solid) => solid.x === prop.x && solid.z === prop.z), false)
    assert.ok(Math.hypot(prop.x - place.start.x, prop.z - place.start.z) >= 10)
    assert.ok(Math.abs(prop.x - routeCenter(prop.z)) >= routeClearance(place.kind))
  }
}

const snowCover = coverForChunk(field, 0)
assert.equal(snowCover.filter((prop) => prop.kind === "mound").length, 24)
assert.equal(snowCover.filter((prop) => prop.kind === "shrub").length, 16)
assert.equal(propsForChunk(field, 0).length, 48)
missesSolids(field, snowCover)
for (const prop of snowCover) {
  const color = prop.kind === "mound" ? [0.82, 0.86, 0.9] : [0.18, 0.22, 0.2]
  assert.equal(hasColor(coverMesh(field, prop), color), true, prop.kind)
}

const forestCover = coverForChunk(forest, 0)
assert.equal(forestCover.filter((prop) => prop.kind === "undergrowth").length, 40)
assert.equal(forestCover.filter((prop) => prop.kind === "stump").length, 12)
assert.equal(propsForChunk(forest, 0).length, 80)
missesSolids(forest, forestCover)
for (const prop of forestCover) {
  const color = prop.kind === "undergrowth" ? [0.08, 0.2, 0.1] : [0.28, 0.16, 0.1]
  assert.equal(hasColor(coverMesh(forest, prop), color), true, prop.kind)
}

const rockCover = coverForChunk(rock, 0)
assert.equal(rockCover.filter((prop) => prop.kind === "rubble").length, 28)
assert.equal(propsForChunk(rock, 0).length, 36)
missesSolids(rock, rockCover)
for (const prop of rockCover) {
  assert.equal(hasColor(coverMesh(rock, prop), [0.16, 0.16, 0.17]), true)
}
