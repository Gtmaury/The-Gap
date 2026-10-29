# Tasks

## 1. Repeating snow height

- [x] 1.1 Replace `terrainHeight` with `14 + 10 * sin(2π z / 180)`, and set the field id to `snow-ribbon` with the same ±90 bounds as the first repeat, not as a wall. Verify `node --test rally/sim.test.mjs rally/view.test.mjs` shows the start higher than `z = -45`, a short step uphill higher than the start, height at `z` matching height at `z + 180` within `1e-6`, two seconds of uphill throttle still under speed 16, the same throttle downhill faster, and the eye still 56 m above the car.

## 2. Repeating trees and streamed snow

- [x] 2.1 Generate 48 pines and no rocks for each 180 m chunk, with chunk 0 keeping the 10 m start clearance and at least one tree ahead of the start. Draw the snow and the trees for every chunk overlapping `z` in `[car.z - 400, car.z + 800]`, and rebuild those buffers only when the set of chunks changes. Verify `node --test rally/scenery.test.mjs rally/view.test.mjs` shows the same trees for the same chunk, different `z` for the next chunk, no rocks, and a chunk window around `z = 200` that still includes snow ahead of the old 90 m edge.

## 3. Integration

- [x] 3.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs` and verify all three pass. Then drive the rally forward past the old edge and confirm snow and trees are still ahead, the car stays in the lower half, the headlight wedge stays bright, and steering rotates the car without yawing the camera.
