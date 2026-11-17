import type { LocationId } from '../../data/types';

/** World layout. Pure data + a deterministic generator — no Phaser imports, so the minimap can use it too. */
export const TILE = 16;
export const MAP_W = 64;
export const MAP_H = 44;
export const WORLD_W = MAP_W * TILE;
export const WORLD_H = MAP_H * TILE;

export const G = { Grass: 0, Path: 1, Water: 2, Plaza: 3 } as const;

export interface BuildingDef {
  id: LocationId;
  /** Footprint in tiles. The whole footprint is solid; the sprite fills it exactly. */
  tx: number;
  ty: number;
  tw: number;
  th: number;
  /** Left tile of the two-tile-wide door on the bottom row. */
  doorTx: number;
}

export const BUILDINGS: BuildingDef[] = [
  { id: 'house', tx: 8, ty: 10, tw: 8, th: 6, doorTx: 11 },
  { id: 'lab', tx: 27, ty: 9, tw: 10, th: 7, doorTx: 31 },
  { id: 'projects', tx: 47, ty: 9, tw: 10, th: 7, doorTx: 51 },
  { id: 'career', tx: 8, ty: 26, tw: 8, th: 9, doorTx: 11 },
  { id: 'hall', tx: 27, ty: 28, tw: 10, th: 7, doorTx: 31 },
  { id: 'tower', tx: 48, ty: 25, tw: 8, th: 10, doorTx: 51 },
];

/** World-pixel point just outside a building's door. */
export function doorPoint(b: BuildingDef) {
  return { x: (b.doorTx + 1) * TILE, y: (b.ty + b.th) * TILE + 9 };
}

/** Lakes as ellipses, in tile units. */
export const LAKES = [
  { cx: 21, cy: 8.5, rx: 4.2, ry: 3.6 },
  { cx: 26.5, cy: 39.3, rx: 3.3, ry: 1.6 },
];

export const SPAWN = { tx: 12, ty: 18 };

export const SECRETS = {
  terminal: { tx: 59, ty: 4 },
  bug: { tx: 4, ty: 39 },
  /** Two tiles wide, in the middle of the plaza. */
  monolith: { tx: 31, ty: 21 },
};

export interface NpcDef {
  id: string;
  name: string;
  tx: number;
  ty: number;
  sheet: string;
  lines: string[];
}

export const NPCS: NpcDef[] = [
  {
    id: 'guide',
    name: 'Guide',
    tx: 15,
    ty: 18,
    sheet: 'char-npc0',
    lines: [
      'Welcome to the Multiverse, Player 001!',
      'That cozy house just north of here is where the developer lives. Walk up to the door and press E.',
      'In a hurry? You can also click any building to step inside.',
    ],
  },
  {
    id: 'engineer',
    name: 'Engineer',
    tx: 34,
    ty: 24,
    sheet: 'char-npc1',
    lines: [
      'The Code Lab is right north of this plaza. Every terminal in there has a story.',
      'See the monolith behind me? They say it wakes up once all six locations have been discovered.',
    ],
  },
  {
    id: 'scout',
    name: 'Scout',
    tx: 45,
    ty: 19,
    sheet: 'char-npc2',
    lines: [
      'Project World is just up the road. Each station hides something that was actually built.',
      'Psst… not everything in this world is on the map. Check the far corners.',
    ],
  },
  {
    id: 'operator',
    name: 'Operator',
    tx: 44,
    ty: 37,
    sheet: 'char-npc3',
    lines: [
      'The Communication Tower is how you reach Sahiti. Do not leave without saying hi.',
      'Old-school players know a certain code: up, up, down, down, left, right, left, right, B, A.',
    ],
  },
];

const LAMPS: Array<[number, number]> = [
  [8, 20], [16, 20], [24, 20], [40, 20], [48, 20], [56, 20],
  [6, 37], [18, 37], [36, 37], [47, 37], [57, 37],
  [27, 17], [36, 17], [27, 26], [36, 26],
];
const BENCHES: Array<[number, number]> = [
  [29, 18], [33, 18],
];
/** Hand-placed grove hiding the secret terminal (open to the south). */
const FIXED_TREES: Array<[number, number]> = [
  [58, 3], [59, 3], [60, 3], [58, 4], [60, 4], [58, 6], [60, 6], [57, 5], [61, 5],
];

