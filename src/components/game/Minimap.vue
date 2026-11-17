<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { locationById } from '../../data/quests';
import { gameState } from '../../game/bridge';
import { BUILDINGS, G, MAP_H, MAP_W, TILE, buildWorld, idx } from '../../game/config/world.config';

/** 2px-per-tile map baked from the same world data the game uses, with a live player blip. */
const SCALE = 2;
const canvas = ref<HTMLCanvasElement | null>(null);
let raf = 0;
let base: HTMLCanvasElement | null = null;

function bakeBase() {
  const world = buildWorld();
  const c = document.createElement('canvas');
  c.width = MAP_W * SCALE;
  c.height = MAP_H * SCALE;
  const ctx = c.getContext('2d')!;
  const colors: Record<number, string> = { [G.Grass]: '#16384a', [G.Path]: '#5a55a0', [G.Water]: '#2a64d8', [G.Plaza]: '#7a6fd0' };
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      ctx.fillStyle = colors[world.ground[idx(x, y)]];
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  }
  ctx.fillStyle = '#0c2c38';
  for (const t of world.trees) ctx.fillRect(t.tx * SCALE, t.ty * SCALE, SCALE, SCALE);
  return c;
}

function draw(time: number) {
  raf = requestAnimationFrame(draw);
  const el = canvas.value;
  if (!el || !base) return;
  const ctx = el.getContext('2d')!;
  ctx.drawImage(base, 0, 0);
  for (const b of BUILDINGS) {
    const visited = gameState.visited.includes(b.id);
    ctx.fillStyle = '#070a1f';
    ctx.fillRect(b.tx * SCALE - 1, b.ty * SCALE - 1, b.tw * SCALE + 2, b.th * SCALE + 2);
    ctx.fillStyle = visited ? locationById(b.id).color : '#55608f';
    ctx.fillRect(b.tx * SCALE, b.ty * SCALE, b.tw * SCALE, b.th * SCALE);
  }
  const px = Math.round((gameState.px / TILE) * SCALE);
  const py = Math.round((gameState.py / TILE) * SCALE);
  ctx.fillStyle = '#070a1f';
  ctx.fillRect(px - 3, py - 3, 6, 6);
  ctx.fillStyle = Math.floor(time / 350) % 2 ? '#ffffff' : '#67e8f9';
  ctx.fillRect(px - 2, py - 2, 4, 4);
}

onMounted(() => {
  base = bakeBase();
  raf = requestAnimationFrame(draw);
});
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <canvas ref="canvas" :width="MAP_W * SCALE" :height="MAP_H * SCALE" class="pixelated block w-full" aria-label="World minimap" />
</template>
