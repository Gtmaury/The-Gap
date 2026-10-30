# Spec Delta

## Purpose

Shows the rally from steeply above so the car stays small and the field ahead fills the view.

## ADDED Requirements

### Requirement: Overhead camera
While a stage is running, the game SHALL place the camera above the car, looking down at the car and the ground ahead. The car MUST be seen from above. The view MUST keep the car and a stretch of ground in front of it on screen when the car turns.

#### Scenario: Stage is running
- **WHEN** a stage is running
- **THEN** the car is visible from above and ground in front of the car is also visible

#### Scenario: Car turns
- **WHEN** the car changes heading during a stage
- **THEN** the view turns with the car so the ground ahead of its new heading stays in view

### Requirement: Stage list has no driving camera
The overhead driving view SHALL be hidden on the stage list. Choosing a stage is what shows it.

#### Scenario: Rally opens
- **WHEN** the player is on the stage list
- **THEN** the overhead driving view is not shown
