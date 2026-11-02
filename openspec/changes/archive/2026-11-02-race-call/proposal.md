# Proposal

## Why

The clock starts the moment a place is chosen, and the finish leaves the time beside a stopped speed. The start and the gate do not read as a race.

## What Changes

- Starting a place, and restarting one, shows 3, then 2, then 1 on the drive plate. Each mark lasts one second. The clock stays `0:00` and the car stays still.
- When the 1 ends, the plate returns to the gear and the speed and the clock starts. That return is the go.
- Crossing the gate replaces the gear and the speed with the word Finish and the stopped time. Menu still returns to Stages, and the card still keeps the best time.
- The day and night plate, the gate, the three cars, and the three places stay as they are.

## Capabilities

### New Capabilities

- `start-call`: The plate counts 3, 2, 1 before the clock and the car move.
- `finish-call`: The plate shows Finish and the time once the gate is crossed.

### Modified Capabilities

- None. `openspec list --specs` is empty. The clock and the gate live in the completed change `stage-finish`.

## Impact

- `rally/hud.js` names the count mark and the finish call.
- `rally/main.js` holds the car through the count and swaps the plate at the gate.
- `rally/index.html` and `rally/styles.css` add the call mark on the existing plate.
- `rally/menu.test.mjs` covers the count, the still car, and the Finish line.
