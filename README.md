# Vertical SaaS Radar

**Open-source product intelligence for teams building on scheduling, CRM, messaging and automation platforms.**

Product releases move faster than most roadmaps. A pricing change, API migration, new channel capability or integration can affect what you build, how you package it and how you position it.

Vertical SaaS Radar turns public release signals into a short, evidence-linked brief:

- what changed;
- how consequential it appears;
- which product dimensions it may affect;
- whether the signal looks material or mostly promotional;
- where to verify the source.

The baseline is deterministic and testable. No model provider or API key is required.

## Try it

### Browser

```bash
npm test
npm run brief:sample
npm run dev
```

Open:

- `http://localhost:3000/` — radar dashboard
- `http://localhost:3000/api/brief` — current brief as JSON
- `http://localhost:3000/api/sources` — monitored source registry
- `http://localhost:3000/health` — service health

### VS Code

Open `apps/vscode` in VS Code and press `F5` to launch an Extension Development Host.

Commands:

- `SaaS Radar: Open Latest Brief`
- `SaaS Radar: Refresh Signals`
- `SaaS Radar: Open Live Demo`

The extension consumes the same `data/latest.json` contract used by the web app.

## What the radar measures

Each normalized signal receives a consequence score across five dimensions:

| Dimension | Examples |
| --- | --- |
| Roadmap | agent workflows, automation, scheduling, CRM capabilities |
| Packaging | pricing, plans, quotas, billing and limits |
| Positioning | open-source/self-hosting moves, multi-channel strategy |
| Integrations | APIs, webhooks, OAuth, MCP, WhatsApp, Instagram, queues |
| Go-to-market | marketplaces, partners, templates, agencies, verticals |

Promotional language lowers confidence. Breaking changes, migrations, API changes, permissions and channel changes raise consequence weight.

The output is a prioritization aid, not a claim of market truth. Every item retains its evidence URL so a reader can verify the source.

## Initial source registry

The first release adapter monitors public GitHub releases from:

- n8n — workflow automation and integrations;
- Cal.com — scheduling infrastructure;
- Twenty — CRM;
- Chatwoot — customer support and messaging;
- Evolution API — messaging integration surface;
- changedetection.io — change-monitoring patterns.

These projects are monitored as public sources. Their code and branding are not incorporated into this repository.

## Weekly brief

The scheduled workflow runs every Monday at **18:00 America/Sao_Paulo (21:00 UTC)** and rebuilds:

- `data/signals.json` — normalized source signals;
- `data/latest.json` — machine-readable brief;
- `data/latest.md` — human-readable brief.

Locally:

```bash
npm run collect
npm run brief
```

`GITHUB_TOKEN` is optional for local runs and is provided automatically inside GitHub Actions.

## Repository layout

```text
apps/
  web/          browser dashboard + HTTP API
  vscode/       VS Code extension
packages/
  core/         deterministic scoring and brief contract
scripts/        collectors and brief builder
data/           source registry, samples and generated brief
docs/           architecture and source policy
tests/          classifier and contract tests
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the data flow and extension points.

## Contributing

The easiest useful contribution is a new source adapter or a scoring test based on a real release.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request. Source additions must point to public evidence and must not require private scraping or copied proprietary content.

## Roadmap

- [x] deterministic consequence scoring;
- [x] hype penalty and evidence links;
- [x] browser dashboard and JSON API;
- [x] VS Code extension source;
- [x] Monday scheduled brief;
- [x] GitHub release collector;
- [ ] public Render deployment;
- [ ] packaged `.vsix` release;
- [ ] official changelog adapters beyond GitHub releases;
- [ ] source freshness and health reporting;
- [ ] contributor-maintained source catalog;
- [ ] optional summarizer adapter behind the deterministic evidence layer.

## License

MIT. See [LICENSE](./LICENSE).
