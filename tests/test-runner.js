/**
 * ConVerse Automated Test Runner
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 * Phase 2 Radar & Awareness Engine Owner: Ananya
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
import { getSafetyPlaybooks, getEmergencyHelplines } from '../src/engine/tips/tips-contract.js';
import { REALISTIC_SCENARIOS, CORE_CATEGORIES } from '../src/data/initial-data.js';

// Ananya's Phase 2 Radar & Awareness Engine imports
import {
  SIX_DIMENSIONS,
  INDICATOR_CATALOGUE,
  createInitialAwarenessState,
  createInitialRadarState,
  calculateThreat,
  calculateDimensionThreat,
  calculateOverallThreat,
  updateDimensionAwareness,
  updateAwareness,
  getConfidenceMultiplier,
  getAwarenessScore,
  getAwarenessBand,
  getWeakestDimensions,
  handleRadarEvent,
  resetRadarState,
  getRadarState,
  sanitizeRadarState,
  persistRadarState,
  restoreRadarState,
  getActiveScamRadar,
  calculateVulnerabilityScore
} from '../src/engine/radar/radar-contract.js';

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
console.log("🛡️  CONVERSE RADAR & AWARENESS ENGINE TEST SUITE");
console.log("==================================================\n");

// ============================================================================
// SUITE 1: 7-Language i18n & Locales
// ============================================================================
console.log("TEST SUITE 1: 7-Language i18n & Locales");
assert(SUPPORTED_LANGUAGES.length === 7, "Supports exactly 7 languages (en, hi, mr, ta, te, gu, pa)");

const locales = { en, hi, mr, ta, te, gu, pa };
const enKeys = Object.keys(en);

Object.entries(locales).forEach(([langCode, dict]) => {
  const missingKeys = enKeys.filter(k => dict[k] === undefined);
  assert(missingKeys.length === 0, `Locale "${langCode}" has all ${enKeys.length} translation keys (missing: ${missingKeys.length})`);
});

// ============================================================================
// SUITE 2: Existing Foundation Contracts & Data
// ============================================================================
console.log("\nTEST SUITE 2: Existing Foundation Contracts & Data");
const scamResult = detectScamIndicators("Enter your UPI PIN to receive ₹5000 cashback reward");
assert(scamResult.riskLevel === "danger", "Detect contract correctly flags UPI PIN reward as 'danger'");
assert(scamResult.confidenceScore > 50, "Detect contract assigns confidence score > 50 for high risk text");
assert(Array.isArray(scamResult.recommendedActions), "Detect contract returns recommendedActions array");

const safeResult = detectScamIndicators("Thank you for your visit to the bank branch today.");
assert(safeResult.riskLevel === "safe", "Detect contract identifies benign text as 'safe'");

const radarThreats = getActiveScamRadar();
assert(Array.isArray(radarThreats) && radarThreats.length > 0, "Radar contract returns list of active threats");

const guides = getSafetyPlaybooks();
assert(guides.length >= 6, "Safety playbooks contain at least 6 structured DO/DON'T playbooks");
assert(guides.some(g => g.category === "upi"), "Safety playbooks cover UPI scams");
assert(guides.some(g => g.category === "phishing"), "Safety playbooks cover Phishing scams");

const emergencyHelplines = getEmergencyHelplines();
assert(emergencyHelplines.some(h => h.number === "1930"), "Emergency data contains National 1930 Helpline");

assert(CORE_CATEGORIES.length >= 6, "Contains all 6 core financial fraud categories");
assert(REALISTIC_SCENARIOS.length >= 4, "Contains realistic simulation blueprints with channel data");
assert(REALISTIC_SCENARIOS.every(s => s.channel && s.simulatedContent && s.choices.length > 0), "All scenarios contain valid communication channels and choices");

// ============================================================================
// SUITE 3: Phase 2 Radar Threat Scoring & Safety Override
// ============================================================================
console.log("\nTEST SUITE 3: Threat Scoring Engine & Safety Overrides");

// 1. Initial awareness = 50 for all six dimensions
const initAware = createInitialAwarenessState();
assert(
  initAware.urgency === 50 &&
  initAware.sender === 50 &&
  initAware.link === 50 &&
  initAware.information === 50 &&
  initAware.emotion === 50 &&
  initAware.reporting === 50,
  "1. Initial awareness = 50 for all six dimensions"
);

// 2. Empty indicators produce zero threat
const emptyThreat = calculateThreat([]);
assert(
  emptyThreat.overall === 0 &&
  emptyThreat.urgency === 0 &&
  emptyThreat.sender === 0 &&
  emptyThreat.link === 0 &&
  emptyThreat.information === 0 &&
  emptyThreat.emotion === 0 &&
  emptyThreat.reporting === 0,
  "2. Empty indicators produce zero threat"
);

// 3. One indicator calculates correct dimension threat
// U1 has weight 4: D_k = 100 * (1 - (1 - 4/6)) = 100 * (4/6) = 66.666...%
const singleThreat = calculateDimensionThreat("urgency", ["U1"]);
assert(
  Math.abs(singleThreat - (400 / 6)) < 0.001,
  "3. One indicator calculates correct dimension threat (U1 -> 66.67%)"
);

// 4. Multiple indicators combine correctly
// L1 (w=5) and L2 (w=4): Product = (1 - 5/6)*(1 - 4/6) = (1/6)*(1/3) = 1/18 => Threat = 100*(17/18) = 94.444...%
const multiThreat = calculateDimensionThreat("link", ["L1", "L2"]);
assert(
  Math.abs(multiThreat - (1700 / 18)) < 0.001,
  "4. Multiple indicators combine correctly (L1 + L2 -> 94.44%)"
);

// 5. Overall risk uses all hit indicators
// U1 (w=4) + S1 (w=4): Product = (1/3)*(1/3) = 1/9 => R = 100*(8/9) = 88.888...%
const overallRes = calculateOverallThreat(["U1", "S1"]);
assert(
  Math.abs(overallRes.overall - (800 / 9)) < 0.001,
  "5. Overall risk uses all hit indicators across dimensions"
);

// 6. OTP/PIN/CVV + urgency/link triggers minimum 85 override
// With I1 (w=5) + U5 (w=3): Raw product = (1/6)*(1/2) = 1/12 => 91.67% >= 85
// With mock low weight or any I1/I2/I3 + U*/L*: override ensures R >= 85 and hasOverride is true
const overrideRes = calculateOverallThreat(["I1", "U5"]);
assert(
  overrideRes.overall >= 85 && overrideRes.hasOverride === true,
  "6. OTP/PIN/CVV + urgency/link triggers minimum 85 override"
);

