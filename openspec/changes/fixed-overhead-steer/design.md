# Design

## Context

`viewPose` in `rally/render.js` places the eye 6 m behind the car's heading and 62 m up, and looks 8 m ahead of that heading. After a turn, a point in front of the car stays directly above the car on screen, so the field yaws and the nose stays up. `step` in `rally/sim.js` applies `YAW_RATE` (1.8 rad/s) only when `speed > 0`. W and S already accelerate and brake, and speed never goes below 0. See proposal.md for why the perspective and the steer rule change.

## Goals / Non-Goals

**Goals:**

- One camera pose whose yaw is independent of heading, using the current height and tilt.
- Steering that changes heading from a stop and is obvious within a second on that view.

**Non-Goals:**

- A new camera height, reverse gear, strafing, or a HUD.
- Collision, or any change under `game/`.

## Decisions

### Lock the overhead offset to world axes

`viewPose` stops using `forward(heading)`. The eye is `(car.x, car.y + 62, car.z - 6)`. The look point is `(car.x, car.y + 0.5, car.z + 8)`. Those are the same distances as today, applied along world Z instead of along the nose. Screen up stays world `+z`. Heading 0 still points up the screen. Any other heading rotates the car and the headlight wedge, and the travel stays diagonal.

The follow smoothing in `draw` stays. It smooths position only, because the desired pose no longer depends on heading.

`rally/view.test.mjs` drops the assertion that a point ahead of the car stays on the vertical screen axis after a turn. It asserts instead that the eye's world offset is `(0, 62, -6)` at heading 0 and at a turned heading, that the car stays near the center, and that a point ahead of a turned car is no longer straight above it.

Alternative: keep yaw-follow and only speed up steering. The car would still point up the screen, which is the perspective the reference does not use.

### Steer at rest, and turn faster

`step` applies `steer * YAW_RATE * dt` whenever `steer` is not 0, including when speed is 0. `YAW_RATE` becomes 2.6 rad/s. One second of a full steer from rest changes heading by 2.6 rad, which is a large on-screen rotation under the fixed camera. W, S, `TOP_SPEED` 16, and the clamp at speed 0 stay. `rally/main.js` already maps A/D and the arrows to `steer`, so it does not change.

`rally/sim.test.mjs` today expects a steer at rest to leave heading unchanged. That assertion is replaced: steer at rest changes heading and leaves speed at 0, one second of steer changes heading by `YAW_RATE`, and braking still stops at 0.

Alternative: keep 1.8 rad/s and only remove the speed check. That would steer from rest, and the user asked to be able to do more with WASD, so the rate goes up as well.

## Risks / Trade-offs

- [Driving toward world `-z` shows the rear of the car more than the nose] → Accepted. A fixed tilt is the reference perspective. The car stays near the center because the look point is still 8 m toward world `+z`.
- [2.6 rad/s feels sharp] → The test locks the rate. If it is too sharp after a drive, the rate can move without changing the spec, as long as one second is still a clear angle.
- [The old view test fails] → Replace it in the same change as `viewPose`.

## Migration Plan

Static page. No saved data. Revert `rally/render.js`, `rally/sim.js`, and their tests to restore yaw-follow and steer-only-while-moving.
