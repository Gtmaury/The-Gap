# Spec Delta

## Purpose

Lets the player drive the same places in daylight or at night.

## ADDED Requirements

### Requirement: The menu chooses day or night
The level menu SHALL offer Day and Night. The page MUST open with Night selected. Starting a place MUST use the selected time. Returning to the menu MUST keep that choice.

#### Scenario: The page opens at night
- **WHEN** the page loads
- **THEN** Night is the selected time

#### Scenario: Day stays selected after a drive
- **WHEN** the player selects Day, starts a place, and returns to the menu
- **THEN** Day is still the selected time

### Requirement: Night keeps the moon and the beam
Night SHALL use the dark sky `[0.05, 0.06, 0.10]`, ambient `0.15`, diffuse `0.55`, and light direction `(0.25, 0.72, -0.45)`. The headlight beam MUST light the road ahead.

#### Scenario: A night point ahead is brighter
- **WHEN** the time is night and a road point 4 m ahead of the nose is compared with a point 4 m to the side
- **THEN** the point ahead is brighter

### Requirement: Day is brighter and has no beam
Day SHALL use the pale sky `[0.64, 0.76, 0.88]`, ambient `0.42`, diffuse `0.75`, and light direction `(0.15, 0.92, 0.2)`. An upward face in day MUST be brighter than the same face at night. The headlight beam MUST add no light.

#### Scenario: Day lifts an upward face
- **WHEN** an upward face is lit in day and again at night
- **THEN** the day face is brighter

#### Scenario: The beam is off in day
- **WHEN** the time is day and a road point 4 m ahead of the nose is compared with a point 4 m to the side
- **THEN** the two points are equally lit by the lamp
