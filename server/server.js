/**
 * ConVerse Local Development Server & REST Endpoints
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUPPORTED_LANGUAGES } from '../src/i18n/i18n.js';
import { SAMPLE_SCENARIOS, SAMPLE_RADAR_THREATS, EMERGENCY_HELPLINES } from '../src/data/initial-data.js';
import { detectScamIndicators } from '../src/engine/detect/detect-contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());

// Serve static frontend assets from workspace root
app.use(express.static(rootDir, {
  extensions: ['html', 'js', 'css', 'json', 'svg', 'webmanifest']
}));

// ============================================================================
// Simple Local REST API Endpoints
// ============================================================================

/**
 * Health & Status Endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ConVerse Financial Scam Awareness API',
    version: '1.0.0',
    foundation: 'Tanishka',
    timestamp: new Date().toISOString()
  });
});

/**
 * Supported Languages List (7 Indian Languages)
 */
app.get('/api/languages', (req, res) => {
  res.json({
    count: SUPPORTED_LANGUAGES.length,
    languages: SUPPORTED_LANGUAGES
  });
});

/**
 * Scam Risk Radar Threats
 */
app.get('/api/radar/threats', (req, res) => {
  const category = req.query.category;
  if (category && category !== 'all') {
    const filtered = SAMPLE_RADAR_THREATS.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    return res.json(filtered);
  }
  res.json(SAMPLE_RADAR_THREATS);
});

/**
 * Scenario List
 */
app.get('/api/scenarios', (req, res) => {
  const category = req.query.category;
  if (category && category !== 'all') {
    const filtered = SAMPLE_SCENARIOS.filter(s => s.categoryId === category);
    return res.json(filtered);
  }
  res.json(SAMPLE_SCENARIOS);
});

/**
 * Emergency Helplines
 */
app.get('/api/helplines', (req, res) => {
  res.json(EMERGENCY_HELPLINES);
});

/**
 * Server-side Scam Indicator Analysis (Proxy to detection contract)
 */
app.post('/api/scan', (req, res) => {
  const { text, language = 'en' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for scam analysis' });
  }

  const result = detectScamIndicators(text, { language });
  res.json(result);
});

/**
 * Progress Sync Stub
 */
app.post('/api/progress/sync', (req, res) => {
  const { userId, awarenessScore, completedSimulations } = req.body;
  res.json({
    success: true,
    message: 'Progress synced successfully',
    syncedAt: new Date().toISOString(),
    currentScore: awarenessScore || 0
  });
});

// Single Page Application Fallback for any unmatched navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🛡️  ConVerse Financial Scam Awareness Engine is running!`);
  console.log(`📡  Local URL:        http://localhost:${PORT}`);
  console.log(`🎨  UI Styleguide:    http://localhost:${PORT}/#styleguide`);
  console.log(`🌐  API Health Check: http://localhost:${PORT}/api/health`);
  console.log('================================================================');
});
