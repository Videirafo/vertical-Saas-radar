# Architecture

Vertical SaaS Radar keeps collection, scoring and presentation separate so each layer can evolve without changing the public brief contract.

```text
public sources
   ↓
source adapters
   ↓
normalized signals
   ↓
deterministic consequence scoring
   ↓
data/latest.json + data/latest.md
   ├─ browser dashboard + HTTP API
   └─ VS Code extension
```

## Components

### Source registry
`data/sources.json` defines the monitored catalog. The v0.1 adapter supports `github-releases` sources.

### Collector
`scripts/collect-github-releases.mjs` fetches recent public releases, normalizes them and writes `data/signals.json`. The default lookback window is eight days so a weekly brief does not repeatedly surface stale releases.

### Core
`packages/core/radar.mjs` is deliberately deterministic. It scores a signal against roadmap, packaging, positioning, integrations and go-to-market dimensions, then applies a promotional-language penalty.

### Brief contract
`data/latest.json` is the shared contract for the browser and VS Code clients. `schema_version` allows future changes to be managed explicitly.

### Presentation
The web app and extension do not reimplement scoring. They consume the generated brief and retain evidence URLs.

## Design principles
- Evidence first: every signal keeps its public source URL.
- Deterministic baseline: no model provider is required to classify a release.
- One data contract: web and VS Code read the same brief.
- Source boundaries: no private/login-only scraping in the default project.
- Small adapters: new source types should normalize into the existing signal shape.
