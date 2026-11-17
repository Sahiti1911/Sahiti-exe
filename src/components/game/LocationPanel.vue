<script setup lang="ts">
import { computed } from 'vue';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import { locationById } from '../../data/quests';
import type { LocationId } from '../../data/types';
import { XP_REWARDS } from '../../game/systems/XPSystem';
import LocationBanner from './LocationBanner.vue';
import OverlayFrame from './OverlayFrame.vue';
import AboutPanel from './panels/AboutPanel.vue';
import AchievementsPanel from './panels/AchievementsPanel.vue';
import CareerPanel from './panels/CareerPanel.vue';
import ContactPanel from './panels/ContactPanel.vue';
import ProjectsPanel from './panels/ProjectsPanel.vue';
import SkillsPanel from './panels/SkillsPanel.vue';

/** The window that opens when the player enters a building. */
const props = defineProps<{ id: LocationId }>();
const { closePanel, say, secrets } = useGameUI();
const { perform } = useGameProgress();

const PANELS = { house: AboutPanel, lab: SkillsPanel, projects: ProjectsPanel, career: CareerPanel, hall: AchievementsPanel, tower: ContactPanel };
const info = computed(() => locationById(props.id));

/** Easter egg: the hidden developer quote. */
function duck() {
  perform('egg:quote', XP_REWARDS.egg);
  closePanel();
  say('Rubber Duck', ['The duck stares at you. You stare back.', secrets.developerQuote]);
}
</script>

<template>
  <OverlayFrame :title="info.name" :subtitle="info.purpose" :accent="info.color" wide @close="closePanel">
    <template #banner><LocationBanner :id="id" @duck="duck" /></template>
    <component :is="PANELS[id]" />
  </OverlayFrame>
</template>
