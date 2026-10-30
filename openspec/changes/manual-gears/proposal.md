# Proposal

## Why

The speed limit climbs by itself while W is held, and the only way back to the level menu during a drive is the Escape key. The player should pick each gear, and a button on the drive should open the menu.

## What Changes

- **BREAKING** Remove the automatic 0.45 s speed steps. The car has seven gears. W accelerates only up to the selected gear. A lower gear pulls harder and tops out sooner. A higher gear pulls less and tops out faster. The drive starts in gear 1.
- The up arrow selects the next gear and the down arrow selects the previous gear. One press moves one gear. Holding the key does not run through the box. A downshift above the lower gear's top speed drops the car to that speed.
- **BREAKING** The up arrow is no longer a second accelerator, and the down arrow is no longer a brake. W accelerates. S brakes. A, D, and the left and right arrows still steer.
- The speed line shows the gear and the speed, such as `3 36 km/h`.
- Add a Menu button on the drive, in the same flat night shapes as the level menu. Clicking it does what Escape does: the level menu returns and the car stops. The button is hidden while that menu is open.
- The three places, the road beam, the route, and the vocabulary page stay.

Assumptions:

- The up and down arrows are the shifter. W stays the control that adds speed.
- The seven existing speed tops, 8 through 32 m/s in steps of 4, become the seven gear tops.
- A shift that lands above the new top speed cuts speed to that top on that step. There is no clutch, stall, or reverse gear.
- The Menu button repeats Escape. It does not add a second menu.

## Capabilities

### New Capabilities

- `manual-gearbox`: Seven gears the player selects, with W filling only the selected gear.
- `drive-menu-button`: A button on the drive that returns to the level menu and stops the car.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/sim.js` and `rally/sim.test.mjs`: the automatic hold becomes a selected gear, and each gear has its own pull.
- `rally/hud.js` and `rally/menu.test.mjs`: the readout includes the gear, and the Menu button shares the Escape path.
- `rally/main.js`: the up and down arrows shift, and the button opens the menu.
- `rally/index.html` and `rally/styles.css`: the Menu button.
- `game/` stays.
