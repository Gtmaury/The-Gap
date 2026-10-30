# Design

## Context

`buildTerrain` and `buildRoute` each stop on the plane `zBase + span`. The next chunk starts on that same plane, so the gap in meters is 0. That plane is also where the hill is steepest, and the road sits 0.05 m above the ground, so a crack between the two meshes shows the snow. See proposal.md for why that line has to go. `addCone` paints every pine `[0.22, 0.22, 0.24]`.

## Goals / Non-Goals

**Goals:**

- Each chunk's ground and road include z = 86 and z = 94 around the join at z = 90.
- Snow and forest pines use the colors in the map-trees spec. Tests can read those meshes without WebGL.

**Non-Goals:**

- Image files or texture coordinates.
- A new bend, a new pine radius, or a new rock shape.
- Extra trees inside the overlap.

## Decisions

### Extend each chunk across the join

`meshSkirt` is 6 m for the road and one terrain cell (4.5 m) for the ground. Both are more than the 4 m the spec requires. A chunk whose span is `[zBase, zBase + span)` builds road quads from `zBase - 6` through `zBase + span + 6`, on the existing 6 m lattice, and terrain rows from `zBase - 4.5` through `zBase + span + 4.5`, on the existing 4.5 m grid.

The old edge at z = 90 then sits inside both meshes, with road on both sides of it in each mesh. The skirt of one chunk repeats quads the next chunk also draws. Those quads use the same positions, so the depth test drops the second copy. Props stay inside `[zBase, zBase + span)`.

Alternative: start the next chunk where the skirt ends. That only moves the line to the new edge.

### Paint the pine from the place

`pineMesh(place)` returns the vertex list `buildScenery` already uploads. The wide cone keeps radius 3, matching `PINE_RADIUS`.

Snow is a cone `[0.16, 0.32, 0.2]` up to y + 8, plus a cap `[0.92, 0.93, 0.9]` from y + 5 to y + 8.2 with radius 1.5. Forest is a trunk `[0.28, 0.16, 0.1]` up to y + 1.4, a cone `[0.1, 0.28, 0.12]` up to y + 8, and a cone `[0.18, 0.4, 0.16]` from y + 3.4 to y + 8.6 with radius 2.1. Rock still uses the two stone boxes and `[0.16, 0.16, 0.17]`.

Alternative: sample a bark image. The rest of the scene is flat color, and the spec names these triples.

## Risks / Trade-offs

- [The skirt repeats a strip of road] → The repeated quads share positions, so the second draw fails the depth test instead of flickering.
- [A pine's cap is wider than its picture from above] → The wide cone stays radius 3, and `PINE_RADIUS` stays 3. The cap is narrower than the body.
- [The gray pine color is still used by a test] → The test moves to the snow and forest triples. The gray triple must not be the only pine color.

## Migration Plan

Static page. No saved data. Restore the exact span and the single gray cone to undo the change.

## Open Questions

None.
