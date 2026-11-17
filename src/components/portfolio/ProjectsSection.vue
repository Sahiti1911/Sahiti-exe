<script setup lang="ts">
import { ExternalLink, Github } from 'lucide-vue-next';
import { projects } from '../../data/projects';
</script>

<template>
  <section id="projects" class="bg-slate-50 border-y border-slate-100">
    <div class="section">
      <p class="eyebrow">Projects</p>
      <h2 class="heading">Things I have built</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="p in projects" :key="p.id" class="card p-6 flex flex-col">
          <h3 class="text-lg font-semibold text-slate-900">{{ p.title }}</h3>
          <p class="mt-2 text-slate-600 leading-relaxed">{{ p.description }}</p>
          <dl class="mt-4 space-y-3 text-sm leading-relaxed">
            <div>
              <dt class="font-medium text-blue-700">Problem solved</dt>
              <dd class="text-slate-600">{{ p.problem }}</dd>
            </div>
            <div v-if="p.contribution">
              <dt class="font-medium text-blue-700">My contribution</dt>
              <dd class="text-slate-600">{{ p.contribution }}</dd>
            </div>
          </dl>
          <ul v-if="p.technologies.length" class="mt-4 flex flex-wrap gap-1.5">
            <li v-for="t in p.technologies" :key="t" class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{{ t }}</li>
          </ul>
          <div v-if="p.github || p.demo" class="mt-auto pt-5 flex flex-wrap gap-4 text-sm font-semibold">
            <a v-if="p.github" :href="p.github" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-slate-800 hover:text-blue-700"><Github :size="16" /> GitHub</a>
            <a v-if="p.demo" :href="p.demo" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-slate-800 hover:text-blue-700"><ExternalLink :size="16" /> Live demo</a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
