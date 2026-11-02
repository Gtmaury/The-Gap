# Spec Delta

## Purpose

Ends a stage when the car crosses a gate on the road, and leaves a run that misses the road still going.

## ADDED Requirements

### Requirement: A gate stands 360 m ahead
Snow, forest, and rock MUST each draw a gate at 360 m ahead of the start, centered on the route. The gate MUST be two posts and one beam. The posts MUST use `[0.12, 0.12, 0.14]`. The beam MUST use `[0.86, 0.22, 0.18]` and MUST span the 14 m road width. The same colors MUST be used in day and at night.

#### Scenario: Snow, forest, and rock share the gate
- **WHEN** the gate is built for snow, forest, and rock
- **THEN** each mesh contains `[0.12, 0.12, 0.14]` and `[0.86, 0.22, 0.18]`, and the beam covers 7 m to either side of the route center at 360 m

### Requirement: Only the road ends the run
The run MUST finish when the car moves from a position before 360 m to a position at or beyond 360 m while its center is within 7 m of the route center. A crossing farther than 7 m from the route center MUST NOT finish the run, and the car MUST keep moving.

#### Scenario: The car crosses on the road
- **WHEN** the car moves from 359 m to 361 m with its center 2 m from the route center
- **THEN** the run is finished

#### Scenario: The car crosses beside the road
- **WHEN** the car moves from 359 m to 361 m with its center 9 m from the route center
- **THEN** the run is not finished and the car is still moving

### Requirement: A finished car stays put
Once the run is finished, the car MUST stay at that position with speed 0. Throttle, brake, and steering MUST NOT move it until the attempt restarts or the page returns to Stages.

#### Scenario: Throttle after the gate
- **WHEN** the run is finished and the driver holds accelerate
- **THEN** the speed stays 0 and the position stays where the gate was crossed
