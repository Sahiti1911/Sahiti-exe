import type { Achievement } from '../../data/types';
import { conditionMet, countActions } from './QuestSystem';

/** Achievements whose condition is now met but which have not been recorded yet. */
export function newlyUnlocked(
  achievements: readonly Achievement[],
  actions: readonly string[],
  unlocked: readonly string[],
): Achievement[] {
  return achievements.filter((a) => !unlocked.includes(a.id) && conditionMet(actions, a.condition));
}

export function achievementProgress(a: Achievement, actions: readonly string[]) {
  return { progress: Math.min(countActions(actions, a.condition.prefix), a.condition.target), target: a.condition.target };
}
