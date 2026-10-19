// Draws the text panels of the README (assets/intro.svg, assets/now.svg).
// They change only when the text changes: run it by hand, node scripts/panels.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { W, panel, escape } from './theme.mjs';

const lines = (list, x, y, step, cls) =>
  list.map((line, i) => `<text x="${x}" y="${y + i * step}" class="${cls}">${line}</text>`).join('\n  ');

// An image inside an SVG shown through <img> cannot load other files: the portrait is inlined.
const portrait = (await readFile('assets/portrait.jpg')).toString('base64');

function intro() {
  const px = 40;
  const py = 66;
  const size = 132;
  const textX = px + size + 40;
  return panel(
    236,
    'ABOUT ME',
    `<defs><clipPath id="p"><rect x="${px + 8}" y="${py + 8}" width="${size - 16}" height="${size - 16}" rx="3"/></clipPath></defs>
  <image href="data:image/jpeg;base64,${portrait}" x="${px + 8}" y="${py + 8}" width="${size - 16}" height="${size - 16}" clip-path="url(#p)"/>
  <path d="M${px} ${py + 16}V${py}H${px + 16}" fill="none" stroke="#d97757" stroke-width="2"/>
  <path d="M${px + size - 16} ${py}H${px + size}V${py + 16}" fill="none" stroke="#d97757" stroke-width="2"/>
  <path d="M${px} ${py + size - 16}V${py + size}H${px + 16}" fill="none" stroke="#d97757" stroke-width="2"/>
  <path d="M${px + size - 16} ${py + size}H${px + size}V${py + size - 16}" fill="none" stroke="#d97757" stroke-width="2"/>
  <text x="${textX}" y="${py + 30}" class="big">Hi, I'm <tspan class="acc">Marco Arnulfo</tspan></text>
  ${lines(
    [
      'I build web and mobile applications, from the backend to the release:',
      'React and Next.js on the web, React Native and Expo on mobile,',
      'Node.js and NestJS behind them, and the cloud they run on.',
      `I also contribute to <tspan style="fill:#f0eee6;font-weight:600">ArtCraft</tspan>, open source creative apps written in Rust.`,
    ],
    textX,
    py + 62,
    22,
    'sub',
  )}`,
  );
}

const NOW = [
  {
    label: 'TEAM LEAD',
    title: 'Team lead for Compass',
    text: [
      'One of the largest consumer credit companies in Italy. I coordinate the team behind',
      'their mobile app, web customer area and backend, from analysis and estimates to release.',
    ],
    tech: 'NestJS · Prisma · Redis · AWS Cognito · Docker · OpenShift · Playwright · Maestro',
  },
  {
    label: 'OPEN SOURCE',
    title: 'Contributor to ArtCraft',
    text: [
      'Desktop apps for images, video, PDF, spreadsheets, vector graphics, layout and more,',
      'written from scratch in Rust. The numbers are in the chart below.',
    ],
    tech: 'Rust',
  },
  {
    label: 'FREELANCE',
    title: 'Technical partner for digital agencies',
    text: [
      'Custom web solutions, back offices and backend services, often white-label:',
      'the whole development cycle, under the agency’s brand.',
    ],
    tech: 'Next.js · NestJS · PostgreSQL · AWS',
  },
];

function now() {
  const rowH = 112;
  const top = 64;
  const body = NOW.map(({ label, title, text, tech }, i) => {
    const y = top + i * rowH;
    return [
      i > 0 ? `<line x1="40" x2="${W - 40}" y1="${y - 14}" y2="${y - 14}" stroke="#2f2e2b"/>` : '',
      `<text x="40" y="${y + 16}" class="group">${label}</text>`,
      `<text x="190" y="${y + 16}" class="title">${escape(title)}</text>`,
      lines(text.map(escape), 190, y + 40, 19, 'sub'),
      `<text x="190" y="${y + 84}" class="num" style="font-weight:400">${escape(tech)}</text>`,
    ].join('\n  ');
  }).join('\n  ');
  return panel(top + NOW.length * rowH + 4, 'NOW', body).replace(
    '</style>',
    `  .title { font: 700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #f0eee6; }\n  </style>`,
  );
}

await writeFile('assets/intro.svg', intro());
await writeFile('assets/now.svg', now());
console.log('assets/intro.svg, assets/now.svg');
