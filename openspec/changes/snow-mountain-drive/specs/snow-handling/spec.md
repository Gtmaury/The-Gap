# Spec Delta

## Purpose

Changes how the car accelerates, coasts, and turns on snow and on the mountain slope, without adding a reverse gear.

## ADDED Requirements

### Requirement: Slope changes speed
Driving uphill SHALL spend speed, and driving downhill SHALL add speed. From a stop, a car whose nose points downhill MUST begin to roll downhill. From a stop, a car whose nose points uphill MUST stay stopped until the driver accelerates.

#### Scenario: Same throttle, opposite slopes
- **WHEN** the car accelerates from the start toward the summit, and the same acceleration is repeated from the start with the nose pointed downhill, for the same amount of time
- **THEN** the downhill run is faster than the uphill run

#### Scenario: Coasting from a stop
- **WHEN** the car is stopped at the start with its nose pointed downhill and the driver is not accelerating or braking
- **THEN** the car gains speed and moves downhill

#### Scenario: Uphill stop holds
- **WHEN** the car is stopped at the start with its nose pointed uphill and the driver is not accelerating or braking
- **THEN** the speed stays zero

### Requirement: Snow reduces grip
On snow, acceleration SHALL be slower than the flat-field acceleration, and a turn made while moving MUST slide so the direction of travel differs from the nose. Steering while stopped MUST still yaw the car and MUST NOT move it.

#### Scenario: Uphill acceleration
- **WHEN** the car accelerates from a stop at the start toward the summit for two seconds
- **THEN** its speed stays below the previous top speed

#### Scenario: Turn while moving
- **WHEN** the car is moving and the driver steers
- **THEN** the nose yaws and the direction of travel lags behind the nose

#### Scenario: Steer from a stop
- **WHEN** the car is stopped and the driver steers without accelerating
- **THEN** the heading changes and the position stays put

### Requirement: Braking stops without reverse
Braking SHALL bring the car to a stop on the slope. The speed MUST NOT become negative, and braking MUST NOT move the car backward.

#### Scenario: Brake on the slope
- **WHEN** the car is moving and the driver brakes
- **THEN** the speed reaches zero and the car does not travel backward
