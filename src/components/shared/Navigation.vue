<script setup lang="ts">
import { Briefcase, Gamepad2 } from 'lucide-vue-next';
import { usePortfolioMode } from '../../composables/usePortfolioMode';

/** The always-visible [ GAME MODE ] [ PORTFOLIO MODE ] switch. `theme` matches whichever mode hosts it. */
defineProps<{ theme: 'game' | 'light' }>();
const { mode, setMode } = usePortfolioMode();
</script>

<template>
  <div
    role="tablist"
    aria-label="Site mode"
    class="inline-flex p-1 gap-1"
    :class="theme === 'game' ? 'pixel-chip' : 'rounded-full bg-slate-100 ring-1 ring-slate-200'"
  >
    <button
      v-for="m in (['game', 'portfolio'] as const)"
      :key="m"
      role="tab"
      :aria-selected="mode === m"
      class="flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
      :class="
        theme === 'game'
          ? ['label-pixel px-2.5 py-2 !text-[8px]', mode === m ? 'bg-volt text-white' : 'text-mist hover:text-white hover:bg-deep']
          : ['px-3.5 py-1.5 rounded-full text-xs font-semibold', mode === m ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-blue-700']
      "
      @click="setMode(m)"
    >
      <component :is="m === 'game' ? Gamepad2 : Briefcase" :size="13" />
      <span>{{ m === 'game' ? 'Game' : 'Portfolio' }}<span class="hidden sm:inline"> Mode</span></span>
    </button>
  </div>
</template>
