<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAudio } from '../../composables/useAudio';

/** RPG dialogue panel with a typewriter effect. The default slot replaces the "next" hint on the last line. */
const props = defineProps<{ speaker: string; lines: string[] }>();
const emit = defineEmits<{ done: [] }>();
const { sfx } = useAudio();

const index = ref(0);
const shown = ref(0);
let timer: number | undefined;

const line = computed(() => props.lines[index.value] ?? '');
const typing = computed(() => shown.value < line.value.length);
const last = computed(() => index.value >= props.lines.length - 1);

function type() {
  clearInterval(timer);
  shown.value = 0;
  timer = window.setInterval(() => {
    shown.value++;
    if (shown.value % 3 === 0) sfx('talk');
    if (shown.value >= line.value.length) clearInterval(timer);
  }, 22);
}

function advance() {
  if (typing.value) {
    clearInterval(timer);
    shown.value = line.value.length;
  } else if (!last.value) {
    index.value++;
    type();
  } else {
    emit('done');
  }
}

function onKey(e: KeyboardEvent) {
  if (e.repeat) return;
  if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'e') {
    e.preventDefault();
    advance();
  }
}

watch(() => props.lines, () => { index.value = 0; type(); });
onMounted(() => {
  type();
  window.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener('keydown', onKey);
});
</script>

<template>
  <div class="absolute inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-6 pointer-events-none">
    <div class="pixel-panel pointer-events-auto relative w-full max-w-3xl px-5 pt-7 pb-4 sm:px-7 cursor-pointer" @click="advance">
      <div class="absolute -top-3 left-4 label-pixel bg-volt text-white px-3 py-1.5 border-2 border-ink">{{ speaker }}</div>
      <p class="min-h-[3.4em] text-[22px] sm:text-[26px] leading-snug text-white" aria-live="polite">
        {{ line.slice(0, shown) }}<span v-if="typing" class="text-aqua">▌</span>
      </p>
      <div class="mt-2 flex items-center justify-end gap-3 min-h-9" @click.stop>
        <slot v-if="last && !typing" />
        <button v-if="!(last && !typing && $slots.default)" class="label-pixel text-aqua flex items-center gap-2 cursor-pointer" @click="advance">
          <span class="kbd">E</span><span class="blink">{{ last && !typing ? 'Close' : 'Next' }} ▶</span>
        </button>
      </div>
    </div>
  </div>
</template>
