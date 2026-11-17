<script setup lang="ts">
import { Backpack, Map as MapIcon, Play, ScrollText, Settings } from 'lucide-vue-next';
import { useGameUI, type Overlay } from '../../composables/useGameUI';
import { CONTROL_HINTS } from '../../game/config/controls.config';
import OverlayFrame from './OverlayFrame.vue';

const { ui } = useGameUI();
const go = (o: Overlay | null) => (ui.overlay = o);
</script>

<template>
  <OverlayFrame title="Paused" subtitle="The multiverse is holding its breath" accent="#b79bff" @close="go(null)">
    <div class="grid gap-2.5">
      <button class="pixel-btn" @click="go(null)"><Play :size="14" /> Resume</button>
      <button class="pixel-btn ghost" @click="go('quests')"><ScrollText :size="14" /> Quest log</button>
      <button class="pixel-btn ghost" @click="go('inventory')"><Backpack :size="14" /> Inventory</button>
      <button class="pixel-btn ghost" @click="go('locations')"><MapIcon :size="14" /> Locations</button>
      <button class="pixel-btn ghost" @click="go('settings')"><Settings :size="14" /> Settings</button>
    </div>
    <div class="pixel-chip mt-4 p-3 grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto_1fr] items-center gap-x-3 gap-y-2">
      <template v-for="hint in CONTROL_HINTS" :key="hint.label">
        <span class="flex gap-1"><span v-for="k in hint.keys" :key="k" class="kbd">{{ k }}</span></span>
        <span class="text-[18px] text-mist leading-none">{{ hint.label }}</span>
      </template>
    </div>
  </OverlayFrame>
</template>
