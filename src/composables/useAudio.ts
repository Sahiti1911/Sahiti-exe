import { ref } from 'vue';

/** Tiny synthesised chiptune audio — no audio files needed. */
const STORAGE_KEY = 'sahiti.exe:sound';
const enabled = ref(readPref());

function readPref() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicTimer: number | undefined;
let musicStep = 0;
let musicWanted = false;

function ensure(): AudioContext | null {
  try {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.07, delay = 0) {
  const c = ensure();
  if (!c || !master) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

const SFX = {
  step: () => tone(110, 0.04, 'triangle', 0.035),
  click: () => tone(520, 0.05, 'square', 0.05),
  open: () => [392, 523, 659].forEach((f, i) => tone(f, 0.09, 'square', 0.06, i * 0.06)),
  close: () => [523, 392].forEach((f, i) => tone(f, 0.07, 'square', 0.05, i * 0.05)),
  talk: () => tone(340 + Math.random() * 60, 0.03, 'square', 0.025),
  xp: () => [880, 1175].forEach((f, i) => tone(f, 0.08, 'triangle', 0.08, i * 0.07)),
  mission: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, 'square', 0.06, i * 0.09)),
  achievement: () => [659, 784, 988, 1319, 1568].forEach((f, i) => tone(f, 0.16, 'triangle', 0.09, i * 0.08)),
  secret: () => [392, 494, 587, 740, 880, 1175].forEach((f, i) => tone(f, 0.12, 'sawtooth', 0.04, i * 0.06)),
  error: () => [196, 147].forEach((f, i) => tone(f, 0.12, 'sawtooth', 0.05, i * 0.1)),
} as const;

export type SfxName = keyof typeof SFX;

// A slow A-minor pentatonic arpeggio; 0 = rest.
const MELODY = [220, 0, 330, 0, 392, 0, 330, 262, 294, 0, 440, 0, 392, 0, 330, 0];
const BASS = [110, 110, 87, 98];

function tickMusic() {
  if (!enabled.value) return;
  const note = MELODY[musicStep % MELODY.length];
  if (note) tone(note, 0.5, 'triangle', 0.03);
  if (musicStep % 4 === 0) tone(BASS[(musicStep / 4) % BASS.length | 0], 1.1, 'sine', 0.05);
  musicStep++;
}

function syncMusic() {
  const shouldPlay = musicWanted && enabled.value;
  if (shouldPlay && musicTimer === undefined) {
    ensure();
    musicTimer = window.setInterval(tickMusic, 300);
  } else if (!shouldPlay && musicTimer !== undefined) {
    clearInterval(musicTimer);
    musicTimer = undefined;
  }
}

export function useAudio() {
  return {
    enabled,
    sfx(name: SfxName) {
      if (enabled.value) SFX[name]();
    },
    toggle() {
      enabled.value = !enabled.value;
      try {
        localStorage.setItem(STORAGE_KEY, enabled.value ? 'on' : 'off');
      } catch {
        /* storage unavailable — the toggle still works for this session */
      }
      syncMusic();
      if (enabled.value) SFX.click();
    },
    setMusic(on: boolean) {
      musicWanted = on;
      syncMusic();
    },
  };
}
