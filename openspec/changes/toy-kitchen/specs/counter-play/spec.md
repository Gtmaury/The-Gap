# Spec Delta

## Purpose

Plays each station as a timed close-up of the cook's hands on one tool and one ingredient, then shows a face and returns to the hub with a grade.

## ADDED Requirements

### Requirement: Close-up station
Each station MUST show the cook's hands, one tool, and one ingredient on the counter. Chop MUST show a knife and a vegetable with three cut marks. Stir MUST show a pot and a circular guide. Flip MUST show a pan and the food in it.

#### Scenario: Starting chop
- **WHEN** the player starts chop from the hub
- **THEN** the screen shows hands, a knife, and a vegetable with three cut marks, and hides the hub

#### Scenario: Starting stir
- **WHEN** the player starts stir from the hub
- **THEN** the screen shows hands, a pot, and a circular guide

#### Scenario: Starting flip
- **WHEN** the player starts flip from the hub
- **THEN** the screen shows hands, a pan, and the food in the pan

### Requirement: Station timer
Each station MUST run a visible timer that starts when the station opens. The station MUST grade as miss when the timer ends before the gesture is complete.

#### Scenario: Timer expires
- **WHEN** the station timer reaches the end before the gesture is complete
- **THEN** the station grade is miss

### Requirement: Chop grade
Chop MUST grade perfect when the player crosses all three marks from left to right before the timer ends. It MUST grade good when all three marks are crossed before the timer ends in any other order. It MUST grade miss when the timer ends with a mark uncrossed.

#### Scenario: Perfect chop
- **WHEN** the player crosses the three marks from left to right before the timer ends
- **THEN** the chop grade is perfect

#### Scenario: Out-of-order chop
- **WHEN** the player crosses all three marks before the timer ends, and not from left to right
- **THEN** the chop grade is good

### Requirement: Stir grade
Stir MUST grade perfect when the player traces one full circle along the guide in the shown direction before the timer ends. It MUST grade good when the player completes one full circle before the timer ends without staying on the guide or in that direction. It MUST grade miss when the timer ends before a full circle.

#### Scenario: Perfect stir
- **WHEN** the player traces one full circle along the guide in the shown direction before the timer ends
- **THEN** the stir grade is perfect

#### Scenario: Loose stir
- **WHEN** the player completes one full circle before the timer ends, off the guide or against the shown direction
- **THEN** the stir grade is good

### Requirement: Flip grade
Flip MUST show a short target window during the timer. It MUST grade perfect when the player flicks upward from the pan and releases during that window. It MUST grade good when the flick is released before the timer ends and outside that window. It MUST grade miss when the timer ends without a completed flick.

#### Scenario: Perfect flip
- **WHEN** the player flicks upward from the pan and releases during the target window
- **THEN** the flip grade is perfect

#### Scenario: Early or late flip
- **WHEN** the player completes an upward flick from the pan before the timer ends and outside the target window
- **THEN** the flip grade is good

### Requirement: Result beat
After a station is graded, the game MUST show the cook's face for a short beat before the hub. Perfect MUST show the proud face, good MUST show the pleased face, and miss MUST show the upset face. The hub MUST then show that station's grade.

#### Scenario: Proud return
- **WHEN** a station grade is perfect
- **THEN** the proud face is shown, and afterward the hub shows that station as perfect
