# Spec Delta

## Purpose

Lets the player drive one rally car with the keyboard and put that car back at the stage start.

## ADDED Requirements

### Requirement: One car at the start
The game SHALL place exactly one player car at the stage start, facing along the course, when a stage begins.

#### Scenario: Stage begins
- **WHEN** the player starts a stage
- **THEN** one car is at that stage's start, facing along the course, and no second player car is present

### Requirement: Accelerate and brake
The game SHALL increase speed while the accelerate key is held and SHALL decrease speed while the brake key is held. Speed MUST NOT exceed the car's top speed.

#### Scenario: Accelerate from rest
- **WHEN** the car is stopped on a stage and the player holds the accelerate key
- **THEN** the car moves forward along its heading and its speed increases until the top speed

#### Scenario: Brake to a stop
- **WHEN** the car is moving forward and the player holds the brake key without the accelerate key
- **THEN** the car slows and can reach a full stop

### Requirement: Steer only while moving
The game SHALL turn the car's heading left or right while the matching steer key is held and the car is moving. The heading MUST stay unchanged while the car is stopped.

#### Scenario: Steer while moving
- **WHEN** the car is moving forward and the player holds the left steer key
- **THEN** the car's heading turns left

#### Scenario: Steer while stopped
- **WHEN** the car is stopped and the player holds either steer key
- **THEN** the car's heading does not change

### Requirement: Restart returns the car
The game SHALL place the car stopped at the current stage start, facing along the course, when the player restarts that stage.

#### Scenario: Restart mid-stage
- **WHEN** a stage is in progress and the player restarts
- **THEN** the car is stopped at that stage's start and facing along the course
