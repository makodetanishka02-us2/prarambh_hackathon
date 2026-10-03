/**
 * ConVerse — Scenario Engine State Machine (scenario-engine.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Deterministic scenario execution state machine.
 * Completely independent of DOM state.
 */

let sharedScenarios = null;
let scoringEngine = null;

function getScenariosMap() {
  if (sharedScenarios) return sharedScenarios;
  if (typeof require !== 'undefined') {
    try {
      const data = require('./scenario-data.js');
      sharedScenarios = data.SCENARIOS;
      return sharedScenarios;
    } catch (e) {
      // fallback
    }
  }
  if (typeof window !== 'undefined' && window.ConVerseScenarios) {
    sharedScenarios = window.ConVerseScenarios;
    return sharedScenarios;
  }
  return {};
}

function getScoring() {
  if (scoringEngine) return scoringEngine;
  if (typeof require !== 'undefined') {
    try {
      scoringEngine = require('./scenario-scoring.js');
      return scoringEngine;
    } catch (e) {
      // fallback
    }
  }
  if (typeof window !== 'undefined' && window.ScenarioScoring) {
    scoringEngine = window.ScenarioScoring;
    return scoringEngine;
  }
  return { calculateScore: () => ({ score: 0, scorePercentage: 0, caught: 0, missed: 0, events: [] }) };
}

class ScenarioEngine {
  constructor(options = {}) {
    this.customScenarios = options.scenarios || null;
    this.scenario = null;
    this.currentNode = null;
    this.events = [];
    this.complete = false;
    this.nodeMap = new Map();
    this.startedAt = 0;
  }

  getScenarios() {
    return this.customScenarios || getScenariosMap();
  }

  /**
   * Initializes and starts a scenario by ID.
   * @param {string} scenarioId 
   * @param {Object} [options]
   * @returns {Object} Starting ScenarioNode
   */
  startScenario(scenarioId, options = {}) {
    const all = this.getScenarios();
    const scenario = all[scenarioId];
    if (!scenario) {
      throw new Error(`Scenario not found: "${scenarioId}"`);
    }

    this.scenario = scenario;
    this.events = [];
    this.complete = false;
    this.startedAt = Date.now();
    this.nodeMap.clear();

    for (const node of scenario.nodes || []) {
      this.nodeMap.set(node.id, node);
    }

    const startNode = this.nodeMap.get(scenario.startNodeId);
    if (!startNode) {
      throw new Error(`Start node "${scenario.startNodeId}" not found in scenario "${scenarioId}"`);
    }

    this.currentNode = startNode;
    return this.currentNode;
  }

  /**
   * Returns current active node.
   * @returns {Object|null}
   */
  getCurrentNode() {
    return this.currentNode;
  }

  /**
   * Returns choices available for the current node.
   * @returns {Array<Object>}
   */
  getAvailableChoices() {
    if (!this.currentNode || !Array.isArray(this.currentNode.choices)) {
      return [];
    }
    return this.currentNode.choices;
  }

  /**
   * Executes a user choice, tracks decision evaluation, and transitions state machine.
   * 
   * @param {string} choiceId 
   * @param {Object} [metadata] { confidence, ms }
   * @returns {Object} { nextNode: Object|null, choice: Object, isComplete: boolean }
   */
  choose(choiceId, metadata = {}) {
    if (!this.currentNode) {
      throw new Error('Cannot make a choice: No active scenario node');
    }

    if (this.complete) {
      throw new Error('Cannot make a choice: Scenario already completed');
    }

    const choice = (this.currentNode.choices || []).find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Choice "${choiceId}" is not valid for current node "${this.currentNode.id}"`);
    }

    const simEvent = {
      ts: Date.now(),
      scenarioId: this.scenario.id,
      nodeId: this.currentNode.id,
      choiceId: choice.id,
      good: choice.good,
      tags: choice.indicatorIds || [],
      confidence: typeof metadata.confidence === 'number' ? metadata.confidence : undefined,
      ms: typeof metadata.ms === 'number' ? metadata.ms : undefined,
      timedOut: false
    };

    this.recordEvent(simEvent);

    // Transition to next node or complete
    if (choice.nextNodeId && this.nodeMap.has(choice.nextNodeId)) {
      this.currentNode = this.nodeMap.get(choice.nextNodeId);
      if (this.currentNode.terminal || !this.currentNode.choices || this.currentNode.choices.length === 0) {
        this.complete = true;
      }
    } else {
      this.complete = true;
      this.currentNode = null;
    }

    return {
      nextNode: this.currentNode,
      choice,
      isComplete: this.complete
    };
  }

  /**
   * Handles timeout on time-limited nodes.
   * @returns {Object} { nextNode: Object|null, isComplete: boolean }
   */
  handleTimeout() {
    if (!this.currentNode || this.complete) {
      return { nextNode: null, isComplete: this.complete };
    }

    const simEvent = {
      ts: Date.now(),
      scenarioId: this.scenario ? this.scenario.id : 'UNKNOWN',
      nodeId: this.currentNode.id,
      choiceId: null,
      good: false,
      tags: ['U1'], // Urgency countdown missed
      timedOut: true
    };

    this.recordEvent(simEvent);

    // Default fallback: pick first choice or complete
    const choices = this.currentNode.choices || [];
    if (choices.length > 0 && choices[0].nextNodeId && this.nodeMap.has(choices[0].nextNodeId)) {
      this.currentNode = this.nodeMap.get(choices[0].nextNodeId);
      if (this.currentNode.terminal || !this.currentNode.choices || this.currentNode.choices.length === 0) {
        this.complete = true;
      }
    } else {
      this.complete = true;
      this.currentNode = null;
    }

    return {
      nextNode: this.currentNode,
      isComplete: this.complete
    };
  }

  /**
   * Records a simulation event.
   * @param {Object} event 
   */
  recordEvent(event) {
    this.events.push(event);
  }

  /**
   * Returns true if current scenario has reached a terminal state.
   * @returns {boolean}
   */
  isComplete() {
    return this.complete;
  }

  /**
   * Computes deterministic final result summary.
   * @returns {Object} SimResult
   */
  getResult() {
    const scoring = getScoring();
    return scoring.calculateScore(this.events, this.scenario);
  }

  /**
   * Returns complete event audit trail.
   * @returns {Array<Object>}
   */
  getHistory() {
    return [...this.events];
  }

  /**
   * Resets the engine state.
   */
  reset() {
    this.scenario = null;
    this.currentNode = null;
    this.events = [];
    this.complete = false;
    this.nodeMap.clear();
    this.startedAt = 0;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ScenarioEngine
  };
}

if (typeof window !== 'undefined') {
  window.ScenarioEngine = ScenarioEngine;
}
