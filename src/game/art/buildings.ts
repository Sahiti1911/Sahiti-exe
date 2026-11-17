import type { LocationId } from '../../data/types';
import { type Ctx, P, blob, hash, makeCanvas, outline, r, shade, sign, text, tri } from './canvas';

/** Pixel size of each building sprite (matches its tile footprint × 16). */
export const BUILDING_SIZE: Record<LocationId, [number, number]> = {
  house: [128, 96],
  lab: [160, 112],
  projects: [160, 112],
  career: [128, 144],
  hall: [160, 112],
  tower: [128, 160],
};

/** Light sources relative to the sprite's top-left: [x, y, radius, colour]. */
export const BUILDING_LIGHTS: Record<LocationId, Array<[number, number, number, number]>> = {
  house: [[64, 92, 46, 0xffe2a0], [26, 72, 30, 0xffe2a0], [102, 72, 30, 0x7dd3fc]],
  lab: [[80, 104, 50, 0x67e8f9], [36, 86, 40, 0x67e8f9], [124, 86, 40, 0x8b5cf6], [80, 22, 34, 0x67e8f9]],
  projects: [[80, 100, 54, 0x8b5cf6], [30, 88, 34, 0xf0abfc], [130, 88, 34, 0x67e8f9]],
  career: [[64, 134, 50, 0x7dd3fc], [64, 60, 60, 0x4f6bff]],
  hall: [[80, 98, 50, 0xfbbf24], [52, 70, 26, 0xffb04a], [108, 70, 26, 0xffb04a]],
  tower: [[64, 150, 46, 0x7dd3fc], [64, 4, 26, 0xf472b6], [30, 136, 26, 0x67e8f9], [98, 136, 26, 0x67e8f9]],
};

type Draw = (c: Ctx, t: number) => void;

const glint = (c: Ctx, x: number, y: number, len = 5) => {
  c.globalAlpha = 0.35;
  for (let i = 0; i < len; i++) r(c, x + i, y + len - 1 - i, 1, 1, '#ffffff');
  for (let i = 0; i < len - 2; i++) r(c, x + i + 3, y + len - 1 - i, 1, 1, '#ffffff');
  c.globalAlpha = 1;
};

