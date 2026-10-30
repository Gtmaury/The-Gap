# Proposal

## Why

The headlights paint a solid white sheet over the road, so the beam looks broken next to the car. The three places can only be chosen with number keys, nothing shows how fast the car is going, and the drive stops climbing at 16 m/s. The page should open on an art menu, show the speed, and let that speed keep stepping up.

## What Changes

- **BREAKING** Remove the opaque white headlight wedge. The lamp is a short beam on the road in front of the bumper: warm, fading with distance, and gone beside the car. It still follows the nose. It does not cover the road as a solid sheet.
- **BREAKING** The page opens on a level menu instead of dropping into night snow. The menu lists night snow, night forest, and night rock. Choosing one starts that place. Escape returns to the menu. Keys `1`, `2`, and `3` still select those places.
- The menu is low-poly art in the night palette: flat shapes, a painted road, and the trees or rocks of each place. It is not a plain form or a browser dialog.
- **BREAKING** While the accelerator is held, forward speed climbs in fixed steps instead of stopping at 16 m/s. The readout shows that speed in km/h and updates as the car moves. Grip and slope still change how soon the next step arrives. Braking and coasting bring the speed back down.
- The camera, the walled route, the collisions, and the vocabulary page stay.

Assumptions:

- The broken light in the close view is the unlit white wedge plus the hard tan stain on the route. One fading beam on the ground replaces both.
- "A menu to choose levels" means the three places that already exist, shown before the drive, not new maps.
- "The aesthetic could be like art" means the menu is drawn in the same flat night shapes as the rally, not a settings panel.
- "The speed to be incremental" means the allowed speed rises in steps while accelerating, and the player can see that number. It does not mean gears, a boost item, or a saved best speed.

## Capabilities

### New Capabilities

- `road-beam`: Headlights that light a short fading patch of road ahead and do not draw an opaque sheet.
- `level-menu`: An art menu that starts the page and chooses among the three night places.
- `stepped-speed`: Forward speed that climbs in steps, with a live km/h readout.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` and `rally/view.test.mjs`: the wedge mesh goes away, and the ground beam changes.
- `rally/index.html` and `rally/styles.css`: the art menu and the speed readout.
- `rally/main.js`: the menu opens first, Escape returns to it, and the readout follows the car.
- `rally/sim.js` and `rally/sim.test.mjs`: the 16 m/s cap becomes stepped speed.
- `game/` stays.
