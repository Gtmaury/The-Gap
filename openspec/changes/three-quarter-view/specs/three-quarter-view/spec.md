# Spec Delta

## Purpose

Shows the field from a high three-quarter angle so the ground recedes and nearby trees show their height, while the camera yaw stays fixed.

## ADDED Requirements

### Requirement: High three-quarter pitch
While the field is being driven, the camera SHALL look along the ground from about 51 degrees above the horizon, not from nearly straight down. Ground farther from the camera MUST appear higher on the screen than the car. The top of a nearby tree-height vertical MUST appear above its base.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** ground farther from the camera is higher on the screen than the car, and a nearby vertical of tree height has its top above its base

### Requirement: Car stays in the lower half
The camera SHALL follow the car's position. The car MUST stay in the lower half of the view and near the horizontal center. That placement MUST NOT depend on the car's heading.

#### Scenario: Heading changes
- **WHEN** the car changes heading while the field is being driven
- **THEN** the car remains in the lower half and near the horizontal center

### Requirement: Yaw stays fixed
The camera yaw SHALL stay locked to the world. A change in heading MUST rotate the car on screen. Diagonal travel MUST stay diagonal. The view MUST NOT rotate to put the car's nose at the top of the screen.

#### Scenario: Car drives diagonally
- **WHEN** the car moves with a heading that is neither straight up the screen nor straight across it
- **THEN** the car's travel stays diagonal on screen and the camera yaw is unchanged
