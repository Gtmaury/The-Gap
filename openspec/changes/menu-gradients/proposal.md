# Proposal

## Why

The three level cards share one navy rectangle, so snow, forest, and rock only differ by the drawing on top. The Stages poster is a flat fill, and Day, Night, and the chosen car are marked with a line.

## What Changes

- The Stages poster uses a gradient. Night runs from `#0d1018` to `#1b2433`. Day runs from `#a3c2e0` to `#d5e4f2`. The moon still hides in day.
- Each card gets its own ground gradient, a 12 px corner, and sits above the road shape. Snow, forest, and rock keep their drawings. Day uses a lighter gradient on each card.
- The selected time and the selected car use a filled pill. A card lifts slightly on hover. The keyboard focus ring stays.
- The drive bar, the keys, the cars, and the three places stay as they are.

## Capabilities

### New Capabilities

- `menu-wash`: The Stages poster and the selected time and car use a gradient and a filled pill.
- `place-cards`: Each level card has its own ground, a rounded corner, and a hover lift.

### Modified Capabilities

- None. `openspec list --specs` is empty.

## Impact

- `rally/styles.css` paints the poster gradient, the pills, and the three card grounds.
- `rally/menu.test.mjs` covers the gradients, the radius, and the pill. The flat `#menu` background checks from `time-menus` move to these gradients.
- `rally/index.html`, the driving step, and the drive bar stay as they are.
