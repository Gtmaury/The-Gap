# Spec Delta

## Purpose

Shows the rally as a flat-shaded low-poly 3D scene so the player can see the car, the course, and the finish while driving.

## ADDED Requirements

### Requirement: Flat-shaded low-poly scene
During a stage, the game SHALL show the car, the ground, and the course edges as flat-shaded polygonal surfaces in solid colors. The scene MUST be understandable without photographic textures.

#### Scenario: Stage is on screen
- **WHEN** a stage is running
- **THEN** the car, the ground, and the course edges are visible as flat-colored polygonal shapes

### Requirement: Chase camera
While a stage is running, the game SHALL keep the camera behind and above the car, looking along the car's heading, so the course ahead stays in view.

#### Scenario: Car drives and turns
- **WHEN** the car moves and changes heading during a stage
- **THEN** the camera remains behind and above the car and the course ahead of the car is in view

### Requirement: Finish stands out
The active stage's finish SHALL be visibly distinct from the course edges while it is in view.

#### Scenario: Finish comes into view
- **WHEN** the car is on the course and the finish is in view
- **THEN** the finish marker is visibly different from the course edges

### Requirement: Driving readouts stay readable
The game SHALL keep the off-course indication and the result times readable over the 3D view.

#### Scenario: Off-course indication
- **WHEN** the car is off course during a stage
- **THEN** the off-course indication is readable on screen

#### Scenario: Result over the view
- **WHEN** the result is showing
- **THEN** the stage name and the three times are readable on screen

### Requirement: No 3D view blocks play
The game SHALL NOT start a stage when the browser cannot show the 3D view. It SHALL show a message that the rally cannot be displayed.

#### Scenario: Graphics unavailable
- **WHEN** the rally page loads and the browser cannot create the 3D view
- **THEN** no stage starts and a message states that the rally cannot be displayed
