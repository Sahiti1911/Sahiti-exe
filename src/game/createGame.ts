import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { IntroScene } from './scenes/IntroScene';
import { LoadingScene } from './scenes/LoadingScene';
import { WorldScene } from './scenes/WorldScene';

/** Creates the Phaser game inside `parent`. This is the only place Vue touches Phaser directly. */
export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#070a1f',
    pixelArt: true,
    roundPixels: true,
    banner: false,
    audio: { noAudio: true },
    // Only clicks on the canvas itself reach the world — never clicks on HUD buttons or menus drawn above it.
    input: { windowEvents: false },
    scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
    scene: [BootScene, LoadingScene, IntroScene, WorldScene],
  });
}
