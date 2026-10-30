import {
  FILLS,
  OUTLINE,
  STROKE_WIDTH,
  faceMarkup,
  handsMarkup,
  shapeMarkup,
} from "./kit.js";
import {
  BEAT_MS,
  CHOP_LIMIT_MS,
  CHOP_MARKS,
  FLIP_LIMIT_MS,
  FLIP_WINDOW_MS,
  FLIP_WINDOW_START_MS,
  ORDER_NAME,
  PAN,
  STATIONS,
  STIR_CENTER,
  STIR_LIMIT_MS,
  STIR_RADIUS,
  applyGrade,
  canStart,
  finishBeat,
  gradeChop,
  gradeFlip,
  gradeStir,
  inPan,
  openService,
  plateRating,
  startStation,
} from "./play.js";

const LIMITS = { chop: CHOP_LIMIT_MS, stir: STIR_LIMIT_MS, flip: FLIP_LIMIT_MS };

const HINTS = {
  chop: "Drag across the three cuts, left to right.",
  stir: "Trace the circle clockwise.",
  flip: "Flick up from the pan as the bar reaches the red mark.",
};

function paint(fill) {
  return `fill="${fill}" stroke="${OUTLINE}" stroke-width="${STROKE_WIDTH}" stroke-linejoin="round"`;
}

const TIMER = { x: 168, y: 28, width: 304, height: 16 };

function timerMarkup(station) {
  const limit = LIMITS[station];
  const windowMark = station === "flip"
    ? `<rect data-flip-window x="${TIMER.x + TIMER.width * (FLIP_WINDOW_START_MS / limit)}" y="${TIMER.y - 4}" width="${TIMER.width * (FLIP_WINDOW_MS / limit)}" height="${TIMER.height + 8}" rx="6" ${paint(FILLS.tomato)}/>`
    : "";
  return `
    <g data-timer>
      <rect x="${TIMER.x - 4}" y="${TIMER.y - 4}" width="${TIMER.width + 8}" height="${TIMER.height + 8}" rx="12" ${paint(FILLS.wood)}/>
      <rect data-timer-fill data-full="${TIMER.width}" x="${TIMER.x}" y="${TIMER.y}" width="${TIMER.width}" height="${TIMER.height}" rx="8" ${paint(FILLS.butter)}/>
      ${windowMark}
    </g>
  `;
}

function scene(station) {
  if (station === "chop") {
    return `
      <g data-ingredient="vegetable">
        ${shapeMarkup("circle", { x: 320, y: 236, fill: FILLS.tomato })}
        ${CHOP_MARKS.map((mark) => `<line data-mark x1="${mark}" y1="204" x2="${mark}" y2="268" fill="none" stroke="${OUTLINE}" stroke-width="${STROKE_WIDTH}"/>`).join("")}
      </g>
      <g data-tool="knife" data-tool-move transform="translate(150 236)">
        <rect x="0" y="-8" width="108" height="16" rx="6" ${paint(FILLS.cream)}/>
        <rect x="92" y="-14" width="30" height="28" rx="8" ${paint(FILLS.wood)}/>
        <rect x="10" y="-5" width="40" height="6" rx="3" ${paint(FILLS.butter)}/>
      </g>
    `;
  }
  if (station === "stir") {
    const x = STIR_CENTER.x;
    const y = STIR_CENTER.y;
    return `
      <g data-tool="pot">
        <rect x="${x - 130}" y="${y + 8}" width="26" height="18" rx="6" ${paint(FILLS.wood)}/>
        <rect x="${x + 104}" y="${y + 8}" width="26" height="18" rx="6" ${paint(FILLS.wood)}/>
        <circle cx="${x}" cy="${y}" r="112" ${paint(FILLS.wood)}/>
        <circle cx="${x}" cy="${y}" r="88" ${paint(FILLS.cream)}/>
        <circle data-guide cx="${x}" cy="${y}" r="${STIR_RADIUS}" fill="none" stroke="${OUTLINE}" stroke-width="${STROKE_WIDTH}"/>
        <polygon data-direction="clockwise" points="${x + STIR_RADIUS - 8},${y - 4} ${x + STIR_RADIUS + 14},${y + 10} ${x + STIR_RADIUS - 8},${y + 18}" ${paint(FILLS.butter)}/>
      </g>
      <g data-ingredient="soup">
        ${shapeMarkup("circle", { x, y, fill: FILLS.tomato })}
      </g>
    `;
  }
  return `
    <g data-tool="pan">
      <rect x="${PAN.cx + PAN.rx - 10}" y="${PAN.cy - 8}" width="86" height="16" rx="8" ${paint(FILLS.wood)}/>
      <ellipse cx="${PAN.cx}" cy="${PAN.cy}" rx="${PAN.rx}" ry="${PAN.ry}" ${paint(FILLS.wood)}/>
      <ellipse cx="${PAN.cx}" cy="${PAN.cy}" rx="${PAN.rx - 16}" ry="${PAN.ry - 12}" ${paint(FILLS.cream)}/>
    </g>
    <g data-ingredient="skillet">
      ${shapeMarkup("strip", { x: PAN.cx, y: PAN.cy, fill: FILLS.butter })}
    </g>
  `;
}

export function stationMarkup(station, pose) {
  return `
    <main data-screen="${station}">
      <p class="mark">${HINTS[station]}</p>
      <svg id="playfield" viewBox="0 0 640 400" width="640" height="400" role="img" aria-label="${station}">
        <rect data-backdrop x="0" y="0" width="640" height="400" fill="${FILLS.cream}" stroke="none"/>
        <rect data-counter x="24" y="292" width="592" height="84" rx="20" ${paint(FILLS.wood)}/>
        ${timerMarkup(station)}
        ${scene(station)}
        ${handsMarkup(pose)}
      </svg>
      <p data-timer-label>${LIMITS[station] / 1000}s</p>
    </main>
  `;
}

