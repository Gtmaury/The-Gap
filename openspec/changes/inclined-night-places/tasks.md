# Tasks

## 1. Inclined camera

- [x] 1.1 Move `viewPose` to eye `(car.x, car.y + 29, car.z - 46)` and look `(car.x, car.y + 0.5, car.z + 24)`, and extend the chunk window ahead of the car from 800 m to 1200 m. Verify `node --test rally/view.test.mjs` shows the eye 29 m above the car and 46 m behind it, the same offset after a turn, the car in the lower half, a point ahead of the car off the vertical axis after a diagonal heading, and a chunk window around `z = 200` that still includes ground ahead of `z = 90`.

## 2. Night lighting

- [x] 2.1 Set the moon to ambient `0.15`, diffuse `0.55`, and direction `(0.25, 0.72, -0.45)`, and set the clear color to the night sky `[0.05, 0.06, 0.10]`. Add a headlight term that brightens ground within 1.5 m of the surface inside the 16 m by 7 m cone, follows heading, and leaves shade `0` fully bright. Verify `node --test rally/view.test.mjs` shows an upward face brighter than a face pointing away from the moon, the daylight snow color `0.86, 0.89, 0.93` absent, a point 8 m ahead of the nose brighter than a point 8 m to the side, and that pair swapped after the nose turns.

## 3. Three places

- [x] 3.1 Add night snow, night forest, and night rock, and start the page on night snow. Give them the ridges, grips, ground colors, and scenery counts from `design.md`, with height and grip read from the active place. Keys `1`, `2`, and `3` restart on that place. Verify `node --test rally/sim.test.mjs rally/scenery.test.mjs` shows the snow start higher than `z = -45`, each height matching 180 m ahead within `1e-6`, forest gentler than snow and rock steeper at the start, forest gaining speed faster than snow and rock slower on the crest at `z = 45`, snow with 48 pines and no rocks, forest with more pines and no rocks, rock with rocks, chunk 0 clearance of 10 m, and one prop ahead of each start.

## 4. Integration

- [x] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs` and verify all three pass. Then drive night snow, switch to night forest with `2` and night rock with `3`, and confirm each place keeps ground and its own scenery past the old edge, the car stays in the lower half, the horizon stays near the top, the headlight wedge stays bright, the ground in the cone is brighter than the ground beside it, and steering rotates the car without yawing the camera.
