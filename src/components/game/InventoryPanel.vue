<script setup lang="ts">
import { ref } from 'vue';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import { inventoryItems } from '../../data/quests';
import type { InventoryItem } from '../../data/types';
import OverlayFrame from './OverlayFrame.vue';

const { has, inventory } = useGameProgress();
const { ui } = useGameUI();
const selected = ref<InventoryItem | null>(inventory.value[0] ?? null);
</script>

<template>
  <OverlayFrame title="Inventory" :subtitle="`${inventory.length}/${inventoryItems.length} secrets collected`" accent="#fbbf24" @close="ui.overlay = null">
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="item in inventoryItems"
        :key="item.id"
        class="slot aspect-square grid place-items-center"
        :class="{ owned: has(item.action), active: selected?.id === item.id }"
        :disabled="!has(item.action)"
        :aria-label="has(item.action) ? item.name : 'Empty slot'"
        @click="selected = item"
      >
        <span v-if="has(item.action)" class="gem" :style="{ '--c': item.color }" />
        <span v-else class="font-pixel text-[10px] text-[#3d4fa8]">?</span>
      </button>
    </div>
    <div class="pixel-chip p-4 mt-4 min-h-28">
      <template v-if="selected && has(selected.action)">
        <h3 class="label-pixel" :style="{ color: selected.color }">{{ selected.name }}</h3>
        <p class="text-[20px] leading-snug text-white mt-2">{{ selected.description }}</p>
      </template>
      <p v-else class="text-[20px] leading-snug text-mist">
        Your bag is waiting for secrets. This world hides five of them — talk to the townsfolk for hints, and check the corners of the map.
      </p>
    </div>
  </OverlayFrame>
</template>

<style scoped>
.slot {
  background: #101a40;
  border: 2px solid #2f3f8f;
  box-shadow: inset 0 0 0 2px #0b0f2a;
}
.slot.owned {
  cursor: pointer;
}
.slot.owned:hover,
.slot.active {
  border-color: #fbbf24;
}
.gem {
  width: 45%;
  aspect-ratio: 1;
  background: var(--c);
  border: 2px solid #0b0f2a;
  transform: rotate(45deg);
  box-shadow:
    inset -3px -3px 0 rgba(0, 0, 0, 0.3),
    inset 3px 3px 0 rgba(255, 255, 255, 0.5),
    0 0 12px var(--c);
}
</style>
