# Spec Delta

## Purpose

Lets the player choose a gear, and lets W fill only the speed that gear allows.

## ADDED Requirements

### Requirement: The drive starts in gear 1
A new drive SHALL start in gear 1. The gears are 1 through 7. Their top speeds are 8, 12, 16, 20, 24, 28, and 32 m/s. Their pulls, before grip and slope, are 22, 18, 15, 12, 10, 8, and 6 m/s². W MUST accelerate only up to the selected gear's top speed. Grip and slope MUST still change that pull.

#### Scenario: First gear stops at 8 m/s
- **WHEN** the car starts from rest on flat ground in gear 1 and W is held for one second
- **THEN** forward speed is greater than 0 and at most 8 m/s

#### Scenario: A high gear pulls less than first gear
- **WHEN** the same flat throttle is applied for 0.2 s in gear 1 from rest and in gear 7 from 24 m/s
- **THEN** gear 1 gains more speed than gear 7

### Requirement: The arrows select one gear per press
The up arrow SHALL select the next higher gear, and the down arrow SHALL select the next lower gear. One press MUST move exactly one gear. Holding the key MUST NOT move another gear until it is released and pressed again. The up arrow MUST NOT accelerate the car. The down arrow MUST NOT brake the car. W MUST remain the accelerator and S the brake. A, D, and the left and right arrows MUST still steer.

#### Scenario: One press raises the top speed by 4 m/s
- **WHEN** the player presses the up arrow once in gear 1
- **THEN** the car is in gear 2 and the top speed is 12 m/s

#### Scenario: A held arrow does not run through the box
- **WHEN** the up arrow stays down across later steps without being released
- **THEN** the gear does not change again

### Requirement: A downshift cuts speed to the new top
If the car is faster than the newly selected gear's top speed, forward speed MUST drop to that top speed on the shift.

#### Scenario: Dropping from gear 2 at 12 m/s
- **WHEN** the car is in gear 2 at 12 m/s and the player shifts to gear 1
- **THEN** forward speed is 8 m/s

### Requirement: The readout shows the gear
During a drive the speed line SHALL show the gear number, then the speed in km/h rounded to the nearest whole number. At 10 m/s in gear 3 the line MUST read `3 36 km/h`. The level menu MUST hide the line.

#### Scenario: Gear 3 at 10 m/s
- **WHEN** the car is moving at 10 m/s in gear 3 during a drive
- **THEN** the readout shows `3 36 km/h`
