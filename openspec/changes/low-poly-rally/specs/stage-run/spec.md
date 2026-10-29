# Spec Delta

## Purpose

Lets the player choose a short rally stage, drive it to the finish, and receive a time that includes penalties for leaving the course.

## ADDED Requirements

### Requirement: Three named stages
The game SHALL offer exactly three stages, each with its own name and course. Opening the rally MUST show those names before any stage has started.

#### Scenario: Rally opens
- **WHEN** the player opens the rally game
- **THEN** three distinct stage names are shown and no stage clock is running

### Requirement: Start only after a choice
The game SHALL start a stage only after the player chooses that stage. The car starts at that stage's start and both clocks start at zero.

#### Scenario: Choose a stage
- **WHEN** the player chooses one of the three stages
- **THEN** that stage is running, the car is at its start, and the stage time and penalty time are both zero

### Requirement: On-course and off-course
Each stage SHALL define the driveable course from its start to its finish. The game MUST treat the car as on course only while it is inside that course, and as off course otherwise.

#### Scenario: Car stays inside
- **WHEN** the car remains inside the course
- **THEN** the game treats the car as on course

#### Scenario: Car leaves
- **WHEN** the car moves outside the course
- **THEN** the game treats the car as off course

### Requirement: Off-course penalty time
While the car is off course, the game SHALL accumulate penalty time at the same rate as the stage clock and SHALL show that the car is off course. Penalty time MUST NOT accumulate while the car is on course.

#### Scenario: Penalty accrues off course
- **WHEN** the car remains off course for a span of time
- **THEN** penalty time increases by that span and an off-course indication is visible

#### Scenario: No penalty on course
- **WHEN** the car remains on course
- **THEN** penalty time does not increase

### Requirement: Finish on course
The game SHALL end the stage when the car reaches the finish while on course. Reaching the finish while off course MUST leave the stage running. After the finish, driving input MUST NOT move the car.

#### Scenario: Finish while on course
- **WHEN** the car reaches the finish while on course
- **THEN** the stage ends and further accelerate, brake, and steer input does not move the car

#### Scenario: Finish while off course
- **WHEN** the car reaches the finish while off course
- **THEN** the stage keeps running and driving input still moves the car

### Requirement: Result times
When a stage ends at the finish, the game SHALL show that stage's name, the stage time, the penalty time, and the total time. The total MUST equal stage time plus penalty time.

#### Scenario: Result is shown
- **WHEN** the car finishes a stage on course
- **THEN** the stage name, stage time, penalty time, and total time are shown, and the total equals the other two times added together

### Requirement: Restart the same stage
The game SHALL let the player restart the current stage while it is running and from its result. Restart MUST return both clocks to zero and start that same stage again.

#### Scenario: Restart during a run
- **WHEN** a stage is running and the player restarts
- **THEN** the same stage is running from its start and both clocks are zero

#### Scenario: Restart from the result
- **WHEN** the result is showing and the player restarts
- **THEN** the same stage starts again and both clocks are zero

### Requirement: Leave without saving times
The game SHALL let the player return from a running stage or its result to the stage list. The game MUST NOT show a previous time after the page is reloaded.

#### Scenario: Back to the list
- **WHEN** a stage is running or its result is showing and the player returns to the list
- **THEN** the three stage names are shown and no stage clock is running

#### Scenario: Reload
- **WHEN** the player reloads the rally page
- **THEN** the stage list is shown and no earlier stage time or penalty time is displayed
