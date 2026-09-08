import fs from 'node:fs/promises';
import { buildBrief } from '../packages/core/radar.mjs';

const signalsPath = process.argv[2] ?? 'data/signals.json';
let signals;

try {
  signals = JSON.parse(await fs.readFile(signalsPath, 'utf8'));
} catch {
  signals = JSON.parse(await fs.readFile('data/signals.sample.json', 'utf8'));
}

const sources = JSON.parse(await fs.readFile('data/sources.json', 'utf8'));
const brief = buildBrief(signals, sources);
await fs.writeFile('data/latest.json', `${JSON.stringify(brief, null, 2)}\n`);

const lines = [
  '# Vertical SaaS Radar — Weekly Brief',
  '',
  `Generated: ${brief.generated_at}`,
  '',
  '## Consequential shifts',
  ''
];

for (const item of brief.meaningful) {
  const impacts = Object.entries(item.impact).filter(([, enabled]) => enabled).map(([key]) => key).join(', ');
  lines.push(
    `### ${item.source_name}: ${item.title}`,
    `- Consequence score: **${item.score}/100**`,
    `- Impacts: ${impacts || 'watch only'}`,
    `- Hype indicator: ${item.hype}`,
    `- Published: ${item.published_at || 'unknown'}`,
    `- Evidence: ${item.url}`,
    ''
  );
}

if (!brief.meaningful.length) lines.push('No signals crossed the consequence threshold this cycle.', '');

lines.push('## Watchlist', '');
for (const item of brief.watchlist) {
  lines.push(`- ${item.source_name}: ${item.title} — ${item.score}/100 — ${item.url}`);
}

await fs.writeFile('data/latest.md', `${lines.join('\n')}\n`);
console.log(`Built brief: ${brief.summary.meaningful}/${brief.summary.total} signals crossed the threshold.`);
