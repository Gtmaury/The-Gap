# Design

## Context

The rally page already runs. `rally/render.js` uses one unlit color shader. The camera sits 12 m behind the car and 6 m up, looking 8 m ahead. `groundColor` picks greens and browns. Course edges are cream posts. There are no trees, rocks, or headlights. `rally/sim.js` does not know about the camera or the scenery. See `proposal.md` for why the view changes. The specs under `specs/overhead-view`, `specs/headlight-beam`, and `specs/gray-field` are the behavior contract.

## Goals / Non-Goals

**Goals:**

- Match the reference composition: small car, steep view down, gray field, dark pines and rocks, a bright wedge ahead of the car.
- Leave `step`, clocks, and the course test untouched.

**Non-Goals:**

- A second camera mode, a night mode toggle, or real-time shadows.
- Collision with trees or rocks.
- Editing `game/` or the stage list copy.

## Decisions

### Steep camera in `draw`

Replace the chase eye. Desired eye is 10 m behind the car and 48 m up. Look target is 12 m ahead of the car, 1 m above the ground. Field of view is 0.8 radians. World up stays `(0, 1, 0)`. The existing lerp (about 8 per second) still eases the eye.

An eye only 4 m behind, 32 m up, looking 16 m ahead at 0.7 radians puts the car outside the frame (projected y past -1). The 10 m / 48 m / 12 m / 0.8 radian camera keeps the car in the lower half and the ground ahead in the upper half.

Alternative: orthographic top-down. It matches the flat reference more strictly, and it makes the headlight wedge a screen-space shape that fights the perspective car. A steep perspective camera keeps the current `perspective` / `lookAt` path.

### Headlight is a ground wedge, not a light

Each frame, build a triangle fan in world space and draw it with the same unlit shader. The apex is at the car, 0.08 m above `terrainHeight`. The far edge is 16 m along `forward(heading)` and 7 m to either side. The wedge color is about `[0.86, 0.86, 0.88]`, lighter than every gray used for the ground. Draw it after the terrain and before the car. No new shader, no spotlight falloff.

The canvas stays hidden on the stage list, so the wedge and the overhead camera are not shown there. `main.js` already does that. Do not start a run from the list.

Alternative: a cone test in the fragment shader. It would fade more softly, and it would be the first lighting feature in a shader that is intentionally a flat color.

### Gray field and scenery

`groundColor` returns only grays: about 0.68, 0.58, and 0.48 from low to high. The clear color becomes gray as well, about `[0.7, 0.7, 0.72]`, so a gap at the edge of the mesh does not flash blue sky.

`rally/scenery.js` exports `propsFor(stage)`. It is deterministic from the stage id and the stage points. It returns 16 pines and 12 rocks, each `{ x, z, kind }`. A candidate is kept only when `distanceToCourse` is greater than `halfWidth + 4`. Placement uses the stage bounds already implied by the points, expanded by about 40 m, and a tiny seeded integer hash. No `Math.random`.

Pines are 6-sided cones, 8 m tall with a 3 m radius, color about `[0.22, 0.22, 0.24]`. A 4 m cone disappears into a dot from the 48 m camera. Rocks are flattened cones about 0.8 m tall, color about `[0.16, 0.16, 0.17]`. Both are flat-shaded triangle lists in the static stage mesh.

Course posts change from cream to a dark gray, about `[0.28, 0.28, 0.3]`, and stay shorter than the pines. The finish gate stays black and yellow so it is distinct from posts and pines.

The car body shifts to a light gray, about `[0.9, 0.9, 0.92]`, with the dark cabin kept, so it reads like the reference on the gray ground.

`sim.js` does not import scenery. Passing over a prop cannot change speed or penalty, because `step` never sees props. Keeping props outside the corridor also means the usual driving line does not sit inside a tree.

### Tests

`node rally/scenery.test.mjs` imports `propsFor` and the three stages. It asserts 16 pines and 12 rocks, stable output for two calls, and every prop farther than `halfWidth + 4` from the polyline via `distanceToCourse`.

`node rally/sim.test.mjs` is run again and must still pass with no edits to the driving assertions.

The camera, the wedge, the gray ground, and the pine shapes are checked in the browser on a running stage. The stage list check is that the canvas is hidden before a stage is chosen.

## Risks / Trade-offs

- [A 32 m camera makes posts hard to read] → Posts stay on the corridor, and the finish gate keeps its black and yellow. If the corridor disappears, enlarge the posts before adding a minimap.
- [The wedge z-fights the ground] → The 0.08 m lift is the mitigation. If it still flickers, lift only the wedge, not the car.
- [Gray-on-gray hides the car] → The body is near white and the cabin stays dark. Do not paint the car the same gray as the ground.
- [Props land in a clump for one stage id] → The hash walks the bounds on a grid and skips rejects, so a shortfall is a bug in the test, not a random seed.

## Migration Plan

Edit the rally view and add `rally/scenery.js` plus its test. No saved times exist to migrate. Rollback is reverting those files. `game/` is not part of the change.

## Open Questions

None. Pine and rock counts are fixed above. A different gray is fine only if the ground stays gray, the wedge stays brighter than the ground, and the finish stays distinct from posts and pines.
