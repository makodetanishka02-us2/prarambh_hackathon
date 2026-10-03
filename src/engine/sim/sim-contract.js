/**
 * ConVerse Engine Contract: Scam Simulation & Sandbox Execution
 * Module Owner: Simulation Engine Teammate
 * Foundation Interface by: Tanishka
 */

import { SAMPLE_SCENARIOS } from '../../data/initial-data.js';

/**
 * Scenario Step Definition
 * @typedef {Object} ScenarioStep
 * @property {string} stepId - Unique step ID
 * @property {string} sender - Simulated sender/caller name
 * @property {string} message - Dialogue / SMS / Prompt
 * @property {Array<{id: string, text: string, isSafe: boolean, feedback: string}>} choices
 */

/**
 * Get all available scenario definitions
 * @param {string} [category="all"]
 * @returns {Array<Object>}
 */
export function getAvailableScenarios(category = "all") {
  if (category && category !== "all") {
    return SAMPLE_SCENARIOS.filter(s => s.categoryId === category);
  }
  return [...SAMPLE_SCENARIOS];
}

/**
 * Loads a scenario by ID
 * @param {string} scenarioId
 * @returns {Object|null}
 */
export function loadScenario(scenarioId) {
  return SAMPLE_SCENARIOS.find(s => s.id === scenarioId) || null;
}

/**
 * Evaluates a user decision within a simulation step
 * @param {string} scenarioId
 * @param {string} choiceId
 * @returns {{ isCorrect: boolean, feedback: string, scoreAwarded: number, nextStepId: string|null }}
 */
export function evaluateStepChoice(scenarioId, choiceId) {
  // STUB CONTRACT IMPLEMENTATION (To be replaced by Simulation Teammate)
  return {
    isCorrect: true,
    feedback: "Excellent! You spotted the suspicious link and refused to click.",
    scoreAwarded: 25,
    nextStepId: null
  };
}
