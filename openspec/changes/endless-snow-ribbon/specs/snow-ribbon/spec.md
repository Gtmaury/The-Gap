# Spec Delta

## Purpose

Keeps the snow and the trees going along the drive so the mountain does not end after one square.

## ADDED Requirements

### Requirement: Snow repeats along the drive
The snow band SHALL continue along world `z` without a far edge. Ground height one repeat ahead MUST match ground height at the same point in the previous repeat. A short distance ahead of the start, the snow MUST be higher than the snow at the start. The snow 45 m behind the start MUST be lower than the snow at the start.

#### Scenario: Drive passes the old edge
- **WHEN** the car drives forward past 90 m from the start
- **THEN** snow is still under the car and ahead of the car

#### Scenario: The pattern repeats
- **WHEN** ground height is compared at a point and at that point 180 m further along `z`
- **THEN** the two heights match

### Requirement: Trees repeat with the snow
Every repeat of the ribbon SHALL contain trees, and only trees. The starting repeat MUST keep trees off the starting point and MUST place at least one tree ahead of the start. A tree MUST NOT stop or deflect the car. The same repeat MUST always place the same trees.

#### Scenario: Next repeat is reached
- **WHEN** the car enters the next 180 m repeat
- **THEN** that repeat shows trees, and none of them is a rock

#### Scenario: Car meets a tree
- **WHEN** the car drives through the spot where a tree stands
- **THEN** the car keeps its speed and heading

### Requirement: The band stays wide enough to turn
The drawn snow SHALL stay 180 m wide. Steering from the start without leaving that band MUST keep the car on snow. The camera yaw MUST stay locked to the world while the ribbon scrolls with the car.

#### Scenario: Steer and stay on the ribbon
- **WHEN** the car turns and drives while remaining inside the 180 m width
- **THEN** snow remains under the car and the world ahead stays toward the top of the screen
