<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted } from 'vue';
import { initGameUI, useGameUI } from '../../composables/useGameUI';
import { DEBUG_SEQUENCE } from '../../game/config/controls.config';
import SettingsPanel from '../shared/SettingsPanel.vue';
import AchievementPopup from './AchievementPopup.vue';
import DialogueBox from './DialogueBox.vue';
import GameCanvas from './GameCanvas.vue';
import GameControls from './GameControls.vue';
import GameHUD from './GameHUD.vue';
import InventoryPanel from './InventoryPanel.vue';
import LocationMenu from './LocationMenu.vue';
import LocationPanel from './LocationPanel.vue';
import OverlayFrame from './OverlayFrame.vue';
import PauseMenu from './PauseMenu.vue';
import QuestLog from './QuestLog.vue';
import SecretTerminal from './SecretTerminal.vue';
import TitleScreen from './TitleScreen.vue';

/** Game Mode root: the Phaser canvas with every Vue interface layer stacked on top. */
const { ui, toggleOverlay, toggleDebug, escape, travelTo, secrets } = useGameUI();
initGameUI();

let sequence: string[] = [];

function onKey(e: KeyboardEvent) {
  if (ui.screen !== 'world' || e.repeat) return;
  if (e.key === 'Escape') return escape();
  if (ui.terminal) return; // the terminal owns the keyboard

  // Secret: the classic code toggles debug mode.
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  sequence = [...sequence, key].slice(-DEBUG_SEQUENCE.length);
  if (sequence.join() === DEBUG_SEQUENCE.join()) {
    sequence = [];
    toggleDebug();
    return;
  }
  if (key === 'q') toggleOverlay('quests');
  else if (key === 'i') toggleOverlay('inventory');
  else if (key === 'm') toggleOverlay('locations');
}

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div class="game-root fixed inset-0 overflow-hidden bg-[#070a1f]" :class="{ debug: ui.debug }">
    <GameCanvas />
    <div class="vignette" />
    <div v-if="ui.debug" class="scanlines" />

    <TitleScreen v-if="ui.screen !== 'world'" />

    <template v-else>
      <GameHUD />
      <GameControls />
      <div v-if="ui.debug" class="absolute z-10 left-1/2 -translate-x-1/2 top-16 md:top-20 label-pixel !text-[8px] text-emerald-300 bg-black/70 border-2 border-emerald-400 px-3 py-2 pointer-events-none">
        Debug mode · collision boxes visible · speed boost on
      </div>

      <DialogueBox v-if="ui.dialogue" :key="ui.dialogue.speaker + ui.dialogue.lines[0]" :speaker="ui.dialogue.speaker" :lines="ui.dialogue.lines" @done="ui.dialogue = null" />
      <LocationPanel v-if="ui.panel" :id="ui.panel" />
      <QuestLog v-if="ui.overlay === 'quests'" />
      <InventoryPanel v-if="ui.overlay === 'inventory'" />
      <PauseMenu v-if="ui.overlay === 'pause'" />
      <LocationMenu v-if="ui.overlay === 'locations'" />
      <OverlayFrame v-if="ui.overlay === 'settings'" title="Settings" subtitle="System" @close="ui.overlay = null"><SettingsPanel /></OverlayFrame>
      <SecretTerminal v-if="ui.terminal" />

      <!-- Final Easter egg -->
      <OverlayFrame v-if="ui.final" title="Multiverse Core" subtitle="All six locations discovered" accent="#b79bff" @close="ui.final = false">
        <div class="text-center py-2">
          <Sparkles class="mx-auto text-violet-300 floaty" :size="44" />
          <p v-for="(line, i) in secrets.finalMessage" :key="i" class="mt-4 leading-snug" :class="i === 0 ? 'font-pixel text-[12px] text-aqua' : 'text-[22px] text-white'">{{ line }}</p>
        </div>
        <template #footer>
          <button class="pixel-btn ghost" @click="ui.final = false">Keep exploring</button>
          <button class="pixel-btn violet" @click="((ui.final = false), travelTo('tower'))">Open Communication Tower</button>
        </template>
      </OverlayFrame>
    </template>

    <AchievementPopup />
  </div>
</template>
