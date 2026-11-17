import type { LocationId } from '../../data/types';
import { type Ctx, P, blob, hash, r, shade, text, tri } from './canvas';

/** Interior banner size. Drawn at 1× and scaled up with nearest-neighbour by the panel. */
export const INTERIOR_W = 200;
export const INTERIOR_H = 64;
const FLOOR = 44;

function room(c: Ctx, wall: string, wallD: string, floorA: string, floorB: string) {
  r(c, 0, 0, INTERIOR_W, FLOOR, wall);
  for (let x = 0; x < INTERIOR_W; x += 20) r(c, x, 0, 1, FLOOR, wallD);
  shade(c, 0, 0, INTERIOR_W, 6, 0.3);
  r(c, 0, FLOOR - 3, INTERIOR_W, 3, wallD);
  r(c, 0, FLOOR - 3, INTERIOR_W, 1, '#ffffff22');
  for (let y = FLOOR; y < INTERIOR_H; y += 5)
    for (let x = -10; x < INTERIOR_W; x += 20) {
      const ox = ((y - FLOOR) / 5) % 2 ? 10 : 0;
      r(c, x + ox, y, 20, 5, (x / 20 + (y - FLOOR) / 5) % 2 ? floorA : floorB);
      r(c, x + ox, y, 20, 1, '#00000030');
    }
}

function screen(c: Ctx, x: number, y: number, w: number, h: number, col: string, t: number, seed: number) {
  r(c, x - 1, y - 1, w + 2, h + 2, P.outline);
  r(c, x, y, w, h, '#07122e');
  for (let i = 0; i < Math.floor((h - 2) / 2); i++) {
    const len = 2 + ((hash(i, seed + (i === t % 4 ? t : 0), 200) * (w - 4)) | 0);
    r(c, x + 1, y + 1 + i * 2, len, 1, i % 3 === 0 ? P.white : col);
  }
}

const house = (c: Ctx, t: number) => {
  room(c, '#2a2f78', '#22276a', '#4a3a6e', '#43345f');
  // window with moon
  r(c, 150, 8, 30, 22, P.outline);
  r(c, 152, 10, 26, 18, '#101a40');
  blob(c, 170, 16, 4, 4, '#dfe7ff');
  for (let i = 0; i < 6; i++) r(c, 153 + ((hash(i, 0, 210) * 24) | 0), 11 + ((hash(i, 1, 210) * 14) | 0), 1, 1, (i + t) % 3 ? P.white : P.cyan);
  r(c, 164, 10, 1, 18, P.outline);
  r(c, 152, 19, 26, 1, P.outline);
  r(c, 148, 30, 34, 2, '#5f59a6');
  // bookshelf
  r(c, 8, 6, 36, 38, P.outline);
  r(c, 10, 8, 32, 34, '#3b2a55');
  for (let s = 0; s < 3; s++) {
    r(c, 10, 18 + s * 11, 32, 2, '#5b4580');
    for (let b = 0; b < 9; b++) {
      const h = 6 + ((hash(b, s, 211) * 3) | 0);
      r(c, 11 + b * 3.4, 18 + s * 11 - h, 3, h, [P.cyan, P.violet, P.pink, P.gold, P.mist, P.green][(b + s * 2) % 6]);
    }
  }
  // poster
  r(c, 54, 8, 20, 14, P.outline);
  r(c, 55, 9, 18, 12, '#141a48');
  text(c, '</>', 58, 12, P.cyan);
  // desk + monitor
  r(c, 82, 12, 34, 22, P.outline);
  screen(c, 84, 14, 30, 18, P.cyan, t, 1);
  r(c, 97, 34, 4, 3, P.mistD);
  r(c, 76, 37, 56, 4, '#7a5a9c');
  r(c, 76, 37, 56, 1, '#a584c8');
  r(c, 78, 41, 3, 14, '#5b4580');
  r(c, 127, 41, 3, 14, '#5b4580');
  r(c, 88, 35, 16, 2, P.mist);
  r(c, 120, 32, 6, 5, P.pink); // mug
  r(c, 126, 33, 2, 3, P.pink);
  if (t % 2) r(c, 122, 29, 1, 2, '#ffffff88');
  // chair
  r(c, 96, 42, 14, 12, '#3d2c7a');
  r(c, 96, 42, 14, 2, '#5b45a8');
  // plant
  r(c, 138, 46, 8, 8, '#a04a78');
  blob(c, 142, 41, 6, 6, P.leaf);
  blob(c, 140, 38, 3, 3, P.leafL);
  // rug
  r(c, 60, 56, 80, 6, '#6a48d4');
  r(c, 62, 57, 76, 1, P.violetL);
  r(c, 62, 60, 76, 1, P.violetL);
};

