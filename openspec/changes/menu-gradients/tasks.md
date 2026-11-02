# Tasks

## 1. Poster and pills

- [x] 1.1 Paint `#menu` with `linear-gradient(#0d1018, #1b2433)` and `body.is-day #menu` with `linear-gradient(#a3c2e0, #d5e4f2)`. Keep the day moon at `display: none`. Give the selected time and car buttons a filled pill: night `#f3ecdf` with type `#1b1b1d`, day `#1b1b1d` with type `#f3ecdf`, and leave unselected buttons transparent. Remove the inset underline from those selected rules. Verify `node --test rally/menu.test.mjs` shows both gradients, the hidden day moon, and both pill colors.

## 2. Place cards

- [x] 2.1 Replace the shared `.scene` fill `#243044` with the night gradients `#1c2838` to `#c5d0dc`, `#0c1610` to `#1e3a24`, and `#16161a` to `#3a3a40`, and the day gradients `#9bb4c9` to `#eef3f7`, `#4e7a5c` to `#d5e6d8`, and `#7a7a82` to `#d4d4d8`. Give `.scene` `border-radius: 12px` and `overflow: hidden`, give `.places` `z-index: 2`, and lift `.scene` by `translateY(-6px)` on hover. Keep the focus outline, and set it to `#1b1b1d` under `body.is-day`. Keep the snow cap, the forest trunk and greens, and the rock stone. Verify `node --test rally/menu.test.mjs` shows the six gradients, the radius, the lift, the focus outline, and those drawing colors.

## 3. Integration

- [x] 3.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass.

## Workflow follow-up

- Archive the change after review.
