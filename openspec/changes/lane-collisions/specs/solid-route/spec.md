# Spec Delta

## Purpose

Gives every place a repeating route the car can slide along but cannot leave or drive through.

## ADDED Requirements

### Requirement: A route runs through every place
Every place SHALL show a route about 14 m wide, colored apart from the surrounding ground. The route MUST bend and MUST repeat along world `z`. The start MUST lie on the route. Trees and rocks MUST stay off the route.

#### Scenario: The route continues
- **WHEN** the car drives forward past 90 m
- **THEN** the route is still under the car and still ahead of the car

#### Scenario: The lane is clear
- **WHEN** scenery for a repeat is placed
- **THEN** no tree or rock stands on the route, and the same repeat always places the same scenery

### Requirement: The car slides along solids
The route edges, trees, and rocks SHALL be solid. When the car overlaps one, it MUST be pushed out and MUST keep only the speed that runs along that surface. The car MUST NOT take damage, flip, or be reset by the hit. A tree or a rock MUST NOT be driven through.

#### Scenario: The car meets a wall
- **WHEN** the car drives into a route edge
- **THEN** it stays inside the route and keeps moving along that edge

#### Scenario: The car meets a tree
- **WHEN** the car drives into a tree or a rock
- **THEN** it stops moving into that solid and does not pass through it
