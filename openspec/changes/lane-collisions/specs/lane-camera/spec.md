# Spec Delta

## Purpose

Raises the rally camera toward a League view while keeping it more inclined than that usual angle.

## ADDED Requirements

### Requirement: The camera sits at a League incline
The camera SHALL sit behind and above the car and look along world `+z` at about 34 degrees below the horizon. The car MUST stay in the lower half. Camera yaw MUST stay locked to the world. The camera MUST NOT orbit with the pointer and MUST NOT pan from the screen edge.

#### Scenario: Drive straight
- **WHEN** the car drives forward along the route
- **THEN** the world ahead stays toward the top of the screen and the car stays in the lower half

#### Scenario: Steer
- **WHEN** the car steers
- **THEN** the car rotates on screen and the camera yaw stays fixed to the world

### Requirement: The camera follows height only
The camera offset MUST stay fixed relative to the car and MUST NOT depend on heading. When the car gains or loses height, the camera MUST move with that height.

#### Scenario: The car climbs
- **WHEN** the car drives onto higher ground
- **THEN** the camera rises with the car and the car stays in the lower half
