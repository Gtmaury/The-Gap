export const DEFAULT_INTERVAL_HOURS = [0, 4, 24, 72, 168, 504, 1440];

export function hoursToMs(hours) {
  return hours.map((hour) => hour * 60 * 60 * 1000);
}

const INTERVALS_MS = hoursToMs(DEFAULT_INTERVAL_HOURS);

export const MAX_LEVEL = DEFAULT_INTERVAL_HOURS.length - 1;

export function defaultPairSettings() {
  return { maxReviews: 10, intervalHours: [...DEFAULT_INTERVAL_HOURS] };
}

export function pairSettings(all, pairId) {
  return { ...defaultPairSettings(), ...all?.[pairId] };
}

export function blankProgress() {
  return {
    level: 0,
    nextReview: 0,
    favorite: false,
    ignored: false,
    played: false,
    notes: "",
    pronunciation: "",
    translation: "",
    report: "",
  };
}

export function masteryPercent(level, maxLevel = MAX_LEVEL) {
  const cap = Math.max(1, maxLevel);
  return Math.round((Math.min(level, cap) / cap) * 100);
}

export function clozeWords(sentence) {
  if (Array.isArray(sentence?.clozes) && sentence.clozes.length) return sentence.clozes;
  if (Array.isArray(sentence?.cloze)) return sentence.cloze;
  return String(sentence?.cloze ?? "")
    .split("|")
    .map((word) => word.trim())
    .filter(Boolean);
}

export function gradeClozes(given, sentence) {
  const expected = clozeWords(sentence);
  const answers = Array.isArray(given) ? given : String(given ?? "").split("|");
  return expected.every((word, index) => answersMatch(answers[index] || "", word));
}

export function sentenceParts(text, words) {
  const parts = [];
  let rest = text;
  for (const word of words) {
    const at = rest.indexOf(word);
    if (at < 0) return [{ type: "text", value: text }];
    if (at > 0) parts.push({ type: "text", value: rest.slice(0, at) });
    parts.push({ type: "slot", value: word });
    rest = rest.slice(at + word.length);
  }
  if (rest) parts.push({ type: "text", value: rest });
  return parts;
}

export function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function answersMatch(given, expected) {
  return normalizeAnswer(given) === normalizeAnswer(expected);
}

export function applyAnswer(progress, correct, now, intervalHours = DEFAULT_INTERVAL_HOURS) {
  const ladder = hoursToMs(intervalHours);
  const max = ladder.length - 1;
  const current = progress ?? blankProgress();
  const level = correct ? Math.min(max, current.level + 1) : Math.max(0, current.level - 1);
  return {
    ...current,
    level,
    nextReview: now + (ladder[level] ?? 0),
    played: true,
  };
}

export function setReady(progress, now) {
  const current = progress ?? blankProgress();
  return {
    ...current,
    level: Math.max(1, current.level),
    nextReview: now,
    played: true,
  };
}

export function nextReviewLabel(progress, now) {
  if (!progress || progress.level === 0) return "Not played yet";
  if (progress.nextReview <= now) return "Ready for review";
  const hours = Math.max(1, Math.round((progress.nextReview - now) / (60 * 60 * 1000)));
  if (hours < 48) return `Next review in ${hours} hours`;
  return `Next review in ${Math.round(hours / 24)} days`;
}

export function setMastery(progress, mastered, now, intervalHours = DEFAULT_INTERVAL_HOURS) {
  const ladder = hoursToMs(intervalHours);
  const max = ladder.length - 1;
  const current = progress ?? blankProgress();
  const level = mastered ? max : 0;
  return {
    ...current,
    level,
    nextReview: mastered ? now + (ladder[level] ?? 0) : 0,
  };
}

function eligible(sentence, progress, favoritesOnly, playedOnly) {
  const state = progress[sentence.id] ?? blankProgress();
  if (state.ignored) return null;
  if (favoritesOnly && !state.favorite) return null;
  if (playedOnly && !state.played) return null;
  return state;
}

export function buildRound(sentences, progress, options) {
  const {
    collectionId = null,
    favoritesOnly = false,
    playedOnly = false,
    reviewsOnly = false,
    newOnly = false,
    shuffle = false,
    maxReviews = 10,
    roundSize = 10,
    now = Date.now(),
  } = options;

  const pool = sentences.filter((sentence) => {
    if (collectionId && sentence.collectionId !== collectionId) return false;
    return eligible(sentence, progress, favoritesOnly, playedOnly);
  });

  const due = [];
  const fresh = [];
  const saved = [];
  for (const sentence of pool) {
    const state = progress[sentence.id] ?? blankProgress();
    if (favoritesOnly) saved.push(sentence);
    if (state.level > 0 && state.nextReview <= now) due.push(sentence);
    else if (state.level === 0) fresh.push(sentence);
  }

  if (newOnly) return maybeShuffle(fresh.slice(0, roundSize), shuffle);
  if (reviewsOnly) return maybeShuffle(due.slice(0, roundSize), shuffle);

  if (favoritesOnly) {
    const dueIds = new Set(due.map((sentence) => sentence.id));
    const waiting = saved.filter((sentence) => !dueIds.has(sentence.id));
    return maybeShuffle(due.concat(waiting).slice(0, Math.max(roundSize, due.length)), shuffle);
  }

  const reviewCap = Math.max(0, Math.min(50, maxReviews));
  const reviews = due.slice(0, reviewCap);
  const room = Math.max(roundSize, reviews.length) - reviews.length;
  const pickedFresh = fresh.slice(0, room);
  let round = reviews.concat(pickedFresh);

  if (round.length < roundSize) {
    const used = new Set(round.map((sentence) => sentence.id));
    for (const sentence of due) {
      if (round.length >= roundSize) break;
      if (!used.has(sentence.id)) round.push(sentence);
    }
  }

  return maybeShuffle(round.slice(0, Math.max(roundSize, reviews.length)), shuffle);
}

