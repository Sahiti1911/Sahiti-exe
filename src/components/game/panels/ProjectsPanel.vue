<script setup lang="ts">
import gsap from 'gsap';
import { ArrowLeft, ExternalLink, Github, Sparkles } from 'lucide-vue-next';
import { nextTick, ref } from 'vue';
import { useAudio } from '../../../composables/useAudio';
import { useGameProgress } from '../../../composables/useGameProgress';
import { projects } from '../../../data/projects';
import type { Project } from '../../../data/types';
import { XP_REWARDS } from '../../../game/systems/XPSystem';

/** Project stations: undiscovered ones are mystery items until the visitor opens them. */
const { perform, has, count } = useGameProgress();
const { sfx } = useAudio();
const selected = ref<Project | null>(null);
const isNew = ref(false);
const detail = ref<HTMLElement | null>(null);
const COLORS = ['#67e8f9', '#fbbf24', '#f472b6', '#34d399', '#b79bff'];

const found = (p: Project) => has(`project:${p.id}`);
const colorOf = (p: Project) => COLORS[projects.findIndex((x) => x.id === p.id) % COLORS.length];

async function open(p: Project) {
  isNew.value = perform(`project:${p.id}`, XP_REWARDS.project);
  if (!isNew.value) sfx('click');
  selected.value = p;
  await nextTick();
  if (detail.value) {
    gsap.from(detail.value.querySelectorAll('.reveal'), { y: 12, opacity: 0, duration: 0.3, stagger: 0.06, ease: 'steps(4)' });
    if (isNew.value) gsap.from(detail.value.querySelector('.item-icon'), { scale: 2.4, rotate: 180, duration: 0.5, ease: 'back.out(2)' });
  }
}
</script>

<template>
  <!-- Station grid -->
  <div v-if="!selected">
    <p class="label-pixel !text-[8px] text-mist mb-4 leading-relaxed">
      Items discovered: <span class="text-aqua">{{ count('project:') }}/{{ projects.length }}</span> · open a station to reveal what is inside
    </p>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <button v-for="(p, i) in projects" :key="p.id" class="station pixel-chip p-4 text-left cursor-pointer" :style="{ '--c': COLORS[i % COLORS.length] }" @click="open(p)">
        <div class="flex items-center gap-3">
          <span class="gem floaty" :class="{ locked: !found(p) }" :style="{ animationDelay: i * 0.2 + 's' }">{{ found(p) ? '' : '?' }}</span>
          <div class="min-w-0">
            <p class="label-pixel !text-[7px]" :style="{ color: found(p) ? COLORS[i % COLORS.length] : '#8fa3d9' }">
              {{ found(p) ? p.itemClass : `Station 0${i + 1} · undiscovered` }}
            </p>
            <h3 class="text-[22px] leading-tight text-white mt-1">{{ found(p) ? p.title : '? ? ?' }}</h3>
          </div>
        </div>
        <p class="text-[18px] leading-snug text-mist mt-3 min-h-[2.4em]">{{ found(p) ? p.description : 'Something is humming inside this station…' }}</p>
        <span class="label-pixel !text-[8px] text-aqua mt-2 inline-block">{{ found(p) ? 'Inspect ▶' : 'Discover ▶  +30 XP' }}</span>
      </button>
    </div>
  </div>

  <!-- Item detail -->
  <div v-else ref="detail">
    <button class="pixel-btn ghost sm mb-4" @click="selected = null"><ArrowLeft :size="12" /> All stations</button>
    <div v-if="isNew" class="reveal label-pixel text-gold flex items-center gap-2 mb-3"><Sparkles :size="14" /> New item discovered!</div>
    <div class="reveal flex items-center gap-4">
      <span class="item-icon gem lg" :style="{ '--c': colorOf(selected) }" />
      <div class="min-w-0">
        <p class="label-pixel !text-[8px] text-violet-300">{{ selected.itemClass }}</p>
        <h3 class="font-pixel text-[13px] sm:text-[15px] text-white leading-relaxed mt-1">{{ selected.title }}</h3>
      </div>
    </div>

    <dl class="mt-5 grid gap-3 md:grid-cols-2">
      <div class="reveal pixel-chip p-3">
        <dt class="label-pixel !text-[8px] text-aqua">Description</dt>
        <dd class="text-[20px] leading-snug text-white mt-1.5">{{ selected.description }}</dd>
      </div>
      <div class="reveal pixel-chip p-3">
        <dt class="label-pixel !text-[8px] text-aqua">Problem solved</dt>
        <dd class="text-[20px] leading-snug text-white mt-1.5">{{ selected.problem }}</dd>
      </div>
      <div class="reveal pixel-chip p-3">
        <dt class="label-pixel !text-[8px] text-aqua">Technologies</dt>
        <dd class="mt-2 flex flex-wrap gap-1.5">
          <span v-for="t in selected.technologies" :key="t" class="text-[18px] leading-none px-2 py-1 bg-deep border-2 border-volt text-white">{{ t }}</span>
          <span v-if="!selected.technologies.length" class="text-[20px] text-mist">Details coming soon.</span>
        </dd>
      </div>
      <div class="reveal pixel-chip p-3">
        <dt class="label-pixel !text-[8px] text-aqua">My contribution</dt>
        <dd class="text-[20px] leading-snug mt-1.5" :class="selected.contribution ? 'text-white' : 'text-mist'">{{ selected.contribution || 'Details coming soon.' }}</dd>
      </div>
    </dl>

    <div class="reveal mt-5 flex flex-wrap gap-3">
      <a v-if="selected.github" :href="selected.github" target="_blank" rel="noopener noreferrer" class="pixel-btn"><Github :size="14" /> GitHub</a>
      <button v-else class="pixel-btn ghost" disabled title="Add the URL in src/data/projects.ts"><Github :size="14" /> GitHub link not set</button>
      <a v-if="selected.demo" :href="selected.demo" target="_blank" rel="noopener noreferrer" class="pixel-btn violet"><ExternalLink :size="14" /> Live demo</a>
    </div>
  </div>
</template>

<style scoped>
.station {
  transition: transform 0.1s steps(2);
}
.station:hover {
  border-color: var(--c);
  transform: translateY(-3px);
  box-shadow:
    0 0 0 2px #0b0f2a,
    0 0 18px color-mix(in srgb, var(--c) 45%, transparent);
}
.gem {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  font-family: var(--font-pixel);
  font-size: 12px;
  color: #0b0f2a;
  background: var(--c);
  border: 2px solid #0b0f2a;
  box-shadow:
    inset -4px -4px 0 rgba(0, 0, 0, 0.3),
    inset 4px 4px 0 rgba(255, 255, 255, 0.45),
    0 0 14px var(--c);
  transform: rotate(45deg);
}
.gem.floaty {
  animation: gemfloat 1.6s steps(4) infinite;
}
.gem.locked {
  background: #2f3f8f;
  color: #c7d2fe;
  box-shadow:
    inset -4px -4px 0 rgba(0, 0, 0, 0.3),
    inset 4px 4px 0 rgba(255, 255, 255, 0.15);
  transform: none;
  animation: none;
}
.gem.lg {
  width: 46px;
  height: 46px;
  margin: 8px;
}
@keyframes gemfloat {
  50% {
    transform: rotate(45deg) translate(-3px, -3px);
  }
}
</style>
