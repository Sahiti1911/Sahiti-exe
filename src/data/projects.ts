import type { Project } from './types';

/**
 * Central project configuration — the single source for Project World and the Portfolio Mode project list.
 *
 * NOTE: `description` and `problem` below are first drafts written from the project titles only.
 * Review them, then fill in `technologies`, `contribution`, `github` and `demo`.
 * Empty fields are shown as "Details coming soon" / hidden — nothing is invented for you.
 */
export const projects: Project[] = [
  {
    id: 'engineering-work-journal',
    title: 'Engineering Work Journal',
    itemClass: 'Tome of Records',
    description: 'A journal for capturing day-to-day engineering work in one place.',
    problem: 'What was built, fixed and learned is easy to lose track of once the day is over.',
    technologies: [],
    contribution: '',
    github: '',
    demo: '',
  },
  {
    id: 'ai-prompt-monitor',
    title: 'AI Prompt Monitor',
    itemClass: 'Browser Relic',
    description: 'A browser extension that monitors prompts sent to AI tools.',
    problem: 'Prompts typed into AI tools are otherwise hard to keep an eye on.',
    technologies: ['Browser Extension'],
    contribution: '',
    github: '',
    demo: '',
  },
  {
    id: 'facegreet',
    title: 'FaceGreet',
    itemClass: 'Vision Charm',
    description: 'An application that recognises faces and greets people.',
    problem: 'Greeting and identifying people manually does not scale.',
    technologies: [],
    contribution: '',
    github: '',
    demo: '',
  },
  {
    id: 'academic-navigator',
    title: 'Academic Navigator',
    itemClass: 'Scholar’s Compass',
    description: 'A tool that helps students find their way through academic information.',
    problem: 'Academic information is often scattered and hard to navigate.',
    technologies: [],
    contribution: '',
    github: '',
    demo: '',
  },
  {
    id: 'complaint-management-system',
    title: 'Complaint Management System',
    itemClass: 'Ledger of Resolution',
    description: 'A system for logging, tracking and resolving complaints.',
    problem: 'Complaints handled informally are easy to lose and hard to follow up on.',
    technologies: [],
    contribution: '',
    github: '',
    demo: '',
  },
];

export const projectById = (id: string) => projects.find((p) => p.id === id);
