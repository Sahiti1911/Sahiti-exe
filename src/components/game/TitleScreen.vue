<script setup lang="ts">
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import { useAudio } from '../../composables/useAudio';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import { usePortfolioMode } from '../../composables/usePortfolioMode';
import { profile } from '../../data/profile';
import Navigation from '../shared/Navigation.vue';
import DialogueBox from './DialogueBox.vue';

const { ui, startAdventure } = useGameUI();
const { state } = useGameProgress();
const audio = useAudio();
const { setMode } = usePortfolioMode();
const root = ref<HTMLElement | null>(null);

const loading = computed(() => ui.screen === 'loading');
const returning = computed(() => state.started);
const introLines = ['Welcome, Player 001.', 'An unexplored developer universe awaits.', 'Ready to begin your adventure?'];

function start() {
  audio.sfx('click');
  // Returning players skip the introduction and drop straight back into the world.
  if (returning.value) startAdventure();
  else ui.screen = 'intro';
}

watch(
  () => ui.screen,
  async (screen, prev) => {
    if (screen === 'title' && prev === 'loading') {
      await nextTick();
      gsap.from('.title-action', { y: 16, opacity: 0, duration: 0.45, stagger: 0.09, ease: 'steps(5)' });
    }
    if (screen === 'starting' && root.value) gsap.to(root.value, { opacity: 0, duration: 0.6, ease: 'power1.in' });
  },
);
</script>

<template>
  <div ref="root" class="absolute inset-0 z-20 flex flex-col">
    <div class="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[#070a1f]/85 via-[#070a1f]/35 to-transparent pointer-events-none" />

    <header class="relative flex items-start justify-between p-3 sm:p-5">
      <span class="label-pixel text-mist/80 pt-2">v1.0</span>
      <Navigation theme="game" />
      <button class="pixel-btn ghost sm" :aria-pressed="audio.enabled.value" @click="audio.toggle()">
        <component :is="audio.enabled.value ? Volume2 : VolumeX" :size="14" />
        <span class="hidden sm:inline">Sound {{ audio.enabled.value ? 'On' : 'Off' }}</span>
      </button>
    </header>

    <main v-show="ui.screen !== 'intro'" class="relative flex-1 flex flex-col items-center px-4 pt-[4vh] sm:pt-[7vh] text-center">
      <p class="label-pixel text-aqua tracking-[0.3em] mb-4 sm:mb-6">A playable portfolio</p>
      <h1 class="title-logo font-pixel leading-none">{{ profile.handle.toUpperCase() }}</h1>
      <p class="font-pixel text-[10px] sm:text-sm md:text-base text-violet-200 tracking-[0.25em] mt-5 sm:mt-7">THE DEVELOPER'S MULTIVERSE</p>
      <p class="mt-4 sm:mt-6 text-2xl sm:text-3xl text-mist">"{{ profile.tagline }}"</p>

      <div class="mt-8 sm:mt-10 min-h-32 flex flex-col items-center gap-3">
        <template v-if="loading">
          <div class="label-pixel text-aqua">Loading world<span class="blink">…</span> {{ ui.loadPct }}%</div>
          <div class="pixel-chip w-64 sm:w-80 h-6 p-1" role="progressbar" :aria-valuenow="ui.loadPct" aria-valuemin="0" aria-valuemax="100">
            <div class="load-bar h-full" :style="{ width: ui.loadPct + '%' }" />
          </div>
        </template>
        <template v-else>
          <button class="title-action pixel-btn text-[12px]! px-7! py-4!" @click="start">
            ▶ {{ returning ? 'Continue Game' : 'Start Game' }}
          </button>
          <button class="title-action pixel-btn violet" @click="setMode('portfolio')">Explore Portfolio</button>
        </template>
      </div>
    </main>

    <DialogueBox v-if="ui.screen === 'intro'" speaker="SYSTEM" :lines="introLines" @done="startAdventure">
      <button class="pixel-btn ghost sm" @click="setMode('portfolio')">Skip Game</button>
      <button class="pixel-btn" @click="startAdventure">Start Adventure</button>
    </DialogueBox>
  </div>
</template>

<style scoped>
.title-logo {
  font-size: clamp(30px, 8.4vw, 92px);
  color: #f4f7ff;
  text-shadow:
    0.06em 0.06em 0 #8b5cf6,
    0.12em 0.12em 0 #2a1f5c,
    0 0 0.6em rgba(103, 232, 249, 0.55);
  animation: logo 3.2s steps(6) infinite;
}
@keyframes logo {
  50% {
    text-shadow:
      0.06em 0.06em 0 #67e8f9,
      0.12em 0.12em 0 #16245a,
      0 0 0.9em rgba(139, 92, 246, 0.7);
  }
}
.load-bar {
  background: repeating-linear-gradient(90deg, #67e8f9 0 10px, #3fc7dc 10px 12px);
  transition: width 0.12s steps(4);
}
</style>
