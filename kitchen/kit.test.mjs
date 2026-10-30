import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  FACES,
  FILLS,
  HAND_POSES,
  OUTLINE,
  STROKE_WIDTH,
  buildShape,
  faceMarkup,
  handsMarkup,
  shapeMarkup,
} from "./kit.js";

const spec = readFileSync(
  new URL("../openspec/changes/toy-kitchen/specs/toy-kit/spec.md", import.meta.url),
  "utf8",
);

for (const hex of [...Object.values(FILLS), OUTLINE]) {
  assert.match(spec, new RegExp(hex, "i"));
}

assert.deepEqual(HAND_POSES, ["rest", "acting", "follow-through"]);
assert.deepEqual(FACES, ["waiting", "proud", "pleased", "upset"]);
assert.equal(STROKE_WIDTH, 4);
assert.equal(Object.keys(FILLS).length, 5);

for (const kind of ["circle", "wedge", "strip"]) {
  const shape = buildShape(kind);
  assert.equal(shape.highlight.part, "highlight");
  assert.equal(shape.shadow.part, "shadow");
  assert.equal(Object.keys(shape).filter((key) => key === "highlight").length, 1);
  assert.equal(Object.keys(shape).filter((key) => key === "shadow").length, 1);
  const markup = shapeMarkup(kind, { x: 20, y: 20, fill: FILLS.tomato });
  assert.equal(markup.match(/data-part="highlight"/g).length, 1);
  assert.equal(markup.match(/data-part="shadow"/g).length, 1);
}

assert.throws(() => buildShape("blob"), /Unknown shape/);

for (const pose of HAND_POSES) {
  assert.match(handsMarkup(pose), new RegExp(`data-pose="${pose}"`));
}
for (const expression of FACES) {
  assert.match(faceMarkup(expression), new RegExp(`data-expression="${expression}"`));
}

const rest = handsMarkup("rest");
const acting = handsMarkup("acting");
const geometry = rest.slice(rest.indexOf("<ellipse"));
assert.equal(acting.includes(geometry), true);
