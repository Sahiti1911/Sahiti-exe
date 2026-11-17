import Phaser from 'phaser';

/** First scene: nothing to preload from disk, so it hands straight over to the texture baker. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.scene.start('Loading');
  }
}
