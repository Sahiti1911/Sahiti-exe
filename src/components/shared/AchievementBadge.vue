<script setup lang="ts">
import { Blocks, Bot, Bug, Compass, Hammer, Lightbulb, Lock } from 'lucide-vue-next';
import type { Achievement } from '../../data/types';

/** Collectible badge used by the Achievement Hall, toasts and Portfolio Mode. */
defineProps<{ icon: Achievement['icon']; unlocked: boolean; size?: number }>();
const ICONS = { bug: Bug, blocks: Blocks, bot: Bot, lightbulb: Lightbulb, compass: Compass, hammer: Hammer };
</script>

<template>
  <span class="badge" :class="{ unlocked }" :style="{ '--s': (size ?? 56) + 'px' }">
    <component :is="unlocked ? ICONS[icon] : Lock" :size="(size ?? 56) * 0.42" :stroke-width="2.4" />
  </span>
</template>

<style scoped>
.badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: var(--s);
  height: var(--s);
  color: #5a67a8;
  background: #16245a;
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  box-shadow:
    inset 0 0 0 3px #0b0f2a,
    inset 0 0 0 6px #2f3f8f;
}
.badge.unlocked {
  color: #3d2600;
  background: linear-gradient(135deg, #ffe38a 0 35%, #fbbf24 35% 70%, #d49a0c 70%);
  box-shadow:
    inset 0 0 0 3px #0b0f2a,
    inset 0 0 0 6px #fff2c2;
}
</style>
