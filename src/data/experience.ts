import type { Experience } from './types';

/** No dates, metrics or outcomes are invented here — add `period` and extend the timeline with your own details. */
export const experience: Experience[] = [
  {
    role: 'Full-Stack Developer',
    company: 'Amplify',
    period: '',
    summary: 'Full-stack development with a strong focus on the frontend.',
    timeline: [
      { title: 'Frontend development', text: 'Building and maintaining user-facing application interfaces.' },
      { title: 'Angular and Vue.js', text: 'Developing frontends across both Angular and Vue.js codebases.' },
      { title: 'Python and backend development', text: 'Working on backend services in Python.' },
      { title: 'Microservices architecture', text: 'Building within a system of independently deployed services.' },
      { title: 'Browser extension development', text: 'Developing extensions that bring functionality into the browser itself.' },
      { title: 'MCP and RAG exploration', text: 'Exploring Model Context Protocol and Retrieval-Augmented Generation.' },
      { title: 'Playwright automation', text: 'Automating browser testing with Playwright.' },
      { title: 'Regression testing workflows', text: 'Working on workflows that re-verify existing behaviour after changes.' },
    ],
  },
];
