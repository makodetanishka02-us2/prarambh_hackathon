/**
 * ConVerse — Adaptive Difficulty Engine (adaptive.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Deterministic rule-based adaptive scenario selection and difficulty scaling.
 * DOM-independent and fully unit-testable without browser.
 */

const { PERSONA_PRIORITIES, getPrioritizedScenarios, getAdaptiveRecommendation } = require('./scenario-selector.js');

/**
 * Evaluates user simulation performance and determines adaptive recommendation.
 * 
 * Adaptive Rules:
 * 1. Initial / No history -> Priority starting scenario for user persona.
 * 2. Repeated Missed Indicators (>= 2 times) -> Targeted reinforcement with unplayed scenario testing that flag.
 * 3. Strong Performance (avgScore >= 80%) -> Advance to higher challenge level (Level 2 or 3).
 * 4. Weak Performance (avgScore < 60%) -> Reinforce with foundational / lower difficulty scenarios.
 * 5. Default Progression -> Next unplayed scenario by persona priority.
 * 6. All Scenarios Completed -> Replay lowest scoring scenario for mastery.
 * 
 * @param {Object} userProfile
 * @param {string} userProfile.persona - 'student' | 'homemaker' | 'senior citizen' | 'shopkeeper' | 'salaried employee'
 * @param {Array<Object>} userProfile.history - Array of completed simulation records
 * @param {Array<Object>|Object} allScenarios - Full scenario catalogue
 * @returns {Object} { nextScenarioId: string, reason: string, targetDifficulty: number }
 */
function evaluateAdaptiveProgression(userProfile, allScenarios) {
  return getAdaptiveRecommendation(userProfile, allScenarios);
}

/**
 * Calculates user's weakest indicator dimensions based on simulation history.
 * 
 * @param {Array<Object>} history - Array of simulation records
 * @returns {Array<{ dimension: string, missCount: number, codePrefix: string }>}
 */
function getWeakestDimensions(history = []) {
  const dimensionMisses = {
    urgency: { dimension: 'urgency', missCount: 0, codePrefix: 'U' },
    sender: { dimension: 'sender', missCount: 0, codePrefix: 'S' },
    link: { dimension: 'link', missCount: 0, codePrefix: 'L' },
    info: { dimension: 'info', missCount: 0, codePrefix: 'I' },
    emotion: { dimension: 'emotion', missCount: 0, codePrefix: 'E' },
    reporting: { dimension: 'reporting', missCount: 0, codePrefix: 'R' }
  };

  for (const record of history) {
    if (Array.isArray(record.missedIndicators)) {
      for (const tag of record.missedIndicators) {
        const prefix = tag.charAt(0).toUpperCase();
        if (prefix === 'U') dimensionMisses.urgency.missCount++;
        else if (prefix === 'S') dimensionMisses.sender.missCount++;
        else if (prefix === 'L') dimensionMisses.link.missCount++;
        else if (prefix === 'I') dimensionMisses.info.missCount++;
        else if (prefix === 'E') dimensionMisses.emotion.missCount++;
        else if (prefix === 'R') dimensionMisses.reporting.missCount++;
      }
    }
  }

  return Object.values(dimensionMisses).sort((a, b) => b.missCount - a.missCount);
}

/**
 * Generates personalized safety recommendations derived from actual mistakes.
 * 
 * @param {Array<Object>} history - Array of simulation records
 * @param {string} persona - Current user persona
 * @returns {Array<string>} List of actionable personalized recommendations
 */
function generatePersonalizedRecommendations(history = [], persona = 'student') {
  if (!history || history.length === 0) {
    return [
      'Complete your first simulation to generate tailored safety recommendations.',
      'Always remember: UPI PIN is strictly for sending money, never for receiving.'
    ];
  }

  const recommendations = [];
  const weakest = getWeakestDimensions(history);
  const missedIndicators = {};

  for (const h of history) {
    if (Array.isArray(h.missedIndicators)) {
      for (const ind of h.missedIndicators) {
        missedIndicators[ind] = (missedIndicators[ind] || 0) + 1;
      }
    }
  }

  // Check top missed specific indicators
  if (missedIndicators['I2']) {
    recommendations.push('High Vulnerability: You fell for UPI PIN / QR scan collection traps. Remember: Entering a UPI PIN ALWAYS deducts funds.');
  }
  if (missedIndicators['U1'] || missedIndicators['U2'] || missedIndicators['U3']) {
    recommendations.push('Urgency Pressure: You acted quickly under artificial countdowns. Always stop and verify independently before complying with urgent requests.');
  }
  if (missedIndicators['S2']) {
    recommendations.push('Authority Impersonation: Law enforcement (Police/CBI/Customs) never conducts "Digital Arrests" or demands funds via video calls.');
  }
  if (missedIndicators['L1'] || missedIndicators['L5']) {
    recommendations.push('Suspicious Links & APKs: Never download apps from WhatsApp links or APK downloads. Use only official app stores.');
  }
  if (missedIndicators['I5']) {
    recommendations.push('Remote Screen Sharing: Never install AnyDesk or TeamViewer at the request of an incoming caller or customer care.');
  }
  if (missedIndicators['E2']) {
    recommendations.push('High-Return Traps: Promises of guaranteed 200%+ stock returns or effortless work-from-home tasks are classic fraud schemes.');
  }

  // Dimension fallback
  if (recommendations.length === 0) {
    const topWeak = weakest.find(w => w.missCount > 0);
    if (topWeak) {
      recommendations.push(`Focus Area: Review your defenses against ${topWeak.dimension.toUpperCase()} indicators.`);
    } else {
      recommendations.push('Excellent vigilance! You have avoided all major scam traps in your recorded sessions.');
    }
  }

  return recommendations;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PERSONA_PRIORITIES,
    getPrioritizedScenarios,
    getAdaptiveRecommendation,
    evaluateAdaptiveProgression,
    getWeakestDimensions,
    generatePersonalizedRecommendations
  };
}

if (typeof window !== 'undefined') {
  window.AdaptiveEngine = {
    PERSONA_PRIORITIES,
    getPrioritizedScenarios,
    getAdaptiveRecommendation,
    evaluateAdaptiveProgression,
    getWeakestDimensions,
    generatePersonalizedRecommendations
  };
}
