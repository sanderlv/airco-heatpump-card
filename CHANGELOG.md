# Changelog

All notable changes to this card are listed here.
Versions follow [Semantic Versioning](https://semver.org): MAJOR.MINOR.PATCH.

- **MAJOR**: a change that breaks existing card configurations.
- **MINOR**: new features, existing configurations keep working.
- **PATCH**: bug fixes only.

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
