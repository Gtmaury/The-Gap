# Spec Delta

## Purpose

Shows the restaurant hub between counter mini-games: one order, the stations for that dish, and the plate rating when the player returns.

## ADDED Requirements

### Requirement: Hub shows the current service
The hub MUST show the cook's waiting face, one order named "garden skillet", and the three stations chop, stir, and flip. The hub MUST NOT show a dining room, tables, or customers.

#### Scenario: Opening the game
- **WHEN** the player opens the kitchen game
- **THEN** the hub shows the waiting face, the garden skillet order, and the three stations, with only chop available

#### Scenario: No dining room
- **WHEN** the hub is on screen
- **THEN** the screen contains no dining room, tables, or customer figures

### Requirement: Stations open in order
The hub MUST keep stir locked until chop has a grade, and MUST keep flip locked until stir has a grade. A graded station MUST stay graded.

#### Scenario: Stir stays locked
- **WHEN** chop has no grade
- **THEN** the player cannot start stir

#### Scenario: Flip opens after stir
- **WHEN** stir receives a grade and flip has none
- **THEN** flip becomes available and stir keeps its grade

### Requirement: Plate rating
When chop, stir, and flip each have a grade, the hub MUST show one plate rating: perfect if every grade is perfect, good if no grade is miss, and miss if any grade is miss.

#### Scenario: Perfect plate
- **WHEN** the player returns to the hub after perfect grades on chop, stir, and flip
- **THEN** the hub shows a perfect plate rating

#### Scenario: Miss plate
- **WHEN** the player returns to the hub and any station grade is miss
- **THEN** the hub shows a miss plate rating

#### Scenario: Good plate
- **WHEN** the player returns to the hub and every station is graded, none are miss, and at least one is good
- **THEN** the hub shows a good plate rating
