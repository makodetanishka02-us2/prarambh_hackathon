/**
 * ConVerse Radar Engine: Threat & Awareness Scoring Core
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Radar & Intelligence Engine Owner: Ananya
 *
 * Implements:
 * 1. Layer A: Threat Scoring Formula (Dimension threats D_k and Overall Risk R)
 * 2. OTP/PIN/CVV Critical Safety Override (R = max(R, 85))
 * 3. Layer B: Awareness EMA Update Formula with Asymmetric Confidence Multipliers
 * 4. 6-Dimension State Management (Urgency, Sender, Link, Information, Emotion, Reporting)
 * 5. Deterministic Weakness Analysis
 */

import { SIX_DIMENSIONS, getIndicator } from '../../data/indicators.js';

export const DIMENSION_KEYS = ["urgency", "sender", "link", "information", "emotion", "reporting"];

export const BASELINE_AWARENESS = 50;
export const BASE_ALPHA = 0.20;

// Confidence multipliers for EMA alpha
export const CONFIDENCE_MULTIPLIERS = {
  CORRECT: {
    unsure: 0.8,
    fairly: 1.0,
    certain: 1.2
  },
  WRONG: {
    unsure: 1.0,
    fairly: 1.3,
    certain: 1.6
  }
};

/**
 * Creates a clean default awareness state (all 6 dimensions at 50)
 * @returns {{ urgency: number, sender: number, link: number, information: number, emotion: number, reporting: number }}
 */
export function createInitialAwarenessState() {
  return {
    urgency: BASELINE_AWARENESS,
    sender: BASELINE_AWARENESS,
    link: BASELINE_AWARENESS,
    information: BASELINE_AWARENESS,
    emotion: BASELINE_AWARENESS,
    reporting: BASELINE_AWARENESS
  };
}

/**
 * Creates a clean default threat state (all dimension threats at 0)
 * @returns {Object}
 */
export function createEmptyThreatState() {
  return {
    urgency: 0,
    sender: 0,
    link: 0,
    information: 0,
    emotion: 0,
    reporting: 0,
    overall: 0,
    hitIndicators: [],
    hasCriticalOverride: false
  };
}

/**
 * Creates initial composite radar state
 * @returns {Object}
 */
export function createInitialRadarState() {
  return {
    threat: createEmptyThreatState(),
    awareness: createInitialAwarenessState(),
    history: [],
    snapshots: {
      before: null,
      after: null
    },
    lastUpdated: Date.now()
  };
}

/**
 * Calculates threat score for a single dimension k:
 * D_k = 100 * (1 - PRODUCT over hit indicators i in k of (1 - w_i / 6))
 *
 * @param {string} dimensionKey - Key of the dimension ('urgency', 'link', etc.)
 * @param {Array<string|Object>} hitIndicators - Array of hit indicator IDs or objects
 * @returns {number} Threat score 0 - 100
 */
export function calculateDimensionThreat(dimensionKey, hitIndicators = []) {
  if (dimensionKey === "reporting") {
    // Reporting habit is user defense action, threat is always 0 for messages
    return 0;
  }

  const indicators = normalizeIndicatorList(hitIndicators);
  const dimensionHits = indicators.filter(ind => ind && ind.dimension === dimensionKey);

  if (dimensionHits.length === 0) {
    return 0;
  }

  let product = 1.0;
  for (const ind of dimensionHits) {
    const weight = Math.max(1, Math.min(5, ind.weight || 3));
    product *= (1.0 - (weight / 6.0));
  }

  const threat = 100.0 * (1.0 - product);
  return clamp(threat, 0, 100);
}

/**
 * Calculates overall threat risk R across all hit indicators:
 * R = 100 * (1 - PRODUCT over all hit indicators of (1 - w_i / 6))
 *
 * Applies OTP/PIN/CVV safety override:
 * If any of {I1, I2, I3} is present AND (any U* OR any L*) is present:
 * R = max(R, 85)
 *
 * @param {Array<string|Object>} hitIndicators - Array of hit indicator IDs or objects
 * @returns {{ overall: number, hasOverride: boolean }}
 */
