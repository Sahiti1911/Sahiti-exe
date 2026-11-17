<script setup lang="ts">
import { Check, Circle, LoaderCircle } from 'lucide-vue-next';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import { achievements } from '../../data/achievements';
import { XP_REWARDS } from '../../game/systems/XPSystem';
import OverlayFrame from './OverlayFrame.vue';

const { questViews, missionsDone, state, level, levelProgress } = useGameProgress();
const { ui, travelTo } = useGameUI();
const LABEL = { not_started: 'Not started', in_progress: 'In progress', completed: 'Completed' };
</script>

<template>
  <OverlayFrame title="Quest Log" :subtitle="`${missionsDone}/${questViews.length} missions complete`" @close="ui.overlay = null">
    <div class="grid grid-cols-3 gap-2 mb-4 text-center">
      <div class="pixel-chip py-2.5"><p class="label-pixel !text-[7px] text-mist">Level</p><p class="font-pixel text-[14px] text-white mt-1.5">{{ level }}</p></div>
      <div class="pixel-chip py-2.5"><p class="label-pixel !text-[7px] text-mist">XP</p><p class="font-pixel text-[14px] text-gold mt-1.5">{{ state.xp }}</p></div>
      <div class="pixel-chip py-2.5"><p class="label-pixel !text-[7px] text-mist">Badges</p><p class="font-pixel text-[14px] text-aqua mt-1.5">{{ state.achievements.length }}/{{ achievements.length }}</p></div>
    </div>
    <div class="h-3 bg-deep border-2 border-ink mb-1"><div class="h-full bg-aqua" :style="{ width: levelProgress.pct + '%' }" /></div>
    <p class="label-pixel !text-[7px] text-mist mb-4">{{ levelProgress.current }}/{{ levelProgress.needed }} XP to level {{ level + 1 }}</p>

    <ol class="space-y-2">
      <li v-for="v in questViews" :key="v.quest.id" class="pixel-chip p-3 flex items-center gap-3" :class="{ active: v.status === 'in_progress', done: v.status === 'completed' }">
        <span class="state grid place-items-center size-8 shrink-0 border-2 border-ink">
          <component :is="v.status === 'completed' ? Check : v.status === 'in_progress' ? LoaderCircle : Circle" :size="16" :stroke-width="3" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="label-pixel !text-[7px] text-mist">{{ v.quest.code }} · {{ LABEL[v.status] }}</p>
          <p class="text-[21px] leading-tight text-white mt-1" :class="{ 'line-through opacity-70': v.status === 'completed' }">{{ v.quest.title }}</p>
          <p class="text-[17px] leading-tight text-mist">{{ v.quest.description }} <span v-if="v.target > 1" class="text-aqua">({{ v.progress }}/{{ v.target }})</span></p>
        </div>
        <span v-if="v.status === 'completed'" class="label-pixel !text-[7px] text-gold shrink-0">+{{ XP_REWARDS.mission }} XP</span>
        <button v-else class="pixel-btn ghost sm shrink-0" @click="travelTo(v.quest.location)">Go</button>
      </li>
    </ol>
  </OverlayFrame>
</template>

<style scoped>
.state {
  background: #16245a;
  color: #5a67a8;
}
.active {
  border-color: #67e8f9;
}
.active .state {
  background: #67e8f9;
  color: #0b0f2a;
}
.done .state {
  background: #34d399;
  color: #0b0f2a;
}
</style>
