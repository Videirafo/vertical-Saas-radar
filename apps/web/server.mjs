import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const port = Number(process.env.PORT || 3000);

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath));
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}

function applySecurityHeaders(res) {
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('referrer-policy', 'no-referrer');
  res.setHeader('x-frame-options', 'DENY');
  res.setHeader('content-security-policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'");
}

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);

  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return json(res, 405, { error: 'method_not_allowed' });
    }

    if (req.url === '/health') {
      return json(res, 200, { status: 'ok', service: 'vertical-saas-radar', version: '0.1.0' });
    }

    if (req.url === '/api/brief') {
      const body = await read('data/latest.json');
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.setHeader('cache-control', 'no-store');
      if (req.method === 'HEAD') return res.end();
      return res.end(body);
    }

    if (req.url === '/api/sources') {
      const body = await read('data/sources.json');
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.setHeader('cache-control', 'public, max-age=300');
      if (req.method === 'HEAD') return res.end();
      return res.end(body);
    }

    if (req.url === '/' || req.url === '/index.html') {
      const body = await read('apps/web/public/index.html');
      res.statusCode = 200;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.setHeader('cache-control', 'no-store');
      if (req.method === 'HEAD') return res.end();
      return res.end(body);
    }

    return json(res, 404, { error: 'not_found' });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: 'internal_error' });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Vertical SaaS Radar listening on http://localhost:${port}`);
});