const house: Draw = (c, t) => {
  const warm = t ? '#ffe9a8' : '#fcd98a';
  // chimney
  r(c, 88, 5, 14, 26, '#4a3a8a');
  for (let y = 8; y < 30; y += 4) r(c, 88, y, 14, 1, '#33276a');
  for (let y = 8; y < 30; y += 8) r(c, 94, y, 1, 4, '#33276a');
  r(c, 86, 2, 18, 4, '#6a55b8');
  r(c, 86, 2, 18, 1, '#9a86e0');
  // shingled roof
  for (let i = 0; i <= 32; i++) {
    const y = 12 + i;
    const inset = Math.max(1, Math.round(22 - i * 0.7));
    const band = Math.floor(i / 5);
    r(c, inset, y, 128 - inset * 2, 1, i % 5 === 4 ? '#3a2a80' : band % 2 ? '#6344c2' : '#6f50d2');
    if (i % 5 < 4) for (let x = inset + ((band * 4) % 8); x < 128 - inset; x += 8) r(c, x, y, 1, 1, '#4a3399');
  }
  r(c, 22, 11, 84, 2, '#a58af5');
  shade(c, 2, 13, 44, 31, 0.1, '#ffffff');
  shade(c, 86, 13, 40, 31, 0.2);
  // dormer
  tri(c, 51, 15, 26, 10, '#4a3399');
  tri(c, 55, 18, 18, 7, '#6f50d2');
  r(c, 54, 25, 20, 13, '#2d3d86');
  r(c, 54, 25, 20, 1, '#161d4f');
  blob(c, 64, 31, 5, 5, '#161d4f');
  blob(c, 64, 31, 4, 4, warm);
  r(c, 63, 27, 1, 8, '#161d4f');
  r(c, 60, 31, 8, 1, '#161d4f');
  // eave
  r(c, 1, 44, 126, 3, '#2a1f5c');
  r(c, 1, 44, 126, 1, '#5b45a8');
  // plank walls
  r(c, 5, 47, 118, 42, '#2f4190');
  for (let y = 52; y < 88; y += 6) r(c, 5, y, 118, 1, '#243273');
  for (let i = 0; i < 26; i++) r(c, 8 + ((hash(i, 0, 50) * 110) | 0), 48 + ((hash(i, 1, 50) * 38) | 0), 3, 1, '#3a4ea3');
  shade(c, 5, 47, 118, 5, 0.32);
  shade(c, 92, 47, 31, 42, 0.12);
  r(c, 5, 47, 4, 42, '#1e2b68');
  r(c, 119, 47, 4, 42, '#18225a');
  // stone foundation
  r(c, 3, 88, 122, 7, '#3f3a74');
  r(c, 3, 88, 122, 1, '#5f59a6');
  for (let x = 6; x < 124; x += 10) r(c, x, 89, 1, 6, '#262350');
  r(c, 3, 91, 122, 1, '#262350');
  // windows
  [14, 90].forEach((x, i) => {
    const y = 60;
    r(c, x - 1, y - 1, 26, 20, '#131a4a');
    r(c, x + 1, y + 1, 22, 16, i ? (t ? '#8fdcff' : '#7dd3fc') : warm);
    if (i) {
      // monitor glow in the study
      r(c, x + 7, y + 6, 10, 7, '#0b0f2a');
      r(c, x + 8, y + 7, 8, 5, t ? '#b6f3ff' : '#67e8f9');
      r(c, x + 9, y + 8, 4, 1, '#0b0f2a');
      r(c, x + 9, y + 10, 6, 1, '#0b0f2a');
      r(c, x + 11, y + 13, 2, 3, '#0b0f2a');
    } else {
      r(c, x + 1, y + 1, 5, 16, '#b79bff');
      r(c, x + 18, y + 1, 5, 16, '#b79bff');
      r(c, x + 5, y + 1, 1, 16, '#8b5cf6');
      r(c, x + 18, y + 1, 1, 16, '#8b5cf6');
    }
    r(c, x + 11, y + 1, 2, 16, '#131a4a');
    r(c, x + 1, y + 8, 22, 1, '#131a4a');
    glint(c, x + 2, y + 2, 4);
    r(c, x - 6, y - 1, 4, 20, '#1b867c');
    r(c, x + 26, y - 1, 4, 20, '#125f63');
    for (let k = 0; k < 5; k++) {
      r(c, x - 6, y + 1 + k * 4, 4, 1, '#0c3f4c');
      r(c, x + 26, y + 1 + k * 4, 4, 1, '#0c3f4c');
    }
    r(c, x - 2, y + 19, 28, 2, '#5f59a6');
    r(c, x, y + 21, 24, 4, '#4a3a8a');
    r(c, x, y + 21, 24, 1, '#6a55b8');
    for (let k = 0; k < 5; k++) {
      r(c, x + 2 + k * 5, y + 19, 2, 2, '#1b867c');
      r(c, x + 2 + k * 5, y + 18, 2, 1, [P.pink, P.cyan, P.violetL][k % 3]);
    }
  });
  // door
  sign(c, 'HOME', 64, 47, P.cyan, 1, !!t);
  r(c, 51, 59, 26, 35, '#131a4a');
  r(c, 53, 61, 22, 33, '#7d5be8');
  r(c, 53, 61, 22, 1, '#b79bff');
  r(c, 53, 61, 2, 33, '#9477f0');
  r(c, 71, 62, 4, 32, '#6a48d4');
  r(c, 57, 64, 14, 8, '#131a4a');
  r(c, 58, 65, 12, 6, warm);
  r(c, 63, 65, 2, 6, '#131a4a');
  r(c, 57, 76, 14, 14, '#6a48d4');
  r(c, 58, 77, 12, 12, '#7250dc');
  r(c, 70, 80, 2, 2, P.gold);
  r(c, 47, 93, 34, 2, '#5f59a6');
  // lantern, mailbox, plant
  r(c, 80, 64, 5, 1, '#131a4a');
  r(c, 81, 65, 4, 6, t ? '#fff2c2' : P.warm);
  r(c, 81, 71, 4, 1, '#131a4a');
  r(c, 39, 84, 2, 10, '#5f59a6');
  r(c, 35, 78, 10, 6, P.cyanD);
  r(c, 35, 78, 10, 1, P.cyan);
  r(c, 45, 77, 1, 4, P.pink);
  r(c, 37, 80, 5, 1, '#0b0f2a');
  r(c, 85, 89, 8, 5, '#a04a78');
  r(c, 85, 89, 8, 1, '#c96a9a');
  blob(c, 89, 86, 5, 4, P.leaf);
  blob(c, 87, 84, 3, 2, P.leafL);
};

