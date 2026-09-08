# Vertical SaaS Radar agent guide

## Installation
Clone `https://github.com/Videirafo/vertical-Saas-radar`, use Node.js 20 or newer, then run `npm test`, `npm run brief:sample`, and `npm run dev`.

## Configuration
The baseline requires no external model provider. `GITHUB_TOKEN` is optional locally and improves GitHub API rate limits. `RADAR_LOOKBACK_DAYS` controls the release lookback window and defaults to 8. The public web service uses `PORT` when supplied by the host.

## Usage
Use `https://vertical-saas-radar.onrender.com/api/brief` for the current machine-readable brief, `https://vertical-saas-radar.onrender.com/api/sources` for the monitored source catalog, and `https://vertical-saas-radar.onrender.com/openapi.json` for the API contract. Web and VS Code clients consume the same `schema_version: 1` brief.

## Examples
Run `npm run collect && npm run brief` to rebuild the radar from current public GitHub releases. Run `npm run brief:sample` for a deterministic local demonstration with no network dependency.

## Contribution
Prefer small source adapters and scoring tests backed by a canonical public evidence URL. Do not add private scraping, credentials, or copied proprietary content.