const lab = (c: Ctx, t: number) => {
  room(c, '#16245a', '#101a48', '#243273', '#1f2d6c');
  r(c, 0, 20, INTERIOR_W, 2, t % 2 ? P.cyan : P.cyanD);
  // terminals
  [10, 52, 94].forEach((x, i) => {
    r(c, x - 2, 8, 34, 26, P.outline);
    screen(c, x, 10, 30, 20, [P.cyan, P.violetL, P.green][i], t + i, i + 3);
    r(c, x - 4, 34, 38, 4, '#33479f');
    r(c, x - 4, 34, 38, 1, '#6f84e0');
    r(c, x, 38, 30, 16, '#1b2a63');
    for (let k = 0; k < 6; k++) r(c, x + 2 + k * 5, 35, 3, 1, (k + t + i) % 3 ? P.mistD : P.white);
    r(c, x + 12, 42, 6, 2, (t + i) % 2 ? P.green : '#1f9d6f');
  });
  // server rack
  r(c, 138, 6, 24, 48, P.outline);
  r(c, 140, 8, 20, 44, '#0c1438');
  for (let k = 0; k < 8; k++) {
    r(c, 142, 10 + k * 5, 16, 3, '#1b2a63');
    r(c, 143, 11 + k * 5, 1, 1, (k + t) % 2 ? P.green : '#0d4a35');
    r(c, 146, 11 + k * 5, 1, 1, (k * 3 + t) % 4 === 0 ? P.pink : P.cyan);
  }
  // flask bench
  r(c, 168, 36, 28, 3, '#6f84e0');
  r(c, 170, 39, 3, 15, '#33479f');
  r(c, 191, 39, 3, 15, '#33479f');
  [[172, P.green], [180, P.pink], [188, P.cyan]].forEach(([x, col], i) => {
    r(c, (x as number) + 1, 26, 2, 4, P.mist);
    blob(c, (x as number) + 2, 32, 3, 3, P.mist);
    blob(c, (x as number) + 2, 33, 2, 2, col as string);
    if ((t + i) % 2) r(c, (x as number) + 2, 22 + i, 1, 1, col as string);
  });
};

const projects = (c: Ctx, t: number) => {
  room(c, '#2b2166', '#221a55', '#3d2c7a', '#35266c');
  for (let x = 6; x < INTERIOR_W; x += 8) r(c, x, 3, 2, 2, (x / 8 + t) % 2 ? P.warm : '#5a4a20');
  const cols = [P.cyan, P.gold, P.pink, P.green, P.violetL];
  for (let i = 0; i < 5; i++) {
    const x = 18 + i * 38;
    const up = (i + t) % 2;
    // glow column
    shade(c, x - 6, 8, 20, 30, 0.1 + up * 0.05, cols[i]);
    // pedestal
    r(c, x - 5, 38, 18, 4, '#8b74dc');
    r(c, x - 3, 42, 14, 12, '#5b45a8');
    r(c, x - 3, 42, 3, 12, '#7a66c8');
    r(c, x - 6, 54, 20, 3, '#4a3a8a');
    // floating item
    const y = 22 - up * 2;
    if (i % 3 === 0) {
      tri(c, x - 1, y, 10, 5, cols[i]);
      for (let k = 0; k < 5; k++) r(c, x - 1 + k, y + 5 + k, 10 - k * 2, 1, cols[i]);
      r(c, x + 2, y + 2, 2, 1, '#ffffff');
    } else if (i % 3 === 1) {
      r(c, x, y, 9, 9, cols[i]);
      r(c, x, y, 9, 2, '#ffffff66');
      r(c, x + 6, y + 2, 3, 7, '#00000033');
    } else {
      blob(c, x + 4, y + 5, 5, 5, cols[i]);
      r(c, x + 2, y + 2, 2, 2, '#ffffff');
    }
    r(c, x + 9 - up * 12, y - 3 + up * 4, 1, 1, '#ffffff');
  }
};

