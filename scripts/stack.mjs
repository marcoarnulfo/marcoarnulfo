// Draws assets/stack.svg: the technologies I work with, grouped like on marcoarnulfo.dev.
// Run it by hand after changing the list: node scripts/stack.mjs
import { writeFile } from 'node:fs/promises';
import { W, panel, escape } from './theme.mjs';

const GROUPS = [
  ['LANGUAGES', ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Swift', 'Kotlin', 'SQL', 'Bash']],
  ['FRONTEND', ['React', 'Next.js', 'Angular', 'Vue', 'Vite', 'React Router', 'TanStack Query', 'Redux', 'Zustand', 'Tailwind CSS', 'shadcn/ui', 'Radix UI', 'Ant Design', 'Framer Motion', 'i18next']],
  ['MOBILE', ['React Native', 'Expo', 'Expo Router', 'React Navigation', 'Storybook', 'fastlane']],
  ['BACKEND', ['Node.js', 'NestJS', 'Express', 'Django', 'FastAPI', 'tRPC', 'Strapi', 'Prisma', 'Drizzle', 'PostgreSQL', 'MongoDB', 'Redis', 'BullMQ', 'Zod', 'OpenAPI', 'FFmpeg']],
  ['CLOUD & INFRA', ['AWS Lambda', 'AWS CDK', 'AWS Cognito', 'AWS S3', 'Terraform', 'Docker', 'OpenShift', 'Jenkins', 'GitHub Actions', 'Railway', 'Vercel']],
  ['TESTING & QUALITY', ['Playwright', 'Maestro', 'Jest', 'Vitest', 'Testing Library', 'Git', 'Turborepo']],
  ['SERVICES & AI', ['Claude API', 'MCP', 'Stripe', 'Clerk', 'Supabase', 'Firebase', 'Sentry', 'Resend', 'Twilio', 'OneSignal', 'Contentful']],
];

const CHAR = 7.3; // width of a 12px monospace character
const CHIP_H = 24;
const GAP = 6;
const LINE = CHIP_H + GAP;
const left = 210;
const right = W - 40;

let y = 70;
const parts = [];
for (const [group, items] of GROUPS) {
  const top = y;
  let x = left;
  for (const item of items) {
    const w = Math.ceil(item.length * CHAR + 20);
    if (x + w > right) {
      x = left;
      y += LINE;
    }
    parts.push(
      `<rect x="${x}" y="${y}" width="${w}" height="${CHIP_H}" rx="2" fill="#262624" stroke="#3a3833"/>`,
      `<text x="${x + 10}" y="${y + 16}" class="chip">${escape(item)}</text>`,
    );
    x += w + GAP;
  }
  parts.unshift(`<text x="40" y="${top + 16}" class="group">${escape(group)}</text>`);
  y += LINE;
  parts.push(`<line x1="40" x2="${right}" y1="${y + 4}" y2="${y + 4}" stroke="#2f2e2b"/>`);
  y += 14;
}
parts.pop(); // no divider after the last group

await writeFile('assets/stack.svg', panel(y + 10, 'TECHNOLOGIES I WORK WITH', parts.join('\n  ')));
console.log('assets/stack.svg');
