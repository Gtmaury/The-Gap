# Tasks

## 1. Farther camera

- [ ] 1.1 Move `viewPose` to an eye 56 m up and 36 m toward world `-z`, looking 8 m toward world `+z`. Update `rally/view.test.mjs` for those offsets, the car still in the lower half, and an 8 m vertical whose top is above its base by more than 0.08 NDC. Verify `node --test rally/view.test.mjs` passes.

## 2. Lit faces

- [ ] 2.1 Add per-face normals and a shade flag, and light faces with ambient `0.42`, diffuse `0.70`, and light direction `(0.15, 0.90, -0.35)`. Leave the headlight wedge unshaded. Export `lightFactor` and verify an upward face is brighter than a downward face and brighter than a face pointing away from the light, and that `node --test rally/view.test.mjs` passes.

## 3. Integration

- [ ] 3.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs` and verify all three pass. Then open the rally and confirm the car is smaller and still in the lower half, a pine shows faces of different brightness, the headlight wedge stays bright, and steering still rotates the car without yawing the camera.
