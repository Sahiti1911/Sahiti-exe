<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next';
import { useGameProgress } from '../../composables/useGameProgress';
import { usePortfolioMode } from '../../composables/usePortfolioMode';
import { achievements } from '../../data/achievements';
import AchievementBadge from '../shared/AchievementBadge.vue';

/** Shows the visitor's own game progress — the badges are earned in Game Mode, and persist across modes. */
const { state, isUnlocked, missionsDone, questViews, level } = useGameProgress();
const { setMode } = usePortfolioMode();
</script>

<template>
  <section id="achievements" class="section">
    <p class="eyebrow">Achievements</p>
    <h2 class="heading">Badges from the game version</h2>
    <p class="mt-2 max-w-2xl text-slate-600">
      This portfolio is also a playable RPG. These badges unlock as you explore it — your progress is saved in this browser and shared between both modes.
    </p>
    <div class="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
      <p><span class="text-2xl font-bold text-slate-900">{{ state.achievements.length }}/{{ achievements.length }}</span> <span class="text-slate-500">badges</span></p>
      <p><span class="text-2xl font-bold text-slate-900">{{ missionsDone }}/{{ questViews.length }}</span> <span class="text-slate-500">missions</span></p>
      <p><span class="text-2xl font-bold text-slate-900">{{ state.xp }}</span> <span class="text-slate-500">XP · level {{ level }}</span></p>
      <button class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 cursor-pointer" @click="setMode('game')">
        <Gamepad2 :size="16" /> {{ state.started ? 'Continue playing' : 'Play to unlock' }}
      </button>
    </div>
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="a in achievements" :key="a.id" class="card p-5 flex gap-4 items-center" :class="isUnlocked(a.id) ? 'border-amber-300 bg-amber-50/40' : ''">
        <AchievementBadge :icon="a.icon" :unlocked="isUnlocked(a.id)" :size="52" />
        <div class="min-w-0">
          <p class="font-semibold text-slate-900">{{ a.title }} <span class="ml-1 text-xs font-medium" :class="isUnlocked(a.id) ? 'text-emerald-600' : 'text-slate-400'">{{ isUnlocked(a.id) ? 'Unlocked' : 'Locked' }}</span></p>
          <p class="text-sm text-slate-600 leading-snug">{{ a.unlock }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>
