import assert from "node:assert/strict";
import {
  CHOP_LIMIT_MS,
  CHOP_MARKS,
  FLIP_LIMIT_MS,
  FLIP_MIN_PX,
  FLIP_WINDOW_MS,
  FLIP_WINDOW_START_MS,
  STIR_CENTER,
  STIR_LIMIT_MS,
  STIR_RADIUS,
  applyGrade,
  canStart,
  finishBeat,
  gradeChop,
  gradeFlip,
  gradeStir,
  openService,
  plateRating,
  startStation,
} from "./play.js";

function serviceAfter(grades) {
  let state = openService();
  for (const [station, grade] of grades) {
    assert.equal(canStart(state, station), true);
    state = startStation(state, station);
    state = applyGrade(state, station, grade);
    assert.equal(state.screen, "beat");
    assert.equal(state.beat.face, grade === "perfect" ? "proud" : grade === "good" ? "pleased" : "upset");
    state = finishBeat(state);
    assert.equal(state.screen, "hub");
    assert.equal(state.grades[station], grade);
  }
  return state;
}

const opened = openService();
assert.equal(canStart(opened, "chop"), true);
assert.equal(canStart(opened, "stir"), false);
assert.equal(canStart(opened, "flip"), false);
assert.equal(startStation(opened, "stir"), opened);

let state = serviceAfter([["chop", "perfect"]]);
assert.equal(canStart(state, "stir"), true);
assert.equal(canStart(state, "flip"), false);
assert.equal(canStart(state, "chop"), false);

state = applyGrade(state, "chop", "miss");
assert.equal(state.grades.chop, "perfect");

state = serviceAfter([
  ["chop", "perfect"],
  ["stir", "perfect"],
  ["flip", "perfect"],
]);
assert.equal(plateRating(state.grades), "perfect");

state = serviceAfter([
  ["chop", "perfect"],
  ["stir", "good"],
  ["flip", "perfect"],
]);
assert.equal(plateRating(state.grades), "good");

state = serviceAfter([
  ["chop", "perfect"],
  ["stir", "miss"],
  ["flip", "good"],
]);
assert.equal(plateRating(state.grades), "miss");
assert.equal(plateRating(openService().grades), null);

function across(xs, y = 210) {
  return xs.map((x) => ({ x, y }));
}

const [leftMark, , rightMark] = CHOP_MARKS;
assert.equal(gradeChop(across([leftMark - 40, rightMark + 40]), 1000), "perfect");
assert.equal(gradeChop(across([leftMark - 40, 320, rightMark + 40]), 1000), "perfect");
assert.equal(gradeChop(across([rightMark + 30, leftMark - 30]), 1000), "good");
assert.deepEqual(CHOP_MARKS, [292, 320, 348]);
assert.equal(gradeChop(across([leftMark - 40, leftMark + 10]), CHOP_LIMIT_MS), "miss");
assert.equal(gradeChop(across([leftMark - 40, leftMark + 10]), 1000), null);
assert.equal(gradeChop(across([leftMark - 40, rightMark + 40]), CHOP_LIMIT_MS), "miss");

function circle(direction, radius, turns = 1) {
  const path = [];
  const steps = 48;
  for (let i = 0; i <= steps; i += 1) {
    const angle = direction * (i / steps) * Math.PI * 2 * turns;
    path.push({
      x: STIR_CENTER.x + radius * Math.cos(angle),
      y: STIR_CENTER.y + radius * Math.sin(angle),
    });
  }
  return path;
}

assert.equal(gradeStir(circle(1, STIR_RADIUS), 1000), "perfect");
assert.equal(gradeStir(circle(-1, STIR_RADIUS), 1000), "good");
assert.equal(gradeStir(circle(1, STIR_RADIUS * 1.3), 1000), "good");
assert.equal(gradeStir(circle(1, STIR_RADIUS, 0.25), STIR_LIMIT_MS), "miss");
assert.equal(gradeStir(circle(1, STIR_RADIUS, 0.25), 500), null);

const perfectFlick = {
  down: { x: 320, y: 292, inPan: true },
  up: { x: 320, y: 292 - FLIP_MIN_PX - 30 },
  dt: 80,
  releaseAt: FLIP_WINDOW_START_MS + FLIP_WINDOW_MS / 2,
};
assert.equal(gradeFlip(perfectFlick, perfectFlick.releaseAt), "perfect");
assert.equal(gradeFlip({ ...perfectFlick, releaseAt: 1000 }, 1000), "good");
assert.equal(gradeFlip({ down: { x: 320, y: 292, inPan: true } }, FLIP_LIMIT_MS), "miss");
assert.equal(gradeFlip({ down: { x: 320, y: 292, inPan: true } }, 1000), null);
assert.equal(FLIP_WINDOW_MS, 400);
assert.equal(FLIP_WINDOW_START_MS, 2500);
