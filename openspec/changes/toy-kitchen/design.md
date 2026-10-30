# Design

## Context

The repo is a static site. The Gap lives in `game/` and is opened with `python -m http.server` pointed at that directory. Its rules sit in `game/engine.js` and are checked with `node game/engine.test.mjs` (plain `node:assert`, no package manifest). See proposal.md for why the kitchen is a separate game.

The specs in this change are the behavior contract: `specs/restaurant-service/spec.md`, `specs/counter-play/spec.md`, and `specs/toy-kit/spec.md`.

## Goals / Non-Goals

**Goals:**

- One session loop: hub, chop, stir, flip, result beat, plate rating.
- Grading rules that can be tested without a browser.
- One drawing module so stations cannot invent their own hands, colors, or outline.

**Non-Goals:**

- Sound, save games, a second dish, keyboard-only play, and packaging beyond static files.
- Changing The Gap's screens, storage key, or vocabulary rules.

## Decisions

### A sibling `kitchen/` directory

The kitchen is a second static directory with its own `index.html`, not a screen inside `game/`. The Gap's CSS variables, Lexend type, and `blankline-v2` localStorage stay untouched, and each game keeps the server command it already uses.

Alternative: add a route inside `game/`. Rejected because the two looks and the two state models would share one document.

### Rules module and a thin page

`kitchen/play.js` owns the session state machine and the pure graders. `kitchen/app.js` maps pointer events into those calls and paints the result. `kitchen/kit.js` exports the palette, the three hand poses, the four faces, and helpers that draw a circle, wedge, or strip with one highlight and one shadow.

Alternative: grade inside the DOM handlers. Rejected because `engine.test.mjs` already shows that the rules can be asserted with node, and the gesture math is the part most likely to drift.

### Pointer gestures

Mouse and touch both go through pointer events.

- Chop: three vertical marks divide the vegetable. A pointer path crosses a mark when it passes from one side of that mark to the other. Perfect requires the crossing order left, middle, right. Any other complete set is good. Timer: 8 seconds.
- Stir: the guide is a circle. Angle is measured from the pot center. A full circle is a cumulative sweep of at least 360 degrees. Perfect also requires the sweep to stay within 12 percent of the radius and to match the guide's clockwise direction. Timer: 6 seconds.
- Flip: a flick is a pointer-down inside the pan, then a release with upward movement of at least 40 pixels and a vertical speed above the horizontal speed. A 400 millisecond window opens at 2.5 seconds. Release inside that window is perfect. Any other completed flick before 5 seconds is good.

Thresholds live in `play.js` next to the graders so tests can feed paths without rendering.

Alternative: a physics library. Rejected because the three gestures are closed-form and the page has no package manifest.

### One SVG playfield

Stations and the result beat render inline SVG. The shared outline is a single stroke: brown `#5c3317`, width 4. Fills use only the five spec colors as SVG attributes, also declared as CSS variables for the hub background. Faces and hands are small SVG groups reused by id, not redrawn per station.

Alternative: CSS borders and divs. Rejected because wedges and the stir guide would not share one stroke width with the hands.

### Session state only

State is `{ screen, grades: { chop, stir, flip } }`. A grade is `perfect`, `good`, or `miss`. The plate rating follows the restaurant-service spec and is derived, not stored separately. Nothing is written to localStorage. Refresh starts a new service.

### Result beat

The beat lasts 900 milliseconds, shows the matching face full-screen, then sets `screen` back to `hub`. The next station unlocks from the grades already recorded.

## Risks / Trade-offs

- [Trackpad flicks feel shorter than touch flicks] → Keep the 40 pixel and speed thresholds in `play.js` and cover them with path fixtures before tuning by hand.
- [A station draws a one-off shape and breaks the kit] → Stations call `kit.js` for food, hands, and the timer mark. The page does not hard-code a second palette.
- [Focus rings introduce a sixth color] → Use the brown outline color for focus, not the browser default blue.
- [Two static servers confuse the README] → Document `game/` and `kitchen/` as separate commands.

## Migration Plan

Add `kitchen/` and a short run section in the README. Rollback is deleting that directory and the README section. The Gap does not migrate.

## Open Questions

- Later dishes can reuse the same three graders. Naming them can wait until a second order exists.
