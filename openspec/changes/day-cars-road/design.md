# Design

## Context

The fragment shader hardcodes ambient `0.15`, diffuse `0.55`, and light `(0.25, 0.72, -0.45)`. The clear color is `[0.05, 0.06, 0.10]`. `headlightAmount` always evaluates the beam. `buildRoute` paints every quad `[0.62, 0.48, 0.28]`. `buildCarLocal` builds one silver body. The level menu offers only the three places. See proposal.md for why day, three cars, and a road replace that.

## Goals / Non-Goals

**Goals:**

- One time flag and one car id on the session, chosen before `begin`.
- A road color function the mesh and the tests share.
- Three local meshes that still drive with `CAR_RADIUS` 1.1.

**Non-Goals:**

- A new bend, a new place, or a car that changes grip or gears.
- A saved choice after the page reloads.
- Headlights that stay on in daylight.

## Decisions

### Pass the time into the lamp and the sky

`NIGHT` keeps sky `[0.05, 0.06, 0.10]`, ambient `0.15`, diffuse `0.55`, and direction `(0.25, 0.72, -0.45)`. `DAY` uses sky `[0.64, 0.76, 0.88]`, ambient `0.42`, diffuse `0.75`, and direction `(0.15, 0.92, 0.2)`. `lightFactor(normal, day)` uses that pair. `headlightAmount` gains a `day` argument and returns `0` when it is true. The shader gets `uAmbient`, `uDiffuse`, `uLight`, and `uBeam`. Day sets `uBeam` to `0`. `createView` gains `setTime(day)`, which sets the clear color and those uniforms.

The menu has two buttons, Day and Night. Night starts with the class `is-selected`. Choosing one updates the session and the class. `begin` calls `view.setTime`. Escape returns to the menu without clearing the choice.

Alternative: three day places beside the night ones. The menu would double, and the hills would be duplicated.

### Keep the bend and split the surface

`route.js` exports `roadColor(offset, z)`. `offset` is meters from `routeCenter(z)`. Within `0.12` m, and when `Math.floor(z / 6)` is even, the color is the dash `[0.86, 0.84, 0.78]`. Out to `5.5` m it is asphalt `[0.22, 0.23, 0.25]`. From there to `7` m it is the shoulder `[0.45, 0.43, 0.38]`. Past `7` m it returns null. The tan triple leaves `route.js` and `render.js`.

`buildRoute` walks `z` in `6` m steps. Each step is three quads per side of the dash: dash or asphalt in the center, asphalt to `5.5` m, shoulder to `7` m. The quads still sit `0.05` m above `terrainHeight`. The walls and `routeClearance` stay. The menu `.road` background becomes `#38393f`.

Alternative: keep one quad and only change its color to gray. The shoulders and the dash would be missing, so it would still read as a strip.

### Build three bodies and swap the buffer

`buildCarLocal(kind)` returns the hatch for `"hatch"` and unknown ids. The coupe uses body `[0.75, 0.18, 0.16]`, a cabin top of `1.35` instead of `1.7`, and a nose to `z = 2.35` instead of `1.9`. The wagon uses body `[0.18, 0.28, 0.48]` and a rear box up to `y = 2.15` from `z = -1.7` to `z = 0.2`. `CAR_RADIUS` stays `1.1`. `createView` gains `setCar(kind)` and rebuilds the local car buffer. The menu shows three buttons with a `clip-path` silhouette. Hatch starts selected. `begin` calls `view.setCar`.

Alternative: recolor the same boxes. The cars would differ only by paint, which misses the coupe and the wagon.

## Risks / Trade-offs

- [The scenery test still requires the tan triple and `ROUTE_COLOR`] → That assertion moves to `roadColor`, and the tan triple must be absent.
- [A 6 m road step crosses a slope] → Each corner still samples `terrainHeight`, so the road follows the hill.
- [The coupe nose sticks past the hit circle] → The circle stays the rule for trees and walls. The picture can be longer than the circle, as the current body already is.

## Migration Plan

Static page. No saved data. Restore the tan quad, the single car, and the hardcoded night shader to undo the change.

## Open Questions

None.
