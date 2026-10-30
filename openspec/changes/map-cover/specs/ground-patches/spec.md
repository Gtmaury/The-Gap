# Spec Delta

## Purpose

Gives each place a second ground color so the snow, the forest, and the rock are not one flat fill.

## ADDED Requirements

### Requirement: Each place keeps two ground colors
The snow ground MUST include `[0.45, 0.52, 0.62]` and `[0.72, 0.78, 0.84]`. The forest ground MUST include `[0.10, 0.16, 0.11]` and `[0.06, 0.10, 0.07]`. The rock ground MUST include `[0.28, 0.28, 0.30]` and `[0.18, 0.18, 0.20]`.

#### Scenario: A chunk shows both colors
- **WHEN** the ground of chunk 0 is read for snow, forest, and rock
- **THEN** each mesh contains that place's base color and its patch color

### Requirement: The road keeps its colors
The road MUST keep the asphalt `[0.22, 0.23, 0.25]`, the dash `[0.86, 0.84, 0.78]`, and the shoulder `[0.45, 0.43, 0.38]`. A ground patch color MUST NOT appear on the road.

#### Scenario: Snow road has no drift color
- **WHEN** the road of snow chunk 0 is read
- **THEN** it contains the asphalt, the dash, and the shoulder, and it does not contain `[0.72, 0.78, 0.84]`
