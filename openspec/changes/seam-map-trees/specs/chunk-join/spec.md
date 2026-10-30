# Spec Delta

## Purpose

Keeps the ground and the road closed where one 180 m span meets the next.

## ADDED Requirements

### Requirement: The join stays covered
The ground and the road MUST cover the plane where one 180 m span meets the next. Coverage MUST extend at least 4 m to either side of that plane. The driven path, the road half-width, and the car's hit circle MUST stay as they are.

#### Scenario: Both spans cover the join
- **WHEN** the span ending at z = 90 is compared with the span starting at z = 90
- **THEN** each span's ground and road include points at z = 86 and at z = 94
