// Draws one card per tool of mine (assets/tool-<repo>.svg) with the live stars from GitHub.
import { writeFile } from 'node:fs/promises';
import { sans, mono, escape } from './theme.mjs';

const USER = 'marcoarnulfo';
const TOOLS = [
  {
    repo: 'clickup-cli',
    kind: 'TERMINAL UI',
    lines: ['ClickUp time tracking in the', 'terminal: monthly reports,', 'rates, billable amounts, export.'],
    tech: 'Go · Cobra · Bubble Tea',
  },
  {
    repo: 'notion-cli',
    kind: 'CLI',
    lines: ['Keeps a Notion task database', 'in sync from the terminal', 'and CI, with idempotent upserts.'],
    tech: 'Go',
  },
  {
    repo: 'aws-lambda-cdk-template',
    kind: 'TEMPLATE',
    lines: ['A starting point for', 'TypeScript Lambda functions', 'deployed with AWS CDK.'],
    tech: 'TypeScript · AWS CDK',
  },
];

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': `${USER}-profile`,
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
};

const W = 288;
const H = 176;

function card({ repo, kind, lines, tech }, stars) {
  const text = lines
    .map((line, i) => `<text x="20" y="${84 + i * 19}" class="d">${escape(line)}</text>`)
    .join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    .k { font: 500 10px ${mono}; letter-spacing: 1.5px; fill: #b5b2a8; }
    .n { font: 700 17px ${mono}; fill: #f0eee6; }
    .d { font: 400 13px ${sans}; fill: #b5b2a8; }
    .t { font: 400 11px ${mono}; fill: #e08b6d; }
    .s { font: 400 11px ${mono}; fill: #8f8b81; }
  </style>
  <rect width="${W}" height="${H}" rx="6" fill="#1f1e1d"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="6" fill="none" stroke="#3a3833"/>
  <rect x="20" y="22" width="7" height="7" fill="#d97757"/>
  <text x="35" y="29" class="k">${kind}</text>
  <text x="20" y="58" class="n">${escape(repo)}</text>
  ${text}
  <line x1="20" x2="${W - 20}" y1="${H - 34}" y2="${H - 34}" stroke="#2f2e2b"/>
  <text x="20" y="${H - 15}" class="t">${escape(tech)}</text>
  <text x="${W - 20}" y="${H - 15}" class="s" text-anchor="end">★ ${stars}</text>
</svg>
`;
}

for (const tool of TOOLS) {
  const res = await fetch(`https://api.github.com/repos/${USER}/${tool.repo}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${tool.repo}`);
  const { stargazers_count } = await res.json();
  await writeFile(`assets/tool-${tool.repo}.svg`, card(tool, stargazers_count));
}
console.log(`${TOOLS.length} tool cards`);
