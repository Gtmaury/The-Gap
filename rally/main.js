import { createView } from "./render.js"
import { field, places } from "./stages.js"
import { createRun, restart, step } from "./sim.js"

const canvas = document.querySelector("#view")
const fallback = document.querySelector("#fallback")

const gl = canvas.getContext("webgl", { antialias: false })
if (!gl) {
  fallback.hidden = false
  canvas.hidden = true
} else {
  const view = createView(canvas, gl)
  view.setField(field)

  const keys = new Set()
  let run = createRun(field)
  let last = performance.now()
  let accumulator = 0

  function input() {
    const left = keys.has("KeyA") || keys.has("ArrowLeft")
    const right = keys.has("KeyD") || keys.has("ArrowRight")
    return {
      accelerate: keys.has("KeyW") || keys.has("ArrowUp"),
      brake: keys.has("KeyS") || keys.has("ArrowDown"),
      steer: (left ? 1 : 0) - (right ? 1 : 0),
    }
  }

  function restartRun() {
    run = restart(run)
    accumulator = 0
  }

  function selectPlace(index) {
    const place = places[index]
    if (!place) return
    run = createRun(place)
    accumulator = 0
    view.setField(place)
  }

  function paint(dt) {
    view.draw(run, dt)
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    accumulator += dt
    const stepDt = 1 / 60
    while (accumulator >= stepDt) {
      run = step(run, input(), stepDt)
      accumulator -= stepDt
    }
    paint(dt)
    requestAnimationFrame(frame)
  }

  window.addEventListener("keydown", (event) => {
    keys.add(event.code)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
      event.preventDefault()
    }
    if (event.code === "KeyR") restartRun()
    if (event.code === "Digit1") selectPlace(0)
    if (event.code === "Digit2") selectPlace(1)
    if (event.code === "Digit3") selectPlace(2)
  })
  window.addEventListener("keyup", (event) => keys.delete(event.code))
  window.addEventListener("blur", () => keys.clear())

  paint(0)
  requestAnimationFrame(frame)
}
