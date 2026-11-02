# Spec Delta

## Purpose

Shows how long the current attempt has taken, and keeps the best finish for each place on Stages.

## ADDED Requirements

### Requirement: The bar shows whole seconds
The drive bar MUST show the elapsed time as `m:ss` beside the gear and the speed. The time MUST start at `0:00` when the place starts and MUST count in whole seconds. Twelve seconds MUST read `0:12`. Seventy-five seconds MUST read `1:15`. The time mark MUST use the same type color as the speed mark.

#### Scenario: Twelve seconds on the bar
- **WHEN** the place has been running for 12 seconds and the run is not finished
- **THEN** the bar shows `0:12` beside the gear and the speed

#### Scenario: Seventy-five seconds on the bar
- **WHEN** the elapsed time is formatted at 75 seconds
- **THEN** the text is `1:15`

### Requirement: The clock stops on the gate
When the run finishes, the shown time MUST stay on the second it reached. Further driving time MUST NOT increase it.

#### Scenario: The time holds after the gate
- **WHEN** the run finishes at 12 seconds and another second passes
- **THEN** the bar still shows `0:12`

### Requirement: Each place keeps its best finish
After a finish, that place's Stages card MUST show the finish time. The first finish MUST set it. A slower finish MUST leave the previous time. A faster finish MUST replace it. The other places MUST stay unchanged. A card with no finish MUST show an em dash. Leaving for Stages before a finish MUST NOT record a time. The times MUST last while the page stays open.

#### Scenario: A slower second run keeps the first time
- **WHEN** snow finishes in 12 seconds and a later snow finish takes 20 seconds
- **THEN** the snow card shows `0:12` and forest and rock still show an em dash

#### Scenario: A faster run replaces the card
- **WHEN** snow's best time is 20 seconds and a later snow finish takes 12 seconds
- **THEN** the snow card shows `0:12`

#### Scenario: Menu before the gate records nothing
- **WHEN** the driver returns to Stages before crossing the gate
- **THEN** that place's card still shows an em dash

### Requirement: Restart keeps the best time
Restarting the attempt MUST set the bar back to `0:00`, MUST let the car drive again, and MUST keep the best time already shown for that place.

#### Scenario: Restart after a finish
- **WHEN** snow has a best time of `0:12` and the attempt restarts
- **THEN** the bar shows `0:00`, the car accepts accelerate, and the snow card still shows `0:12`
