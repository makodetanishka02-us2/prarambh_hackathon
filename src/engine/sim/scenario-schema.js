/**
 * ConVerse — Scenario Schema & Definitions (scenario-schema.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 */

const VALID_CHANNELS = ['sms', 'whatsapp', 'call', 'app', 'email'];
const VALID_PERSONAS = ['student', 'homemaker', 'senior citizen', 'shopkeeper', 'salaried employee'];
const VALID_CHOICE_TYPES = ['action', 'inspect', 'report'];

/**
 * Creates and formats a canonical RedFlagSpan object.
 */
function createRedFlagSpan(id, text, indicatorId, explanation, startIndex, endIndex) {
  return {
    id: id || `RF-${Date.now()}`,
    text: String(text || '').trim(),
    indicatorId: String(indicatorId || '').trim(),
    explanation: String(explanation || '').trim(),
    startIndex: typeof startIndex === 'number' ? startIndex : undefined,
    endIndex: typeof endIndex === 'number' ? endIndex : undefined
  };
}

/**
 * Creates and formats a canonical ScenarioChoice object.
 */
function createScenarioChoice(id, label, nextNodeId, good, indicatorIds, consequence, type = 'action') {
  return {
    id: String(id || '').trim(),
    label: String(label || '').trim(),
    nextNodeId: nextNodeId ? String(nextNodeId).trim() : null,
    good: Boolean(good),
    indicatorIds: Array.isArray(indicatorIds) ? indicatorIds.map(t => String(t).trim()) : [],
    consequence: String(consequence || '').trim(),
    type: VALID_CHOICE_TYPES.includes(type) ? type : 'action'
  };
}

/**
 * Creates and formats a canonical ScenarioNode object.
 */
function createScenarioNode(id, message, choices, options = {}) {
  return {
    id: String(id || '').trim(),
    message: String(message || '').trim(),
    channel: VALID_CHANNELS.includes(options.channel) ? options.channel : 'sms',
    sender: options.sender ? {
      name: options.sender.name || 'Unknown',
      handle: options.sender.handle || '',
      avatar: options.sender.avatar || '👤',
      verified: Boolean(options.sender.verified)
    } : undefined,
    redFlags: Array.isArray(options.redFlags) ? options.redFlags : [],
    timeLimitSeconds: typeof options.timeLimitSeconds === 'number' ? options.timeLimitSeconds : undefined,
    choices: Array.isArray(choices) ? choices : [],
    terminal: Boolean(options.terminal || (!choices || choices.length === 0))
  };
}

/**
 * Creates and formats a canonical ScenarioData object.
 */
function createScenarioData(id, title, category, difficulty, personas, summary, startNodeId, nodes, result) {
  return {
    id: String(id || '').trim(),
    title: String(title || '').trim(),
    category: String(category || '').trim(),
    difficulty: Math.max(1, Math.min(3, parseInt(difficulty, 10) || 1)),
    personas: Array.isArray(personas) ? personas : [],
    summary: String(summary || '').trim(),
    startNodeId: String(startNodeId || '').trim(),
    nodes: Array.isArray(nodes) ? nodes : [],
    result: result || {
      safeTakeaway: '',
      vulnerableTakeaway: '',
      preventionSteps: [],
      officialHelpline: '1930'
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VALID_CHANNELS,
    VALID_PERSONAS,
    VALID_CHOICE_TYPES,
    createRedFlagSpan,
    createScenarioChoice,
    createScenarioNode,
    createScenarioData
  };
}

if (typeof window !== 'undefined') {
  window.ScenarioSchema = {
    VALID_CHANNELS,
    VALID_PERSONAS,
    VALID_CHOICE_TYPES,
    createRedFlagSpan,
    createScenarioChoice,
    createScenarioNode,
    createScenarioData
  };
}
