# Design

## Context

`#speed` shows `#gear`, `#pace`, and `#clock` on one plate. `advanceClock` adds time from the first frame of a place, and `showPace` keeps writing the gear and the speed after `run.finished`. The gate and the best time live in `stage-finish`. See proposal.md for why the plate needs a count and a finish call. The marks are in the start-call and finish-call specs.

## Goals / Non-Goals

**Goals:**

- One function names the count mark from the seconds since the place started.
- The driving step is not called while that mark is showing, so a slope cannot roll the car.
- The finish call hides the gear and the speed without a second plate.

**Non-Goals:**

- A spoken call, a new color, or a penalty for leaving early.
- A change to the gate position, the best-time rule, or the grip.

## Decisions

### Count outside the driving step

`countMark(seconds)` in `hud.js` returns `"3"` before 1 second, `"2"` before 2, `"1"` before 3, and `null` after that. `main.js` keeps a `count` number, separate from `elapsed`. While `countMark(count)` is set, the frame adds `dt` to `count` only, leaves `elapsed` at 0, and does not call `step`. The car stays on the pose from `createRun` or `restart`.

`#call` is a span inside `#speed`. During the count it shows the mark, and `#gear` and `#pace` are hidden. `#clock` stays visible at `0:00`, so it keeps the plate's type color.

When the mark becomes `null`, `#call` hides, the gear and the speed return, and `elapsed` starts through `advanceClock`. That frame is the go. There is no fourth held word.

Restart sets `count` and `elapsed` back to 0, which shows 3 again. The best-time array is left alone, as `stage-finish` already does.

Alternative: let `step` run with an empty input. On snow the slope at the start can still move the car, and the spec says the speed stays 0.

### Swap the same plate at the gate

`finishCall(finished)` is true when the run is finished. `main.js` then hides `#gear` and `#pace`, shows `#call` as `Finish`, and leaves `#clock` on the stopped `clockText`. `advanceClock` already refuses time after the finish, so the shown second stays.

Menu and `noteFinish` are unchanged. The card still updates when the run first finishes, including a finish that happens on the frame the count would have ended. A normal run cannot finish during the count because the car is still on the start.

Day and night colors stay on `#speed`. `#call` sets no color of its own.

Alternative: a second banner over the road. The specs name the existing plate.

## Risks / Trade-offs

- [The player cannot roll during the count] → The count is three seconds, and the spec holds the car.
- [A large frame skips from 3 to 1] → The mark is chosen from the accumulated seconds, so a skipped frame still lands on the right number.
- [Finish and the gear both want `#speed`] → The gear and the speed hide only while `#call` is showing.

## Migration Plan

Static page. Hide `#call` and call `step` from the first frame to undo the change. The gate and the best times stay.

## Open Questions

None.
