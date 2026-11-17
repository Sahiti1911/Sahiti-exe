import { P, blob, hash, makeCanvas, outline, r, shade, tri } from './canvas';

export const TREE_FW = 36;
export const TREE_FH = 48;

/** 2 species × 2 sway frames. Frame = variant * 2 + sway. Canopies carry faint bioluminescent buds. */
export function makeTrees() {
  const { canvas, ctx: c } = makeCanvas(TREE_FW * 4, TREE_FH);
  for (let variant = 0; variant < 2; variant++) {
    for (let sway = 0; sway < 2; sway++) {
      const ox = (variant * 2 + sway) * TREE_FW;
      const s = sway; // canopy drifts 1px on the second frame
      // trunk + roots
      r(c, ox + 16, 34, 4, 12, P.trunk);
      r(c, ox + 18, 34, 2, 12, P.trunkD);
      r(c, ox + 14, 44, 2, 2, P.trunk);
      r(c, ox + 20, 45, 2, 1, P.trunkD);
      r(c, ox + 16, 37, 1, 2, '#5b4580');

      if (variant === 0) {
        blob(c, ox + 18 + s, 20, 15, 15, P.leafD);
        blob(c, ox + 16 + s, 17, 12, 11, P.leaf);
        blob(c, ox + 12 + s, 12, 7, 6, P.leafL);
        blob(c, ox + 23 + s, 22, 6, 5, P.leaf);
        // leaf clusters
        for (let i = 0; i < 46; i++) {
          const a = hash(i, 1, 30) * Math.PI * 2;
          const d = Math.sqrt(hash(i, 2, 30)) * 13;
          const x = Math.round(18 + Math.cos(a) * d);
          const y = Math.round(20 + Math.sin(a) * d);
          const lit = x + y < 34;
          r(c, ox + x + s, y, 2, 1, lit ? P.leafL : P.leafD);
          if (lit && hash(i, 3, 30) < 0.4) r(c, ox + x + s, y - 1, 1, 1, P.leafHi);
        }
        r(c, ox + 8 + s, 9, 3, 1, P.leafHi);
        r(c, ox + 7 + s, 11, 2, 1, P.leafHi);
        r(c, ox + 13 + s, 7, 3, 1, P.leafHi);
      } else {
        // pine: three stacked tiers, lit on the left
        const tiers: Array<[number, number, number]> = [
          [4, 20, 28], [7, 10, 22], [10, 1, 16],
        ];
        tiers.forEach(([x, y, w], t) => {
          const dx = t === 2 ? s : 0;
          tri(c, ox + x + dx, y, w, 17, P.leafD);
          tri(c, ox + x + dx, y, w - 8, 13, P.leaf);
          tri(c, ox + x + dx + 1, y + 2, w - 16, 8, P.leafL);
          for (let i = 0; i < 6; i++) r(c, ox + x + dx + 3 + i * 4, y + 15 + (i % 2), 2, 2, P.leafD);
        });
        r(c, ox + 15 + s, 4, 2, 1, P.leafHi);
        r(c, ox + 12, 15, 3, 1, P.leafHi);
        r(c, ox + 9, 26, 3, 1, P.leafHi);
      }
      // glowing buds that twinkle with the sway
      const buds: Array<[number, number]> = variant === 0 ? [[11, 18], [22, 13], [25, 25], [15, 27]] : [[13, 22], [22, 30], [17, 12]];
      buds.forEach(([x, y], i) => {
        if ((i + sway) % 2 === 0) r(c, ox + x + s, y, 1, 1, i % 2 ? P.violetL : P.cyan);
      });
    }
  }
  return outline(canvas, P.outline, TREE_FW, TREE_FH);
}

/** Street lamp, 2 flicker frames (18×40). */
export function makeLamp() {
  const { canvas, ctx: c } = makeCanvas(36, 40);
  for (let f = 0; f < 2; f++) {
    const ox = f * 18;
    r(c, ox + 6, 36, 6, 3, '#2f3f8f');
    r(c, ox + 7, 34, 4, 2, '#3d4fa8');
    r(c, ox + 8, 12, 2, 22, '#2f3f8f');
    r(c, ox + 8, 12, 1, 22, '#5b6fd0');
    r(c, ox + 7, 20, 4, 1, '#5b6fd0');
    // lantern
    r(c, ox + 5, 10, 8, 2, '#1b2a63');
    r(c, ox + 6, 3, 6, 7, f ? '#e9fbff' : '#c9f4ff');
    r(c, ox + 7, 4, 4, 5, '#ffffff');
    r(c, ox + 6, 3, 1, 7, P.cyan);
    r(c, ox + 11, 3, 1, 7, P.cyanD);
    r(c, ox + 5, 2, 8, 1, '#1b2a63');
    r(c, ox + 7, 1, 4, 1, '#2f3f8f');
  }
  return outline(canvas, P.outline, 18, 40);
}