const lab: Draw = (c, t) => {
  // observatory dome
  blob(c, 80, 38, 37, 32, '#182c74');
  blob(c, 78, 36, 33, 28, '#2748b0');
  blob(c, 71, 26, 16, 11, '#3a66d8');
  r(c, 60, 16, 12, 2, '#a5c8ff');
  r(c, 57, 19, 4, 1, '#a5c8ff');
  for (const x of [52, 64, 96, 106]) shade(c, x, 14, 1, 24, 0.25);
  r(c, 76, 7, 8, 31, '#0b0f2a');
  r(c, 77, 8, 6, 30, t ? P.cyan : '#3fc7dc');
  r(c, 79, 8, 2, 30, '#e3fdff');
  // dish + antenna
  r(c, 33, 28, 2, 9, P.mistD);
  blob(c, 34, 26, 9, 7, P.mist);
  blob(c, 35, 25, 6, 4, P.mistD);
  r(c, 33, 24, 1, 3, '#ffffff');
  r(c, 122, 12, 2, 25, P.mistD);
  r(c, 120, 9, 6, 4, t ? P.pink : '#7a2a58');
  r(c, 118, 20, 10, 1, P.mistD);
  // roof deck
  r(c, 2, 37, 156, 10, '#141c50');
  r(c, 2, 37, 156, 1, P.volt);
  for (let x = 4; x < 158; x += 6) r(c, x, 33, 1, 4, '#3d4fa8');
  r(c, 2, 33, 156, 1, '#5b6fd0');
  for (const x of [10, 136]) {
    r(c, x, 39, 14, 6, '#1b2a63');
    for (let k = 0; k < 4; k++) r(c, x + 1 + k * 3, 40, 2, 4, '#0b0f2a');
  }
  // body
  r(c, 2, 47, 156, 62, '#1f2d70');
  for (let x = 24; x < 158; x += 22) r(c, x, 47, 1, 62, '#172257');
  r(c, 2, 47, 156, 2, '#3d55c8');
  shade(c, 2, 49, 156, 5, 0.3);
  shade(c, 120, 47, 38, 62, 0.12);
  r(c, 8, 60, 144, 2, t ? P.cyan : P.cyanD);
  r(c, 8, 62, 144, 1, '#0b0f2a');
  r(c, 4, 50, 3, 58, '#4a5fc0');
  r(c, 153, 50, 3, 58, '#2a3a88');
  sign(c, 'LAB', 80, 42, P.cyan, 2, !!t);
  // observation windows
  [12, 100].forEach((wx, i) => {
    r(c, wx - 1, 66, 50, 34, '#0b0f2a');
    r(c, wx + 1, 68, 46, 30, '#0e1c4d');
    for (let k = 0; k < 3; k++) {
      const sx = wx + 4 + k * 15;
      r(c, sx, 71, 11, 9, '#04122e');
      r(c, sx + 1, 72, 9, 6, (k + t + i) % 2 ? P.cyan : P.violet);
      r(c, sx + 2, 73, 5, 1, '#0e1c4d');
      r(c, sx + 2, 75, 3 + ((k + t) % 2) * 3, 1, '#0e1c4d');
      r(c, sx + 4, 80, 3, 2, '#04122e');
    }
    r(c, wx + 2, 82, 44, 2, '#5b6fd0');
    r(c, wx + 2, 84, 44, 13, '#172257');
    r(c, wx + 8, 87, 4, 7, '#0b0f2a');
    r(c, wx + 9, 89 - t, 2, 5 + t, P.green);
    r(c, wx + 22, 86, 5, 8, '#0b0f2a');
    r(c, wx + 23, 88 + t, 3, 6 - t, P.pink);
    r(c, wx + 36, 88, 4, 6, '#0b0f2a');
    r(c, wx + 37, 90 - t, 2, 4 + t, P.cyan);
    glint(c, wx + 3, 69, 6);
    r(c, wx - 2, 100, 52, 2, '#3d55c8');
  });
  // sliding door
  r(c, 61, 67, 38, 43, '#0b0f2a');
  r(c, 64, 70, 15, 40, '#2f6bea');
  r(c, 81, 70, 15, 40, '#2a5fd6');
  r(c, 64, 70, 15, 1, '#8db4ff');
  r(c, 81, 70, 15, 1, '#8db4ff');
  r(c, 64, 70, 2, 40, '#4b83f5');
  r(c, 67, 74, 9, 13, P.sky);
  r(c, 84, 74, 9, 13, P.sky);
  glint(c, 68, 76, 4);
  glint(c, 85, 76, 4);
  for (let k = 0; k < 8; k++) r(c, 64 + k * 4, 106, 2, 4, k % 2 ? P.gold : '#0b0f2a');
  r(c, 73, 63, 14, 3, t ? P.cyan : P.white);
  r(c, 2, 108, 156, 3, '#141c50');
};

