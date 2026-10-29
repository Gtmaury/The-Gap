# Proposal

## Why

The rally sits on a flat gray square. Dark rocks sit among the trees, and the car accelerates, coasts, and turns the same way everywhere. The drive should be a snowy mountain, with trees as the only dark scenery, and the snow and the slope should change how the car moves.

## What Changes

- **BREAKING** Replace the flat field with one snow-covered mountain. The ground is white snow, and the height rises to a summit ahead of the start. The car follows that height.
- **BREAKING** Remove the rocks. Every dark scenery object is a tree. Trees stay scenery and do not stop the car.
- **BREAKING** Let the slope and the snow change the drive. Uphill spends speed. Downhill adds speed, including a roll from a stop when the nose points downhill. Snow lowers acceleration and lets the nose slide in a turn. Braking still stops the car, and the car still cannot reverse.
- Keep the white car, the red taillights, the bright headlight wedge, WASD steering, the far three-quarter camera, and the lit faces.
- The Gap vocabulary page stays as it is.

Assumptions:

- "Snow" is the ground color and the grip. It does not add falling snow, fog, wind, ice patches, or ruts.
- "Other factors" means the slope of this mountain. Trees do not collide with the car.
- The camera yaw stays locked to the world. The eye offsets stay the distant three-quarter pose and rise with the car.
- `openspec list --specs` returns no main specs. The flat height, the rocks, and the constant drive live in completed changes. This change supersedes those behaviors.

## Capabilities

### New Capabilities

- `snow-mountain`: A snow-covered mountain field whose dark scenery is trees.
- `snow-handling`: Slope and snow grip change acceleration, coasting, and turning, without reverse.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/stages.js`, the field id and the mountain the car starts on.
- `rally/sim.js` and `rally/sim.test.mjs`: height, slope force, snow acceleration, coasting, and slide. `terrainHeight()` is no longer 0.
- `rally/scenery.js` and `rally/scenery.test.mjs`: trees only.
- `rally/render.js`: snow color, terrain that follows the height, a car that pitches with the slope, and a headlight wedge that sits on the snow.
- `game/` stays.