/** 2 bush variants (18×14). */
export function makeBushes() {
  const { canvas, ctx: c } = makeCanvas(36, 14);
  for (let v = 0; v < 2; v++) {
    const ox = v * 18;
    blob(c, ox + 9, 8, 7, 5, P.leafD);
    blob(c, ox + 8, 7, 5, 4, P.leaf);
    blob(c, ox + 6, 5, 3, 2, P.leafL);
    r(c, ox + 5, 4, 2, 1, P.leafHi);
    if (v) {
      r(c, ox + 10, 6, 2, 2, P.pink);
      r(c, ox + 6, 9, 2, 2, P.violetL);
      r(c, ox + 12, 9, 1, 1, P.cyan);
    } else {
      r(c, ox + 11, 8, 1, 1, P.cyan);
      r(c, ox + 7, 9, 1, 1, P.cyan);
    }
  }
  return outline(canvas, P.outline, 18, 14);
}

export function makeBench() {
  const { canvas, ctx: c } = makeCanvas(34, 18);
  r(c, 2, 3, 30, 6, '#4a3a8a');
  r(c, 2, 3, 30, 1, '#7a66c8');
  for (let i = 0; i < 5; i++) r(c, 7 + i * 6, 4, 1, 5, '#33276a');
  r(c, 1, 9, 32, 4, '#5b45a8');
  r(c, 1, 9, 32, 1, '#8b74dc');
  r(c, 3, 13, 2, 4, '#2f3f8f');
  r(c, 29, 13, 2, 4, '#2f3f8f');
  return outline(canvas);
}

/** The Multiverse Core monolith: frame 0 dormant, frames 1–2 awake (34×52). */
export function makeMonolith() {
  const { canvas, ctx: c } = makeCanvas(34 * 3, 52);
  for (let f = 0; f < 3; f++) {
    const ox = f * 34;
    const on = f > 0;
    r(c, ox + 3, 44, 28, 6, '#2f2a66');
    r(c, ox + 3, 44, 28, 1, '#5b55a8');
    r(c, ox + 6, 40, 22, 4, '#3d3880');
    r(c, ox + 6, 40, 22, 1, '#6a63bd');
    // obelisk
    r(c, ox + 10, 6, 14, 34, '#2c3690');
    r(c, ox + 10, 6, 4, 34, '#4a58c4');
    r(c, ox + 20, 6, 4, 34, '#1d2468');
    tri(c, ox + 10, 1, 14, 6, '#4a58c4');
    // runes
    const rune = on ? (f === 1 ? P.cyan : '#d5fbff') : '#6f80e0';
    r(c, ox + 15, 10, 4, 1, rune);
    r(c, ox + 16, 11, 2, 4, rune);
    r(c, ox + 14, 18, 6, 1, rune);
    r(c, ox + 14, 20, 2, 3, rune);
    r(c, ox + 18, 20, 2, 3, rune);
    r(c, ox + 15, 27, 4, 4, on ? (f === 1 ? P.violetL : '#ffffff') : '#6f80e0');
    r(c, ox + 16, 28, 2, 2, on ? '#ffffff' : '#1c2260');
    r(c, ox + 14, 34, 6, 1, rune);
    if (on) {
      r(c, ox + 6, 43, 22, 1, P.cyan);
      r(c, ox + 16, 2, 2, 2, '#ffffff');
    }
  }
  return outline(canvas, P.outline, 34, 52);
}

/** Hidden terminal, 2 flicker frames (18×24). */
export function makeTerminal() {
  const { canvas, ctx: c } = makeCanvas(36, 24);
  for (let f = 0; f < 2; f++) {
    const ox = f * 18;
    r(c, ox + 2, 2, 14, 12, '#2a3470');
    r(c, ox + 2, 2, 14, 1, '#5b6fd0');
    r(c, ox + 4, 4, 10, 8, '#04140f');
    r(c, ox + 5, 5, 5, 1, P.green);
    r(c, ox + 5, 7, 7, 1, '#1f9d6f');
    r(c, ox + 5, 9, 3, 1, P.green);
    if (f) r(c, ox + 9, 9, 2, 1, '#b6ffdf');
    r(c, ox + 7, 14, 4, 2, '#1b2a63');
    r(c, ox + 3, 16, 12, 3, '#2a3470');
    r(c, ox + 4, 17, 10, 1, '#5b6fd0');
    r(c, ox + 5, 19, 2, 3, '#1b2a63');
    r(c, ox + 11, 19, 2, 3, '#1b2a63');
  }
  return outline(canvas, P.outline, 18, 24);
}

