import { computed, reactive, ref, watch } from 'vue';
import { achievements } from '../data/achievements';
import { inventoryItems, locations, quests } from '../data/quests';
import { newlyUnlocked } from '../game/systems/AchievementSystem';
import { countActions, currentQuest, evaluateQuests } from '../game/systems/QuestSystem';
import { XP_REWARDS, award, levelFor, levelProgress } from '../game/systems/XPSystem';
import { bus, gameState } from '../game/bridge';
import { useAudio } from './useAudio';

const STORAGE_KEY = 'sahiti.exe:progress:v1';

interface ProgressState {
  xp: number;
  actions: string[];
  achievements: string[];
  /** The player has started the adventure at least once (skips the intro dialogue next time). */
  started: boolean;
}

export interface Notice {
  id: number;
  kind: 'xp' | 'mission' | 'achievement' | 'level' | 'item';
  title: string;
  text: string;
}

const fresh = (): ProgressState => ({ xp: 0, actions: [], achievements: [], started: false });

function load(): ProgressState {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (raw && typeof raw.xp === 'number' && Array.isArray(raw.actions) && Array.isArray(raw.achievements)) {
      return { xp: raw.xp, actions: raw.actions, achievements: raw.achievements, started: !!raw.started };
    }
  } catch {
    /* corrupt or unavailable storage — start fresh */
  }
  return fresh();
}

const state = reactive<ProgressState>(load());
const notices = ref<Notice[]>([]);
let noticeId = 0;

watch(
  state,
  () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  },
  { deep: true },
);

function notify(kind: Notice['kind'], title: string, text: string) {
  const id = ++noticeId;
  notices.value.push({ id, kind, title, text });
  window.setTimeout(() => dismiss(id), 4200);
}
function dismiss(id: number) {
  notices.value = notices.value.filter((n) => n.id !== id);
}

const has = (key: string) => state.actions.includes(key);
const count = (prefix: string) => countActions(state.actions, prefix);

function syncScene() {
  gameState.visited = state.actions.filter((a) => a.startsWith('visit:')).map((a) => a.slice(6));
  gameState.bugCollected = has('egg:bug');
  bus.emit('sync');
}
syncScene();

/**
 * Records a unique visitor action. XP, missions, achievements and level-ups all cascade from here.
 * Returns true only the first time the action happens.
 */
function perform(key: string, xp: number): boolean {
  const { sfx } = useAudio();
  const levelBefore = levelFor(state.xp);
  if (!award(state, key, xp)) return false;

  const item = inventoryItems.find((i) => i.action === key);
  if (item) {
    notify('item', 'Item found', item.name);
    sfx('secret');
  } else {
    sfx('xp');
  }

  for (const q of quests) {
    const done = count(q.condition.prefix) >= q.condition.target;
    if (done && award(state, `mission:${q.id}`, XP_REWARDS.mission)) {
      notify('mission', `${q.code} complete`, `${q.title} · +${XP_REWARDS.mission} XP`);
      sfx('mission');
    }
  }

  for (const a of newlyUnlocked(achievements, state.actions, state.achievements)) {
    state.achievements.push(a.id);
    notify('achievement', 'Achievement unlocked', a.title);
    sfx('achievement');
  }

  const levelAfter = levelFor(state.xp);
  if (levelAfter > levelBefore) notify('level', 'Level up', `You reached level ${levelAfter}`);

  syncScene();
  return true;
}

function reset() {
  Object.assign(state, fresh());
  notices.value = [];
  syncScene();
}

const questViews = computed(() => evaluateQuests(quests, state.actions));

export function useGameProgress() {
  return {
    state,
    notices,
    dismiss,
    has,
    count,
    perform,
    reset,
    level: computed(() => levelFor(state.xp)),
    levelProgress: computed(() => levelProgress(state.xp)),
    questViews,
    activeQuest: computed(() => currentQuest(questViews.value)),
    missionsDone: computed(() => questViews.value.filter((v) => v.status === 'completed').length),
    visitedCount: computed(() => count('visit:')),
    allVisited: computed(() => count('visit:') >= locations.length),
    inventory: computed(() => inventoryItems.filter((i) => has(i.action))),
    isUnlocked: (achievementId: string) => state.achievements.includes(achievementId),
  };
}
