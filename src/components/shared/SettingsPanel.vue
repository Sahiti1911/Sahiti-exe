<script setup lang="ts">
import { RotateCcw, Volume2, VolumeX } from 'lucide-vue-next';
import { ref } from 'vue';
import { useAudio } from '../../composables/useAudio';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import Navigation from './Navigation.vue';

/** Settings body: sound, mode and a two-step progress reset. Rendered inside an OverlayFrame. */
const audio = useAudio();
const { state } = useGameProgress();
const { resetProgress } = useGameUI();
const confirming = ref(false);
const done = ref(false);

function reset() {
  if (!confirming.value) {
    confirming.value = true;
    return;
  }
  resetProgress();
  confirming.value = false;
  done.value = true;
}
</script>

<template>
  <div class="space-y-3">
    <div class="pixel-chip p-3 flex items-center justify-between gap-3">
      <div>
        <p class="label-pixel text-white">Sound</p>
        <p class="text-[18px] text-mist mt-1">Music and sound effects</p>
      </div>
      <button class="pixel-btn sm" :class="{ ghost: !audio.enabled.value }" :aria-pressed="audio.enabled.value" @click="audio.toggle()">
        <component :is="audio.enabled.value ? Volume2 : VolumeX" :size="14" /> {{ audio.enabled.value ? 'On' : 'Off' }}
      </button>
    </div>

    <div class="pixel-chip p-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="label-pixel text-white">Mode</p>
        <p class="text-[18px] text-mist mt-1">Switching never loses your progress</p>
      </div>
      <Navigation theme="game" />
    </div>

    <div class="pixel-chip p-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="label-pixel text-white">Reset progress</p>
        <p class="text-[18px] text-mist mt-1">
          {{ done ? 'Progress cleared. A fresh adventure awaits.' : confirming ? `This erases ${state.xp} XP, missions, badges and items.` : 'Start the adventure over from zero' }}
        </p>
      </div>
      <div class="flex gap-2">
        <button v-if="confirming" class="pixel-btn ghost sm" @click="confirming = false">Cancel</button>
        <button class="pixel-btn danger sm" @click="reset"><RotateCcw :size="12" /> {{ confirming ? 'Yes, reset' : 'Reset' }}</button>
      </div>
    </div>
  </div>
</template>
