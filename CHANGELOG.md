# Changelog

All notable changes to this card are listed here.
Versions follow [Semantic Versioning](https://semver.org): MAJOR.MINOR.PATCH.

- **MAJOR**: a change that breaks existing card configurations.
- **MINOR**: new features, existing configurations keep working.
- **PATCH**: bug fixes only.

## [0.4.0] - 2026-11-26

### Added

- Left/right vanes (`vanes_lr`, found automatically for MHI-AC-Ctrl): the air streaks tilt left, center or right,
  fan out with *Wide*, bundle with *Spot* and sweep from left to right with swing.

### Changed

- Up/down vanes now set how far the air streaks reach: short for *Up*, long for *Down*.
  With swing the streaks get longer and shorter in turn. Before, up/down was shown as a sideways tilt.
- Animated preview shows both vane directions.

## [0.3.4] - 2026-11-26

### Fixed

- Two indoor units on one outdoor unit: refrigerant only flows to an indoor unit that is on.
  Each line now has the color and direction of its own unit.
- The grey pipe of the second indoor unit no longer hides the flow of the first on the shared part.

## [0.3.3] - 2026-11-26

### Fixed

- Mobile: the header wraps neatly on narrow screens. The title and the ⓘ button stay together,
  the status moves to the next line when there is not enough room.

### Changed

- Notices have their own row under the title. A protection control (the unit limits itself, usually normal in cold weather)
  is shown in amber; red is kept for real faults (error code, "... anomaly", "Current cut", "Stop by ...").
- The ⓘ explanation includes what the amber and red notices mean.

## [0.3.2] - 2026-11-26

### Fixed

- Title hidden behind the ⓘ button in a narrow card with a long alert chip
  (for example *Protection: Low pressure protection control*). The chips now move to their own line.

## [0.3.1] - 2026-11-26

### Changed

- Editor: the help text of *Airflow per fan speed* explains how the values map to the fan speeds (MHI-AC-Ctrl: 2 = ULo … 5 = Hi).
- README: animated preview, step-by-step filter counter guide with cleaning interval and reminder automation,
  and how to take the airflow from the datasheet.

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
