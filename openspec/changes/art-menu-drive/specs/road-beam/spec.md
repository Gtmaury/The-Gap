# Spec Delta

## Purpose

Lights the road ahead of the car with a short fading beam and leaves the road surface visible.

## ADDED Requirements

### Requirement: The lamp is a beam on the road
The road in front of the bumper SHALL brighten in a short beam. A point on the road about 4 m ahead of the nose MUST be brighter than a point the same distance to the side. A point on the road about 20 m ahead MUST stay at the night road color. The beam MUST follow the car's heading.

#### Scenario: The beam stays ahead of the nose
- **WHEN** a point 4 m ahead of the nose is compared with a point 4 m to the side
- **THEN** the point ahead is brighter and the point to the side stays night

#### Scenario: The beam does not reach far down the road
- **WHEN** a point on the road 20 m ahead of the nose is shaded
- **THEN** that point is no brighter than the road beside the car

#### Scenario: The beam follows a turn
- **WHEN** the nose turns
- **THEN** the bright patch swings with the nose

### Requirement: No solid sheet covers the road
The headlight MUST NOT draw an opaque white polygon over the road. The road color MUST remain visible inside the beam, only brighter.

#### Scenario: The road shows through the beam
- **WHEN** the beam lights the route
- **THEN** the lit patch is the route color made brighter, and no solid white triangle sits on top of the car
