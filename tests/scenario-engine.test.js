/**
 * ConVerse — Scenario Engine Comprehensive Test Suite
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 */

const { ScenarioEngine } = require('../src/engine/sim/scenario-engine.js');
const { validateScenario, validateAllScenarios } = require('../src/engine/sim/scenario-validator.js');
const { calculateScore } = require('../src/engine/sim/scenario-scoring.js');
const { getPrioritizedScenarios, getAdaptiveRecommendation, PERSONA_PRIORITIES } = require('../src/engine/sim/scenario-selector.js');
const { SCENARIOS } = require('../src/engine/sim/scenario-data.js');
const { INDICATOR_CATALOGUE } = require('../src/data/initial-data.js');

describe('Scenario Schema & Structural Validation', () => {
  it('should accept a structurally valid scenario', () => {
    const valid = {
      id: 'TEST-01',
      title: 'Test Scenario',
      category: 'Test Category',
      difficulty: 1,
      personas: ['student'],
      summary: 'A test summary',
      startNodeId: 'TEST-N01',
      nodes: [
        {
          id: 'TEST-N01',
          channel: 'sms',
          message: 'Hello verify your OTP 1234',
          choices: [
            {
              id: 'TEST-C01',
              label: 'Reject OTP request',
              nextNodeId: null,
              good: true,
              indicatorIds: ['I1'],
              consequence: 'Good decision'
            }
          ]
        }
      ],
      result: { safeTakeaway: 'Safe', vulnerableTakeaway: 'Vulnerable' }
    };

    const res = validateScenario(valid);
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
  });

  it('should reject a scenario missing required fields', () => {
    const invalid = {
      title: 'Missing ID and nodes'
    };

    const res = validateScenario(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
    const codes = res.errors.map(e => e.code);
    expect(codes).toContain('MISSING_SCENARIO_ID');
    expect(codes).toContain('MISSING_NODES');
  });

  it('should reject invalid difficulty out of bounds', () => {
    const invalid = {
      id: 'DIFF-TEST',
      title: 'Bad Difficulty',
      category: 'Test',
      difficulty: 5, // invalid (must be 1-3)
      personas: ['student'],
      summary: 'Test',
      startNodeId: 'N1',
      nodes: [{ id: 'N1', message: 'Hi', terminal: true, choices: [] }]
    };

    const res = validateScenario(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.map(e => e.code)).toContain('INVALID_DIFFICULTY');
  });
});

describe('Graph Reachability & Node Reference Validation', () => {
  it('should detect startNodeId pointing to a non-existent node', () => {
    const broken = {
      id: 'BROKEN-01',
      title: 'Broken Start Node',
      category: 'Test',
      difficulty: 1,
      personas: ['student'],
      summary: 'Test',
      startNodeId: 'NON_EXISTENT',
      nodes: [{ id: 'N01', message: 'Hi', terminal: true, choices: [] }]
    };

    const res = validateScenario(broken);
    expect(res.valid).toBe(false);
    expect(res.errors.map(e => e.code)).toContain('START_NODE_NOT_FOUND');
  });

  it('should detect choices pointing to invalid nextNodeId', () => {
    const broken = {
      id: 'BROKEN-02',
      title: 'Broken Choice Ref',
      category: 'Test',
      difficulty: 1,
      personas: ['student'],
      summary: 'Test',
      startNodeId: 'N01',
      nodes: [
        {
          id: 'N01',
          message: 'Hi',
          choices: [
            {
              id: 'C01',
              label: 'Click me',
              nextNodeId: 'GHOST_NODE',
              good: true,
              indicatorIds: ['I2'],
              consequence: 'test'
            }
          ]
        }
      ]
    };

    const res = validateScenario(broken);
    expect(res.valid).toBe(false);
    expect(res.errors.map(e => e.code)).toContain('INVALID_NEXT_NODE_REF');
  });

  it('should detect unreachable disconnected nodes', () => {
    const broken = {
      id: 'BROKEN-03',
      title: 'Unreachable Node',
      category: 'Test',
      difficulty: 1,
      personas: ['student'],
      summary: 'Test',
      startNodeId: 'N01',
      nodes: [
        {
          id: 'N01',
          message: 'First node',
          terminal: true,
          choices: []
        },
        {
          id: 'N_ORPHAN',
          message: 'Isolated orphan node',
          terminal: true,
          choices: []
        }
      ]
    };

    const res = validateScenario(broken);
    expect(res.valid).toBe(false);
    expect(res.errors.map(e => e.code)).toContain('UNREACHABLE_NODE');
  });

  it('should detect duplicate node IDs and choice IDs', () => {
    const broken = {
      id: 'BROKEN-04',
      title: 'Duplicate IDs',
      category: 'Test',
      difficulty: 1,
      personas: ['student'],
      summary: 'Test',
      startNodeId: 'N01',
      nodes: [
        {
          id: 'N01',
          message: 'Message 1',
          choices: [
            { id: 'C_DUP', label: 'C1', nextNodeId: null, good: true, indicatorIds: ['I1'], consequence: '' },
            { id: 'C_DUP', label: 'C2', nextNodeId: null, good: false, indicatorIds: ['I1'], consequence: '' }
          ]
        },
        {
          id: 'N01', // duplicate node ID
          message: 'Message 2',
          terminal: true,
          choices: []
        }
      ]
    };

    const res = validateScenario(broken);
    expect(res.valid).toBe(false);
    const codes = res.errors.map(e => e.code);
    expect(codes).toContain('DUPLICATE_NODE_ID');
    expect(codes).toContain('DUPLICATE_CHOICE_ID');
  });
});

describe('Indicator & Red-Flag Validation', () => {
  it('should reject invalid indicator IDs not in catalogue', () => {
    const invalidIndicator = {
      id: 'BAD-IND',
      title: 'Bad Indicator',
      category: 'Test',
      difficulty: 1,
      personas: ['student'],
      summary: 'Test',
      startNodeId: 'N1',
      nodes: [
        {
          id: 'N1',
          message: 'Fake message',
          choices: [
            {
              id: 'C1',
              label: 'Choice',
              nextNodeId: null,
              good: true,
              indicatorIds: ['INVALID_FLAG_999'],
              consequence: 'test'
            }
          ]
        }
      ]
    };

    const res = validateScenario(invalidIndicator);
    expect(res.valid).toBe(false);
    expect(res.errors.map(e => e.code)).toContain('INVALID_INDICATOR_ID');
  });

  it('should detect red-flag spans whose text is not in message', () => {
    const mismatchedSpan = {
      id: 'BAD-SPAN',
      title: 'Mismatched Span',
      category: 'Test',
      difficulty: 1,
      personas: ['student'],
      summary: 'Test',
      startNodeId: 'N1',
      nodes: [
        {
          id: 'N1',
          message: 'This is a peaceful message from your school.',
          redFlags: [
            {
              id: 'RF-1',
              text: 'Threat of arrest in 10 minutes', // Not in message
              indicatorId: 'U4',
              explanation: 'Urgency flag'
            }
          ],
          terminal: true,
          choices: []
        }
      ]
    };

    const res = validateScenario(mismatchedSpan);
    expect(res.valid).toBe(false);
    expect(res.errors.map(e => e.code)).toContain('RED_FLAG_TEXT_MISMATCH');
  });
});

describe('Scenario Engine State Machine & Execution', () => {
  it('should start scenario and return initial start node', () => {
    const engine = new ScenarioEngine({ scenarios: SCENARIOS });
    const startNode = engine.startScenario('S01');

    expect(startNode).toBeDefined();
    expect(startNode.id).toBe('S01-N01');
    expect(engine.getCurrentNode().id).toBe('S01-N01');
    expect(engine.isComplete()).toBe(false);
  });

  it('should return available choices and advance on valid choice', () => {
    const engine = new ScenarioEngine({ scenarios: SCENARIOS });
    engine.startScenario('S01');

    const choices = engine.getAvailableChoices();
    expect(choices.length).toBe(2);
    expect(choices[0].id).toBe('S01-N01-C01');

    // Make safe choice
    const outcome = engine.choose('S01-N01-C01', { ms: 800 });
    expect(outcome.choice.good).toBe(true);
    expect(outcome.nextNode.id).toBe('S01-N02');
    expect(engine.isComplete()).toBe(false);

    // Make second safe choice
    const outcome2 = engine.choose('S01-N02-C01', { ms: 600 });
    expect(outcome2.choice.good).toBe(true);
    expect(outcome2.nextNode.id).toBe('S01-N04');
    expect(outcome2.isComplete).toBe(true);
    expect(engine.isComplete()).toBe(true);
  });

  it('should reject invalid choice IDs with error', () => {
    const engine = new ScenarioEngine({ scenarios: SCENARIOS });
    engine.startScenario('S01');

    let threw = false;
    try {
      engine.choose('NON_EXISTENT_CHOICE');
    } catch (e) {
      threw = true;
      expect(e.message).toContain('Choice "NON_EXISTENT_CHOICE" is not valid');
    }
    expect(threw).toBe(true);
  });

  it('should reset state machine cleanly', () => {
    const engine = new ScenarioEngine({ scenarios: SCENARIOS });
    engine.startScenario('S01');
    engine.choose('S01-N01-C01');
    expect(engine.getHistory().length).toBe(1);

    engine.reset();
    expect(engine.getCurrentNode()).toBeNull();
    expect(engine.getHistory().length).toBe(0);
    expect(engine.isComplete()).toBe(false);
  });
});

describe('Scoring & Zero-Case Calculation', () => {
  it('should handle zero decisions safely without NaN or Infinity', () => {
    const res = calculateScore([], SCENARIOS['S01']);
    expect(res.score).toBe(0);
    expect(res.scorePercentage).toBe(0);
    expect(res.caught).toBe(0);
    expect(res.missed).toBe(0);
    expect(res.verdict).toBe('COMPROMISED');
  });

  it('should compute 100% score and SAFE verdict when all choices are good', () => {
    const events = [
      { good: true, tags: ['U3'], timedOut: false },
      { good: true, tags: ['I2'], timedOut: false }
    ];
    const res = calculateScore(events, SCENARIOS['S01']);
    expect(res.score).toBe(1.0);
    expect(res.scorePercentage).toBe(100);
    expect(res.caught).toBe(2);
    expect(res.missed).toBe(0);
    expect(res.verdict).toBe('SAFE');
    expect(res.recognizedIndicators).toContain('U3');
    expect(res.recognizedIndicators).toContain('I2');
  });

  it('should compute partial score and VULNERABLE verdict for mixed decisions', () => {
    const events = [
      { good: true, tags: ['U3'], timedOut: false },
      { good: false, tags: ['I2'], timedOut: false }
    ];
    const res = calculateScore(events, SCENARIOS['S01']);
    expect(res.score).toBe(0.5);
    expect(res.scorePercentage).toBe(50);
    expect(res.caught).toBe(1);
    expect(res.missed).toBe(1);
    expect(res.verdict).toBe('VULNERABLE');
    expect(res.missedIndicators).toContain('I2');
  });
});

describe('Timeout Handling', () => {
  it('should record timedOut: true and flag urgency miss on timeout', () => {
    const engine = new ScenarioEngine({ scenarios: SCENARIOS });
    engine.startScenario('S01');

    const outcome = engine.handleTimeout();
    expect(outcome.nextNode).toBeDefined();

    const history = engine.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].timedOut).toBe(true);
    expect(history[0].good).toBe(false);

    const result = engine.getResult();
    expect(result.missedIndicators).toContain('U1');
  });
});

