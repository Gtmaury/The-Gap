import { advanceClock, cardTime, clockText, countMark, initialSession, noteFinish, paceMarks, queueShift, selectCar, selectTime, startPlace, stopForMenu } from "./hud.js"
import { chunksAround, createView } from "./render.js"
import { propsForChunk } from "./scenery.js"
import { solidRadius } from "./route.js"
import { field, places } from "./stages.js"
import { createRun, restart, step } from "./sim.js"

const canvas = document.querySelector("#view")
const fallback = document.querySelector("#fallback")
const menu = document.querySelector("#menu")
const speed = document.querySelector("#speed")
const gear = document.querySelector("#gear")
const pace = document.querySelector("#pace")
const clock = document.querySelector("#clock")
const call = document.querySelector("#call")
const back = document.querySelector("#back")

const gl = canvas.getContext("webgl", { antialias: false })
if (!gl) {
  fallback.hidden = false
  canvas.hidden = true
  menu.hidden = true
  back.hidden = true
} else {
  const view = createView(canvas, gl)
  view.setField(field)

  const keys = new Set()
  let session = initialSession()
  let run = createRun(field)
  let last = performance.now()
  let accumulator = 0
  let elapsed = 0
  let count = 0
  let pendingShift = 0

  function input(useShift) {
    const left = keys.has("KeyA") || keys.has("ArrowLeft")
    const right = keys.has("KeyD") || keys.has("ArrowRight")
    const shift = useShift ? pendingShift : 0
    if (useShift) pendingShift = 0
    return {
      accelerate: keys.has("KeyW"),
      brake: keys.has("KeyS"),
      steer: (left ? 1 : 0) - (right ? 1 : 0),
      shift,
    }
  }

  function markDay() {
    document.body.classList.toggle("is-day", session.day)
  }

  function showPace(meters, gearIndex) {
    const marks = paceMarks(meters, gearIndex)
    gear.textContent = marks.gear
    pace.textContent = marks.pace
  }

  function showClock(seconds) {
    clock.textContent = clockText(seconds)
  }

  function showCall(text) {
    const on = text != null
    call.hidden = !on
    if (on) call.textContent = text
    gear.hidden = on
    pace.hidden = on
  }

  function showCards() {
    menu.querySelectorAll("[data-place]").forEach((button) => {
      const mark = button.querySelector(".best")
      if (mark) mark.textContent = cardTime(session.best, Number(button.dataset.place))
    })
  }

  function restartRun() {
    if (!session.playing) return
    run = restart(run)
    accumulator = 0
    elapsed = 0
    count = 0
    showPace(run.car.speed, run.car.gear)
    showClock(elapsed)
    showCall(countMark(count))
  }

  function begin(index) {
    const place = places[index]
    if (!place) return
    session = startPlace(index, session)
    run = createRun(place)
    accumulator = 0
    elapsed = 0
    count = 0
    view.setField(place)
    view.setTime(session.day)
    view.setCar(session.car)
    markDay()
    menu.hidden = true
    speed.hidden = false
    back.hidden = false
    showPace(run.car.speed, run.car.gear)
    showClock(elapsed)
    showCall(countMark(count))
  }

  function showMenu() {
    session = stopForMenu(session)
    accumulator = 0
    showCards()
    menu.hidden = false
    speed.hidden = true
    back.hidden = true
    markDay()
  }

  function paint(dt) {
    view.draw(run, dt)
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (session.playing) {
      if (countMark(count)) {
        count += dt
        showClock(0)
        showCall(countMark(count))
      } else {
        elapsed = advanceClock(elapsed, dt, run.finished)
        accumulator += dt
        const stepDt = 1 / 60
        let first = true
        const before = run.finished
        while (accumulator >= stepDt) {
          const solids = []
          for (const index of chunksAround(run.car.z)) {
            for (const prop of propsForChunk(run.field, index)) {
              solids.push({ x: prop.x, z: prop.z, radius: solidRadius(prop.kind) })
            }
          }
          run = step(run, input(first), stepDt, solids)
          first = false
          accumulator -= stepDt
        }
        if (!before && run.finished) {
          session = { ...session, best: noteFinish(session.best, session.placeIndex, elapsed) }
          showCards()
        }
        showPace(run.car.speed, run.car.gear)
        showClock(elapsed)
        showCall(run.finished ? "Finish" : null)
      }
    }
    paint(dt)
    requestAnimationFrame(frame)
  }

  function markSelected(selector, button) {
    menu.querySelectorAll(selector).forEach((item) => {
      item.classList.toggle("is-selected", item === button)
    })
  }

  menu.querySelectorAll("[data-place]").forEach((button) => {
    button.addEventListener("click", () => begin(Number(button.dataset.place)))
  })
  menu.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", () => {
      session = selectTime(session, button.dataset.time === "day")
      markSelected("[data-time]", button)
      markDay()
    })
  })
  menu.querySelectorAll("[data-car]").forEach((button) => {
    button.addEventListener("click", () => {
      session = selectCar(session, button.dataset.car)
      markSelected("[data-car]", button)
    })
  })
  back.addEventListener("click", showMenu)

  window.addEventListener("keydown", (event) => {
    keys.add(event.code)
    pendingShift = queueShift(pendingShift, event.code, event.repeat)
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
