import { BUILDINGS, G, LAKES, MAP_H, MAP_W, SECRETS, TILE, WORLD_H, WORLD_W, type WorldData, idx } from '../config/world.config';
import { P, blob, hash, hexRgb, makeCanvas, r, vnoise } from './canvas';

/** Pixel-space lake ellipses, slightly larger than the solid tiles so the shore reads as a soft bank. */
export const lakeShapes = LAKES.map((l) => ({
  cx: (l.cx + 0.5) * TILE,
  cy: (l.cy + 0.5) * TILE,
  rx: (l.rx + 0.45) * TILE,
  ry: (l.ry + 0.45) * TILE,
}));

/** 0 outside every lake, otherwise the normalised distance from the centre (0 centre … 1 shore). */
function lakeDepth(x: number, y: number): number {
  for (const l of lakeShapes) {
    const d = Math.sqrt(((x - l.cx) / l.rx) ** 2 + ((y - l.cy) / l.ry) ** 2);
    if (d <= 1) return Math.max(d, 0.001);
  }
  return 0;
}

const C = {
  grassD: hexRgb('#123041'),
  grass: hexRgb('#173b4b'),
  grassL: hexRgb('#1c4857'),
  blade: hexRgb('#2c7474'),
  bladeL: hexRgb('#3d9488'),
  bank: hexRgb('#0f2436'),
  bankL: hexRgb('#1f5560'),
  mortar: hexRgb('#262350'),
  stones: [hexRgb('#3f3a74'), hexRgb('#474282'), hexRgb('#39356c'), hexRgb('#4d4890')],
  stoneHi: hexRgb('#5f59a6'),
  pathEdge: hexRgb('#1c193f'),
  plazaA: hexRgb('#3c3778'),
  plazaB: hexRgb('#332e68'),
  plazaLine: hexRgb('#262250'),
  plazaHi: hexRgb('#4d4894'),
  trim: hexRgb('#22b8cf'),
  inlayA: hexRgb('#67e8f9'),
  inlayB: hexRgb('#8b5cf6'),
  deep: hexRgb('#173a9e'),
  mid: hexRgb('#1f4dbd'),
  shallow: hexRgb('#2a64d8'),
  foam: hexRgb('#8fd8ff'),
  cliff: hexRgb('#0b1c44'),
};

/**
 * Paints the whole static terrain per pixel: noise-shaded grass, cobbled roads with rounded corners,
 * a tiled plaza, depth-banded water with banks, then baked shadows and flowers on top.
 */
