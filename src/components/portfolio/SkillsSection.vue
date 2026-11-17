<script setup lang="ts">
import { ref } from 'vue';
import { projectById } from '../../data/projects';
import { skills } from '../../data/skills';
import type { Tech } from '../../data/types';

const open = ref<Tech | null>(null);
</script>

<template>
  <section id="skills" class="bg-slate-50 border-y border-slate-100">
    <div class="section">
      <p class="eyebrow">Skills</p>
      <h2 class="heading">Technologies I work with</h2>
      <p class="mt-2 text-slate-600">Select any technology to see how I use it.</p>
      <div class="mt-8 grid gap-6 md:grid-cols-2">
        <div v-for="category in skills" :key="category.id" class="card p-6">
          <h3 class="font-semibold text-slate-900">{{ category.title }}</h3>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="tech in category.techs"
              :key="tech.id"
              class="rounded-full border px-3 py-1 text-sm font-medium cursor-pointer transition-colors"
              :class="open?.id === tech.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700'"
              :aria-expanded="open?.id === tech.id"
              @click="open = open?.id === tech.id ? null : tech"
            >
              {{ tech.name }}
            </button>
          </div>
          <div v-if="open && category.techs.some((t) => t.id === open?.id)" class="mt-4 rounded-xl bg-blue-50 p-4 text-sm leading-relaxed" aria-live="polite">
            <p class="font-semibold text-slate-900">{{ open.name }}</p>
            <p class="mt-1 text-slate-600">{{ open.summary }}</p>
            <p class="mt-2 text-slate-800"><span class="font-medium text-blue-700">How I use it:</span> {{ open.usage }}</p>
            <p v-if="open.projectId && projectById(open.projectId)" class="mt-2 text-slate-800">
              <span class="font-medium text-blue-700">Related project:</span> <a href="#projects" class="underline">{{ projectById(open.projectId)!.title }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
