# Design

## Context

`buildWedge` draws an unlit white fan 16 m long and 14 m wide, and the fragment shader adds a second hard cone of the same size onto any ground vertex. That is the solid sheet in the close view. `TOP_SPEED` clamps forward speed at 16 m/s. The page starts `createRun(field)` immediately, and places change only through keys `1`, `2`, and `3`. See proposal.md for why the sheet, the menu, and the speed steps replace that.

## Goals / Non-Goals

**Goals:**

- One ground beam, about 8 m long, with the road color still visible.
- A menu drawn in HTML and CSS that gates `step`.
- Speed steps stored on the car, with a km/h label tied to `car.speed`.

**Non-Goals:**

- A new place, a gear lever, or a saved best speed.
- A WebGL menu, a webfont, or a change to the camera, the route, or the collisions.
- Alpha-blended light volumes. The beam is a color added on the ground.

## Decisions

### Drop the wedge and shorten the ground beam

Delete `buildWedge` and its buffer. The fragment shader and `headlightAmount` use the same cone: the beam starts 1.2 m ahead of the car, ends at 8 m, and its half-width is `0.6 + along / 8 * 1.6` meters. Outside that cone the added light is 0, so a point 20 m ahead and a point 4 m to the side stay at the night color. Inside, the fade is `(1 - along / 8) * (1 - lat / half)`. The shader adds that fade times `vec3(0.85, 0.72, 0.45)` and only where the fragment is within 1.5 m of the ground height. The road color is multiplied by the moon first, then the beam is added, so the route stays brown and the snow stays blue-gray. Nothing with shade `0` is drawn for the lamp.

Alternative: keep the wedge and set its alpha. The sheet would still be a polygon hovering on the slope, which is the shape in the screenshot.

### Gate the drive with an HTML menu

`index.html` gets a `#menu` section over the canvas and a `#speed` line. The menu is CSS only: night sky `#0d1018`, a brown road band, and flat pines or rocks made with `clip-path`. Each place is a button showing its own shapes and its name. No webfont and no canvas drawing for the menu.

`main.js` starts with `playing` false, so `frame` may paint the last pose but it does not call `step`. Choosing a button or pressing `1`, `2`, or `3` runs `createRun` for that place, hides `#menu`, shows `#speed`, and sets `playing`. Escape sets `playing` false, shows the menu, and hides the readout. The car cannot advance while the menu is up.

Alternative: draw the menu in WebGL. The art would share the rally mesh code, and the tests could not see the buttons without a GPU.

### Open the next 4 m/s step after a hold

`SPEED_STEPS` is `[8, 12, 16, 20, 24, 28, 32]` and `STEP_HOLD` is `0.45` seconds. The car stores `stepIndex` and `stepHold`, both `0` in `createRun`. After the usual throttle, brake, drag, and slope, the open cap is `SPEED_STEPS[stepIndex]`.

While accelerating, if forward speed is within 0.4 m/s of that cap, `stepHold` increases by `dt`. Otherwise `stepHold` resets. At `0.45` s, and when a higher step exists, `stepIndex` increases by one and `stepHold` resets. Forward speed is then clamped to the open cap. While braking or coasting, `stepHold` stays `0` and `stepIndex` drops until the open cap is the lowest step still at or above the speed. The first step remains 8 m/s, so a car below that can still accelerate up to 8. Grip and slope are unchanged, so snow and rock still take longer to arrive at a step than forest.

`#speed` shows `Math.round(car.speed * 3.6)` and the letters `km/h`. At 10 m/s that is `36 km/h`. It is hidden with the menu.

Alternative: raise `TOP_SPEED` to 32 and leave the climb smooth. The number would rise, but it would not move in the steps the proposal names.

## Risks / Trade-offs

- [The shader cone and `headlightAmount` diverge] → One pair of numbers, and `view.test.mjs` checks the 4 m ahead, 4 m side, and 20 m cases.
- [A short beam is faint from the high camera] → The near end adds most of `vec3(0.85, 0.72, 0.45)`, so the patch by the bumper stays obvious.
- [Uphill snow spends a long time on the 8 m/s step] → That is the grip and the grade. The hold does not start until the car is at the step.
- [Escape during a catch-up frame] → `playing` is read before `step`, so a queued physics step does not run once the menu is open.

## Migration Plan

Static page. No saved data. Restore `buildWedge`, the 16 m cone, `TOP_SPEED`, and the immediate start to undo the change.

## Open Questions

None.
