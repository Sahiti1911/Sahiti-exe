import { P, blob, hash, makeCanvas, r } from './canvas';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const SKY = ['#070a1f', '#0b0f2a', '#101a40', '#18205a', '#261f6a', '#3a2a84', '#5a3aa6'];

/** Dithered night-sky bands (16×160), stretched horizontally as a tile. */
export function makeSky() {
  const h = 160;
  const { canvas, ctx: c } = makeCanvas(16, h);
  for (let y = 0; y < h; y++) {
    const f = (y / h) * (SKY.length - 1);
    const base = Math.floor(f);
    const frac = f - base;
    for (let x = 0; x < 16; x++) {
      const up = frac > (BAYER[(x & 3) + (y & 3) * 4] + 0.5) / 16;
      r(c, x, y, 1, 1, SKY[Math.min(SKY.length - 1, base + (up ? 1 : 0))]);
    }
  }
  return canvas;
}

export function makeMoon() {
  const { canvas, ctx: c } = makeCanvas(32, 32);
  blob(c, 16, 16, 14, 14, '#dfe7ff');
  blob(c, 14, 14, 11, 11, '#f4f7ff');
  blob(c, 21, 20, 3, 3, '#b9c6f2');
  blob(c, 11, 22, 2, 2, '#b9c6f2');
  blob(c, 19, 10, 2, 2, '#c7d2fe');
  r(c, 9, 12, 2, 1, '#c7d2fe');
  return canvas;
}

/** Tileable city skyline (256×110). `near` adds neon signs and brighter windows. */
export function makeSkyline(near: boolean) {
  const W = 256;
  const H = 110;
  const { canvas, ctx: c } = makeCanvas(W, H);
  const body = near ? '#0d1238' : '#1a1f5c';
  const edge = near ? '#1b2466' : '#262d78';
  let x = 0;
  let i = 0;
  while (x < W) {
    const w = 14 + ((hash(i, near ? 1 : 2, 90) * 22) | 0);
    const h = (near ? 30 : 46) + ((hash(i, near ? 3 : 4, 90) * (near ? 46 : 58)) | 0);
    const bw = Math.min(w, W - x);
    r(c, x, H - h, bw, h, body);
    r(c, x, H - h, 1, h, edge);
    r(c, x, H - h, bw, 1, edge);
    if (hash(i, 5, 90) < 0.4) {
      r(c, x + (bw >> 1), H - h - 8, 1, 8, edge);
      if (near) r(c, x + (bw >> 1) - 1, H - h - 9, 3, 2, P.pink);
    }
    if (hash(i, 6, 90) < 0.3 && bw > 10) r(c, x + 3, H - h - 4, bw - 6, 4, body);
    for (let wy = H - h + 4; wy < H - 4; wy += 5) {
      for (let wx = x + 3; wx < x + bw - 3; wx += 4) {
        const v = hash(wx, wy, near ? 91 : 92);
        if (v < (near ? 0.3 : 0.16)) r(c, wx, wy, 2, 2, v < 0.05 ? P.violetL : near ? P.cyan : '#6f8fe8');
        else if (near && v < 0.4) r(c, wx, wy, 2, 2, '#1b2a70');
      }
    }
    if (near && hash(i, 7, 90) < 0.35 && bw > 14) {
      r(c, x + 3, H - h + 6, bw - 6, 5, '#0b0f2a');
      r(c, x + 4, H - h + 7, bw - 8, 3, hash(i, 8, 90) < 0.5 ? P.violet : P.cyanD);
    }
    x += w;
    i++;
  }
  return canvas;
}

/** Tileable ground strip for the title scene (64×64): grass verge, cobbled road, grass. */
export function makeIntroGround() {
  const { canvas, ctx: c } = makeCanvas(64, 64);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      let col: string;
      if (y < 6 || y >= 26) {
        const n = hash(x >> 1, y >> 1, 95);
        col = n < 0.3 ? '#123041' : n < 0.8 ? '#173b4b' : '#1c4857';
        if (hash(x, y, 96) < 0.03) col = '#2c7474';
        if (y === 0) col = '#2c7474';
      } else {
        const row = Math.floor((y - 6) / 5);
        const ox = (x + (row % 2) * 5) % 64;
        col = ox % 10 === 0 || (y - 6) % 5 === 0 ? '#262350' : ['#3f3a74', '#474282', '#39356c'][(hash(Math.floor(ox / 10), row, 97) * 3) | 0];
        if (y === 6 || y === 25) col = '#1c193f';
      }
      r(c, x, y, 1, 1, col);
    }
  }
  return canvas;
}
