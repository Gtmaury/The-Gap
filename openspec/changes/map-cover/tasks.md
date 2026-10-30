# Tasks

## 1. Ground patches

- [ ] 1.1 Add `patch` on each place in `rally/stages.js`: snow `[0.72, 0.78, 0.84]`, forest `[0.06, 0.10, 0.07]`, rock `[0.18, 0.18, 0.20]`. In `buildTerrain`, paint a cell `patch` when `ix % 8 === 0` and `ground` otherwise. Verify `node --test rally/scenery.test.mjs` shows chunk 0 of each place contains that place's base color and its patch color, and the snow road of chunk 0 contains asphalt `[0.22, 0.23, 0.25]`, dash `[0.86, 0.84, 0.78]`, and shoulder `[0.45, 0.43, 0.38]` and does not contain `[0.72, 0.78, 0.84]`.

## 2. Pine heights

- [ ] 2.1 Set `height` to the solid index modulo 3 in `propsForChunk`. Scale only the vertical sizes in `pineMesh`: class 0 stays the current shape, class 1 is 1.18 times as tall, class 2 is 0.82 times as tall, and the wide cone stays radius 3. Verify `node --test rally/view.test.mjs rally/sim.test.mjs` shows two different apex heights among the snow pines of chunk 0 and among the forest pines of chunk 0, the snow cap on the highest vertices, the forest trunk and both greens with no `[0.92, 0.93, 0.9]`, and `PINE_RADIUS` still 3.

## 3. Spare-spot cover

- [ ] 3.1 Add `coverForChunk` from the same sorted spots, skipping the first `field.count`. Snow takes 24 mounds then 16 shrubs, forest 40 undergrowth cones then 12 stumps, rock 28 rubble pieces. Append their meshes in `buildScenery` with the colors and sizes in design.md. Leave `rally/main.js` reading solids from `propsForChunk` only. Verify `node --test rally/scenery.test.mjs rally/view.test.mjs` shows those counts, the cover colors, no shared position with a solid, each snow cover spot at least 10 m from the start and off the road by the pine clearance, rock cover without `[0.92, 0.93, 0.9]` or `[0.16, 0.32, 0.2]`, solid counts still 48, 80, and 36, and `main.js` does not call `coverForChunk`.

## 4. Integration

- [ ] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass.

## Workflow follow-up

- Archive the change after review.
