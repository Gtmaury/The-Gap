# Spec Delta

## Purpose

Gives each level card its own ground so snow, forest, and rock are not one shared navy box.

## ADDED Requirements

### Requirement: Each card has its own ground
At night the snow card MUST gradient from `#1c2838` to `#c5d0dc`, the forest card from `#0c1610` to `#1e3a24`, and the rock card from `#16161a` to `#3a3a40`. In day the snow card MUST gradient from `#9bb4c9` to `#eef3f7`, the forest card from `#4e7a5c` to `#d5e6d8`, and the rock card from `#7a7a82` to `#d4d4d8`. The snow cap, the forest trunk and greens, and the rock stone MUST stay.

#### Scenario: Night cards use three grounds
- **WHEN** the night card rules are read
- **THEN** snow includes `#1c2838` and `#c5d0dc`, forest includes `#0c1610` and `#1e3a24`, and rock includes `#16161a` and `#3a3a40`

#### Scenario: Day cards are lighter
- **WHEN** the day card rules are read
- **THEN** snow includes `#9bb4c9` and `#eef3f7`, forest includes `#4e7a5c` and `#d5e6d8`, and rock includes `#7a7a82` and `#d4d4d8`

### Requirement: Cards sit above the road
Each card MUST use a `12px` corner and MUST stack above the road shape. Hover MUST lift a card by `6px`. The keyboard focus outline MUST stay.

#### Scenario: A card is rounded and lifts
- **WHEN** the place card rules are read
- **THEN** they include `border-radius: 12px`, a z-index above the road, `translateY(-6px)` on hover, and a focus outline
