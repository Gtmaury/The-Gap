# Tasks

## 1. Three-quarter pose

- [x] 1.1 Move `viewPose` to an eye 28 m up and 18 m toward world `-z`, looking 4 m toward world `+z`, with no heading yaw. Update `rally/view.test.mjs` for those offsets, a car in the lower half, ground toward `+z` above the car, and an 8 m vertical whose top is above its base. Verify `node --test rally/view.test.mjs` passes.

## 2. Integration

- [x] 2.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs` and verify all three pass. Then open the rally and confirm the ground recedes toward the top of the screen, nearby pines show height instead of reading as flat hexagons, the car sits in the lower half, and steering still rotates the car without yawing the camera.
