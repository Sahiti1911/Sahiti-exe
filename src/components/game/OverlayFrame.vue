<script setup lang="ts">
import gsap from 'gsap';
import { X } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

/** Shared modal frame for every in-game window. */
withDefaults(defineProps<{ title: string; subtitle?: string; wide?: boolean; accent?: string }>(), {
  subtitle: '',
  wide: false,
  accent: '#67e8f9',
});
const emit = defineEmits<{ close: [] }>();
const frame = ref<HTMLElement | null>(null);

onMounted(() => {
  if (frame.value) gsap.from(frame.value, { scale: 0.92, y: 14, opacity: 0, duration: 0.22, ease: 'steps(5)' });
});
</script>

<template>
  <div class="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-6 bg-[#05071c]/70" @click.self="emit('close')">
    <section ref="frame" role="dialog" aria-modal="true" :aria-label="title" class="pixel-panel flex flex-col w-full max-h-full" :class="wide ? 'max-w-4xl' : 'max-w-xl'">
      <header class="flex items-center gap-3 px-4 py-3 border-b-2 border-[#2f3f8f] bg-[#101a40] shrink-0">
        <span class="size-3 shrink-0 border-2 border-ink" :style="{ background: accent, boxShadow: `0 0 10px ${accent}` }" />
        <div class="min-w-0 flex-1">
          <h2 class="font-pixel text-[11px] sm:text-[13px] text-white truncate">{{ title }}</h2>
          <p v-if="subtitle" class="label-pixel !text-[8px] mt-1.5" :style="{ color: accent }">{{ subtitle }}</p>
        </div>
        <slot name="actions" />
        <button class="pixel-btn ghost icon-btn shrink-0" aria-label="Close" @click="emit('close')"><X :size="16" /></button>
      </header>
      <slot name="banner" />
      <div class="scroll-pixel overflow-y-auto p-4 sm:p-5 select-text"><slot /></div>
      <footer v-if="$slots.footer" class="px-4 py-3 border-t-2 border-[#2f3f8f] flex flex-wrap items-center justify-end gap-2 shrink-0"><slot name="footer" /></footer>
    </section>
  </div>
</template>
