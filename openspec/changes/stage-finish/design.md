# Design

## Context

`step` in `rally/sim.js` integrates the car and never stops the run. `paceMarks` fills `#gear` and `#pace` on `#speed`. Stages cards are the three `[data-place]` buttons. The road center is `routeCenter(z)` and the road is 7 m to either side (`ROUTE_HALF`). See proposal.md for why the run needs an end. The gate colors and the `m:ss` text are in the finish-line and stage-clock specs.

## Goals / Non-Goals

**Goals:**

- One pure check decides a finish from the positions before and after a step.
- The clock and the three best times are pure values the menu and the bar can render.
- The gate is one mesh, with the post and beam colors named in the spec.

**Non-Goals:**

- A saved file, a lap, or a second gate.
- A change to gearing, grip, the road mesh, or the tree meshes.

## Decisions

### Cross the plane inside the driving step

`FINISH_Z` is 360. `step` keeps the previous `z`. When the new `z` is at or beyond 360 and the previous `z` is before it, `x` is interpolated to the plane. The run finishes only when that `x` is within 7 m of `routeCenter(360)`. `routeCenter(360)` is 0, so the gate sits on the road's center line.

A finished run stores `finished: true` and zeroes `speed`, `vx`, and `vz` on that step. Later steps return the same pose and ignore throttle, brake, steering, and shift. The crossing pose is kept. It is not pulled back to the plane.

`restart` already builds a fresh run from the place, so a new attempt clears `finished`.

Alternative: stop the car in `main.js` after `step`. A test of `step` would still report a moving car, and the spec's throttle case would depend on the page.

### Count time beside the step

`main.js` adds `dt` into an elapsed number while the run is not finished. `clockText` in `hud.js` formats whole seconds as `m:ss` (`0:12`, `1:15`). The bar adds `<span id="clock">` inside `#speed`, so it inherits the day and night plate from the speed mark.

`noteFinish(best, placeIndex, seconds)` writes the time only when the attempt finishes and the new time is lower, or the place has no time yet. `best` is three slots, one per place, starting empty. Menu before the gate does not call it. The card reads the slot as `clockText` or an em dash `—`. Restart zeroes elapsed and leaves `best` alone.

The best times live in the page session next to the day and car choice. A reload clears them. No storage API.

Alternative: keep the clock inside `step`. The driving step would then own menu text.

### Draw the gate as its own mesh

`finishGate(place)` adds two post boxes and one beam box. Posts use `[0.12, 0.12, 0.14]` and stand at 7 m to either side of the route center, from the terrain up to 6 m. The beam uses `[0.86, 0.22, 0.18]` and joins the posts across the 14 m road. `buildScenery` appends that mesh on the chunk whose span contains 360 m. The existing chunk window already covers that span from the start.

Alternative: a second draw call. The chunk mesh already batches props, and the color test can read `finishGate` directly.

## Risks / Trade-offs

- [A large `dt` skips past the plane] → The test uses the previous `z` and the new `z`, so a jump still counts.
- [The gate sits on the steepest part of the sine, where z is a multiple of 180] → The gate is posts and a beam, not a road chord, so it does not reopen the snow line.
- [The best time disappears on reload] → The spec keeps it for the open page. A file would be a later change.

## Migration Plan

Static page. No saved data today. Remove the gate mesh, the `finished` flag, and the clock mark to undo the change. Best times exist only in memory.

## Open Questions

None.
