# Spec Delta

## Purpose

Holds the clock and the car through a 3, 2, 1 count so the time starts when the drive starts.

## ADDED Requirements

### Requirement: The plate counts down from three
Starting a place, and restarting one, MUST show 3, then 2, then 1 on the drive plate. Each mark MUST last one second. During the count the clock MUST stay `0:00`. The gear and the speed MUST be hidden while a count mark is showing.

#### Scenario: One second shows 3
- **WHEN** a place has been running for less than one second
- **THEN** the plate shows 3 and the clock shows `0:00`

#### Scenario: The third second shows 1
- **WHEN** the place has been running for 2.5 seconds and the count is not over
- **THEN** the plate shows 1 and the clock shows `0:00`

### Requirement: The car waits for the count
Until the 1 ends, throttle, brake, and steering MUST NOT move the car. The speed MUST stay 0.

#### Scenario: Throttle during the count
- **WHEN** the plate shows 2 and the driver holds accelerate
- **THEN** the speed stays 0 and the car stays on the start

### Requirement: The clock starts when the count ends
When the 1 ends, the plate MUST return to the gear and the speed, and the clock MUST start from `0:00`. The car MUST accept accelerate. The count marks MUST NOT remain on the plate.

#### Scenario: Driving after the count
- **WHEN** three seconds of the count have passed and the driver holds accelerate
- **THEN** the plate shows the gear and the speed, the clock is allowed to leave `0:00`, and the car moves
