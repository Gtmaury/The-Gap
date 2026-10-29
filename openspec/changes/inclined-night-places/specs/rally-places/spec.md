# Spec Delta

## Purpose

Gives the night drive three endless places, each with its own ground, scenery, and grip.

## ADDED Requirements

### Requirement: The page starts on night snow
The game SHALL provide night snow, night forest, and night rock. Each place SHALL be an endless band 180 m wide that repeats along world `z`. The page MUST start on night snow. There MUST be no road, finish, stage menu, timer, or result.

#### Scenario: Start
- **WHEN** the page loads
- **THEN** the car is stopped on night snow and snow continues past 90 m ahead

### Requirement: Each place has its own ridge and grip
Night snow MUST keep an uphill grade at the start, a lower height 45 m behind the start, and a repeat of 180 m. Night forest MUST be gentler at the start than night snow and MUST give a stronger throttle response on the same slope. Night rock MUST be steeper at the start than night snow and MUST give a weaker throttle response on the same slope. Height one repeat ahead MUST match on every place.

#### Scenario: The ridges differ
- **WHEN** the uphill grade at each start is compared
- **THEN** night forest is gentler than night snow and night rock is steeper than night snow

#### Scenario: Grip differs on the same slope
- **WHEN** the car throttles from rest on the same slope in each place
- **THEN** night forest gains speed faster than night snow and night rock gains speed slower than night snow

### Requirement: Scenery matches the place
Night snow MUST show trees and no rocks. Night forest MUST show more trees per repeat than night snow and no rocks. Night rock MUST show rocks. The first repeat of every place MUST keep scenery at least 10 m from the start and MUST place at least one prop ahead of the start. The same repeat MUST always place the same props. A tree or a rock MUST NOT stop or deflect the car.

#### Scenario: Forest has more trees
- **WHEN** one repeat of night forest is compared with one repeat of night snow
- **THEN** the forest has more trees and neither repeat has a rock

#### Scenario: The car drives through scenery
- **WHEN** the car drives through a tree or a rock
- **THEN** its speed and heading stay what the drive step would produce with no scenery

### Requirement: Number keys change the place
Key `1` MUST restart on night snow, key `2` on night forest, and key `3` on night rock. Key `R` MUST restart the current place. The view MUST show that place's ground and scenery after the switch.

#### Scenario: Switch to the forest
- **WHEN** the player presses `2`
- **THEN** the car is stopped at the night forest start and the ground is the forest color
