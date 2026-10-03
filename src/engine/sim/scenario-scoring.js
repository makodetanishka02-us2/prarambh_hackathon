/**
 * ConVerse — Scenario Scoring Engine (scenario-scoring.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Deterministic scoring, zero-case safe calculations, and indicator tracking.
 */

/**
 * Calculates deterministic scenario score and indicator summary from simulation events.
 * 
 * @param {Array<Object>} events - Array of SimEvent objects
 * @param {Object} [scenario] - The ScenarioData object for context
 * @returns {Object} SimResult
 */
function calculateScore(events = [], scenario = null) {
  let caught = 0;
  let missed = 0;
  const recognizedSet = new Set();
  const missedSet = new Set();

  for (const ev of events) {
    if (ev.good) {
      caught++;
      if (Array.isArray(ev.tags)) {
        ev.tags.forEach(t => recognizedSet.add(t));
      }
    } else {
      missed++;
      if (Array.isArray(ev.tags)) {
        ev.tags.forEach(t => missedSet.add(t));
      }
      if (ev.timedOut) {
        missedSet.add('U1'); // Urgent countdown missed
      }
    }
  }

  const totalDecisions = caught + missed;
  
  // Safe zero-case handling (never NaN or Infinity)
  const normalizedScore = totalDecisions === 0 ? 0.0 : Math.max(0.0, Math.min(1.0, caught / totalDecisions));
  const scorePercentage = Math.round(normalizedScore * 100);

  // Verdict calculation
  let verdict = 'COMPROMISED';
  if (scorePercentage === 100 && totalDecisions > 0) {
    verdict = 'SAFE';
  } else if (scorePercentage >= 50) {
    verdict = 'VULNERABLE';
  }

  // Determine takeaway
  let takeaway = '';
  if (scenario && scenario.result) {
    if (verdict === 'SAFE') {
      takeaway = scenario.result.safeTakeaway || 'Excellent vigilance! You successfully spotted all deceptive indicators and protected your finances.';
    } else {
      takeaway = scenario.result.vulnerableTakeaway || 'Caution! Scammers exploited urgency or deception. Remember: never share credentials, scan QR codes to receive funds, or respond to unverified threats.';
    }
  } else {
    takeaway = verdict === 'SAFE'
      ? 'Great job recognizing the red flags and safeguarding your account.'
      : 'Be careful! Review the missed red flags to avoid falling for similar scams in the future.';
  }

  return {
    scenarioId: scenario ? scenario.id : 'UNKNOWN',
    caught,
    missed,
    totalDecisions,
    score: normalizedScore,
    scorePercentage,
    recognizedIndicators: Array.from(recognizedSet),
    missedIndicators: Array.from(missedSet),
    events,
    verdict,
    takeaway
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateScore
  };
}

if (typeof window !== 'undefined') {
  window.ScenarioScoring = {
    calculateScore
  };
}
