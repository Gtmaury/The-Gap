import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { initialSession, paceText, startPlace, stopForMenu } from "./hud.js"

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8")
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8")
const main = readFileSync(new URL("./main.js", import.meta.url), "utf8")

assert.match(html, /id="menu"/)
assert.match(html, /id="speed" hidden/)
assert.match(html, /Night snow/)
assert.match(html, /Night forest/)
assert.match(html, /Night rock/)
assert.match(css, /clip-path/)
assert.match(css, /#0d1018/)
assert.equal(paceText(10), "36 km/h")

const waiting = initialSession()
assert.equal(waiting.playing, false)
const driving = startPlace(1)
assert.equal(driving.playing, true)
const stopped = stopForMenu(driving)
assert.equal(stopped.playing, false)

const stepAt = main.indexOf("run = step(")
const gateAt = main.indexOf("if (session.playing)")
assert.ok(gateAt !== -1 && gateAt < stepAt)
assert.match(main, /Escape/)
assert.match(main, /stopForMenu/)
