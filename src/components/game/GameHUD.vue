<script setup lang="ts">
import { Backpack, Map as MapIcon, Pause, ScrollText, Settings, Star, Trophy, Volume2, VolumeX } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAudio } from '../../composables/useAudio';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import { achievements } from '../../data/achievements';
import { profile } from '../../data/profile';
import { CONTROL_HINTS } from '../../game/config/controls.config';
import Navigation from '../shared/Navigation.vue';
import PixelAvatar from '../shared/PixelAvatar.vue';
import Minimap from './Minimap.vue';
import QuestTracker from './QuestTracker.vue';

const { ui, toggleOverlay } = useGameUI();
const { state, level, levelProgress, inventory } = useGameProgress();
const audio = useAudio();

const SEGMENTS = 10;
const filled = computed(() => Math.round((levelProgress.value.pct / 100) * SEGMENTS));
const promptVerb = computed(() => (ui.prompt?.target.kind === 'location' ? 'explore' : 'interact'));
</script>

<template>
  <div class="absolute inset-0 z-10 pointer-events-none p-2 sm:p-4 flex flex-col">
    <!-- Top row -->
    <div class="flex items-start justify-between gap-2">
      <!-- Player card -->
      <div class="flex flex-col items-start gap-2 min-w-0 flex-1 lg:flex-none">
      <section class="pixel-panel pointer-events-auto flex items-center gap-2.5 p-2 sm:p-2.5 sm:pr-4 max-w-full" aria-label="Player">
        <div class="avatar-frame grid place-items-center size-11 sm:size-14 shrink-0 overflow-hidden">
          <PixelAvatar portrait :scale="3" class="sm:scale-125" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 min-w-0">
            <span class="font-pixel text-[9px] sm:text-[11px] text-white truncate">{{ profile.handle }}</span>
            <span class="label-pixel !text-[8px] bg-neon text-white px-1.5 py-1 border-2 border-ink whitespace-nowrap">LV {{ level }}</span>
          </div>
          <div class="mt-1.5 flex gap-[2px]" role="progressbar" :aria-valuenow="levelProgress.pct" aria-valuemin="0" aria-valuemax="100" aria-label="XP to next level">
            <span v-for="i in SEGMENTS" :key="i" class="h-2 w-2.5 sm:w-3.5 border border-ink" :class="i <= filled ? 'bg-aqua shadow-[0_0_6px_#67e8f9]' : 'bg-deep'" />
          </div>
          <div class="label-pixel !text-[7px] text-mist mt-1 hidden sm:block">{{ levelProgress.current }} / {{ levelProgress.needed }} XP</div>
        </div>
      </section>
      <div class="pointer-events-auto lg:hidden"><Navigation theme="game" /></div>
      </div>

      <div class="pointer-events-auto hidden lg:block"><Navigation theme="game" /></div>

      <!-- Stats + system buttons -->
      <section class="flex flex-col items-end gap-2 shrink-0 max-w-[46vw] sm:max-w-none">
        <div class="pointer-events-auto flex flex-wrap justify-end items-stretch gap-1.5">
          <div class="pixel-chip flex items-center gap-1.5 px-2.5 min-h-9 text-gold" title="Experience points">
            <Star :size="14" fill="currentColor" /><span class="font-pixel text-[9px] text-white">{{ state.xp }}</span>
          </div>
          <div class="pixel-chip flex items-center gap-1.5 px-2.5 min-h-9 text-aqua" title="Achievements">
            <Trophy :size="14" /><span class="font-pixel text-[9px] text-white">{{ state.achievements.length }}/{{ achievements.length }}</span>
          </div>
          <button class="pixel-btn ghost icon-btn" :aria-label="audio.enabled.value ? 'Mute sound' : 'Enable sound'" @click="audio.toggle()">
            <component :is="audio.enabled.value ? Volume2 : VolumeX" :size="16" />
          </button>
          <button class="pixel-btn ghost icon-btn" aria-label="Settings" @click="toggleOverlay('settings')"><Settings :size="16" /></button>
          <button class="pixel-btn ghost icon-btn" aria-label="Pause" @click="toggleOverlay('pause')"><Pause :size="16" /></button>
        </div>

        <div class="pixel-panel pointer-events-auto p-1.5 w-28 sm:w-40 cursor-pointer" title="Open locations (M)" @click="toggleOverlay('locations')">
          <Minimap />
          <div class="label-pixel !text-[7px] text-mist text-center pt-1.5 hidden sm:block">World map</div>
        </div>

        <div class="pointer-events-auto flex flex-col gap-1.5">
          <button class="pixel-btn ghost icon-btn" aria-label="Quest log (Q)" title="Quest log (Q)" @click="toggleOverlay('quests')"><ScrollText :size="16" /></button>
          <button class="pixel-btn ghost icon-btn relative" aria-label="Inventory (I)" title="Inventory (I)" @click="toggleOverlay('inventory')">
            <Backpack :size="16" />
            <span v-if="inventory.length" class="absolute -top-1.5 -right-1.5 font-pixel text-[7px] bg-gold text-ink px-1 py-0.5 border border-ink">{{ inventory.length }}</span>
          </button>
          <button class="pixel-btn ghost icon-btn" aria-label="Locations (M)" title="Locations (M)" @click="toggleOverlay('locations')"><MapIcon :size="16" /></button>
        </div>
      </section>
    </div>

    <div class="flex-1" />

    <!-- Bottom row -->
    <div class="flex items-end justify-between gap-3">
      <div class="pixel-chip hidden lg:grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-1.5 px-3 py-2.5 w-56 shrink-0" aria-label="Controls">
        <template v-for="hint in CONTROL_HINTS" :key="hint.label">
          <span class="flex gap-1"><span v-for="k in hint.keys" :key="k" class="kbd">{{ k }}</span></span>
          <span class="text-[18px] text-mist leading-none">{{ hint.label }}</span>
        </template>
      </div>

      <div class="flex-1 flex flex-col items-center gap-2 min-w-0 pb-44 lg:pb-0">
        <Transition name="pop">
          <div v-if="ui.prompt && !ui.panel && !ui.dialogue" class="prompt pixel-chip flex items-center gap-2.5 px-3.5 py-2.5 floaty">
            <span class="kbd !text-[10px] !bg-aqua !text-ink !border-white">E</span>
            <span class="text-[22px] leading-none text-white">Press E to {{ promptVerb }}</span>
            <span class="label-pixel !text-[8px] text-aqua hidden sm:inline">{{ ui.prompt.text }}</span>
          </div>
        </Transition>
        <QuestTracker />
      </div>

      <div class="hidden lg:block w-56 shrink-0" />
    </div>
  </div>
</template>

<style scoped>
.avatar-frame {
  background: #1b2a63;
  border: 2px solid #67e8f9;
  box-shadow:
    inset 0 0 0 2px #0b0f2a,
    0 0 12px rgba(103, 232, 249, 0.45);
}
.prompt {
  border-color: #67e8f9;
  animation:
    floaty 1.6s steps(4) infinite,
    glowpulse 1.6s ease-in-out infinite;
}
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s steps(3);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
