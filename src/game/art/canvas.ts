/**
 * Pixel-art drawing primitives. Everything in game/art is plain Canvas 2D (no Phaser),
 * so the same art can be used by the game and by Vue components.
 *
 * The art is authored in code and baked into spritesheet / tileset textures at load time.
 * To swap in hand-drawn art, replace the matching entry in art/index.ts with a PNG of the same frame size.
 */
export type Ctx = CanvasRenderingContext2D;

export const P = {
  ink: '#0b0f2a',
  outline: '#070a1f',
  navy: '#101a40',
  deep: '#16245a',
  steel: '#1b2a63',
  wall: '#243273',
  plum: '#2a1f5c',
  plum2: '#3d2c7a',
  plum3: '#5b45a8',
  violet: '#8b5cf6',
  violetL: '#b79bff',
  blue: '#2563eb',
  volt: '#4f6bff',
  sky: '#7dd3fc',
  cyan: '#67e8f9',
  cyanD: '#22b8cf',
  white: '#e8f0ff',
  mist: '#c7d2fe',
  mistD: '#8fa3d9',
  gold: '#fbbf24',
  warm: '#fde68a',
  pink: '#f472b6',
  green: '#34d399',
  leafD: '#0c3f4c',
  leaf: '#125f63',
  leafL: '#1b867c',
  leafHi: '#4fd0b4',
  trunk: '#3b2a55',
  trunkD: '#281c40',
} as const;

export function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

export function r(c: Ctx, x: number, y: number, w: number, h: number, col: string) {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}

/** Un-antialiased filled ellipse. */
export function blob(c: Ctx, cx: number, cy: number, rx: number, ry: number, col: string) {
  c.fillStyle = col;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    const k = 1 - ((y - cy) / ry) ** 2;
    if (k < 0) continue;
    const hw = Math.round(rx * Math.sqrt(k));
    if (hw > 0) c.fillRect(Math.round(cx) - hw, y, hw * 2, 1);
  }
}

/** Isosceles triangle with the apex at the top. */
export function tri(c: Ctx, x: number, y: number, w: number, h: number, col: string) {
  for (let i = 0; i < h; i++) {
    const ww = Math.max(2, Math.round((w * (i + 1)) / h));
    r(c, x + (w - ww) / 2, y + i, ww, 1, col);
  }
}

/** Deterministic 2D hash in [0, 1). */
export function hash(x: number, y: number, seed = 0) {
  let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise in [0, 1). */
export function vnoise(x: number, y: number, seed = 0) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0, seed);
  const b = hash(x0 + 1, y0, seed);
  const c = hash(x0, y0 + 1, seed);
  const d = hash(x0 + 1, y0 + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

export function hexRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

/**
 * Adds a 1px outline around every opaque shape — the single biggest step from "rectangles" to pixel art.
 * With `fw`/`fh` the outline is computed per frame so neighbouring frames never bleed into each other.
 */
export function outline(canvas: HTMLCanvasElement, col: string = P.outline, fw = canvas.width, fh = canvas.height) {
  const ctx = canvas.getContext('2d')!;
  const { width: W, height: H } = canvas;
  const img = ctx.getImageData(0, 0, W, H);
  const src = new Uint8ClampedArray(img.data);
  const [cr, cg, cb] = hexRgb(col);
  const solid = (x: number, y: number, fx: number, fy: number) =>
    x >= fx && y >= fy && x < fx + fw && y < fy + fh && src[(y * W + x) * 4 + 3] > 40;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (src[i + 3] > 40) continue;
      const fx = Math.floor(x / fw) * fw;
      const fy = Math.floor(y / fh) * fh;
      if (solid(x - 1, y, fx, fy) || solid(x + 1, y, fx, fy) || solid(x, y - 1, fx, fy) || solid(x, y + 1, fx, fy)) {
        img.data[i] = cr;
        img.data[i + 1] = cg;
        img.data[i + 2] = cb;
        img.data[i + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Translucent overlay, used for shading (dark) and moonlight (light). */
export function shade(c: Ctx, x: number, y: number, w: number, h: number, alpha: number, col = '#05071c') {
  c.globalAlpha = alpha;
  r(c, x, y, w, h, col);
  c.globalAlpha = 1;
}

const FONT: Record<string, string> = {
  A: '010101111101101',
  B: '110101110101110',
  C: '011100100100011',
  D: '110101101101110',
  E: '111100110100111',
  H: '101101111101101',
  J: '001001001101010',
  L: '100100100100111',
  M: '101111111101101',
  N: '110101101101101',
  O: '010101101101010',
  P: '110101110100100',
  Q: '010101101110011',
  R: '110101110101101',
  S: '011100010001110',
  T: '111010010010010',
  '<': '001010100010001',
  '>': '100010001010100',
  '/': '001001010100100',
};

/** 3×5 pixel font for neon signs. */
export function text(c: Ctx, str: string, x: number, y: number, col: string, s = 1) {
  let cx = x;
  for (const ch of str) {
    const glyph = FONT[ch];
    if (glyph) {
      for (let i = 0; i < 15; i++) if (glyph[i] === '1') r(c, cx + (i % 3) * s, y + Math.floor(i / 3) * s, s, s, col);
    }
    cx += 4 * s;
  }
}

export const textWidth = (str: string, s = 1) => str.length * 4 * s - s;

/** A neon sign plate with centred text. */
export function sign(c: Ctx, str: string, cx: number, y: number, col: string, s = 1, lit = true) {
  const w = textWidth(str, s) + 6;
  const h = 5 * s + 6;
  const x = Math.round(cx - w / 2);
  r(c, x, y, w, h, P.outline);
  r(c, x + 1, y + 1, w - 2, h - 2, '#141a48');
  r(c, x + 1, y + 1, w - 2, 1, '#2f3f8f');
  text(c, str, x + 3, y + 3, lit ? col : P.white, s);
}
