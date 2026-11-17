<script setup lang="ts">
import { experience } from '../../data/experience';
</script>

<template>
  <section id="experience" class="section">
    <p class="eyebrow">Experience</p>
    <h2 class="heading">Where I have been building</h2>
    <article v-for="job in experience" :key="job.company + job.role" class="card mt-8 p-6 sm:p-8">
      <header class="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 class="text-xl font-semibold text-slate-900">{{ job.role }}</h3>
          <p class="font-medium text-blue-700">{{ job.company }}</p>
        </div>
        <p v-if="job.period" class="text-sm text-slate-500">{{ job.period }}</p>
      </header>
      <p class="mt-3 text-slate-600">{{ job.summary }}</p>
      <ol class="mt-6 border-l-2 border-blue-100 space-y-5 pl-6">
        <li v-for="item in job.timeline" :key="item.title" class="relative">
          <span class="absolute -left-[31px] top-1.5 size-3 rounded-full bg-blue-600 ring-4 ring-white" />
          <p class="font-medium text-slate-900">{{ item.title }}</p>
          <p class="text-slate-600 leading-relaxed">{{ item.text }}</p>
        </li>
      </ol>
    </article>
  </section>
</template>
