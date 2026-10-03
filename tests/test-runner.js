/**
 * ConVerse Automated Test Runner
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

import en from '../src/locales/en/common.js';
import hi from '../src/locales/hi/common.js';
import mr from '../src/locales/mr/common.js';
import ta from '../src/locales/ta/common.js';
import te from '../src/locales/te/common.js';
import gu from '../src/locales/gu/common.js';
import pa from '../src/locales/pa/common.js';
import { SUPPORTED_LANGUAGES } from '../src/i18n/i18n.js';
import { detectScamIndicators } from '../src/engine/detect/detect-contract.js';
import { getActiveScamRadar } from '../src/engine/radar/radar-contract.js';
import { SAMPLE_SCENARIOS, EMERGENCY_HELPLINES } from '../src/data/initial-data.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("\n==================================================");
console.log("🛡️  CONVERSE FOUNDATION TEST SUITE");
console.log("==================================================\n");

// 1. Test 7-Language i18n Completeness
console.log("TEST SUITE 1: 7-Language i18n & Locales");
assert(SUPPORTED_LANGUAGES.length === 7, "Supports exactly 7 languages (en, hi, mr, ta, te, gu, pa)");

const locales = { en, hi, mr, ta, te, gu, pa };
const enKeys = Object.keys(en);

Object.entries(locales).forEach(([langCode, dict]) => {
  const missingKeys = enKeys.filter(k => dict[k] === undefined);
  assert(missingKeys.length === 0, `Locale "${langCode}" has all ${enKeys.length} translation keys (missing: ${missingKeys.length})`);
});

// 2. Test Scam Detection Engine Contract
console.log("\nTEST SUITE 2: Engine Contracts");
const scamResult = detectScamIndicators("Enter your UPI PIN to receive ₹5000 cashback reward");
assert(scamResult.riskLevel === "danger", "Detect contract correctly flags UPI PIN reward as 'danger'");
assert(scamResult.confidenceScore > 50, "Detect contract assigns confidence score > 50 for high risk text");
assert(Array.isArray(scamResult.recommendedActions), "Detect contract returns recommendedActions array");

const safeResult = detectScamIndicators("Thank you for your visit to the bank branch today.");
assert(safeResult.riskLevel === "safe", "Detect contract identifies benign text as 'safe'");

// 3. Test Radar Threat Data Contract
const radarThreats = getActiveScamRadar();
assert(Array.isArray(radarThreats) && radarThreats.length > 0, "Radar contract returns list of active threats");

// 4. Test Sample Data & Scenarios
console.log("\nTEST SUITE 3: Shared Data & Helplines");
assert(SAMPLE_SCENARIOS.length >= 4, "Initial data contains at least 4 realistic scenario blueprints");
assert(EMERGENCY_HELPLINES.some(h => h.number === "1930"), "Emergency data contains National 1930 Helpline");

console.log("\n==================================================");
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log("==================================================\n");

if (failed > 0) {
  process.exit(1);
}
