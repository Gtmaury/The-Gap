# Tasks

## 1. Toy kit

- [x] 1.1 Add `kitchen/kit.js` with the five fill colors, brown `#5c3317` outline, stroke width 4, hand poses `rest`, `acting`, and `follow-through`, face expressions `waiting`, `proud`, `pleased`, and `upset`, and a helper that builds a circle, wedge, or strip with one highlight and one shadow. Verify with `node kitchen/kit.test.mjs`: the tokens match `specs/toy-kit/spec.md`, and each shape reports exactly one highlight and one shadow.

## 2. Session rules

- [x] 2.1 Add `kitchen/play.js` session state for the garden skillet: opening the service leaves only chop available, stir stays locked until chop has a grade, flip stays locked until stir has a grade, and graded stations keep their grade. Derive the plate rating as perfect, good, or miss from the restaurant-service spec. Verify with `node kitchen/play.test.mjs` covering those lock and rating cases.
- [x] 2.2 Add chop, stir, and flip graders using the thresholds and timers in design.md (chop 8s, stir 6s, flip 5s with a 400ms window at 2.5s). Verify in `kitchen/play.test.mjs` that each gesture has a perfect path, a good path, and a miss when the timer ends first.

## 3. Screens

- [x] 3.1 Add `kitchen/index.html` and `kitchen/app.js` for the hub: cream background, waiting face, the words "garden skillet", stations chop, stir, and flip, and no dining-room, table, or customer markup. Verify by serving `kitchen/` and confirming only chop can be started.
- [x] 3.2 Draw chop, stir, and flip in one inline SVG playfield from `kitchen/kit.js`: shared hand groups, wood counter, stroke width 4, and the tool plus ingredient from the counter-play spec. Verify in the browser that each station shows its tool and ingredient, every fill is a kit color, and every outline is brown at width 4.
- [x] 3.3 Send pointer events into the graders, play the matching face for 900ms, then return to the hub with that grade and the next station unlocked. Verify a perfect chop shows the proud face and then a perfect chop on the hub.
- [x] 3.4 Add a README run section for `kitchen/` beside The Gap's command. Verify that command serves `kitchen/index.html`.

## 4. Integration

- [x] 4.1 Play a full garden skillet once with three perfect grades and once with a miss. Verify the hub shows a perfect plate, then a miss plate, and that serving `game/` still shows The Gap with no kitchen screens mixed in.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived specs under `openspec/specs/`.