export function beatMarkup(expression) {
  return `
    <main data-screen="beat">
      <svg viewBox="0 0 200 200" width="280" height="280" role="img" aria-label="${expression} cook">
        ${faceMarkup(expression)}
      </svg>
    </main>
  `;
}

export function hubMarkup(state) {
  const rating = plateRating(state.grades);
  const buttons = STATIONS.map((station) => {
    const grade = state.grades[station];
    const label = station[0].toUpperCase() + station.slice(1);
    return `<button type="button" data-station="${station}" ${canStart(state, station) ? "" : "disabled"}>${label}${grade ? ` · ${grade}` : ""}</button>`;
  }).join("");
  return `
    <main data-screen="hub">
      <p class="mark">Garden skillet</p>
      <svg viewBox="0 0 200 200" width="220" height="220" role="img" aria-label="Waiting cook">
        ${faceMarkup("waiting")}
      </svg>
      <p data-order>${ORDER_NAME}</p>
      <div class="stations">${buttons}</div>
      <p data-plate>${rating ? `${rating} plate` : "Plate waiting"}</p>
    </main>
  `;
}

function applyTokens(root) {
  const node = root.ownerDocument.documentElement;
  for (const [name, value] of Object.entries(FILLS)) node.style.setProperty(`--${name}`, value);
  node.style.setProperty("--outline", OUTLINE);
}

export function mount(root) {
  applyTokens(root);
  let state = openService();
  let path = [];
  let down = null;
  let startedAt = 0;
  let frame = 0;
  let beatTimer = 0;
  let pose = "rest";
  let live = false;

  function draw() {
    cancelAnimationFrame(frame);
    if (state.screen !== "beat") pose = "rest";
    if (state.screen === "hub") root.innerHTML = hubMarkup(state);
    else if (state.screen === "beat") root.innerHTML = beatMarkup(state.beat.face);
    else root.innerHTML = stationMarkup(state.screen, pose);
    bind();
    if (LIMITS[state.screen]) {
      path = [];
      down = null;
      pose = "rest";
      startedAt = performance.now();
      live = true;
      frame = requestAnimationFrame(tick);
    } else {
      live = false;
    }
  }

  function bind() {
    for (const button of root.querySelectorAll("[data-station]")) {
      button.addEventListener("click", () => {
        const next = startStation(state, button.dataset.station);
        if (next === state) return;
        state = next;
        draw();
      });
    }
    const field = root.querySelector("#playfield");
    if (!field) return;
    field.addEventListener("pointerdown", onDown);
    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerup", onUp);
    field.addEventListener("pointercancel", onUp);
  }

  function pointOf(event) {
    const field = root.querySelector("#playfield");
    const svgPoint = field.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const local = svgPoint.matrixTransform(field.getScreenCTM().inverse());
    return { x: local.x, y: local.y };
  }

  function onDown(event) {
    if (!live) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointOf(event);
    down = { ...point, at: performance.now(), inPan: inPan(point) };
    path = [down];
    setPose("acting");
    moveTool(point);
  }

  function onMove(event) {
    if (!down || !live) return;
    const point = pointOf(event);
    path.push(point);
    moveTool(point);
  }

  function onUp(event) {
    if (!down || !live) return;
    const point = pointOf(event);
    path.push(point);
    const elapsed = performance.now() - startedAt;
    const station = state.screen;
    let grade = null;
    if (station === "flip") {
      grade = gradeFlip({
        down,
        up: point,
        dt: performance.now() - down.at,
        releaseAt: elapsed,
      }, elapsed);
    } else if (station === "chop") grade = gradeChop(path, elapsed);
    else if (station === "stir") grade = gradeStir(path, elapsed);
    down = null;
    setPose("follow-through");
    if (grade) settle(grade);
  }

  function tick(now) {
    if (!live) return;
    const station = state.screen;
    const elapsed = now - startedAt;
    paintTimer(elapsed, LIMITS[station]);
    let grade = null;
    if (station === "chop") grade = gradeChop(path, elapsed);
    else if (station === "stir") grade = gradeStir(path, elapsed);
    else grade = gradeFlip(down ? { down } : { down: { inPan: false } }, elapsed);
    if (grade) {
      settle(grade);
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  function settle(grade) {
    if (!live) return;
    live = false;
    cancelAnimationFrame(frame);
    state = applyGrade(state, state.screen, grade);
    clearTimeout(beatTimer);
    draw();
    beatTimer = setTimeout(() => {
      state = finishBeat(state);
      draw();
    }, BEAT_MS);
  }

  function setPose(next) {
    pose = next;
    const hands = root.querySelector("[data-hands]");
    if (!hands) return;
    const holder = root.ownerDocument.createElement("template");
    holder.innerHTML = handsMarkup(next).trim();
    hands.replaceWith(holder.content.firstElementChild);
  }

  function moveTool(point) {
    const tool = root.querySelector("[data-tool-move]");
    if (tool) tool.setAttribute("transform", `translate(${point.x} ${point.y})`);
  }

  function paintTimer(elapsed, limit) {
    const bar = root.querySelector("[data-timer-fill]");
    if (bar) bar.setAttribute("width", String(Math.max(0, TIMER.width * (1 - elapsed / limit))));
    const label = root.querySelector("[data-timer-label]");
    if (label) label.textContent = `${Math.ceil(Math.max(0, limit - elapsed) / 1000)}s`;
  }

  draw();
}

if (typeof document !== "undefined") {
  const root = document.querySelector("#app");
  if (root) mount(root);
}
