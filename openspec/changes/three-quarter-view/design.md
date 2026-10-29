# Design

## Context

`viewPose` in `rally/render.js` puts the eye at `(car.x, car.y + 62, car.z - 6)` and looks at `(car.x, car.y + 0.5, car.z + 8)`. The sight line is about 77 degrees above the horizon, so an 8 m cone reads as a hexagon and the car reads as a roof. Yaw is already independent of heading. The field of view is `0.8` radians. See proposal.md for why the pitch changes. Pine meshes, the headlight wedge, and `rally/sim.js` stay.

## Goals / Non-Goals

**Goals:**

- One world-locked pose whose pitch is about 51 degrees above the horizon.
- The car in the lower half, farther ground toward the top of the screen, and an 8 m vertical that reads as height.

**Non-Goals:**

- New tree shapes, a smaller headlight, a vignette, or a yaw that follows the car.
- A change to the field of view unless the car leaves the frame at `0.8`.

## Decisions

### Pull the eye down and back

`viewPose` becomes eye `(car.x, car.y + 28, car.z - 18)` and look `(car.x, car.y + 0.5, car.z + 4)`. The horizontal run is 22 m and the vertical drop is 27.5 m, so the angle above the horizon is `atan2(27.5, 22)`, about 51 degrees. Screen up stays world `+z`. Heading still does not enter the pose. The existing position smoothing in `draw` stays.

A projection check with the current `perspective(0.8)` and `lookAt` puts the car near NDC `(0, -0.21)` at 16:9, a point 20 m toward `+z` about 0.88 NDC above the car, and an 8 m vertical 10 m to the side about 0.38 NDC tall. Those are the acceptance numbers for `rally/view.test.mjs`.

Replace the assertions that the eye is at 62 m and that the car's NDC y is within 0.35 of the center. Assert the new offsets at heading 0 and at a turned heading, that the car's NDC y is below 0 and above -0.45, that `|ndc.x| < 0.35`, that world `+z` is above the car, and that the 8 m vertical's top is above its base by more than 0.2 NDC. Keep the check that a diagonal heading is not forced straight up the screen.

Alternative: only widen the field of view and leave the eye at 62 m. The pitch would stay near 77 degrees, and the trees would still read as hexagons.

### Leave the field of view

Keep `0.8`. At this pose the car is on screen and small enough to sit in the lower half. If a later check shows the car clipped at a square aspect, move the look point a meter or two toward `+z` before touching the field of view. The angle should stay between 50 and 55 degrees.

## Risks / Trade-offs

- [The car looks larger than in the screenshot] → Accepted for this change. Matching apparent size would mean a new tree scale and a new beam, which are out of scope. The pitch is what makes the ground recede.
- [A square window puts the car too low] → The test covers aspect `1` and `16/9`. Nudge the look point if the car's NDC y drops below -0.45.
- [The old 62 m assertions fail] → Replace them in the same change as `viewPose`.

## Migration Plan

Static page. No saved data. Revert `viewPose` and `rally/view.test.mjs` to restore the 62 m pose.
