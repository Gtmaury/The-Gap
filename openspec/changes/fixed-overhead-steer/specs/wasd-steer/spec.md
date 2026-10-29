# Spec Delta

## Purpose

Lets W, A, S, and D steer and drive the car, including a turn that starts from a standstill and shows on the fixed overhead view.

## ADDED Requirements

### Requirement: Steer while stopped
A and D, and the left and right arrow keys, SHALL change the car's heading while its speed is zero. The same keys MUST still change heading while the car is moving.

#### Scenario: Steer from a standstill
- **WHEN** the car is stopped and the player holds steer left or steer right
- **THEN** the car's heading changes and its speed stays zero

#### Scenario: Steer while moving
- **WHEN** the car is moving and the player holds steer left or steer right
- **THEN** the car's heading changes while it continues to move

### Requirement: Visible yaw
A held steer key SHALL turn the car fast enough that, on the fixed overhead view, the car's facing changes by a clear angle within one second. W and S MUST NOT be required for that turn.

#### Scenario: Held steer for one second
- **WHEN** the player holds one steer key for one second from a stop
- **THEN** the car's heading has changed by a clear angle and the car has not started moving

### Requirement: W accelerates and S only brakes
W and the up arrow SHALL accelerate the car along its heading, up to the same top speed as now. S and the down arrow SHALL reduce speed to zero and MUST NOT drive the car backward.

#### Scenario: Accelerate
- **WHEN** the player holds accelerate
- **THEN** the car gains speed along its heading and does not exceed the current top speed

#### Scenario: Brake to a stop
- **WHEN** the car is moving and the player holds brake until it would pass zero
- **THEN** the car's speed is zero and it has not moved backward
