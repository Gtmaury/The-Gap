export const FILLS = {
  cream: "#f6e7c1",
  tomato: "#e23d28",
  leaf: "#3f8f4e",
  butter: "#f2c14e",
  wood: "#c9843f",
};

export const OUTLINE = "#5c3317";
export const STROKE_WIDTH = 4;

export const HAND_POSES = ["rest", "acting", "follow-through"];
export const FACES = ["waiting", "proud", "pleased", "upset"];

const SHAPES = ["circle", "wedge", "strip"];

export function buildShape(kind) {
  if (!SHAPES.includes(kind)) throw new Error(`Unknown shape: ${kind}`);
  return {
    kind,
    highlight: { part: "highlight" },
    shadow: { part: "shadow" },
  };
}

function paint(fill) {
  return `fill="${fill}" stroke="${OUTLINE}" stroke-width="${STROKE_WIDTH}" stroke-linejoin="round"`;
}

export function shapeMarkup(kind, { x, y, fill }) {
  buildShape(kind);
  if (kind === "circle") {
    return `
      <ellipse data-part="shadow" cx="${x}" cy="${y + 12}" rx="38" ry="14" ${paint(FILLS.wood)}/>
      <circle data-part="body" cx="${x}" cy="${y}" r="36" ${paint(fill)}/>
      <ellipse data-part="highlight" cx="${x - 12}" cy="${y - 12}" rx="12" ry="7" ${paint(FILLS.cream)}/>
    `;
  }
  if (kind === "strip") {
    return `
      <rect data-part="shadow" x="${x - 44}" y="${y - 6}" width="96" height="24" rx="12" ${paint(FILLS.wood)}/>
      <rect data-part="body" x="${x - 50}" y="${y - 16}" width="100" height="28" rx="14" ${paint(fill)}/>
      <rect data-part="highlight" x="${x - 34}" y="${y - 12}" width="30" height="8" rx="4" ${paint(FILLS.cream)}/>
    `;
  }
  return `
    <path data-part="shadow" d="M ${x} ${y + 10} L ${x + 52} ${y + 30} A 52 52 0 0 1 ${x - 18} ${y + 40} Z" ${paint(FILLS.wood)}/>
    <path data-part="body" d="M ${x} ${y} L ${x + 50} ${y + 16} A 50 50 0 0 1 ${x - 22} ${y + 26} Z" ${paint(fill)}/>
    <path data-part="highlight" d="M ${x + 8} ${y + 6} L ${x + 24} ${y + 12} L ${x + 10} ${y + 18} Z" ${paint(FILLS.cream)}/>
  `;
}

const line = `fill="none" stroke="${OUTLINE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round"`;

function mitten(x) {
  return `
    <g transform="translate(${x} 0)">
      <rect x="14" y="28" width="52" height="64" rx="24" ${paint(FILLS.butter)}/>
      <ellipse cx="18" cy="50" rx="14" ry="16" ${paint(FILLS.butter)}/>
      <ellipse cx="40" cy="46" rx="12" ry="7" ${paint(FILLS.cream)}/>
    </g>
  `;
}

const HANDS = `${mitten(0)}${mitten(96)}`;

const POSE_TRANSFORM = {
  rest: "translate(176 78)",
  acting: "translate(214 118)",
  "follow-through": "translate(150 48)",
};

export function handsMarkup(pose) {
  const transform = POSE_TRANSFORM[pose];
  if (!transform) throw new Error(`Unknown pose: ${pose}`);
  return `<g id="hands" data-hands data-pose="${pose}" transform="${transform}">${HANDS}</g>`;
}

const MOUTHS = {
  waiting: `<path data-mouth d="M70 124 Q100 142 130 124" ${line}/>`,
  proud: `<ellipse data-mouth cx="100" cy="128" rx="26" ry="16" ${paint(FILLS.cream)}/>`,
  pleased: `<path data-mouth d="M66 118 Q100 152 134 118" ${line}/>`,
  upset: `<path data-mouth d="M70 142 Q100 116 130 142" ${line}/>`,
};

export function faceMarkup(expression) {
  if (!MOUTHS[expression]) throw new Error(`Unknown expression: ${expression}`);
  const eyes = expression === "proud"
    ? `<path data-eye d="M56 88 Q72 74 88 88" ${line}/><path data-eye d="M112 88 Q128 74 144 88" ${line}/>`
    : `<circle data-eye cx="72" cy="90" r="8" ${paint(FILLS.tomato)}/><circle data-eye cx="128" cy="90" r="8" ${paint(FILLS.tomato)}/>`;
  const brows = expression === "upset"
    ? `<path data-brow d="M52 70 L90 80" ${line}/><path data-brow d="M148 70 L110 80" ${line}/>`
    : "";
  return `
    <g data-face data-expression="${expression}">
      <circle cx="100" cy="104" r="78" ${paint(FILLS.butter)}/>
      <path d="M34 78 Q100 18 166 78 L148 52 Q100 28 52 52 Z" ${paint(FILLS.tomato)}/>
      <circle cx="64" cy="116" r="10" ${paint(FILLS.tomato)}/>
      <circle cx="136" cy="116" r="10" ${paint(FILLS.tomato)}/>
      ${eyes}
      ${brows}
      ${MOUTHS[expression]}
    </g>
  `;
}
