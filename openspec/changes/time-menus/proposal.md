# Proposal

## Why

The drive bar and the Stages poster were drawn for night. On a day run the speed sits in cream with no plate, and Menu is a black stamp on the sky. Stages still shows a moon and cards named Night snow, Night forest, and Night rock after Day is chosen.

## What Changes

- The speed and Menu share a plate. Night keeps cream type on `#0d1018`. Day uses dark type on `#f3ecdf`. The gear is a smaller mark than the speed number. Menu has padding around the word.
- The day mark stays on the page from the Stages choice through the drive and back to the menu.
- Day hides the moon and paints the poster with the day sky. The cards read Snow, Forest, and Rock. Snow shows a white cap, forest a trunk and two greens, and rock a stone with no pine.
- The keys, the cars, and the three places stay as they are.

## Capabilities

### New Capabilities

- `drive-bar`: The speed and Menu plate follow day and night, and the gear is smaller than the speed.
- `stage-poster`: The Stages poster and the three cards follow the selected time and place.

### Modified Capabilities

- None. `openspec list --specs` is empty.

## Impact

- `rally/styles.css` and `rally/index.html` draw the plate, the split readout, the day poster, and the cards.
- `rally/main.js` sets the day mark from the session and fills the gear and the speed.
- `rally/menu.test.mjs` covers the plate colors, the labels, and the card drawings.
- The driving step, the gears, and the world colors stay as they are.
