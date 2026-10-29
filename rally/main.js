import { createView } from "./render.js"
import { stages } from "./stages.js"
import { createRun, formatTime, onCourse, restart, step, totalTime } from "./sim.js"

const canvas = document.querySelector("#view")
const fallback = document.querySelector("#fallback")
const list = document.querySelector("#list")
const hud = document.querySelector("#hud")
const timeLabel = document.querySelector("#time")
const offCourse = document.querySelector("#off")
const result = document.querySelector("#result")
const resultName = document.querySelector("#result-name")
const resultStage = document.querySelector("#result-stage")
const resultPenalty = document.querySelector("#result-penalty")
const resultTotal = document.querySelector("#result-total")

const gl = canvas.getContext("webgl", { antialias: false })
if (!gl) {
  fallback.hidden = false
  canvas.hidden = true
  list.hidden = true
} else {
  const view = createView(canvas, gl)
  for (const stage of stages) {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = stage.name
    button.addEventListener("click", () => start(stage))
    list.append(button)
  }

  const keys = new Set()
  let run = null
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

  function showList() {
    run = null
    list.hidden = false
    hud.hidden = true
    result.hidden = true
    canvas.hidden = true
    offCourse.hidden = true
    timeLabel.textContent = ""
  }

  function showRun() {
    list.hidden = true
    canvas.hidden = false
    hud.hidden = false
    result.hidden = true
  }

  function start(stage) {
    run = createRun(stage)
    accumulator = 0
    view.setStage(stage)
    showRun()
    paint(0)
  }

  function restartRun() {
    if (!run) return
    run = restart(run)
    accumulator = 0
    showRun()
    paint(0)
  }

  function paint(dt) {
    if (!run) return
    const off = !onCourse(run.car.x, run.car.z, run.stage)
    timeLabel.textContent = formatTime(run.stageTime)
    offCourse.hidden = !off || run.phase !== "running"
    if (run.phase === "finished") {
      result.hidden = false
      resultName.textContent = run.stage.name
      resultStage.textContent = formatTime(run.stageTime)
      resultPenalty.textContent = formatTime(run.penaltyTime)
      resultTotal.textContent = formatTime(totalTime(run))
    } else {
      result.hidden = true
    }
    view.draw(run, dt)
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (run && run.phase === "running") {
      accumulator += dt
      const stepDt = 1 / 60
      while (accumulator >= stepDt) {
        run = step(run, input(), stepDt)
        accumulator -= stepDt
      }
    }
    paint(dt)
    requestAnimationFrame(frame)
  }

  document.querySelector("#restart").addEventListener("click", restartRun)
  document.querySelector("#result-restart").addEventListener("click", restartRun)
  document.querySelector("#back").addEventListener("click", showList)
  document.querySelector("#result-back").addEventListener("click", showList)

  window.addEventListener("keydown", (event) => {
    keys.add(event.code)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
      event.preventDefault()
    }
    if (event.code === "KeyR") restartRun()
    if (event.code === "Escape") showList()
  })
  window.addEventListener("keyup", (event) => keys.delete(event.code))
  window.addEventListener("blur", () => keys.clear())

  showList()
  requestAnimationFrame(frame)
}
