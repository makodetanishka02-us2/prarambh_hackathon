/**
 * ConVerse Engine Contract: Scam Detection & Indicator Analysis
 * Module Owner: Scam Detection Teammate
 * Foundation Interface by: Tanishka
 *
 * Teammates implementing this engine should export functions conforming
 * to these interfaces without altering core DOM/styling architecture.
 */

/**
 * Result structure returned by detectScamIndicators()
 * @typedef {Object} ScamDetectionResult
 * @property {string} text - Original input text analyzed
 * @property {"safe"|"warn"|"danger"} riskLevel - Computed risk severity
 * @property {number} confidenceScore - Score from 0 to 100
 * @property {Array<{id: string, name: string, description: string, severity: "safe"|"warn"|"danger"}>} matchedIndicators - Flags found
 * @property {string} explanation - Human readable summary in active language
 * @property {Array<string>} recommendedActions - Bulleted safety advice
 */

/**
 * Analyzes input text/content for financial scam indicators
 * @param {string} rawText - Text or message to scan
 * @param {Object} [options] - Configuration options
 * @param {string} [options.language="en"] - Active language code
 * @returns {Promise<ScamDetectionResult>|ScamDetectionResult}
 */
export function detectScamIndicators(rawText, options = {}) {
  // STUB CONTRACT IMPLEMENTATION (To be replaced by Scam Detection Teammate)
  const trimmed = (rawText || "").trim();
  if (!trimmed) {
    return {
      text: "",
      riskLevel: "safe",
      confidenceScore: 0,
      matchedIndicators: [],
      explanation: "Please enter text to analyze.",
      recommendedActions: []
    };
  }

  const isUpiorPin = /pin|upi|qr|refund|kyc|block|disconnect|urgent|lottery|winner|telegram/i.test(trimmed);

  return {
    text: trimmed,
    riskLevel: isUpiorPin ? "danger" : "safe",
    confidenceScore: isUpiorPin ? 88 : 12,
    matchedIndicators: isUpiorPin
      ? [
          { id: "ind-urgency", name: "Artificial Urgency", description: "Creates panic or tight deadline", severity: "warn" },
          { id: "ind-credential", name: "PIN / Credential Solicitation", description: "Asks for secret authentication", severity: "danger" }
        ]
      : [],
    explanation: isUpiorPin
      ? "High risk detected: Message contains patterns characteristic of financial phishing."
      : "No common scam keywords detected in this sample.",
    recommendedActions: isUpiorPin
      ? [
          "Never enter your UPI PIN to receive money.",
          "Do not click links sent from unknown numbers.",
          "Verify the bill or message on the official service app directly."
        ]
      : ["Stay vigilant and never share OTPs with anyone."]
  };
}
