import fs from 'fs';
import { parse, fileURLToPath } from 'url';
import { createServer } from 'http';

const dbPath = fileURLToPath(new URL('./db.json', import.meta.url));

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(body);
}

const server = createServer((req, res) => {
  const url = parse(req.url || '', true);
  const parts = url.pathname ? url.pathname.split('/').filter(Boolean) : [];

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    });
    return res.end();
  }

  try {
    const db = readDb();

    if (req.method === 'GET' && url.pathname === '/records') {
      return sendJson(res, 200, db.records);
    }

    if (parts[0] === 'records' && parts.length === 2 && req.method === 'GET') {
      const name = decodeURIComponent(parts[1]);
      const list = db.statuses[name];
      if (!list) return sendJson(res, 404, { message: 'Record not found' });
      return sendJson(res, 200, list);
    }

    if (parts[0] === 'records' && parts.length === 3 && parts[2] === 'allowed' && req.method === 'GET') {
      const name = decodeURIComponent(parts[1]);
      const list = db.statuses[name];
      if (!list) return sendJson(res, 404, { message: 'Record not found' });
      return sendJson(res, 200, list.filter((s) => s.isAllowed));
    }

    if (parts[0] === 'records' && parts.length === 2 && req.method === 'PUT') {
      const name = decodeURIComponent(parts[1]);
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const payload = JSON.parse(body || '[]');
        const existing = db.statuses[name];
        if (!existing) return sendJson(res, 404, { message: 'Record not found' });

        const updated = existing.map((s) => {
          const p = payload.find((x) => x.id === s.recordStatusId);
          if (!p) return s;
          return { ...s, isAllowed: p.isAllowed, isDefault: p.isDefault };
        });

        db.statuses[name] = updated;
        writeDb(db);
        return sendJson(res, 200, { ok: true, statuses: updated });
      });
      return;
    }

    sendJson(res, 404, { message: 'Not found' });
  } catch (e) {
    console.error(e);
    sendJson(res, 500, { message: 'Server error' });
  }
});

const port = 8080;
server.listen(port, () => console.log(`Mock server listening on http://localhost:${port}`));