/** Golden bug collectible, 2 frames (12×12). */
export function makeBug() {
  const { canvas, ctx: c } = makeCanvas(24, 12);
  for (let f = 0; f < 2; f++) {
    const ox = f * 12;
    r(c, ox + 4, 3, 4, 6, P.gold);
    r(c, ox + 4, 3, 2, 6, '#ffe38a');
    r(c, ox + 5, 2, 2, 1, '#b97f06');
    r(c, ox + 6, 4, 1, 5, '#b97f06');
    const dy = f ? 1 : 0;
    r(c, ox + 2, 4 + dy, 2, 1, '#b97f06');
    r(c, ox + 8, 4 + dy, 2, 1, '#b97f06');
    r(c, ox + 2, 7 - dy, 2, 1, '#b97f06');
    r(c, ox + 8, 7 - dy, 2, 1, '#b97f06');
    r(c, ox + 4, 1, 1, 1, '#ffe38a');
    r(c, ox + 7, 1, 1, 1, '#ffe38a');
  }
  return outline(canvas, P.outline, 12, 12);
}

export function makeShadow() {
  const { canvas, ctx: c } = makeCanvas(14, 6);
  c.globalAlpha = 0.4;
  blob(c, 7, 3, 6, 2, '#040618');
  return canvas;
}

/** Soft cloud silhouette used for drifting cloud shadows and the title sky. */
export function makeCloud() {
  const { canvas, ctx: c } = makeCanvas(96, 36);
  const col = '#ffffff';
  blob(c, 30, 22, 26, 10, col);
  blob(c, 52, 16, 22, 13, col);
  blob(c, 72, 24, 20, 9, col);
  blob(c, 40, 12, 12, 8, col);
  blob(c, 18, 26, 14, 6, col);
  blob(c, 60, 27, 24, 7, col);
  return canvas;
}

/** Banded radial light stamp (alpha only). Used to carve light pools out of the night overlay. */
export function makeLightStamp(size = 128) {
  const { canvas, ctx } = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - size / 2 + 0.5, y - size / 2 + 0.5) / (size / 2);
      const a = d < 0.2 ? 1 : d < 0.32 ? 0.86 : d < 0.44 ? 0.7 : d < 0.56 ? 0.54 : d < 0.68 ? 0.4 : d < 0.8 ? 0.27 : d < 0.9 ? 0.16 : d < 1 ? 0.07 : 0;
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = a * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Small banded glow for additive colour halos. */
export function makeGlow(size = 64) {
  const { canvas, ctx } = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - size / 2 + 0.5, y - size / 2 + 0.5) / (size / 2);
      const a = d < 0.16 ? 0.8 : d < 0.3 ? 0.56 : d < 0.46 ? 0.38 : d < 0.62 ? 0.24 : d < 0.8 ? 0.13 : d < 1 ? 0.06 : 0;
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = a * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export function makeDot() {
  const { canvas, ctx: c } = makeCanvas(3, 3);
  r(c, 1, 0, 1, 3, '#ffffff');
  r(c, 0, 1, 3, 1, '#ffffff');
  return canvas;
}

export function makePixel() {
  const { canvas, ctx: c } = makeCanvas(2, 2);
  r(c, 0, 0, 2, 2, '#ffffff');
  return canvas;
}

/** Bobbing arrow shown above places the player has not visited yet. */
export function makeMarker() {
  const { canvas, ctx: c } = makeCanvas(11, 9);
  r(c, 1, 1, 9, 2, P.cyan);
  r(c, 2, 3, 7, 1, P.cyan);
  r(c, 3, 4, 5, 1, P.cyan);
  r(c, 4, 5, 3, 1, P.cyanD);
  r(c, 5, 6, 1, 1, P.cyanD);
  r(c, 2, 1, 4, 1, '#ffffff');
  return outline(canvas);
}

/** Chimney smoke puff. */
export function makeSmoke() {
  const { canvas, ctx: c } = makeCanvas(8, 8);
  blob(c, 4, 4, 3, 3, '#c7d2fe');
  r(c, 2, 2, 2, 1, '#ffffff');
  return canvas;
}

/** Expanding signal ring for the Communication Tower (3 frames, 24×12). */
export function makeSignal() {
  const { canvas, ctx: c } = makeCanvas(72, 12);
  for (let f = 0; f < 3; f++) {
    const ox = f * 24;
    const rad = 4 + f * 3;
    for (let a = 200; a <= 340; a += 6) {
      const x = Math.round(12 + Math.cos((a * Math.PI) / 180) * rad);
      const y = Math.round(11 + Math.sin((a * Math.PI) / 180) * rad * 0.9);
      c.globalAlpha = 1 - f * 0.28;
      r(c, ox + x, y, 1, 1, P.cyan);
    }
  }
  c.globalAlpha = 1;
  return canvas;
}

export { shade };
