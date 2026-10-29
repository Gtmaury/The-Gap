# Spec Delta

## Purpose

Keeps the car near the middle of a nearly top-down view so the field around it, and the ground just ahead, stay on screen.

## ADDED Requirements

### Requirement: Car stays near the center
While the field is being driven, the camera SHALL show the car from above and MUST keep the car near the center of the view. The ground immediately ahead of the car MUST also stay visible.

#### Scenario: Field is being driven
- **WHEN** the open field is being driven
- **THEN** the car is visible from above near the center of the view and ground ahead of the car is also visible

### Requirement: View follows the heading
When the car changes heading, the view SHALL turn with it so the ground ahead of the new heading stays visible and the car stays near the center.

#### Scenario: Car turns
- **WHEN** the car changes heading while the field is being driven
- **THEN** the view turns with the car, the car remains near the center, and ground ahead of the new heading stays visible
