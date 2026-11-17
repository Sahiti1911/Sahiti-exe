<script setup lang="ts">
import { Check, Target } from 'lucide-vue-next';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';

/** Compact "current mission" strip for the bottom of the HUD. Click to open the full quest log. */
const { activeQuest, missionsDone, questViews } = useGameProgress();
const { toggleOverlay } = useGameUI();
</script>

<template>
  <button class="pixel-chip pointer-events-auto flex items-center gap-3 px-3 py-2 text-left cursor-pointer hover:brightness-125 max-w-full" @click="toggleOverlay('quests')">
    <span class="grid place-items-center size-8 shrink-0 bg-deep border-2 border-volt text-aqua">
      <component :is="activeQuest ? Target : Check" :size="16" />
    </span>
    <span v-if="activeQuest" class="min-w-0">
      <span class="label-pixel block text-aqua !text-[8px]">{{ activeQuest.quest.code }}</span>
      <span class="block truncate text-[20px] leading-tight text-white">
        {{ activeQuest.quest.title }}
        <span v-if="activeQuest.target > 1" class="text-mist">({{ activeQuest.progress }}/{{ activeQuest.target }})</span>
      </span>
    </span>
    <span v-else class="min-w-0">
      <span class="label-pixel block text-gold !text-[8px]">All missions complete</span>
      <span class="block text-[20px] leading-tight text-white">The multiverse is yours to roam.</span>
    </span>
    <span class="label-pixel text-mist !text-[8px] pl-1 hidden sm:block">{{ missionsDone }}/{{ questViews.length }}</span>
  </button>
</template>
