# Spec Delta

## Purpose

Places the rally on a snow-covered mountain and makes every dark scenery object a tree.

## ADDED Requirements

### Requirement: Snow covers a mountain
The driven field SHALL be covered in snow, and the ground MUST rise from the start toward a summit ahead of the start. The summit MUST be higher than the start, and the start MUST be higher than the low edge of the field behind the car.

#### Scenario: Field is shown
- **WHEN** the mountain field is on screen
- **THEN** the ground reads as snow and the land ahead of the car is higher than the land behind it

#### Scenario: Car climbs
- **WHEN** the car drives from the start toward the summit
- **THEN** the car's height increases with the ground under it

### Requirement: Dark scenery is trees
Every dark scenery object SHALL be a tree. The field MUST NOT place rocks. Trees MUST stay off the starting point, and at least one tree MUST stand ahead of the start. A tree MUST NOT stop or deflect the car.

#### Scenario: Field is populated
- **WHEN** the mountain field is created
- **THEN** the dark objects are trees, none of them is a rock, and none sits on the start

#### Scenario: Car meets a tree
- **WHEN** the car drives through the spot where a tree stands
- **THEN** the car keeps its speed and heading

### Requirement: Camera rides the slope
The camera SHALL keep its distant three-quarter offset from the car as the car changes height. The camera yaw MUST stay locked to the world when the car changes heading.

#### Scenario: Car gains height
- **WHEN** the car moves from a lower point on the mountain to a higher point
- **THEN** the camera rises with the car and the world ahead stays toward the top of the screen
