# Proposal

## Why

The rally still plays as a timed course: edge posts, a finish gate, a clock, and a camera that leaves the car low in the frame. The first two seconds of the reference are a different drive. A white car sits near the center of a flat light-gray field, threads dark pines and rocks, and shows white headlight cones and red taillights, with no road and no HUD.

## What Changes

- **BREAKING** Replace the three named stages, the course corridor, off-course penalty, finish, and result with one open field. The field starts when the rally page loads.
- **BREAKING** Hide the timer, the `OFF COURSE` label, and the on-screen restart and back buttons while driving. Keyboard driving stays. `R` returns the car to the start of the same field.
- Move the camera so the car stays near the center of the view, seen from nearly overhead, with ground ahead of it still visible. The view turns with the car.
- Paint the ground as one flat light gray. Remove the rolling height, the course posts, and the finish gate.
- Keep the car a light block, add small red taillights, and keep the bright headlight wedge on the ground in front of it.
- Scatter dark pines and irregular rocks across the field, including in front of the start, so the drive passes among them. They do not stop the car.
- The Gap vocabulary page stays as it is.

Assumptions, from the first two seconds only:

- This restyles the existing rally page. It does not add a second game.
- The clip shows no collision, so pines and rocks stay scenery. Weaving is the path the player steers, not a physics wall.
- Headlights stay on for the whole drive.
- `openspec list --specs` returns no main specs. Stage time, the low-in-frame overhead camera, and the visible corridor live only in the completed changes `low-poly-rally` and `overhead-headlight-view`. This change supersedes those behaviors.

## Capabilities

### New Capabilities

- `centered-overhead`: A nearly top-down camera that keeps the car near the center and still shows the ground ahead.
- `marked-car`: A light block car with red taillights and a bright headlight wedge aimed along its heading.
- `open-field`: One flat light-gray field with dark pines and rocks in the drive, and no course, clock, or HUD during play.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` camera, ground, course mesh, car mesh, and scenery shapes.
- `rally/scenery.js` placement, which today keeps props outside the corridor.
- `rally/main.js` and `rally/index.html` stage list, timer, off-course label, and result panel.
- `rally/sim.js`, `rally/stages.js`, and their tests, where course clocks and three stages give way to one field.
- `game/` stays.
