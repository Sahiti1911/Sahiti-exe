/** Input bindings and movement tuning. Key names are Phaser KeyCodes names. */
export const CONTROLS = {
  up: ['W', 'UP'],
  down: ['S', 'DOWN'],
  left: ['A', 'LEFT'],
  right: ['D', 'RIGHT'],
  interact: ['E'],
} as const;

export const MOVEMENT = {
  /** World pixels per second. */
  speed: 82,
  debugSpeedMultiplier: 1.6,
  /** Seconds between footstep sounds while walking. */
  stepInterval: 0.3,
  /** Player collision box (feet), in world pixels. */
  boxWidth: 10,
  boxHeight: 6,
} as const;

/** Distance (px) from an interaction point within which the "Press E" prompt appears. */
export const INTERACT_RADIUS = 22;

/** Shown in the on-screen controls hint. */
export const CONTROL_HINTS: Array<{ keys: string[]; label: string }> = [
  { keys: ['W', 'A', 'S', 'D'], label: 'Move' },
  { keys: ['E'], label: 'Interact' },
  { keys: ['Q'], label: 'Quests' },
  { keys: ['I'], label: 'Inventory' },
  { keys: ['M'], label: 'Locations' },
  { keys: ['Esc'], label: 'Pause' },
];

/** ↑ ↑ ↓ ↓ ← → ← → B A */
export const DEBUG_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];
