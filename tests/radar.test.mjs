import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySignal, buildBrief } from '../packages/core/radar.mjs';

test('breaking API and webhook signal is consequential', () => {
  const signal = classifySignal({ title: 'Breaking API webhook change', body: 'OAuth migration required' });
  assert.equal(signal.meaningful, true);
  assert.ok(signal.score >= 50);
  assert.equal(signal.impact.integrations, true);
});

test('pricing and quota changes affect packaging', () => {
  const signal = classifySignal({ title: 'Pricing plan quota update', body: 'Billing limits changed' });
  assert.equal(signal.impact.packaging, true);
  assert.equal(signal.meaningful, true);
});

test('promotional language is penalized', () => {
  const signal = classifySignal({ title: 'Revolutionary world-first magic breakthrough', body: 'No implementation details' });
  assert.equal(signal.hype, 'high');
  assert.ok(signal.score < 50);
});

test('brief sorts by consequence and exposes schema metadata', () => {
  const brief = buildBrief(
    [
      { source: 'a', title: 'API webhook migration', body: 'breaking OAuth change' },
      { source: 'b', title: 'minor copy update', body: '' }
    ],
    [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
  );
  assert.equal(brief.schema_version, 1);
  assert.equal(brief.meaningful[0].source_name, 'A');
  assert.equal(brief.summary.total, 2);
  assert.equal(brief.summary.watchlist, 1);
});
