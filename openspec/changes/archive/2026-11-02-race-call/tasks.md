# Tasks

## 1. Start count

- [x] 1.1 Add `countMark` in `hud.js` and a `#call` span on the drive plate. For the first three seconds show 3, then 2, then 1, keep the clock at `0:00`, hide the gear and the speed, and do not call `step`. When the count ends, return the gear and the speed and let the clock and the car move. Verify `node --test rally/menu.test.mjs` shows 3 before one second, 1 at 2.5 seconds, a held start under accelerate, and a moving car after three seconds.

## 2. Finish call

- [x] 2.1 When the run is finished, show Finish and the stopped time in `#call` and `#clock`, and hide the gear and the speed. Menu still opens Stages with that time on the card. Restart shows 3, returns the clock to `0:00`, and keeps the card. Verify `node --test rally/menu.test.mjs` shows Finish and `0:21` with no gear and no `0 km/h`, the same time after another second, and the snow card still at `0:21` after restart.

## 3. Integration

- [x] 3.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass.

## Workflow follow-up

- Archive the change after review.
