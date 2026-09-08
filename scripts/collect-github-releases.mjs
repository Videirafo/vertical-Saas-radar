import fs from 'node:fs/promises';

const sources = JSON.parse(await fs.readFile('data/sources.json', 'utf8'));
const token = process.env.GITHUB_TOKEN;
const lookbackDays = Number(process.env.RADAR_LOOKBACK_DAYS || 8);
const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'vertical-saas-radar'
};
if (token) headers.Authorization = `Bearer ${token}`;

const signals = [];

for (const source of sources.filter((item) => item.kind === 'github-releases')) {
  const endpoint = `https://api.github.com/repos/${source.repo}/releases?per_page=10`;
  const response = await fetch(endpoint, { headers });

  if (!response.ok) {
    console.error(`${source.repo}: HTTP ${response.status}`);
    continue;
  }

  const releases = await response.json();
  for (const release of releases) {
    const publishedAt = release.published_at || release.created_at;
    if (publishedAt && Date.parse(publishedAt) < cutoff) continue;

    signals.push({
      source: source.id,
      title: release.name || release.tag_name,
      url: release.html_url,
      published_at: publishedAt,
      body: String(release.body || '').slice(0, 12000)
    });
  }
}

signals.sort((a, b) => String(b.published_at || '').localeCompare(String(a.published_at || '')));
await fs.writeFile('data/signals.json', `${JSON.stringify(signals, null, 2)}\n`);
console.log(`Collected ${signals.length} release signals from the last ${lookbackDays} day(s).`);
