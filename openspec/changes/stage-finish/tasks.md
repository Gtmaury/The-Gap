# Tasks

## 1. Finish line

- [x] 1.1 In `step`, finish the run when the car crosses z = 360 with its center within 7 m of the route center, set speed to 0, and ignore throttle, brake, and steering on later steps. Leave a crossing farther than 7 m still moving. Verify `node --test rally/sim.test.mjs` shows a finish from 359 m to 361 m at 2 m off center, no finish at 9 m off center, and a held pose after accelerate.

## 2. Stage clock

- [x] 2.1 Add `clockText` and `noteFinish` in `hud.js`, show `<span id="clock">` on the drive bar, and show each place's best time or an em dash on its Stages card. Format 12 seconds as `0:12` and 75 seconds as `1:15`. A slower finish keeps the faster time, Menu before the gate records nothing, and restart shows `0:00` while the card keeps the best time. Verify `node --test rally/menu.test.mjs` shows those strings, the clock mark, the three card times, and the unchanged best time after restart.

## 3. Gate mesh

- [x] 3.1 Draw `finishGate` as two posts `[0.12, 0.12, 0.14]` and a beam `[0.86, 0.22, 0.18]` spanning 7 m to either side of the route center at 360 m, on snow, forest, and rock, and include it in the scenery chunk that contains that distance. Verify `node --test rally/view.test.mjs` shows both colors and the 14 m beam on all three places.

## 4. Integration

- [x] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass.

## Workflow follow-up

- Archive the change after review.
