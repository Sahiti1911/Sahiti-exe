import type { SkillCategory, Tech } from './types';

const AMPLIFY = 'Amplify';

export const skills: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    techs: [
      {
        id: 'angular',
        name: 'Angular',
        summary: 'A batteries-included TypeScript framework for large, structured web applications.',
        usage: `Used for frontend development at ${AMPLIFY}.`,
      },
      {
        id: 'vue',
        name: 'Vue.js',
        summary: 'A progressive framework for building reactive user interfaces from composable components.',
        usage: `Used for frontend development at ${AMPLIFY} — and the UI of this portfolio is built with Vue 3.`,
      },
      {
        id: 'react',
        name: 'React.js',
        summary: 'A component library for building user interfaces with a declarative, state-driven model.',
        usage: 'Part of my frontend toolkit alongside Angular and Vue.',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        summary: 'The language of the web — it runs in every browser and on the server.',
        usage: 'The foundation under every frontend framework I work with.',
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        summary: 'JavaScript with static types, catching whole classes of bugs before the code runs.',
        usage: 'This portfolio — game logic and UI — is written in TypeScript.',
      },
      {
        id: 'html',
        name: 'HTML',
        summary: 'The structural layer of the web: semantic, accessible markup.',
        usage: 'The base of every interface I build.',
      },
      {
        id: 'css',
        name: 'CSS',
        summary: 'Layout, colour, motion and responsiveness for the web.',
        usage: 'Used to make interfaces responsive across desktop, tablet and mobile.',
      },
      {
        id: 'tailwind',
        name: 'Tailwind CSS',
        summary: 'A utility-first CSS framework for building custom designs quickly and consistently.',
        usage: 'The HUD, panels and Portfolio Mode of this site are styled with Tailwind.',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    techs: [
      {
        id: 'python',
        name: 'Python',
        summary: 'A readable, general-purpose language widely used for backend services and automation.',
        usage: `Used for backend development at ${AMPLIFY}.`,
      },
      {
        id: 'node',
        name: 'Node.js',
        summary: 'A JavaScript runtime for building servers and tooling outside the browser.',
        usage: 'Part of my backend toolkit, sharing one language across client and server.',
      },
      {
        id: 'fastapi',
        name: 'FastAPI',
        summary: 'A modern Python web framework for building typed, high-performance APIs.',
        usage: 'My framework of choice for building APIs in Python.',
      },
      {
        id: 'microservices',
        name: 'Microservices',
        summary: 'An architecture that splits a system into small, independently deployable services.',
        usage: `Working within a microservices architecture at ${AMPLIFY}.`,
      },
      {
        id: 'rest',
        name: 'REST APIs',
        summary: 'A resource-oriented style for designing HTTP interfaces between systems.',
        usage: 'How the frontends I build talk to backend services.',
      },
    ],
  },
  {
    id: 'testing',
    title: 'Testing',
    techs: [
      {
        id: 'playwright',
        name: 'Playwright',
        summary: 'A browser automation framework for reliable end-to-end testing across browsers.',
        usage: `Used for test automation at ${AMPLIFY}.`,
      },
      {
        id: 'test-automation',
        name: 'Test Automation',
        summary: 'Turning repeatable manual checks into fast, scripted tests.',
        usage: `Building automated checks with Playwright at ${AMPLIFY}.`,
      },
      {
        id: 'regression',
        name: 'Regression Testing',
        summary: 'Re-verifying existing behaviour after every change so that fixes do not break what already worked.',
        usage: `Part of the regression testing workflows I work on at ${AMPLIFY}.`,
      },
      {
        id: 'test-generation',
        name: 'Test Case Generation',
        summary: 'Deriving test cases systematically from requirements and application behaviour.',
        usage: 'Part of my testing toolkit alongside automation and regression workflows.',
      },
    ],
  },
  {
    id: 'emerging',
    title: 'Emerging Technologies',
    techs: [
      {
        id: 'mcp',
        name: 'MCP',
        summary: 'Model Context Protocol — an open standard for connecting AI models to tools and data sources.',
        usage: `Explored at ${AMPLIFY}.`,
      },
      {
        id: 'rag',
        name: 'RAG',
        summary: 'Retrieval-Augmented Generation — grounding an LLM’s answers in retrieved documents.',
        usage: `Explored at ${AMPLIFY}.`,
      },
      {
        id: 'llm',
        name: 'LLM Integrations',
        summary: 'Wiring large language models into real applications and workflows.',
        usage: 'An area I actively experiment with.',
      },
      {
        id: 'extensions',
        name: 'Browser Extensions',
        summary: 'Small programs that extend what the browser can do on any page.',
        usage: `Browser extension development at ${AMPLIFY}.`,
        projectId: 'ai-prompt-monitor',
      },
    ],
  },
];

/** Unique action id for a technology, e.g. "testing/playwright". */
export const techKey = (categoryId: string, tech: Tech) => `${categoryId}/${tech.id}`;
export const totalTechs = skills.reduce((n, c) => n + c.techs.length, 0);
