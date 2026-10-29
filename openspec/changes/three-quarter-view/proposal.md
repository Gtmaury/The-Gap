# Proposal

## Why

The camera is about 77 degrees up from the horizon, so the field is almost a flat plan: pines read as hexagons and the car reads as a roof. The reference frame is a high three-quarter view. The ground runs away from the camera, the sides of the trees show, and the car sits in the lower half of that view.

## What Changes

- **BREAKING** Lower and pull back the camera so the view is about 51 degrees up from the horizon, still locked to world axes. The car stays in the lower half and near the horizontal center. Farther ground stays toward the top of the screen. Steering still rotates the car. The view does not yaw to put the nose at the top.
- Keep the field of view, the pine cones, the rock shapes, and the headlight wedge as they are.
- WASD driving and the lack of a HUD stay as they are.
- The Gap vocabulary page stays as it is.

Assumptions:

- This change is the camera pitch and distance only. Stacked pine shapes, a smaller headlight, and a vignette are visible in the screenshot and are out of scope.
- `openspec list --specs` returns no main specs. The steep 62 m pose lives only in the completed change `fixed-overhead-steer` (`specs/fixed-overhead`). This change supersedes that height and tilt. The fixed world yaw from that change stays.

## Capabilities

### New Capabilities

- `three-quarter-view`: A high three-quarter camera that follows the car with a fixed world yaw, puts the car in the lower half, and shows the height of nearby trees.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` `viewPose`. The field of view stays `0.8`.
- `rally/view.test.mjs`, which currently requires the eye at 62 m and the car near the center.
- `rally/sim.js`, scenery, and `game/` stay.
