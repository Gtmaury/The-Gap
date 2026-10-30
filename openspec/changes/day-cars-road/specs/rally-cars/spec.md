# Spec Delta

## Purpose

Lets the player choose among three low-poly cars before a drive.

## ADDED Requirements

### Requirement: The menu offers three cars
The level menu SHALL offer Hatch, Coupe, and Wagon. The page MUST open with Hatch selected. Starting a place MUST use the selected car. Returning to the menu MUST keep that choice.

#### Scenario: The page opens on the hatch
- **WHEN** the page loads
- **THEN** Hatch is the selected car

#### Scenario: The coupe stays selected
- **WHEN** the player selects Coupe, starts a place, and returns to the menu
- **THEN** Coupe is still the selected car

### Requirement: The cars differ in shape and color
Hatch SHALL be the current silver body `[0.9, 0.9, 0.92]`. Coupe MUST be lower and longer, colored `[0.75, 0.18, 0.16]`. Wagon MUST be taller at the back, colored `[0.18, 0.28, 0.48]`. The collision circle MUST stay 1.1 m. Gears and grip MUST stay the same for every car.

#### Scenario: The coupe body is not the hatch body
- **WHEN** the coupe mesh is compared with the hatch mesh
- **THEN** the body colors differ and the coupe extends farther forward

#### Scenario: A hit still uses the same circle
- **WHEN** any of the three cars drives into a tree
- **THEN** the car stops at the same 1.1 m circle
