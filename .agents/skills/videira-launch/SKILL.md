---
name: videira-launch
description: Governed launch-intelligence workflow for turning a shipped feature or release into evidence, release notes, social copy, screenshots and an optional short launch video. Use for /videira-launch, /launch, release demo, launch video, release evidence, or when a feature is ready to show.
---

# Videira Launch Intelligence

Run only after a valid implementation candidate exists. It never replaces tests, CI, security gates or deployment validation.

1. Inspect repository, diff/PR, README, data pipeline and affected product surface.
2. Verify repository gates first; fail closed for production when gates are red or unknown.
3. Select demo mode from `launch.config.json`.
4. Never expose secrets, tokens, credentials, private source data or internal URLs.
5. Plan hook → real intelligence signal → analysis/result → concise outro. Never invent claims, rankings or numbers.
6. Prefer actual UI/data outputs/briefs over generic mockups.
7. Run `node scripts/launch-evidence.mjs` for the exact release receipt.
8. Create timestamped plan, evidence, release notes, share copy, screenshots and optional 15–25s video/poster.
9. Use installed /brag when appropriate; otherwise use available local tools. Video is not a release blocker.
10. Adapt only to enabled channels. Publishing requires explicit configured approval.
11. Final receipt states SHA, PR, CI, deployment status/URL when known, artifacts and skipped steps.

Governance: `Issue → branch → implementation → tests → PR → CI → merge → deploy by exact SHA → smoke → evidence → launch assets → approval → publish → metrics/learning`.

Original Videira adaptation informed by MIT-licensed `latent-spaces/brag`, extended with governance, privacy and evidence receipts.
