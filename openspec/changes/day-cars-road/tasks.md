# Tasks

## 1. Asphalt road

- [ ] 1.1 Add `roadColor(offset, z)` with dash `[0.86, 0.84, 0.78]` inside 0.12 m on even 6 m blocks, asphalt `[0.22, 0.23, 0.25]` out to 5.5 m, and shoulder `[0.45, 0.43, 0.38]` out to 7 m. Draw the road from those bands in 6 m steps and remove `[0.62, 0.48, 0.28]`. Set the menu `.road` background to `#38393f`. Verify `node --test rally/scenery.test.mjs` shows the start on the centerline, the center repeating every 180 m, a point 6 m out on the shoulder and a point 3 m out on asphalt, a center point 6 m ahead swapping dash and asphalt, and the tan triple absent.

## 2. Day and night

- [ ] 2.1 Add Day and Night on the level menu, opening on Night and keeping the choice when a drive returns. Night keeps sky `[0.05, 0.06, 0.10]`, ambient `0.15`, diffuse `0.55`, and direction `(0.25, 0.72, -0.45)`, with the beam on. Day uses sky `[0.64, 0.76, 0.88]`, ambient `0.42`, diffuse `0.75`, direction `(0.15, 0.92, 0.2)`, and a beam that adds nothing. Verify `node --test rally/view.test.mjs rally/menu.test.mjs` shows an upward face brighter in day than at night, a night point 4 m ahead brighter than a point 4 m to the side, those two points equal in day, and Night selected on load.

## 3. Three cars

- [ ] 3.1 Add Hatch, Coupe, and Wagon on the level menu, opening on Hatch and keeping the choice when a drive returns. Hatch stays `[0.9, 0.9, 0.92]`. The coupe is `[0.75, 0.18, 0.16]`, with a cabin top of 1.35 and a nose at `z = 2.35`. The wagon is `[0.18, 0.28, 0.48]`, with a rear box up to `y = 2.15`. `CAR_RADIUS` stays 1.1. Verify `node --test rally/view.test.mjs rally/sim.test.mjs rally/menu.test.mjs` shows the coupe color and a farther nose, the wagon's taller rear, the same 1.1 m circle, and Hatch selected on load.

## 4. Integration

- [ ] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass. Then open the rally and confirm the menu road is gray, Day lights the forest with no beam and a pale sky, Night brings the beam back, Coupe and Wagon change the car, the road shows shoulders and a broken dash, and the car still slides on the same walls.
