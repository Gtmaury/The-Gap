# Design

## Context

`viewPose` puts the eye at `(car.x, car.y + 29, car.z - 46)` and looks at `(car.x, car.y + 0.5, car.z + 24)`, about 22 degrees below the horizon. `step` moves the car from speed and slope and never reads a tree, a rock, or a lane. Props may land anywhere outside a 10 m circle around the start. See proposal.md for why this becomes a walled route under a steeper camera.

## Goals / Non-Goals

**Goals:**

- One pose at about 34 degrees, still world-locked, with the car in the lower half.
- One centerline shared by every place, drawn as a strip and enforced as two walls.
- Circle solids for trees and rocks, resolved by sliding, with `sim.js` still free of the scenery module.

**Non-Goals:**

- Damage, a flip, a finish, a menu, or a mouse-controlled camera.
- A road the car can leave, or a different route shape per place.
- Swept collision for a multi-second step. The page already steps at 1/60.

## Decisions

### Raise the pitch to about 34 degrees

`viewPose` becomes eye `(car.x, car.y + 43, car.z - 47)` and look `(car.x, car.y + 0.5, car.z + 16)`. The drop is 42.5 m over a 63 m run, so the pitch is `atan2(42.5, 63)`, about 34.0 degrees. Field of view stays `0.8` radians. The top of the frame is about 11 degrees below the horizon, so the picture is ground, closer to a League frame than the current sky band. The car is about 8 degrees below the center ray, near NDC `y = -0.37` at 16:9, inside the existing lower-half check. Yaw stays independent of heading. The 1200 m chunk window still covers the ground in frame.

Alternative: leave the 22 degree eye. That keeps the sky band and shows less of the lane as a surface.

### One weaving centerline

`rally/route.js` exports the centerline `x = 18 * sin(2π z / 180)`. At `z = 0` the center is 0, so the start is on the route. The half-width is 7 m. The strip repeats with the 180 m ribbon. The mesh is a ribbon of quads from `center - 7` to `center + 7`, lifted `0.05` m off `terrainHeight`, colored `[0.62, 0.48, 0.28]` so it reads on night snow, forest, and rock. It is drawn with the terrain chunks.

`propsForChunk` drops a spot whose distance to the centerline is less than `7 + solid radius + 0.5`. A pine radius is 3 m and a rock radius is 1.4 m. The 10 m start clearance stays. `route.js` does not import scenery, so scenery can import the centerline without a cycle.

Alternative: a straight road down the middle. The car would never meet a wall unless it steered, so the lane would not read as something the drive has to follow.

### Slide, then stop the inward speed

`step(run, input, dt, solids = [])` integrates as it does now, then resolves overlaps. `solids` are `{ x, z, radius }` in the world. The car radius is 1.1 m. For each circle, if the distance from the car is below `1.1 + radius`, move the car out along that horizontal normal and drop the velocity aimed into the circle. Heading does not change.

The walls use the centerline at the car's `z`. The car center must stay within `7 - 1.1` m of that center. If it is outside, move it to the nearest limit and drop the velocity aimed further out. The wall is treated as a cut of constant `x` at that `z`. The centerline's steepest slope is about 0.63, so the cut is a small shortcut around the true normal.

`main.js` builds the solid list from the props of the chunks around the car and passes it to `step`. Tests pass an explicit list. `sim.js` does not import scenery and does not contain the word `scenery`.

Alternative: a full stop on contact. The car would stick on the first tree instead of sliding the way a League wall does.

## Risks / Trade-offs

- [The wall cut ignores the centerline slope] → Accepted. The bend is gentle, and the car still cannot leave the 14 m strip.
- [A large test step can jump a thin solid] → The page steps at 1/60. Unit tests place the car against the solid and take a short step.
- [The lane color is one brown on every place] → It stays distinct from snow, forest, and rock without a second material per place.
- [Existing tests lock the 29 m eye and let the car drive through scenery] → Those assertions change with the pose and the slide.

## Migration Plan

Static page. No saved data. Revert `rally/render.js`, `rally/sim.js`, `rally/scenery.js`, `rally/main.js`, their tests, and delete `rally/route.js` to restore the open night field.