export function calculateOverallThreat(hitIndicators = []) {
  const indicators = normalizeIndicatorList(hitIndicators);

  if (indicators.length === 0) {
    return { overall: 0, hasOverride: false };
  }

  // Filter out reporting indicators from incoming message threat calculation
  const threatIndicators = indicators.filter(ind => ind.dimension !== "reporting");

  if (threatIndicators.length === 0) {
    return { overall: 0, hasOverride: false };
  }

  let product = 1.0;
  for (const ind of threatIndicators) {
    const weight = Math.max(1, Math.min(5, ind.weight || 3));
    product *= (1.0 - (weight / 6.0));
  }

  let rawOverall = 100.0 * (1.0 - product);
  rawOverall = clamp(rawOverall, 0, 100);

  // Critical Safety Override check:
  // (I1, I2, or I3) present AND (any Urgency or Link indicator present)
  const hasCredential = threatIndicators.some(ind => ["I1", "I2", "I3"].includes(ind.id.toUpperCase()));
  const hasUrgencyOrLink = threatIndicators.some(ind => ind.dimension === "urgency" || ind.dimension === "link" || /^U/i.test(ind.id) || /^L/i.test(ind.id));

  const hasOverride = hasCredential && hasUrgencyOrLink;
  const overall = hasOverride ? Math.max(rawOverall, 85) : rawOverall;

  return {
    overall: clamp(overall, 0, 100),
    hasOverride
  };
}

/**
 * Calculates full threat breakdown for all 6 dimensions plus overall risk
 * @param {Array<string|Object>} hitIndicators - Array of hit indicator IDs
 * @returns {Object} Threat breakdown
 */
export function calculateThreat(hitIndicators = []) {
  const indicators = normalizeIndicatorList(hitIndicators);
  const overallResult = calculateOverallThreat(indicators);

  return {
    urgency: calculateDimensionThreat("urgency", indicators),
    sender: calculateDimensionThreat("sender", indicators),
    link: calculateDimensionThreat("link", indicators),
    information: calculateDimensionThreat("information", indicators),
    emotion: calculateDimensionThreat("emotion", indicators),
    reporting: 0,
    overall: overallResult.overall,
    hasCriticalOverride: overallResult.hasOverride,
    hitIndicators: indicators.map(i => i.id)
  };
}

/**
 * Retrieves the effective alpha multiplier based on correctness and confidence
 * @param {number} outcome - 1 (correct/good) or 0 (wrong/bad)
 * @param {"unsure"|"fairly"|"certain"|string} [confidence="fairly"]
 * @returns {number} Multiplier value
 */
export function getConfidenceMultiplier(outcome, confidence = "fairly") {
  const confKey = String(confidence || "fairly").toLowerCase();
  const isCorrect = Number(outcome) === 1;

  if (isCorrect) {
    return CONFIDENCE_MULTIPLIERS.CORRECT[confKey] ?? CONFIDENCE_MULTIPLIERS.CORRECT.fairly;
  } else {
    return CONFIDENCE_MULTIPLIERS.WRONG[confKey] ?? CONFIDENCE_MULTIPLIERS.WRONG.fairly;
  }
}

/**
 * Updates a single dimension's awareness score using Exponential Moving Average:
 * A_k(new) = (1 - alpha_eff) * A_k(old) + alpha_eff * 100 * outcome
 *
 * @param {number} currentValue - Existing awareness score (0 - 100)
 * @param {number} outcome - 1 (correct) or 0 (wrong)
 * @param {"unsure"|"fairly"|"certain"|string} [confidence="fairly"] - User confidence
 * @returns {number} Updated awareness score clamped to [0, 100]
 */
export function updateDimensionAwareness(currentValue, outcome, confidence = "fairly") {
  const current = typeof currentValue === "number" && !isNaN(currentValue) ? currentValue : BASELINE_AWARENESS;
  const numOutcome = Number(outcome) === 1 ? 1 : 0;
  const multiplier = getConfidenceMultiplier(numOutcome, confidence);
  const alphaEff = BASE_ALPHA * multiplier;

  const newValue = ((1.0 - alphaEff) * current) + (alphaEff * 100.0 * numOutcome);
  return clamp(newValue, 0, 100);
}

/**
 * Updates multiple awareness dimensions given an event payload
 * @param {Object} currentAwareness - Existing 6-dimension awareness state
 * @param {Object} updateParams - { dimensions, indicators, outcome, confidence }
 * @returns {Object} New awareness state
 */