export function makeGround(world: WorldData) {
  const { canvas, ctx } = makeCanvas(WORLD_W, WORLD_H);
  const img = ctx.createImageData(WORLD_W, WORLD_H);
  const data = img.data;
  const tileAt = (tx: number, ty: number) =>
    tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H ? G.Grass : world.ground[idx(tx, ty)];
  const pavedTile = (tx: number, ty: number) => {
    const g = tileAt(tx, ty);
    return g === G.Path || g === G.Plaza;
  };

  // Pass 1 — material mask: 0 grass, 1 path, 2 plaza, 3 water.
  const mask = new Uint8Array(WORLD_W * WORLD_H);
  const RADIUS = 5;
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      const tx = x >> 4;
      const ty = y >> 4;
      let m = 0;
      if (lakeDepth(x, y) > 0) m = 3;
      else if (pavedTile(tx, ty)) {
        m = tileAt(tx, ty) === G.Plaza ? 2 : 1;
        // Round off convex corners so roads do not look like a tile grid.
        const lx = x & 15;
        const ly = y & 15;
        const sx = lx < RADIUS ? -1 : lx > 15 - RADIUS ? 1 : 0;
        const sy = ly < RADIUS ? -1 : ly > 15 - RADIUS ? 1 : 0;
        if (sx && sy && !pavedTile(tx + sx, ty) && !pavedTile(tx, ty + sy)) {
          const ccx = sx < 0 ? RADIUS : 15 - RADIUS;
          const ccy = sy < 0 ? RADIUS : 15 - RADIUS;
          if ((lx - ccx) ** 2 + (ly - ccy) ** 2 > RADIUS * RADIUS + 2) m = 0;
        }
      }
      mask[y * WORLD_W + x] = m;
    }
  }
  const m = (x: number, y: number) => (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H ? 0 : mask[y * WORLD_W + x]);
  const near = (x: number, y: number, kind: (v: number) => boolean, dist: number) => {
    for (let d = 1; d <= dist; d++)
      if (kind(m(x - d, y)) || kind(m(x + d, y)) || kind(m(x, y - d)) || kind(m(x, y + d))) return d;
    return 0;
  };
  const isWater = (v: number) => v === 3;
  const notPaved = (v: number) => v !== 1 && v !== 2;

  // Pass 2 — colour.
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      const kind = mask[y * WORLD_W + x];
      let col: number[];

      if (kind === 0) {
        const n = vnoise(x / 42, y / 42, 1) * 0.65 + vnoise(x / 12, y / 12, 2) * 0.35 + (hash(x, y, 3) - 0.5) * 0.1;
        col = n < 0.42 ? C.grassD : n < 0.6 ? C.grass : C.grassL;
        const h = hash(x, y, 4);
        if (h < 0.014) col = C.blade;
        else if (h < 0.02 && n > 0.5) col = C.bladeL;
        else if (hash(x, y + 1, 4) < 0.014) col = C.blade; // second pixel of a blade
        const w = near(x, y, isWater, 4);
        if (w) col = w <= 2 ? C.bank : hash(x, y, 5) < 0.5 ? C.bankL : C.bank;
        else if (near(x, y, (v) => v === 1 || v === 2, 1)) col = C.grassD;
      } else if (kind === 1) {
        const row = Math.floor(y / 6);
        const ox = x + (row % 2) * 5;
        const sx = ox % 10;
        const sy = y % 6;
        if (sx === 0 || sy === 0) col = C.mortar;
        else {
          col = C.stones[(hash(Math.floor(ox / 10), row, 6) * C.stones.length) | 0];
          if (sx === 1 && sy === 1) col = C.stoneHi;
          else if (hash(x, y, 7) < 0.05) col = C.mortar;
        }
        const e = near(x, y, notPaved, 2);
        if (e === 1) col = C.pathEdge;
        else if (e === 2) col = C.mortar;
      } else if (kind === 2) {
        const lx = x & 15;
        const ly = y & 15;
        const alt = ((x >> 4) + (y >> 4)) % 2;
        col = alt ? C.plazaA : C.plazaB;
        if (lx === 0 || ly === 0) col = C.plazaLine;
        else if (lx === 1 || ly === 1) col = C.plazaHi;
        else if (Math.abs(lx - 8) + Math.abs(ly - 8) <= 2) col = alt ? C.inlayA : C.inlayB;
        else if (Math.abs(lx - 8) + Math.abs(ly - 8) === 3) col = C.plazaLine;
        else if (hash(x, y, 8) < 0.04) col = C.plazaLine;
        const e = near(x, y, notPaved, 3);
        if (e === 1) col = C.plazaLine;
        else if (e === 2 || e === 3) col = C.trim;
      } else {
        const d = lakeDepth(x, y) + (((x + y) & 1) ? 0.025 : -0.025) + (vnoise(x / 9, y / 9, 9) - 0.5) * 0.12;
        col = d > 0.84 ? C.shallow : d > 0.6 ? C.mid : C.deep;
        if (m(x, y - 1) !== 3 || m(x, y - 2) !== 3 || m(x, y - 3) !== 3) col = C.cliff;
        else if (m(x, y - 4) !== 3) col = C.foam;
        else if (m(x, y + 1) !== 3 || m(x - 1, y) !== 3 || m(x + 1, y) !== 3) col = C.shallow;
      }

      const i = (y * WORLD_W + x) * 4;
      data[i] = col[0];
      data[i + 1] = col[1];
      data[i + 2] = col[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Pass 3 — baked contact shadows (moon sits upper-left, so shadows fall down-right).
  const shadow = (fn: () => void, alpha: number) => {
    ctx.globalAlpha = alpha;
    fn();
    ctx.globalAlpha = 1;
  };
  const S = '#040618';
  for (const b of BUILDINGS) {
    const x = b.tx * TILE;
    const y = b.ty * TILE;
    const w = b.tw * TILE;
    const h = b.th * TILE;
    shadow(() => {
      r(ctx, x + 6, y + h, w + 4, 7, S);
      r(ctx, x + w, y + 14, 10, h - 10, S);
    }, 0.34);
    shadow(() => r(ctx, x + 2, y + h, w + 2, 3, S), 0.3);
  }
  for (const t of world.trees) {
    const cx = t.tx * TILE + 10;
    const cy = t.ty * TILE + 14;
    shadow(() => blob(ctx, cx, cy, 12, 5, S), 0.3);
  }
  for (const l of world.lamps) shadow(() => blob(ctx, l.tx * TILE + 10, l.ty * TILE + 15, 6, 2, S), 0.35);
  for (const b of world.benches) shadow(() => r(ctx, b.tx * TILE + 3, b.ty * TILE + 13, 30, 3, S), 0.3);
  for (const b of world.bushes) shadow(() => blob(ctx, b.tx * TILE + 9, b.ty * TILE + 14, 7, 2, S), 0.28);
  shadow(() => blob(ctx, (SECRETS.monolith.tx + 1) * TILE + 4, (SECRETS.monolith.ty + 1) * TILE, 18, 5, S), 0.4);

  // Pass 4 — flowers and pebbles.
  const petals = [P.cyan, P.violetL, P.pink];
  for (const f of world.flowers) {
    const x = f.tx * TILE + 3 + ((hash(f.tx, f.ty, 11) * 9) | 0);
    const y = f.ty * TILE + 3 + ((hash(f.tx, f.ty, 12) * 8) | 0);
    if (m(x, y) !== 0 || m(x, y + 4) !== 0) continue;
    if (hash(f.tx, f.ty, 13) < 0.25) {
      r(ctx, x, y + 3, 3, 2, '#2b3566');
      r(ctx, x, y + 3, 2, 1, '#44518f');
      continue;
    }
    r(ctx, x + 1, y + 2, 1, 3, '#2c7474');
    r(ctx, x, y + 3, 1, 1, '#2c7474');
    r(ctx, x, y, 3, 2, petals[f.variant]);
    r(ctx, x + 1, y, 1, 1, P.white);
  }
  return canvas;
}

