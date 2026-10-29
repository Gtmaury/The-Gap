# Design

## Context

`viewPose` puts the eye at `(car.x, car.y + 28, car.z - 18)` and looks at `(car.x, car.y + 0.5, car.z + 4)`. That is about 33 m from the car and about 51 degrees above the horizon. The shaders in `rally/render.js` copy `aColor` to the fragment with no light. Meshes are 6 floats per vertex, position then color, stride 24. See proposal.md for why both change. Driving, pine placement, and the headlight wedge geometry stay.

## Goals / Non-Goals

**Goals:**

- The same pitch and fixed yaw, with the eye about twice as far away.
- One directional light so faces of one color can differ, and a headlight that stays bright.

**Non-Goals:**

- Textures, shadows, fog, a vignette, or a second light for the headlights.
- A new pine mesh or a camera that yaws with the car.

## Decisions

### Double the camera offset

`viewPose` becomes eye `(car.x, car.y + 56, car.z - 36)` and look `(car.x, car.y + 0.5, car.z + 8)`. Horizontal run 44 m, vertical drop 55.5 m, pitch `atan2(55.5, 44)`, about 51.6 degrees. Distance from the car to the eye is about 67 m, against about 33 m now. Yaw stays independent of heading. Field of view stays `0.8`.

A projection check at 16:9 puts the car near NDC `(0, -0.22)`. An 8 m vertical 12 m to the side is about 0.17 NDC tall, so the view test's "taller than 0.2" check is too strict at this distance. Replace it with a gap greater than 0.08. Keep the lower-half check (`y` below 0 and above -0.45) and the fixed-offset check at a turned heading.

Alternative: leave the 28 m eye and only shrink the field of view. That would crop the field instead of putting the camera farther away.

### Light faces in the existing shader

Add a per-vertex normal and a shade flag. The stride becomes 10 floats: position, normal, color, shade. `addFace` and each cone triangle write one normal for every vertex of that face, from the cross product of two edges. Ground faces point up. The headlight wedge writes shade `0`. Everything else writes shade `1`.

The fragment shader keeps the vertex color and multiplies it by `mix(1.0, ambient + diffuse * max(dot(normal, light), 0.0), shade)`. Ambient is `0.42`, diffuse is `0.70`. The light direction is the normalized vector `(0.15, 0.90, -0.35)`, from above and from the camera side. A JS helper `lightFactor(normal)` uses that same formula so `rally/view.test.mjs` can assert an upward face is brighter than a downward face, and brighter than a face pointing away from the light, without WebGL. The test also reads the shader source for `aNormal` and for the shade mix.

The beam's shade flag is `0`, so its color is unchanged.

Alternative: a second unlit program for the wedge. One program and a shade flag keeps the draw loop as it is.

## Risks / Trade-offs

- [Flat ground stays one brightness] → Accepted. The ground has no slope, so the light shows up on the trees, rocks, and car.
- [Trees are smaller on screen] → That is the distance change. The 0.08 NDC gap still requires the top of an 8 m vertical to sit above its base.
- [The stride change breaks a buffer] → Every `pushVertex` call and both `vertexAttribPointer` sites move together. The view test does not parse the buffer; a drive confirms the field still draws.

## Migration Plan

Static page. No saved data. Revert `rally/render.js` and `rally/view.test.mjs` to restore the 28 m pose and the unlit shader.
