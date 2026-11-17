<script setup lang="ts">
import { ArrowUpCircle, Gem, Star, Target, Trophy } from 'lucide-vue-next';
import { useGameProgress, type Notice } from '../../composables/useGameProgress';

/** Toast stack for XP-worthy events: missions, achievements, level-ups and found items. */
const { notices, dismiss } = useGameProgress();
const ICON: Record<Notice['kind'], unknown> = { xp: Star, mission: Target, achievement: Trophy, level: ArrowUpCircle, item: Gem };
const COLOR: Record<Notice['kind'], string> = { xp: '#67e8f9', mission: '#67e8f9', achievement: '#fbbf24', level: '#b79bff', item: '#34d399' };
</script>

<template>
  <TransitionGroup tag="div" name="toast" class="absolute z-50 top-20 inset-x-0 flex flex-col items-center gap-2 pointer-events-none px-3" aria-live="polite">
    <button
      v-for="n in notices.slice(-3)"
      :key="n.id"
      class="toast pixel-chip pointer-events-auto flex items-center gap-3 pl-2.5 pr-4 py-2 cursor-pointer"
      :style="{ '--c': COLOR[n.kind] }"
      @click="dismiss(n.id)"
    >
      <span class="grid place-items-center size-9 shrink-0 border-2 border-ink text-ink" :style="{ background: COLOR[n.kind] }"><component :is="ICON[n.kind]" :size="18" :stroke-width="2.6" /></span>
      <span class="text-left">
        <span class="label-pixel !text-[8px] block" :style="{ color: COLOR[n.kind] }">{{ n.title }}</span>
        <span class="block text-[21px] leading-tight text-white">{{ n.text }}</span>
      </span>
    </button>
  </TransitionGroup>
</template>

<style scoped>
.toast {
  border-color: var(--c);
  box-shadow:
    0 0 0 2px #0b0f2a,
    0 0 22px color-mix(in srgb, var(--c) 55%, transparent);
}
.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition:
    transform 0.25s steps(5),
    opacity 0.25s;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-18px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
