/**
 * ConVerse Engine Contract: Safety Guides & Playbooks
 * Module Owner: Safety Guides Lead
 * Foundation & UI Owner: Tanishka
 */

import { SAFETY_GUIDES_DATA, EMERGENCY_RESOURCES } from '../../data/initial-data.js';

export const SAFETY_PLAYBOOKS = SAFETY_GUIDES_DATA;

/**
 * Returns safety guides filtered by query or category
 * @param {Object} [filter]
 * @param {string} [filter.query]
 * @param {string} [filter.category]
 * @returns {Array<Object>}
 */
export function getSafetyPlaybooks(filter = {}) {
  let list = [...SAFETY_GUIDES_DATA];
  if (filter.category && filter.category !== "all") {
    list = list.filter(g => g.category === filter.category);
  }
  if (filter.query) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.whatToWatchFor.toLowerCase().includes(q) ||
      g.categoryLabel.toLowerCase().includes(q)
    );
  }
  return list;
}

/**
 * Get verified emergency helplines and reporting resources
 * @returns {Array<Object>}
 */
export function getEmergencyHelplines() {
  return [...EMERGENCY_RESOURCES];
}
