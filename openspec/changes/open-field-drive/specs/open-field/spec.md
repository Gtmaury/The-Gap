# Spec Delta

## Purpose

Replaces the timed course with one flat gray field the player drives through, among dark pines and rocks, with no road and no HUD.

## ADDED Requirements

### Requirement: Field starts on load
Opening the rally SHALL start one open field immediately. The page MUST NOT show a stage list, and MUST NOT wait for a stage choice before the car can be driven.

#### Scenario: Rally opens
- **WHEN** the player opens the rally and the view can be shown
- **THEN** the field is already being driven and no stage names are shown

### Requirement: Flat light-gray ground
The ground SHALL render as one flat light gray. It MUST NOT be green, MUST NOT show a road or course marking, and MUST NOT show rolling bands of different ground colors.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** the visible ground is one flat light gray with no road marking

### Requirement: Pines and rocks in the drive
The field SHALL show multiple dark pine shapes and multiple dark rocks, including some ahead of the start. They MUST be flat-shaded polygons, and the start MUST NOT sit inside a pine or a rock.

#### Scenario: Drive begins
- **WHEN** the field starts
- **THEN** more than one dark pine and more than one dark rock are on the field, at least one of them lies ahead of the start, and the car does not begin inside a pine or a rock

### Requirement: Scenery does not stop the car
Touching a pine or a rock SHALL NOT stop the car and SHALL NOT end the drive.

#### Scenario: Car meets scenery
- **WHEN** the car passes through the position of a pine or a rock
- **THEN** the car keeps its speed and the drive keeps going

### Requirement: No course furniture
The field SHALL NOT show course-edge posts or a finish gate.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** no course-edge posts and no finish gate are visible

### Requirement: No driving HUD
While the field is being driven, the page SHALL NOT show a timer, an off-course label, a result, or on-screen restart or back buttons.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** no timer, off-course label, result, or on-screen restart or back button is visible

### Requirement: Keyboard still drives
The player SHALL move the car with the same keyboard controls as before: accelerate, brake, and steer. The drive MUST NOT end on its own.

#### Scenario: Player accelerates and steers
- **WHEN** the player accelerates and steers
- **THEN** the car gains speed and its heading changes, and the drive does not end by itself

### Requirement: Restart returns to the start
Pressing `R` SHALL return the car to the field start with speed zero. The same field MUST still be the one being driven, with no stage list and no result.

#### Scenario: Player presses R
- **WHEN** the field is being driven and the player presses `R`
- **THEN** the car is back at the start with speed zero and the same field is still being driven
