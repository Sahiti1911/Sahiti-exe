<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { P, outline } from '../../game/art/canvas';
import { PLAYER_PALETTE, drawChar } from '../../game/art/characters';

/** The player sprite rendered straight from the game's art code. `portrait` crops to the head. */
const props = withDefaults(defineProps<{ portrait?: boolean; scale?: number }>(), { portrait: false, scale: 3 });
const canvas = ref<HTMLCanvasElement | null>(null);
const w = props.portrait ? 14 : 18;
const h = props.portrait ? 13 : 24;

onMounted(() => {
  const el = canvas.value!;
  const ctx = el.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  drawChar(ctx, props.portrait ? -1 : 1, props.portrait ? 1 : 2, 0, 0, PLAYER_PALETTE);
  outline(el, P.outline);
});
</script>

<template>
  <canvas ref="canvas" :width="w" :height="h" class="pixelated block" :style="{ width: w * scale + 'px', height: h * scale + 'px' }" />
</template>
