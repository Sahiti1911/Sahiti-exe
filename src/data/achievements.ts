import type { Achievement } from './types';

/** Achievements unlock from real visitor interactions — see game/systems/AchievementSystem.ts. */
export const achievements: Achievement[] = [
  {
    id: 'bug-hunter',
    title: 'Bug Hunter',
    description: 'Tracked down the one bug nobody could reproduce.',
    unlock: 'Catch the golden bug hiding somewhere in the world.',
    icon: 'bug',
    condition: { prefix: 'egg:bug', target: 1 },
  },
  {
    id: 'architect',
    title: 'Architect',
    description: 'Saw how every part of the system connects.',
    unlock: 'Visit all six locations.',
    icon: 'blocks',
    condition: { prefix: 'visit:', target: 6 },
  },
  {
    id: 'automation-master',
    title: 'Automation Master',
    description: 'Never test by hand what a script can verify.',
    unlock: 'Inspect every Testing technology in the Code Lab.',
    icon: 'bot',
    condition: { prefix: 'tech:testing/', target: 4 },
  },
  {
    id: 'inventor',
    title: 'Inventor',
    description: 'Examined every invention in the collection.',
    unlock: 'Discover all five projects in Project World.',
    icon: 'lightbulb',
    condition: { prefix: 'project:', target: 5 },
  },
  {
    id: 'mcp-explorer',
    title: 'MCP Explorer',
    description: 'Ventured into the newest corner of the tech tree.',
    unlock: 'Inspect MCP in the Code Lab.',
    icon: 'compass',
    condition: { prefix: 'tech:emerging/mcp', target: 1 },
  },
  {
    id: 'project-builder',
    title: 'Project Builder',
    description: 'Got hands-on with the things that were actually built.',
    unlock: 'Discover three projects in Project World.',
    icon: 'hammer',
    condition: { prefix: 'project:', target: 3 },
  },
];
