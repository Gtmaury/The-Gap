# Tasks

## 1. Driving step

- [x] 1.1 Add `rally/sim.js` with `createRun`, `step`, and `restart`: one car at the stage start facing along the first segment, accelerate and brake with the design speeds, speed clamped to `0..28` m/s with no reverse, and heading changes only while speed is greater than 0. Verify `node rally/sim.test.mjs` covers a single car at the start, acceleration up to top speed, braking to a stop, a left steer while moving, and an unchanged heading while stopped.
- [x] 1.2 Snap the car's vertical position to `terrainHeight(x, z)` on every step, using the same function the mesh will sample. Verify a sim test places a car over a non-flat sample and asserts `car.y` equals `terrainHeight` at that `x, z`.

## 2. Stage rules

- [x] 2.1 In `rally/sim.js`, treat the car as on course only when its horizontal distance to the polyline is within `halfWidth`, add stage time every running step, add penalty time only while off course, finish only when the car crosses the last point on course, and ignore driving input after finish. Verify `node rally/sim.test.mjs` covers inside versus outside the corridor, penalty time equal to the off-course span and unchanged while on course, finish refused while off course, no motion after an on-course finish, and total time equal to stage time plus penalty time.
- [x] 2.2 Implement `restart` so the same stage runs again from its start with speed 0 and both clocks at 0. Verify a sim test restarts mid-run and from a finished run and asserts the pose and both clocks.

## 3. Three stages

- [x] 3.1 Add `rally/stages.js` with exactly three stages, distinct names, `halfWidth` 8, and polylines whose first and last points are more than a half-width apart, with mild corners. Verify a node test imports the list and asserts length 3, unique names, and that each finish is outside the start's half-width.

## 4. Page and view

- [x] 4.1 Add `rally/index.html` and `rally/main.js` that show the three stage names as buttons and do not start a run until one is chosen. If `getContext('webgl')` fails, show the text "This browser cannot display the rally." and do not start a stage. Verify in the browser that the list shows three names before play, and that blocking WebGL shows that message with no running stage.
- [x] 4.2 Add `rally/render.js` with one unlit color shader, a coarse terrain grid, course posts, one car mesh, and a finish gate colored differently from the posts. Place the camera behind and above the car looking along its heading. Verify in the browser, on a running stage, that the car, ground, and posts are flat-colored polygons, the finish gate is visibly different from the posts, and turning the car keeps the camera behind it with the course ahead in view.
- [x] 4.3 Add readable HTML for the running stage time, the literal `OFF COURSE` while off course, and a result with the stage name, stage time, penalty time, and total (`m:ss.ss`). Wire Restart to `R` and a button, and Back to `Esc` and a button. Verify in the browser that leaving the course shows `OFF COURSE`, finishing shows the three times with the total equal to the sum, restart returns to the start at zero, Back shows the stage list with no clock, and a reload shows the list with no previous time.

## 5. Docs

- [x] 5.1 Document `python -m http.server 4174 --directory rally` in the README, and leave the existing Gap command on port 4173 unchanged. Verify the README still contains the original Gap command and the new command matches this design. Do not edit files under `game/`.

## Workflow follow-up

- Archive this change after the tasks above are done and reviewed.
