<script setup lang="ts">
import { useGameProgress } from '../../../composables/useGameProgress';
import { achievements } from '../../../data/achievements';
import { achievementProgress } from '../../../game/systems/AchievementSystem';
import AchievementBadge from '../../shared/AchievementBadge.vue';

const { state, isUnlocked } = useGameProgress();
const progressOf = (id: string) => achievementProgress(achievements.find((a) => a.id === id)!, state.actions);
</script>

<template>
  <p class="label-pixel !text-[8px] text-mist mb-4 leading-relaxed">
    Badges collected: <span class="text-gold">{{ state.achievements.length }}/{{ achievements.length }}</span> · earned by what you actually do in this world
  </p>
  <ul class="grid gap-3 sm:grid-cols-2">
    <li v-for="a in achievements" :key="a.id" class="pixel-chip p-3.5 flex gap-4 items-center" :class="isUnlocked(a.id) ? 'unlocked' : 'opacity-80'">
      <AchievementBadge :icon="a.icon" :unlocked="isUnlocked(a.id)" />
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <h3 class="label-pixel" :class="isUnlocked(a.id) ? 'text-gold' : 'text-mist'">{{ a.title }}</h3>
          <span class="label-pixel !text-[7px]" :class="isUnlocked(a.id) ? 'text-emerald-300' : 'text-mist'">{{ isUnlocked(a.id) ? 'Unlocked' : 'Locked' }}</span>
        </div>
        <p class="text-[19px] leading-snug text-white mt-1.5">{{ a.description }}</p>
        <p class="text-[17px] leading-snug text-mist mt-1"><span class="text-aqua">How to unlock:</span> {{ a.unlock }}</p>
        <div v-if="!isUnlocked(a.id) && progressOf(a.id).target > 1" class="mt-2 flex items-center gap-2">
          <div class="h-2 flex-1 bg-deep border border-ink"><div class="h-full bg-aqua" :style="{ width: (progressOf(a.id).progress / progressOf(a.id).target) * 100 + '%' }" /></div>
          <span class="label-pixel !text-[7px] text-mist">{{ progressOf(a.id).progress }}/{{ progressOf(a.id).target }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.unlocked {
  border-color: #fbbf24;
  box-shadow:
    0 0 0 2px #0b0f2a,
    0 0 16px rgba(251, 191, 36, 0.3);
}
</style>
