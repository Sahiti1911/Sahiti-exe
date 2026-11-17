import type { LocationId } from '../data/types';

/**
 * The only channel between Phaser (game logic) and Vue (interface).
 * This module must stay free of Phaser and Vue imports.
 */
export type InteractTarget =
  | { kind: 'location'; id: LocationId }
  | { kind: 'npc'; id: string }
  | { kind: 'terminal' }
  | { kind: 'bug' }
  | { kind: 'monolith' };

export interface PromptInfo {
  text: string;
  target: InteractTarget;
}

export interface BusEvents {
  'load-progress': number;
  'boot-ready': undefined;
  'start-world': undefined;
  'world-ready': undefined;
  prompt: PromptInfo | null;
  interact: InteractTarget;
  'virtual-interact': undefined;
  teleport: LocationId;
  /** Vue changed something the scene mirrors (visited set, collected bug, debug flag). */
  sync: undefined;
  'game-active': boolean;
  step: undefined;
}

type Handler<T> = (payload: T) => void;

class Bus {
  private handlers = new Map<keyof BusEvents, Set<Handler<never>>>();

  on<K extends keyof BusEvents>(event: K, fn: Handler<BusEvents[K]>): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(fn as Handler<never>);
    return () => this.handlers.get(event)?.delete(fn as Handler<never>);
  }

  emit<K extends keyof BusEvents>(event: K, ...payload: BusEvents[K] extends undefined ? [] : [BusEvents[K]]): void {
    this.handlers.get(event)?.forEach((fn) => (fn as Handler<unknown>)(payload[0]));
  }
}

export const bus = new Bus();

/** Plain mutable state polled by the game loop every frame (deliberately not reactive). */
export const gameState = {
  /** True while any Vue overlay owns the keyboard — the player cannot move. */
  uiLocked: true,
  debug: false,
  /** Virtual joystick vector from the on-screen controls, each axis in [-1, 1]. */
  vx: 0,
  vy: 0,
  /** Player position in world pixels, written by the scene, read by the minimap. */
  px: 0,
  py: 0,
  inWorld: false,
  visited: [] as string[],
  bugCollected: false,
};
