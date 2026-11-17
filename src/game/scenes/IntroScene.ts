import Phaser from 'phaser';
import { CHAR_ORIGIN } from '../art/characters';
import { bus } from '../bridge';

/** Animated title backdrop: parallax night city, drifting clouds and the developer on an endless walk. */
export class IntroScene extends Phaser.Scene {
  private far!: Phaser.GameObjects.TileSprite;
  private near!: Phaser.GameObjects.TileSprite;
  private ground!: Phaser.GameObjects.TileSprite;
  private clouds: Phaser.GameObjects.Image[] = [];
  private off: Array<() => void> = [];
  private leaving = false;

  constructor() {
    super('Intro');
  }

  create() {
    this.leaving = false;
    this.clouds = [];
    const { width: w, height: h } = this.scale;
    const s = Math.max(2, Math.round(h / 210));
    const horizon = Math.round(h * 0.72);

    const sky = this.add.tileSprite(0, 0, w, horizon, 'sky').setOrigin(0);
    sky.tileScaleX = s;
    sky.tileScaleY = horizon / 160;

    for (let i = 0; i < 90; i++) {
      const star = this.add
        .image(Math.random() * w, Math.random() * horizon * 0.8, i % 7 === 0 ? 'dot' : 'pixel')
        .setScale(i % 7 === 0 ? s * 0.7 : s * 0.5)
        .setTint(i % 3 === 0 ? 0xb79bff : i % 3 === 1 ? 0x67e8f9 : 0xffffff)
        .setAlpha(0.3 + Math.random() * 0.7);
      this.tweens.add({ targets: star, alpha: 0.15, duration: 700 + Math.random() * 2200, yoyo: true, repeat: -1, delay: Math.random() * 2000 });
    }

    this.add.image(w * 0.8, h * 0.2, 'glow').setScale(s * 3.2).setTint(0x8b9dff).setAlpha(0.5).setBlendMode(Phaser.BlendModes.ADD);
    this.add.image(w * 0.8, h * 0.2, 'moon').setScale(s * 1.6);

    for (let i = 0; i < 5; i++) {
      const cloud = this.add
        .image(Math.random() * w, horizon * (0.12 + Math.random() * 0.5), 'cloud')
        .setScale(s * (0.7 + Math.random() * 0.9))
        .setTint(i % 2 ? 0x3a2a84 : 0x263080)
        .setAlpha(0.75);
      cloud.setData('speed', (4 + Math.random() * 8) * s);
      this.clouds.push(cloud);
    }

    this.far = this.add.tileSprite(0, horizon, w, 110 * s, 'skyline-far').setOrigin(0, 1);
    this.far.tileScaleX = this.far.tileScaleY = s;
    this.near = this.add.tileSprite(0, horizon, w, 110 * s, 'skyline-near').setOrigin(0, 1);
    this.near.tileScaleX = this.near.tileScaleY = s;
    this.add.rectangle(0, horizon - 30 * s, w, 30 * s, 0x5a3aa6, 0.12).setOrigin(0);

    this.ground = this.add.tileSprite(0, horizon, w, h - horizon, 'intro-ground').setOrigin(0);
    this.ground.tileScaleX = this.ground.tileScaleY = s;

    const cs = s * 2;
    const px = Math.round(w / 2);
    const py = horizon + 20 * s;
    this.add.image(px, py, 'glow').setScale(cs * 1.4, cs * 0.5).setTint(0x67e8f9).setAlpha(0.18).setBlendMode(Phaser.BlendModes.ADD);
    this.add.image(px, py, 'shadow').setScale(cs);
    this.add.sprite(px, py, 'char-player').setOrigin(CHAR_ORIGIN.x, CHAR_ORIGIN.y).setScale(cs).play('char-player-walk-right');

    this.add.particles(0, 0, 'pixel', {
      x: { min: 0, max: w },
      y: { min: horizon * 0.5, max: h },
      lifespan: 5000,
      speedY: { min: -14, max: -4 },
      speedX: { min: -12, max: 4 },
      scale: s * 0.5,
      alpha: { start: 0.9, end: 0 },
      tint: [0x67e8f9, 0xb79bff, 0xffffff],
      frequency: 160,
      blendMode: Phaser.BlendModes.ADD,
    });

    this.cameras.main.fadeIn(500, 7, 10, 31);

    const onResize = () => {
      if (!this.leaving) this.scene.restart();
    };
    this.scale.on('resize', onResize);
    this.off = [
      bus.on('start-world', () => {
        if (this.leaving) return;
        this.leaving = true;
        this.cameras.main.fadeOut(650, 7, 10, 31);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('World'));
      }),
    ];
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', onResize);
      this.off.forEach((fn) => fn());
    });
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.far.tilePositionX += dt * 5;
    this.near.tilePositionX += dt * 13;
    this.ground.tilePositionX += dt * 34;
    const w = this.scale.width;
    for (const cloud of this.clouds) {
      cloud.x -= cloud.getData('speed') * dt;
      if (cloud.x < -cloud.displayWidth) cloud.x = w + cloud.displayWidth;
    }
  }
}
