/**
 * Airco Heat Pump Card
 * Animated Lovelace card for air-to-air heat pumps (split air conditioners).
 * Made for MHI-AC-Ctrl (ESPHome), but every entity can also be set by hand.
 *
 * https://github.com/sanderlv/airco-heatpump-card
 * MIT License
 */

const CARD_VERSION = "0.3.4";
const CARD_TAG = "airco-heatpump-card";

// ---------------------------------------------------------------------------
// Texts
// ---------------------------------------------------------------------------

const TEXTS = {
  en: {
    heat: "Heating",
    cool: "Cooling",
    dry: "Drying",
    fan: "Fan only",
    auto: "Auto",
    defrost: "Defrost",
    standby: "Standby",
    off: "Off",
    unavailable: "Unavailable",
    outdoor: "Outdoor",
    coil: "Coil",
    discharge: "Discharge",
    superheat: "Superheat",
    exp_valve: "Exp. valve",
    protection: "Protection",
    target: "target",
    power: "Power",
    today: "Today",
    cop: "COP ≈",
    heat_out: "heat ≈",
    cool_out: "cooling ≈",
    compressor: "Compressor",
    total: "total",
    defrost_today: "Defrost today",
    help: "Explanation",
    help_colors: "Colors",
    help_drawing: "Drawing",
    help_heat: "The compressor runs and delivers heat.",
    help_cool: "The compressor runs and cools the room.",
    help_dry: "The compressor runs and removes moisture from the air.",
    help_auto: "The unit picks heating or cooling by itself.",
    help_fan: "Only the indoor fan runs.",
    help_standby: "On, but the compressor is idle: the room is at its setpoint.",
    help_defrost: "The outdoor unit melts frost off its coil. The indoor fan stops.",
    help_streaks: "Air streaks: speed follows the indoor fan, direction follows the vanes.",
    help_lines: "Moving dashes: refrigerant flows while the compressor runs. Thick line = gas, thin line = liquid. The flow reverses when cooling or defrosting.",
    help_snow: "Snowflake on the outdoor unit: defrost.",
    help_cop: "COP ≈ is an estimate, not a measurement.",
    help_tap: "Tap the thermostat button on the indoor unit for the controls, any other part for its history.",
    thermostat: "Thermostat",
    help_notice: "Amber notice: the unit limits itself for a while to protect the compressor (protection control), usually normal in cold weather. Red notice: a fault.",
    last: "last",
    filter: "Filter",
    filter_tap: "tap after cleaning",
    filter_due: "clean filter",
    filter_confirm: "Filter of {name} cleaned? This resets the counter.",
    estimate: "Estimate: airflow × air temperature rise. Not a measurement.",
    last_hours: "Last {h} hours",
    now: "now",
    error: "Error",
    days: "d",
    hours: "h",
    min: "min",
  },
  nl: {
    heat: "Verwarmen",
    cool: "Koelen",
    dry: "Drogen",
    fan: "Ventileren",
    auto: "Auto",
    defrost: "Defrost",
    standby: "Stand-by",
    off: "Uit",
    unavailable: "Niet beschikbaar",
    outdoor: "Buiten",
    coil: "Wisselaar",
    discharge: "Persgas",
    superheat: "Oververhitting",
    exp_valve: "Exp.ventiel",
    protection: "Beveiliging",
    target: "doel",
    power: "Vermogen",
    today: "Vandaag",
    cop: "COP ≈",
    heat_out: "warmte ≈",
    cool_out: "koeling ≈",
    compressor: "Compressor",
    total: "totaal",
    defrost_today: "Defrost vandaag",
    help: "Uitleg",
    help_colors: "Kleuren",
    help_drawing: "Tekening",
    help_heat: "De compressor draait en levert warmte.",
    help_cool: "De compressor draait en koelt de kamer.",
    help_dry: "De compressor draait en haalt vocht uit de lucht.",
    help_auto: "De unit kiest zelf tussen verwarmen en koelen.",
    help_fan: "Alleen de binnenventilator draait.",
    help_standby: "Aan, maar de compressor staat stil: de kamer is op temperatuur.",
    help_defrost: "De buitenunit ontdooit zijn wisselaar. De binnenventilator staat stil.",
    help_streaks: "Luchtstrepen: de snelheid volgt de binnenventilator, de richting volgt de lamellen.",
    help_lines: "Bewegende streepjes: koudemiddel stroomt zolang de compressor draait. Dikke leiding = gas, dunne = vloeistof. Bij koelen en defrost draait de stroom om.",
    help_snow: "Sneeuwvlok op de buitenunit: defrost.",
    help_cop: "COP ≈ is een schatting, geen meting.",
    help_tap: "Tik op het thermostaatknopje van de binnenunit voor de bediening, op de rest voor de geschiedenis.",
    thermostat: "Thermostaat",
    help_notice: "Oranje melding: de unit begrenst zichzelf even om de compressor te beschermen (protection control), meestal normaal bij kou. Rode melding: een storing.",
    last: "laatst",
    filter: "Filter",
    filter_tap: "tik na reinigen",
    filter_due: "filter reinigen",
    filter_confirm: "Filter van {name} gereinigd? De teller gaat dan naar nul.",
    estimate: "Schatting: luchtdebiet × temperatuurstijging van de lucht. Geen meting.",
    last_hours: "Afgelopen {h} uur",
    now: "nu",
    error: "Storing",
    days: "d",
    hours: "u",
    min: "min",
  },
};

// ---------------------------------------------------------------------------
// Entity discovery
//
// Given a climate entity, the card looks at the other entities of the same
// device and picks them by the end of their entity_id. A trailing "_2", "_3"
// (added by Home Assistant for duplicates) is ignored.
// ---------------------------------------------------------------------------

// Entities that belong to the outdoor unit (read from the first indoor unit).
const OUTDOOR_KEYS = {
  defrost: { label: "Defrost", domain: "binary_sensor", re: /_defrost$/ },
  outdoor_temp: { label: "Outdoor temperature", re: /_outdoor_temperature$/ },
  compressor: { label: "Compressor frequency", re: /_compressor_frequency$/ },
  outdoor_fan: { label: "Outdoor fan speed", re: /_outdoor_unit_fan_speed$/ },
  outdoor_coil: { label: "Outdoor coil temperature", re: /_outdoor_he_temp$/ },
  discharge: { label: "Discharge gas temperature", re: /_outdoor_unit_discharge_pipe$/ },
  superheat: { label: "Discharge superheat", re: /_discharge_pipe_super_heat$/ },
  exp_valve: { label: "Expansion valve", re: /_exp_valve$/ },
  protection: { label: "Compressor protection", re: /_compressor_protection_status$/ },
  compressor_hours: { label: "Compressor run hours", re: /_compressor_total_run_time$/ },
  power: { label: "Power (W)", re: /_power$/, test: (s) => s.attributes.unit_of_measurement === "W" },
  current: { label: "Current (A)", re: /_current_power$/, test: (s) => s.attributes.unit_of_measurement === "A" },
  energy_today: { label: "Energy today", re: /_(energy_today|daily_energy)$/ },
};

// Entities that belong to each indoor unit.
const INDOOR_KEYS = {
  room: { label: "Room (return air) temperature", re: /_return_air_temperature$/ },
  indoor_fan: { label: "Indoor fan speed", re: /_indoor_unit_fan_speed$/ },
  coil1: { label: "Indoor coil temperature 1 (U-bend)", re: /_u_bend_he_temp_1$/ },
  coil2: { label: "Indoor coil temperature 2 (capillary)", re: /_capillary_he_temp_2$/ },
  coil3: { label: "Indoor coil temperature 3 (suction header)", re: /_suction_header_he_temp_3$/ },
  run_hours: { label: "Indoor run hours", re: /_indoor_unit_total_run_time$/ },
  vanes: { label: "Vane position", re: /_vanes$/ },
  error: { label: "Error code", re: /_error_code$/ },
};

