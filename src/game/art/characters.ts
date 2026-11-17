import { type Ctx, P, makeCanvas, outline, r } from './canvas';

/** Frame size on the sheet (the 16×20 character plus a 1px outline margin). */
export const CHAR_FW = 18;
export const CHAR_FH = 24;
/** Sprite origin so that (x, y) is the point between the character's feet. */
export const CHAR_ORIGIN = { x: 0.5, y: 22 / 24 };

export interface CharPalette {
  hair: string;
  hairL: string;
  hairD: string;
  skin: string;
  skinD: string;
  shirt: string;
  shirtL: string;
  shirtD: string;
  pants: string;
  pantsD: string;
  shoes: string;
  longHair: boolean;
}

export const PLAYER_PALETTE: CharPalette = {
  hair: '#33205e',
  hairL: '#5a3d9c',
  hairD: '#1f1340',
  skin: '#f6cfad',
  skinD: '#dba283',
  shirt: '#8b5cf6',
  shirtL: '#ab8bff',
  shirtD: '#6537d6',
  pants: '#27377a',
  pantsD: '#1a2658',
  shoes: '#e8f0ff',
  longHair: true,
};

export const NPC_PALETTES: CharPalette[] = [
  { hair: '#3fc7dc', hairL: '#8ef0ff', hairD: '#1b8a9c', skin: '#eab98f', skinD: '#c98f6b', shirt: '#2f6bea', shirtL: '#5f93ff', shirtD: '#1d4ac0', pants: '#1b2a63', pantsD: '#121d48', shoes: '#c7d2fe', longHair: false },
  { hair: '#c7d2fe', hairL: '#ffffff', hairD: '#8fa3d9', skin: '#c98f6b', skinD: '#a56f4e', shirt: '#dfe7ff', shirtL: '#ffffff', shirtD: '#aab8ea', pants: '#3d2c7a', pantsD: '#2a1f5c', shoes: '#1b2a63', longHair: false },
  { hair: '#ef6bb0', hairL: '#ff9fd0', hairD: '#b83d85', skin: '#f6cfad', skinD: '#dba283', shirt: '#22b8cf', shirtL: '#67e8f9', shirtD: '#14889b', pants: '#2a1f5c', pantsD: '#1c1440', shoes: '#e8f0ff', longHair: true },
  { hair: '#3b2a55', hairL: '#5b4580', hairD: '#261a3a', skin: '#a8734f', skinD: '#87563a', shirt: '#f2b62b', shirtL: '#ffd76a', shirtD: '#c48c12', pants: '#16245a', pantsD: '#0f1940', shoes: '#c7d2fe', longHair: false },
];

/**
 * Draws one 16×20 character pose.
 * Directions: 0 down, 1 left, 2 right, 3 up. Poses: 0 stand, 1 breathe, 2 step A, 3 step B.
 */
