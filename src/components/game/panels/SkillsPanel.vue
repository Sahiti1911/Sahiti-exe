<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAudio } from '../../../composables/useAudio';
import { useGameProgress } from '../../../composables/useGameProgress';
import { projectById } from '../../../data/projects';
import { skills, techKey, totalTechs } from '../../../data/skills';
import type { SkillCategory, Tech } from '../../../data/types';
import { XP_REWARDS } from '../../../game/systems/XPSystem';

const { perform, has, count } = useGameProgress();
const { sfx } = useAudio();
const selected = ref<{ category: SkillCategory; tech: Tech } | null>(null);
const relatedProject = computed(() => (selected.value?.tech.projectId ? projectById(selected.value.tech.projectId) : undefined));

function inspect(category: SkillCategory, tech: Tech) {
  selected.value = { category, tech };
  if (!perform(`tech:${techKey(category.id, tech)}`, XP_REWARDS.tech)) sfx('click');
}
const seen = (category: SkillCategory, tech: Tech) => has(`tech:${techKey(category.id, tech)}`);
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-[1fr_18rem]">
    <div class="space-y-4 min-w-0">
      <p class="label-pixel !text-[8px] text-mist leading-relaxed">
        Technologies scanned: <span class="text-aqua">{{ count('tech:') }}/{{ totalTechs }}</span> · select an entry to inspect it
      </p>
      <section v-for="category in skills" :key="category.id" class="pixel-chip">
        <h3 class="label-pixel text-ink bg-aqua px-3 py-2 flex items-center justify-between">
          <span>&gt; {{ category.title }}</span>
          <span class="!text-[8px]">{{ category.techs.filter((t) => seen(category, t)).length }}/{{ category.techs.length }}</span>
        </h3>
        <div class="p-2.5 flex flex-wrap gap-2">
          <button
            v-for="tech in category.techs"
            :key="tech.id"
            class="tech"
            :class="{ seen: seen(category, tech), active: selected?.tech.id === tech.id }"
            :aria-pressed="selected?.tech.id === tech.id"
            @click="inspect(category, tech)"
          >
            <span class="dot" />{{ tech.name }}
          </button>
        </div>
      </section>
    </div>

    <aside class="pixel-chip p-4 self-start lg:sticky lg:top-0 min-h-56" aria-live="polite">
      <template v-if="selected">
        <p class="label-pixel !text-[8px] text-aqua">{{ selected.category.title }}</p>
        <h3 class="font-pixel text-[13px] text-white mt-2 leading-relaxed">{{ selected.tech.name }}</h3>
        <p class="text-[20px] leading-snug text-mist mt-3">{{ selected.tech.summary }}</p>
        <p class="label-pixel !text-[8px] text-violet-300 mt-4">How I use it</p>
        <p class="text-[20px] leading-snug text-white mt-1">{{ selected.tech.usage }}</p>
        <template v-if="relatedProject">
          <p class="label-pixel !text-[8px] text-violet-300 mt-4">Related project</p>
          <p class="text-[20px] leading-snug text-gold mt-1">{{ relatedProject.title }}</p>
        </template>
      </template>
      <p v-else class="text-[20px] text-mist leading-snug">
        <span class="text-aqua">$</span> awaiting input<span class="blink">_</span><br />Pick any technology to read what it is and where I use it.
      </p>
    </aside>
  </div>
</template>

<style scoped>
.tech {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  line-height: 1;
  padding: 7px 10px;
  color: #c7d2fe;
  background: #101a40;
  border: 2px solid #2f3f8f;
  cursor: pointer;
}
.tech:hover {
  border-color: #67e8f9;
  color: #fff;
}
.tech .dot {
  width: 6px;
  height: 6px;
  background: #2f3f8f;
}
.tech.seen .dot {
  background: #34d399;
  box-shadow: 0 0 6px #34d399;
}
.tech.active {
  background: #3b5bdb;
  border-color: #67e8f9;
  color: #fff;
}
</style>
