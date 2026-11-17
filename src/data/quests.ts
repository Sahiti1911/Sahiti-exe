import type { InventoryItem, LocationInfo, Quest } from './types';

export const locations: LocationInfo[] = [
  { id: 'house', name: "Developer's House", purpose: 'About Me', color: '#b79bff' },
  { id: 'lab', name: 'Code Lab', purpose: 'Technical Skills', color: '#67e8f9' },
  { id: 'projects', name: 'Project World', purpose: 'Projects', color: '#f0abfc' },
  { id: 'career', name: 'Career HQ', purpose: 'Experience', color: '#7dd3fc' },
  { id: 'hall', name: 'Achievement Hall', purpose: 'Achievements', color: '#fbbf24' },
  { id: 'tower', name: 'Communication Tower', purpose: 'Contact', color: '#f472b6' },
];

export const locationById = (id: string) => locations.find((l) => l.id === id)!;

export const quests: Quest[] = [
  {
    id: 'm1',
    code: 'MISSION 01',
    title: 'Meet the Developer',
    description: "Enter the Developer's House.",
    location: 'house',
    condition: { prefix: 'visit:house', target: 1 },
  },
  {
    id: 'm2',
    code: 'MISSION 02',
    title: 'Explore the Code Lab',
    description: 'Step inside the Code Lab.',
    location: 'lab',
    condition: { prefix: 'visit:lab', target: 1 },
  },
  {
    id: 'm3',
    code: 'MISSION 03',
    title: 'Discover Three Projects',
    description: 'Open three project stations in Project World.',
    location: 'projects',
    condition: { prefix: 'project:', target: 3 },
  },
  {
    id: 'm4',
    code: 'MISSION 04',
    title: 'Visit Career HQ',
    description: 'Head to the Career HQ tower.',
    location: 'career',
    condition: { prefix: 'visit:career', target: 1 },
  },
  {
    id: 'm5',
    code: 'MISSION 05',
    title: 'Unlock Achievement Hall',
    description: 'Open the doors of the Achievement Hall.',
    location: 'hall',
    condition: { prefix: 'visit:hall', target: 1 },
  },
  {
    id: 'm6',
    code: 'MISSION 06',
    title: 'Visit Communication Tower',
    description: 'Reach the Communication Tower.',
    location: 'tower',
    condition: { prefix: 'visit:tower', target: 1 },
  },
];

/** Collectibles granted by the secret features. */
export const inventoryItems: InventoryItem[] = [
  {
    id: 'golden-bug',
    action: 'egg:bug',
    name: 'Golden Bug',
    description: 'A rare, shiny bug. Completely harmless — it only reproduces in production.',
    color: '#fbbf24',
  },
  {
    id: 'root-key',
    action: 'egg:terminal',
    name: 'Root Access Key',
    description: 'Proof that you typed sudo and the terminal actually listened.',
    color: '#34d399',
  },
  {
    id: 'rubber-duck',
    action: 'egg:quote',
    name: 'Rubber Duck',
    description: 'The most patient senior engineer in the house. Explains nothing, fixes everything.',
    color: '#fde047',
  },
  {
    id: 'debug-lens',
    action: 'egg:debug',
    name: 'Debug Lens',
    description: 'Reveals the collision boxes holding this world together.',
    color: '#67e8f9',
  },
  {
    id: 'multiverse-core',
    action: 'egg:final',
    name: 'Multiverse Core',
    description: 'Awakened by discovering all six locations.',
    color: '#b79bff',
  },
];

export const secrets = {
  developerQuote: '"It works on my machine." — Fine. Then we ship your machine.',
  terminalSecret: 'ACCESS GRANTED. Secret #42: the best code is the code you did not have to write.',
  finalMessage: [
    'MULTIVERSE CORE ONLINE.',
    'You explored every corner of this world — thank you for taking the time, Player 001.',
    'If you enjoyed the adventure, the Communication Tower is always open. Let’s build something together.',
  ],
};
