# Release verification

Vertical SaaS Radar is treated as release-ready only when source, package and public runtime agree.

## Required gates

1. **CI** — deterministic scoring tests, sample brief generation and local HTTP smoke pass.
2. **CodeQL** — JavaScript security analysis passes.
3. **VS Code Extension** — the extension is packaged from source and the generated manifest matches the checked-in install artifact.
4. **Verified Demo Assets** — screenshot and GIF are generated from the real local application in CI, not from mockups.
5. **Live Demo Smoke** — the public Render service passes checks for the browser app, health, brief, sources, OpenAPI, agent-readable files and Markdown negotiation.
6. **External discovery scan** — material discovery/accessibility failures are resolved before launch.
7. **Exact SHA** — the Render deployment must point to the merged `main` SHA being announced.

## Public runtime contract

Canonical demo: <https://vertical-saas-radar.onrender.com/>

Required public surfaces:

- `/` — browser dashboard;
- `/health` — service health;
- `/api/brief` — canonical briefing contract (`schema_version: 1`);
- `/api/sources` — monitored source registry;
- `/openapi.json` — public API contract;
- `/llms.txt` and `/llms-full.txt` — agent-readable discovery;
- `/index.md` and `Accept: text/markdown` — Markdown representation;
- `/AGENTS.md` — coding-agent usage notes.

## Rollback rule

If a merged change breaks the public runtime or a release gate:

1. stop distribution of the affected release;
2. identify the last known-good `main` SHA;
3. revert the smallest responsible change through a PR;
4. require CI and CodeQL on the revert;
5. deploy the corrected `main` SHA;
6. rerun the public smoke and external discovery scan;
7. document the failure and prevention in the originating Issue.

Do not patch production independently of the repository. GitHub `main` remains the source of truth.
