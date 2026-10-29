# Tasks

## 1. Lane camera

- [ ] 1.1 Move `viewPose` to eye `(car.x, car.y + 43, car.z - 47)` and look `(car.x, car.y + 0.5, car.z + 16)`. Verify `node --test rally/view.test.mjs` shows the eye 43 m above the car and 47 m behind it, the look point 16 m ahead, the same offset after a turn, the car in the lower half, and a point ahead of the car off the vertical axis after a diagonal heading.

## 2. Walled route

- [ ] 2.1 Add `rally/route.js` with center `18 * sin(2π z / 180)` and a 7 m half-width, draw that strip in `[0.62, 0.48, 0.28]` with each terrain chunk, and keep scenery off the strip by `7 + radius + 0.5` m. Verify `node --test rally/scenery.test.mjs` shows the start on the centerline, the center at `z` matching the center at `z + 180` within `1e-6`, no pine or rock on the route, the 10 m start clearance, and one prop still ahead of each start.

## 3. Slide collisions

- [ ] 3.1 After the usual step, push the car out of route walls and out of circles, and drop only the velocity aimed into the solid. The car radius is 1.1 m, a pine is 3 m, and a rock is 1.4 m. `main.js` passes the props around the car. `sim.js` does not import scenery. Verify `node --test rally/sim.test.mjs` shows a drive into the bend staying inside the route and still moving, a short step into a circle that does not pass through it, and heading unchanged by the hit.

## 4. Integration

- [ ] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs` and verify all three pass. Then drive night snow along the route past the old edge, switch to night forest with `2` and night rock with `3`, and confirm the route continues, the car stays on it and in the lower half, a steer into the wall slides instead of crossing, a tree or rock is not driven through, and the camera yaw stays fixed.
