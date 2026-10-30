# Design

## Context

`step` opens the next entry of `SPEED_STEPS` after `STEP_HOLD` seconds at the cap while W is held. `main.js` treats ArrowUp as accelerate and ArrowDown as brake. `paceText` prints only km/h. Escape calls `showMenu`, and no control on the drive does that. See proposal.md for why the gears and the button replace the automatic climb.

## Goals / Non-Goals

**Goals:**

- One gear index on the car, chosen by an edge from the arrows.
- A pull that drops as the gear rises, still multiplied by grip, with slope unchanged.
- A Menu button that calls the same `showMenu` path as Escape.

**Non-Goals:**

- A clutch, a stall, a reverse gear, or a gear selected with the mouse.
- Changing the road beam, the places, or the route.
- Repeating a shift while the key is held.

## Decisions

### Store the gear and drop the hold

Replace `stepIndex` and `stepHold` with `gear`, starting at `0`. `GEAR_TOP` is `[8, 12, 16, 20, 24, 28, 32]`. `GEAR_PULL` is `[22, 18, 15, 12, 10, 8, 6]`. Throttle adds `GEAR_PULL[gear] * grip * dt` instead of `ACCEL * grip * dt`. The cap is `GEAR_TOP[gear]`. `SPEED_STEPS`, `STEP_HOLD`, and the hold branch go away. `ACCEL` goes away with them. Brake, drag, and slope stay.

`input.shift` is `-1`, `0`, or `1` for that call only. The gear adds `shift` and clamps to `0..6`. If forward speed is above the new top, it becomes that top before the rest of the step. An upshift does not add speed by itself.

Alternative: keep one pull for every gear and only change the cap. Shifting would be a button that raises the limit, and a high gear on a hill would still climb.

### Take the shift from the keydown edge

`main.js` listens for `ArrowUp` and `ArrowDown`. `event.repeat` is ignored. A keydown sets a one-shot `shift` of `1` or `-1`. The first physics step of that frame reads it and clears it. Later steps in the same frame get `0`. ArrowUp is removed from `accelerate`. ArrowDown is removed from `brake`. W and S stay. Left and right arrows stay on the steer.

`paceText(speed, gear)` returns `` `${gear + 1} ${Math.round(speed * 3.6)} km/h` ``. Gear 3 at 10 m/s is `3 36 km/h`.

Alternative: shift every physics step while the key is down. One press would run through several gears before the player could let go.

### Paint a Menu button over the drive

`index.html` gets `<button id="back" type="button" hidden>Menu</button>`. CSS pins it to the top right, with background `#0d1018`, color `#f3ecdf`, no border, and the same letter spacing as the level menu. `begin` shows it. `showMenu` hides it. Its click handler is `showMenu`, the function Escape already calls. The level menu stays on top, so the button is also hidden by that overlay while the menu is open. Hiding it keeps the test able to see `hidden`.

Alternative: a second copy of the level menu inside the drive. The player asked for a way back, which Escape already is.

## Risks / Trade-offs

- [A long test step that used to climb past 8 m/s now stops on gear 1] → The crest and downhill checks move to a 0.2 s throttle, which stays under the first top and still shows grip and slope.
- [Key repeat on a slow machine shifts twice] → `event.repeat` is ignored, and only the first physics step consumes the edge.
- [The button sits on the road in the corner] → It is one short word, opposite the speed line.

## Migration Plan

Static page. No saved data. Restore the hold, `ACCEL`, the arrow gas and brake, and delete `#back` to undo the change.

## Open Questions

None.