const career = (c: Ctx, t: number) => {
  room(c, '#182766', '#121d52', '#2f3f8f', '#2a3982');
  // skyline window wall
  r(c, 6, 5, 110, 30, P.outline);
  r(c, 8, 7, 106, 26, '#0b0f2a');
  for (let i = 0; i < 12; i++) {
    const h = 8 + ((hash(i, 0, 220) * 16) | 0);
    r(c, 9 + i * 9, 33 - h, 8, h, '#1a1f5c');
    for (let y = 35 - h; y < 31; y += 3) if (hash(i, y + (t % 2 && hash(i, y, 221) < 0.2 ? 1 : 0), 222) < 0.4) r(c, 11 + i * 9, y, 2, 1, i % 4 ? P.cyan : P.violetL);
  }
  for (let x = 34; x < 114; x += 27) r(c, x, 7, 1, 26, P.outline);
  // kanban board
  r(c, 126, 6, 46, 28, P.outline);
  r(c, 128, 8, 42, 24, '#e8f0ff');
  for (let col = 0; col < 3; col++) {
    r(c, 130 + col * 14, 10, 10, 2, [P.pink, P.gold, P.green][col]);
    for (let k = 0; k < 3 - col + ((t + col) % 2); k++) r(c, 130 + col * 14, 14 + k * 5, 10, 3, [P.mistD, P.sky, P.violetL][(k + col) % 3]);
  }
  // desks
  [20, 70].forEach((x, i) => {
    r(c, x, 40, 36, 3, '#6f84e0');
    r(c, x + 2, 43, 3, 12, '#33479f');
    r(c, x + 31, 43, 3, 12, '#33479f');
    r(c, x + 10, 30, 16, 10, P.outline);
    r(c, x + 11, 31, 14, 8, (t + i) % 2 ? P.cyan : P.sky);
    r(c, x + 12, 33, 8, 1, '#0b0f2a');
    r(c, x + 12, 35, 5, 1, '#0b0f2a');
  });
  // elevator
  r(c, 178, 14, 18, 30, P.outline);
  r(c, 180, 16, 7, 28, P.mistD);
  r(c, 187, 16, 7, 28, P.mist);
  r(c, 184, 10, 6, 3, t % 2 ? P.green : P.gold);
};

const hall = (c: Ctx, t: number) => {
  room(c, '#232a6e', '#1b2159', '#5b45a8', '#4f3b96');
  r(c, 0, 48, INTERIOR_W, 12, '#7c4ddb');
  r(c, 0, 48, INTERIOR_W, 1, P.gold);
  r(c, 0, 59, INTERIOR_W, 1, P.gold);
  for (let i = 0; i < 6; i++) {
    const x = 14 + i * 32;
    // banner
    r(c, x + 2, 2, 8, 14, i % 2 ? '#7c4ddb' : '#2563eb');
    tri(c, x + 2, 16, 8, 3, '#232a6e');
    // plinth
    r(c, x - 3, 36, 18, 3, P.white);
    r(c, x - 1, 39, 14, 9, P.mist);
    r(c, x + 9, 39, 4, 9, P.mistD);
    // trophy
    const gold = (i + t) % 3 === 0 ? '#ffe38a' : P.gold;
    r(c, x + 1, 22, 10, 7, gold);
    r(c, x + 1, 22, 10, 1, '#ffe38a');
    r(c, x - 1, 23, 2, 4, '#d49a0c');
    r(c, x + 11, 23, 2, 4, '#d49a0c');
    r(c, x + 4, 29, 4, 4, '#d49a0c');
    r(c, x + 2, 33, 8, 3, gold);
    if ((i + t) % 3 === 0) {
      r(c, x + 13, 19, 1, 3, '#ffffff');
      r(c, x + 12, 20, 3, 1, '#ffffff');
    }
  }
};

