# Design

## Context

`#menu` is a flat fill, `#0d1018` at night and `#a3c2e0` in day. `.scene` is one box, `#243044`, on every card. The selected time and car use an inset underline. `.road` is a polygon behind the cards. See proposal.md for why each card needs its own ground. The stops are in the menu-wash and place-cards specs. The drive bar from `time-menus` stays.

## Goals / Non-Goals

**Goals:**

- The poster gradient and the three card gradients are readable in `rally/styles.css` without a screenshot.
- The cards paint above `.road`, with a `12px` corner and a `6px` hover lift.
- The selected time and car are filled pills. The focus outline remains.

**Non-Goals:**

- Image files, blur, or a new font.
- A change to the drive bar, the keys, the cars, or the place drawings' colors.

## Decisions

### Gradient the poster, then the cards

`#menu` uses `linear-gradient(#0d1018, #1b2433)`. `body.is-day #menu` uses `linear-gradient(#a3c2e0, #d5e4f2)`. `body.is-day .moon` stays `display: none`.

`.scene` drops the shared `#243044`. Night grounds:

- `.scene.snow`: `linear-gradient(#1c2838, #c5d0dc)`
- `.scene.forest`: `linear-gradient(#0c1610, #1e3a24)`
- `.scene.rock`: `linear-gradient(#16161a, #3a3a40)`

Day grounds, on `body.is-day`:

- snow `#9bb4c9` to `#eef3f7`
- forest `#4e7a5c` to `#d5e6d8`
- rock `#7a7a82` to `#d4d4d8`

`.scene` gets `border-radius: 12px` and `overflow: hidden`, so the pines clip to the corner. `.places` gets `z-index: 2`. `.road` stays at the default stack.

`.places button:hover .scene` uses `transform: translateY(-6px)`. `.places button:focus-visible` keeps its outline. `body.is-day` sets that outline to `#1b1b1d` so it stays visible on the light poster.

Alternative: a photo in each card. The rest of the menu is CSS shapes, and the specs name these stops.

### Replace the underline with a pill

`.choices button.is-selected` and `.cars button.is-selected` use background `#f3ecdf`, color `#1b1b1d`, and padding `0.35rem 0.8rem`. The inset underline on those rules goes away. `body.is-day` overrides the same selectors to background `#1b1b1d` and color `#f3ecdf`. Unselected buttons keep `background: transparent`.

Alternative: keep the underline and add a pill behind it. Two marks for one choice.

## Risks / Trade-offs

- [The time-menus test looks for a flat `#menu` background] → The menu test looks for the gradient stops instead.
- [A light card meets a light day sky] → The day grounds are lighter than the night ones, and the label stays outside the card.
- [Hover moves the card under the cursor] → The lift is `6px`, and the focus outline does not depend on hover.

## Migration Plan

Static page. No saved data. Restore the flat poster, the shared `#243044` box, and the inset underline to undo the change.

## Open Questions

None.
