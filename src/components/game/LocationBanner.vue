<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { LocationId } from '../../data/types';
import { DUCK_SPOT, INTERIOR_H, INTERIOR_W, drawDuck, drawInterior } from '../../game/art/interiors';

/** Animated pixel-art interior shown at the top of each location panel. */
const props = defineProps<{ id: LocationId }>();
const emit = defineEmits<{ duck: [] }>();
const canvas = ref<HTMLCanvasElement | null>(null);
let timer: number | undefined;
let t = 0;

function paint() {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;
  drawInterior(ctx, props.id, t);
  if (props.id === 'house') drawDuck(ctx);
}

watch(() => props.id, paint);
onMounted(() => {
  paint();
  timer = window.setInterval(() => {
    t++;
    paint();
  }, 520);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="border-b-2 border-[#4f6bff] bg-[#05071c] shrink-0 flex justify-center">
    <!-- Width is capped so the banner never takes more than ~a quarter of the viewport height. -->
    <div class="relative aspect-[200/64]" style="width: min(100%, 78vh)">
      <canvas ref="canvas" :width="INTERIOR_W" :height="INTERIOR_H" class="pixelated block size-full" />
      <!-- Secret: the rubber duck in the developer's house is clickable. -->
      <button
        v-if="id === 'house'"
        class="absolute w-[7%] aspect-square -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        :style="{ left: DUCK_SPOT.x * 100 + 1 + '%', top: DUCK_SPOT.y * 100 + 2 + '%' }"
        aria-label="A suspicious rubber duck"
        @click="emit('duck')"
      />
    </div>
  </div>
</template>
