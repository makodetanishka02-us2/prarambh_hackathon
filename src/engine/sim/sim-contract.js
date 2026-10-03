/**
 * ConVerse — Shared Simulation Contract (sim-contract.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * 
 * Defines the canonical data structures and state machine contract
 * between Scenario Engine, UI, and downstream Radar/Scanner/Progress engines.
 */

/**
 * @typedef {Object} RedFlagSpan
 * @property {string} id - Unique span identifier (e.g. 'RF-01')
 * @property {string} text - The suspicious text excerpt
 * @property {string} indicatorId - Associated Indicator ID (e.g. 'U2', 'I2')
 * @property {string} explanation - Why this text is a red flag
 * @property {number} [startIndex] - Start offset in node message
 * @property {number} [endIndex] - End offset in node message
 */

/**
 * @typedef {Object} ScenarioChoice
 * @property {string} id - Choice identifier (e.g. 'S01-N01-C01')
 * @property {string} label - Human-readable choice text
 * @property {string|null} nextNodeId - Destination node ID or null for terminal
 * @property {boolean} good - True if choice represents a safe/correct response
 * @property {string[]} indicatorIds - List of indicator flags addressed or triggered
 * @property {string} consequence - Explanation and feedback shown after selection
 * @property {'action'|'inspect'|'report'} [type] - Choice category
 */

/**
 * @typedef {Object} ScenarioNode
 * @property {string} id - Node identifier (e.g. 'S01-N01')
 * @property {string} message - Message/dialogue text shown to user
 * @property {Object} [sender] - Sender details { name, handle, avatar, verified }
 * @property {'sms'|'whatsapp'|'call'|'app'|'email'} channel - Communication channel
 * @property {RedFlagSpan[]} [redFlags] - Red flag text highlights
 * @property {number} [timeLimitSeconds] - Timeout countdown limit (seconds)
 * @property {ScenarioChoice[]} choices - Available choices for this node
 * @property {boolean} [terminal] - Whether this is an endpoint node
 */

/**
 * @typedef {Object} ScenarioData
 * @property {string} id - Scenario ID (e.g. 'S01')
 * @property {string} title - Human-readable scenario title
 * @property {string} category - Category (e.g. 'UPI Collect Scam')
 * @property {number} difficulty - Level 1 (Easy), 2 (Medium), 3 (Hard)
 * @property {string[]} personas - Personas most vulnerable to this scenario
 * @property {string} summary - Brief overview of the scenario
 * @property {string} startNodeId - Root node ID to start simulation
 * @property {ScenarioNode[]} nodes - List of branching nodes
 * @property {Object} result - Result summary and learning takeaways
 */

/**
 * @typedef {Object} SimEvent
 * @property {number} ts - Epoch timestamp
 * @property {string} scenarioId - Scenario ID
 * @property {string} nodeId - Current node ID
 * @property {string} [choiceId] - Chosen option ID (null if timeout)
 * @property {boolean} good - True if safe decision, false if fallen for scam
 * @property {string[]} tags - Indicators tagged in this step
 * @property {number} [confidence] - Optional confidence score (1-5)
 * @property {number} [ms] - Decision response time in milliseconds
 * @property {boolean} timedOut - True if step resulted from timeout
 */

/**
 * @typedef {Object} SimResult
 * @property {string} scenarioId - Completed scenario ID
 * @property {number} caught - Total correctly recognized scam indicators/safe decisions
 * @property {number} missed - Total fallen for scam indicators/unsafe decisions
 * @property {number} score - Deterministic normalized score (0.0 to 1.0)
 * @property {number} scorePercentage - Score as an integer (0 to 100)
 * @property {string[]} recognizedIndicators - List of successfully spotted indicators
 * @property {string[]} missedIndicators - List of missed indicators
 * @property {SimEvent[]} events - Full event audit trail
 * @property {'SAFE'|'VULNERABLE'|'COMPROMISED'} verdict - Summary safety verdict
 * @property {string} takeaway - Primary learning takeaway
 */

const SimContract = {
  VERSION: '1.0.0',
  VERDICTS: {
    SAFE: 'SAFE',
    VULNERABLE: 'VULNERABLE',
    COMPROMISED: 'COMPROMISED'
  },
  DEFAULT_SCORE: 0,
  MAX_DIFFICULTY: 3,
  MIN_DIFFICULTY: 1
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimContract };
}

if (typeof window !== 'undefined') {
  window.SimContract = SimContract;
}
