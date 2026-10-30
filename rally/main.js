import { initialSession, paceText, startPlace, stopForMenu } from "./hud.js"
import { chunksAround, createView } from "./render.js"
import { propsForChunk } from "./scenery.js"
import { solidRadius } from "./route.js"
import { field, places } from "./stages.js"
import { createRun, restart, step } from "./sim.js"

const canvas = document.querySelector("#view")
const fallback = document.querySelector("#fallback")
const menu = document.querySelector("#menu")
const speed = document.querySelector("#speed")

const gl = canvas.getContext("webgl", { antialias: false })
if (!gl) {
  fallback.hidden = false
  canvas.hidden = true
  menu.hidden = true
} else {
  const view = createView(canvas, gl)
  view.setField(field)

  const keys = new Set()
  let session = initialSession()
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
    if (!session.playing) return
    run = restart(run)
    accumulator = 0
    speed.textContent = paceText(run.car.speed)
  }

  function begin(index) {
    const place = places[index]
    if (!place) return
    session = startPlace(index)
    run = createRun(place)
    accumulator = 0
    view.setField(place)
    menu.hidden = true
    speed.hidden = false
    speed.textContent = paceText(run.car.speed)
  }

  function showMenu() {
    session = stopForMenu(session)
    accumulator = 0
    menu.hidden = false
    speed.hidden = true
  }

  function paint(dt) {
    view.draw(run, dt)
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (session.playing) {
      accumulator += dt
      const stepDt = 1 / 60
      while (accumulator >= stepDt) {
        const solids = []
        for (const index of chunksAround(run.car.z)) {
          for (const prop of propsForChunk(run.field, index)) {
            solids.push({ x: prop.x, z: prop.z, radius: solidRadius(prop.kind) })
          }
        }
        run = step(run, input(), stepDt, solids)
        accumulator -= stepDt
      }
      speed.textContent = paceText(run.car.speed)
    }
    paint(dt)
    requestAnimationFrame(frame)
  }

  menu.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => begin(Number(button.dataset.place)))
  })

  window.addEventListener("keydown", (event) => {
    keys.add(event.code)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
      event.preventDefault()
    }
    if (event.code === "Escape") showMenu()
    if (event.code === "KeyR") restartRun()
    if (event.code === "Digit1") begin(0)
    if (event.code === "Digit2") begin(1)
    if (event.code === "Digit3") begin(2)
  })
  window.addEventListener("keyup", (event) => keys.delete(event.code))
  window.addEventListener("blur", () => keys.clear())

  paint(0)
  requestAnimationFrame(frame)
}
