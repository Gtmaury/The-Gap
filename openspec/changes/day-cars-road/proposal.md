# Proposal

## Why

Every drive is night, the only car is one silver box, and the lane is a single tan strip. The player should be able to drive the same places in daylight, pick another car, and see a road instead of that strip.

## What Changes

- Add a Day and Night choice on the level menu. Night stays the current moon, dark sky, and headlight beam. Day uses a brighter sun and a pale sky, and the headlight beam stays off. The three places stay. The menu opens on Night.
- Add three cars on the level menu: Hatch, Coupe, and Wagon. Hatch is the current car. The coupe is lower and longer. The wagon is taller at the back. Each has its own color. The collision circle stays 1.1 m, and the gears stay the same. The menu opens on Hatch.
- **BREAKING** Replace the tan route color `[0.62, 0.48, 0.28]` with a road on the same bend. The outer edges are pale shoulders, the middle is dark asphalt, and a broken pale dash runs down the center. The walls stay on the same edges. The menu's brown wedge becomes that asphalt.
- The route centerline, the places, the gears, and the vocabulary page stay.

Assumptions:

- The road keeps the current bend and the 14 m width. Only the surface changes.
- Day and Night are a switch for the chosen place, not three new maps.
- The three cars differ in shape and color. They do not change grip, speed, or the hit circle.

## Capabilities

### New Capabilities

- `day-light`: A day and night choice that changes the sun, the sky, and the headlight beam.
- `rally-cars`: Three low-poly cars chosen on the level menu, with the same hit circle.
- `asphalt-road`: Shoulders, asphalt, and a broken center dash on the existing bend.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` and `rally/view.test.mjs`: the sky, the sun, the beam, the road mesh, and the car meshes.
- `rally/route.js` and `rally/scenery.test.mjs`: the tan color leaves, and the road bands are named there.
- `rally/index.html`, `rally/styles.css`, `rally/main.js`, `rally/hud.js`, and `rally/menu.test.mjs`: the Day, Night, and car choices.
- `game/` stays.
