# Spec Delta

## Purpose

Casts a bright wedge on the ground ahead of the car so the heading reads at a glance from above.

## ADDED Requirements

### Requirement: Beam ahead of the car
While a stage is running, the game SHALL show a wedge on the ground that is brighter than the surrounding ground. The narrow end MUST sit at the car and the wide end MUST lie ahead of the car along its heading.

#### Scenario: Stage is running
- **WHEN** a stage is running
- **THEN** a brighter wedge is visible on the ground in front of the car

#### Scenario: Car turns
- **WHEN** the car changes heading during a stage
- **THEN** the wedge turns with the car and still points along the new heading

### Requirement: No beam on the stage list
The headlight wedge SHALL be hidden while the stage list is showing.

#### Scenario: Rally opens
- **WHEN** the player is on the stage list
- **THEN** the headlight wedge is not shown
