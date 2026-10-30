# Tasks

## 1. Manual gearbox

- [ ] 1.1 Replace `SPEED_STEPS`, `STEP_HOLD`, `stepIndex`, and `stepHold` with `GEAR_TOP` `[8, 12, 16, 20, 24, 28, 32]`, `GEAR_PULL` `[22, 18, 15, 12, 10, 8, 6]`, and `gear` starting at `0`. Throttle adds `GEAR_PULL[gear] * grip * dt` and clamps to `GEAR_TOP[gear]`. `input.shift` of `-1`, `0`, or `1` moves one gear and cuts forward speed down to the new top. Remove `ACCEL`. Update the crest and downhill checks in `rally/sim.test.mjs` to a `0.2` s throttle so they stay under gear 1. Verify `node --test rally/sim.test.mjs` shows gear 1 from rest on flat ground after one second above 0 and at most 8 m/s, one shift from gear 1 landing on a 12 m/s top, a second step with shift `0` staying in that gear, a shift from gear 2 at 12 m/s landing at 8 m/s, and a `0.2` s flat throttle from rest in gear 1 gaining more speed than the same throttle in gear 7 from 24 m/s.

## 2. Shifter and readout

- [ ] 2.1 On `ArrowUp` and `ArrowDown` keydown, ignore `event.repeat` and pass shift `1` or `-1` to the first physics step only, then clear it. Remove ArrowUp from accelerate and ArrowDown from brake. `paceText(speed, gear)` returns the 1-based gear, a space, and the rounded km/h. Verify `node --test rally/menu.test.mjs` shows `3 36 km/h` at 10 m/s in gear 3, ArrowUp absent from the accelerator, and a held arrow producing one shift.

## 3. Menu button

- [ ] 3.1 Add `<button id="back" type="button" hidden>Menu</button>` and pin it to the top right with background `#0d1018`, color `#f3ecdf`, and no border. `begin` shows it. `showMenu` hides it. Its click calls `showMenu`. Verify `node --test rally/menu.test.mjs` shows the button text, the night color, a hidden button while the level menu is the first view, a visible button after a place starts, and a click that leaves the car stopped with the level menu open.

## 4. Integration

- [ ] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass. Then drive a place and confirm the Menu button is visible, W climbs only to the first gear until the up arrow is pressed once, holding the up arrow does not skip gears, the readout shows the gear and a speed at or under that gear, the down arrow brings the speed back, and the Menu button returns to the level menu with the car stopped.
