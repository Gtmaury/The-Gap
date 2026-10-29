# Proposal

## Why

The three-quarter camera sits about 33 m from the car, so the car and the nearest trees fill the frame. The reference keeps the same kind of high angle and shows a smaller car in a wider field. The picture is also flat: every face of a tree is the same gray, because the shader copies vertex color with no light.

## What Changes

- **BREAKING** Move the camera about twice as far away while keeping the same pitch, about 51 degrees above the horizon, and the same fixed world yaw. The car stays in the lower half and near the horizontal center, and it reads smaller than it does now.
- Replace the unlit color copy with a lit shader. One directional light and an ambient term shade each face from its normal, so two faces of the same color can render differently. The headlight wedge stays fully bright.
- Pine shapes, rock shapes, driving, and the lack of a HUD stay as they are.
- The Gap vocabulary page stays as it is.

Assumptions:

- "Distance" means a farther camera at the current pitch, not a new chase camera and not a zoom control.
- "Shaders" means this one lit shader. It does not add textures, shadow maps, fog, a vignette, or a second renderer.
- `openspec list --specs` returns no main specs. The 28 m / 18 m pose lives only in the completed change `three-quarter-view`. This change supersedes that distance. The pitch and the fixed yaw stay.

## Capabilities

### New Capabilities

- `distant-camera`: A three-quarter camera about twice as far from the car as the current pose, with the same pitch and fixed yaw.
- `lit-faces`: A directional light that shades faces by their normals, while the headlight wedge stays bright.

### Modified Capabilities

- None. No capability is archived under `openspec/specs/` yet.

## Impact

- `rally/render.js` `viewPose`, the vertex and fragment shaders, and the mesh layout, which is position and color today.
- `rally/view.test.mjs`, which locks the eye at 28 m up and 18 m back.
- `rally/sim.js`, scenery placement, and `game/` stay.