describe('Persona-Aware Scenario Selection', () => {
  it('should prioritize student scenarios S05, S06, S08', () => {
    const list = getPrioritizedScenarios('student', Object.values(SCENARIOS));
    const ids = list.map(s => s.id);
    expect(ids[0]).toBe('S05');
    expect(ids[1]).toBe('S06');
    expect(ids[2]).toBe('S08');
  });

  it('should prioritize homemaker scenarios S07, S01, S10', () => {
    const list = getPrioritizedScenarios('homemaker', Object.values(SCENARIOS));
    const ids = list.map(s => s.id);
    expect(ids[0]).toBe('S07');
    expect(ids[1]).toBe('S01');
    expect(ids[2]).toBe('S10');
  });

  it('should prioritize senior citizen scenarios S03, S04, S10', () => {
    const list = getPrioritizedScenarios('senior citizen', Object.values(SCENARIOS));
    const ids = list.map(s => s.id);
    expect(ids[0]).toBe('S03');
    expect(ids[1]).toBe('S04');
    expect(ids[2]).toBe('S10');
  });

  it('should prioritize shopkeeper scenarios S09, S01, S02', () => {
    const list = getPrioritizedScenarios('shopkeeper', Object.values(SCENARIOS));
    const ids = list.map(s => s.id);
    expect(ids[0]).toBe('S09');
    expect(ids[1]).toBe('S01');
    expect(ids[2]).toBe('S02');
  });

  it('should prioritize salaried employee scenarios S08, S04, S03', () => {
    const list = getPrioritizedScenarios('salaried employee', Object.values(SCENARIOS));
    const ids = list.map(s => s.id);
    expect(ids[0]).toBe('S08');
    expect(ids[1]).toBe('S04');
    expect(ids[2]).toBe('S03');
  });
});

