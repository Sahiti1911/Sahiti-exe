import Phaser from 'phaser';
import { locationById } from '../../data/quests';
import { lakeShapes } from '../art/tiles';
import { bus, gameState, type InteractTarget } from '../bridge';
import { CONTROLS, INTERACT_RADIUS, MOVEMENT } from '../config/controls.config';
import { BUILDINGS, MAP_H, MAP_W, NPCS, SECRETS, SPAWN, TILE, WORLD_H, WORLD_W, buildWorld, idx } from '../config/world.config';
import { InteractiveBuilding, type LightSource } from '../entities/InteractiveBuilding';
import { NPC } from '../entities/NPC';
import { Player } from '../entities/Player';
import { CollisionSystem } from '../systems/CollisionSystem';

interface Interactable {
  key: string;
  x: number;
  y: number;
  radius: number;
  text: string;
  target: InteractTarget;
  enabled?: () => boolean;
}

const NIGHT = 0x050720;
const NIGHT_ALPHA = 0.46;
const ADD = Phaser.BlendModes.ADD;

/** The playable overworld. */
export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private npcs: NPC[] = [];
  private buildings: InteractiveBuilding[] = [];
  private collision!: CollisionSystem;
  private keys!: Record<string, Phaser.Input.Keyboard.Key[]>;
  private interactables: Interactable[] = [];
  private currentKey = '';
  private lightSources: LightSource[] = [];
  private night!: Phaser.GameObjects.RenderTexture;
  private stamp!: Phaser.GameObjects.Image;
  private clouds: Phaser.GameObjects.Image[] = [];
  private bug?: Phaser.GameObjects.Sprite;
  private monolith!: Phaser.GameObjects.Sprite;
  private monolithLight!: LightSource;
  private monolithGlow!: Phaser.GameObjects.Image;
  private debugGfx!: Phaser.GameObjects.Graphics;
  private wasLocked = true;
  private wantInteract = false;
  private baseZoom = 3;

  constructor() {
    super('World');
  }

  create() {
    const world = buildWorld();
    this.collision = new CollisionSystem(world.solid);
    this.npcs = [];
    this.buildings = [];
    this.interactables = [];
    this.lightSources = [];
    this.clouds = [];
    this.currentKey = '';

    // --- Terrain and water
    this.add.image(0, 0, 'ground').setOrigin(0).setDepth(0);
    lakeShapes.forEach((l, i) => this.add.sprite(l.cx, l.cy, `lake${i}`).setDepth(1).play(`lake${i}`));

    // --- Vegetation and street furniture (depth-sorted by their base line)
    for (const t of world.trees) {
      const tree = this.add
        .sprite(t.tx * TILE + 8, t.ty * TILE + 17, 'trees', t.variant * 2)
        .setOrigin(0.5, 1)
        .setDepth(10 + t.ty * TILE + 15);
      tree.play({ key: `tree${t.variant}`, startFrame: (t.tx * 7 + t.ty * 3) % 2, delay: ((t.tx * 13 + t.ty * 29) % 10) * 90 });
    }
    for (const b of world.bushes) {
      this.add.image(b.tx * TILE + 8, b.ty * TILE + 15, 'bushes', b.variant).setOrigin(0.5, 1).setDepth(10 + b.ty * TILE + 13);
    }
    for (const b of world.benches) {
      this.add.image(b.tx * TILE - 1, b.ty * TILE - 2, 'bench').setOrigin(0).setDepth(10 + b.ty * TILE + 14);
    }
    for (const l of world.lamps) {
      const x = l.tx * TILE + 8;
      const y = l.ty * TILE + 16;
      this.add.sprite(x, y, 'lamp').setOrigin(0.5, 1).setDepth(10 + y - 2).play({ key: 'lamp', startFrame: (l.tx + l.ty) % 8 });
      this.addLight({ x, y: y - 22, radius: 62, color: 0x9fe8ff }, 0.5);
    }

    // --- Buildings
    for (const def of BUILDINGS) {
      const b = new InteractiveBuilding(this, def);
      this.buildings.push(b);
      b.lights.forEach((l) => this.addLight(l, 0.34));
      this.interactables.push({
        key: `location:${def.id}`,
        x: b.door.x,
        y: b.door.y,
        radius: INTERACT_RADIUS + 4,
        text: locationById(def.id).name,
        target: { kind: 'location', id: def.id },
      });
    }
    this.addBuildingEffects();

    // --- Secrets
    const mx = (SECRETS.monolith.tx + 1) * TILE;
    const my = (SECRETS.monolith.ty + 1) * TILE;
    this.monolith = this.add.sprite(mx, my + 2, 'monolith', 0).setOrigin(0.5, 1).setDepth(10 + my);
    this.monolithLight = { x: mx, y: my - 20, radius: 0, color: 0x67e8f9 };
    this.lightSources.push(this.monolithLight);
    this.monolithGlow = this.add.image(mx, my - 22, 'glow').setScale(2.6).setTint(0x67e8f9).setBlendMode(ADD).setDepth(2100).setAlpha(0);
    this.tweens.add({ targets: this.monolithGlow, scale: 3.1, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.interactables.push({ key: 'monolith', x: mx, y: my + 8, radius: INTERACT_RADIUS, text: 'Inspect the monolith', target: { kind: 'monolith' } });

    const tx = SECRETS.terminal.tx * TILE + 8;
    const ty = SECRETS.terminal.ty * TILE + 16;
    this.add.sprite(tx, ty, 'terminal').setOrigin(0.5, 1).setDepth(10 + ty).play('terminal');
    this.addLight({ x: tx, y: ty - 12, radius: 26, color: 0x34d399 }, 0.4);
    this.interactables.push({ key: 'terminal', x: tx, y: ty + 8, radius: INTERACT_RADIUS, text: 'Use the terminal', target: { kind: 'terminal' } });

    const bx = SECRETS.bug.tx * TILE + 8;
    const by = SECRETS.bug.ty * TILE + 10;
    this.bug = this.add.sprite(bx, by, 'bug').setDepth(10 + by).play('bug');
    this.tweens.add({ targets: this.bug, y: by - 3, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.interactables.push({
      key: 'bug', x: bx, y: by + 4, radius: INTERACT_RADIUS, text: 'Catch the golden bug', target: { kind: 'bug' },
      enabled: () => !gameState.bugCollected,
    });

    // --- Characters
    for (const def of NPCS) {
      const npc = new NPC(this, def, this.collision);
      this.npcs.push(npc);
    }
    this.player = new Player(this, SPAWN.tx * TILE + 8, SPAWN.ty * TILE + 12, this.collision);

    this.addAtmosphere();

    // --- Night lighting: a dark veil with light pools carved out every frame
    this.night = this.add.renderTexture(0, 0, WORLD_W, WORLD_H).setOrigin(0).setDepth(2000);
    this.stamp = this.make.image({ key: 'light', add: false });
    this.debugGfx = this.add.graphics().setDepth(3000).setVisible(false);

    // --- Camera
    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD_W, WORLD_H);
    cam.setRoundPixels(true);
    cam.startFollow(this.player.sprite, true, 0.09, 0.09, 0, 10);
    this.applyZoom(true);
    cam.fadeIn(700, 7, 10, 31);
    cam.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => bus.emit('world-ready'));

    // --- Input
    const kb = this.input.keyboard!;
    this.keys = {};
    for (const [action, names] of Object.entries(CONTROLS)) {
      this.keys[action] = names.map((n) => kb.addKey(Phaser.Input.Keyboard.KeyCodes[n as keyof typeof Phaser.Input.Keyboard.KeyCodes], false));
    }

    // Event-driven (not polled), so even a tap shorter than one frame registers.
    this.keys.interact.forEach((k) => k.on('down', () => (this.wantInteract = true)));

    const onResize = () => this.applyZoom(false);
    this.scale.on('resize', onResize);
    const off = [
      bus.on('virtual-interact', () => (this.wantInteract = true)),
      bus.on('teleport', (id) => {
        const b = this.buildings.find((x) => x.def.id === id);
        if (b) this.player.teleport(b.door.x, b.door.y);
      }),
      bus.on('sync', () => this.syncFromState()),
    ];
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', onResize);
      off.forEach((fn) => fn());
      gameState.inWorld = false;
    });

    gameState.inWorld = true;
    this.syncFromState();
  }

  update(_time: number, delta: number) {
    const dt = Math.min(delta, 50) / 1000;
    const locked = gameState.uiLocked;

    let ix = 0;
    let iy = 0;
    let interact = false;
    if (locked) {
      this.wasLocked = true;
      this.wantInteract = false;
    } else if (this.wasLocked) {
      // Swallow keys that were pressed while a menu was open.
      this.input.keyboard!.resetKeys();
      this.wasLocked = false;
      this.wantInteract = false;
    } else {
      const down = (action: string) => this.keys[action].some((k) => k.isDown);
      ix = (down('right') ? 1 : 0) - (down('left') ? 1 : 0) + gameState.vx;
      iy = (down('down') ? 1 : 0) - (down('up') ? 1 : 0) + gameState.vy;
      interact = this.wantInteract;
      this.wantInteract = false;
    }

    this.player.update(dt, ix, iy, gameState.debug ? MOVEMENT.debugSpeedMultiplier : 1);
    gameState.px = this.player.x;
    gameState.py = this.player.y;
    for (const npc of this.npcs) npc.update(dt, this.player.x, this.player.y);

    this.updatePrompt(locked, interact);
    this.updateClouds(dt);
    this.renderNight();
  }

  // ---------------------------------------------------------------- interaction

  private updatePrompt(locked: boolean, interact: boolean) {
    let best: Interactable | null = null;
    let bestDist = Infinity;
    if (!locked) {
      const candidates: Interactable[] = [...this.interactables];
      for (const npc of this.npcs)
        candidates.push({ key: `npc:${npc.def.id}`, x: npc.x, y: npc.y, radius: INTERACT_RADIUS, text: `Talk to ${npc.def.name}`, target: { kind: 'npc', id: npc.def.id } });
      for (const it of candidates) {
        if (it.enabled && !it.enabled()) continue;
        const d = Math.hypot(it.x - this.player.x, it.y - this.player.y);
        if (d <= it.radius && d < bestDist) {
          best = it;
          bestDist = d;
        }
      }
    }
    const key = best?.key ?? '';
    if (key !== this.currentKey) {
      this.currentKey = key;
      bus.emit('prompt', best ? { text: best.text, target: best.target } : null);
    }
    if (best && interact) bus.emit('interact', best.target);
  }

  // ---------------------------------------------------------------- visuals

  private addLight(light: LightSource, glowAlpha: number) {
    this.lightSources.push(light);
    const glow = this.add
      .image(light.x, light.y, 'glow')
      .setScale(light.radius / 26)
      .setTint(light.color)
      .setBlendMode(ADD)
      .setAlpha(glowAlpha)
      .setDepth(2100);
    this.tweens.add({
      targets: glow,
      alpha: glowAlpha * 0.72,
      duration: 900 + ((light.x * 7 + light.y * 3) % 900),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  private addBuildingEffects() {
    const at = (id: string) => {
      const def = BUILDINGS.find((b) => b.id === id)!;
      return { x: def.tx * TILE, y: def.ty * TILE };
    };
    // Chimney smoke
    const house = at('house');
    this.add
      .particles(house.x + 95, house.y + 2, 'smoke', {
        lifespan: 3200,
        speedY: { min: -9, max: -5 },
        speedX: { min: 1, max: 5 },
        scale: { start: 0.5, end: 1.5 },
        alpha: { start: 0.5, end: 0 },
        frequency: 620,
      })
      .setDepth(1500);
    // Portal sparks
    const proj = at('projects');
    this.add
      .particles(proj.x + 80, proj.y + 98, 'pixel', {
        lifespan: 1300,
        speed: { min: 6, max: 20 },
        angle: { min: 200, max: 340 },
        scale: { start: 0.6, end: 0 },
        tint: [0x67e8f9, 0xb79bff, 0xf0abfc],
        frequency: 110,
        blendMode: ADD,
      })
      .setDepth(2150);
    // Tower broadcast rings
    const tower = at('tower');
    for (const [dx, flip] of [[80, false], [48, true]] as Array<[number, boolean]>) {
      this.add.sprite(tower.x + dx, tower.y + 2, 'signal').setFlipX(flip).setAngle(flip ? -40 : 40).setDepth(2150).setBlendMode(ADD).play('signal');
    }
    // Hall brazier embers
    const hall = at('hall');
    for (const dx of [54, 108]) {
      this.add
        .particles(hall.x + dx, hall.y + 64, 'pixel', {
          lifespan: 900,
          speedY: { min: -16, max: -8 },
          speedX: { min: -4, max: 4 },
          scale: { start: 0.5, end: 0 },
          tint: [0xfbbf24, 0xff8a3c],
          frequency: 260,
          blendMode: ADD,
        })
        .setDepth(2150);
    }
    // Lab dome beam
    const lab = at('lab');
    const beam = this.add.image(lab.x + 80, lab.y - 14, 'glow').setScale(0.5, 2.4).setTint(0x67e8f9).setBlendMode(ADD).setAlpha(0.3).setDepth(2150);
    this.tweens.add({ targets: beam, alpha: 0.12, scaleY: 2.9, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  private addAtmosphere() {
    // Fireflies
    this.add
      .particles(0, 0, 'pixel', {
        x: { min: 0, max: WORLD_W },
        y: { min: 0, max: WORLD_H },
        lifespan: { min: 2600, max: 5200 },
        speed: { min: 2, max: 9 },
        scale: { min: 0.5, max: 0.5 },
        alpha: { start: 0, end: 0, ease: (t: number) => Math.sin(t * Math.PI) },
        tint: [0x67e8f9, 0xb79bff, 0xd9ff8a],
        frequency: 55,
        blendMode: ADD,
      })
      .setDepth(2200);
    // Wind-blown leaves
    this.add
      .particles(0, 0, 'pixel', {
        x: { min: 0, max: WORLD_W },
        y: { min: -20, max: WORLD_H },
        lifespan: 7000,
        speedX: { min: 14, max: 26 },
        speedY: { min: 6, max: 12 },
        scale: 0.5,
        alpha: { start: 0.7, end: 0 },
        tint: [0x4fd0b4, 0x1b867c],
        frequency: 240,
      })
      .setDepth(1800);
    // Lake mist glints
    for (const l of lakeShapes) {
      this.add
        .particles(l.cx, l.cy, 'dot', {
          x: { min: -l.rx * 0.8, max: l.rx * 0.8 },
          y: { min: -l.ry * 0.7, max: l.ry * 0.7 },
          lifespan: 900,
          scale: { start: 0, end: 0, ease: (t: number) => Math.sin(t * Math.PI) * 0.9 },
          alpha: 0.9,
          frequency: 420,
          blendMode: ADD,
        })
        .setDepth(2150);
    }
    // Drifting cloud shadows
    for (let i = 0; i < 6; i++) {
      const cloud = this.add
        .image(Math.random() * WORLD_W, Math.random() * WORLD_H, 'cloud')
        .setScale(2.4 + Math.random() * 1.8)
        .setTint(0x02030f)
        .setAlpha(0.15)
        .setDepth(1900);
      cloud.setData('speed', 5 + Math.random() * 6);
      this.clouds.push(cloud);
    }
  }

  private updateClouds(dt: number) {
    for (const c of this.clouds) {
      c.x += c.getData('speed') * dt;
      c.y += c.getData('speed') * dt * 0.25;
      if (c.x - c.displayWidth / 2 > WORLD_W) {
        c.x = -c.displayWidth / 2;
        c.y = Math.random() * WORLD_H;
      }
    }
  }

  private renderNight() {
    const rt = this.night;
    rt.clear();
    rt.fill(NIGHT, NIGHT_ALPHA);
    const view = this.cameras.main.worldView;
    const stamp = this.stamp;
    for (const l of this.lightSources) {
      if (l.radius <= 0) continue;
      if (l.x + l.radius < view.x || l.x - l.radius > view.right || l.y + l.radius < view.y || l.y - l.radius > view.bottom) continue;
      stamp.setScale(l.radius / 64);
      rt.erase(stamp, l.x, l.y);
    }
    // The player carries a small lantern.
    stamp.setScale(0.62);
    rt.erase(stamp, Math.round(this.player.x), Math.round(this.player.y) - 8);
  }

  private applyZoom(intro: boolean) {
    const { width, height } = this.scale;
    this.baseZoom = Math.max(2, Math.min(Math.floor(height / 235), Math.floor(width / 190)));
    const cam = this.cameras.main;
    if (intro) {
      // Cinematic push-in on arrival.
      cam.setZoom(this.baseZoom * 0.62);
      this.tweens.add({ targets: cam, zoom: this.baseZoom, duration: 1700, ease: 'Cubic.out', delay: 150 });
    } else {
      this.tweens.killTweensOf(cam);
      cam.setZoom(this.baseZoom);
    }
  }

  // ---------------------------------------------------------------- state mirrored from Vue

  private syncFromState() {
    for (const b of this.buildings) b.setVisited(gameState.visited.includes(b.def.id));
    this.bug?.setVisible(!gameState.bugCollected);
    const awake = gameState.visited.length >= BUILDINGS.length;
    if (awake) this.monolith.play('monolith-on', true);
    else {
      this.monolith.stop();
      this.monolith.setFrame(0);
    }
    this.monolithLight.radius = awake ? 74 : 0;
    this.monolithGlow.setAlpha(awake ? 0.5 : 0);
    this.drawDebug();
  }

  private drawDebug() {
    const g = this.debugGfx;
    g.clear().setVisible(gameState.debug);
    if (!gameState.debug) return;
    const world = buildWorld();
    g.lineStyle(1, 0xff4d6d, 0.9);
    for (let ty = 0; ty < MAP_H; ty++)
      for (let tx = 0; tx < MAP_W; tx++) if (world.solid[idx(tx, ty)]) g.strokeRect(tx * TILE + 0.5, ty * TILE + 0.5, TILE - 1, TILE - 1);
    g.lineStyle(1, 0x34d399, 1);
    for (const it of this.interactables) g.strokeCircle(it.x, it.y, it.radius);
  }
}
