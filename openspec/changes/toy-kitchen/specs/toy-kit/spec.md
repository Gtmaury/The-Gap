# Spec Delta

## Purpose

Keeps the hub and every counter station in one toy-kitchen look: the same palette, outline, hands, counter, and cook's face.

## ADDED Requirements

### Requirement: Shared palette
The hub and every station MUST paint fills only from cream `#f6e7c1`, tomato `#e23d28`, leaf `#3f8f4e`, butter `#f2c14e`, and wood `#c9843f`. Outlines MUST use brown `#5c3317`. The hub background MUST be cream. The station counter MUST be wood.

#### Scenario: Station colors
- **WHEN** chop, stir, or flip is on screen
- **THEN** every fill is one of the five palette colors and every outline is brown `#5c3317`

#### Scenario: Hub background
- **WHEN** the hub is on screen
- **THEN** the background is cream `#f6e7c1` and the counter is not shown

### Requirement: Shared hands and face
Chop, stir, and flip MUST use the same three hand poses: rest, acting, and follow-through. The game MUST use one cook face with four expressions: waiting, proud, pleased, and upset. The hub MUST show the waiting face until a result beat replaces it.

#### Scenario: Same hands on every station
- **WHEN** the player opens chop, then stir, then flip
- **THEN** each station uses the same rest, acting, and follow-through hand poses

#### Scenario: Waiting face on the hub
- **WHEN** the hub is shown and no result beat is playing
- **THEN** the cook's face is the waiting expression

### Requirement: Simple food shapes
Each ingredient MUST be drawn as a circle, a wedge, or a strip. Each ingredient MUST have one highlight shape and one shadow shape. Food, tools, hands, and the timer mark MUST share the same outline thickness.

#### Scenario: Ingredient parts
- **WHEN** a station shows its ingredient
- **THEN** that ingredient is a circle, wedge, or strip with one highlight and one shadow

#### Scenario: Matching outlines
- **WHEN** a station shows food, a tool, hands, and the timer together
- **THEN** those outlines use one thickness
