# Proposal

## Why

The overhead camera yaws with the car, so the nose stays pointed up the screen and a turn spins the field. In the reference the camera keeps one steep perspective and only follows the car's position, so the car itself rotates and can travel diagonally. WASD steering is also weak: A and D do nothing until the car is already moving, and the turn is easy to miss.

## What Changes

- **BREAKING** Stop yawing the camera with the car. Keep the same steep overhead height and the same slight tilt, locked to world axes, and follow only the car's position. A turn rotates the car on screen. The car can point diagonally, the way it travels in the reference.
- Let A and D change heading while the car is stopped as well as while it is moving. Raise the yaw rate so a held steer key turns the car through a clear angle on that fixed view.
- W still accelerates along the car's heading. S still brakes to a stop and does not drive in reverse.
- Headlights, taillights, the flat field, and the lack of a HUD stay as they are.
- The Gap vocabulary page stays as it is.

Assumptions:

- "The same position" and "the same perspective" mean the reference's fixed steep overhead, not a second chase angle. Height and tilt stay in the current overhead band. Only the yaw lock changes.
- "More with WASD" means steering that works at rest and reads on screen. It does not add strafing or reverse.
- `openspec list --specs` returns no main specs. The requirement that the view turns with the heading lives only in the completed change `open-field-drive` (`specs/centered-overhead`). This change supersedes that requirement.

## Capabilities

### New Capabilities

- `fixed-overhead`: A steep overhead camera that follows the car's position with a constant world tilt and does not yaw when the car steers.
- `wasd-steer`: Keyboard steering that changes heading at rest and while moving, fast enough to see on the fixed view.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` `viewPose`, which today offsets the eye and the look point by the car's heading.
- `rally/view.test.mjs`, which asserts that a point ahead of the car stays up the screen after a turn.
- `rally/sim.js` yaw rate and the rule that steering requires speed. `rally/sim.test.mjs` covers that rule.
- `rally/main.js` key mapping stays W/A/S/D and the arrows. `game/` stays.
