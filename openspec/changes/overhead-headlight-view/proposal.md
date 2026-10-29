# Proposal

## Why

The rally already drives, but the view is a low chase camera over green hills. The reference is a small car seen from high above, with a headlight beam on a gray field dotted with pines and rocks. The stage should read that way while it is being driven.

## What Changes

- **BREAKING** Replace the chase camera with a steep overhead view. The car stays small and low in the frame, and the gray field ahead fills the view.
- Show a bright headlight wedge on the ground in front of the car. It follows the car's heading.
- Recolor the ground to flat grays. Add scattered dark pine shapes and small dark rocks.
- Keep the driving rules: one car, keyboard, three stages, stage time, off-course penalty, restart, result, and the readable `OFF COURSE` label.
- Pine trees and rocks are scenery. They do not stop the car and do not add penalty time.
- The Gap vocabulary page stays as it is.

Assumptions, because the reference is a still image:

- This restyles the existing rally page. It does not add a second game.
- One camera. The chase view does not remain as an option.
- Headlights are always on during a stage.
- Course-edge posts and the finish gate stay, restyled darker so the corridor is still visible on the gray field.
- `openspec list --specs` currently returns no main specs. The chase-camera requirement lives only in the unarchived change `low-poly-rally` (`specs/low-poly-view`). This change supersedes that presentation. Driving requirements from that change are left as they are.

## Capabilities

### New Capabilities

- `overhead-view`: A steep top-down camera that keeps the car in view and shows the field ahead.
- `headlight-beam`: A bright wedge of light on the ground ahead of the car, aimed along its heading.
- `gray-field`: Gray flat-shaded ground with dark pine silhouettes and small rocks that do not affect driving.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` camera, ground colors, and the new beam, pines, and rocks. The unlit flat-color shader can stay.
- A small scenery helper next to the sim, so pine and rock placement can be tested without WebGL.
- `rally/sim.js` speed, steering, clocks, and course tests stay. `game/` stays.
- The stage list, timer, `OFF COURSE`, and result panel stay readable over the new view.
