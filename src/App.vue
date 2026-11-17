<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import GameView from './components/game/GameView.vue';
import { usePortfolioMode } from './composables/usePortfolioMode';

const PortfolioHome = defineAsyncComponent(() => import('./components/portfolio/PortfolioHome.vue'));
const { mode, gameMounted } = usePortfolioMode();
</script>

<template>
  <!--
    The game stays mounted and paused in Portfolio Mode, so switching back loses nothing.
    It is hidden with visibility (not display:none) so the canvas keeps its size and WebGL state.
  -->
  <GameView v-if="gameMounted" :class="{ invisible: mode !== 'game' }" :aria-hidden="mode !== 'game'" />
  <PortfolioHome v-if="mode === 'portfolio'" />
</template>
