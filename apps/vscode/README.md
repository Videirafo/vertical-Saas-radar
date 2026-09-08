# Vertical SaaS Radar for VS Code

Use the same product-intelligence brief from inside the editor.

## Development

1. Open `apps/vscode` in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. Open the Command Palette.
4. Run `SaaS Radar: Open Latest Brief`.

Available commands:

- `SaaS Radar: Open Latest Brief`
- `SaaS Radar: Refresh Signals`
- `SaaS Radar: Open Live Demo`

The extension reads the public JSON brief. If a refresh fails after a successful request, the most recent in-memory brief remains available for that extension session.
