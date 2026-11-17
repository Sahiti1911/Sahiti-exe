<script setup lang="ts">
import { Building2 } from 'lucide-vue-next';
import { experience } from '../../../data/experience';
</script>

<template>
  <div class="space-y-6">
    <article v-for="job in experience" :key="job.company + job.role">
      <header class="pixel-chip p-4 flex items-center gap-4">
        <span class="grid place-items-center size-12 shrink-0 bg-deep border-2 border-sky-300 text-sky-300"><Building2 :size="22" /></span>
        <div class="min-w-0">
          <h3 class="font-pixel text-[12px] sm:text-[14px] text-white leading-relaxed">{{ job.role }}</h3>
          <p class="text-[22px] leading-tight text-sky-300">
            {{ job.company }}<span v-if="job.period" class="text-mist"> · {{ job.period }}</span>
          </p>
          <p class="text-[19px] leading-snug text-mist mt-1">{{ job.summary }}</p>
        </div>
      </header>

      <h4 class="label-pixel text-aqua mt-5 mb-3">Contribution timeline</h4>
      <ol class="timeline">
        <li v-for="(item, i) in job.timeline" :key="item.title">
          <span class="node">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="pixel-chip px-3 py-2 flex-1 min-w-0">
            <p class="text-[21px] leading-tight text-white">{{ item.title }}</p>
            <p class="text-[18px] leading-snug text-mist mt-0.5">{{ item.text }}</p>
          </div>
        </li>
      </ol>
    </article>
  </div>
</template>

<style scoped>
.timeline {
  position: relative;
  display: grid;
  gap: 10px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: repeating-linear-gradient(to bottom, #4f6bff 0 6px, transparent 6px 10px);
}
.timeline li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}
.node {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: #0b0f2a;
  background: #7dd3fc;
  border: 2px solid #0b0f2a;
  box-shadow: 0 0 10px rgba(125, 211, 252, 0.6);
}
</style>
