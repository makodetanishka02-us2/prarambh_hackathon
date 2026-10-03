/**
 * ConVerse — Persona Selector & Adaptive Engine (scenario-selector.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Deterministic persona-based prioritization, indicator reinforcement, and adaptive difficulty.
 */

const PERSONA_PRIORITIES = {
  'student': ['S05', 'S06', 'S08'],
  'homemaker': ['S07', 'S01', 'S10'],
  'senior citizen': ['S03', 'S04', 'S10'],
  'shopkeeper': ['S09', 'S01', 'S02'],
  'salaried employee': ['S08', 'S04', 'S03']
};

/**
 * Returns scenario IDs prioritized for a given persona.
 * 
 * @param {string} persona - 'student' | 'homemaker' | 'senior citizen' | 'shopkeeper' | 'salaried employee'
 * @param {Array<Object>|Object} allScenarios - All scenario definitions
 * @returns {Array<Object>} List of scenarios sorted by persona priority
 */
function getPrioritizedScenarios(persona, allScenarios) {
  const scenarioList = Array.isArray(allScenarios) ? allScenarios : Object.values(allScenarios || {});
  const priorities = PERSONA_PRIORITIES[persona] || [];

  const prioritized = [];
  const remaining = [];

  // First pass: add prioritized scenarios in exact priority order
  for (const pid of priorities) {
    const found = scenarioList.find(s => s.id === pid);
    if (found) {
      prioritized.push(found);
    }
  }

  // Second pass: add remaining scenarios matching persona tags
  for (const s of scenarioList) {
    if (!priorities.includes(s.id)) {
      if (Array.isArray(s.personas) && s.personas.includes(persona)) {
        prioritized.push(s);
      } else {
        remaining.push(s);
      }
    }
  }

  // Sort remaining deterministically by id
  remaining.sort((a, b) => a.id.localeCompare(b.id));

  return [...prioritized, ...remaining];
}

/**
 * Deterministically recommends the next scenario based on user simulation history and profile.
 * 
 * @param {Object} userProfile
 * @param {string} userProfile.persona - Current active persona
 * @param {Array<Object>} userProfile.history - Completed simulation results [{ scenarioId, scorePercentage, missedIndicators, verdict }]
 * @param {Array<Object>|Object} allScenarios - All scenario definitions
 * @returns {Object} { nextScenarioId: string, reason: string, targetDifficulty: number }
 */
function getAdaptiveRecommendation(userProfile = {}, allScenarios = []) {
  const scenarioList = Array.isArray(allScenarios) ? allScenarios : Object.values(allScenarios || {});
  const persona = userProfile.persona || 'student';
  const history = Array.isArray(userProfile.history) ? userProfile.history : [];

  if (scenarioList.length === 0) {
    return {
      nextScenarioId: 'S01',
      reason: 'Default starter scenario.',
      targetDifficulty: 1
    };
  }

  // 1. Initial State: No history yet -> Return top persona scenario
  if (history.length === 0) {
    const topPersona = (PERSONA_PRIORITIES[persona] && PERSONA_PRIORITIES[persona][0]) || scenarioList[0].id;
    const sObj = scenarioList.find(s => s.id === topPersona) || scenarioList[0];
    return {
      nextScenarioId: sObj.id,
      reason: `Recommended starting scenario tailored for ${persona.toUpperCase()}.`,
      targetDifficulty: sObj.difficulty || 1
    };
  }

  // 2. Count missed indicators across history
  const missedIndicatorCounts = {};
  history.forEach(h => {
    if (Array.isArray(h.missedIndicators)) {
      h.missedIndicators.forEach(ind => {
        missedIndicatorCounts[ind] = (missedIndicatorCounts[ind] || 0) + 1;
      });
    }
  });

  // Find most frequently missed indicator
  let topMissedIndicator = null;
  let maxMissCount = 0;
  for (const [ind, count] of Object.entries(missedIndicatorCounts)) {
    if (count > maxMissCount) {
      maxMissCount = count;
      topMissedIndicator = ind;
    }
  }

  // 3. Check performance metrics
  const avgScore = history.reduce((sum, h) => sum + (h.scorePercentage || 0), 0) / history.length;
  const completedIds = new Set(history.map(h => h.scenarioId));

  // If user repeatedly missed an indicator (>= 2 times), reinforce with an unplayed scenario containing that indicator
  if (topMissedIndicator && maxMissCount >= 2) {
    const candidate = scenarioList.find(s => {
      if (completedIds.has(s.id)) return false;
      // Check if any choice or red flag tests this indicator
      const hasInd = s.nodes && s.nodes.some(n => 
        (n.choices && n.choices.some(c => c.indicatorIds && c.indicatorIds.includes(topMissedIndicator))) ||
        (n.redFlags && n.redFlags.some(rf => rf.indicatorId === topMissedIndicator))
      );
      return hasInd;
    });

    if (candidate) {
      return {
        nextScenarioId: candidate.id,
        reason: `Targeted reinforcement for repeatedly missed warning indicator [${topMissedIndicator}].`,
        targetDifficulty: candidate.difficulty
      };
    }
  }

  // 4. Strong Performance (avgScore >= 80%): Move toward higher difficulty
  if (avgScore >= 80) {
    const unplayedHigh = scenarioList
      .filter(s => !completedIds.has(s.id) && s.difficulty >= 2)
      .sort((a, b) => b.difficulty - a.difficulty);

    if (unplayedHigh.length > 0) {
      return {
        nextScenarioId: unplayedHigh[0].id,
        reason: `Strong performance (${Math.round(avgScore)}% avg). Advancing to higher challenge Level ${unplayedHigh[0].difficulty}.`,
        targetDifficulty: unplayedHigh[0].difficulty
      };
    }
  }

  // 5. Weak Performance (avgScore < 60%): Reinforce with easier/foundational scenarios
  if (avgScore < 60) {
    const unplayedEasy = scenarioList
      .filter(s => !completedIds.has(s.id) && s.difficulty <= 2)
      .sort((a, b) => a.difficulty - b.difficulty);

    if (unplayedEasy.length > 0) {
      return {
        nextScenarioId: unplayedEasy[0].id,
        reason: `Reinforcing fundamental scam recognition with Level ${unplayedEasy[0].difficulty} scenario.`,
        targetDifficulty: unplayedEasy[0].difficulty
      };
    }
  }

  // 6. Default Fallback: Next unplayed scenario by persona priority
  const prioritized = getPrioritizedScenarios(persona, scenarioList);
  const nextUnplayed = prioritized.find(s => !completedIds.has(s.id));

  if (nextUnplayed) {
    return {
      nextScenarioId: nextUnplayed.id,
      reason: `Next recommended scenario for ${persona.toUpperCase()}.`,
      targetDifficulty: nextUnplayed.difficulty
    };
  }

  // All played -> Suggest lowest score scenario replay
  const sortedByScore = [...history].sort((a, b) => (a.scorePercentage || 0) - (b.scorePercentage || 0));
  const lowestScored = sortedByScore[0];

  return {
    nextScenarioId: lowestScored ? lowestScored.scenarioId : scenarioList[0].id,
    reason: `All scenarios completed! Replay lowest scoring scenario to master all scam vectors.`,
    targetDifficulty: 2
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PERSONA_PRIORITIES,
    getPrioritizedScenarios,
    getAdaptiveRecommendation
  };
}

if (typeof window !== 'undefined') {
  window.ScenarioSelector = {
    PERSONA_PRIORITIES,
    getPrioritizedScenarios,
    getAdaptiveRecommendation
  };
}
