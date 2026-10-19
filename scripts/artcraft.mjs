// Updates the ArtCraft section of README.md (between the artcraft markers)
// with my merged pull requests per app and the stars of each repository.
import { readFile, writeFile } from 'node:fs/promises';
import { W, panel } from './theme.mjs';

const USER = 'marcoarnulfo';
const ORG = 'storytold';
// The ArtCraft apps. The org also has libraries and services: pull requests there are not counted.
// A new app shows up here only once it is added to this list.
const APPS = new Set([
  'pdfcraft', 'gridcraft', 'photocraft', 'filmcraft', 'lightcraft', 'vectorcraft', 'designcraft',
  'cadcraft', 'wordcraft', 'soundcraft', 'effectcraft', 'figcraft', 'deckcraft',
]);

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': `${USER}-profile`,
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
};

async function get(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function mergedPrs() {
  const q = encodeURIComponent(`is:pr author:${USER} org:${ORG} is:merged is:public`);
  const items = [];
  let total = Infinity;
  for (let page = 1; items.length < total && page <= 10; page++) {
    const data = await get(
      `https://api.github.com/search/issues?q=${q}&sort=created&order=asc&per_page=100&page=${page}`,
    );
    if (data.incomplete_results) throw new Error('incomplete search results');
    total = data.total_count;
    items.push(...data.items);
    if (data.items.length === 0) break;
  }
  if (items.length < total) throw new Error(`read ${items.length} of ${total} pull requests`);
  return items;
}

async function repos() {
  const all = [];
  for (let page = 1; ; page++) {
    const data = await get(`https://api.github.com/orgs/${ORG}/repos?type=public&per_page=100&page=${page}`);
    all.push(...data);
    if (data.length < 100) return all;
  }
}

const compact = (n) => {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${(k >= 10 ? k.toFixed(0) : k.toFixed(1)).replace(/\.0$/, '')}k`;
};

const [allPrs, list] = await Promise.all([mergedPrs(), repos()]);
const prs = allPrs.filter((pr) => APPS.has(pr.repository_url.split('/').pop().toLowerCase()));
if (prs.length === 0) throw new Error('no merged pull requests found');

const stars = new Map(list.filter((r) => !r.private).map((r) => [r.name.toLowerCase(), r.stargazers_count]));
const byRepo = new Map();
for (const pr of prs) {
  const name = pr.repository_url.split('/').pop().toLowerCase();
  byRepo.set(name, (byRepo.get(name) ?? 0) + 1);
}

const apps = [...byRepo]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name, count]) => ({ name, count, stars: stars.get(name) ?? 0}));
const appStars = apps.reduce((sum, app) => sum + app.stars, 0);

const allPrsUrl = `https://github.com/pulls?q=is%3Apr+author%3A${USER}+org%3A${ORG}+is%3Amerged`;
const section = [
  `<a href="${allPrsUrl}"><img src="assets/artcraft.svg" alt="${prs.length} merged pull requests across ${byRepo.size} ArtCraft apps, ${compact(appStars)} stars" width="100%"></a>`,
].join('\n');

// Merged pull requests per app, as horizontal bars.
function chart() {
  const top = 132;
  const rowH = 30;
  const h = top + apps.length * rowH + 28;
  const barX = 172;
  const barMax = W - barX - 150;
  const max = apps[0].count;
  const bars = apps
    .map(({ name, count, stars: s }, i) => {
      const y = top + i * rowH;
      const w = Math.max(4, Math.round((count / max) * barMax));
      return [
        `<text x="40" y="${y + 15}" class="name">${name}</text>`,
        `<rect x="${barX}" y="${y + 3}" width="${barMax}" height="16" fill="#2c2b29"/>`,
        `<rect x="${barX}" y="${y + 3}" width="${w}" height="16" fill="#d97757"/>`,
        `<text x="${barX + w + 8}" y="${y + 15}" class="num">${count}</text>`,
        `<text x="${W - 40}" y="${y + 15}" class="dim" text-anchor="end">★ ${compact(s)}</text>`,
      ].join('');
    })
    .join('\n  ');
  return panel(
    h,
    'OPEN SOURCE · ARTCRAFT · MERGED PULL REQUESTS PER APP',
    `<text x="40" y="84" class="big"><tspan class="acc">${prs.length}</tspan> merged PRs across <tspan class="acc">${byRepo.size}</tspan> apps</text>
  <text x="40" y="108" class="sub">Open source creative apps written in Rust · ${compact(appStars)} stars together</text>
  <text x="${W - 40}" y="42" class="k" text-anchor="end">UPDATED DAILY</text>
  ${bars}`,
  );
}

// "At a glance": four tiles, like the panel at the top of marcoarnulfo.dev.
const CAREER_START = new Date(Date.UTC(2022, 4, 1));
function glance() {
  const years = Math.floor((Date.now() - CAREER_START) / (365.25 * 24 * 3600 * 1000));
  const tiles = [
    ['YEARS AS A DEVELOPER', String(years).padStart(2, '0'), 'since May 2022', false],
    ['MERGED PRS · ARTCRAFT', String(prs.length), `across ${byRepo.size} apps`, true],
    ['STARS ON THOSE APPS', compact(appStars), 'on GitHub', true],
    ['APPS I CONTRIBUTE TO', String(byRepo.size).padStart(2, '0'), 'written in Rust', false],
  ];
  const gap = 12;
  const tileW = (W - 80 - gap * 3) / 4;
  const body = tiles
    .map(([label, value, note, accent], i) => {
      const x = 40 + i * (tileW + gap);
      return [
        `<rect x="${x}" y="64" width="${tileW}" height="112" rx="3" fill="#262624" stroke="#3a3833"/>`,
        `<text x="${x + 14}" y="88" class="k" style="letter-spacing:1.2px;font-size:10px"><tspan class="acc">&gt;</tspan> ${label}</text>`,
        `<text x="${x + 14}" y="138" class="stat"${accent ? ' style="fill:#e08b6d"' : ''}>${value}</text>`,
        `<text x="${x + 14}" y="162" class="dim">${note}</text>`,
      ].join('');
    })
    .join('\n  ');
  return panel(200, 'AT A GLANCE', body);
}

await writeFile('assets/artcraft.svg', chart());
await writeFile('assets/glance.svg', glance());

const readme = await readFile('README.md', 'utf8');
const start = '<!-- artcraft:start -->';
const end = '<!-- artcraft:end -->';
const from = readme.indexOf(start);
const to = readme.indexOf(end);
if (from === -1 || to === -1) throw new Error('artcraft markers not found in README.md');

const next = `${readme.slice(0, from + start.length)}\n${section}\n${readme.slice(to)}`;
if (next !== readme) await writeFile('README.md', next);
console.log(`${prs.length} pull requests, ${byRepo.size} repositories`);
