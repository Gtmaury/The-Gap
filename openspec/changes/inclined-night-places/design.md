# Design

## Context

`viewPose` puts the eye at `(car.x, car.y + 56, car.z - 36)` and looks at `(car.x, car.y + 0.5, car.z + 8)`. That is about 51.6 degrees below the horizon, so the frame is all ground. The fragment shader is one Lambert, ambient `0.42` and diffuse `0.70`, and the headlight wedge skips it with shade `0`. `terrainHeight` ignores `x` and the place, and throttle always uses `SNOW_GRIP` `0.65`. One field, `snow-ribbon`, is built in `stages.js`. See proposal.md for why this becomes a night drive with three places.

## Goals / Non-Goals

**Goals:**

- One camera pose shared by every place, about 22 degrees below the horizon, yaw still locked to the world.
- One night shader: a dim moon, a dark sky, a fully bright wedge, and a headlight term on the ground.
- Height, grip, ground color, and scenery selected by the active place.

**Non-Goals:**

- A road, a finish, a stage menu, crowds, or damage.
- Textures, shadow maps, fog, or a second shader program.
- A chase camera, or tiling the ribbon along `x`.

## Decisions

### Lean the camera to about 22 degrees

`viewPose` becomes eye `(car.x, car.y + 29, car.z - 46)` and look `(car.x, car.y + 0.5, car.z + 24)`. The drop is 28.5 m over a 70 m run, so the pitch is `atan2(28.5, 70)`, about 22.1 degrees. Field of view stays `0.8` radians, whose half-angle is about 22.9 degrees, so the top of the frame sits on the horizon. The car is about 10 degrees below that center ray, near NDC `y = -0.44` at 16:9, which keeps it in the lower half. Yaw stays independent of heading.

The chunk window ahead of the car grows from 800 m to 1200 m. A ray near the new horizon travels farther along the ground than the old window covers. The 400 m behind the car stays.

Alternative: keep the 56 m eye and only shrink the field of view. That would crop the ground and still look steep.

### One night shader, headlights on the ground

Ambient becomes `0.15` and diffuse `0.55`. The moon direction is the normalized vector `(0.25, 0.72, -0.45)`. `lightFactor` keeps that formula. The clear color becomes the night sky `[0.05, 0.06, 0.10]` for every place, so empty space is sky. Each place still has its own ground albedo.

The vertex shader passes the world position through. The fragment adds a headlight term only when shade is `1` and the point is within 1.5 m of `terrainHeight` at that `x, z`, so the car body and the tree tops stay on the moon. The cone matches the wedge: 16 m along the nose, 7 m of half-width at the far end, zero at the car. Brightness falls off along the cone and toward its edges, and is added in white on top of the moonlit color, clamped to 1. The wedge stays shade `0`, so it stays pure white. A JS helper mirrors the cone test so the view test can check a point 8 m ahead against a point 8 m to the side, and the same pair after a turn, without WebGL.

Alternative: leave the wedge as the only headlight. The ground beside it would stay as dark as the ground under it, so the headlights would still be a decal.

### Three places on the same ribbon rules

`stages.js` exports `places` and `field`, where `field` is night snow so the page still starts there. Every place uses bounds ±90 and a 180 m repeat. `terrainHeight(place, x, z)` ignores `x`:

- `night-snow`: `14 + 10 * sin(2π z / 180)`, grip `0.65`, 48 pines, ground `[0.45, 0.52, 0.62]`
- `night-forest`: `8 + 4 * sin(2π z / 180)`, grip `1`, 80 pines, ground `[0.10, 0.16, 0.11]`
- `night-rock`: `16 + 14 * sin(2π z / 180)`, grip `0.4`, 36 rocks, ground `[0.28, 0.28, 0.30]`

The start grade is `amplitude * 2π / 180`: about 0.349, 0.140, and 0.489. Grip lives on the place and `step` multiplies throttle by `run.field.grip`. At `z = 45` every cosine is 0, so the crest is the same slope for the grip test. `sim.js` still does not import scenery.

`propsForChunk` reads the place's kind and count. Chunk 0 of every place keeps the 10 m clearance and one prop ahead of the start. Rocks use the existing rock mesh.

Keys `1`, `2`, and `3` call `createRun` for that place and `view.setField`. `R` still restarts the current place. Nothing is drawn for the choice.

Alternative: one ribbon that changes biome with `z`. A number key makes each place reachable in one press, which a long biome strip does not.

## Risks / Trade-offs

- [The dark sky shows the sides of the ribbon] → Accepted. The endless direction is still `z`, and the band stays 180 m wide.
- [The headlight can light a tree base or a rock] → Accepted. The 1.5 m ground test is what keeps the car body on the moon.
- [A shallower view looks farther than 800 m] → The ahead window becomes 1200 m.
- [Existing tests lock the 56 m eye, the daylight snow color, and a single grip] → Those assertions change with the pose, the sky color, and the place.

## Migration Plan

Static page. No saved data. Revert `rally/sim.js`, `rally/stages.js`, `rally/scenery.js`, `rally/render.js`, `rally/main.js`, and their tests to restore the daylight snow ribbon and the steep camera.
