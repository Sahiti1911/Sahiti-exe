<script setup lang="ts">
import { profile } from '../../data/profile';
import Navigation from '../shared/Navigation.vue';
import AboutSection from './AboutSection.vue';
import AchievementsSection from './AchievementsSection.vue';
import ContactSection from './ContactSection.vue';
import ExperienceSection from './ExperienceSection.vue';
import HeroSection from './HeroSection.vue';
import ProjectsSection from './ProjectsSection.vue';
import SkillsSection from './SkillsSection.vue';

/** Portfolio Mode: the same data as the game, presented as a clean, scannable page for recruiters. */
const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];
</script>

<template>
  <div class="portfolio min-h-full bg-white text-slate-800 font-sans antialiased">
    <header class="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-slate-200">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="#top" class="font-semibold tracking-tight text-slate-900 whitespace-nowrap">{{ profile.name }}</a>
        <nav class="hidden lg:flex items-center gap-6 text-sm text-slate-600" aria-label="Sections">
          <a v-for="n in NAV" :key="n.id" :href="`#${n.id}`" class="hover:text-blue-700">{{ n.label }}</a>
        </nav>
        <Navigation theme="light" />
      </div>
    </header>

    <main id="top">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <AchievementsSection />
      <ContactSection />
    </main>

    <footer class="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
      {{ profile.name }} · {{ profile.role }} · Built with Vue, TypeScript and Phaser
    </footer>
  </div>
</template>

<style>
.portfolio section[id] {
  scroll-margin-top: 5rem;
}
.portfolio .section {
  margin-inline: auto;
  max-width: 72rem;
  padding: 4.5rem 1rem;
}
@media (min-width: 640px) {
  .portfolio .section {
    padding-inline: 1.5rem;
  }
}
.portfolio .eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #2563eb;
}
.portfolio .heading {
  margin-top: 0.5rem;
  font-size: clamp(1.6rem, 3.2vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
}
.portfolio .card {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
</style>