/** Per-lake animated overlay (4 frames): drifting ripples, glints and a breathing foam line. */
export function makeLakeFrames(i: number) {
  const l = lakeShapes[i];
  const w = Math.ceil(l.rx * 2) + 2;
  const h = Math.ceil(l.ry * 2) + 2;
  const { canvas, ctx: c } = makeCanvas(w * 4, h);
  for (let f = 0; f < 4; f++) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const d = Math.sqrt(((x - w / 2) / l.rx) ** 2 + ((y - h / 2) / l.ry) ** 2);
        if (d > 0.97) continue;
        const wx = x + f * 2;
        // Ripple dashes on a staggered lattice, scrolling sideways.
        const row = Math.floor(y / 5);
        const inDash = y % 5 === 2 && (wx + row * 7) % 17 < 4 + (row % 3);
        if (inDash && hash(Math.floor((wx + row * 7) / 17), row, 20) < 0.55) {
          c.globalAlpha = d > 0.7 ? 0.55 : 0.32;
          r(c, f * w + x, y, 1, 1, P.sky);
        }
        // Moonlit glints that twinkle between frames.
        if (hash(x, y, 21) < 0.006 && (hash(x, y, 22) * 4) | 0) {
          c.globalAlpha = ((hash(x, y, 23) * 4 + f) | 0) % 4 === 0 ? 1 : 0.35;
          r(c, f * w + x, y, 1, 1, P.white);
        }
        // Foam hugging the shore.
        if (d > 0.9 && d < 0.94 + (f % 2) * 0.02 && hash((x + f) >> 1, y >> 1, 24) < 0.45) {
          c.globalAlpha = 0.6;
          r(c, f * w + x, y, 1, 1, '#b8e6ff');
        }
      }
    }
  }
  c.globalAlpha = 1;
  return { canvas, w, h };
}