describe('Adaptive Difficulty & Reinforcement Recommendations', () => {
  it('should recommend higher difficulty for strong performers', () => {
    const profile = {
      persona: 'student',
      history: [
        { scenarioId: 'S05', scorePercentage: 100, verdict: 'SAFE' },
        { scenarioId: 'S01', scorePercentage: 100, verdict: 'SAFE' }
      ]
    };

    const rec = getAdaptiveRecommendation(profile, Object.values(SCENARIOS));
    expect(rec.targetDifficulty).toBeGreaterThanOrEqual(2);
    expect(rec.reason).toContain('Strong performance');
  });

  it('should reinforce easier/foundational scenarios for weak performers', () => {
    const profile = {
      persona: 'salaried employee',
      history: [
        { scenarioId: 'S08', scorePercentage: 30, verdict: 'COMPROMISED' }
      ]
    };

    const rec = getAdaptiveRecommendation(profile, Object.values(SCENARIOS));
    expect(rec.targetDifficulty).toBeLessThanOrEqual(2);
    expect(rec.reason).toContain('Reinforcing');
  });

  it('should prioritize scenarios testing repeatedly missed indicators', () => {
    const profile = {
      persona: 'shopkeeper',
      history: [
        { scenarioId: 'S01', scorePercentage: 50, missedIndicators: ['I2'], verdict: 'VULNERABLE' },
        { scenarioId: 'S02', scorePercentage: 50, missedIndicators: ['I2'], verdict: 'VULNERABLE' }
      ]
    };

    const rec = getAdaptiveRecommendation(profile, Object.values(SCENARIOS));
    expect(rec.reason).toContain('[I2]');
  });
});

