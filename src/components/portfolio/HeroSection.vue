<script setup lang="ts">
import { Download, Gamepad2, Mail } from 'lucide-vue-next';
import { usePortfolioMode } from '../../composables/usePortfolioMode';
import { profile } from '../../data/profile';
import PixelAvatar from '../shared/PixelAvatar.vue';

const { setMode } = usePortfolioMode();
</script>

<template>
  <section class="bg-gradient-to-b from-blue-50 to-white border-b border-slate-100">
    <div class="section grid gap-10 md:grid-cols-[1fr_auto] items-center !py-16 sm:!py-24">
      <div>
        <p class="eyebrow">{{ profile.role }} · {{ profile.focus }}</p>
        <h1 class="mt-3 text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">{{ profile.name }}</h1>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{{ profile.intro }}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#contact" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700">
            <Mail :size="16" /> Get in touch
          </a>
          <a v-if="profile.links.resume" :href="profile.links.resume" download class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-blue-400">
            <Download :size="16" /> Download resume
          </a>
          <button class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-blue-400 cursor-pointer" @click="setMode('game')">
            <Gamepad2 :size="16" /> Play the game version
          </button>
        </div>
      </div>
      <div class="justify-self-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-xl shadow-blue-200" aria-hidden="true">
        <PixelAvatar :scale="8" />
      </div>
    </div>
  </section>
</template>
