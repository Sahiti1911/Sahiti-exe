import Phaser from 'phaser';
import { CHAR_ORIGIN } from '../art/characters';
import { TILE, type NpcDef } from '../config/world.config';
import type { CollisionSystem } from '../systems/CollisionSystem';

const DIRS = ['down', 'left', 'right', 'up'] as const;
const VEC = [[0, 1], [-1, 0], [1, 0], [0, -1]];
const SPEED = 20;
const LEASH = 26;

/** A townsperson who wanders near home and turns to face the player when approached. */
export class NPC {
  readonly sprite: Phaser.GameObjects.Sprite;
  private shadow: Phaser.GameObjects.Image;
  private homeX: number;
  private homeY: number;
  private dir = 0;
  private walking = false;
  private timer = 1 + Math.random() * 2;
  x: number;
  y: number;

  constructor(scene: Phaser.Scene, readonly def: NpcDef, private collision: CollisionSystem) {
    this.x = this.homeX = def.tx * TILE + 8;
    this.y = this.homeY = def.ty * TILE + 12;
    this.shadow = scene.add.image(this.x, this.y, 'shadow');
    this.sprite = scene.add.sprite(this.x, this.y, def.sheet).setOrigin(CHAR_ORIGIN.x, CHAR_ORIGIN.y);
    this.sync();
  }

  update(dt: number, playerX: number, playerY: number) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    if (Math.hypot(dx, dy) < 26) {
      // Stop and face the player.
      this.walking = false;
      this.timer = 1;
      this.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : dy < 0 ? 3 : 0;
    } else {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.walking = !this.walking;
        this.timer = this.walking ? 0.5 + Math.random() * 0.9 : 1.2 + Math.random() * 2.5;
        if (this.walking) this.dir = (Math.random() * 4) | 0;
      }
      if (this.walking) {
        const [vx, vy] = VEC[this.dir];
        const nx = this.x + vx * SPEED * dt;
        const ny = this.y + vy * SPEED * dt;
        const tooFar = Math.hypot(nx - this.homeX, ny - this.homeY) > LEASH;
        if (tooFar || this.collision.blocked(nx, ny, 10, 6)) this.walking = false;
        else {
          this.x = nx;
          this.y = ny;
        }
      }
    }
    this.sprite.play(`${this.def.sheet}-${this.walking ? 'walk' : 'idle'}-${DIRS[this.dir]}`, true);
    this.sync();
  }

  private sync() {
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    this.sprite.setPosition(x, y).setDepth(10 + y);
    this.shadow.setPosition(x, y).setDepth(9 + y);
  }
}