function maybeShuffle(items, shuffle) {
  if (!shuffle) return items;
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function sentenceStatus(progress, now = Date.now()) {
  const state = progress ?? blankProgress();
  if (state.ignored) return "ignored";
  if (masteryPercent(state.level) >= 100) return "mastered";
  if (state.level > 0 && state.nextReview <= now) return "ready";
  if (state.level > 0) return "playing";
  return "new";
}

export function filterByStatus(sentences, progress, status, now = Date.now()) {
  return sentences.filter((sentence) => sentenceStatus(progress[sentence.id], now) === status);
}

export function distractors(sentence, sentences, count = 3) {
  const sameCollection = sentences.filter(
    (item) =>
      item.collectionId === sentence.collectionId &&
      normalizeAnswer(item.cloze) !== normalizeAnswer(sentence.cloze),
  );
  const unique = [];
  const seen = new Set();
  for (const item of sameCollection) {
    const key = normalizeAnswer(item.cloze);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item.cloze);
  }
  if (unique.length <= count) return unique;
  let hash = 0;
  for (const char of String(sentence.id)) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  const start = hash % unique.length;
  const picked = [];
  for (let index = 0; index < unique.length && picked.length < count; index += 1) {
    picked.push(unique[(start + index) % unique.length]);
  }
  return picked;
}

export function summarize(sentences, progress, now = Date.now()) {
  const stats = { total: 0, playing: 0, mastered: 0, ready: 0 };
  for (const sentence of sentences) {
    const state = progress[sentence.id] ?? blankProgress();
    if (state.ignored) continue;
    stats.total += 1;
    const mastery = masteryPercent(state.level);
    if (mastery >= 100) stats.mastered += 1;
    else if (state.level > 0) stats.playing += 1;
    if (state.level > 0 && state.nextReview <= now) stats.ready += 1;
  }
  return stats;
}

export function intervalLabels(hours = DEFAULT_INTERVAL_HOURS) {
  return hours.map((hour, index) => {
    if (index === 0 || hour === 0) return "New";
    if (hour < 48) return `${hour} hours`;
    return `${Math.round(hour / 24)} days`;
  });
}

export const REVIEW_INTERVALS = intervalLabels();

export function emptyDay(now) {
  return { day: dayKey(now), played: 0, correct: 0, elapsedMs: 0 };
}

export function bumpDay(day, event, now) {
  const base = day?.day === dayKey(now) ? day : emptyDay(now);
  return {
    day: base.day,
    played: base.played + 1,
    correct: base.correct + (event.correct ? 1 : 0),
    elapsedMs: base.elapsedMs + (event.elapsedMs || 0),
  };
}

export function goalJustMet(before, after, goal) {
  return (before?.correct || 0) < goal && after.correct >= goal;
}

export function bumpCollectionDay(stats, collectionId, event, now) {
  return { ...stats, [collectionId]: bumpDay(stats?.[collectionId], event, now) };
}

export function touchStudied(map, collectionId, now) {
  return { ...map, [collectionId]: now };
}

export function libraryPayload(customCollections, customSentences) {
  return { version: 1, customCollections, customSentences };
}

export function mergeLibrary(existingCollections, existingSentences, payload) {
  if (!payload || payload.version !== 1) throw new Error("This file is not a library from The Gap.");
  const collections = [...existingCollections];
  const sentences = [...existingSentences];
  for (const collection of payload.customCollections || []) {
    if (!collection?.id || !collection.name || !collection.pairId) continue;
    const index = collections.findIndex((item) => item.id === collection.id);
    if (index >= 0) collections[index] = { ...collections[index], ...collection };
    else collections.push(collection);
  }
  for (const sentence of payload.customSentences || []) {
    const words = clozeWords(sentence);
    if (!sentence?.id || !sentence.text || !words.length || !sentence.collectionId) continue;
    if (words.some((word) => !sentence.text.includes(word))) continue;
    const index = sentences.findIndex((item) => item.id === sentence.id);
    const next = { ...sentence, clozes: words, cloze: words.join("|") };
    if (index >= 0) sentences[index] = { ...sentences[index], ...next };
    else sentences.push(next);
  }
  return { customCollections: collections, customSentences: sentences };
}

export function dayKey(now) {
  const date = new Date(now);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function markPlayed(streak, now) {
  const today = dayKey(now);
  if (streak.lastDay === today) return streak;
  const yesterday = dayKey(now - 24 * 60 * 60 * 1000);
  const next = streak.lastDay === yesterday ? streak.count + 1 : 1;
  return { count: next, lastDay: today };
}
