import { BUILDINGS, buildWorld } from '../config/world.config';
import { BUILDING_SIZE, makeBuilding } from './buildings';
import { CHAR_FH, CHAR_FW, NPC_PALETTES, PLAYER_PALETTE, makeCharSheet } from './characters';
import { makeIntroGround, makeMoon, makeSky, makeSkyline } from './intro';
import {
  TREE_FH, TREE_FW, makeBench, makeBug, makeBushes, makeCloud, makeDot, makeGlow, makeLamp, makeLightStamp,
  makeMarker, makeMonolith, makePixel, makeShadow, makeSignal, makeSmoke, makeTerminal, makeTrees,
} from './props';
import { lakeShapes, makeGround, makeLakeFrames } from './tiles';

/**
 * Every texture the game uses. Each entry bakes a spritesheet (or single image) canvas;
 * `fw`/`fh` slice it into numbered frames. Replace `make` with a loaded PNG of the same
 * frame size to swap in hand-drawn art without touching any scene code.
 */
export interface TextureDef {
  key: string;
  make: () => HTMLCanvasElement;
  fw?: number;
  fh?: number;
}

export function textureDefs(): TextureDef[] {
  const world = buildWorld();
  const defs: TextureDef[] = [
    { key: 'ground', make: () => makeGround(world) },
    { key: 'trees', make: makeTrees, fw: TREE_FW, fh: TREE_FH },
    { key: 'lamp', make: makeLamp, fw: 18, fh: 40 },
    { key: 'bushes', make: makeBushes, fw: 18, fh: 14 },
    { key: 'bench', make: makeBench },
    { key: 'monolith', make: makeMonolith, fw: 34, fh: 52 },
    { key: 'terminal', make: makeTerminal, fw: 18, fh: 24 },
    { key: 'bug', make: makeBug, fw: 12, fh: 12 },
    { key: 'shadow', make: makeShadow },
    { key: 'cloud', make: makeCloud },
    { key: 'light', make: () => makeLightStamp(128) },
    { key: 'glow', make: () => makeGlow(64) },
    { key: 'dot', make: makeDot },
    { key: 'pixel', make: makePixel },
    { key: 'marker', make: makeMarker },
    { key: 'smoke', make: makeSmoke },
    { key: 'signal', make: makeSignal, fw: 24, fh: 12 },
    { key: 'char-player', make: () => makeCharSheet(PLAYER_PALETTE), fw: CHAR_FW, fh: CHAR_FH },
    { key: 'sky', make: makeSky },
    { key: 'moon', make: makeMoon },
    { key: 'skyline-far', make: () => makeSkyline(false) },
    { key: 'skyline-near', make: () => makeSkyline(true) },
    { key: 'intro-ground', make: makeIntroGround },
  ];
  NPC_PALETTES.forEach((p, i) => defs.push({ key: `char-npc${i}`, make: () => makeCharSheet(p), fw: CHAR_FW, fh: CHAR_FH }));
  lakeShapes.forEach((_, i) => {
    const lake = makeLakeFrames(i);
    defs.push({ key: `lake${i}`, make: () => lake.canvas, fw: lake.w, fh: lake.h });
  });
  BUILDINGS.forEach((b) =>
    defs.push({ key: `b-${b.id}`, make: () => makeBuilding(b.id), fw: BUILDING_SIZE[b.id][0], fh: BUILDING_SIZE[b.id][1] }),
  );
  return defs;
}
