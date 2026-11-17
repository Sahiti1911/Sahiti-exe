import type { Condition, Quest } from '../../data/types';

export type QuestStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuestView {
  quest: Quest;
  status: QuestStatus;
  progress: number;
  target: number;
}

export const countActions = (actions: readonly string[], prefix: string) =>
  actions.reduce((n, a) => (a.startsWith(prefix) ? n + 1 : n), 0);

export const conditionMet = (actions: readonly string[], c: Condition) => countActions(actions, c.prefix) >= c.target;

/**
 * Derives every mission's state from the action log.
 * A mission is "in progress" when it has partial progress, or when it is the first unfinished mission.
 */
export function evaluateQuests(quests: readonly Quest[], actions: readonly string[]): QuestView[] {
  let activeAssigned = false;
  return quests.map((quest) => {
    const progress = Math.min(countActions(actions, quest.condition.prefix), quest.condition.target);
    const target = quest.condition.target;
    let status: QuestStatus = 'not_started';
    if (progress >= target) status = 'completed';
    else if (progress > 0) status = 'in_progress';
    if (status !== 'completed' && !activeAssigned) {
      activeAssigned = true;
      status = 'in_progress';
    }
    return { quest, status, progress, target };
  });
}

/** The mission the HUD should point the player at. */
export const currentQuest = (views: readonly QuestView[]) => views.find((v) => v.status !== 'completed') ?? null;
