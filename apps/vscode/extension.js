const vscode = require('vscode');

let cachedBrief = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value));
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
  } catch {
    return '#';
  }
}

async function loadBrief() {
  const config = vscode.workspace.getConfiguration('verticalRadar');
  const url = config.get('briefUrl');
  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    cachedBrief = await response.json();
    return cachedBrief;
  } catch (error) {
    if (cachedBrief) return cachedBrief;
    throw error;
  }
}

async function openBrief() {
  const panel = vscode.window.createWebviewPanel('verticalRadar', 'Vertical SaaS Radar', vscode.ViewColumn.One, { enableScripts: false });
  panel.webview.html = '<p>Loading latest brief…</p>';
  try {
    const data = await loadBrief();
    const items = data.meaningful || [];
    const rows = items.map((item) => {
      const dimensions = Object.entries(item.impact || {}).filter(([, enabled]) => enabled).map(([key]) => key).join(' · ');
      return `<section style="border-top:1px solid var(--vscode-panel-border);padding:16px 0"><div style="color:var(--vscode-descriptionForeground)">${escapeHtml(item.source_name || item.source)} · ${escapeHtml(item.score)}/100</div><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(dimensions || 'watch only')}</p><p><a href="${escapeHtml(safeHttpUrl(item.url))}">View evidence</a></p></section>`;
    }).join('');
    panel.webview.html = `<!doctype html><html><body style="font-family:var(--vscode-font-family);padding:20px;max-width:820px"><h1>Vertical SaaS Radar</h1><p style="color:var(--vscode-descriptionForeground)">Meaningful product and API shifts, with the evidence attached.</p>${rows || '<p>No consequential signals crossed the threshold in this brief.</p>'}</body></html>`;
  } catch (error) {
    panel.webview.html = `<h2>Brief unavailable</h2><pre>${escapeHtml(error.message || error)}</pre>`;
  }
}

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('verticalRadar.openBrief', openBrief));
  context.subscriptions.push(vscode.commands.registerCommand('verticalRadar.refresh', async () => { cachedBrief = null; await openBrief(); }));
  context.subscriptions.push(vscode.commands.registerCommand('verticalRadar.openDemo', () => {
    const url = vscode.workspace.getConfiguration('verticalRadar').get('demoUrl');
    return vscode.env.openExternal(vscode.Uri.parse(url));
  }));
}

function deactivate() {}
module.exports = { activate, deactivate };
