# Spec Delta

## Purpose

Makes the Stages poster and its three cards follow Day or Night and the place they open.

## ADDED Requirements

### Requirement: The poster follows the time
Night MUST keep the menu background `#0d1018` and a visible moon. Day MUST hide the moon and set the menu background to `#a3c2e0`. The `is-day` mark MUST remain after Menu returns from a day drive.

#### Scenario: Day hides the moon
- **WHEN** Day is selected on Stages
- **THEN** the page is marked `is-day`, the moon is hidden, and the menu background is `#a3c2e0`

#### Scenario: Returning from a day drive keeps the day poster
- **WHEN** a day drive returns to Stages
- **THEN** the page is still marked `is-day` and the moon stays hidden

### Requirement: The cards name the place
The three place buttons MUST read Snow, Forest, and Rock. They MUST NOT read Night snow, Night forest, or Night rock.

#### Scenario: The labels drop the word Night
- **WHEN** the Stages page is read
- **THEN** the place buttons contain Snow, Forest, and Rock, and they do not contain Night snow

### Requirement: Each card draws its place
The snow card MUST use body `#295233` and cap `#ebede6`. The forest card MUST use trunk `#47291a`, lower green `#1a471f`, and upper green `#2e6629`. The rock card MUST use stone `#29292b` and MUST NOT use the snow body `#295233`.

#### Scenario: Snow wears a cap and rock stays stone
- **WHEN** the three place cards are read
- **THEN** snow includes `#295233` and `#ebede6`, forest includes `#47291a`, `#1a471f`, and `#2e6629`, and rock includes `#29292b` and does not include `#295233`
