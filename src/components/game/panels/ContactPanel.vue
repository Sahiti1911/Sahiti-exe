<script setup lang="ts">
import { Download, Github, Linkedin, Mail } from 'lucide-vue-next';
import { computed } from 'vue';
import { profile } from '../../../data/profile';

/** Channels come straight from profile.links — anything left empty is shown as offline instead of faked. */
const channels = computed(() => [
  { id: 'email', label: 'Email', action: 'Send a message', icon: Mail, href: profile.links.email ? `mailto:${profile.links.email}` : '', display: profile.links.email, download: false },
  { id: 'github', label: 'GitHub', action: 'Open GitHub', icon: Github, href: profile.links.github, display: profile.links.github.replace(/^https?:\/\//, ''), download: false },
  { id: 'linkedin', label: 'LinkedIn', action: 'Open LinkedIn', icon: Linkedin, href: profile.links.linkedin, display: profile.links.linkedin.replace(/^https?:\/\//, ''), download: false },
  { id: 'resume', label: 'Resume', action: 'Download resume', icon: Download, href: profile.links.resume, display: 'PDF', download: true },
]);
</script>

<template>
  <p class="text-[22px] leading-snug text-white mb-4">
    Signal locked. Pick a channel to reach <span class="text-pink-300">{{ profile.name }}</span>.
  </p>
  <ul class="grid gap-3 sm:grid-cols-2">
    <li v-for="c in channels" :key="c.id">
      <component
        :is="c.href ? 'a' : 'div'"
        :href="c.href || undefined"
        :target="c.href && c.id !== 'email' ? '_blank' : undefined"
        :rel="c.href ? 'noopener noreferrer' : undefined"
        :download="c.href && c.download ? '' : undefined"
        class="channel pixel-chip p-4 flex items-center gap-4"
        :class="c.href ? 'online' : 'offline'"
        :aria-disabled="!c.href"
      >
        <span class="grid place-items-center size-12 shrink-0 bg-deep border-2" :class="c.href ? 'border-pink-300 text-pink-300' : 'border-[#2f3f8f] text-[#5a67a8]'">
          <component :is="c.icon" :size="22" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="label-pixel block" :class="c.href ? 'text-white' : 'text-mist'">{{ c.label }}</span>
          <span class="block text-[19px] leading-tight truncate mt-1.5" :class="c.href ? 'text-aqua' : 'text-mist'">
            {{ c.href ? c.display || c.action : 'Channel offline — not configured yet' }}
          </span>
        </span>
        <span v-if="c.href" class="label-pixel !text-[8px] text-pink-300 hidden sm:block">{{ c.action }} ▶</span>
      </component>
    </li>
  </ul>
  <p v-if="channels.some((c) => !c.href)" class="text-[17px] text-mist mt-4">Offline channels light up once their link is added to <span class="text-aqua">src/data/profile.ts</span>.</p>
</template>

<style scoped>
.channel.online {
  cursor: pointer;
}
.channel.online:hover {
  border-color: #f472b6;
  box-shadow:
    0 0 0 2px #0b0f2a,
    0 0 18px rgba(244, 114, 182, 0.4);
}
.channel.offline {
  opacity: 0.75;
}
</style>
