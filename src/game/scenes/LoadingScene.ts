import Phaser from 'phaser';
import { textureDefs, type TextureDef } from '../art';
import { bus } from '../bridge';

const DIRS = ['down', 'left', 'right', 'up'];

/** Bakes every spritesheet a few per frame, reporting real progress to the Vue loading bar. */
export class LoadingScene extends Phaser.Scene {
  private queue: TextureDef[] = [];
  private total = 0;
  private done = false;

  constructor() {
    super('Loading');
  }

  create() {
    this.queue = textureDefs();
    this.total = this.queue.length;
    bus.emit('load-progress', 0);
  }

  update() {
    const def = this.queue.shift();
    if (def) {
      this.bake(def);
      bus.emit('load-progress', Math.round(((this.total - this.queue.length) / this.total) * 100));
      return;
    }
    if (this.done) return;
    this.done = true;
    this.createAnimations();
    // Wait for the pixel font so in-world labels never flash in a fallback face.
    const ready = () => {
      bus.emit('boot-ready');
      this.scene.start('Intro');
    };
    const fonts = document.fonts?.load('8px "Press Start 2P"');
    if (fonts) Promise.race([fonts, new Promise((res) => setTimeout(res, 1500))]).then(ready, ready);
    else ready();
  }

  private bake(def: TextureDef) {
    if (this.textures.exists(def.key)) return;
    const canvas = def.make();
    const tex = this.textures.addCanvas(def.key, canvas)!;
    if (def.fw && def.fh) {
      let i = 0;
      for (let y = 0; y + def.fh <= canvas.height; y += def.fh)
        for (let x = 0; x + def.fw <= canvas.width; x += def.fw) tex.add(i++, 0, x, y, def.fw, def.fh);
    }
  }

  private createAnimations() {
    const frames = (key: string, list: number[]) => list.map((frame) => ({ key, frame }));
    const make = (key: string, sheet: string, list: number[], frameRate: number) => {
      if (!this.anims.exists(key)) this.anims.create({ key, frames: frames(sheet, list), frameRate, repeat: -1 });
    };
    for (const sheet of ['char-player', 'char-npc0', 'char-npc1', 'char-npc2', 'char-npc3']) {
      DIRS.forEach((dir, d) => {
        make(`${sheet}-idle-${dir}`, sheet, [d * 4, d * 4, d * 4 + 1, d * 4 + 1], 2.5);
        make(`${sheet}-walk-${dir}`, sheet, [d * 4 + 2, d * 4, d * 4 + 3, d * 4], 8);
      });
    }
    make('tree0', 'trees', [0, 1], 1.1);
    make('tree1', 'trees', [2, 3], 0.9);
    make('lamp', 'lamp', [0, 0, 0, 1, 0, 0, 1, 1], 5);
    make('terminal', 'terminal', [0, 1], 2);
    make('bug', 'bug', [0, 1], 6);
    make('monolith-on', 'monolith', [1, 2], 3);
    make('signal', 'signal', [0, 1, 2], 4);
    make('lake0', 'lake0', [0, 1, 2, 3], 3);
    make('lake1', 'lake1', [0, 1, 2, 3], 3);
    for (const id of ['house', 'lab', 'projects', 'career', 'hall', 'tower']) make(`b-${id}`, `b-${id}`, [0, 1], 1.6);
  }
}
