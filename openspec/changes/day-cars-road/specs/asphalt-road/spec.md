# Spec Delta

## Purpose

Paints the existing bend as a road with shoulders, asphalt, and a center dash.

## ADDED Requirements

### Requirement: The bend stays and the tan strip goes
The road SHALL follow the same centerline and the same 7 m half-width. The walls MUST stay on those edges. The tan color `[0.62, 0.48, 0.28]` MUST leave the road and the level menu.

#### Scenario: The start is still on the center
- **WHEN** the car starts
- **THEN** it is on the road centerline, and the center at `z` matches the center at `z + 180`

#### Scenario: The tan color is gone
- **WHEN** the road colors are listed
- **THEN** `[0.62, 0.48, 0.28]` is not among them

### Requirement: The surface has three bands
From the center, the road SHALL be a pale dash `[0.86, 0.84, 0.78]` within 0.12 m, dark asphalt `[0.22, 0.23, 0.25]` out to 5.5 m, and a pale shoulder `[0.45, 0.43, 0.38]` from 5.5 m to 7 m. The dash MUST break along the road, with 6 m present and the next 6 m absent. The level menu wedge MUST use the asphalt color.

#### Scenario: A shoulder point is lighter than the lane
- **WHEN** a point 6 m from the center is compared with a point 3 m from the center
- **THEN** the outer point uses the shoulder color and the inner point uses the asphalt color

#### Scenario: The dash is broken
- **WHEN** a center point on a dash segment is compared with a center point 6 m farther along the road
- **THEN** one point is the dash color and the other is asphalt