const nonOverrideRes = calculateOverallThreat(["I4", "E1"]);
assert(
  nonOverrideRes.hasOverride === false,
  "6b. Non-credential indicators do not trigger OTP safety override"
);

// ============================================================================
// SUITE 4: Phase 2 Awareness EMA Formula & Confidence Multipliers
// ============================================================================
console.log("\nTEST SUITE 4: Awareness EMA Formula & Confidence Multipliers");

// 7. Correct + Unsure uses 0.8 multiplier
// alpha_eff = 0.20 * 0.8 = 0.16 => (1 - 0.16)*50 + 0.16*100 = 42 + 16 = 58
const a_correct_unsure = updateDimensionAwareness(50, 1, "unsure");
assert(
  Math.abs(a_correct_unsure - 58) < 0.001,
  "7. Correct + Unsure uses 0.8 multiplier (50 -> 58)"
);

// 8. Correct + Fairly uses 1.0 multiplier
// alpha_eff = 0.20 * 1.0 = 0.20 => (1 - 0.20)*50 + 0.20*100 = 40 + 20 = 60
const a_correct_fairly = updateDimensionAwareness(50, 1, "fairly");
assert(
  Math.abs(a_correct_fairly - 60) < 0.001,
  "8. Correct + Fairly uses 1.0 multiplier (50 -> 60)"
);

// 9. Correct + Certain uses 1.2 multiplier
// alpha_eff = 0.20 * 1.2 = 0.24 => (1 - 0.24)*50 + 0.24*100 = 38 + 24 = 62
const a_correct_certain = updateDimensionAwareness(50, 1, "certain");
assert(
  Math.abs(a_correct_certain - 62) < 0.001,
  "9. Correct + Certain uses 1.2 multiplier (50 -> 62)"
);

