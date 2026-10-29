# Spec Delta

## Purpose

Pulls the three-quarter camera farther from the car so the car is smaller and more of the field is in view, without changing the pitch or the yaw.

## ADDED Requirements

### Requirement: Farther three-quarter camera
While the field is being driven, the camera SHALL stay about twice as far from the car as the 28 m high, 18 m back pose, and MUST keep a pitch of about 51 degrees above the horizon. The camera yaw MUST stay locked to the world. The car MUST stay in the lower half and near the horizontal center.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** the car is smaller in the frame than under the 28 m pose, still in the lower half, and ground farther from the camera is higher on the screen

#### Scenario: Car changes heading
- **WHEN** the car changes heading
- **THEN** the camera distance and yaw stay the same and the car rotates on screen