const projects: Draw = (c, t) => {
  // big-top roof with converging stripes
  for (let y = 6; y <= 45; y++) {
    const hw = Math.round(77 * Math.sqrt(Math.max(0, 1 - ((45 - y) / 40) ** 2)));
    for (let k = -4; k < 4; k++) {
      const x0 = Math.round(80 + (k * hw) / 4);
      const x1 = Math.round(80 + ((k + 1) * hw) / 4);
      r(c, x0, y, Math.max(1, x1 - x0), 1, (k + 8) % 2 ? '#8b5cf6' : '#4b2fa8');
    }
  }
  shade(c, 3, 6, 40, 40, 0.1, '#ffffff');
  shade(c, 104, 6, 54, 40, 0.2);
  r(c, 79, 0, 2, 8, P.mist);
  tri(c, 81, 1, 2, 2, P.pink);
  r(c, 81, 1, 7 - t, 2, P.pink);
  r(c, 81, 3, 5 + t, 2, '#c0408a');
  for (let k = 0; k < 13; k++) blob(c, 8 + k * 12, 46, 6, 3, k % 2 ? '#b79bff' : '#6a48d4');
  // body
  r(c, 4, 47, 152, 62, '#2b2166');
  shade(c, 4, 49, 152, 5, 0.32);
  shade(c, 118, 47, 38, 62, 0.14);
  for (const x of [4, 54, 102, 152]) {
    r(c, x, 50, 4, 59, '#4a3a8a');
    r(c, x, 50, 1, 59, '#6a55b8');
  }
  for (let x = 8, i = 0; x < 154; x += 6, i++) r(c, x, 49, 2, 2, (i + t) % 2 ? P.warm : '#5a4a20');
  sign(c, 'PROJECTS', 80, 53, '#f0abfc', 2, !!t);
  // portal
  blob(c, 80, 86, 21, 17, '#0b0f2a');
  r(c, 59, 86, 42, 24, '#0b0f2a');
  blob(c, 80, 87, 18, 14, '#1d2fa8');
  r(c, 62, 87, 36, 23, '#1d2fa8');
  blob(c, 80, 93, 13, 12, t ? '#4f6bff' : '#3b55d8');
  blob(c, 80, 95, 9, 9, t ? P.cyan : P.violet);
  blob(c, 80, 97, 5, 5, t ? '#ffffff' : P.cyan);
  for (let i = 0; i < 8; i++)
    r(c, 64 + ((hash(i, t, 60) * 32) | 0), 80 + ((hash(i, t + 2, 60) * 26) | 0), 1, 1, '#ffffff');
  r(c, 56, 108, 48, 3, '#5b45a8');
  r(c, 56, 108, 48, 1, '#8b74dc');
  // showcase windows
  [10, 108].forEach((wx, i) => {
    r(c, wx - 1, 71, 44, 32, '#0b0f2a');
    r(c, wx + 1, 73, 40, 28, '#151d55');
    for (let k = 0; k < 3; k++) {
      const px = wx + 4 + k * 13;
      const up = (k + t + i) % 2;
      r(c, px, 92, 9, 9, '#5b45a8');
      r(c, px, 92, 9, 1, '#8b74dc');
      const col = [P.cyan, P.gold, P.pink][(k + i) % 3];
      const iy = 82 - up;
      if ((k + i) % 3 === 0) {
        tri(c, px + 1, iy, 7, 4, col);
        r(c, px + 2, iy + 4, 5, 1, col);
        r(c, px + 3, iy + 5, 3, 1, col);
        r(c, px + 4, iy + 6, 1, 1, col);
      } else if ((k + i) % 3 === 1) {
        r(c, px + 1, iy, 7, 7, col);
        r(c, px + 1, iy, 7, 1, '#ffe38a');
        r(c, px + 6, iy + 1, 2, 6, '#c48c12');
      } else {
        blob(c, px + 4, iy + 3, 4, 4, col);
        r(c, px + 2, iy + 1, 2, 1, '#ffffff');
      }
    }
    glint(c, wx + 3, 74, 6);
    r(c, wx - 2, 103, 46, 2, '#5b45a8');
  });
};

