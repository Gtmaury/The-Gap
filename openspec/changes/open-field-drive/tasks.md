# Tasks

## 1. Open field sim

- [ ] 1.1 Replace the three stages with one field and change the run so it starts at that field's start, `terrainHeight` is flat, `TOP_SPEED` is 16, and stepping never finishes or adds penalty time. Update `rally/sim.test.mjs` and verify `node --test rally/sim.test.mjs` passes.

## 2. Scenery in the drive

- [ ] 2.1 Scatter about 28 pines and 20 rocks across the field, keep them at least 10 m from the start, and require at least one ahead of the start. Update `rally/scenery.test.mjs` and verify `node --test rally/scenery.test.mjs` passes.

## 3. Centered view

- [ ] 3.1 Move the camera to 6 m behind and 62 m up, looking 8 m ahead, paint the ground one light gray, stop drawing course posts and the finish gate, keep the headlight wedge, and add red taillight boxes on the light car. Verify by driving straight and through a turn that the car stays near the center, the ground is one gray, no posts or gate appear, the wedge stays ahead, and red marks show at the rear.

## 4. Page without a HUD

- [ ] 4.1 Start that field when the rally page loads, and remove the stage list, timer, off-course label, result, and on-screen restart and back buttons. Keep keyboard driving and restart on `R`. Verify the page source has none of those labels and that loading the page shows the driving view without a click.

## 5. Integration

- [ ] 5.1 Run `node --test rally/*.test.mjs` and verify both test files pass. Then drive the page with accelerate and steer and verify the car stays near the center of a flat gray field, passes among dark pines and rocks, shows the headlight wedge and red taillights, and shows no timer or off-course label.
