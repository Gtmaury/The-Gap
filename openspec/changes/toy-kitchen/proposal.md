# Proposal

## Why

A Cooking Mama-style game needs a look that stays readable during short timed gestures, and a full restaurant interior is the wrong first drawing problem. The player is the cook's hands in each mini-game, so a small repeated toy kit can carry the whole game, with the restaurant as the hub between dishes.

## What Changes

- Add a separate browser game beside The Gap. The vocabulary game in `game/` stays as it is.
- Add a restaurant hub that shows the cook's face, one incoming order, and the stations for that dish. There is no dining room, no walking customers, and no accounts.
- Add three close-up counter mini-games for the first dish: chop, stir, and flip. Each one shows the same hands, one tool, and one ingredient on a timer.
- Add one shared toy kit: cream, tomato, leaf, butter, and wood colors, a dark brown outline, four face expressions, and three hand poses. Every screen uses that kit.
- Judge each station as perfect, good, or miss, then return to the hub and score the finished plate.

## Capabilities

### New Capabilities

- `restaurant-service`: The hub between dishes: the current order, station progress, and the plate rating when the player returns.
- `counter-play`: Timed hands-close-up mini-games (chop, stir, flip), including the gesture, the timer, and the result beat.
- `toy-kit`: The shared shapes, palette, hands, counter, and face that every screen must use.

### Modified Capabilities

- None. The project has no existing specs, and The Gap's vocabulary behavior does not change.

## Impact

- New static files in a `kitchen/` directory, served the same way as `game/` (`python -m http.server` pointed at that directory). No backend, no accounts, no new package dependencies.
- `game/` (The Gap) is left unchanged. This is a second game in the repo, not a replacement.
- English UI for the first slice. One dish only: the three stations above, in order.
- Art is CSS and SVG shapes. No bitmap illustration pipeline.
