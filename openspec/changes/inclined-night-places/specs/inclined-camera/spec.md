# Spec Delta

## Purpose

Leans the rally camera along the drive so the horizon shows and the car stays low in the frame.

## ADDED Requirements

### Requirement: The camera leans along the ribbon
The camera SHALL sit behind and above the car and look along world `+z` at about 22 degrees below the horizon. The horizon MUST sit near the top of the frame. The car MUST stay in the lower half. Camera yaw MUST stay locked to the world.

#### Scenario: Drive straight
- **WHEN** the car drives forward
- **THEN** the world ahead stays toward the top of the screen and the car stays in the lower half

#### Scenario: Steer
- **WHEN** the car steers from the start
- **THEN** the car rotates on screen and the camera yaw stays fixed to the world

### Requirement: The camera climbs with the car
The camera offset MUST stay fixed relative to the car and MUST NOT depend on heading. When the car gains or loses height, the camera MUST move with that height.

#### Scenario: The car climbs
- **WHEN** the car drives onto higher ground
- **THEN** the camera rises with the car and the horizon stays near the top of the frame
