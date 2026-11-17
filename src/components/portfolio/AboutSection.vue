<script setup lang="ts">
import { profile } from '../../data/profile';
</script>

<template>
  <section id="about" class="section">
    <p class="eyebrow">About</p>
    <h2 class="heading">A full-stack developer who starts from the interface</h2>
    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <div class="card p-6 lg:col-span-2">
        <h3 class="font-semibold text-slate-900">Developer journey</h3>
        <ol class="mt-4 space-y-4">
          <li v-for="(step, i) in profile.journey" :key="step.title" class="flex gap-4">
            <span class="grid place-items-center size-8 shrink-0 rounded-full bg-blue-600 text-sm font-semibold text-white">{{ i + 1 }}</span>
            <div>
              <p class="font-medium text-slate-900">{{ step.title }}</p>
              <p class="text-slate-600 leading-relaxed">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
      <div class="space-y-6">
        <div class="card p-6">
          <h3 class="font-semibold text-slate-900">Technical interests</h3>
          <ul class="mt-4 space-y-2 text-slate-600">
            <li v-for="t in profile.technicalInterests" :key="t" class="flex gap-2"><span class="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />{{ t }}</li>
          </ul>
        </div>
        <div v-if="profile.personalInterests.length" class="card p-6">
          <h3 class="font-semibold text-slate-900">Outside of work</h3>
          <ul class="mt-4 flex flex-wrap gap-2">
            <li v-for="t in profile.personalInterests" :key="t" class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{{ t }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
