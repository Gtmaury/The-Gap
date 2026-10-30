# Proposal

## Why

Each place is one ground color and one repeated solid: 48 identical snow pines, 80 identical forest pines, or 36 identical rocks. The spare spots off the road stay empty, so the maps read as a single stamp.

## What Changes

- Some ground cells on each place use a second flat color: a lighter drift on snow, a darker green on forest, a darker scree on rock. The road colors stay as they are.
- Snow and forest pines keep their colors and a 3 m hit circle. Within a chunk they are not all the same height, and the wide cone stays radius 3.
- Each chunk adds small cover on spots the solids do not use. Snow gets mounds and dark shrubs. Forest gets low undergrowth and stumps. Rock gets smaller rubble and no pines.
- The car drives through that cover. The existing pines and rocks still stop it. No image files.

## Capabilities

### New Capabilities

- `ground-patches`: Each place's ground uses its base color and one patch color.
- `place-cover`: Pines vary in height, and each place grows a small cover the car does not hit.

### Modified Capabilities

- None. `openspec list --specs` is empty.

## Impact

- `rally/render.js` paints the ground cells, the pine heights, and the cover meshes.
- `rally/scenery.js` lists the cover spots apart from the solids.
- `rally/scenery.test.mjs` and `rally/view.test.mjs` cover the patch colors, the heights, and the cover.
- `rally/main.js` keeps building hit circles from the solid list only. The route, the gears, and the road stay as they are.