// Finds the entities of the table on the same device as the climate entity.
function discoverEntities(hass, climateId, table) {
  const registry = hass?.entities;
  const found = {};
  const deviceId = registry?.[climateId]?.device_id;
  if (!deviceId) return found;
  const ids = Object.values(registry)
    .filter((e) => e.device_id === deviceId)
    .map((e) => e.entity_id);
  for (const [key, rule] of Object.entries(table)) {
    const match = ids.find((id) => {
      const [domain, objectId] = id.split(".");
      if (domain !== (rule.domain || "sensor")) return false;
      const plain = objectId.replace(/_\d+$/, "");
      if (!rule.re.test(objectId) && !rule.re.test(plain)) return false;
      const st = hass.states[id];
      return !rule.test || (st && rule.test(st));
    });
    if (match) found[key] = match;
  }
  return found;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULTS = {
  language: "auto",
  animations: "auto",
  cop: true,
  timeline: true,
  help: true,
  timeline_hours: 24,
  voltage: 230,
  coil_factor: 0.7,
};

const AIR_DENSITY = 1.2; // kg/m³
const AIR_HEAT_CAPACITY = 1005; // J/(kg·K)
const DEFAULT_AIRFLOW = [300, 400, 500, 600, 660]; // m³/h for indoor fan speed 1, 2, 3, ...
const VANE_ANGLE = { 1: 60, 2: 40, 3: 20, 4: 0 }; // degrees away from straight down
const HISTORY_REFRESH_MS = 5 * 60 * 1000;
const OFF_STATES = ["off", "unavailable", "unknown"];

// Order used in the legend of the timeline.
const STATUS_ORDER = ["heat", "cool", "dry", "auto", "fan", "defrost", "standby"];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function mean(...values) {
  const nums = values.filter((v) => v != null && !Number.isNaN(v));
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

// Status of the unit from its HVAC mode and whether the compressor runs.
function statusFor(mode, running, coilWarmerThanRoom) {
  if (mode === "fan_only") return "fan";
  if (!running) return "standby";
  if (mode === "heat") return "heat";
  if (mode === "cool") return "cool";
  if (mode === "dry") return "dry";
  if (coilWarmerThanRoom == null) return "auto";
  return coilWarmerThanRoom ? "heat" : "cool";
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function clock(ms) {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ---------------------------------------------------------------------------
// SVG pieces
// ---------------------------------------------------------------------------

function blades(count, r) {
  let svg = "";
  for (let i = 0; i < count; i++) {
    svg +=
      `<path class="blade" transform="rotate(${(360 / count) * i})" ` +
      `d="M0,0 C${r * 0.2},${-r * 0.34} ${r * 0.78},${-r * 0.4} ${r},${-r * 0.06} ` +
      `C${r * 0.7},${r * 0.14} ${r * 0.3},${r * 0.12} 0,0Z"/>`;
  }
  return svg;
}

function snowflake(r) {
  let svg = "";
  for (let i = 0; i < 6; i++) {
    svg +=
      `<g transform="rotate(${60 * i})">` +
      `<line x1="0" y1="0" x2="0" y2="${-r}"/>` +
      `<polyline points="${-r * 0.28},${-r * 0.78} 0,${-r * 0.52} ${r * 0.28},${-r * 0.78}"/>` +
      `</g>`;
  }
  return svg;
}

// One column of moving air streaks. The inner group is the "vane": it tilts the column.
function airColumn(x, vaneId) {
  let svg = `<g transform="translate(${x},0)"><g class="vane" data-id="${vaneId}"><g>`;
  for (let i = 0; i < 3; i++) {
    svg += `<path d="M0,0 C3,3 -3,7 0,10" style="animation-delay: calc(var(--dur) * ${(-i / 3).toFixed(3)})"/>`;
  }
  return svg + "</g></g></g>";
}

// Positions of everything in the drawing (viewBox width is 400).
function makeLayout(count) {
  const single = count === 1;
  const out = { x: 12, y: single ? 70 : 100, w: 178, h: 120 };
  const units = single
    ? [{ x: 238, y: 30, gasY: 46, liqY: 58 }]
    : [
        { x: 238, y: 18, gasY: 34, liqY: 46 },
        { x: 238, y: 150, gasY: 178, liqY: 166 },
      ];
  return {
    height: single ? 228 : 258,
    out,
    units,
    wallX: 204,
    gasX: 216,
    liqX: 226,
    gasOut: { x: out.x + out.w, y: out.y + 32 },
    liqOut: { x: out.x + out.w, y: out.y + 48 },
  };
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const STYLE = `
  :host {
    --ahc-heat: #f97316;
    --ahc-cool: #3b82f6;
    --ahc-dry: #14b8a6;
    --ahc-auto: #a855f7;
    --ahc-fan: #94a3b8;
    --ahc-defrost: #22d3ee;
    --ahc-standby: #64748b;
    --ahc-off: #475569;
  }
  ha-card { padding: 12px 14px 14px; overflow: hidden; }
  .header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 8px; }
  .title-wrap { display: flex; align-items: center; gap: 4px; flex: 1 1 auto; min-width: 0; }
  .title { font-size: 1.15em; font-weight: 500; color: var(--primary-text-color); min-width: 0; overflow-wrap: anywhere; }
  .chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px;
    font-size: 0.85em; color: var(--primary-text-color);
    background: color-mix(in srgb, var(--st, var(--ahc-off)) 20%, transparent);
  }
  .chip { flex: none; white-space: nowrap; }
  .chip .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--st, var(--ahc-off)); }
  .notice {
    display: flex; align-items: flex-start; gap: 6px; margin-top: 6px; padding: 4px 10px; border-radius: 8px;
    font-size: 0.8em; color: var(--primary-text-color); background: color-mix(in srgb, var(--nc) 16%, transparent);
  }
  .notice .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--nc); margin-top: 0.35em; flex: none; }
  .notice.info { --nc: var(--warning-color, #f59e0b); }
  .notice.fault { --nc: var(--error-color, #ef4444); }
  .notice[hidden] { display: none; }
  .help-btn {
    display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px;
    border-radius: 50%; color: var(--secondary-text-color); cursor: pointer; flex: none;
  }
  .help-btn:hover, .help-btn.open { color: var(--primary-text-color); background: var(--secondary-background-color, #2b2b2b); }
  .help-btn svg { width: 18px; height: 18px; margin: 0; }
  .help-btn[hidden] { display: none; }
  .help { margin: 8px 0 4px; padding: 10px 12px; border-radius: 10px; background: var(--secondary-background-color, #2b2b2b); font-size: 0.8em; color: var(--primary-text-color); }
  .help[hidden] { display: none; }
  .help h4 { margin: 0 0 6px; font-size: 0.95em; font-weight: 500; color: var(--secondary-text-color); }
  .help h4 + * { margin-top: 0; }
  .help-colors { display: grid; grid-template-columns: auto 1fr; gap: 5px 10px; align-items: baseline; margin-bottom: 10px; }
  .help-colors .name { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; white-space: nowrap; }
  .help-colors .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--c); flex: none; }
  .help ul { margin: 0; padding-left: 18px; }
  .help li { margin: 3px 0; }

  svg { display: block; width: 100%; height: auto; margin-top: 4px; }
  svg text { fill: var(--primary-text-color); font-family: inherit; font-size: 11px; }
  svg .small { font-size: 9px; }
  svg .big { font-size: 16px; font-weight: 500; }
  svg .label { font-size: 12px; font-weight: 500; }
  svg .muted { fill: var(--secondary-text-color); }
  .body { fill: var(--secondary-background-color, #2b2b2b); stroke: var(--divider-color, #555); stroke-width: 1.2; }
  .wall { stroke: var(--divider-color, #555); stroke-width: 1; stroke-dasharray: 3 4; }
  .fins line { stroke: var(--divider-color, #555); stroke-width: 1; }
  .frost { fill: #dff6ff; opacity: 0; transition: opacity 1.2s; }
  .defrost .frost { opacity: 0.6; }
  .grille { fill: none; stroke: var(--secondary-text-color); stroke-width: 1; opacity: 0.55; }
  .hub { fill: var(--secondary-text-color); }
  .blade { fill: var(--secondary-text-color); opacity: 0.85; }
  .divider { stroke: var(--divider-color, #555); stroke-width: 1; }
  .comp-body { fill: var(--disabled-text-color, #6b7280); stroke: var(--secondary-text-color); stroke-width: 1; }
  .louver { stroke: var(--divider-color, #555); stroke-width: 2; stroke-linecap: round; }
  .clickable { cursor: pointer; }
  .thermo-bg { fill: var(--card-background-color, #1c1c1c); stroke: var(--divider-color, #555); stroke-width: 1.2; transition: stroke 0.2s; }
  .thermo:hover .thermo-bg { stroke: var(--primary-color, #03a9f4); }
  .thermo-glass { fill: none; stroke: var(--primary-text-color); stroke-width: 1.1; stroke-linejoin: round; }
  .thermo-fill { fill: var(--thermo, var(--ahc-standby)); }
  .thermo-tick { stroke: var(--secondary-text-color); stroke-width: 1; stroke-linecap: round; }

  .spin { animation: ahc-spin var(--dur, 1s) linear infinite; animation-play-state: paused; }
  .spin.run { animation-play-state: running; }
  @keyframes ahc-spin { to { transform: rotate(360deg); } }

  .pipe { fill: none; stroke: var(--divider-color, #555); stroke-linecap: round; stroke-linejoin: round; }
  .pipe.gas { stroke-width: 6; }
  .pipe.liq { stroke-width: 4; }
  .flow {
    fill: none; stroke: var(--pipe, var(--ahc-standby)); stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 5 9; opacity: 0; transition: opacity 0.6s;
  }
  .flow.gas { stroke-width: 3.4; }
  .flow.liq { stroke-width: 2.2; }
  .flow.run { opacity: 1; animation: ahc-flow var(--dur, 1s) linear infinite; }
  .flow.liq.run { opacity: 0.75; }
  .flow.rev { animation-direction: reverse; }
  @keyframes ahc-flow { from { stroke-dashoffset: 28; } to { stroke-dashoffset: 0; } }

  .hum.run { animation: ahc-hum var(--dur, 0.3s) ease-in-out infinite; }
  @keyframes ahc-hum { 0%, 100% { transform: translateX(-0.7px); } 50% { transform: translateX(0.7px); } }

  .air path {
    fill: none; stroke: var(--air, var(--ahc-fan)); stroke-width: 2.2; stroke-linecap: round;
    stroke-linejoin: round; opacity: 0;
  }
  .air.run path { animation: ahc-air var(--dur, 2s) linear infinite; }
  @keyframes ahc-air {
    0% { transform: translateY(0); opacity: 0; }
    20% { opacity: 0.95; }
    100% { transform: translateY(30px); opacity: 0; }
  }
  .vane { transition: transform 1.5s ease; }
  .vane.swing { animation: ahc-swing 6s ease-in-out infinite; }
  @keyframes ahc-swing { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-60deg); } }

  .snow { opacity: 0; transition: opacity 0.8s; }
  .defrost .snow { opacity: 1; }
  .snow line, .snow polyline { stroke: #0284c7; stroke-width: 2.6; fill: none; stroke-linecap: round; }
  .snow .flake { animation: ahc-spin 10s linear infinite; }
  .snow .halo { fill: #dff6ff; opacity: 0.85; }

  .anim-off .spin, .anim-off .hum.run, .anim-off .vane.swing, .anim-off .snow .flake,
  .anim-off .flow.run, .anim-off .air.run path { animation: none !important; }
  .anim-off .air.run path { opacity: 0.85; }
  .anim-off .air.run g path:nth-child(1) { transform: translateY(4px); }
  .anim-off .air.run g path:nth-child(2) { transform: translateY(13px); }
  .anim-off .air.run g path:nth-child(3) { transform: translateY(22px); }

  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); gap: 8px; margin-top: 6px; }
  .tile { background: var(--secondary-background-color, #2b2b2b); border-radius: 10px; padding: 8px 10px; min-width: 0; }
  .tile[hidden] { display: none; }
  .t-label { font-size: 0.75em; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .t-value { font-size: 1.15em; font-weight: 500; color: var(--primary-text-color); margin-top: 2px; white-space: nowrap; }
  .t-sub { font-size: 0.72em; color: var(--secondary-text-color); margin-top: 1px; min-height: 1.2em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar { height: 4px; border-radius: 2px; background: var(--divider-color, #555); margin-top: 5px; overflow: hidden; }
  .bar > div { height: 100%; width: 0; background: var(--success-color, #22c55e); transition: width 0.6s; }
  .tile.warn .bar > div { background: var(--warning-color, #f59e0b); }
  .tile.due .bar > div { background: var(--error-color, #ef4444); }
  .tile.due .t-value { color: var(--error-color, #ef4444); }

  .timeline-wrap { margin-top: 10px; }
  .timeline-wrap[hidden] { display: none; }
  .tl-head { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 0.75em; color: var(--secondary-text-color); margin-bottom: 4px; }
  .legend { display: flex; gap: 10px; flex-wrap: wrap; }
  .legend i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; background: var(--c); }
  .timeline { position: relative; height: 14px; border-radius: 4px; overflow: hidden; background: var(--divider-color, #555); }
  .timeline > div { position: absolute; top: 0; bottom: 0; background: var(--c); }
  .tl-axis { display: flex; justify-content: space-between; font-size: 0.68em; color: var(--secondary-text-color); margin-top: 3px; }
`;

// ---------------------------------------------------------------------------
// The card
// ---------------------------------------------------------------------------

class AircoHeatpumpCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._el = {};
    this._history = null;
    this._historyKey = null;
  }

  static async getConfigElement() {
    await loadHaForm();
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(hass) {
    const climate = Object.keys(hass.states).find((id) => id.startsWith("climate."));
    return { entity: climate || "climate.airco" };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    let indoor = config.indoor || (config.entity ? [{ climate: config.entity }] : null);
    if (!Array.isArray(indoor) || indoor.length === 0) {
      throw new Error("Set 'entity' (a climate entity) or 'indoor' (a list of indoor units)");
    }
    indoor = indoor.map((u) => (typeof u === "string" ? { climate: u } : { ...u }));
    if (indoor.length > 2) throw new Error("At most 2 indoor units per outdoor unit");
    for (const u of indoor) {
      if (!u.climate || !u.climate.startsWith("climate.")) {
        throw new Error("Every indoor unit needs 'climate: climate.xxx'");
      }
    }
    this._config = { ...DEFAULTS, ...config, indoor };
    this._resolved = null;
    this._built = false;
    this._history = null;
    this._historyKey = null;
    if (this._hass) this.hass = this._hass;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (!this._resolved) this._resolve();
    if (!this._built) this._build();
    this._update();
    this._watchHistory();
  }

  connectedCallback() {
    this._timer = setInterval(() => this._loadHistory(), HISTORY_REFRESH_MS);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    clearTimeout(this._reloadTimer);
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  // ---------- language and formatting ----------

  get _lang() {
    const lang = this._config.language;
    if (lang && lang !== "auto") return TEXTS[lang] ? lang : "en";
    return (this._hass?.language || "en").startsWith("nl") ? "nl" : "en";
  }

  _t(key) {
    return TEXTS[this._lang][key] ?? TEXTS.en[key] ?? key;
  }

  _fmt(value, decimals = 1) {
    if (value == null || Number.isNaN(value)) return "–";
    const locale = this._lang === "nl" ? "nl-NL" : this._hass?.locale?.language || "en";
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  // ---------- reading states ----------

  _num(entityId) {
    const st = entityId && this._hass.states[entityId];
    if (!st) return null;
    const v = parseFloat(st.state);
    return Number.isNaN(v) ? null : v;
  }

  _str(entityId) {
    const st = entityId && this._hass.states[entityId];
    return st ? st.state : null;
  }

  _unit(entityId, fallback = "") {
    const st = entityId && this._hass.states[entityId];
    return st?.attributes.unit_of_measurement ?? fallback;
  }

  // ---------- entity discovery ----------

  _resolve() {
    const cfg = this._config;
    const units = cfg.indoor.map((u) => {
      const climate = this._hass.states[u.climate];
      return {
        ...u,
        name: u.name || climate?.attributes.friendly_name || u.climate,
        e: { ...this._discover(u.climate, INDOOR_KEYS), ...(u.entities || {}) },
      };
    });
    const out = { ...this._discover(cfg.indoor[0].climate, OUTDOOR_KEYS), ...(cfg.entities || {}) };
    this._resolved = { units, out };
  }

  _discover(climateId, table) {
    return discoverEntities(this._hass, climateId, table);
  }

  _entityFor(ref) {
    const [scope, key] = ref.split(".");
    if (scope === "out") return this._resolved.out[key];
    const unit = this._resolved.units[Number(scope.slice(1))];
    if (!unit) return null;
    if (key === "climate") return unit.climate;
    if (key === "filter") return unit.filter;
    return unit.e[key];
  }

  // ---------- building the DOM (once) ----------

  _build() {
    const { units } = this._resolved;
    const L = makeLayout(units.length);
    const title = this._config.name ?? (units.length === 1 ? units[0].name : "Heat pump");

    const fins = Array.from({ length: 18 }, (_, i) => {
      const x = 14 + i * 6;
      return `<line x1="${x}" y1="12" x2="${x}" y2="108"/>`;
    }).join("");

    // One gas and one liquid line per indoor unit. All grey pipes first, then the moving flows on top,
    // so the shared part never hides the flow of a unit that runs.
    const lines = L.units.map((p) => ({
      gas: `M${L.gasOut.x},${L.gasOut.y} H${L.gasX} V${p.gasY} H${p.x}`,
      liq: `M${L.liqOut.x},${L.liqOut.y} H${L.liqX} V${p.liqY} H${p.x}`,
    }));
    const pipes =
      lines.map((l) => `<path class="pipe liq" d="${l.liq}"/><path class="pipe gas" d="${l.gas}"/>`).join("") +
      lines
        .map(
          (l, i) =>
            `<path class="flow liq" data-id="u${i}-flow-liq" d="${l.liq}"/>` +
            `<path class="flow gas" data-id="u${i}-flow-gas" d="${l.gas}"/>`
        )
        .join("");

    const indoor = units
      .map(
        (u, i) => `
        <g transform="translate(${L.units[i].x},${L.units[i].y})">
          ${units.length > 1 ? `<text class="label" x="0" y="-7">${u.name}</text>` : ""}
          <g class="clickable" data-entity="u${i}.climate">
            <rect class="body" width="150" height="44" rx="10"/>
            <line class="louver" x1="14" y1="40" x2="136" y2="40"/>
            <g transform="translate(20,20)">
              <circle class="grille" r="11"/>
              <g class="spin" data-id="u${i}-fan">${blades(3, 9.5)}</g>
            </g>
            <text class="small muted" x="38" y="17">${this._t("coil")}</text>
            <text x="38" y="31" data-id="u${i}-coil">–</text>
            <text class="big" x="142" y="23" text-anchor="end" data-id="u${i}-room">–</text>
            <text class="small muted" x="142" y="35" text-anchor="end" data-id="u${i}-target"></text>
          </g>
          <g class="clickable thermo" data-entity="u${i}.climate" transform="translate(150,0)">
            <title>${this._t("thermostat")}</title>
            <circle class="thermo-bg" r="11.5"/>
            <path class="thermo-glass" d="M-2,1.4 V-5 A2,2 0 0 1 2,-5 V1.4 A3.6,3.6 0 1 1 -2,1.4 Z"/>
            <rect class="thermo-fill" data-id="u${i}-thermo" x="-0.8" y="-3" width="1.6" height="6"/>
            <circle class="thermo-fill" data-id="u${i}-thermo" cy="4.1" r="2.2"/>
            <line class="thermo-tick" x1="3.6" y1="-4.5" x2="5.4" y2="-4.5"/>
            <line class="thermo-tick" x1="3.6" y1="-2" x2="5.4" y2="-2"/>
          </g>
          <g transform="translate(72,46)">
            <g class="air" data-id="u${i}-air">
              ${airColumn(-36, `u${i}-vane`)}${airColumn(0, `u${i}-vane`)}${airColumn(36, `u${i}-vane`)}
            </g>
          </g>
        </g>`
      )
      .join("");

    const o = L.out;
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        <div class="wrap" data-id="wrap">
          <div class="header">
            <div class="title-wrap">
            <div class="title clickable" data-entity="u0.climate">${title}</div>
            <span class="help-btn" data-help="1" data-id="help-btn" role="button" title="${this._t("help")}" ${this._config.help ? "" : "hidden"}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="7.6" r="1.3" fill="currentColor"/><rect x="10.9" y="10.4" width="2.2" height="7.4" rx="1.1" fill="currentColor"/></svg>
            </span>
            </div>
            <span class="chip clickable" data-entity="u0.climate" data-id="chip"><span class="dot"></span><span data-id="chip-text"></span></span>
          </div>
          <div class="notice" data-id="alert" hidden><span class="dot"></span><span data-id="alert-text"></span></div>
          <div class="help" data-id="help" hidden>${this._helpHtml()}</div>
          <svg viewBox="0 0 400 ${L.height}" role="img" aria-label="${title}">
            <line class="wall" x1="${L.wallX}" y1="6" x2="${L.wallX}" y2="${L.height - 6}"/>
            ${pipes}
            <g class="clickable" data-entity="out.outdoor_temp">
              <text class="label" x="${o.x}" y="${o.y - 10}" data-id="out-temp">–</text>
            </g>
            <g transform="translate(${o.x},${o.y})">
              <rect class="body" width="${o.w}" height="${o.h}" rx="8"/>
              <g class="fins clickable" data-entity="out.outdoor_coil">
                ${fins}
                <rect class="frost" x="10" y="10" width="110" height="100" rx="4"/>
              </g>
              <g class="clickable" data-entity="out.outdoor_fan">
                <circle class="grille" cx="65" cy="60" r="44"/>
                <circle class="grille" cx="65" cy="60" r="30"/>
                <g transform="translate(65,60)">
                  <g class="spin" data-id="out-fan">${blades(4, 39)}</g>
                  <circle class="hub" r="6"/>
                </g>
              </g>
              <line class="divider" x1="128" y1="8" x2="128" y2="112"/>
              <g class="clickable" data-entity="out.compressor">
                <text x="153" y="28" text-anchor="middle" data-id="comp-hz">–</text>
                <text class="small muted" x="153" y="40" text-anchor="middle">${this._t("compressor").toLowerCase()}</text>
                <g transform="translate(153,78)">
                  <g class="hum" data-id="comp">
                    <rect class="comp-body" x="-14" y="-24" width="28" height="48" rx="12"/>
                    <line class="divider" x1="-14" y1="-8" x2="14" y2="-8"/>
                  </g>
                </g>
              </g>
              <g class="snow" transform="translate(65,60)">
                <circle class="halo" r="26"/>
                <g class="flake">${snowflake(20)}</g>
              </g>
            </g>
            <g class="clickable" data-entity="out.outdoor_coil">
              <text class="small muted" x="${o.x}" y="${o.y + o.h + 16}" data-id="out-line1"></text>
            </g>
            <g class="clickable" data-entity="out.discharge">
              <text class="small muted" x="${o.x}" y="${o.y + o.h + 30}" data-id="out-line2"></text>
            </g>
            ${indoor}
          </svg>
          <div class="tiles">
            <div class="tile clickable" data-entity="out.power" data-id="tile-power">
              <div class="t-label">${this._t("power")}</div>
              <div class="t-value" data-id="power">–</div>
              <div class="t-sub" data-id="power-sub"></div>
            </div>
            <div class="tile clickable" data-entity="out.energy_today" data-id="tile-energy">
              <div class="t-label">${this._t("today")}</div>
              <div class="t-value" data-id="energy">–</div>
              <div class="t-sub"></div>
            </div>
            <div class="tile" data-id="tile-cop" title="${this._t("estimate")}">
              <div class="t-label">${this._t("cop")}</div>
              <div class="t-value" data-id="cop">–</div>
              <div class="t-sub" data-id="cop-sub"></div>
            </div>
            <div class="tile clickable" data-entity="out.compressor">
              <div class="t-label">${this._t("compressor")}</div>
              <div class="t-value" data-id="comp-tile">–</div>
              <div class="t-sub" data-id="comp-sub"></div>
            </div>
            <div class="tile clickable" data-entity="out.defrost" data-id="tile-defrost">
              <div class="t-label">${this._t("defrost_today")}</div>
              <div class="t-value" data-id="defrost-count">–</div>
              <div class="t-sub" data-id="defrost-sub"></div>
            </div>
            ${units
              .map(
                (u, i) => `
              <div class="tile clickable" data-filter="${i}" data-id="tile-filter-${i}" hidden>
                <div class="t-label">${this._t("filter")}${units.length > 1 ? " " + u.name : ""}</div>
                <div class="t-value" data-id="filter-${i}">–</div>
                <div class="t-sub" data-id="filter-sub-${i}"></div>
                <div class="bar"><div data-id="filter-bar-${i}"></div></div>
              </div>`
              )
              .join("")}
          </div>
          <div class="timeline-wrap" data-id="timeline-wrap" ${this._config.timeline ? "" : "hidden"}>
            <div class="tl-head">
              <span>${this._t("last_hours").replace("{h}", this._config.timeline_hours)}</span>
              <span class="legend" data-id="legend"></span>
            </div>
            <div class="timeline" data-id="timeline"></div>
            <div class="tl-axis" data-id="axis"></div>
          </div>
        </div>
      </ha-card>`;

    // Elements that share a data-id (e.g. one flow line per indoor unit) are kept as a list.
    this._el = {};
    this.shadowRoot.querySelectorAll("[data-id]").forEach((el) => {
      const id = el.dataset.id;
      (this._el[id] ||= []).push(el);
    });

    this.shadowRoot.querySelector("ha-card").addEventListener("click", (ev) => this._onClick(ev));
    this._helpOpen = false;
    this._built = true;
  }

  // ---------- small DOM helpers ----------

  _text(id, text) {
    for (const el of this._el[id] || []) if (el.textContent !== text) el.textContent = text;
  }

  _class(id, cls, on) {
    for (const el of this._el[id] || []) el.classList.toggle(cls, !!on);
  }

  _var(id, name, value) {
    for (const el of this._el[id] || []) el.style.setProperty(name, value);
  }

  _hide(id, hidden) {
    for (const el of this._el[id] || []) el.hidden = !!hidden;
  }

  // ---------- live state ----------

  _state() {
    const { units, out } = this._resolved;
    const comp = this._num(out.compressor) ?? 0;
    const running = comp > 0;
    const defrost = this._str(out.defrost) === "on";

    const unitStates = units.map((u) => {
      const climate = this._hass.states[u.climate];
      const mode = climate ? climate.state : "unavailable";
      const on = !OFF_STATES.includes(mode);
      const roomAttr = climate ? parseFloat(climate.attributes.current_temperature) : NaN;
      const room = this._num(u.e.room) ?? (Number.isNaN(roomAttr) ? null : roomAttr);
      const c1 = this._num(u.e.coil1);
      const c2 = this._num(u.e.coil2);
      const c3 = this._num(u.e.coil3);
      const warmCoil = mean(c1, c3);
      const coilWarmer = warmCoil != null && room != null ? warmCoil > room : null;
      let status = on ? statusFor(mode, running, coilWarmer) : mode === "off" ? "off" : "unavailable";
      if (defrost && on) status = "defrost";
      return {
        unit: u,
        mode,
        on,
        status,
        room,
        target: climate?.attributes.temperature ?? null,
        fan: on ? this._num(u.e.indoor_fan) ?? 0 : 0,
        vanes: this._num(u.e.vanes),
        swing: ["both", "vertical"].includes(climate?.attributes.swing_mode),
        c1,
        c2,
        c3,
      };
    });

    const lead = unitStates.find((s) => s.on);
    let status;
    if (defrost) status = "defrost";
    else if (lead) status = lead.status;
    else status = unitStates.every((s) => s.mode === "unavailable") ? "unavailable" : "off";

    let power = this._num(out.power);
    if (power == null && out.current) {
      const amps = this._num(out.current);
      power = amps == null ? null : amps * this._config.voltage;
    }

    return { comp, running, defrost, status, units: unitStates, power };
  }

  // Heat (or cooling) delivered, estimated from airflow and the air temperature rise.
  _estimateOutput(st) {
    if (st.defrost || !st.running) return null;
    let watts = 0;
    let kind = null;
    for (const s of st.units) {
      if (!s.on || s.fan <= 0 || s.room == null) continue;
      const heating = s.status === "heat";
      const cooling = s.status === "cool" || s.status === "dry";
      if (!heating && !cooling) continue;
      const coil = heating ? mean(s.c1, s.c3) : mean(s.c1, s.c2);
      if (coil == null) continue;
      if (heating && coil <= s.room) continue;
      if (cooling && coil >= s.room) continue;
      const table = s.unit.airflow || DEFAULT_AIRFLOW;
      const airflow = table[clamp(Math.round(s.fan), 1, table.length) - 1];
      const deltaT = Math.abs(coil - s.room) * this._config.coil_factor;
      watts += (airflow / 3600) * AIR_DENSITY * AIR_HEAT_CAPACITY * deltaT;
      kind = heating ? "heat" : "cool";
    }
    return watts > 0 ? { watts, kind } : null;
  }

  _update() {
    if (!this._hass || !this._built) return;
    const st = this._state();
    const { out } = this._resolved;
    const color = `var(--ahc-${st.status === "unavailable" ? "off" : st.status})`;

    // Whole card
    const wrap = this._el.wrap[0];
    wrap.classList.toggle("defrost", st.defrost);
    const reduce =
      this._config.animations === "off" ||
      (this._config.animations === "auto" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    wrap.classList.toggle("anim-off", !!reduce);

    // Status chip
    this._var("chip", "--st", color);
    this._text("chip-text", this._t(st.status));

    // Notice under the header. Red: error code or a protection fault ("... anomaly", "Current cut", "Stop by ...").
    // Amber: a protection control, where the unit limits itself for a while (usually normal in cold weather).
    const faults = [];
    const infos = [];
    for (const s of st.units) {
      const code = this._num(s.unit.e.error);
      if (code) faults.push(`${this._t("error")} ${code}${st.units.length > 1 ? " " + s.unit.name : ""}`);
    }
    const protection = this._str(out.protection);
    if (protection && !["Normal", "-", "unknown", "unavailable"].includes(protection)) {
      (/anomaly|cut|stop/i.test(protection) ? faults : infos).push(`${this._t("protection")}: ${protection}`);
    }
    const notices = [...faults, ...infos];
    this._hide("alert", notices.length === 0);
    this._class("alert", "fault", faults.length > 0);
    this._class("alert", "info", faults.length === 0);
    this._text("alert-text", notices.join(" · "));

    // Outdoor unit
    this._text("out-temp", `${this._t("outdoor")} ${this._fmt(this._num(out.outdoor_temp))} °C`);
    const outFan = this._num(out.outdoor_fan);
    const outFanRuns = outFan != null ? outFan > 0 : st.running && !st.defrost;
    this._class("out-fan", "run", outFanRuns);
    this._var("out-fan", "--dur", `${clamp(2.4 / (outFan || 2), 0.25, 3)}s`);
    this._class("comp", "run", st.running);
    this._var("comp", "--dur", `${clamp(30 / (st.comp || 30), 0.15, 1)}s`);
    this._text("comp-hz", `${this._fmt(st.comp, 0)} Hz`);

    const line1 = [
      `${this._t("coil")} ${this._fmt(this._num(out.outdoor_coil))} °C`,
      out.discharge ? `${this._t("discharge")} ${this._fmt(this._num(out.discharge), 0)} °C` : null,
    ];
    const line2 = [
      out.superheat ? `${this._t("superheat")} ${this._fmt(this._num(out.superheat), 0)} °C` : null,
      out.exp_valve ? `${this._t("exp_valve")} ${this._fmt(this._num(out.exp_valve), 0)}` : null,
    ];
    this._text("out-line1", line1.filter(Boolean).join(" · "));
    this._text("out-line2", line2.filter(Boolean).join(" · "));

    // Refrigerant flow, per indoor unit: only to a unit that is on while the compressor runs.
    // Hot gas goes to the indoor unit when heating; the flow reverses when cooling or defrosting.
    st.units.forEach((s, i) => {
      const flows = st.running && s.on;
      const reversed = ["cool", "dry", "defrost"].includes(s.status);
      const pipeColor = ["standby", "fan"].includes(s.status) ? "var(--ahc-standby)" : `var(--ahc-${s.status})`;
      for (const id of [`u${i}-flow-gas`, `u${i}-flow-liq`]) {
        this._class(id, "run", flows);
        this._var(id, "--pipe", pipeColor);
        this._var(id, "--dur", `${clamp(60 / (st.comp || 60), 0.35, 3)}s`);
      }
      this._class(`u${i}-flow-gas`, "rev", reversed);
      this._class(`u${i}-flow-liq`, "rev", !reversed);
    });

    // Indoor units
    st.units.forEach((s, i) => {
      const fanRuns = s.fan > 0;
      this._class(`u${i}-fan`, "run", fanRuns);
      this._var(`u${i}-fan`, "--dur", `${clamp(1.6 / (s.fan || 1), 0.3, 3)}s`);

      const airColor = { heat: "--ahc-heat", cool: "--ahc-cool", dry: "--ahc-dry", auto: "--ahc-auto" }[s.status] || "--ahc-fan";
      this._class(`u${i}-air`, "run", fanRuns && s.status !== "defrost");
      const unitColor = ["off", "unavailable"].includes(s.status) ? "var(--ahc-off)" : `var(--ahc-${s.status})`;
      this._var(`u${i}-thermo`, "--thermo", unitColor);
      this._var(`u${i}-air`, "--air", `var(${airColor})`);
      this._var(`u${i}-air`, "--dur", `${clamp(3.2 / (s.fan || 1), 0.8, 3.5)}s`);

      const swing = s.vanes === 5 || (s.vanes == null && s.swing);
      this._class(`u${i}-vane`, "swing", swing);
      const angle = swing ? 0 : VANE_ANGLE[s.vanes] ?? 20;
      this._var(`u${i}-vane`, "transform", swing ? "" : `rotate(${-angle}deg)`);

      this._text(`u${i}-room`, s.room == null ? "–" : `${this._fmt(s.room)}°`);
      this._text(
        `u${i}-target`,
        s.on && s.target != null ? `${this._t("target")} ${this._fmt(Number(s.target))}°` : this._t(s.status)
      );
      const coil = s.status === "cool" || s.status === "dry" ? mean(s.c1, s.c2) : mean(s.c1, s.c3);
      this._text(`u${i}-coil`, coil == null ? "–" : `${this._fmt(coil)} °C`);
    });

    // Tiles
    const powerUnit = out.power ? "" : out.current ? `${this._fmt(this._num(out.current))} A` : "";
    this._text("power", st.power == null ? "–" : `${this._fmt(st.power, 0)} W`);
    this._text("power-sub", powerUnit);
    if (!out.power && out.current) this._el["tile-power"][0].dataset.entity = "out.current";

    this._hide("tile-energy", !out.energy_today);
    this._text("energy", `${this._fmt(this._num(out.energy_today), 2)} ${this._unit(out.energy_today, "kWh")}`);

    this._hide("tile-cop", !this._config.cop);
    const output = this._estimateOutput(st);
    const cop = output && st.power > 50 ? output.watts / st.power : null;
    this._text("cop", cop == null ? "–" : this._fmt(cop));
    this._text(
      "cop-sub",
      output ? `${this._t(output.kind === "heat" ? "heat_out" : "cool_out")} ${this._fmt(output.watts / 1000)} kW` : ""
    );

    this._text("comp-tile", `${this._fmt(st.comp, 0)} Hz`);
    const compHours = this._num(out.compressor_hours);
    this._text("comp-sub", compHours == null ? "" : `${this._fmt(compHours, 0)} ${this._t("hours")} ${this._t("total")}`);

    this._hide("tile-defrost", !out.defrost);
    this._updateFilters();
  }

  // ---------- filter counters ----------

  _filterInfo(unit) {
    const st = unit.filter && this._hass.states[unit.filter];
    if (!st) return null;
    const domain = unit.filter.split(".")[0];
    if (domain === "input_datetime") {
      const ts = Number(st.attributes.timestamp);
      if (!ts) return null;
      const used = Math.max(0, (Date.now() - ts * 1000) / 86400000);
      return { used, limit: unit.filter_days ?? 30, unit: this._t("days") };
    }
    if (domain === "input_number") {
      const now = this._num(unit.e.run_hours);
      const atClean = this._num(unit.filter);
      if (now == null || atClean == null) return null;
      return { used: Math.max(0, now - atClean), limit: unit.filter_hours ?? 300, unit: this._t("hours") };
    }
    return null;
  }

  _updateFilters() {
    this._resolved.units.forEach((u, i) => {
      const info = this._filterInfo(u);
      this._hide(`tile-filter-${i}`, !info);
      if (!info) return;
      const pct = clamp((info.used / info.limit) * 100, 0, 100);
      const tile = this._el[`tile-filter-${i}`][0];
      tile.classList.toggle("warn", pct >= 80 && pct < 100);
      tile.classList.toggle("due", pct >= 100);
      this._text(`filter-${i}`, `${this._fmt(Math.floor(info.used), 0)} / ${info.limit} ${info.unit}`);
      this._text(`filter-sub-${i}`, pct >= 100 ? this._t("filter_due") : this._t("filter_tap"));
      this._var(`filter-bar-${i}`, "width", `${pct}%`);
    });
  }

  async _resetFilter(index) {
    const unit = this._resolved.units[index];
    const st = unit && this._hass.states[unit.filter];
    if (!st) return;
    if (!window.confirm(this._t("filter_confirm").replace("{name}", unit.name))) return;
    const domain = unit.filter.split(".")[0];
    if (domain === "input_datetime") {
      const now = new Date();
      const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const data = { entity_id: unit.filter };
      if (st.attributes.has_date && st.attributes.has_time) data.datetime = `${date} ${time}`;
      else if (st.attributes.has_date) data.date = date;
      else data.time = time;
      await this._hass.callService("input_datetime", "set_datetime", data);
    } else if (domain === "input_number") {
      const runHours = this._num(unit.e.run_hours);
      if (runHours == null) return;
      await this._hass.callService("input_number", "set_value", { entity_id: unit.filter, value: runHours });
    }
  }

  // ---------- help panel ----------

  _helpHtml() {
    const colors = ["heat", "cool", "dry", "auto", "fan", "standby", "defrost"]
      .map(
        (s) =>
          `<span class="name"><span class="dot" style="--c:var(--ahc-${s})"></span>${this._t(s)}</span>` +
          `<span>${this._t(`help_${s}`)}</span>`
      )
      .join("");
    const drawing = ["help_streaks", "help_lines", "help_snow", "help_notice", "help_cop", "help_tap"]
      .map((key) => `<li>${this._t(key)}</li>`)
      .join("");
    return (
      `<h4>${this._t("help_colors")}</h4><div class="help-colors">${colors}</div>` +
      `<h4>${this._t("help_drawing")}</h4><ul>${drawing}</ul>`
    );
  }

  _toggleHelp() {
    this._helpOpen = !this._helpOpen;
    this._hide("help", !this._helpOpen);
    this._class("help-btn", "open", this._helpOpen);
  }

  // ---------- clicks ----------

  _onClick(ev) {
    const path = ev.composedPath();
    if (path.some((el) => el.dataset?.help)) {
      this._toggleHelp();
      return;
    }
    const filterTile = path.find((el) => el.dataset?.filter != null);
    if (filterTile) {
      this._resetFilter(Number(filterTile.dataset.filter));
      return;
    }
    const target = path.find((el) => el.dataset?.entity);
    const entityId = target && this._entityFor(target.dataset.entity);
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  // ---------- history: timeline and defrost counter ----------

  _watchHistory() {
    const { units, out } = this._resolved;
    const ids = [out.defrost, ...units.map((u) => u.climate)];
    const key = ids.map((id) => this._hass.states[id]?.last_changed).join("|");
    if (key === this._historyKey) return;
    this._historyKey = key;
    clearTimeout(this._reloadTimer);
    this._reloadTimer = setTimeout(() => this._loadHistory(), this._history ? 3000 : 0);
  }

  async _loadHistory() {
    if (!this._hass || !this._resolved || this._loading) return;
    const { units, out } = this._resolved;
    const ids = [out.defrost, out.compressor, ...units.map((u) => u.climate)].filter(Boolean);
    const hours = this._config.timeline_hours;
    const end = Date.now();
    const midnight = new Date(end);
    midnight.setHours(0, 0, 0, 0);
    const start = Math.min(end - hours * 3600000, midnight.getTime());

    this._loading = true;
    try {
      const result = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      const series = {};
      for (const id of ids) {
        series[id] = (result[id] || []).map((p) => ({ t: 1000 * (p.lc ?? p.lu), s: p.s }));
      }
      this._history = { series, start, end, midnight: midnight.getTime() };
      this._renderHistory();
    } catch (err) {
      console.warn(`${CARD_TAG}: could not load history`, err);
    } finally {
      this._loading = false;
    }
  }

  _renderHistory() {
    const h = this._history;
    if (!h) return;
    const { units, out } = this._resolved;

    // Defrost counter for today
    if (out.defrost) {
      const points = h.series[out.defrost] || [];
      let count = 0;
      let onMs = 0;
      let lastStart = null;
      let prev = null;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const from = Math.max(p.t, h.midnight);
        const to = i + 1 < points.length ? points[i + 1].t : h.end;
        if (p.s === "on") {
          if (to > from) onMs += to - from;
          if (prev !== "on" && p.t >= h.midnight) {
            count++;
            lastStart = p.t;
          }
        }
        prev = p.s;
      }
      this._text("defrost-count", `${count}×`);
      this._text(
        "defrost-sub",
        count ? `${this._fmt(onMs / 60000, 0)} ${this._t("min")} · ${this._t("last")} ${clock(lastStart)}` : ""
      );
    }

    if (!this._config.timeline) return;

    // Timeline segments: evaluate the status at every change point
    const from = h.end - this._config.timeline_hours * 3600000;
    const ids = [out.defrost, out.compressor, ...units.map((u) => u.climate)].filter(Boolean);
    const times = new Set([from]);
    for (const id of ids) for (const p of h.series[id] || []) if (p.t > from && p.t < h.end) times.add(p.t);
    const sorted = [...times].sort((a, b) => a - b);

    const cursor = Object.fromEntries(ids.map((id) => [id, -1]));
    const valueAt = (id, t) => {
      const pts = h.series[id] || [];
      let i = cursor[id];
      while (i + 1 < pts.length && pts[i + 1].t <= t) i++;
      cursor[id] = i;
      return i >= 0 ? pts[i].s : null;
    };

    const segments = [];
    for (let i = 0; i < sorted.length; i++) {
      const t = sorted[i];
      const next = i + 1 < sorted.length ? sorted[i + 1] : h.end;
      const status = this._historyStatus({
        defrost: out.defrost ? valueAt(out.defrost, t) : null,
        comp: out.compressor ? parseFloat(valueAt(out.compressor, t)) : NaN,
        modes: units.map((u) => valueAt(u.climate, t)),
      });
      const last = segments[segments.length - 1];
      if (last && last.status === status) last.to = next;
      else segments.push({ status, from: t, to: next });
    }

    const span = h.end - from;
    const timeline = this._el.timeline[0];
    timeline.innerHTML = segments
      .filter((s) => s.status !== "off")
      .map((s) => {
        const left = ((s.from - from) / span) * 100;
        const width = ((s.to - s.from) / span) * 100;
        const tip = `${this._t(s.status)} ${clock(s.from)}–${clock(s.to)}`;
        return `<div style="left:${left}%;width:${width}%;--c:var(--ahc-${s.status})" title="${tip}"></div>`;
      })
      .join("");

    const present = new Set(segments.map((s) => s.status));
    this._el.legend[0].innerHTML = STATUS_ORDER.filter((s) => present.has(s))
      .map((s) => `<span><i style="--c:var(--ahc-${s})"></i>${this._t(s)}</span>`)
      .join("");

    const labels = [];
    for (let k = 0; k < 4; k++) labels.push(`<span>${clock(from + (span * k) / 4)}</span>`);
    labels.push(`<span>${this._t("now")}</span>`);
    this._el.axis[0].innerHTML = labels.join("");
  }

  _historyStatus({ defrost, comp, modes }) {
    if (defrost === "on") return "defrost";
    const lead = modes.find((m) => m && !OFF_STATES.includes(m));
    if (!lead) return "off";
    return statusFor(lead, comp > 0, null);
  }
}

// ---------------------------------------------------------------------------
// Visual editor
//
// Uses Home Assistant's own form builder (ha-form), so the fields look and work
// like the rest of the dashboard editor. Empty sensor fields mean "find it
// automatically"; the helper text under each field shows what was found.
// ---------------------------------------------------------------------------

const EDITOR_TAG = `${CARD_TAG}-editor`;

const LABELS = {
  name: "Title",
  language: "Language",
  animations: "Animations",
  cop: "Show estimated COP",
  timeline: "Show timeline",
  help: "Show help button (i)",
  timeline_hours: "Timeline (hours)",
  climate: "Climate entity",
  filter: "Filter helper",
  filter_days: "Clean filter every (days)",
  filter_hours: "Clean filter every (run hours)",
  airflow: "Airflow per fan speed (m³/h)",
  coil_factor: "Coil factor",
  voltage: "Mains voltage",
};

const HELPERS = {
  name: "Leave empty to use the name of the climate entity.",
  animations: "Auto follows the 'reduce motion' setting of your device.",
  filter: "A date helper counts days, a number helper counts indoor run hours. Tap the filter tile after cleaning.",
  airflow:
    "One value in m³/h per indoor fan speed (1, 2, 3, ...), comma separated, from the datasheet (m³/min × 60). " +
    "MHI-AC-Ctrl: 2 = ULo, 3 = Lo, 4 = Me, 5 = Hi. Only used for the COP estimate.",
  coil_factor: "Share of the coil-to-room temperature difference that ends up in the air. Only used for the COP estimate.",
  voltage: "Turns amps into watts when there is no power sensor.",
};

// Home Assistant loads ha-form lazily. Opening a built-in card editor loads it.
async function loadHaForm() {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await window.loadCardHelpers();
    const card = await helpers.createCardElement({ type: "tile", entity: "sun.sun" });
    await card.constructor.getConfigElement();
  } catch (err) {
    console.warn(`${CARD_TAG}: could not load the form elements`, err);
  }
}

// Card config -> form data (defaults filled in, airflow as text).
function toFormData(config) {
  const { type, entity, indoor, ...rest } = config;
  const units = indoor || (entity ? [{ climate: entity }] : []);
  const unit = (u) => {
    if (!u) return {};
    const copy = typeof u === "string" ? { climate: u } : { ...u };
    if (Array.isArray(copy.airflow)) copy.airflow = copy.airflow.join(", ");
    return copy;
  };
  return { ...DEFAULTS, ...rest, unit0: unit(units[0]), unit1: unit(units[1]) };
}

// Removes empty values, also inside nested objects.
function compact(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      const inner = compact(value);
      if (Object.keys(inner).length) out[key] = inner;
    } else {
      out[key] = value;
    }
  }
  return out;
}

// Form data -> card config (defaults and empty fields left out, so the YAML stays short).
function fromFormData(type, data) {
  const { unit0, unit1, ...rest } = data;
  const config = { type, ...compact(rest) };
  for (const [key, value] of Object.entries(DEFAULTS)) {
    if (config[key] === value) delete config[key];
  }
  const indoor = [unit0, unit1]
    .map((u) => compact(u))
    .filter((u) => u.climate)
    .map((u) => {
      if (typeof u.airflow === "string") {
        const numbers = u.airflow.split(/[\s,;]+/).map(Number).filter((n) => n > 0);
        if (numbers.length) u.airflow = numbers;
        else delete u.airflow;
      }
      return u;
    });
  if (indoor.length) config.indoor = indoor;
  return config;
}

function sensorFields(table, unitIndex) {
  return Object.entries(table).map(([key, rule]) => ({
    name: key,
    _label: rule.label,
    _unit: unitIndex,
    selector: { entity: { domain: rule.domain || "sensor" } },
  }));
}

function buildSchema(data) {
  const unitSchema = (i) => {
    const u = data[`unit${i}`] || {};
    const filterField = !u.filter
      ? []
      : u.filter.startsWith("input_number.")
        ? [{ name: "filter_hours", selector: { number: { min: 10, max: 5000, step: 10, mode: "box" } } }]
        : [{ name: "filter_days", selector: { number: { min: 1, max: 365, mode: "box" } } }];
    return [
      { name: "climate", required: i === 0, selector: { entity: { domain: "climate" } } },
      { name: "name", _label: "Name", selector: { text: {} } },
      { name: "filter", selector: { entity: { domain: ["input_datetime", "input_number"] } } },
      ...filterField,
      { name: "airflow", selector: { text: {} } },
      { type: "expandable", name: "entities", title: "Indoor unit sensors", schema: sensorFields(INDOOR_KEYS, i) },
    ];
  };

  return [
    { name: "name", selector: { text: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        {
          name: "language",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: "Auto (Home Assistant language)" },
                { value: "en", label: "English" },
                { value: "nl", label: "Nederlands" },
              ],
            },
          },
        },
        {
          name: "animations",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: "Auto" },
                { value: "always", label: "Always" },
                { value: "off", label: "Off" },
              ],
            },
          },
        },
      ],
    },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "cop", selector: { boolean: {} } },
        { name: "timeline", selector: { boolean: {} } },
        { name: "help", selector: { boolean: {} } },
        { name: "timeline_hours", selector: { number: { min: 3, max: 72, mode: "box" } } },
      ],
    },
    { type: "expandable", name: "unit0", title: "Indoor unit", expanded: true, schema: unitSchema(0) },
    {
      type: "expandable",
      name: "unit1",
      title: "Second indoor unit on the same outdoor unit (optional)",
      schema: unitSchema(1),
    },
    { type: "expandable", name: "entities", title: "Outdoor unit sensors", schema: sensorFields(OUTDOOR_KEYS, -1) },
    {
      type: "expandable",
      name: "",
      title: "Advanced",
      schema: [
        { name: "coil_factor", selector: { number: { min: 0.1, max: 1, step: 0.05, mode: "box" } } },
        { name: "voltage", selector: { number: { min: 100, max: 400, mode: "box" } } },
      ],
    },
  ];
}

class AircoHeatpumpCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._data = toFormData(config);
    this._schema = buildSchema(this._data);
    this._found = {};
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (schema) => schema._label || LABELS[schema.name] || schema.name;
      this._form.computeHelper = (schema) => this._helper(schema);
      this._form.addEventListener("value-changed", (ev) => this._changed(ev.detail.value));
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._data;
    this._form.schema = this._schema;
  }

  // For sensor fields: show which entity the card found by itself.
  _helper(schema) {
    if (schema._unit === undefined) return HELPERS[schema.name];
    const outdoor = schema._unit < 0;
    const unit = this._data[`unit${outdoor ? 0 : schema._unit}`] || {};
    const own = outdoor ? this._data.entities?.[schema.name] : unit.entities?.[schema.name];
    if (own || !unit.climate) return undefined;
    const cacheKey = `${outdoor ? "out" : "in"}|${unit.climate}`;
    this._found[cacheKey] ||= discoverEntities(this._hass, unit.climate, outdoor ? OUTDOOR_KEYS : INDOOR_KEYS);
    const found = this._found[cacheKey][schema.name];
    return found ? `Found automatically: ${found}` : "Not found automatically";
  }

  _changed(data) {
    const config = fromFormData(this._config.type, data);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, AircoHeatpumpCard);
  customElements.define(EDITOR_TAG, AircoHeatpumpCardEditor);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TAG,
    name: "Airco Heat Pump Card",
    description: "Animated card for air-to-air heat pumps (split airco), made for MHI-AC-Ctrl.",
    preview: true,
  });
  console.info(`%c AIRCO-HEATPUMP-CARD %c ${CARD_VERSION} `, "background:#f97316;color:#fff", "");
}
