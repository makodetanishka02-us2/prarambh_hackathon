/**
 * ConVerse Engine Contract: Scam Risk & Threat Radar
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Radar & Intelligence Engine Owner: Ananya
 * Foundation Interface originally by: Tanishka
 *
 * Full API surface for Threat Radar & Awareness Score Engine.
 */

import { SAMPLE_RADAR_THREATS } from '../../data/initial-data.js';
import { SIX_DIMENSIONS, INDICATOR_CATALOGUE, getIndicator, getIndicatorsByDimension } from '../../data/indicators.js';
import {
  createInitialRadarState,
  createInitialAwarenessState,
  createEmptyThreatState,
  calculateThreat,
  calculateDimensionThreat,
  calculateOverallThreat,
  updateAwareness,
  updateDimensionAwareness,
  getAwarenessScore,
  getAwarenessBand,
  getWeakestDimensions,
  getConfidenceMultiplier,
  DIMENSION_KEYS,
  BASELINE_AWARENESS
} from './radar-engine.js';
import {
  initRadarState,
  getRadarState,
  handleRadarEvent,
  emitRadarEvent,
  subscribeToRadar,
  resetRadarState,
  persistRadarState,
  restoreRadarState,
  sanitizeRadarState,
  RADAR_STORAGE_KEY
} from './radar-state.js';
import { RADAR_EVENTS, ACTION_TO_REPORTING_MAP, resolveReportingIndicator } from './radar-events.js';

// ============================================================================
// Core Radar & Awareness Engine Public Exports
// ============================================================================

export {
  // Dimension & Indicator Definitions
  SIX_DIMENSIONS,
  INDICATOR_CATALOGUE,
  DIMENSION_KEYS,
  BASELINE_AWARENESS,
  getIndicator,
  getIndicatorsByDimension,

  // Threat & Awareness Calculations
  createInitialRadarState,
  createInitialAwarenessState,
  createEmptyThreatState,
  calculateThreat,
  calculateDimensionThreat,
  calculateOverallThreat,
  updateAwareness,
  updateDimensionAwareness,
  getAwarenessScore,
  getAwarenessBand,
  getWeakestDimensions,
  getConfidenceMultiplier,

  // State Management & Event Handling
  initRadarState,
  getRadarState,
  handleRadarEvent,
  emitRadarEvent,
  subscribeToRadar,
  resetRadarState,
  persistRadarState,
  restoreRadarState,
  sanitizeRadarState,
  RADAR_STORAGE_KEY,

  // Events & Mappings
  RADAR_EVENTS,
  ACTION_TO_REPORTING_MAP,
  resolveReportingIndicator
};

// ============================================================================
// Backwards Compatibility Contracts
// ============================================================================

/**
 * Retrieves current scam threat radar intelligence
 * @param {Object} [filter] - Optional category or region filter
 * @returns {Array<Object>}
 */
export function getActiveScamRadar(filter = {}) {
  if (filter.category && filter.category !== 'all') {
    return SAMPLE_RADAR_THREATS.filter(t => t.category.toLowerCase().includes(filter.category.toLowerCase()));
  }
  return [...SAMPLE_RADAR_THREATS];
}

/**
 * Computes vulnerability score and level based on user awareness profile
 * @param {Object} userProfile - User vulnerability statistics
 * @returns {{ overallScore: number, level: string, topWeakness: string, band: Object, weakest: Array<Object> }}
 */
export function calculateVulnerabilityScore(userProfile = {}) {
  const radarState = getRadarState();
  const awareness = userProfile.awareness || radarState.awareness;
  const score = typeof userProfile.awarenessScore === 'number'
    ? userProfile.awarenessScore
    : getAwarenessScore(awareness);

  const band = getAwarenessBand(score);
  const weakestList = getWeakestDimensions(awareness, 2);
  const topWeakness = weakestList.length > 0 ? weakestList[0].name : "Link & URL Checking";

  let level = "At Risk Learner";
  if (score >= 70) {
    level = "Resilient Guardian";
  } else if (score >= 40) {
    level = "Vigilant Scout";
  }

  return {
    overallScore: score,
    level,
    topWeakness,
    band,
    weakest: weakestList
  };
}
