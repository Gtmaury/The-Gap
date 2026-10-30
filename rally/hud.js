export function paceText(speed) {
  return `${Math.round(speed * 3.6)} km/h`
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
