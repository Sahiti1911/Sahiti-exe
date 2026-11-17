import { MAP_H, MAP_W, TILE } from '../config/world.config';

/** Axis-separated AABB collision against the solid tile grid. Also enforces the world boundary. */
export class CollisionSystem {
  constructor(private solid: Uint8Array) {}

  isSolidTile(tx: number, ty: number): boolean {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
    return this.solid[ty * MAP_W + tx] === 1;
  }

  /** `x` is the horizontal centre of the box, `y` its bottom edge (the character's feet). */
  blocked(x: number, y: number, w: number, h: number): boolean {
    const x0 = Math.floor((x - w / 2) / TILE);
    const x1 = Math.floor((x + w / 2 - 0.001) / TILE);
    const y0 = Math.floor((y - h) / TILE);
    const y1 = Math.floor((y - 0.001) / TILE);
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (this.isSolidTile(tx, ty)) return true;
    return false;
  }

  /** Moves as far as allowed, sliding along walls. Returns the resolved position. */
  move(x: number, y: number, dx: number, dy: number, w: number, h: number): { x: number; y: number } {
    if (dx !== 0 && !this.blocked(x + dx, y, w, h)) x += dx;
    if (dy !== 0 && !this.blocked(x, y + dy, w, h)) y += dy;
    return { x, y };
  }
}
