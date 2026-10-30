# Spec Delta

## Purpose

Adds height among the pines and a small cover on the empty spots, while the solids still stop the car.

## ADDED Requirements

### Requirement: Pines in one chunk differ in height
Snow pines MUST keep the body `[0.16, 0.32, 0.2]` and the cap `[0.92, 0.93, 0.9]`, with the cap on the highest vertices. Forest pines MUST keep the trunk `[0.28, 0.16, 0.1]`, the lower green `[0.10, 0.28, 0.12]`, and the upper green `[0.18, 0.40, 0.16]`, and MUST NOT use the white cap. The wide cone MUST stay radius 3, and the pine hit circle MUST stay 3 m. The pines of one chunk MUST NOT all share one height.

#### Scenario: Two snow pines reach different heights
- **WHEN** the snow pines of chunk 0 are read
- **THEN** at least two of them have different apex heights, each has the green body and the white cap, and the cap is the highest color on that pine

#### Scenario: Forest pines stay green and uneven
- **WHEN** the forest pines of chunk 0 are read
- **THEN** at least two of them have different apex heights, each has the trunk and both greens, and none contains `[0.92, 0.93, 0.9]`

### Requirement: Cover fills the spare spots
Snow cover MUST be 24 mounds of `[0.82, 0.86, 0.90]` and 16 shrubs of `[0.18, 0.22, 0.20]` per chunk. Forest cover MUST be 40 undergrowth cones of `[0.08, 0.20, 0.10]` and 12 stumps of `[0.28, 0.16, 0.10]` per chunk. Rock cover MUST be 28 rubble pieces of `[0.16, 0.16, 0.17]` per chunk and MUST NOT use a pine color. Solid counts MUST stay 48 pines, 80 pines, and 36 rocks.

#### Scenario: Snow chunk lists mounds and shrubs
- **WHEN** the cover of snow chunk 0 is read
- **THEN** it has 24 mounds and 16 shrubs, and each mesh uses its cover color

#### Scenario: Forest and rock cover stay on their places
- **WHEN** the cover of forest chunk 0 and rock chunk 0 is read
- **THEN** the forest has 40 undergrowth cones and 12 stumps, and the rock has 28 rubble pieces and does not contain `[0.92, 0.93, 0.9]` or `[0.16, 0.32, 0.2]`

### Requirement: Cover stays off the solids and the road
Cover spots MUST be disjoint from the solid spots. Each cover spot MUST be at least 10 m from the start and off the road by the solid clearance of that place.

#### Scenario: Snow cover misses the pines and the road
- **WHEN** the snow cover of chunk 0 is compared with the snow solids
- **THEN** no cover position matches a solid, and each cover spot clears the start and the road

### Requirement: Cover does not stop the car
A cover prop MUST NOT add a hit circle. The circles that stop the car MUST still come from the solid pines and rocks only.

#### Scenario: A mound is not a solid
- **WHEN** the hit circles for a snow chunk are collected
- **THEN** every circle is a solid pine or rock, and no mound or shrub position is among them
