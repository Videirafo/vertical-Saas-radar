# Contributing

Vertical SaaS Radar is designed for small, evidence-backed contributions.

## Good first contributions

- add a test for a real product release;
- improve a scoring rule with before/after examples;
- add a public source adapter;
- improve VS Code usability;
- report a false positive or missed consequential signal.

## Pull request expectations

1. Open or reference an Issue when the change is material.
2. Keep source evidence in the PR description.
3. Run `npm test` and `npm run brief:sample`.
4. Do not add private scraping, credentials or copied proprietary content.
5. Keep product copy factual and specific; avoid promotional claims.

## Source adapters

A source adapter should normalize data to:

```json
{
  "source": "source-id",
  "title": "release or change title",
  "url": "https://canonical-evidence.example/change",
  "published_at": "2026-09-08T12:00:00Z",
  "body": "small text excerpt used for deterministic classification"
}
```

See [docs/SOURCE_POLICY.md](./docs/SOURCE_POLICY.md).
