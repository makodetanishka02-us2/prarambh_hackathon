/**
 * ConVerse Engine Contract: Scam Risk & Threat Radar
 * Module Owner: Radar & Intelligence Teammate
 * Foundation Interface by: Tanishka
 */

import { SAMPLE_RADAR_THREATS } from '../../data/initial-data.js';

/**
 * Radar Threat Metric
 * @typedef {Object} RadarThreat
 * @property {string} id - Threat identifier
 * @property {string} title - Threat title
 * @property {string} category - Category
 * @property {number} reportedCount - Frequency count
 * @property {"safe"|"warn"|"danger"} severity - Threat severity
 * @property {string} trend - Trend description
 * @property {string} primaryTarget - Vulnerable demographic
 */

/**
 * Retrieves current scam threat radar intelligence
 * @param {Object} [filter] - Optional category or region filter
 * @returns {Promise<Array<RadarThreat>>|Array<RadarThreat>}
 */
export function getActiveScamRadar(filter = {}) {
  // STUB CONTRACT IMPLEMENTATION (To be replaced by Radar Teammate)
  if (filter.category && filter.category !== 'all') {
    return SAMPLE_RADAR_THREATS.filter(t => t.category.toLowerCase().includes(filter.category.toLowerCase()));
  }
  return [...SAMPLE_RADAR_THREATS];
}

/**
 * Computes vulnerability score based on user interaction profile
 * @param {Object} userProfile - User vulnerability statistics
 * @returns {{ overallScore: number, level: string, topWeakness: string }}
 */
export function calculateVulnerabilityScore(userProfile = {}) {
  const score = userProfile.awarenessScore || 50;
  return {
    overallScore: score,
    level: score > 75 ? "Resilient Guardian" : score > 50 ? "Vigilant Scout" : "At Risk Learner",
    topWeakness: "Urgent SMS Phishing"
  };
}