// 10. Wrong + Unsure uses 1.0 multiplier
// alpha_eff = 0.20 * 1.0 = 0.20 => (1 - 0.20)*50 + 0 = 40
const a_wrong_unsure = updateDimensionAwareness(50, 0, "unsure");
assert(
  Math.abs(a_wrong_unsure - 40) < 0.001,
  "10. Wrong + Unsure uses 1.0 multiplier (50 -> 40)"
);

// 11. Wrong + Fairly uses 1.3 multiplier
// alpha_eff = 0.20 * 1.3 = 0.26 => (1 - 0.26)*50 + 0 = 37
const a_wrong_fairly = updateDimensionAwareness(50, 0, "fairly");
assert(
  Math.abs(a_wrong_fairly - 37) < 0.001,
  "11. Wrong + Fairly uses 1.3 multiplier (50 -> 37)"
);

// 12. Wrong + Certain uses 1.6 multiplier
// alpha_eff = 0.20 * 1.6 = 0.32 => (1 - 0.32)*50 + 0 = 34
const a_wrong_certain = updateDimensionAwareness(50, 0, "certain");
assert(
  Math.abs(a_wrong_certain - 34) < 0.001,
  "12. Wrong + Certain uses 1.6 multiplier (50 -> 34, hurts more)"
);

// 13. Awareness stays between 0 and 100
let boundedHigh = 95;
for (let i = 0; i < 20; i++) {
  boundedHigh = updateDimensionAwareness(boundedHigh, 1, "certain");
}
let boundedLow = 5;
for (let i = 0; i < 20; i++) {
  boundedLow = updateDimensionAwareness(boundedLow, 0, "certain");
}
assert(
  boundedHigh <= 100 && boundedHigh >= 0 && boundedLow >= 0 && boundedLow <= 100,
  "13. Awareness stays clamped between 0 and 100 (never NaN or out of bounds)"
);

// 14. Overall awareness is rounded average
const avgScore1 = getAwarenessScore({ urgency: 60, sender: 60, link: 61, information: 60, emotion: 60, reporting: 60 });
assert(avgScore1 === 60, "14a. Overall awareness is rounded average (361/6 = 60.17 -> 60)");

const avgScore2 = getAwarenessScore({ urgency: 60, sender: 60, link: 63, information: 60, emotion: 60, reporting: 60 });
assert(avgScore2 === 61, "14b. Overall awareness is rounded average (363/6 = 60.5 -> 61)");

const bandHigh = getAwarenessBand(35);
const bandMod = getAwarenessBand(55);
const bandStrong = getAwarenessBand(85);
assert(
  bandHigh.band === "high_risk" && bandMod.band === "moderate" && bandStrong.band === "strong",
  "14c. Score bands map accurately (0-39: High risk, 40-69: Moderate, 70-100: Strong)"
);

// ============================================================================
// SUITE 5: Event System & Handlers
// ============================================================================
console.log("\nTEST SUITE 5: Centralized Radar Event System");

// Reset state to start clean for event tests
resetRadarState();

// 15. scan:completed updates Threat
const stateAfterScan = handleRadarEvent({
  type: "scan:completed",
  indicators: ["U1", "S1"]
});
assert(
  stateAfterScan.threat.overall > 0 &&
  stateAfterScan.threat.urgency > 0 &&
  stateAfterScan.threat.sender > 0 &&
  stateAfterScan.awareness.urgency === 50,
  "15. scan:completed updates Threat layer without permanently changing Awareness"
);

// 16. scan:deepcheck updates relevant Threat dimensions
const stateAfterDeep = handleRadarEvent({
  type: "scan:deepcheck",
  indicators: ["L1"]
});
assert(
  stateAfterDeep.threat.link > 0 &&
  stateAfterDeep.threat.hitIndicators.includes("L1"),
  "16. scan:deepcheck updates relevant Threat dimensions"
);

// 17. scan:challenge_answered updates Awareness
resetRadarState();
const stateAfterChallenge = handleRadarEvent({
  type: "scan:challenge_answered",
  userGuess: "scam",
  actualRisk: "danger",
  indicators: ["U1"],
  confidence: "certain"
});
assert(
  Math.abs(stateAfterChallenge.awareness.urgency - 62) < 0.001,
  "17. scan:challenge_answered correctly updates awareness for detected indicator dimensions"
);

