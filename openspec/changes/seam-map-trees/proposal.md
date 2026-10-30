# Proposal

## Why

Every 180 m the road opens a line and the snow shows through. The pines are one gray cone on every map, so a snow stage and a forest stage grow the same tree.

## What Changes

- The ground and the road overlap at each 180 m join, so the line of snow across the asphalt goes away.
- A snow pine gets a green body and a white cap. A forest pine gets a trunk and two greens. The rock place keeps its stones.
- The picture stays flat color. No image files. The pine hit circle stays 3 m.

## Capabilities

### New Capabilities

- `chunk-join`: The ground and the road meet across each 180 m chunk boundary.
- `map-trees`: A pine's colors follow the place it stands in.

### Modified Capabilities

- None. `openspec list --specs` is empty.

## Impact

- `rally/render.js` builds the terrain, the road, and the pine. The overlap and the painted trees live there.
- `rally/scenery.test.mjs` and `rally/view.test.mjs` cover the join and the tree colors.
- `rally/stages.js`, the route, the gears, and the car hit circle stay as they are.
