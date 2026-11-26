# Changelog

All notable changes to this card are listed here.
Versions follow [Semantic Versioning](https://semver.org): MAJOR.MINOR.PATCH.

- **MAJOR**: a change that breaks existing card configurations.
- **MINOR**: new features, existing configurations keep working.
- **PATCH**: bug fixes only.

## [0.3.0] - 2026-11-26

### Added

- ⓘ button next to the title: shows an explanation of the colors and the drawing inside the card (English and Dutch).
  Can be turned off with `help: false` or in the editor.
- Thermostat button on the corner of every indoor unit that opens the climate controls.
  Its thermometer shows the color of the unit's status.

## [0.2.0] - 2026-11-26

### Added

- Visual editor: set everything in the dashboard editor. Under every sensor field it shows
  which sensor was found automatically.
- Tapping the indoor unit (including its temperatures), the title or the status chip opens the climate dialog.
- HACS validation workflow.

### Changed

- README: explanation of the colors, air streaks, refrigerant lines, all values, tiles, timeline and alerts,
  plus a troubleshooting section.

## [0.1.0] - 2026-11-26

### Added

- First release.
- Animated outdoor unit: spinning fan, humming compressor, frosted coil and snowflake during defrost.
- Refrigerant flow between outdoor and indoor unit, reversing when cooling or defrosting.
- Indoor units with a spinning fan and air streaks that follow fan speed and vane position.
- Tiles: power, energy today, estimated COP, compressor, defrosts today and filter counters.
- Timeline of the last 24 hours: heating, cooling, defrost and standby.
- Up to two indoor units on one outdoor unit.
- Automatic entity discovery for MHI-AC-Ctrl (ESPHome).
- English labels, with a Dutch translation (`language: nl`).
