# Spec Delta

## Purpose

Makes every place night, with a dim moon on the faces and headlights that light the ground ahead.

## ADDED Requirements

### Requirement: Faces are lit by a dim moon
The ground and the sky SHALL be dark night colors. A face pointing toward the moon MUST be brighter than a face pointing away. Empty space MUST use the night sky color.

#### Scenario: The moon shades a face
- **WHEN** one face points toward the moon and another points away
- **THEN** the face toward the moon is brighter

### Requirement: Headlights light the ground ahead
The headlight wedge SHALL stay fully bright. Ground inside the cone in front of the car MUST be brighter than the same kind of ground outside the cone. The cone MUST follow the car's heading.

#### Scenario: Ground outside the cone stays night
- **WHEN** ground beside the car is compared with ground inside the headlight cone
- **THEN** the ground inside the cone is brighter and the wedge stays white

#### Scenario: The cone follows a turn
- **WHEN** the car steers
- **THEN** the bright ground and the wedge swing with the nose