export interface WorldData {
  ground: Uint8Array;
  solid: Uint8Array;
  trees: Array<{ tx: number; ty: number; variant: number }>;
  bushes: Array<{ tx: number; ty: number; variant: number }>;
  flowers: Array<{ tx: number; ty: number; variant: number }>;
  lamps: Array<{ tx: number; ty: number }>;
  benches: Array<{ tx: number; ty: number }>;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const idx = (tx: number, ty: number) => ty * MAP_W + tx;
const inMap = (tx: number, ty: number) => tx >= 0 && ty >= 0 && tx < MAP_W && ty < MAP_H;

let cached: WorldData | null = null;

export function buildWorld(): WorldData {
  if (cached) return cached;
  const ground = new Uint8Array(MAP_W * MAP_H);
  const solid = new Uint8Array(MAP_W * MAP_H);
  const reserved = new Uint8Array(MAP_W * MAP_H);
  const rand = mulberry32(20261116);

  const fill = (x0: number, y0: number, x1: number, y1: number, g: number) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inMap(x, y)) ground[idx(x, y)] = g;
  };
  const reserve = (x0: number, y0: number, x1: number, y1: number) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inMap(x, y)) reserved[idx(x, y)] = 1;
  };
  const ellipse = (cx: number, cy: number, rx: number, ry: number, g: number) => {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
        if (inMap(x, y) && ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) ground[idx(x, y)] = g;
  };

  // Roads
  fill(5, 21, 58, 22, G.Path); // main street
  fill(5, 35, 58, 36, G.Path); // lower street
  fill(20, 23, 21, 34, G.Path); // west connector
  fill(42, 23, 43, 34, G.Path); // east connector
  for (const b of BUILDINGS) {
    const bottom = b.ty + b.th;
    if (bottom < 21) fill(b.doorTx, bottom, b.doorTx + 1, 20, G.Path);
  }
  fill(28, 18, 35, 25, G.Plaza);

  // Water
  LAKES.forEach((l) => ellipse(l.cx, l.cy, l.rx, l.ry, G.Water));

  // Solids: water, buildings, monolith, terminal, map border
  for (let i = 0; i < ground.length; i++) if (ground[i] === G.Water) solid[i] = 1;
  for (const b of BUILDINGS) {
    for (let y = b.ty; y < b.ty + b.th; y++) for (let x = b.tx; x < b.tx + b.tw; x++) solid[idx(x, y)] = 1;
    reserve(b.tx - 1, b.ty - 2, b.tx + b.tw, b.ty + b.th + 1);
  }
  solid[idx(SECRETS.monolith.tx, SECRETS.monolith.ty)] = 1;
  solid[idx(SECRETS.monolith.tx + 1, SECRETS.monolith.ty)] = 1;
  solid[idx(SECRETS.terminal.tx, SECRETS.terminal.ty)] = 1;

  const trees: WorldData['trees'] = [];
  const treeAt = new Set<number>();
  const addTree = (tx: number, ty: number) => {
    if (treeAt.has(idx(tx, ty))) return;
    treeAt.add(idx(tx, ty));
    solid[idx(tx, ty)] = 1;
    trees.push({ tx, ty, variant: rand() < 0.35 ? 1 : 0 });
  };

  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) if (x < 2 || y < 2 || x >= MAP_W - 2 || y >= MAP_H - 2) addTree(x, y);
  FIXED_TREES.forEach(([x, y]) => addTree(x, y));

  const lamps = LAMPS.map(([tx, ty]) => ({ tx, ty }));
  lamps.forEach((l) => {
    solid[idx(l.tx, l.ty)] = 1;
    reserve(l.tx - 1, l.ty - 1, l.tx + 1, l.ty + 1);
  });
  const benches = BENCHES.map(([tx, ty]) => ({ tx, ty }));
  benches.forEach((b) => {
    solid[idx(b.tx, b.ty)] = 1;
    solid[idx(b.tx + 1, b.ty)] = 1;
  });

  // Keep clear: everything next to a non-grass tile, the spawn, NPC homes and the secret approaches.
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) if (ground[idx(x, y)] !== G.Grass) reserve(x - 1, y - 1, x + 1, y + 1);
  reserve(SPAWN.tx - 2, SPAWN.ty - 2, SPAWN.tx + 2, SPAWN.ty + 2);
  NPCS.forEach((n) => reserve(n.tx - 2, n.ty - 2, n.tx + 2, n.ty + 2));
  reserve(SECRETS.terminal.tx - 3, SECRETS.terminal.ty - 2, SECRETS.terminal.tx + 3, SECRETS.terminal.ty + 4);
  reserve(SECRETS.bug.tx - 1, SECRETS.bug.ty - 1, SECRETS.bug.tx + 1, SECRETS.bug.ty + 1);

  // Scattered trees. No two are ever 8-adjacent, so they can never wall the player in.
  const bushes: WorldData['bushes'] = [];
  const flowers: WorldData['flowers'] = [];
  for (let y = 2; y < MAP_H - 2; y++) {
    for (let x = 2; x < MAP_W - 2; x++) {
      if (ground[idx(x, y)] !== G.Grass) continue;
      const roll = rand();
      if (reserved[idx(x, y)]) {
        if (roll < 0.1 && !solid[idx(x, y)]) flowers.push({ tx: x, ty: y, variant: (rand() * 3) | 0 });
        continue;
      }
      let neighbour = false;
      for (let dy = -1; dy <= 1 && !neighbour; dy++)
        for (let dx = -1; dx <= 1; dx++) if (treeAt.has(idx(x + dx, y + dy))) neighbour = true;
      if (roll < 0.085 && !neighbour) addTree(x, y);
      else if (roll < 0.13) bushes.push({ tx: x, ty: y, variant: (rand() * 2) | 0 });
      else if (roll < 0.3) flowers.push({ tx: x, ty: y, variant: (rand() * 3) | 0 });
    }
  }

  cached = { ground, solid, trees, bushes, flowers, lamps, benches };
  return cached;
}
