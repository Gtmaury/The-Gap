# Design

## Context

See `proposal.md` for why this exists. The Gap is a static page under `game/` with no build step and no 3D code. Node tests in that folder import pure functions and assert on them. The rally must not change those files.

The specs in `specs/car-control`, `specs/stage-run`, and `specs/low-poly-view` are the behavior contract. This document only records how to meet them.

## Goals / Non-Goals

**Goals:**

- A second static page whose driving, course, and clock rules run without WebGL.
- A flat-shaded view of those same rules, with a chase camera and readable HTML readouts.
- Three hand-built stages that a player can finish in under a minute each.

**Non-Goals:**

- A physics engine, lateral slide, or suspension. The spec does not require a gravel drift.
- Downloaded models, textures, or a bundler.
- Sharing a process or URL path with The Gap's page.

## Decisions

### Separate `rally/` page

The rally is a new directory: `rally/index.html` plus ES modules. Serve it the same way as The Gap, on its own port:

```
python -m http.server 4174 --directory rally
```

The Gap command (`--directory game` on port 4173) stays as written. Serving the repo root was rejected because it would publish the whole tree, including `.git`.

Alternatives: a route inside `game/index.html` (mixes two products and risks the vocabulary UI), or a bundler (new toolchain this repo does not have).

### Pure step, then draw

`rally/sim.js` exports plain data and functions. It does not touch the DOM or WebGL.

- `createRun(stage)` places one car at the stage start, heading along the first course segment, speed 0, both clocks 0, phase `running`.
- `step(run, input, dt)` integrates the car and clocks. `input` is `{ accelerate, brake, steer }` with `steer` in `-1..1`.
- `restart(run)` returns a fresh `createRun` for the same stage.
- Course tests (`onCourse`, finish crossed) are exported so tests can call them directly.

`rally/main.js` owns the page: stage list, keyboard state, animation frame, and passing a fixed `dt` into `step`. Drawing reads the run; it does not decide speed, penalties, or finish.

Alternative: one file that simulates inside the renderer. Rejected because the timing and course scenarios could not be tested the way `game/engine.test.mjs` tests The Gap.

### Car motion

Numbers live in `sim.js` so tests and the page share them.

- Top speed 28 m/s. Accelerate at 14 m/s². Brake at 22 m/s². Coasting drag 4 m/s², so releasing both keys slows the car.
- Speed is clamped to `0..top speed`. Brake and drag never reverse the car. There is no reverse gear.
- Heading changes only when speed is greater than 0. Yaw rate is `steer * 1.8` rad/s, so holding left decreases heading in the same convention the tests use (positive yaw is left).
- Horizontal motion is `speed` along the heading. Vertical position is snapped to `terrainHeight(x, z)` each step. No gravity and no collision response. Snapping keeps the car on the visible ground without a physics library.
- After phase is `finished`, `step` ignores driving input and does not move the car or advance clocks.

Stopped means speed is 0. Tests can hold accelerate until speed equals the top speed, hold brake until speed is 0, and assert heading is unchanged at speed 0.

### Course, clocks, and finish

Each stage is `{ id, name, halfWidth, points }` where `points` is a polyline of `{ x, z }` in meters. The three stages are data in `rally/stages.js`, with different names and different polylines. Half-width is 8 m for all three. The start pose is the first segment's position and direction. The finish is the last point.

- On course means the horizontal distance from the car to the nearest segment is less than or equal to `halfWidth`.
- While phase is `running`, stage time increases by `dt` every step. Penalty time increases by `dt` only when the car is off course. Total is the sum. Both clocks start at 0 and are not written to `localStorage`.
- Finish: while on course, the car crosses the plane through the last point whose normal is the last segment's direction (the car's progress along that segment passes the end). Crossing off course does not finish. Spawn is not a finish, because the start is the first point, not the last.
- HUD shows stage time while running. Off course shows the literal text `OFF COURSE`. The result shows the stage name and three labeled times. Format is `m:ss.ss`.

Restart and "back to list" are page actions. `R` and a Restart control call `restart`. `Esc` and a Back control return to the list and drop the run object, so no clock is running. Reload loads the list because nothing is stored.

### Flat-shaded WebGL, no new dependency

`rally/render.js` uses WebGL1. One shader pair: vertices carry a solid color, the fragment shader writes it unchanged (no lighting texture, no samplers). Flat shading comes from duplicating vertices per triangle so each face has one color. If `getContext('webgl')` fails, `main.js` shows "This browser cannot display the rally." and does not call `createRun`.

Meshes are built in code, not loaded:

- Terrain: a coarse grid (about 40 by 40 cells over the stage bounds) colored in two or three greens and browns from height. The grid uses the same `terrainHeight` as the sim.
- Course edges: short posts along the polyline, offset by `halfWidth`, in a light color.
- Finish: a gate at the last point, taller than the posts and colored in a high-contrast pair (for example black and yellow) so it is distinct from the posts.
- Car: a few boxes (body, cabin) and short prisms for wheels, one per run. The mesh is transformed from the car pose. No second car mesh.

Camera each frame: eye = car position minus forward times 12 m, plus 6 m up; look target = car position plus forward times 8 m. That keeps the course ahead in view. A short lerp on the eye (about 8 per second) stops the camera from jittering; the look target stays on the car's current heading so a turn still shows the road ahead.

Alternative: vendored Three.js. It would shorten the renderer, and it would add a large third-party file this change does not need for unlit faces.

### Input

While phase is `running`: `W` or ArrowUp accelerate, `S` or ArrowDown brake, `A` or ArrowLeft steer left, `D` or ArrowRight steer right. Both directions at once means steer 0. Accelerate and brake together means brake wins and speed decreases.

The stage list is HTML buttons, one per stage name. Restart and Back are HTML buttons as well as `R` and `Esc`, so the result can be left without a keyboard. Those controls are plain text over the canvas (`position: absolute`), which keeps them readable on top of the 3D view.

### Tests

`rally/sim.test.mjs` imports the sim and asserts the car-control and stage-run scenarios that do not need pixels: one car at the start, accelerate to top speed, brake to a stop, steer left only while moving, restart pose and zero clocks, on-course versus off-course, penalty equal to the off-course span, finish only when on course, total equals the sum, and no stored time (the module has no storage API). Run with `node rally/sim.test.mjs`, same pattern as `node game/engine.test.mjs`.

The chase camera, flat shading, finish contrast, and WebGL fallback are checked in the browser. Tasks call those out separately because they are not assertable from Node.

## Risks / Trade-offs

- [Snapped height feels like a slot-car on hills] → Accept it. Slope forces are out of scope, and the car cannot fall through the grid.
- [No lateral slide, so it will not feel like loose gravel] → Accept it. Heading-along-velocity is stable and matches the steer scenarios. A slip model would need its own spec.
- [Polyline plus half-width is a corridor, not a closed road mesh] → Posts show the corridor the sim uses, so the visible edges and the penalty agree. Sharp corners can bulge; keep corner angles mild in the three polylines.
- [Fixed yaw rate feels twitchy at low speed] → Steer is already disabled at speed 0. If a stage is undriveable, widen `halfWidth` or soften the polyline rather than adding slip.
- [WebGL1 missing] → The fallback message is the whole page. Do not start a hidden sim.

## Migration Plan

Add `rally/` and a README section for port 4174. Do not edit `game/`. Rollback is removing `rally/` and that README section. There is no saved data to migrate.

## Open Questions

None. Palette and prop placement may vary as long as faces stay flat-colored, the finish stays distinct from the course posts, and the sim rules above stay put.
