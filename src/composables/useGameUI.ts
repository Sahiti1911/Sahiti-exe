import { reactive, watchEffect } from 'vue';
import { locationById, locations, secrets } from '../data/quests';
import type { LocationId } from '../data/types';
import { NPCS } from '../game/config/world.config';
import { bus, gameState, type InteractTarget, type PromptInfo } from '../game/bridge';
import { XP_REWARDS } from '../game/systems/XPSystem';
import { useAudio } from './useAudio';
import { useGameProgress } from './useGameProgress';

export type Overlay = 'quests' | 'inventory' | 'pause' | 'settings' | 'locations';

export interface Dialogue {
  speaker: string;
  lines: string[];
}

/** All interface state for Game Mode. Phaser never reads this directly — only `gameState.uiLocked`. */
export const ui = reactive({
  screen: 'loading' as 'loading' | 'title' | 'intro' | 'starting' | 'world',
  loadPct: 0,
  panel: null as LocationId | null,
  dialogue: null as Dialogue | null,
  overlay: null as Overlay | null,
  terminal: false,
  final: false,
  debug: false,
  prompt: null as PromptInfo | null,
});

const progress = useGameProgress();
const audio = useAudio();

const anyOpen = () => !!(ui.panel || ui.dialogue || ui.overlay || ui.terminal || ui.final);

watchEffect(() => {
  gameState.uiLocked = ui.screen !== 'world' || anyOpen();
});

function openLocation(id: LocationId) {
  if (ui.screen !== 'world') return;
  ui.overlay = null;
  ui.dialogue = null;
  ui.panel = id;
  audio.sfx('open');
  progress.perform(`visit:${id}`, XP_REWARDS.visit);
}

/** Jump to a location from the menu / minimap: moves the player to the door and opens the panel. */
function travelTo(id: LocationId) {
  bus.emit('teleport', id);
  openLocation(id);
}

function closePanel() {
  if (!ui.panel) return;
  ui.panel = null;
  audio.sfx('close');
  // Final Easter egg: fires once, right after the sixth location has been discovered.
  if (progress.allVisited.value && !progress.has('egg:final')) {
    progress.perform('egg:final', XP_REWARDS.egg);
    ui.final = true;
  }
}

function say(speaker: string, lines: string[]) {
  ui.dialogue = { speaker, lines };
  audio.sfx('click');
}

function handleInteract(target: InteractTarget) {
  if (ui.screen !== 'world' || anyOpen()) return;
  switch (target.kind) {
    case 'location':
      openLocation(target.id);
      break;
    case 'npc': {
      const npc = NPCS.find((n) => n.id === target.id);
      if (npc) say(npc.name, npc.lines);
      break;
    }
    case 'terminal':
      ui.terminal = true;
      audio.sfx('open');
      break;
    case 'bug':
      if (progress.perform('egg:bug', XP_REWARDS.egg)) say('Golden Bug', ['You caught the golden bug!', 'It wriggles into your inventory. Nobody will ever be able to reproduce it again.']);
      break;
    case 'monolith':
      if (progress.allVisited.value) ui.final = true;
      else
        say('Monolith', [
          'A dormant monolith. Faint runes pulse under the surface.',
          `It seems to react to discovery… ${progress.visitedCount.value} of ${locations.length} locations found.`,
        ]);
      break;
  }
}

function toggleOverlay(name: Overlay) {
  if (ui.screen !== 'world') return;
  if (ui.overlay === name) ui.overlay = null;
  else if (!ui.panel && !ui.dialogue && !ui.terminal && !ui.final) ui.overlay = name;
  else return;
  audio.sfx('click');
}

function toggleDebug() {
  ui.debug = !ui.debug;
  gameState.debug = ui.debug;
  bus.emit('sync');
  if (ui.debug) progress.perform('egg:debug', XP_REWARDS.egg);
  audio.sfx(ui.debug ? 'secret' : 'close');
}

/** Esc: close the top-most thing, or open the pause menu. */
function escape() {
  if (ui.screen !== 'world') return;
  if (ui.final) ui.final = false;
  else if (ui.terminal) ui.terminal = false;
  else if (ui.dialogue) ui.dialogue = null;
  else if (ui.panel) closePanel();
  else if (ui.overlay) ui.overlay = null;
  else ui.overlay = 'pause';
}

function startAdventure() {
  if (ui.screen === 'starting' || ui.screen === 'world') return;
  ui.screen = 'starting';
  progress.state.started = true;
  audio.sfx('mission');
  bus.emit('start-world');
}

function resetProgress() {
  progress.reset();
  if (ui.debug) toggleDebug();
  ui.panel = null;
}

let wired = false;
/** Registers the bus listeners once. Called by GameView when the game is first mounted. */
export function initGameUI() {
  if (wired) return;
  wired = true;
  bus.on('load-progress', (pct) => (ui.loadPct = pct));
  bus.on('boot-ready', () => {
    ui.loadPct = 100;
    if (ui.screen === 'loading') ui.screen = 'title';
  });
  bus.on('world-ready', () => {
    ui.screen = 'world';
    audio.setMusic(true);
  });
  bus.on('prompt', (p) => (ui.prompt = p));
  bus.on('interact', handleInteract);
  bus.on('step', () => audio.sfx('step'));
}

export function useGameUI() {
  return {
    ui,
    openLocation,
    travelTo,
    closePanel,
    say,
    toggleOverlay,
    toggleDebug,
    escape,
    startAdventure,
    resetProgress,
    locationName: (id: LocationId) => locationById(id).name,
    secrets,
  };
}
