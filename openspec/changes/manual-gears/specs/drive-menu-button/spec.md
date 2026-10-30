# Spec Delta

## Purpose

Gives the drive a button that returns to the level menu and stops the car.

## ADDED Requirements

### Requirement: The drive shows a Menu button
While a place is being driven, the page SHALL show a Menu button. The button MUST use the level menu's night colors and flat type. It MUST be hidden while the level menu is open.

#### Scenario: The button is absent on the menu
- **WHEN** the level menu is open
- **THEN** the Menu button is hidden

#### Scenario: The button appears with the drive
- **WHEN** the player starts a place
- **THEN** the Menu button is visible

### Requirement: The button returns to the level menu
Clicking the Menu button SHALL show the level menu and stop the drive. The car MUST NOT keep moving. Escape MUST keep doing the same thing.

#### Scenario: A click freezes the drive
- **WHEN** the player clicks the Menu button during a drive
- **THEN** the level menu is visible, the Menu button is hidden, and the car no longer advances