export function drawChar(c: Ctx, ox: number, oy: number, dir: number, pose: number, p: CharPalette) {
  const bob = pose === 0 ? 0 : 1;
  const R = (x: number, y: number, w: number, h: number, col: string) => r(c, ox + x, oy + y, w, h, col);
  const B = (x: number, y: number, w: number, h: number, col: string) => r(c, ox + x, oy + y + bob, w, h, col);
  const side = dir === 1 || dir === 2;
  const left = dir === 1;

  // --- Legs (planted on the ground, never bob)
  const leg = (x: number, lifted: boolean) => {
    R(x, 15, 2, lifted ? 3 : 4, p.pants);
    R(x + 1, 15, 1, lifted ? 3 : 4, p.pantsD);
    R(x, lifted ? 18 : 19, 2, 1, p.shoes);
  };
  if (!side) {
    leg(5, pose === 2);
    leg(9, pose === 3);
  } else if (pose === 2) {
    leg(4, false);
    leg(10, true);
  } else if (pose === 3) {
    leg(7, false);
  } else {
    leg(6, false);
    leg(8, false);
  }

  // --- Torso
  if (!side) {
    B(4, 9, 8, 6, p.shirt);
    B(4, 9, 2, 5, p.shirtL);
    B(10, 10, 2, 5, p.shirtD);
    B(4, 14, 8, 1, p.shirtD);
    const swing = pose === 2 ? 1 : pose === 3 ? -1 : 0;
    const la = 10 + Math.max(0, swing);
    const ra = 10 + Math.max(0, -swing);
    B(3, la, 1, 4, p.shirt);
    B(12, ra, 1, 4, p.shirtD);
    B(3, la + 4, 1, 1, p.skin);
    B(12, ra + 4, 1, 1, p.skinD);
    if (dir === 0) {
      B(7, 9, 2, 1, p.skinD); // neck
      B(6, 12, 4, 1, p.shirtD); // hoodie pocket
      B(7, 10, 1, 2, P.white); // drawstrings
      B(8, 10, 1, 2, P.white);
    } else {
      B(6, 9, 4, 2, p.shirtD); // hood
    }
  } else {
    B(5, 9, 6, 6, p.shirt);
    B(left ? 9 : 5, 9, 2, 6, p.shirtD);
    B(5, 14, 6, 1, p.shirtD);
    const ax = pose === 2 ? 6 : pose === 3 ? 8 : 7;
    B(ax, 10, 2, 4, p.shirtL);
    B(ax, 14, 2, 1, p.skin);
  }

  // --- Head
  B(3, 1, 10, 8, p.skin);
  const lock = p.longHair ? 11 : 5;
  if (dir === 0) {
    B(3, 0, 10, 4, p.hair);
    B(4, 0, 8, 1, p.hairD);
    B(5, 1, 4, 1, p.hairL);
    B(3, 3, 1, lock, p.hair);
    B(12, 3, 1, lock, p.hairD);
    B(4, 4, 2, 1, p.hair);
    B(10, 4, 2, 1, p.hair);
    // eyes with a catch-light
    B(5, 5, 2, 2, P.ink);
    B(9, 5, 2, 2, P.ink);
    B(5, 5, 1, 1, P.white);
    B(9, 5, 1, 1, P.white);
    B(4, 7, 1, 1, '#f3a1a8');
    B(11, 7, 1, 1, '#f3a1a8');
    B(7, 8, 2, 1, p.skinD);
  } else if (dir === 3) {
    B(3, 0, 10, 9, p.hair);
    B(4, 0, 8, 1, p.hairD);
    B(5, 2, 5, 1, p.hairL);
    B(11, 2, 2, 7, p.hairD);
    B(3, 3, 1, lock, p.hair);
    B(12, 3, 1, lock, p.hairD);
    if (p.longHair) {
      B(4, 9, 8, 4, p.hair);
      B(10, 9, 2, 4, p.hairD);
    }
  } else {
    B(3, 0, 10, 4, p.hair);
    B(4, 0, 8, 1, p.hairD);
    B(left ? 5 : 7, 1, 4, 1, p.hairL);
    const backX = left ? 9 : 3;
    B(backX, 1, 4, p.longHair ? 12 : 7, p.hair);
    B(left ? 3 : 10, 3, 3, 1, p.hair); // fringe
    B(left ? 12 : 3, 2, 1, p.longHair ? 11 : 6, p.hairD);
    B(left ? 3 : 12, 4, 1, 1, p.hair);
    const ex = left ? 5 : 9;
    B(ex, 5, 2, 2, P.ink);
    B(left ? 5 : 10, 5, 1, 1, P.white);
    B(left ? 4 : 10, 8, 2, 1, p.skinD);
    B(left ? 3 : 12, 7, 1, 1, '#f3a1a8');
  }
}

/** 4 poses × 4 directions on one outlined sheet. Frame index = dir * 4 + pose. */
export function makeCharSheet(p: CharPalette) {
  const { canvas, ctx } = makeCanvas(CHAR_FW * 4, CHAR_FH * 4);
  for (let dir = 0; dir < 4; dir++)
    for (let pose = 0; pose < 4; pose++) drawChar(ctx, pose * CHAR_FW + 1, dir * CHAR_FH + 2, dir, pose, p);
  return outline(canvas, P.outline, CHAR_FW, CHAR_FH);
}
