# Tasks

## 1. Scenery placement

- [x] 1.1 Add `rally/scenery.js` with `propsFor(stage)` returning 16 pines and 12 rocks, deterministic for a stage, and each prop farther than `halfWidth + 4` from the course polyline. Verify `node rally/scenery.test.mjs` covers the counts, a second call returning the same positions, and the distance check via `distanceToCourse`.
- [x] 1.2 Leave `rally/sim.js` driving rules unchanged so a pine or rock cannot alter speed or penalty. Verify `node rally/sim.test.mjs` still passes and `rally/sim.js` does not import the scenery module.

## 2. Gray field

- [x] 2.1 In `rally/render.js`, color the ground and the clear color in grays only, draw the pines as dark cones and the rocks as dark lumps from `propsFor`, darken the course posts, keep the finish gate black and yellow, and lighten the car body. Verify in the browser, on a running stage, that the ground is gray, more than one pine and more than one rock are visible, and the finish gate is visibly different from the posts and the pines.

## 3. Overhead camera

- [x] 3.1 Replace the chase camera with an eye 48 m up and 10 m behind the car, looking 12 m ahead, at a 0.8 radian field of view. The 4 m / 32 m / 0.7 combination leaves the car outside the frame. Verify in the browser that the car is seen from above, turning keeps the ground ahead in view, and the stage list still hides the canvas until a stage is chosen.

## 4. Headlight wedge

- [x] 4.1 Draw an unlit triangle wedge on the ground each frame: apex at the car, wide end 16 m ahead and 7 m to either side, brighter than the ground gray, lifted about 0.08 m. Verify in the browser that the wedge points along the car heading, swings when the car turns, and is absent on the stage list.

## Workflow follow-up

- Archive this change after the tasks above are done and reviewed.
