export const ORDER_NAME = "garden skillet";
export const STATIONS = ["chop", "stir", "flip"];

export const CHOP_LIMIT_MS = 8000;
export const CHOP_MARKS = [292, 320, 348];

export const STIR_LIMIT_MS = 6000;
export const STIR_CENTER = { x: 320, y: 220 };
export const STIR_RADIUS = 78;
export const STIR_TOLERANCE = 0.12;

export const FLIP_LIMIT_MS = 5000;
export const FLIP_WINDOW_START_MS = 2500;
export const FLIP_WINDOW_MS = 400;
export const FLIP_MIN_PX = 40;
export const PAN = { cx: 320, cy: 292, rx: 128, ry: 40 };

export const BEAT_MS = 900;

export function openService() {
  return {
    screen: "hub",
    grades: { chop: null, stir: null, flip: null },
    beat: null,
  };
}

export function canStart(state, station) {
  if (state.screen !== "hub") return false;
  if (station === "chop") return !state.grades.chop;
  if (station === "stir") return Boolean(state.grades.chop) && !state.grades.stir;
  if (station === "flip") return Boolean(state.grades.stir) && !state.grades.flip;
  return false;
}

export function startStation(state, station) {
  if (!canStart(state, station)) return state;
  return { ...state, screen: station, beat: null };
}

export function plateRating(grades) {
  const values = STATIONS.map((station) => grades[station]);
  if (values.some((grade) => !grade)) return null;
  if (values.every((grade) => grade === "perfect")) return "perfect";
  if (values.some((grade) => grade === "miss")) return "miss";
  return "good";
}

export function faceFor(grade) {
  if (grade === "perfect") return "proud";
  if (grade === "good") return "pleased";
  if (grade === "miss") return "upset";
  return "waiting";
}

export function applyGrade(state, station, grade) {
  const grades = { ...state.grades };
  if (!grades[station]) grades[station] = grade;
  return {
    ...state,
    grades,
    screen: "beat",
    beat: { station, face: faceFor(grades[station]) },
  };
}

export function finishBeat(state) {
  return { ...state, screen: "hub", beat: null };
}

function crossings(path, marks) {
  const seen = new Set();
  const order = [];
  for (let i = 1; i < path.length; i += 1) {
    const from = path[i - 1];
    const to = path[i];
    const dx = to.x - from.x;
    if (dx === 0) continue;
    const hits = [];
    for (const mark of marks) {
      if (seen.has(mark) || from.x === mark) continue;
      const min = Math.min(from.x, to.x);
      const max = Math.max(from.x, to.x);
      if (mark < min || mark > max) continue;
      hits.push({ mark, t: (mark - from.x) / dx });
    }
    hits.sort((a, b) => a.t - b.t);
    for (const hit of hits) {
      seen.add(hit.mark);
      order.push(hit.mark);
    }
  }
  return order;
}

export function gradeChop(path, elapsedMs) {
  const order = crossings(path, CHOP_MARKS);
  if (order.length < CHOP_MARKS.length) {
    return elapsedMs >= CHOP_LIMIT_MS ? "miss" : null;
  }
  if (elapsedMs >= CHOP_LIMIT_MS) return "miss";
  const perfect = CHOP_MARKS.every((mark, index) => order[index] === mark);
  return perfect ? "perfect" : "good";
}

function sweep(path) {
  let clockwise = 0;
  let counter = 0;
  let offGuide = false;
  for (let i = 1; i < path.length; i += 1) {
    const from = path[i - 1];
    const to = path[i];
    const a = Math.atan2(from.y - STIR_CENTER.y, from.x - STIR_CENTER.x);
    const b = Math.atan2(to.y - STIR_CENTER.y, to.x - STIR_CENTER.x);
    let delta = b - a;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    if (delta >= 0) clockwise += delta;
    else counter -= delta;
    const radius = Math.hypot(to.x - STIR_CENTER.x, to.y - STIR_CENTER.y);
    if (Math.abs(radius - STIR_RADIUS) / STIR_RADIUS > STIR_TOLERANCE) offGuide = true;
  }
  return { clockwise, counter, offGuide };
}

export function gradeStir(path, elapsedMs) {
  const turn = sweep(path);
  const full = Math.PI * 2 - 0.05;
  const clockwise = turn.clockwise >= full && turn.counter < 0.35;
  const anyFull = turn.clockwise >= full || turn.counter >= full;
  if (!anyFull) return elapsedMs >= STIR_LIMIT_MS ? "miss" : null;
  if (elapsedMs >= STIR_LIMIT_MS) return "miss";
  if (clockwise && !turn.offGuide) return "perfect";
  return "good";
}

export function inPan(point) {
  const dx = (point.x - PAN.cx) / PAN.rx;
  const dy = (point.y - PAN.cy) / PAN.ry;
  return dx * dx + dy * dy <= 1;
}

export function gradeFlip(gesture, elapsedMs) {
  const released = gesture?.up;
  if (!released) return elapsedMs >= FLIP_LIMIT_MS ? "miss" : null;
  const dy = gesture.down.y - gesture.up.y;
  const dx = Math.abs(gesture.up.x - gesture.down.x);
  const dt = gesture.dt;
  const flicked = gesture.down.inPan && dt > 0 && dy >= FLIP_MIN_PX && dy / dt > dx / dt;
  if (!flicked) return elapsedMs >= FLIP_LIMIT_MS ? "miss" : null;
  if (gesture.releaseAt >= FLIP_LIMIT_MS) return "miss";
  const windowEnd = FLIP_WINDOW_START_MS + FLIP_WINDOW_MS;
  if (gesture.releaseAt >= FLIP_WINDOW_START_MS && gesture.releaseAt < windowEnd) return "perfect";
  return "good";
}