const tower = (c: Ctx, t: number) => {
  room(c, '#1c2a6c', '#15205a', '#2f3f8f', '#2a3982');
  // main wall screen with world arcs
  r(c, 50, 4, 100, 32, P.outline);
  r(c, 52, 6, 96, 28, '#07122e');
  blob(c, 100, 34, 30, 22, '#12306e');
  blob(c, 100, 34, 22, 16, '#1a3fa8');
  r(c, 52, 34, 96, 2, P.outline);
  for (let k = 0; k < 3; k++) {
    const rad = 10 + ((k * 7 + t * 4) % 26);
    for (let a = 190; a <= 350; a += 5) {
      const x = Math.round(100 + Math.cos((a * Math.PI) / 180) * rad * 1.5);
      const y = Math.round(33 + Math.sin((a * Math.PI) / 180) * rad);
      if (x > 52 && x < 147 && y > 6) r(c, x, y, 1, 1, k % 2 ? P.pink : P.cyan);
    }
  }
  // consoles
  [8, 158].forEach((x, i) => {
    r(c, x - 1, 16, 36, 20, P.outline);
    r(c, x + 1, 18, 32, 16, '#07122e');
    for (let k = 0; k < 7; k++) {
      const h = 2 + ((hash(k, t + i * 5, 230) * 11) | 0);
      r(c, x + 3 + k * 4, 32 - h, 3, h, k % 2 ? P.cyan : P.violetL);
    }
    r(c, x - 3, 36, 40, 4, '#6f84e0');
    r(c, x, 40, 34, 14, '#1b2a63');
    for (let k = 0; k < 5; k++) r(c, x + 3 + k * 6, 37, 3, 1, (k + t) % 2 ? P.pink : P.green);
  });
  // envelope beacon
  r(c, 92, 40, 16, 11, P.white);
  for (let k = 0; k < 8; k++) {
    r(c, 92 + k, 40 + Math.min(k, 5), 1, 1, P.mistD);
    r(c, 107 - k, 40 + Math.min(k, 5), 1, 1, P.mistD);
  }
  if (t % 2) r(c, 98, 36, 4, 2, P.pink);
};

const DRAW: Record<LocationId, (c: Ctx, t: number) => void> = { house, lab, projects, career, hall, tower };

export function drawInterior(c: Ctx, id: LocationId, t: number) {
  c.clearRect(0, 0, INTERIOR_W, INTERIOR_H);
  DRAW[id](c, t);
  shade(c, 0, 0, 3, INTERIOR_H, 0.25);
  shade(c, INTERIOR_W - 3, 0, 3, INTERIOR_H, 0.25);
}

/** Where the rubber duck sits in the house interior, as fractions of the banner (for the click hotspot). */
export const DUCK_SPOT = { x: 47 / INTERIOR_W, y: 39 / INTERIOR_H };

export function drawDuck(c: Ctx) {
  const x = 44;
  const y = 36;
  r(c, x, y + 3, 7, 4, '#fde047');
  r(c, x + 3, y, 4, 4, '#fde047');
  r(c, x + 7, y + 2, 2, 1, '#fb923c');
  r(c, x + 5, y + 1, 1, 1, P.outline);
  r(c, x, y + 6, 7, 1, '#ca8a04');
}
