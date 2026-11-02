# Design

## Context

`#speed` is cream type with no background. `#back` is `#0d1018` with no padding. `paceText` writes one string, `3 36 km/h` for gear index 2 at 10 m/s. `#menu` is always the night poster: background `#0d1018`, a moon, and cards labeled Night snow, Night forest, and Night rock. `selectTime` stores `session.day`, and `stopForMenu` keeps it. See proposal.md for why the bar and the poster have to follow that flag. The colors are in the drive-bar and stage-poster specs.

## Goals / Non-Goals

**Goals:**

- `body` carries `is-day` exactly when `session.day` is true, including during a drive and after Menu.
- The two readout marks and Menu share one plate, and the gear mark is 1.2rem against a 2.6rem speed.
- The three cards use the place colors from the spec.

**Non-Goals:**

- A new font, an image, or a change to the keys, the cars, or the driving step.
- A new world color.

## Decisions

### Mark the page from the session

`main.js` toggles `document.body.classList` with `is-day` from `session.day` inside `selectTime`'s click, `begin`, and `showMenu`. The class is absent at startup because `initialSession` has `day: false`. `stopForMenu` already keeps `day`, so returning to Stages leaves the mark in place.

Alternative: put the class on `#menu` only. The bar is outside `#menu` and stays on screen while the menu is hidden.

### Split the readout, keep the numbers

`#speed` holds `<span id="gear">` and `<span id="pace">`. `main.js` sets those two texts instead of `speed.textContent`. The gear text is `gear + 1`. The pace text is `` `${Math.round(speed * 3.6)} km/h` ``. `paceText` stays, so gear index 2 at 10 m/s is still `3 36 km/h`.

`#gear` is `1.2rem`. `#pace` is `2.6rem`. `#speed` and `#back` share padding `0.7rem 1.1rem`, background `#0d1018`, and color `#f3ecdf`. `body.is-day` overrides both to background `#f3ecdf` and color `#1b1b1d`.

Alternative: size the gear with a smaller span inside the one string. The string has no separate element for the gear.

### Paint the poster from the same mark

`body.is-day #menu` uses background `#a3c2e0` and color `#1b1b1d`. `body.is-day .moon` is `display: none`. `body.is-day .ridge` uses `#8aa4be`. The selected underline on that mark uses `#1b1b1d`. Night keeps the current moon, `#0d1018` menu, and cream underline.

The place buttons read Snow, Forest, and Rock. The snow scene adds a cap cone `#ebede6` over a body `#295233`. The forest scene adds a trunk `#47291a`, a lower cone `#1a471f`, and an upper cone `#2e6629`. The rock scene keeps a stone and sets it to `#29292b`, with no pine cone.

Alternative: draw the cards on the WebGL canvas. The menu is already CSS clip-path, and the tests read the page without a canvas.

## Risks / Trade-offs

- [Writing `speed.textContent` erases the two spans] → Every pace update sets `#gear` and `#pace`.
- [The cream plate sits near the day sky] → The type on that plate is `#1b1b1d`.
- [The old Night snow assertion fails] → The menu test looks for Snow, Forest, and Rock.

## Migration Plan

Static page. No saved data. Restore the single pace string, the unpadded black Menu, and the night-only poster to undo the change.

## Open Questions

None.
