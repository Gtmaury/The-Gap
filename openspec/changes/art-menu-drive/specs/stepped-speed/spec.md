# Spec Delta

## Purpose

Lets the car climb through faster speed steps and shows that speed while the player drives.

## ADDED Requirements

### Requirement: Speed climbs in steps
While the accelerator is held, the fastest forward speed the car may reach SHALL open one step at a time. The steps are 8, 12, 16, 20, 24, 28, and 32 m/s. The car MUST reach the open step before the next step opens, and a step MUST stay open for 0.45 s of throttle before the next one opens. The car MUST NOT exceed the open step. Grip and slope MUST still change how quickly the car arrives at the open step.

#### Scenario: The first second does not jump to the top
- **WHEN** the car starts from rest on flat ground and the accelerator is held for one second
- **THEN** its forward speed is at most 12 m/s

#### Scenario: Holding the throttle opens a faster step
- **WHEN** the car has held the open step under throttle for 0.45 s and a faster step remains
- **THEN** the next step, 4 m/s higher, becomes the limit

#### Scenario: The climb stops at 32 m/s
- **WHEN** the open step is 32 m/s and the accelerator stays held
- **THEN** forward speed does not rise past 32 m/s

### Requirement: Braking and coasting come back down
Braking or releasing the accelerator SHALL reduce forward speed. A lower step MUST become the limit again as the speed falls. The car MUST NOT keep the top step after the player lets go.

#### Scenario: Coasting leaves the high step
- **WHEN** the player releases the accelerator after a high step
- **THEN** forward speed falls and the limit falls with it

### Requirement: The drive shows the speed
During a drive the page SHALL show the car's speed in km/h, rounded to the nearest whole number, and that number MUST change as the speed changes. The menu MUST hide the readout.

#### Scenario: The number matches the car
- **WHEN** the car is moving at 10 m/s during a drive
- **THEN** the readout shows 36 km/h

#### Scenario: The menu hides the readout
- **WHEN** the level menu is open
- **THEN** the speed readout is hidden
