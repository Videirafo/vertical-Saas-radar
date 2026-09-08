import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const port = Number(process.env.PORT || 3000);
const canonical = 'https://vertical-saas-radar.onrender.com';

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath));
}

function json(res, status, body, method = 'GET') {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  if (method === 'HEAD') return res.end();
  res.end(JSON.stringify(body));
}

function applySecurityHeaders(res) {
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('referrer-policy', 'no-referrer');
  res.setHeader('x-frame-options', 'DENY');
  res.setHeader('x-robots-tag', 'index, follow, max-snippet:-1, max-image-preview:large');
  res.setHeader('content-security-policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'");
}

const staticRoutes = {
  '/llms.txt': ['apps/web/public/llms.txt', 'text/plain; charset=utf-8'],
  '/llms-full.txt': ['apps/web/public/llms-full.txt', 'text/plain; charset=utf-8'],
  '/robots.txt': ['apps/web/public/robots.txt', 'text/plain; charset=utf-8'],
  '/sitemap.xml': ['apps/web/public/sitemap.xml', 'application/xml; charset=utf-8'],
  '/sitemap.md': ['apps/web/public/sitemap.md', 'text/markdown; charset=utf-8'],
  '/AGENTS.md': ['apps/web/public/AGENTS.md', 'text/markdown; charset=utf-8'],
  '/openapi.json': ['apps/web/public/openapi.json', 'application/json; charset=utf-8'],
  '/index.md': ['apps/web/public/index.md', 'text/markdown; charset=utf-8'],
  '/glossary': ['apps/web/public/glossary.html', 'text/html; charset=utf-8'],
  '/assets/app.css': ['apps/web/public/assets/app.css', 'text/css; charset=utf-8'],
  '/assets/app.js': ['apps/web/public/assets/app.js', 'application/javascript; charset=utf-8']
};

async function sendFile(res, method, relativePath, contentType, cacheControl = 'public, max-age=300') {
  const body = await read(relativePath);
  res.statusCode = 200;
  res.setHeader('content-type', contentType);
  res.setHeader('cache-control', cacheControl);
  if (contentType.startsWith('text/markdown')) {
    res.setHeader('link', `<${canonical}/>; rel="canonical"`);
  }
  if (method === 'HEAD') return res.end();
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);

  try {
    const method = req.method || 'GET';
    if (method !== 'GET' && method !== 'HEAD') {
      return json(res, 405, { error: 'method_not_allowed' }, method);
    }

    if (req.url === '/health') {
      return json(res, 200, { status: 'ok', service: 'vertical-saas-radar', version: '0.1.0' }, method);
    }

    if (req.url === '/api/brief') return sendFile(res, method, 'data/latest.json', 'application/json; charset=utf-8', 'no-store');
    if (req.url === '/api/sources') return sendFile(res, method, 'data/sources.json', 'application/json; charset=utf-8');

    if (req.url === '/' || req.url === '/index.html') {
      const acceptsMarkdown = String(req.headers.accept || '').toLowerCase().includes('text/markdown');
      if (acceptsMarkdown) return sendFile(res, method, 'apps/web/public/index.md', 'text/markdown; charset=utf-8', 'no-store');
      return sendFile(res, method, 'apps/web/public/index.html', 'text/html; charset=utf-8', 'no-store');
    }

    if (staticRoutes[req.url]) {
      const [relativePath, type] = staticRoutes[req.url];
      return sendFile(res, method, relativePath, type);
    }

    return json(res, 404, { error: 'not_found' }, method);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: 'internal_error' }, req.method || 'GET');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Vertical SaaS Radar listening on http://localhost:${port}`);
});
