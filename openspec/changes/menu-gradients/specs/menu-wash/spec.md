# Spec Delta

## Purpose

Gives the Stages poster a sky gradient and marks the chosen time and car with a filled pill.

## ADDED Requirements

### Requirement: The poster is a sky gradient
Night MUST paint `#menu` with a gradient from `#0d1018` to `#1b2433`. Day MUST paint `#menu` with a gradient from `#a3c2e0` to `#d5e4f2`. Day MUST still hide the moon.

#### Scenario: Night starts dark and day starts at the sky
- **WHEN** the night and day menu rules are read
- **THEN** night includes `#0d1018` and `#1b2433`, day includes `#a3c2e0` and `#d5e4f2`, and the day moon rule is `display: none`

### Requirement: The chosen time and car are pills
The selected Night, Day, Hatch, Coupe, or Wagon control MUST use a filled background. At night that fill MUST be `#f3ecdf` with type `#1b1b1d`. In day that fill MUST be `#1b1b1d` with type `#f3ecdf`. An unselected control MUST stay transparent.

#### Scenario: Night pill is cream and day pill is dark
- **WHEN** the selected choice rules are read
- **THEN** the night selected rule uses background `#f3ecdf` and color `#1b1b1d`, and the day selected rule uses background `#1b1b1d` and color `#f3ecdf`
