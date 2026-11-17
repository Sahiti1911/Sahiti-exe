import type { Profile } from './types';

/**
 * Everything personal lives here. Edit freely — both Game Mode and Portfolio Mode read from this file.
 * Links left as '' render as "not configured" instead of pointing somewhere made up.
 */
export const profile: Profile = {
  name: 'Sahiti Lakkoju',
  handle: 'Sahiti.exe',
  role: 'Full-Stack Developer',
  focus: 'Frontend Development',
  tagline: 'Every developer has a story. Explore mine.',
  intro:
    "Hi! I'm Sahiti, a Full-Stack Developer with a strong focus on frontend development. I enjoy building intuitive applications, exploring backend architectures, experimenting with new technologies, and turning ideas into practical solutions.",
  technicalInterests: [
    'Intuitive, well-crafted frontends',
    'Backend and microservices architecture',
    'LLM integrations, MCP and RAG',
    'Test automation with Playwright',
    'Browser extensions',
  ],
  journey: [
    {
      title: 'Frontend first',
      text: 'Building interfaces with Angular, Vue.js and React — the part of the stack where ideas become something people can use.',
    },
    {
      title: 'Going full-stack',
      text: 'Moving behind the UI into Python, Node.js, REST APIs and microservices to understand how the whole system fits together.',
    },
    {
      title: 'Automating the boring parts',
      text: 'Using Playwright and regression testing workflows so quality does not depend on manual checks.',
    },
    {
      title: 'Exploring what is next',
      text: 'Experimenting with MCP, RAG, LLM integrations and browser extensions.',
    },
  ],
  // Add hobbies here, e.g. ['Gaming', 'Sketching']. The section stays hidden while this is empty.
  personalInterests: [],
  links: {
    email: '',
    github: 'https://github.com/Sahiti1911',
    linkedin: 'https://www.linkedin.com/in/sahiti-lakkoju/',
    resume: '',
  },
};