// 18. action:taken updates Reporting
resetRadarState();
const stateAfterAction = handleRadarEvent({
  type: "action:taken",
  action: "report",
  confidence: "fairly"
});
assert(
  Math.abs(stateAfterAction.awareness.reporting - 60) < 0.001,
  "18. action:taken updates Reporting dimension awareness"
);

// 19. sim:choice_made updates dimensions from indicator IDs
resetRadarState();
const stateAfterSim = handleRadarEvent({
  type: "sim:choice_made",
  indicators: ["E1", "I1"],
  outcome: 1,
  confidence: "fairly"
});
assert(
  Math.abs(stateAfterSim.awareness.emotion - 60) < 0.001 &&
  Math.abs(stateAfterSim.awareness.information - 60) < 0.001,
  "19. sim:choice_made updates affected dimensions from indicator IDs"
);

// 20. test:completed updates Awareness and snapshot data
const stateAfterTest = handleRadarEvent({
  type: "test:completed",
  testType: "post",
  dimensions: { urgency: 75, sender: 80 },
  snapshot: {
    before: { score: 50 },
    after: { score: 77 }
  }
});
assert(
  stateAfterTest.awareness.urgency === 75 &&
  stateAfterTest.awareness.sender === 80 &&
  stateAfterTest.snapshots.before.score === 50 &&
  stateAfterTest.snapshots.after.score === 77,
  "20. test:completed updates Awareness and saves before/after snapshot data"
);

// ============================================================================
// SUITE 6: Persistence, Resilience & Analysis Helpers
// ============================================================================
console.log("\nTEST SUITE 6: Persistence, Resilience & Weakness Analysis");

// 21. State persists after reload
const testPersistState = {
  ...createInitialRadarState(),
  awareness: { urgency: 70, sender: 65, link: 55, information: 80, emotion: 60, reporting: 75 }
};
persistRadarState(testPersistState);
const restoredState = restoreRadarState();
assert(
  restoredState.awareness.urgency === 70 &&
  restoredState.awareness.information === 80,
  "21. State persists and restores accurately from storage"
);

// 22. Corrupted local state falls back safely
const sanitized = sanitizeRadarState({
  awareness: { urgency: "corrupted_nan", sender: null, link: 150 },
  threat: "invalid"
});
assert(
  sanitized.awareness.urgency === 50 &&
  sanitized.awareness.link === 100 &&
  sanitized.threat.overall === 0,
  "22. Corrupted local state falls back safely without NaN or crash"
);

// 23. Reset returns all dimensions to 50
const resetState = resetRadarState();
assert(
  resetState.awareness.urgency === 50 &&
  resetState.awareness.sender === 50 &&
  resetState.awareness.link === 50 &&
  resetState.awareness.information === 50 &&
  resetState.awareness.emotion === 50 &&
  resetState.awareness.reporting === 50 &&
  resetState.threat.overall === 0 &&
  resetState.history.length === 0,
  "23. Reset returns all dimensions to 50 baseline and clears history"
);

// 24. getWeakestDimensions() returns actual lowest dimensions
const testWeakState = {
  urgency: 35,
  sender: 60,
  link: 42,
  information: 80,
  emotion: 55,
  reporting: 70
};
const weakest = getWeakestDimensions(testWeakState, 2);
assert(
  weakest.length === 2 &&
  weakest[0].dimension === "urgency" && weakest[0].score === 35 &&
  weakest[1].dimension === "link" && weakest[1].score === 42,
  "24. getWeakestDimensions() deterministically returns actual lowest dimensions"
);

// 25. Vulnerability score contract wrapper
const vulnResult = calculateVulnerabilityScore({ awareness: testWeakState });
assert(
  vulnResult.overallScore === getAwarenessScore(testWeakState) &&
  vulnResult.weakest[0].dimension === "urgency",
  "25. calculateVulnerabilityScore contract helper conforms to specification"
);

console.log("\n==================================================");
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log("==================================================\n");

if (failed > 0) {
  process.exit(1);
}
