# Proposal

## Why

The night drive is an open field seen from a low angle, and the car passes through trees and rocks. The camera should sit more like a League view, only more inclined, and the drive should follow a route that the car cannot leave or drive through.

## What Changes

- **BREAKING** Raise the camera from about 22 degrees below the horizon to about 34 degrees. That is lower than a usual League view and steeper than the current one. The car stays in the lower half. Yaw stays locked to the world. There is no mouse orbit and no edge-pan.
- Add one route through every place. It is about 14 m wide, a different color from the ground, and it bends and repeats along world `z`. The page still starts on the route.
- **BREAKING** The route edges are walls. Trees and rocks are solid too. The car slides along whatever it hits and keeps the speed that runs along the surface. It does not take damage, stop dead, or flip.
- Trees and rocks stay off the route, so the lane itself is clear. Night lighting, the three places, the number keys, and the headlight cone stay.
- There is still no finish, stage menu, timer, or result. The Gap vocabulary page stays as it is.

Assumptions:

- "Like League, but more inclined" means a fixed world-locked camera at about 34 degrees, between the current 22 degree view and a usual League view of about 45 degrees.
- "A route" plus "collisions" means the edges are walls, not a painted road the car can leave. Leaving the lane is blocked. Driving off the road does not only change the grip.
- A hit slides. It does not add a crash, health, or a reset.
- `openspec list --specs` returns no main specs. The open night field lives in the completed change `inclined-night-places`. This change supersedes that camera pitch and the rule that scenery never stops the car.

## Capabilities

### New Capabilities

- `lane-camera`: A fixed camera at about 34 degrees below the horizon, with the car in the lower half and yaw locked to the world.
- `solid-route`: A repeating walled route, with trees and rocks that the car slides along.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` and `rally/view.test.mjs`: the camera pose and the route mesh.
- `rally/route.js`: the centerline, the width, and the slide against walls and circles.
- `rally/sim.js` and `rally/sim.test.mjs`: the step resolves those solids. `sim.js` still does not import scenery.
- `rally/scenery.js` and `rally/scenery.test.mjs`: props stay off the route.
- `rally/main.js`: the step receives the solids around the car.
- `game/` stays.