describe('Validation of All 10 Production Scenarios (S01-S10)', () => {
  const scenarioIds = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10'];

  it('should contain all 10 required scenarios', () => {
    const keys = Object.keys(SCENARIOS);
    scenarioIds.forEach(id => {
      expect(keys).toContain(id);
      expect(SCENARIOS[id]).toBeDefined();
    });
  });

  it('should validate all 10 scenarios with 0 errors', () => {
    const validation = validateAllScenarios(SCENARIOS);
    if (!validation.valid) {
      console.error('Validation errors:', JSON.stringify(validation.errors, null, 2));
    }
    expect(validation.valid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('should verify S01 flags (I2, U3, E2)', () => {
    const s = SCENARIOS['S01'];
    expect(s.difficulty).toBe(1);
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('I2');
    expect(tags).toContain('U3');
    expect(tags).toContain('E2');
  });

  it('should verify S02 flags (E4, S4, I2)', () => {
    const s = SCENARIOS['S02'];
    expect(s.difficulty).toBe(2);
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('E4');
    expect(tags).toContain('S4');
    expect(tags).toContain('I2');
  });

  it('should verify S03 flags (U2, L1, I1, S1)', () => {
    const s = SCENARIOS['S03'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('U2');
    expect(tags).toContain('L1');
    expect(tags).toContain('I1');
    expect(tags).toContain('S1');
  });

  it('should verify S04 flags (S2, E1, U4, U5, I6)', () => {
    const s = SCENARIOS['S04'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('S2');
    expect(tags).toContain('E1');
    expect(tags).toContain('U4');
    expect(tags).toContain('U5');
    expect(tags).toContain('I6');
  });

  it('should verify S05 flags (E2, I6, E5)', () => {
    const s = SCENARIOS['S05'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('E2');
    expect(tags).toContain('I6');
    expect(tags).toContain('E5');
  });

  it('should verify S06 flags (L5, I4, E1)', () => {
    const s = SCENARIOS['S06'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('L5');
    expect(tags).toContain('I4');
    expect(tags).toContain('E1');
  });

  it('should verify S07 flags (E1, S2, U5)', () => {
    const s = SCENARIOS['S07'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('E1');
    expect(tags).toContain('S2');
    expect(tags).toContain('U5');
  });

  it('should verify S08 flags (E2, E5, I6)', () => {
    const s = SCENARIOS['S08'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('E2');
    expect(tags).toContain('E5');
    expect(tags).toContain('I6');
  });

  it('should verify S09 flags (I2, S4)', () => {
    const s = SCENARIOS['S09'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('I2');
    expect(tags).toContain('S4');
  });

  it('should verify S10 flags (S3, I5, I1)', () => {
    const s = SCENARIOS['S10'];
    const tags = s.nodes.flatMap(n => (n.choices || []).flatMap(c => c.indicatorIds || []));
    expect(tags).toContain('S3');
    expect(tags).toContain('I5');
    expect(tags).toContain('I1');
  });
});
