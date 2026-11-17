export type LocationId = 'house' | 'lab' | 'projects' | 'career' | 'hall' | 'tower';

export interface LocationInfo {
  id: LocationId;
  name: string;
  purpose: string;
  /** Accent colour used by the minimap, labels and panels. */
  color: string;
}

export interface ProfileLinks {
  /** Leave any of these empty ('') until you have the real value — the UI shows them as "not configured". */
  email: string;
  github: string;
  linkedin: string;
  /** e.g. './resume.pdf' after dropping the file into /public */
  resume: string;
}

export interface JourneyStep {
  title: string;
  text: string;
}

export interface Profile {
  name: string;
  handle: string;
  role: string;
  focus: string;
  tagline: string;
  intro: string;
  technicalInterests: string[];
  journey: JourneyStep[];
  /** Optional. Hidden everywhere while empty. */
  personalInterests: string[];
  links: ProfileLinks;
}

export interface Tech {
  id: string;
  name: string;
  summary: string;
  usage: string;
  /** id of a project in projects.ts */
  projectId?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  techs: Tech[];
}

export interface Project {
  id: string;
  title: string;
  /** Short RPG-style item class shown on the discovery card. */
  itemClass: string;
  description: string;
  problem: string;
  technologies: string[];
  contribution: string;
  github: string;
  demo: string;
}

export interface ExperienceItem {
  title: string;
  text: string;
}

export interface Experience {
  role: string;
  company: string;
  /** Optional, e.g. '2023 — Present'. Hidden while empty. */
  period: string;
  summary: string;
  timeline: ExperienceItem[];
}

/** A condition is met when at least `target` recorded actions start with `prefix`. */
export interface Condition {
  prefix: string;
  target: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlock: string;
  icon: 'bug' | 'blocks' | 'bot' | 'lightbulb' | 'compass' | 'hammer';
  condition: Condition;
}

export interface Quest {
  id: string;
  code: string;
  title: string;
  description: string;
  location: LocationId;
  condition: Condition;
}

export interface InventoryItem {
  id: string;
  /** action key that grants it */
  action: string;
  name: string;
  description: string;
  color: string;
}