const career: Draw = (c, t) => {
  // rooftop
  r(c, 22, 3, 84, 12, '#141c50');
  r(c, 22, 3, 84, 1, P.volt);
  r(c, 28, 0, 2, 4, P.mistD);
  r(c, 27, 0, 4, 2, t ? P.pink : '#7a2a58');
  r(c, 92, 5, 10, 8, '#1b2a63');
  for (let k = 0; k < 3; k++) r(c, 93 + k * 3, 6, 2, 6, '#0b0f2a');
  sign(c, 'CAREER HQ', 60, 3, P.sky, 1, !!t);
  // tower
  r(c, 8, 15, 112, 96, '#182766');
  r(c, 8, 15, 5, 96, '#27409a');
  r(c, 113, 15, 7, 96, '#101a48');
  r(c, 8, 15, 112, 2, '#3d55c8');
  for (let j = 0; j < 8; j++) {
    const y = 21 + j * 11;
    r(c, 13, y + 9, 100, 1, '#101a48');
    for (let i = 0; i < 6; i++) {
      const x = 16 + i * 16;
      const h = hash(i, j, 70);
      const flick = hash(i, j, 71) < 0.12 && t;
      let col = '#213f9c';
      if (h < 0.3 !== !!flick) col = h < 0.1 ? P.violetL : P.sky;
      else if (h > 0.75) col = '#1a3384';
      r(c, x - 1, y - 1, 15, 10, '#0d1440');
      r(c, x, y, 13, 8, col);
      r(c, x, y, 13, 1, col === '#213f9c' || col === '#1a3384' ? '#3558c4' : '#ffffff');
      r(c, x + 6, y, 1, 8, '#0d1440');
      if (h > 0.5 && h < 0.62) r(c, x, y + 1, 13, 3, '#0d1440'); // blinds
    }
  }
  r(c, 14, 19, 1, 90, t ? P.cyan : P.cyanD);
  r(c, 113, 19, 1, 90, t ? P.cyanD : P.cyan);
  shade(c, 84, 17, 29, 94, 0.14);
  // lobby
  r(c, 8, 110, 112, 32, '#111a4a');
  r(c, 28, 108, 72, 5, P.volt);
  r(c, 28, 108, 72, 1, '#9fb2ff');
  r(c, 28, 113, 72, 1, '#0b0f2a');
  shade(c, 28, 114, 72, 3, 0.35);
  r(c, 45, 116, 38, 26, '#0b0f2a');
  r(c, 47, 118, 16, 24, '#38bdf8');
  r(c, 65, 118, 16, 24, '#2ea6e0');
  r(c, 47, 118, 16, 1, '#c5efff');
  r(c, 65, 118, 16, 1, '#c5efff');
  glint(c, 49, 121, 6);
  glint(c, 67, 121, 6);
  r(c, 61, 128, 1, 6, P.white);
  r(c, 66, 128, 1, 6, P.white);
  [14, 88].forEach((x) => {
    r(c, x - 1, 117, 28, 20, '#0b0f2a');
    r(c, x, 118, 26, 18, '#1d3a8f');
    r(c, x, 118, 26, 1, '#3558c4');
    blob(c, x + 7, 130, 4, 5, P.leaf);
    blob(c, x + 6, 128, 2, 3, P.leafL);
    r(c, x + 16, 126, 7, 10, '#0d1440');
    r(c, x + 17, 127, 5, 3, t ? P.cyan : P.sky);
    r(c, x - 1, 137, 28, 5, '#3d2c7a');
    r(c, x - 1, 137, 28, 1, '#5b45a8');
  });
  r(c, 4, 141, 120, 2, '#27409a');
};

