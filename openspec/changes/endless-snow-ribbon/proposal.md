# Proposal

## Why

The snow mountain is one 180 m square. A straight drive at top speed reaches the far edge in about six seconds, and past that edge the snow and the trees stop. The drive should keep going, the way a long rally stage keeps going, by repeating the snow along the direction of travel.

## What Changes

- **BREAKING** Replace the single finite summit with a snow ribbon that repeats along world `z`. The ground height and the trees continue through every repeat. There is no far edge in that direction.
- Keep the ribbon 180 m wide. A turn that stays inside that band stays on snow. Driving off the side leaves the drawn snow.
- Keep the open field. There is no road and no finish. Trees still do not stop the car.
- Keep the white car, the red taillights, the white headlight wedge, WASD, the distant three-quarter camera, the lit faces, and the snow grip and slope handling. The slope now follows the repeating snow instead of the one summit.
- The Gap vocabulary page stays as it is.

Assumptions:

- "Endless snow ribbon" means the open snow repeats along `z`. It does not add a road, a finish line, crowds, or damage.
- The repeat is one 180 m pattern, not a set of hand-authored stages.
- `openspec list --specs` returns no main specs. The single summit and the ±90 m mesh live in the completed change `snow-mountain-drive`. This change supersedes that finite mountain.

## Capabilities

### New Capabilities

- `snow-ribbon`: An endless snow band that repeats along the drive, with trees in every repeat.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/sim.js` and `rally/sim.test.mjs`: `terrainHeight()` becomes periodic along `z`. The summit-at-`(0, 70)` checks change.
- `rally/stages.js`: the field stays 180 m wide and describes one repeat, not the end of the world.
- `rally/scenery.js` and `rally/scenery.test.mjs`: trees are generated per repeat.
- `rally/render.js`: the ground and the trees stream in for the repeats around the car.
- `game/` stays.
