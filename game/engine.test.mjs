import assert from "node:assert/strict";
import {
  answersMatch,
  applyAnswer,
  buildRound,
  bumpCollectionDay,
  bumpDay,
  distractors,
  filterByStatus,
  goalJustMet,
  gradeClozes,
  markPlayed,
  masteryPercent,
  mergeLibrary,
  pairSettings,
  setMastery,
} from "./engine.js";

const now = Date.parse("2026-10-20T12:00:00Z");
const sentences = [
  { id: "a", collectionId: "kitchen", cloze: "caliente" },
  { id: "b", collectionId: "kitchen", cloze: "llave" },
  { id: "c", collectionId: "kitchen", cloze: "vaso" },
  { id: "d", collectionId: "travel", cloze: "tren" },
];

assert.equal(answersMatch(" Café ", "café"), true);
assert.equal(answersMatch("estacion", "estación"), true);
assert.equal(answersMatch("hotel", "tren"), false);

let progress = { a: applyAnswer(undefined, true, now) };
assert.equal(progress.a.level, 1);
assert.equal(masteryPercent(progress.a.level), 17);
progress.a = applyAnswer(progress.a, false, now);
assert.equal(progress.a.level, 0);
progress.a = setMastery(progress.a, true, now);
assert.equal(masteryPercent(progress.a.level), 100);

progress = {
  a: { level: 2, nextReview: now - 1000, favorite: false, ignored: false },
  b: { level: 0, nextReview: 0, favorite: true, ignored: false },
  c: { level: 1, nextReview: now - 1000, favorite: false, ignored: true },
};
const round = buildRound(sentences, progress, {
  collectionId: "kitchen",
  maxReviews: 1,
  roundSize: 2,
  now,
});
assert.deepEqual(round.map((item) => item.id), ["a", "b"]);

progress.d = { level: 2, nextReview: now + 60_000, favorite: true, ignored: false };
const favorites = buildRound(sentences, progress, {
  favoritesOnly: true,
  maxReviews: 5,
  roundSize: 5,
  now,
});
assert.deepEqual(favorites.map((item) => item.id), ["b", "d"]);

progress.a.played = true;
const played = buildRound(sentences, progress, {
  playedOnly: true,
  maxReviews: 5,
  roundSize: 5,
  now,
});
assert.deepEqual(played.map((item) => item.id), ["a"]);

const reviews = buildRound(sentences, progress, {
  reviewsOnly: true,
  roundSize: 5,
  now,
});
assert.deepEqual(reviews.map((item) => item.id), ["a"]);

assert.deepEqual(distractors(sentences[0], sentences), ["llave", "vaso"]);

const streak = markPlayed({ count: 2, lastDay: "2026-10-19" }, now);
assert.equal(streak.count, 3);
assert.equal(markPlayed(streak, now).count, 3);

const freshOnly = buildRound(sentences, progress, { newOnly: true, roundSize: 5, now });
assert.deepEqual(freshOnly.map((item) => item.id), ["b"]);

const shuffled = buildRound(sentences, {
  a: { level: 0, nextReview: 0, ignored: false },
  b: { level: 0, nextReview: 0, ignored: false },
}, { newOnly: true, shuffle: true, roundSize: 2, now });
assert.equal(shuffled.length, 2);

const before = { day: "2026-10-20", played: 9, correct: 9, elapsedMs: 0 };
const after = bumpDay(before, { correct: true, elapsedMs: 1500 }, now);
assert.equal(goalJustMet(before, after, 10), true);
assert.equal(after.elapsedMs, 1500);
const days = bumpCollectionDay({}, "kitchen", { correct: true, elapsedMs: 500 }, now);
assert.equal(days.kitchen.correct, 1);

assert.equal(gradeClozes(["caliente", "mesa"], { clozes: ["caliente", "mesa"] }), true);
assert.equal(gradeClozes(["cafe", "mesa"], { clozes: ["caliente", "mesa"] }), false);

const scheduled = applyAnswer(undefined, true, now, [0, 2]);
assert.equal(scheduled.nextReview - now, 2 * 60 * 60 * 1000);
assert.equal(pairSettings({ "en-es": { maxReviews: 3 } }, "en-es").maxReviews, 3);

const filtered = filterByStatus(sentences, progress, "ready", now);
assert.deepEqual(filtered.map((item) => item.id), ["a"]);

const imported = mergeLibrary([], [], {
  version: 1,
  customCollections: [{ id: "mine", name: "Mine", pairId: "en-es" }],
  customSentences: [{ id: "s1", collectionId: "mine", text: "Hola amigo", cloze: "amigo", meaning: "Hello friend" }],
});
assert.equal(imported.customSentences[0].cloze, "amigo");

console.log("engine ok");
