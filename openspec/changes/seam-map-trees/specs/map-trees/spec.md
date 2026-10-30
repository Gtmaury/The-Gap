# Spec Delta

## Purpose

Makes a pine look like the place it stands in, with flat color instead of one gray cone.

## ADDED Requirements

### Requirement: A snow pine wears a white cap
A pine on the snow place SHALL have a green body `[0.16, 0.32, 0.2]` and a white cap `[0.92, 0.93, 0.9]`. The cap MUST be the highest part of that pine. The gray `[0.22, 0.22, 0.24]` MUST NOT be the pine's only color.

#### Scenario: The cap sits above the body
- **WHEN** a snow pine mesh is read
- **THEN** it contains `[0.16, 0.32, 0.2]` and `[0.92, 0.93, 0.9]`, and a highest vertex uses the white cap

### Requirement: A forest pine has a trunk and two greens
A pine on the forest place SHALL have a brown trunk `[0.28, 0.16, 0.1]`, a lower green `[0.1, 0.28, 0.12]`, and an upper green `[0.18, 0.4, 0.16]`. It MUST differ from the snow pine.

#### Scenario: The forest colors are not the snow colors
- **WHEN** a forest pine mesh is read
- **THEN** it contains the trunk and both greens, and it does not contain `[0.92, 0.93, 0.9]`

### Requirement: The hit circle stays 3 m
The pine collision radius MUST stay 3 m. The rock place MUST keep its stones and MUST NOT grow a pine.

#### Scenario: A pine still stops the car at 3 m
- **WHEN** the car drives into a pine on either place
- **THEN** the circle that stops it has radius 3 m

#### Scenario: Rock scenery is still stone
- **WHEN** the rock place builds its scenery
- **THEN** the mesh uses the stone color and does not use the snow cap
