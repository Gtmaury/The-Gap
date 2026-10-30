# Tasks

## 1. Road beam

- [ ] 1.1 Remove `buildWedge` and its buffer. Light only ground from 1.2 m to 8 m ahead, with half-width `0.6 + along / 8 * 1.6`, fade `(1 - along / 8) * (1 - lat / half)`, and added color `(0.85, 0.72, 0.45)`. Keep `headlightAmount` on that same cone. Verify `node --test rally/view.test.mjs` shows a point 4 m ahead brighter than a point 4 m to the side, a point 20 m ahead as dark as the side, the bright patch swapped after the nose turns, and no wedge draw left in `rally/render.js`.

## 2. Stepped speed

- [ ] 2.1 Replace the 16 m/s cap with steps `8, 12, 16, 20, 24, 28, 32` and a `0.45` s hold at the open step while accelerating. Store `stepIndex` and `stepHold` on the car, reset them in `createRun`, and drop the index when coasting or braking falls below the open step. Verify `node --test rally/sim.test.mjs` shows one second of throttle from rest on flat ground at or below 12 m/s, a `0.45` s hold at a step opening the next step 4 m/s higher, speed never passing 32 m/s, a coast after a high step lowering the limit, and the old `TOP_SPEED === 16` check gone.

## 3. Art menu and readout

- [ ] 3.1 Add `#menu` and `#speed` in `rally/index.html` and `rally/styles.css`. The menu uses night sky `#0d1018`, a brown road, and `clip-path` trees or rocks, with a button for night snow, night forest, and night rock. The page starts with the menu up and does not call `step` until a button or `1`, `2`, or `3` starts that place. Escape shows the menu and stops `step`. `#speed` shows `Math.round(car.speed * 3.6)` plus `km/h` during a drive and is hidden on the menu. Verify `node --test rally/menu.test.mjs` shows the three place names, `clip-path`, the sky color, a hidden readout on load, `36 km/h` at 10 m/s, and that Escape stops the drive.

## 4. Integration

- [ ] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass. Then open the rally and confirm the menu is the first view, night forest starts from its button with forest ground, the road by the bumper is brighter than the road beside the car and no white sheet covers the car, the speed number climbs while `W` is held and stays at or under 115 km/h, and Escape brings the menu back with the car stopped.
