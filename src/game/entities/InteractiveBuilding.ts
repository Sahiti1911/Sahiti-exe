import Phaser from 'phaser';
import { BUILDING_LIGHTS } from '../art/buildings';
import { bus, gameState } from '../bridge';
import { TILE, doorPoint, type BuildingDef } from '../config/world.config';

export interface LightSource {
  x: number;
  y: number;
  radius: number;
  color: number;
}

/** A location in the world: animated sprite, click target, door marker and its light sources. */
export class InteractiveBuilding {
  readonly sprite: Phaser.GameObjects.Sprite;
  readonly door: { x: number; y: number };
  readonly lights: LightSource[];
  private marker: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, readonly def: BuildingDef) {
    const x = def.tx * TILE;
    const y = def.ty * TILE;
    this.door = doorPoint(def);
    this.sprite = scene.add
      .sprite(x, y, `b-${def.id}`)
      .setOrigin(0)
      .setDepth(10 + y + def.th * TILE - 4)
      .play({ key: `b-${def.id}`, startFrame: (def.tx + def.ty) % 2 });

    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on(Phaser.Input.Events.POINTER_OVER, () => this.sprite.setTint(0xdbe6ff, 0xdbe6ff, 0xffffff, 0xffffff));
    // A click only counts when the press both started and ended on this building,
    // so releases that began on the HUD (or in Portfolio Mode) never open a panel by accident.
    let pressed = false;
    this.sprite.on(Phaser.Input.Events.POINTER_DOWN, () => (pressed = true));
    this.sprite.on(Phaser.Input.Events.POINTER_OUT, () => {
      pressed = false;
      this.sprite.clearTint();
    });
    this.sprite.on(Phaser.Input.Events.POINTER_UP, () => {
      if (pressed && !gameState.uiLocked) bus.emit('interact', { kind: 'location', id: def.id });
      pressed = false;
    });

    this.lights = BUILDING_LIGHTS[def.id].map(([lx, ly, radius, color]) => ({ x: x + lx, y: y + ly, radius, color }));

    this.marker = scene.add.image(this.door.x, y - 6, 'marker').setDepth(2300);
    scene.tweens.add({ targets: this.marker, y: y - 11, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  /** The bobbing arrow is only shown until the location has been discovered. */
  setVisited(visited: boolean) {
    this.marker.setVisible(!visited);
  }
}
