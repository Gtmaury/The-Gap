# Spec Delta

## Purpose

Opens the rally on an art menu so the player can choose a night place before driving.

## ADDED Requirements

### Requirement: The page opens on the menu
The first view SHALL be the level menu. The car MUST NOT move until a place is chosen. The menu MUST offer night snow, night forest, and night rock.

#### Scenario: Nothing drives before a choice
- **WHEN** the page loads
- **THEN** the menu is visible and the car stays still

### Requirement: A choice starts that place
Choosing a place SHALL hide the menu and start the drive on that place, with that place's ground and scenery. Keys `1`, `2`, and `3` MUST select night snow, night forest, and night rock. A pointer choice on the same entry MUST do the same.

#### Scenario: The second place starts the forest
- **WHEN** the player chooses night forest
- **THEN** the menu hides and the drive starts on the forest ground with forest trees

### Requirement: Escape returns to the menu
Escape SHALL show the menu again and stop the drive. The car MUST NOT keep moving behind the menu.

#### Scenario: Escape freezes the drive
- **WHEN** the player presses Escape during a drive
- **THEN** the menu is visible and the car no longer advances

### Requirement: The menu is low-poly art
The menu SHALL be drawn with flat night shapes: a dark sky, a road, and the trees or rocks of the places. It MUST NOT be a plain text form or a browser dialog.

#### Scenario: Each place shows its own shapes
- **WHEN** the three places are listed
- **THEN** snow and forest show trees, rock shows rocks, and the panel uses the night colors of the drive
