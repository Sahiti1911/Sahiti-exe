<script setup lang="ts">
import { profile } from '../../../data/profile';
import PixelAvatar from '../../shared/PixelAvatar.vue';
</script>

<template>
  <div class="grid gap-5 md:grid-cols-[auto_1fr]">
    <aside class="pixel-chip p-4 flex md:flex-col items-center gap-4 md:w-52">
      <div class="bg-deep border-2 border-aqua p-2 shadow-[0_0_14px_rgba(103,232,249,.4)]"><PixelAvatar :scale="4" /></div>
      <dl class="text-[20px] leading-tight space-y-2 md:text-center">
        <div><dt class="label-pixel !text-[7px] text-aqua">Name</dt><dd class="text-white">{{ profile.name }}</dd></div>
        <div><dt class="label-pixel !text-[7px] text-aqua">Class</dt><dd class="text-white">{{ profile.role }}</dd></div>
        <div><dt class="label-pixel !text-[7px] text-aqua">Focus</dt><dd class="text-white">{{ profile.focus }}</dd></div>
      </dl>
    </aside>

    <div class="space-y-5 min-w-0">
      <section>
        <h3 class="label-pixel text-aqua mb-2">Introduction</h3>
        <p class="text-[22px] leading-snug text-white">"{{ profile.intro }}"</p>
      </section>
      <section>
        <h3 class="label-pixel text-aqua mb-2">Technical interests</h3>
        <ul class="flex flex-wrap gap-2">
          <li v-for="t in profile.technicalInterests" :key="t" class="pixel-chip px-2.5 py-1 text-[19px] text-mist">{{ t }}</li>
        </ul>
      </section>
      <section>
        <h3 class="label-pixel text-aqua mb-2">Developer journey</h3>
        <ol class="space-y-2">
          <li v-for="(step, i) in profile.journey" :key="step.title" class="flex gap-3">
            <span class="font-pixel text-[9px] grid place-items-center size-7 shrink-0 bg-neon text-white border-2 border-ink">{{ i + 1 }}</span>
            <p class="text-[20px] leading-snug"><span class="text-white">{{ step.title }}.</span> <span class="text-mist">{{ step.text }}</span></p>
          </li>
        </ol>
      </section>
      <section v-if="profile.personalInterests.length">
        <h3 class="label-pixel text-aqua mb-2">Off the clock</h3>
        <ul class="flex flex-wrap gap-2">
          <li v-for="t in profile.personalInterests" :key="t" class="pixel-chip px-2.5 py-1 text-[19px] text-mist">{{ t }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>
