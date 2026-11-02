# Spec Delta

## Purpose

Makes the speed and the Menu button readable on both the night road and the day snow.

## ADDED Requirements

### Requirement: The plate follows the time
At night the speed and Menu MUST use cream type `#f3ecdf` on a plate `#0d1018`. In day they MUST use dark type `#1b1b1d` on a plate `#f3ecdf`. The day plate MUST be present while the car is driving after Day was selected.

#### Scenario: Night keeps the dark plate
- **WHEN** the page is on the initial night choice
- **THEN** the speed and Menu rules use `#f3ecdf` on `#0d1018`

#### Scenario: Day keeps the cream plate on the drive
- **WHEN** Day is selected and a place starts
- **THEN** the page is marked `is-day`, and the speed and Menu rules use `#1b1b1d` on `#f3ecdf`

### Requirement: The gear is smaller than the speed
The readout MUST show the gear as its own mark and the speed, in km/h, as its own mark. The gear mark MUST use a smaller font size than the speed mark. The numbers MUST stay the gear count from 1 and the speed in km/h.

#### Scenario: Gear three at 10 m/s
- **WHEN** the readout is built for gear index 2 and 10 m/s
- **THEN** the gear mark is 3, the speed mark is 36 km/h, and the gear font size is smaller than the speed font size

### Requirement: Menu has room around the word
The Menu button MUST keep the label Menu and MUST have at least `0.7rem 1.1rem` of padding. It MUST still return to Stages, and Escape MUST still return to Stages.

#### Scenario: The button is padded
- **WHEN** the Menu rule is read
- **THEN** it sets padding of at least `0.7rem 1.1rem` and the button text is Menu
