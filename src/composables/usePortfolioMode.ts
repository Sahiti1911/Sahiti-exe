import { ref, watch } from 'vue';
import { bus } from '../game/bridge';
import { useAudio } from './useAudio';

export type AppMode = 'game' | 'portfolio';

/** `?mode=portfolio` gives recruiters a direct link that never loads the game engine. */
const initial: AppMode = new URLSearchParams(location.search).get('mode') === 'portfolio' ? 'portfolio' : 'game';
const mode = ref<AppMode>(initial);
/** The game is only mounted (and Phaser only downloaded) once Game Mode is first shown. */
const gameMounted = ref(initial === 'game');

watch(mode, (m) => {
  if (m === 'game') gameMounted.value = true;
  // The game keeps its state but stops simulating while hidden; saved progress is untouched.
  bus.emit('game-active', m === 'game');
  if (m === 'portfolio') useAudio().setMusic(false);
  window.scrollTo(0, 0);
});

export function usePortfolioMode() {
  return {
    mode,
    gameMounted,
    setMode(m: AppMode) {
      mode.value = m;
    },
  };
}
