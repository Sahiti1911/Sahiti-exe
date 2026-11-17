/** XP rules. Pure functions — no Phaser, no Vue. */
export const XP_REWARDS = {
  visit: 50,
  tech: 10,
  project: 30,
  mission: 100,
  egg: 50,
} as const;

export const XP_PER_LEVEL = 250;

export interface XPState {
  xp: number;
  /** Every unique action ever rewarded, e.g. "visit:lab", "tech:frontend/vue". */
  actions: string[];
}

export const levelFor = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

export function levelProgress(xp: number) {
  const current = xp % XP_PER_LEVEL;
  return { current, needed: XP_PER_LEVEL, pct: Math.round((current / XP_PER_LEVEL) * 100) };
}

/**
 * Records `key` and grants `amount` XP exactly once.
 * Returns false (and changes nothing) when the action was already rewarded — this is the anti-farming rule.
 */
export function award(state: XPState, key: string, amount: number): boolean {
  if (state.actions.includes(key)) return false;
  state.actions.push(key);
  state.xp += amount;
  return true;
}
