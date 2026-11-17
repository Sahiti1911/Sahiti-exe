<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import { locations } from '../../data/quests';
import OverlayFrame from './OverlayFrame.vue';

/**
 * Accessible alternative to walking: every location one tap away.
 * This is what keeps the portfolio content reachable on small screens and without the keyboard.
 */
const { has, visitedCount } = useGameProgress();
const { ui, travelTo } = useGameUI();
</script>

<template>
  <OverlayFrame title="Locations" :subtitle="`${visitedCount}/${locations.length} discovered · fast travel`" @close="ui.overlay = null">
    <ul class="grid gap-2.5 sm:grid-cols-2">
      <li v-for="(loc, i) in locations" :key="loc.id">
        <button class="loc pixel-chip w-full p-3 flex items-center gap-3 text-left cursor-pointer" :style="{ '--c': loc.color }" @click="travelTo(loc.id)">
          <span class="font-pixel text-[10px] grid place-items-center size-9 shrink-0 border-2 border-ink text-ink" :style="{ background: loc.color }">
            <Check v-if="has(`visit:${loc.id}`)" :size="16" :stroke-width="3.5" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="min-w-0">
            <span class="block text-[21px] leading-tight text-white truncate">{{ loc.name }}</span>
            <span class="label-pixel !text-[7px] block mt-1" :style="{ color: loc.color }">{{ loc.purpose }}</span>
          </span>
        </button>
      </li>
    </ul>
  </OverlayFrame>
</template>

<style scoped>
.loc:hover {
  border-color: var(--c);
  box-shadow:
    0 0 0 2px #0b0f2a,
    0 0 16px color-mix(in srgb, var(--c) 40%, transparent);
}
</style>
