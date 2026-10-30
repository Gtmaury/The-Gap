# Spec Delta

## Purpose

Paints the stage as a gray field with dark pines and rocks, without changing how the car drives or how time is scored.

## ADDED Requirements

### Requirement: Gray ground
During a stage, the ground SHALL render as flat-shaded gray polygons. The ground MUST NOT be green.

#### Scenario: Stage is running
- **WHEN** a stage is running
- **THEN** the visible ground is gray and flat-shaded

### Requirement: Pines and rocks
During a stage, the game SHALL show multiple dark pine shapes and multiple small dark rocks on the field. They MUST be flat-shaded polygons.

#### Scenario: Stage is running
- **WHEN** a stage is running
- **THEN** more than one pine shape and more than one rock are visible as dark flat-shaded forms

### Requirement: Scenery does not change the drive
Touching a pine or a rock SHALL NOT stop the car and SHALL NOT by itself add penalty time. Penalty time still follows only the course rule.

#### Scenario: Car meets scenery
- **WHEN** the car passes through the position of a pine or a rock while on course
- **THEN** the car keeps its speed and penalty time does not increase because of that pine or rock

### Requirement: Corridor still readable
Course-edge markers SHALL stay visible on the gray field, and the finish SHALL stay visually distinct from both those markers and the pines.

#### Scenario: Finish is in view
- **WHEN** the finish is in view during a stage
- **THEN** the finish marker is visibly different from the course-edge markers and from the pines
