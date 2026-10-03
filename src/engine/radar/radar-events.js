/**
 * ConVerse Radar Event System & Dispatcher
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Radar & Intelligence Engine Owner: Ananya
 *
 * Centralized, framework-independent event dispatcher.
 * Handles:
 * 1. scan:completed
 * 2. scan:deepcheck
 * 3. scan:challenge_answered
 * 4. action:taken
 * 5. sim:choice_made
 * 6. test:completed
 */

export const RADAR_EVENTS = {
  SCAN_COMPLETED: "scan:completed",
  SCAN_DEEPCHECK: "scan:deepcheck",
  SCAN_CHALLENGE_ANSWERED: "scan:challenge_answered",
  ACTION_TAKEN: "action:taken",
  SIM_CHOICE_MADE: "sim:choice_made",
  TEST_COMPLETED: "test:completed",
  RADAR_RESET: "radar:reset"
};

/**
 * Action string to Reporting indicator mapping
 */
export const ACTION_TO_REPORTING_MAP = {
  verify: "R1",
  "verified with bank": "R1",
  "verify with bank": "R1",
  "independent verification": "R1",
  block: "R2",
  "blocked sender": "R2",
  "block number": "R2",
  report: "R3",
  "reported to 1930": "R3",
  "1930": "R3",
  "cybercrime portal": "R3",
  tell_family: "R4",
  "told family": "R4",
  "informed family": "R4"
};

/**
 * Resolves action name to reporting indicator ID (R1-R4)
 * @param {string} action
 * @returns {string} Indicator ID ('R1' - 'R4')
 */
export function resolveReportingIndicator(action) {
  if (!action) return "R1";
  const normalized = String(action).toLowerCase().trim();
  return ACTION_TO_REPORTING_MAP[normalized] || "R1";
}
