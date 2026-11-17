<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { bus, gameState } from '../../game/bridge';

/** Hosts the Phaser canvas. The engine is imported lazily so Portfolio Mode never has to download it. */
const host = ref<HTMLDivElement | null>(null);
let game: import('phaser').Game | null = null;
let off: (() => void) | null = null;

onMounted(async () => {
  const { createGame } = await import('../../game/createGame');
  if (!host.value) return;
  game = createGame(host.value);
  off = bus.on('game-active', (active) => {
    if (!game) return;
    game.input.enabled = active;
    if (active) game.loop.wake();
    else game.loop.sleep();
  });
  if (import.meta.env.DEV) Object.assign(window, { __SAHITI__: { game, gameState, bus } });
});

onBeforeUnmount(() => {
  off?.();
  game?.destroy(true);
  game = null;
});
</script>

<template>
  <div ref="host" class="absolute inset-0 [&>canvas]:block [&>canvas]:pixelated" />
</template>
