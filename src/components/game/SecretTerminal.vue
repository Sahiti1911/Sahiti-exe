<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useAudio } from '../../composables/useAudio';
import { useGameProgress } from '../../composables/useGameProgress';
import { useGameUI } from '../../composables/useGameUI';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { skills } from '../../data/skills';
import { XP_REWARDS } from '../../game/systems/XPSystem';

/** Easter egg: a working command line hidden in the north-east grove. */
const { ui, toggleDebug, secrets } = useGameUI();
const { perform, has } = useGameProgress();
const { sfx } = useAudio();

interface Line {
  text: string;
  kind?: 'cmd' | 'ok' | 'err';
}
const lines = ref<Line[]>([
  { text: 'SAHITI-OS v1.0 — unauthorised terminal detected' },
  { text: 'Type "help" to list commands.' },
]);
const input = ref('');
const field = ref<HTMLInputElement | null>(null);
const scroller = ref<HTMLElement | null>(null);
const history: string[] = [];
let cursor = 0;

const COMMANDS: Record<string, () => Line[]> = {
  help: () => [
    { text: 'help                 show this list' },
    { text: 'about                who built this world' },
    { text: 'skills               list the tech tree' },
    { text: 'projects             list discovered inventions' },
    { text: 'whoami               identify the current user' },
    { text: 'sudo unlock_secret   …you did not hear this from me' },
    { text: 'clear | exit' },
  ],
  about: () => [{ text: `${profile.name} — ${profile.role}` }, { text: `Focus: ${profile.focus}` }, { text: profile.intro }],
  skills: () => skills.map((c) => ({ text: `${c.title.toUpperCase().padEnd(22)} ${c.techs.map((t) => t.name).join(', ')}` })),
  projects: () => projects.map((p, i) => ({ text: `${String(i + 1).padStart(2, '0')}  ${p.title}` })),
  whoami: () => [{ text: 'player_001 (guest) — currently trespassing, politely.' }],
  'sudo unlock_secret': () => {
    const first = perform('egg:terminal', XP_REWARDS.egg);
    return [
      { text: '[sudo] password for player_001: ********' },
      { text: secrets.terminalSecret, kind: 'ok' },
      { text: first ? `Root Access Key added to inventory. +${XP_REWARDS.egg} XP` : 'You already hold the Root Access Key.', kind: 'ok' },
    ];
  },
  unlock_secret: () => [{ text: 'Permission denied. Are you root?', kind: 'err' }],
  debug: () => {
    toggleDebug();
    return [{ text: `debug mode ${ui.debug ? 'ENABLED' : 'DISABLED'}`, kind: 'ok' }];
  },
  ls: () => [{ text: 'about.txt  skills/  projects/  .secret' }],
  'cat .secret': () => [{ text: 'Nice try. Use sudo.', kind: 'err' }],
};

async function run() {
  const raw = input.value.trim();
  input.value = '';
  if (!raw) return;
  history.push(raw);
  cursor = history.length;
  const cmd = raw.toLowerCase().replace(/\s+/g, ' ');
  lines.value.push({ text: `> ${raw}`, kind: 'cmd' });
  if (cmd === 'exit') return close();
  if (cmd === 'clear') lines.value = [];
  else if (COMMANDS[cmd]) {
    lines.value.push(...COMMANDS[cmd]());
    sfx('click');
  } else {
    lines.value.push({ text: `command not found: ${raw} — try "help"`, kind: 'err' });
    sfx('error');
  }
  await nextTick();
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight });
}

function recall(step: number) {
  if (!history.length) return;
  cursor = Math.max(0, Math.min(history.length, cursor + step));
  input.value = history[cursor] ?? '';
}

function close() {
  ui.terminal = false;
  sfx('close');
}

onMounted(() => field.value?.focus());
</script>

<template>
  <div class="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-6 bg-[#05071c]/75" @click.self="close">
    <section role="dialog" aria-label="Secret terminal" class="term w-full max-w-2xl flex flex-col max-h-full" @click="field?.focus()">
      <header class="flex items-center justify-between px-3 py-2 border-b-2 border-[#1f9d6f]">
        <span class="label-pixel !text-[8px] text-emerald-300">secret_terminal — {{ has('egg:terminal') ? 'root' : 'guest' }}@multiverse</span>
        <button class="label-pixel !text-[8px] text-emerald-300 cursor-pointer hover:text-white" @click.stop="close">[ esc ]</button>
      </header>
      <div ref="scroller" class="scroll-pixel overflow-y-auto p-4 h-[52vh] text-[20px] leading-snug select-text">
        <p v-for="(l, i) in lines" :key="i" class="whitespace-pre-wrap break-words" :class="{ 'text-white': l.kind === 'cmd', 'text-yellow-200': l.kind === 'ok', 'text-pink-400': l.kind === 'err' }">{{ l.text }}</p>
        <form class="flex items-center gap-2 mt-1" @submit.prevent="run">
          <label for="term-input" class="text-white">&gt;</label>
          <input
            id="term-input"
            ref="field"
            v-model="input"
            class="flex-1 bg-transparent outline-none text-white caret-emerald-300"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            aria-label="Terminal command"
            @keydown.up.prevent="recall(-1)"
            @keydown.down.prevent="recall(1)"
          />
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.term {
  font-family: var(--font-term);
  color: #34d399;
  background: #020d0a;
  border: 2px solid #34d399;
  box-shadow:
    0 0 0 2px #0b0f2a,
    0 0 40px rgba(52, 211, 153, 0.35),
    inset 0 0 60px rgba(52, 211, 153, 0.08);
  background-image: repeating-linear-gradient(to bottom, rgba(52, 211, 153, 0.05) 0 1px, transparent 1px 3px);
}
</style>