const hall: Draw = (c, t) => {
  // pediment
  tri(c, 3, 4, 154, 34, '#5b45a8');
  tri(c, 12, 10, 136, 28, '#33276f');
  shade(c, 80, 4, 77, 34, 0.14);
  // trophy emblem
  r(c, 74, 19, 12, 7, P.gold);
  r(c, 74, 19, 12, 1, '#ffe38a');
  r(c, 71, 20, 3, 4, '#d49a0c');
  r(c, 86, 20, 3, 4, '#d49a0c');
  r(c, 72, 21, 1, 2, '#33276f');
  r(c, 87, 21, 1, 2, '#33276f');
  r(c, 78, 26, 4, 4, '#d49a0c');
  r(c, 75, 30, 10, 2, P.gold);
  r(c, t ? 68 : 91, t ? 16 : 17, 1, 3, '#ffffff');
  r(c, t ? 67 : 90, t ? 17 : 18, 3, 1, '#ffffff');
  // entablature
  r(c, 2, 38, 156, 9, '#6a55b8');
  r(c, 2, 38, 156, 1, '#a58af5');
  r(c, 2, 46, 156, 1, '#0b0f2a');
  for (let x = 6; x < 156; x += 8) r(c, x, 41, 3, 4, '#4a3a8a');
  r(c, 66, 39, 28, 8, '#33276f');
  text(c, 'HALL', 73, 40, P.gold);
  // back wall
  r(c, 10, 47, 140, 57, '#232a6e');
  for (let y = 54; y < 104; y += 8) r(c, 10, y, 140, 1, '#1b2159');
  shade(c, 10, 47, 140, 6, 0.35);
  // banners
  [28, 122].forEach((x, i) => {
    const sway = (i + t) % 2;
    r(c, x - 1, 50, 12, 2, P.gold);
    r(c, x, 52, 10, 30, '#7c4ddb');
    r(c, x, 52, 2, 30, '#9a70f0');
    r(c, x + 8, 52, 2, 30, '#5a34c0');
    r(c, x, 56, 10, 2, P.gold);
    r(c, x + 4, 62, 2, 6, P.gold);
    r(c, x + 2, 64, 6, 2, P.gold);
    tri(c, x + sway, 82, 5, 4, '#232a6e');
    r(c, x, 82, 10, 1, '#7c4ddb');
    r(c, x + sway, 83, 3, 3, '#7c4ddb');
    r(c, x + 7 - sway, 83, 3, 3, '#5a34c0');
  });
  // columns
  for (const x of [13, 41, 107, 135]) {
    r(c, x, 47, 12, 57, P.mist);
    r(c, x, 47, 2, 57, '#ffffff');
    r(c, x + 4, 50, 1, 52, P.mistD);
    r(c, x + 7, 50, 1, 52, P.mistD);
    r(c, x + 9, 47, 3, 57, P.mistD);
    r(c, x - 2, 47, 16, 4, P.white);
    r(c, x - 2, 50, 16, 1, P.mistD);
    r(c, x - 2, 100, 16, 4, P.white);
    r(c, x - 2, 100, 16, 1, '#ffffff');
  }
  // great door
  r(c, 58, 55, 44, 49, '#0b0f2a');
  tri(c, 60, 52, 40, 5, '#0b0f2a');
  r(c, 61, 58, 18, 46, '#6a48d4');
  r(c, 81, 58, 18, 46, '#5a3cc0');
  r(c, 61, 58, 18, 1, '#9a7bf0');
  r(c, 61, 58, 2, 46, '#8262e6');
  r(c, 79, 58, 2, 46, t ? '#fff2c2' : P.warm);
  for (let k = 0; k < 4; k++) {
    r(c, 64, 62 + k * 11, 12, 7, '#5a3cc0');
    r(c, 84, 62 + k * 11, 12, 7, '#4c30ac');
    r(c, 64, 62 + k * 11, 12, 1, '#7d5be8');
  }
  r(c, 76, 80, 2, 4, P.gold);
  r(c, 82, 80, 2, 4, P.gold);
  // braziers
  for (const x of [52, 106]) {
    r(c, x, 72, 4, 2, P.mistD);
    r(c, x + 1, 74, 2, 10, '#5b6fd0');
    tri(c, x - 1, 64 - t, 6, 8 + t, '#ff8a3c');
    tri(c, x, 67 - t, 4, 5 + t, P.gold);
    r(c, x + 1, 70, 2, 2, '#fff2c2');
  }
  // steps
  r(c, 6, 104, 148, 3, P.mistD);
  r(c, 6, 104, 148, 1, P.white);
  r(c, 2, 107, 156, 4, '#6f82c0');
  r(c, 2, 107, 156, 1, P.mist);
};

