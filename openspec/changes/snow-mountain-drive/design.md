# Design

## Context

`terrainHeight()` returns 0, so the car, the ground mesh, and the headlight wedge all sit on a plane. `step` adds `ACCEL` (14), subtracts `BRAKE` (22) or `DRAG` (4), and clamps speed to `[0, 16]`. Velocity is always along the nose, including in a turn. Scenery is 28 pines and 20 rocks. The ground color is gray `[0.78, 0.78, 0.8]`. The distant camera is an offset from `car.y`. See proposal.md for why this becomes a snowy mountain.

## Goals / Non-Goals

**Goals:**

- One height function shared by the sim, the ground mesh, and the headlight wedge.
- A slope force and a snow grip that the existing sim tests can assert without WebGL.
- Trees only, on the same kind of scattered field, with the car pitching onto the slope.

**Non-Goals:**

- Falling snow, fog, wind, ice patches, ruts, or a second mountain.
- Tree collision, a new pine mesh, or a camera that yaws with the car.
- Tilting the car in roll. Pitch follows the slope along the nose only.

## Decisions

### One smooth summit ahead of the start

`terrainHeight(x, z)` is `28 * t * t`, where `t = max(0, 1 - (x² + (z - 70)²) / 160²)`. The summit is `(0, 70, 28)`, inside the existing ±90 bounds. The start `(0, 0)` is about 18.3 m up. The edge behind the car, `(0, -90)`, is 0. The grade at the start along `+z` is about 0.247, so the slope acceleration there is about 2.35 m/s².

The ground mesh already samples `terrainHeight` per corner. Those corners stop being coplanar, so the existing face normals shade the snow. No new light is added.

Alternative: a tilted plane. A plane has no summit, so the field would not read as a mountain.

### Snow grip and slope share one velocity

`SNOW_GRIP` is `0.65`. Throttle acceleration becomes `ACCEL * SNOW_GRIP` (9.1). `BRAKE` stays 22. Coasting drag becomes `1.5`. `TOP_SPEED` stays 16. `YAW_RATE` stays 2.6, including from a stop.

Slope acceleration is `-9.8 * grade / sqrt(1 + grade²)`, with `grade` sampled from `terrainHeight` over 0.5 m along the nose. It is added to the throttle, brake, or drag term. Speed clamps to `[0, 16]`. A downhill nose at rest therefore rolls. An uphill nose at rest stays at 0. Braking still reaches 0 and cannot go negative.

The car stores `vx` and `vz`. The along-nose part of that vector takes the new speed. The lateral part is multiplied by `exp(-2.5 * dt)`. Straight driving has no lateral part. A steer leaves the old velocity off the new nose, so travel lags the heading. Position integrates `vx` and `vz`. `y` is `terrainHeight(x, z)`.

The old drag of 4 is larger than the steepest slope on this hill (about 2.4 m/s²), so coasting could never speed up. Lowering drag is what makes the downhill roll visible. The two-second uphill throttle from the start nets about 6.7 m/s², so speed stays under 16. The same throttle downhill reaches 16 and is faster.

Alternative: scale the yaw rate and skip the lateral velocity. The nose would turn slower, but the car would still drive exactly where it points, which is not a slide.

### Trees replace rocks

`propsFor` keeps the hash scatter and the 10 m start clearance. It emits 48 pines and no rocks. The field id becomes `snow-mountain`, with the same bounds and the same start pose. `sim.js` still does not import scenery, so a tree cannot change `step`.

`GROUND` becomes `[0.86, 0.89, 0.93]`, and the clear color uses it. Pine color stays dark.

### The car and the wedge sit on the snow

Pitch is `atan(grade)` along the nose. Positive grade raises the nose. `transformMesh` applies that pitch to positions and normals. The right axis stays horizontal.

Each headlight vertex uses `terrainHeight` at its own `x` and `z`, plus 0.08 m, and keeps shade `0`.

`viewPose` stays eye `(car.x, car.y + 56, car.z - 36)` and look `(car.x, car.y + 0.5, car.z + 8)`. Tests that treat `car.y` as 0 or `eye.y` as 56 change to the car-relative offsets. The lower-half check stays.

## Risks / Trade-offs

- [The south rim is flat at height 0] → Accepted. It is the base of the mountain, still inside the field, and it is lower than the start.
- [An upright car would look like it hovers on the slope] → Pitch follows the grade along the nose. Roll stays 0.
- [A large steer can leave a long slide] → Lateral speed decays at 2.5 per second, so the lag is a short slide, not a drift mode.
- [Existing tests lock height 0, 20 rocks, and top speed in two seconds] → Those assertions change with this behavior. Do not weaken the uphill case back to "reaches 16".

## Migration Plan

Static page. No saved data. Revert `rally/sim.js`, `rally/stages.js`, `rally/scenery.js`, `rally/render.js`, and their tests to restore the flat gray field.
