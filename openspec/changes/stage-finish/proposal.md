# Proposal

## Why

The drive never ends. The car can keep going past the hills, and Stages has no time to beat.

## What Changes

- A gate stands on the road 360 m ahead of the start on snow, forest, and rock.
- Crossing that gate on the road stops the car and the clock. Crossing beside the road does not.
- The drive bar shows the elapsed time as `m:ss` beside the gear and the speed. The clock starts when the place starts and stops on the gate.
- Each Stages card shows that place's best time, or an em dash when none exists. A faster finish replaces it. Menu keeps those times for the rest of the page session. Restart starts a new attempt and keeps the best time.
- Day, night, the three cars, the road, and the trees stay as they are.

## Capabilities

### New Capabilities

- `finish-line`: A gate 360 m ahead ends the run only when the car is on the road.
- `stage-clock`: The bar shows elapsed time, and each place keeps its best time on Stages.

### Modified Capabilities

- None. `openspec list --specs` is empty.

## Impact

- `rally/sim.js` stops the car once the finish plane is crossed on the road.
- `rally/render.js` draws the gate.
- `rally/hud.js` formats the clock and stores the best time per place.
- `rally/index.html` and `rally/styles.css` show the time on the bar and on each card.
- `rally/sim.test.mjs`, `rally/view.test.mjs`, and `rally/menu.test.mjs` cover the gate, the clock, and the best time.
