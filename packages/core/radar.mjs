const dimensions = {
  roadmap: [/agent/i, /automation/i, /scheduling/i, /crm/i, /workflow/i, /ai\b/i, /calendar/i],
  packaging: [/pricing/i, /plan/i, /billing/i, /quota/i, /limit/i, /tier/i, /seat/i],
  positioning: [/alternative/i, /open.source/i, /self.host/i, /ai.first/i, /multi.channel/i, /platform/i],
  integrations: [/api/i, /webhook/i, /oauth/i, /mcp/i, /whatsapp/i, /instagram/i, /integration/i, /kafka/i, /rabbitmq/i, /sdk/i],
  gtm: [/partner/i, /marketplace/i, /template/i, /agency/i, /vertical/i, /clinic/i, /gym/i, /veterinar/i, /reseller/i]
};

const hypeTerms = [/revolutionary/i, /game.changer/i, /world.?first/i, /10x/i, /magic/i, /breakthrough/i, /unprecedented/i];
const consequenceTerms = [/breaking/i, /deprecated/i, /migration/i, /pricing/i, /api/i, /webhook/i, /oauth/i, /mcp/i, /whatsapp/i, /instagram/i, /security/i, /approval/i, /permission/i, /billing/i, /rate.?limit/i];

function countMatches(patterns, text) {
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

export function classifySignal(signal) {
  const text = `${signal.title ?? ''} ${signal.body ?? ''}`;
  const impact = Object.fromEntries(
    Object.entries(dimensions).map(([key, patterns]) => [key, patterns.some((pattern) => pattern.test(text))])
  );
  const impactCount = Object.values(impact).filter(Boolean).length;
  const consequence = countMatches(consequenceTerms, text);
  const hypeCount = countMatches(hypeTerms, text);
  const score = Math.max(0, Math.min(100, 20 + impactCount * 12 + consequence * 9 - hypeCount * 12));

  return {
    ...signal,
    impact,
    score,
    hype: hypeCount >= 2 ? 'high' : hypeCount === 1 ? 'medium' : 'low',
    meaningful: score >= 50
  };
}

export function buildBrief(signals, sources = []) {
  const sourceMap = new Map(sources.map((source) => [source.id, source]));
  const items = signals
    .map(classifySignal)
    .map((item) => ({ ...item, source_name: sourceMap.get(item.source)?.name ?? item.source }))
    .sort((a, b) => b.score - a.score || String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')));

  const meaningful = items.filter((item) => item.meaningful);
  const watchlist = items.filter((item) => !item.meaningful);

  return {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    meaningful,
    watchlist,
    summary: {
      total: items.length,
      meaningful: meaningful.length,
      watchlist: watchlist.length,
      hype_filtered: items.filter((item) => item.hype === 'high').length
    }
  };
}
