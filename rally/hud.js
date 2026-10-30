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
  return { playing: false, placeIndex: null }
}

export function startPlace(index) {
  return { playing: true, placeIndex: index }
}

export function stopForMenu(session) {
  return { playing: false, placeIndex: session.placeIndex }
}
