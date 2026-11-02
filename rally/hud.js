export function paceMarks(speed, gear = 0) {
  return { gear: String(gear + 1), pace: `${Math.round(speed * 3.6)} km/h` }
}

export function paceText(speed, gear = 0) {
  const marks = paceMarks(speed, gear)
  return `${marks.gear} ${marks.pace}`
}

export function clockText(seconds) {
  const whole = Math.max(0, Math.floor(Number(seconds) || 0))
  const minutes = Math.floor(whole / 60)
  const remain = whole % 60
  return `${minutes}:${String(remain).padStart(2, "0")}`
}

export function advanceClock(elapsed, dt, finished) {
  if (finished) return elapsed
  return elapsed + dt
}

export function noteFinish(best, placeIndex, seconds) {
  const next = [best?.[0] ?? null, best?.[1] ?? null, best?.[2] ?? null]
  const index = Number(placeIndex)
  if (index < 0 || index > 2) return next
  const current = next[index]
  if (current == null || seconds < current) next[index] = seconds
  return next
}

export function cardTime(best, placeIndex) {
  const time = best?.[placeIndex]
  return time == null ? "—" : clockText(time)
}

export function queueShift(queued, code, repeat) {
  if (repeat) return queued
  if (code === "ArrowUp") return 1
  if (code === "ArrowDown") return -1
  return queued
}

export function initialSession() {
  return { playing: false, placeIndex: null, day: false, car: "hatch", best: [null, null, null] }
}

export function selectTime(session, day) {
  return { ...session, day: Boolean(day) }
}

export function selectCar(session, car) {
  const kind = car === "coupe" || car === "wagon" ? car : "hatch"
  return { ...session, car: kind }
}

export function startPlace(index, session = initialSession()) {
  return { ...session, playing: true, placeIndex: index }
}

export function stopForMenu(session) {
  return { ...session, playing: false }
}
