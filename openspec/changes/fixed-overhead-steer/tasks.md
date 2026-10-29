# Tasks

## 1. Fixed overhead pose

- [x] 1.1 Lock `viewPose` to a world offset of 6 m toward `-z` and 62 m up, looking 8 m toward `+z`, with no heading yaw. Update `rally/view.test.mjs` so a turned car stays near center, the eye offset ignores heading, and a point ahead of that car is not straight up the screen. Verify `node --test rally/view.test.mjs` passes.

## 2. Steering from a stop

- [x] 2.1 Apply steering at speed zero and set `YAW_RATE` to 2.6. Keep W as forward acceleration and S as a brake that stops at zero. Update `rally/sim.test.mjs` and verify `node --test rally/sim.test.mjs` passes, including a one-second steer from rest and a brake that does not reverse.

## 3. Integration

- [x] 3.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs` and verify all three pass. Then drive the page: hold A from a stop and verify the car rotates on screen while the field keeps its orientation, then hold W and D and verify the car accelerates along its new heading and can travel diagonally without the camera yawing.
