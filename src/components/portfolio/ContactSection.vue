<script setup lang="ts">
import { Download, Github, Linkedin, Mail } from 'lucide-vue-next';
import { computed } from 'vue';
import { profile } from '../../data/profile';

/** Only channels that are actually configured in profile.ts are rendered. */
const channels = computed(() =>
  [
    { label: 'Email', text: profile.links.email, href: profile.links.email ? `mailto:${profile.links.email}` : '', icon: Mail, external: false, download: false },
    { label: 'GitHub', text: profile.links.github.replace(/^https?:\/\//, ''), href: profile.links.github, icon: Github, external: true, download: false },
    { label: 'LinkedIn', text: profile.links.linkedin.replace(/^https?:\/\//, ''), href: profile.links.linkedin, icon: Linkedin, external: true, download: false },
    { label: 'Resume', text: 'Download PDF', href: profile.links.resume, icon: Download, external: false, download: true },
  ].filter((c) => c.href),
);
</script>

<template>
  <section id="contact" class="bg-gradient-to-b from-white to-blue-50 border-t border-slate-100">
    <div class="section text-center">
      <p class="eyebrow">Contact</p>
      <h2 class="heading">Let's build something together</h2>
      <p v-if="channels.length" class="mx-auto mt-2 max-w-xl text-slate-600">Reach out through any of the channels below.</p>
      <ul v-if="channels.length" class="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2 text-left">
        <li v-for="c in channels" :key="c.label">
          <a
            :href="c.href"
            :target="c.external ? '_blank' : undefined"
            :rel="c.external ? 'noopener noreferrer' : undefined"
            :download="c.download ? '' : undefined"
            class="card p-5 flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition"
          >
            <span class="grid place-items-center size-11 shrink-0 rounded-xl bg-blue-600 text-white"><component :is="c.icon" :size="20" /></span>
            <span class="min-w-0">
              <span class="block font-semibold text-slate-900">{{ c.label }}</span>
              <span class="block truncate text-sm text-slate-600">{{ c.text }}</span>
            </span>
          </a>
        </li>
      </ul>
      <p v-else class="card mx-auto mt-8 max-w-xl p-6 text-slate-600">Contact details are being added — please check back soon.</p>
    </div>
  </section>
</template>
