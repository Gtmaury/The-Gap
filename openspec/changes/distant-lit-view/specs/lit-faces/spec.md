# Spec Delta

## Purpose

Shades each face from a directional light so the low-poly field has light and dark sides, while the headlight wedge stays bright.

## ADDED Requirements

### Requirement: Faces shade by their normal
The rally shader SHALL light each face from one directional light plus ambient light. Two faces that share a color and face different directions MUST be able to render as different brightnesses. Faces that point toward the light MUST be brighter than faces that point away from it.

#### Scenario: A pine is in view
- **WHEN** a pine is visible during a drive
- **THEN** at least two of its faces render at different brightnesses

#### Scenario: A face points at the light
- **WHEN** one face points toward the light and another face of the same color points away from it
- **THEN** the face toward the light is brighter

### Requirement: Headlight stays bright
The headlight wedge SHALL render at its full color. The directional light MUST NOT darken it.

#### Scenario: Headlight is in view
- **WHEN** the headlight wedge is visible
- **THEN** it stays a bright wedge and is not shaded down by the directional light
