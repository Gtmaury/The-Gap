# Tasks

## 1. Mountain and snow handling

- [ ] 1.1 Give the field id `snow-mountain` with the same ±90 bounds and the same start pose. Implement `terrainHeight` as `28 * t * t` with the summit at `(0, 70)` and radius 160. In `step`, scale throttle by `0.65`, coast with drag `1.5`, add the slope acceleration from a 0.5 m height sample, clamp speed to `[0, 16]`, and keep a lateral velocity that decays with `exp(-2.5 * dt)`. Update `rally/view.test.mjs` so the camera offsets are relative to `car.y` and the 8 m vertical sample starts at the car's height. Verify `node --test rally/sim.test.mjs rally/view.test.mjs` shows the summit higher than the start, the start higher than `(0, -90)`, two seconds of uphill throttle still under speed 16, the same throttle downhill faster than uphill, a downhill coast from rest that gains speed, an uphill coast that stays stopped, braking to 0 without moving backward, a stopped steer that yaws without moving, a moving steer whose travel lags the nose, and the eye still 56 m above the car.

## 2. Trees on snow

- [ ] 2.1 Emit 48 pines and no rocks from the existing scatter, still at least 10 m from the start and with at least one tree ahead of it. Verify `node --test rally/scenery.test.mjs` passes.

## 3. Car and headlight on the slope

- [ ] 3.1 Set the ground and clear color to `[0.86, 0.89, 0.93]`. Pitch the car mesh by `atan(grade)` so a positive grade raises the nose, and rotate normals with that basis. Place each headlight vertex on `terrainHeight` at that vertex plus 0.08 m, with shade `0`. Keep the distant `viewPose` offsets. Update `rally/view.test.mjs` for the snow color and for the raised nose. Verify a local point 1 m ahead of the nose is higher than the car origin at the uphill start, and `node --test rally/view.test.mjs` passes.

## 4. Integration

- [ ] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs` and verify all three pass. Then open the rally and confirm the ground is snow and higher ahead of the car, the dark objects are trees with shaded faces, the headlight wedge stays bright on the snow, and steering rotates the car without yawing the camera.
