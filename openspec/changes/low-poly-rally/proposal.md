# Proposal

## Why

The repo only has The Gap, a browser vocabulary drill. There is no driving game. A small low-poly rally gives a playable stage you can finish in the browser, with a flat-shaded look instead of a realistic sim.

## What Changes

- Add a separate browser rally game. The Gap stays as it is: same screens, same practice rules, same static server entry.
- One low-poly car, driven with the keyboard, on a few short stages.
- Each stage has a start, a course, a finish, a running clock, and a result.
- Leaving the course adds a time penalty. The player can restart the stage.
- The car, terrain, and props read as flat-shaded low-poly 3D from a chase camera.

Assumptions recorded here because they set the acceptance bar:

- "Lowpolly" means low-poly: few flat faces, solid colors, no photo textures.
- Single player only. Keyboard on a desktop browser. No gamepad, touch, or multiplayer in this change.
- Three short stages and one car. No career, damage model, co-driver audio, weather, or licensed vehicles.
- The rally lives beside The Gap (its own directory and page), not inside the vocabulary UI.

## Capabilities

### New Capabilities

- `car-control`: Keyboard driving of one rally car, including acceleration, braking, steering, and a reset back onto the stage.
- `stage-run`: Starting a chosen stage, following its course, finishing, restarting, and receiving a timed result with off-course penalties.
- `low-poly-view`: Chase-camera presentation of the car, stage, and props as flat-shaded low-poly 3D.

### Modified Capabilities

- None. The Gap has no OpenSpec capabilities, and this change does not alter its behavior.

## Impact

- New static game files, separate from `game/` (The Gap: `index.html`, `app.js`, `engine.js`, `library.js`, and its tests).
- README run instructions gain a second entry for the rally page. The Gap command stays valid.
- No server, accounts, or network API. A browser with WebGL is required to play.
- Pure driving and timing rules should be testable without a display, in the same Node test style already used by `game/engine.test.mjs`.
