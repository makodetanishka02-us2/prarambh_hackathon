/**
 * ConVerse — Scenario Validator (scenario-validator.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Provides automated structural, graph reachability, and semantic validation
 * for all simulation scenarios against canonical contracts and indicator catalogue.
 */

let sharedIndicatorCatalogue = null;

function getIndicatorCatalogue() {
  if (sharedIndicatorCatalogue) return sharedIndicatorCatalogue;
  if (typeof require !== 'undefined') {
    try {
      const initData = require('../../data/initial-data.js');
      sharedIndicatorCatalogue = initData.INDICATOR_CATALOGUE;
      return sharedIndicatorCatalogue;
    } catch (e) {
      // fallback
    }
  }
  if (typeof window !== 'undefined' && window.ConVerseData && window.ConVerseData.INDICATOR_CATALOGUE) {
    sharedIndicatorCatalogue = window.ConVerseData.INDICATOR_CATALOGUE;
    return sharedIndicatorCatalogue;
  }
  return {};
}

/**
 * Validates a single ScenarioData object.
 * Returns { valid: boolean, errors: Array<{ code: string, scenarioId: string, nodeId?: string, choiceId?: string, message: string }> }
 */
function validateScenario(scenario, options = {}) {
  const errors = [];
  const catalogue = options.catalogue || getIndicatorCatalogue();

  if (!scenario || typeof scenario !== 'object') {
    return {
      valid: false,
      errors: [{
        code: 'INVALID_PAYLOAD',
        message: 'Scenario payload must be a non-null object'
      }]
    };
  }

  const scenarioId = scenario.id;

  // 1. Required Scenario Fields
  if (!scenarioId || typeof scenarioId !== 'string' || !scenarioId.trim()) {
    errors.push({
      code: 'MISSING_SCENARIO_ID',
      message: 'Scenario is missing a valid non-empty "id"'
    });
  }

  if (!scenario.title || typeof scenario.title !== 'string') {
    errors.push({
      code: 'MISSING_TITLE',
      scenarioId,
      message: 'Scenario is missing a valid "title"'
    });
  }

  if (!scenario.category || typeof scenario.category !== 'string') {
    errors.push({
      code: 'MISSING_CATEGORY',
      scenarioId,
      message: 'Scenario is missing a valid "category"'
    });
  }

  if (typeof scenario.difficulty !== 'number' || scenario.difficulty < 1 || scenario.difficulty > 3) {
    errors.push({
      code: 'INVALID_DIFFICULTY',
      scenarioId,
      message: 'Scenario difficulty must be an integer between 1 and 3'
    });
  }

  if (!Array.isArray(scenario.personas) || scenario.personas.length === 0) {
    errors.push({
      code: 'MISSING_PERSONAS',
      scenarioId,
      message: 'Scenario must specify at least one target persona in "personas" array'
    });
  }

  if (!scenario.summary || typeof scenario.summary !== 'string') {
    errors.push({
      code: 'MISSING_SUMMARY',
      scenarioId,
      message: 'Scenario is missing a valid "summary"'
    });
  }

  if (!scenario.startNodeId || typeof scenario.startNodeId !== 'string') {
    errors.push({
      code: 'MISSING_START_NODE_ID',
      scenarioId,
      message: 'Scenario is missing a valid "startNodeId"'
    });
  }

  if (!Array.isArray(scenario.nodes) || scenario.nodes.length === 0) {
    errors.push({
      code: 'MISSING_NODES',
      scenarioId,
      message: 'Scenario "nodes" must be a non-empty array'
    });
    return { valid: errors.length === 0, errors };
  }

  // 2. Node IDs, Duplicates, and Graph Indexing
  const nodeMap = new Map();
  const duplicateNodeIds = new Set();

  for (const node of scenario.nodes) {
    if (!node || typeof node !== 'object') {
      errors.push({
        code: 'INVALID_NODE_OBJECT',
        scenarioId,
        message: 'A node entry in nodes array is not an object'
      });
      continue;
    }

    if (!node.id || typeof node.id !== 'string') {
      errors.push({
        code: 'MISSING_NODE_ID',
        scenarioId,
        message: 'A node is missing a valid "id"'
      });
      continue;
    }

    if (nodeMap.has(node.id)) {
      duplicateNodeIds.add(node.id);
      errors.push({
        code: 'DUPLICATE_NODE_ID',
        scenarioId,
        nodeId: node.id,
        message: `Duplicate node ID detected: "${node.id}"`
      });
    } else {
      nodeMap.set(node.id, node);
    }
  }

  // Check startNodeId exists in nodeMap
  if (scenario.startNodeId && !nodeMap.has(scenario.startNodeId)) {
    errors.push({
      code: 'START_NODE_NOT_FOUND',
      scenarioId,
      nodeId: scenario.startNodeId,
      message: `startNodeId "${scenario.startNodeId}" does not exist in nodes list`
    });
  }

  // 3. Node-level, Choice-level, and Red-Flag validation
  const referencedNodeIds = new Set();
  const choiceIdSet = new Set();

  for (const [nodeId, node] of nodeMap.entries()) {
    if (!node.message || typeof node.message !== 'string') {
      errors.push({
        code: 'MISSING_NODE_MESSAGE',
        scenarioId,
        nodeId,
        message: `Node "${nodeId}" message is missing or empty`
      });
    }

    // Red-flag Spans
    if (node.redFlags) {
      if (!Array.isArray(node.redFlags)) {
        errors.push({
          code: 'MALFORMED_RED_FLAGS',
          scenarioId,
          nodeId,
          message: `Node "${nodeId}" redFlags must be an array`
        });
      } else {
        for (const rf of node.redFlags) {
          if (!rf.text || typeof rf.text !== 'string') {
            errors.push({
              code: 'MALFORMED_RED_FLAG_TEXT',
              scenarioId,
              nodeId,
              message: `Red flag in node "${nodeId}" is missing text`
            });
          } else if (node.message && !node.message.includes(rf.text)) {
            errors.push({
              code: 'RED_FLAG_TEXT_MISMATCH',
              scenarioId,
              nodeId,
              message: `Red flag text "${rf.text}" does not appear in node "${nodeId}" message`
            });
          }

          if (!rf.indicatorId || (catalogue && Object.keys(catalogue).length > 0 && !catalogue[rf.indicatorId])) {
            errors.push({
              code: 'INVALID_INDICATOR_ID',
              scenarioId,
              nodeId,
              message: `Red flag in node "${nodeId}" references unknown indicator ID "${rf.indicatorId}"`
            });
          }

          if (!rf.explanation || typeof rf.explanation !== 'string') {
            errors.push({
              code: 'MALFORMED_RED_FLAG_EXPLANATION',
              scenarioId,
              nodeId,
              message: `Red flag in node "${nodeId}" is missing an explanation`
            });
          }
        }
      }
    }

    // Choices Validation
    if (!node.terminal) {
      if (!Array.isArray(node.choices) || node.choices.length === 0) {
        errors.push({
          code: 'DEAD_END_NODE',
          scenarioId,
          nodeId,
          message: `Non-terminal node "${nodeId}" has no choices`
        });
      } else {
        for (const choice of node.choices) {
          if (!choice.id || typeof choice.id !== 'string') {
            errors.push({
              code: 'MISSING_CHOICE_ID',
              scenarioId,
              nodeId,
              message: `Choice in node "${nodeId}" is missing "id"`
            });
            continue;
          }

          if (choiceIdSet.has(choice.id)) {
            errors.push({
              code: 'DUPLICATE_CHOICE_ID',
              scenarioId,
              nodeId,
              choiceId: choice.id,
              message: `Duplicate choice ID "${choice.id}" in node "${nodeId}"`
            });
          } else {
            choiceIdSet.add(choice.id);
          }

          if (!choice.label || typeof choice.label !== 'string') {
            errors.push({
              code: 'MISSING_CHOICE_LABEL',
              scenarioId,
              nodeId,
              choiceId: choice.id,
              message: `Choice "${choice.id}" is missing a label`
            });
          }

          if (typeof choice.good !== 'boolean') {
            errors.push({
              code: 'MISSING_CHOICE_EVALUATION',
              scenarioId,
              nodeId,
              choiceId: choice.id,
              message: `Choice "${choice.id}" must specify boolean "good"`
            });
          }

          // Indicator tags
          if (!Array.isArray(choice.indicatorIds) || choice.indicatorIds.length === 0) {
            errors.push({
              code: 'MISSING_CHOICE_INDICATORS',
              scenarioId,
              nodeId,
              choiceId: choice.id,
              message: `Choice "${choice.id}" must specify at least one indicatorId tag`
            });
          } else {
            for (const tag of choice.indicatorIds) {
              if (catalogue && Object.keys(catalogue).length > 0 && !catalogue[tag]) {
                errors.push({
                  code: 'INVALID_INDICATOR_ID',
                  scenarioId,
                  nodeId,
                  choiceId: choice.id,
                  message: `Choice "${choice.id}" references unknown indicator ID "${tag}"`
                });
              }
            }
          }

          // nextNodeId reference check
          if (choice.nextNodeId !== null && typeof choice.nextNodeId !== 'undefined') {
            referencedNodeIds.add(choice.nextNodeId);
            if (!nodeMap.has(choice.nextNodeId)) {
              errors.push({
                code: 'INVALID_NEXT_NODE_REF',
                scenarioId,
                nodeId,
                choiceId: choice.id,
                message: `Choice "${choice.id}" references non-existent nextNodeId "${choice.nextNodeId}"`
              });
            }
          }
        }
      }
    }
  }

  // 4. Graph Reachability (DFS from startNodeId)
  if (scenario.startNodeId && nodeMap.has(scenario.startNodeId)) {
    const visited = new Set();
    const stack = [scenario.startNodeId];

    while (stack.length > 0) {
      const currentId = stack.pop();
      if (!visited.has(currentId)) {
        visited.add(currentId);
        const node = nodeMap.get(currentId);
        if (node && Array.isArray(node.choices)) {
          for (const choice of node.choices) {
            if (choice.nextNodeId && nodeMap.has(choice.nextNodeId)) {
              stack.push(choice.nextNodeId);
            }
          }
        }
      }
    }

    // Detect Unreachable Nodes
    for (const nodeId of nodeMap.keys()) {
      if (!visited.has(nodeId)) {
        errors.push({
          code: 'UNREACHABLE_NODE',
          scenarioId,
          nodeId,
          message: `Node "${nodeId}" cannot be reached from startNodeId "${scenario.startNodeId}"`
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates a list or map of scenarios for global uniqueness and graph integrity.
 */
function validateAllScenarios(scenariosListOrMap, options = {}) {
  const list = Array.isArray(scenariosListOrMap) 
    ? scenariosListOrMap 
    : Object.values(scenariosListOrMap || {});

  const allErrors = [];
  const seenScenarioIds = new Set();

  for (const s of list) {
    if (s && s.id) {
      if (seenScenarioIds.has(s.id)) {
        allErrors.push({
          code: 'DUPLICATE_SCENARIO_ID',
          scenarioId: s.id,
          message: `Duplicate scenario ID "${s.id}" detected across scenario dataset`
        });
      } else {
        seenScenarioIds.add(s.id);
      }
    }

    const singleResult = validateScenario(s, options);
    if (!singleResult.valid) {
      allErrors.push(...singleResult.errors);
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateScenario,
    validateAllScenarios
  };
}

if (typeof window !== 'undefined') {
  window.ScenarioValidator = {
    validateScenario,
    validateAllScenarios
  };
}
