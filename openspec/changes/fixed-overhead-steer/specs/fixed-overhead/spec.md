# Spec Delta

## Purpose

Holds one steep overhead perspective on the car, matching the reference, so steering rotates the car instead of spinning the field.

## ADDED Requirements

### Requirement: Fixed steep overhead
While the field is being driven, the camera SHALL stay at the same steep overhead height and the same slight world tilt, and MUST follow the car's position. The car MUST stay near the center of the view. The camera yaw MUST NOT change when the car changes heading.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** the car is visible from the same steep overhead perspective, near the center of the view

#### Scenario: Car changes heading
- **WHEN** the car changes heading while the field is being driven
- **THEN** the camera keeps the same world yaw and the car's new heading is visible as a rotation of the car on screen

### Requirement: Diagonal travel stays diagonal
When the car drives in a direction that is not aligned with the screen, the camera SHALL keep that direction diagonal on screen. The view MUST NOT rotate to put the car's nose at the top of the screen.

#### Scenario: Car drives diagonally
- **WHEN** the car moves with a heading that is neither straight up the screen nor straight across it
- **THEN** the car's travel stays diagonal on screen and the car remains near the center
