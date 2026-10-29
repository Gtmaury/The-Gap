# Design

## Context

The snow mesh and the 48 trees are built once for `z` in `[-90, 90]`. `terrainHeight` is one summit at `(0, 70)` and is 0 past its radius, so the ground drawn on screen ends. The car is not stopped at that edge. The camera is still the distant offset from the car. See proposal.md for why this becomes a repeating ribbon.

## Goals / Non-Goals

**Goals:**

- A height function with period 180 m along `z`, shared by the sim, the mesh, and the headlight wedge.
- Trees and snow generated per 180 m repeat, and drawn for the repeats around the car.
- The snow-grip and slope step stay as they are. Only the shape of the ground changes.

**Non-Goals:**

- A road, a finish, crowds, damage, or tiling the world along `x`.
- Recentering the world origin. A few minutes of driving stays inside ordinary float range.
- A new camera pose or a new tree mesh.

## Decisions

### A sine ridge, period 180 m

`terrainHeight(x, z)` ignores `x` and returns `14 + 10 * sin(2π z / 180)`. The value and the slope match at `z` and `z + 180`. At the start, height is 14 m and the grade along `+z` is about 0.349, so the slope acceleration is about 3.23 m/s². Two seconds of uphill throttle stays under speed 16. The same throttle downhill reaches 16. The snow 45 m behind the start is 4 m, which is lower than the start. The old single summit does not tile, so it is replaced rather than copied.

The field id becomes `snow-ribbon`. `minX` and `maxX` stay ±90. `minZ` and `maxZ` describe the first repeat, `[-90, 90)`, not a wall.

Alternative: a bigger finite square. The drive would still end, only later.

### One chunk per repeat

Chunk `i` covers `z` in `[-90 + 180 i, -90 + 180 (i + 1))` and `x` in `[-90, 90]`. Chunk 0 is the old square.

Each chunk has 48 pines and no rocks, from the same hash scatter with the chunk index in the seed. Positions are deterministic. Trees in chunk 0 stay at least 10 m from the start, and at least one has `z` greater than the start. Other chunks do not use that clearance. A tree's `z` stays inside its chunk, so the seam is not doubled. `sim.js` still does not import scenery.

The ground mesh for a chunk keeps the current 40 by 40 sampling.

### Draw the chunks around the car

`draw` keeps the chunks that overlap `z` in `[car.z - 400, car.z + 800]`. That is about two repeats behind the car and four ahead, which covers the far clip while looking along the ribbon. Buffers are rebuilt when that set of chunk indexes changes, not every frame. `x` outside ±90 has no mesh. The height function still answers there, but nothing is drawn, so leaving the band drives off the snow.

The camera offsets stay eye `(x, y + 56, z - 36)` and look `(x, y + 0.5, z + 8)`.

## Risks / Trade-offs

- [The sides of the ribbon are visible] → Accepted. The endless direction is `z`. The band stays 180 m wide so a turn from the middle stays on snow for a while.
- [`sin` at 180 m is not a perfect bit match] → Compare a repeat with a tolerance of `1e-6`, not strict equality.
- [A short chunk window would pop the ground] → The window runs 400 m behind and 800 m ahead, past the 800 m far clip along the ground in front of this camera.
- [Existing tests lock the summit at `(0, 70)` and a lower height at `z = -90`] → Those assertions change. `z = -90` is the same height as the start because it is one half-period away, not the valley.

## Migration Plan

Static page. No saved data. Revert `rally/sim.js`, `rally/stages.js`, `rally/scenery.js`, `rally/render.js`, and their tests to restore the single summit.
