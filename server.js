/**
 * ConVerse — Local Server (Node.js built-in HTTP)
 * Zero external dependencies, offline-capable.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Lazy loaded scenario data & validator
let scenarioData = null;
let scenarioValidator = null;

function getScenarioData() {
  if (!scenarioData) {
    try {
      scenarioData = require('./src/engine/sim/scenario-data.js');
    } catch (e) {
      scenarioData = { SCENARIOS: {} };
    }
  }
  return scenarioData;
}

function getScenarioValidator() {
  if (!scenarioValidator) {
    try {
      scenarioValidator = require('./src/engine/sim/scenario-validator.js');
    } catch (e) {
      scenarioValidator = { validateScenario: () => ({ valid: true, errors: [] }) };
    }
  }
  return scenarioValidator;
}

function handleApiRequest(req, res, pathname) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  // GET /api/scenarios
  if (req.method === 'GET' && (pathname === '/api/scenarios' || pathname === '/api/scenarios/')) {
    const data = getScenarioData();
    const list = Object.values(data.SCENARIOS || {}).map(s => ({
      id: s.id,
      title: s.title,
      category: s.category,
      difficulty: s.difficulty,
      personas: s.personas,
      summary: s.summary,
      nodeCount: (s.nodes || []).length
    }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, scenarios: list }));
    return true;
  }

  // GET /api/scenarios/:id
  if (req.method === 'GET' && pathname.startsWith('/api/scenarios/')) {
    const scenarioId = pathname.replace('/api/scenarios/', '').trim();
    const data = getScenarioData();
    const scenario = (data.SCENARIOS || {})[scenarioId];
    if (scenario) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, scenario }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Scenario not found' }));
    }
    return true;
  }

  // POST /api/scenarios/validate
  if (req.method === 'POST' && pathname === '/api/scenarios/validate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const validator = getScenarioValidator();
        const result = validator.validateScenario(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, result }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON body: ' + err.message }));
      }
    });
    return true;
  }

  return false;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    if (handleApiRequest(req, res, pathname)) {
      return;
    }
  }

  // Handle Static files
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/public/index.html';
  } else if (!safePath.startsWith('/public/') && !safePath.startsWith('/src/')) {
    // Check if in public or root
    if (fs.existsSync(path.join(ROOT_DIR, 'public', safePath))) {
      safePath = '/public' + safePath;
    }
  }

  const filePath = path.join(ROOT_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA routing
        fs.readFile(path.join(ROOT_DIR, 'public', 'index.html'), (fallbackErr, indexContent) => {
          if (fallbackErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[ConVerse] Server running at http://localhost:${PORT}`);
    console.log(`[ConVerse] Mode: Offline-First Local Prototype (PS-10)`);
  });
}

module.exports = server;
