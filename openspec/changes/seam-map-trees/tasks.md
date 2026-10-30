# Tasks

## 1. Closed join

- [x] 1.1 Build each chunk's road from 6 m before its span through 6 m after it, on the existing 6 m lattice, and its ground from 4.5 m before through 4.5 m after, on the existing 4.5 m grid. Leave scenery inside the span. Verify `node --test rally/scenery.test.mjs` shows that the span ending at z = 90 and the span starting at z = 90 each include ground and road points at z = 86 and z = 94.

## 2. Map pines

- [x] 2.1 Replace the single gray cone with `pineMesh`. Snow uses body `[0.16, 0.32, 0.2]` and cap `[0.92, 0.93, 0.9]`, with the cap on the highest vertices. Forest uses trunk `[0.28, 0.16, 0.1]`, lower green `[0.1, 0.28, 0.12]`, and upper green `[0.18, 0.4, 0.16]`, and does not use the white cap. Keep `PINE_RADIUS` at 3 and the rock mesh on the stone color. Verify `node --test rally/view.test.mjs rally/sim.test.mjs` shows the snow cap above the body, the forest trunk and both greens, the 3 m circle, and no snow cap on the rock mesh.

## 3. Integration

- [x] 3.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass. Then drive the snow place in day across the join near z = 90 and confirm the asphalt has no snow line, the pines show a white cap, and the car still stops on the same trees.
