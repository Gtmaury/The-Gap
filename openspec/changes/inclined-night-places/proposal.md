# Proposal

## Why

The rally is one pale snow ribbon seen from above in daylight, so the headlights are a white patch on snow and every drive looks like the same place. The camera should lean along the ribbon, the world should be night, and the headlights should light the ground. There should be other places to drive, each with its own ground and its own feel.

## What Changes

- **BREAKING** Lower the camera from about 52 degrees below the horizon to about 22 degrees. The horizon sits near the top of the frame and the car stays in the lower half. Yaw stays locked to the world.
- **BREAKING** Make every place night. A dim cool moon shades the faces. The ground and the sky go dark. The headlight wedge stays fully bright, and the snow or ground inside the headlight cone brightens with the car's heading.
- Add three endless places. Each is 180 m wide, repeats along world `z`, and has no road and no finish. The page starts on night snow. Keys `1`, `2`, and `3` restart on that place. There is still no stage menu, timer, or result.
- Night snow keeps the current sine ridge, pines only, and snow grip. Night forest is a gentler ridge with denser trees, a dark green ground, and firmer grip. Night rock is a steeper ridge with rocks, a gray ground, and looser grip.
- Keep WASD, braking to a stop, steering from rest, slope roll, and scenery that does not stop the car. The Gap vocabulary page stays as it is.

Assumptions:

- "Yes" means the headlights light the ground in front of the car, in the same shader as the moon.
- "More inclined" means a lower pitch, closer to the horizon, with the same world-locked yaw. It does not mean a chase camera or a straight-down view.
- "Different levels and other places" means three endless places you switch with the number keys. It does not add a road, a finish, crowds, damage, or an on-screen menu.
- `openspec list --specs` returns no main specs. The daylight snow ribbon lives in the completed change `endless-snow-ribbon`. This change supersedes that camera, that daylight lighting, and that single place.

## Capabilities

### New Capabilities

- `inclined-camera`: A lower, world-locked view with the horizon near the top and the car in the lower half.
- `night-lighting`: Night colors, a dim moon on each face, a fully bright headlight wedge, and ground lit inside the headlight cone.
- `rally-places`: Three endless places with different ground, scenery, height, and grip, chosen with the number keys.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` and `rally/view.test.mjs`: the camera pose, the night shader, the headlight term, and the clear color.
- `rally/sim.js` and `rally/sim.test.mjs`: height and grip come from the active place.
- `rally/stages.js`: three place definitions, and the page starts on night snow.
- `rally/scenery.js` and `rally/scenery.test.mjs`: each place has its own props.
- `rally/main.js`: keys `1`, `2`, and `3` select a place and restart.
- `game/` stays.
