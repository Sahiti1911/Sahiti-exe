<script setup lang="ts">
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Hand } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useGameUI } from '../../composables/useGameUI';
import { bus, gameState } from '../../game/bridge';

/** Touch controls: a d-pad that feeds the same input vector as the keyboard, plus an interact button. */
const { ui } = useGameUI();
const touch = ref(false);
const held = ref<Record<string, boolean>>({});

const DIRS = [
  { id: 'up', icon: ChevronUp, x: 0, y: -1, cls: 'col-start-2 row-start-1' },
  { id: 'left', icon: ChevronLeft, x: -1, y: 0, cls: 'col-start-1 row-start-2' },
  { id: 'right', icon: ChevronRight, x: 1, y: 0, cls: 'col-start-3 row-start-2' },
  { id: 'down', icon: ChevronDown, x: 0, y: 1, cls: 'col-start-2 row-start-3' },
];

function apply() {
  gameState.vx = (held.value.right ? 1 : 0) - (held.value.left ? 1 : 0);
  gameState.vy = (held.value.down ? 1 : 0) - (held.value.up ? 1 : 0);
}
function press(id: string, on: boolean) {
  held.value = { ...held.value, [id]: on };
  apply();
}
function releaseAll() {
  held.value = {};
  apply();
}

const query = window.matchMedia('(pointer: coarse), (max-width: 1023px)');
const update = () => (touch.value = query.matches);
onMounted(() => {
  update();
  query.addEventListener('change', update);
  window.addEventListener('blur', releaseAll);
});
onBeforeUnmount(() => {
  query.removeEventListener('change', update);
  window.removeEventListener('blur', releaseAll);
  releaseAll();
});
</script>

<template>
  <div v-if="touch" class="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-3 sm:p-5 pointer-events-none select-none touch-none">
    <div class="grid grid-cols-3 grid-rows-3 gap-1 pointer-events-auto" role="group" aria-label="Movement">
      <button
        v-for="d in DIRS"
        :key="d.id"
        class="pad"
        :class="[d.cls, { on: held[d.id] }]"
        :aria-label="`Move ${d.id}`"
        @pointerdown.prevent="press(d.id, true)"
        @pointerup.prevent="press(d.id, false)"
        @pointerleave="press(d.id, false)"
        @pointercancel="press(d.id, false)"
        @contextmenu.prevent
      >
        <component :is="d.icon" :size="22" :stroke-width="3" />
      </button>
      <span class="col-start-2 row-start-2 bg-[#101a40]/70 border-2 border-[#2f3f8f]" />
    </div>

    <button class="act pointer-events-auto" :class="{ ready: ui.prompt }" aria-label="Interact" @pointerdown.prevent="bus.emit('virtual-interact')" @contextmenu.prevent>
      <Hand :size="22" :stroke-width="2.6" />
      <span class="font-pixel text-[8px]">E</span>
    </button>
  </div>
</template>

<style scoped>
.pad {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  color: #e8f0ff;
  background: rgba(22, 36, 90, 0.82);
  border: 2px solid #4f6bff;
  box-shadow:
    0 0 0 2px #0b0f2a,
    inset -3px -3px 0 rgba(0, 0, 0, 0.35),
    inset 3px 3px 0 rgba(255, 255, 255, 0.15);
}
.pad.on {
  background: #3b5bdb;
  transform: translateY(2px);
}
.act {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  color: #e8f0ff;
  background: rgba(124, 77, 219, 0.85);
  border: 3px solid #b79bff;
  box-shadow:
    0 0 0 3px #0b0f2a,
    inset -4px -4px 0 rgba(0, 0, 0, 0.3);
}
.act.ready {
  background: #22b8cf;
  border-color: #fff;
  color: #0b0f2a;
  animation: glowpulse 1.2s ease-in-out infinite;
}
.act:active {
  transform: translateY(2px);
}
</style>