const tower: Draw = (c, t) => {
  // mast + beacon
  r(c, 63, 3, 2, 24, P.mistD);
  r(c, 63, 3, 1, 24, P.white);
  r(c, 60, 0, 8, 5, t ? P.pink : '#7a2a58');
  if (t) r(c, 62, 1, 4, 2, '#ffd0ea');
  r(c, 58, 12, 12, 1, P.mistD);
  r(c, 60, 18, 8, 1, P.mistD);
  // lattice shaft
  for (let y = 26; y < 100; y++) {
    const hw = Math.round(9 + (y - 26) * 0.17);
    r(c, 64 - hw, y, hw * 2, 1, '#1a2764');
    r(c, 64 - hw, y, 2, 1, '#4a5fc0');
    r(c, 64 + hw - 2, y, 2, 1, '#121b4c');
    const seg = (y - 26) % 14;
    if (seg < 2) r(c, 64 - hw, y, hw * 2, 1, '#3d55c8');
    else {
      const k = (seg - 2) / 12;
      r(c, Math.round(64 - hw + 2 + k * (hw * 2 - 5)), y, 1, 1, '#4a5fc0');
      r(c, Math.round(64 + hw - 3 - k * (hw * 2 - 5)), y, 1, 1, '#33479f');
    }
  }
  r(c, 62, 46, 4, 3, t ? P.cyan : P.violet);
  r(c, 62, 74, 4, 3, t ? P.violet : P.cyan);
  // platform
  r(c, 42, 54, 44, 4, '#2f3f8f');
  r(c, 42, 54, 44, 1, '#5b6fd0');
  for (let x = 43; x < 86; x += 6) r(c, x, 50, 1, 4, '#5b6fd0');
  r(c, 42, 50, 44, 1, '#5b6fd0');
  // main dish
  r(c, 40, 40, 3, 14, P.mistD);
  blob(c, 36, 32, 19, 15, P.mist);
  blob(c, 38, 30, 15, 11, P.mistD);
  blob(c, 40, 29, 9, 7, '#5b6fd0');
  r(c, 22, 27, 6, 1, '#ffffff');
  r(c, 20, 30, 3, 1, '#ffffff');
  r(c, 41, 28, 12, 1, P.white);
  r(c, 52, 25, 4, 4, t ? P.cyan : '#e3fdff');
  // small dish
  r(c, 92, 44, 2, 10, P.mistD);
  blob(c, 94, 40, 10, 8, P.mist);
  blob(c, 95, 39, 7, 5, P.mistD);
  r(c, 88, 36, 4, 1, '#ffffff');
  // base station
  r(c, 5, 96, 118, 7, '#2f3f8f');
  r(c, 5, 96, 118, 1, '#6f84e0');
  r(c, 5, 102, 118, 1, '#0b0f2a');
  r(c, 9, 103, 110, 55, '#1c2a6c');
  for (let x = 30; x < 118; x += 22) r(c, x, 103, 1, 55, '#15205a');
  shade(c, 9, 103, 110, 5, 0.32);
  shade(c, 92, 103, 27, 55, 0.14);
  r(c, 9, 103, 3, 55, '#33479f');
  sign(c, 'COMMS', 64, 105, P.pink, 2, !!t);
  [16, 82].forEach((x, i) => {
    r(c, x - 1, 125, 32, 24, '#0b0f2a');
    r(c, x + 1, 127, 28, 20, '#0c1a48');
    for (let k = 0; k < 6; k++) {
      const h = 3 + ((hash(k, t + i * 3, 80) * 12) | 0);
      r(c, x + 3 + k * 4, 145 - h, 3, h, k % 2 ? P.cyan : P.violetL);
    }
    r(c, x + 1, 145, 28, 2, '#33479f');
    glint(c, x + 3, 128, 5);
    r(c, x - 2, 149, 34, 2, '#33479f');
  });
  r(c, 49, 123, 30, 35, '#0b0f2a');
  r(c, 52, 126, 24, 32, '#2f6bea');
  r(c, 52, 126, 24, 1, '#8db4ff');
  r(c, 52, 126, 2, 32, '#4b83f5');
  r(c, 72, 127, 4, 31, '#2452c4');
  r(c, 57, 130, 14, 9, P.sky);
  glint(c, 58, 131, 5);
  r(c, 52, 144, 24, 2, '#8db4ff');
  r(c, 52, 150, 24, 2, '#8db4ff');
  r(c, 80, 136, 4, 6, '#0b0f2a');
  r(c, 81, 137, 2, 2, t ? P.green : '#1f9d6f');
  r(c, 5, 157, 118, 2, '#2f3f8f');
};

const DRAW: Record<LocationId, Draw> = { house, lab, projects, career, hall, tower };

/** Two animation frames side by side, outlined. */
export function makeBuilding(id: LocationId) {
  const [w, h] = BUILDING_SIZE[id];
  const { canvas, ctx } = makeCanvas(w * 2, h);
  for (let t = 0; t < 2; t++) {
    ctx.save();
    ctx.translate(t * w, 0);
    ctx.beginPath();
    ctx.rect(1, 0, w - 2, h - 1);
    ctx.clip();
    DRAW[id](ctx, t);
    ctx.restore();
  }
  return outline(canvas, P.outline, w, h);
}
