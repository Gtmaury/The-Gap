# Tasks

## 1. Drive bar

- [ ] 1.1 Put `<span id="gear">` and `<span id="pace">` inside `#speed`. Set them from `main.js` on restart, start, and each driving step, using gear + 1 and the km/h speed, and stop writing `speed.textContent`. Give `#gear` `1.2rem` and `#pace` `2.6rem`. Give `#speed` and `#back` padding `0.7rem 1.1rem`, background `#0d1018`, and color `#f3ecdf`, and override both to background `#f3ecdf` and color `#1b1b1d` under `body.is-day`. Verify `node --test rally/menu.test.mjs` shows gear 3 and `36 km/h` for gear index 2 at 10 m/s, the gear font smaller than the pace font, Menu padding of at least `0.7rem 1.1rem`, and the night and day plate colors.

## 2. Day mark

- [ ] 2.1 Toggle `document.body` class `is-day` from `session.day` when Day or Night is chosen, when a place starts, and when Menu or Escape returns. Leave it absent on the initial session. Verify `node --test rally/menu.test.mjs` shows `is-day` is added from a day session and removed for night, and that `stopForMenu` still keeps `day: true`.

## 3. Stage poster

- [ ] 3.1 Label the place buttons Snow, Forest, and Rock. Hide `.moon` and set `#menu` background to `#a3c2e0` under `body.is-day`, and keep the night menu background `#0d1018` with the moon visible. Draw the snow card with `#295233` and `#ebede6`, the forest card with `#47291a`, `#1a471f`, and `#2e6629`, and the rock card with `#29292b` and no `#295233`. Verify `node --test rally/menu.test.mjs` shows those labels, colors, the hidden day moon, and the night moon still in the page.

## 4. Integration

- [ ] 4.1 Run `node --test rally/sim.test.mjs rally/scenery.test.mjs rally/view.test.mjs rally/menu.test.mjs` and verify all four pass.

## Workflow follow-up

- Archive the change after review.
