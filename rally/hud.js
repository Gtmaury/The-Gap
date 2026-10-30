export function paceText(speed, gear = 0) {
  return `${gear + 1} ${Math.round(speed * 3.6)} km/h`
}

export function queueShift(queued, code, repeat) {
  if (repeat) return queued
  if (code === "ArrowUp") return 1
  if (code === "ArrowDown") return -1
  return queued
}

export function initialSession() {
  return { playing: false, placeIndex: null, day: false, car: "hatch" }
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
