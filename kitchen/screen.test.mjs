import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FILLS, OUTLINE, handsMarkup } from "./kit.js";
import { openService } from "./play.js";
import { hubMarkup, stationMarkup } from "./app.js";

const hub = hubMarkup(openService());
assert.match(hub, /garden skillet/);
assert.match(hub, /data-expression="waiting"/);
assert.match(hub, /data-station="chop"/);
assert.match(hub, /data-station="stir"[^>]*disabled/);
assert.match(hub, /data-station="flip"[^>]*disabled/);
assert.doesNotMatch(hub, /data-station="chop"[^>]*disabled/);
assert.equal(hub.includes("data-counter"), false);
assert.equal(/dining room|tables|customers/i.test(hub), false);

const hands = handsMarkup("rest");
const geometry = hands.slice(hands.indexOf("<ellipse"));
const allowedFill = new Set([...Object.values(FILLS), "none"]);

for (const station of ["chop", "stir", "flip"]) {
  const markup = stationMarkup(station, "rest");
  assert.match(markup, new RegExp(`data-screen="${station}"`));
  assert.match(markup, /data-counter/);
  assert.match(markup, /data-hands/);
  assert.match(markup, /data-timer/);
  assert.equal(markup.includes(geometry), true);
  const tools = { chop: "knife", stir: "pot", flip: "pan" };
  const foods = { chop: "vegetable", stir: "soup", flip: "skillet" };
  assert.match(markup, new RegExp(`data-tool="${tools[station]}"`));
  assert.match(markup, new RegExp(`data-ingredient="${foods[station]}"`));
  if (station === "chop") assert.match(markup, /data-mark/g);
  if (station === "stir") assert.match(markup, /data-guide/);
  if (station === "flip") assert.match(markup, /data-flip-window/);
  for (const fill of markup.matchAll(/\bfill="([^"]+)"/g)) {
    assert.equal(allowedFill.has(fill[1]), true, fill[1]);
  }
  for (const stroke of markup.matchAll(/\bstroke="([^"]+)"/g)) {
    assert.equal(stroke[1] === OUTLINE || stroke[1] === "none", true, stroke[1]);
  }
  for (const tag of markup.match(/<[^>]+>/g)) {
    if (tag.includes(`stroke="${OUTLINE}"`)) assert.match(tag, /stroke-width="4"/);
  }
}

const page = readFileSync(new URL("./index.html", import.meta.url), "utf8");
assert.match(page, /styles\.css/);
assert.match(page, /app\.js/);
assert.equal(/dining room|customer/i.test(page), false);
