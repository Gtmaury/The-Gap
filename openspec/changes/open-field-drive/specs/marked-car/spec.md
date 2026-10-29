# Spec Delta

## Purpose

Makes the car read as a light block with red taillights and a bright headlight wedge on the ground in front of it.

## ADDED Requirements

### Requirement: Light car body
While the field is being driven, the car body SHALL render as a light, near-white block. The body MUST NOT be a saturated color.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** the car body is visible as a light, near-white block

### Requirement: Red taillights
The car SHALL show small red taillights at its rear. The red MUST be visible from the overhead view and MUST be distinct from the light body.

#### Scenario: Car is in view
- **WHEN** the car is in view while the field is being driven
- **THEN** small red marks are visible at the rear of the car and they are distinct from the light body

### Requirement: Headlight wedge
The game SHALL show a bright light wedge on the ground in front of the car, aimed along the car's heading. The wedge MUST stay in front of the car when the car turns.

#### Scenario: Car drives forward
- **WHEN** the car is moving forward
- **THEN** a bright wedge is visible on the ground ahead of the car, along its heading

#### Scenario: Car turns
- **WHEN** the car changes heading
- **THEN** the bright wedge turns with the car and remains on the ground in front of the new heading
