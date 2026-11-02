# finish-call Specification

## Purpose

Announces the finish on the drive plate so the time is readable without leaving the road.

## Requirements

### Requirement: The plate announces the finish
When the run finishes, the plate MUST show the word Finish and the stopped time. The gear and the speed MUST be hidden. The time MUST use the same type color as the speed mark. Further driving time MUST NOT increase the shown time.

#### Scenario: Finish at 21 seconds
- **WHEN** the run finishes at 21 seconds
- **THEN** the plate shows Finish and `0:21`, and it does not show the gear or `0 km/h`

#### Scenario: The time holds on the plate
- **WHEN** the plate shows Finish at `0:21` and another second passes
- **THEN** the plate still shows `0:21`

### Requirement: Menu and the card stay
Menu MUST still return to Stages. The finished time MUST still be that place's best time when it is the fastest. Restart MUST run the count again, MUST return the clock to `0:00`, and MUST keep the best time already on the card.

#### Scenario: Menu after the gate
- **WHEN** the plate shows Finish and the driver chooses Menu
- **THEN** Stages is showing and that place's card shows the finish time

#### Scenario: Restart keeps the card
- **WHEN** snow's card shows `0:21` and the attempt restarts
- **THEN** the plate shows 3, the clock shows `0:00`, and the snow card still shows `0:21`
