# Design

## Context

The rally page is a WebGL flat-shader view over a course sim. `rally/render.js` places the eye 10 m behind the car and 48 m up, and looks 12 m ahead, so the car sits low in the frame. The ground uses `terrainHeight`, which waves, and three gray bands. `buildCourse` draws edge posts and a finish gate. `propsFor` in `rally/scenery.js` keeps 16 pines and 12 rocks outside the corridor. `rally/main.js` waits on a three-stage list and paints a timer, `OFF COURSE`, and a result. See proposal.md for why that play changes. `game/` is a separate page and stays out of this change.

## Goals / Non-Goals

**Goals:**

- One field, one camera, and the existing unlit shader, close enough to the first two seconds that the car, the flat field, the headlights, the taillights, and the props read the same way.
- Keep driving testable in Node without WebGL.

**Non-Goals:**

- Collision, a second game, a stage list, or a clock.
- Anything past the first two seconds of the reference.
- A new renderer or a new dependency.

## Decisions

### One field replaces the course

`rally/stages.js` exports one `field`: an id, a start pose (`x: 0`, `z: 0`, heading `0`, which already faces `+z`), and square bounds about 180 m across. `createRun(field)` starts the car there at speed 0. `step` keeps acceleration, braking, drag, and yaw, and stops checking `onCourse` and `crossedFinish`. The run no longer gains stage time, penalty time, or a finished phase. `restart` returns that same start.

Course helpers can leave the module if nothing calls them. Tests that assert three stages, corridor width, finish, and penalty time are replaced with tests for the start pose, forward motion, steering, a drive that does not end, and restart.

Alternative: keep the three stages and only hide the posts. That would still be a timed corridor, which is the play the reference does not show.

### Flat ground

`terrainHeight` returns `0`. Every ground vertex uses one light gray, about `[0.78, 0.78, 0.8]`. The clear color uses that same gray so the field does not show a frame. The test that requires two different heights goes away. The test that the car's `y` matches `terrainHeight` stays.

Alternative: keep the waves and paint them one color. The reference ground is a featureless plane, and the waves still tilt the car and the headlight wedge.

### Centered overhead camera

Keep perspective and `lookAt`. The desired eye is 6 m behind the car and 62 m up. The look point is 8 m ahead of the car, near the ground. The field of view stays `0.8`. The existing exponential follow stays. Those offsets put the car near the middle and leave a wedge of ground ahead; the old 12 m look-ahead is what pushed the car down.

Before the view is called done, project the car into normalized device coordinates and confirm it is inside the frame and near the center, not on the bottom edge. The previous camera had that clip.

Alternative: an orthographic camera straight down. It would center the car, and it would also flatten the headlight wedge and the pine height that make the reference read as a low-poly scene.

### Drop the course mesh

`setStage` uploads terrain and scenery only. `buildCourse` is not drawn. No posts, no gate.

### Props sit in the drive

`propsFor(field)` fills the bounds on the same hash, with about 28 pines and 20 rocks. It rejects any spot within 10 m of the start, so the car does not begin inside a prop. At least one prop must have a larger `z` than the start, which is ahead while heading is `0`. The scenery test drops the corridor clearance check and asserts the count, the clear start, one prop ahead, and the same list on a second call.

Pines stay dark faceted cones, tall enough to read from 62 m (the current 8 m height is the starting point). Rocks stay short and dark, built from a squat cone or a few offset boxes so they are not a second pine. Colors stay near the current pine `[0.22, 0.22, 0.24]` and rock `[0.16, 0.16, 0.17]`.

Props still do not affect `step`. Passing through one leaves speed unchanged. That matches the two seconds, which never show a stop, and the current scenery rule.

### Car marks

The body stays the existing near-white box `[0.9, 0.9, 0.92]`. Two small boxes at the local rear (`-z`, which `transformPoint` treats as behind) use red about `[0.82, 0.08, 0.07]`. The headlight wedge in `buildWedge` stays a bright ground triangle aimed with `forward(heading)`, drawn every frame.

### No HUD, start immediately

`index.html` drops the stage list, timer, off-course line, and result. `main.js` creates the run on load, shows the canvas, and keeps W, A, S, D, and the arrows. `R` calls `restart`. Escape no longer opens a list. The WebGL fallback sentence stays when the context is missing.

### A slower top speed

`TOP_SPEED` drops from 28 to 16. Acceleration, brake, and yaw stay. From 62 m up, 28 m/s crosses the props too fast to read as the steady weave in the clip. Tests that lock the old top speed use 16.

## Risks / Trade-offs

- [Camera offsets still leave the car low or clipped] → Check the car's normalized device position while driving straight and while turning, and adjust only the eye and look offsets if it is not near the center.
- [A flat field looks empty] → The prop count and the "one prop ahead of the start" test keep the drive from opening on blank ground.
- [Removing the course breaks `sim.test.mjs` and `scenery.test.mjs`] → Replace those assertions in the same change. `node --test rally/*.test.mjs` has to pass.
- [Players can drive through pines] → Accepted. The reference's first two seconds do not show a collision, and adding one would change the drive rule this design keeps.

## Migration Plan

The rally is a static page. There is no data to migrate. Revert the `rally/` edits to restore the timed stages. `game/` is not part of the deploy step.