export function updateAwareness(currentAwareness = {}, updateParams = {}) {
  const { dimensions = [], indicators = [], outcome = 1, confidence = "fairly" } = updateParams;
  const nextAwareness = { ...createInitialAwarenessState(), ...currentAwareness };

  // Resolve affected dimensions from either explicit list or indicator catalogue
  const affectedDimensions = new Set();

  if (Array.isArray(dimensions)) {
    dimensions.forEach(d => {
      const dimKey = String(d).toLowerCase();
      if (DIMENSION_KEYS.includes(dimKey)) {
        affectedDimensions.add(dimKey);
      }
    });
  }

  if (Array.isArray(indicators)) {
    const normalized = normalizeIndicatorList(indicators);
    normalized.forEach(ind => {
      if (ind && ind.dimension && DIMENSION_KEYS.includes(ind.dimension)) {
        affectedDimensions.add(ind.dimension);
      }
    });
  }

  // Update each affected dimension
  affectedDimensions.forEach(dimKey => {
    const prevVal = nextAwareness[dimKey] ?? BASELINE_AWARENESS;
    nextAwareness[dimKey] = updateDimensionAwareness(prevVal, outcome, confidence);
  });

  return nextAwareness;
}

/**
 * Calculates overall user awareness score:
 * Average of the 6 dimensions rounded to nearest integer
 * @param {Object} awarenessState - 6-dimension scores
 * @returns {number} Rounded integer score 0 - 100
 */
export function getAwarenessScore(awarenessState = {}) {
  const state = { ...createInitialAwarenessState(), ...awarenessState };
  let sum = 0;
  let count = 0;

  for (const key of DIMENSION_KEYS) {
    const val = typeof state[key] === "number" && !isNaN(state[key]) ? state[key] : BASELINE_AWARENESS;
    sum += clamp(val, 0, 100);
    count++;
  }

  return Math.round(sum / count);
}

/**
 * Determines awareness band for a given score
 * Bands:
 * 0–39: High risk
 * 40–69: Moderate
 * 70–100: Strong
 *
 * @param {number} score - Overall score
 * @returns {{ band: "high_risk"|"moderate"|"strong", label: string, min: number, max: number }}
 */
export function getAwarenessBand(score) {
  const val = Math.round(score || 0);

  if (val <= 39) {
    return { band: "high_risk", label: "High risk", min: 0, max: 39 };
  }
  if (val <= 69) {
    return { band: "moderate", label: "Moderate", min: 40, max: 69 };
  }
  return { band: "strong", label: "Strong", min: 70, max: 100 };
}

/**
 * Deterministically returns user's weakest awareness dimensions
 * @param {Object} awarenessState - 6-dimension scores
 * @param {number} [limit=2] - Number of weakest dimensions to return
 * @returns {Array<{ dimension: string, score: number, name: string, meaning: string }>}
 */
export function getWeakestDimensions(awarenessState = {}, limit = 2) {
  const state = { ...createInitialAwarenessState(), ...awarenessState };

  const dimensions = SIX_DIMENSIONS.map(d => ({
    dimension: d.key,
    score: typeof state[d.key] === "number" && !isNaN(state[d.key]) ? state[d.key] : BASELINE_AWARENESS,
    name: d.name,
    meaning: d.meaning
  }));

  // Deterministic ascending sort by score, fallback to stable index
  dimensions.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 0.001) {
      return a.score - b.score;
    }
    return DIMENSION_KEYS.indexOf(a.dimension) - DIMENSION_KEYS.indexOf(b.dimension);
  });

  return dimensions.slice(0, Math.max(1, limit));
}

// ============================================================================
// Internal Helper Functions
// ============================================================================

/**
 * Normalizes an array of indicator strings or objects into valid indicator definitions
 * @param {Array<string|Object>} list
 * @returns {Array<Object>}
 */
function normalizeIndicatorList(list) {
  if (!Array.isArray(list)) return [];

  const results = [];
  for (const item of list) {
    if (!item) continue;

    if (typeof item === "string") {
      const found = getIndicator(item);
      if (found) {
        results.push(found);
      } else {
        // Construct fallback descriptor for unknown indicator code
        const code = item.toUpperCase();
        let dim = "urgency";
        if (code.startsWith("S")) dim = "sender";
        else if (code.startsWith("L")) dim = "link";
        else if (code.startsWith("I")) dim = "information";
        else if (code.startsWith("E")) dim = "emotion";
        else if (code.startsWith("R")) dim = "reporting";

        results.push({ id: code, code, dimension: dim, name: code, weight: 3 });
      }
    } else if (typeof item === "object" && item.id) {
      const full = getIndicator(item.id) || item;
      results.push(full);
    }
  }

  return results;
}

/**
 * Numeric clamp helper
 */
function clamp(num, min, max) {
  if (isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}
