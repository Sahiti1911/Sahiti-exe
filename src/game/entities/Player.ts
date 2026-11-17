import Phaser from 'phaser';
import { CHAR_ORIGIN } from '../art/characters';
import { bus } from '../bridge';
import { MOVEMENT } from '../config/controls.config';
import type { CollisionSystem } from '../systems/CollisionSystem';

const DIRS = ['down', 'left', 'right', 'up'] as const;

export class Player {
  readonly sprite: Phaser.GameObjects.Sprite;
  private shadow: Phaser.GameObjects.Image;
  private dir = 0;
  private stepTimer = 0;
  /** Sub-pixel position; the sprite itself is snapped to whole pixels. */
  x: number;
  y: number;

  constructor(scene: Phaser.Scene, x: number, y: number, private collision: CollisionSystem) {
    this.x = x;
    this.y = y;
    this.shadow = scene.add.image(x, y, 'shadow');
    this.sprite = scene.add.sprite(x, y, 'char-player').setOrigin(CHAR_ORIGIN.x, CHAR_ORIGIN.y);
    this.sprite.play('char-player-idle-down');
    this.sync();
  }

  /** `ix`/`iy` are the desired direction, each in [-1, 1]. */
  update(dt: number, ix: number, iy: number, speedMultiplier = 1) {
    const len = Math.hypot(ix, iy);
    const moving = len > 0.1;
    if (moving) {
      const speed = MOVEMENT.speed * speedMultiplier * dt;
      const next = this.collision.move(this.x, this.y, (ix / len) * speed, (iy / len) * speed, MOVEMENT.boxWidth, MOVEMENT.boxHeight);
      this.x = next.x;
      this.y = next.y;
      this.dir = Math.abs(ix) > Math.abs(iy) ? (ix < 0 ? 1 : 2) : iy < 0 ? 3 : 0;
      this.stepTimer -= dt;
      if (this.stepTimer <= 0) {
        this.stepTimer = MOVEMENT.stepInterval;
        bus.emit('step');
      }
    } else {
      this.stepTimer = 0;
    }
    this.sprite.play(`char-player-${moving ? 'walk' : 'idle'}-${DIRS[this.dir]}`, true);
    this.sync();
  }

  teleport(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dir = 3;
    this.sprite.play('char-player-idle-up', true);
    this.sync();
  }

  private sync() {
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    this.sprite.setPosition(x, y).setDepth(10 + y);
    this.shadow.setPosition(x, y).setDepth(9 + y);
  }
}
