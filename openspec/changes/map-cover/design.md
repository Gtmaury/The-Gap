# Design

## Context

`propsForChunk` fills a 24 by 24 grid, drops spots on the road or within 10 m of the start, sorts by hash, and keeps `field.count` solids. `buildTerrain` paints every cell `field.ground`. `pineMesh` builds one snow shape and one forest shape. `main.js` turns `propsForChunk` into hit circles. See proposal.md for why the empty spots and the flat ground have to change. The colors and counts are in the ground-patches and place-cover specs.

## Goals / Non-Goals

**Goals:**

- Both ground colors appear in chunk 0 of each place, and the road mesh does not receive a patch color.
- A chunk's pines use three heights. The wide cone stays radius 3.
- Cover comes from the spots after the solids, with the counts in the spec, and those spots never enter the hit list.

**Non-Goals:**

- Image files or texture coordinates.
- A new road, a new pine hit radius, or a new solid count.
- Cover that stops the car.

## Decisions

### Paint patches in the ground mesh

`stages.js` gains `patch` next to `ground`: snow `[0.72, 0.78, 0.84]`, forest `[0.06, 0.10, 0.07]`, rock `[0.18, 0.18, 0.20]`. In `buildTerrain`, a cell whose `ix % 8 === 0` uses `patch`. The other cells use `ground`. Forty columns include both, so chunk 0 cannot be one color. The road is a separate mesh and still calls `roadColor`.

Alternative: choose the patch in the fragment shader. The vertices already carry a color, and the tests read that color without WebGL.

### Three pine heights, one footprint

`propsForChunk` sets `height` to `0`, `1`, or `2` by the solid's index modulo 3. `pineMesh` keeps the wide cone at radius 3 and scales only the vertical sizes: class 0 is the current shape, class 1 is 1.18 times as tall, class 2 is 0.82 times as tall. The snow cap stays above the body. The forest upper cone stays green. `PINE_RADIUS` stays 3.

Alternative: scale the radius too. A narrower tree would still stop the car at 3 m.

### Take cover from the spare spots

`coverForChunk` uses the same sorted spot list and skips the first `field.count` entries.

- Snow: the next 24 are mounds, the next 16 are shrubs.
- Forest: the next 40 are undergrowth, the next 12 are stumps.
- Rock: the next 28 are rubble.

A mound is a cone of radius 1.2 and height 0.55. A shrub is a cone of radius 0.7 and height 1.4. Undergrowth is a cone of radius 0.9 and height 1.2. A stump is a box 0.7 m wide and 0.6 m tall. Rubble is one box about 0.8 m across, smaller than the two-box rock. `buildScenery` appends these meshes after the solids. `main.js` does not read `coverForChunk`.

The grid has 576 candidates and the largest take is 80 solids plus 52 cover, so the spare spots are enough. The road and start filters already ran on that list.

Alternative: a second grid. It could land on a solid or on the asphalt.

## Risks / Trade-offs

- [A short pine is still 3 m wide] → The height classes do not change the wide radius, so the hit circle matches the footprint.
- [Cover adds vertices on every visible chunk] → Each piece is one cone or one box, and the chunk is still one mesh.
- [A patch cell meets the road edge] → The road mesh is drawn above the ground and keeps `roadColor`.

## Migration Plan

Static page. No saved data. Remove `patch`, the height field, and `coverForChunk` to undo the change.

## Open Questions

None.
