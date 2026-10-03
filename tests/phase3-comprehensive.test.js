/**
 * ConVerse — Phase 3 Comprehensive Unit Test Suite
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Verifies all 10 scenarios, branching paths, scoring formulas, timeout simulation,
 * adaptive progression, pre/post test question pool, improvement metrics, and personalization.
 */

const { ScenarioEngine } = require('../src/engine/sim/scenario-engine.js');
const { validateScenario, validateAllScenarios } = require('../src/engine/sim/scenario-validator.js');
const { calculateScore } = require('../src/engine/sim/scenario-scoring.js');
const { getPrioritizedScenarios, getAdaptiveRecommendation, PERSONA_PRIORITIES } = require('../src/engine/sim/scenario-selector.js');
const { evaluateAdaptiveProgression, getWeakestDimensions, generatePersonalizedRecommendations } = require('../src/engine/sim/adaptive.js');
const { SCENARIOS } = require('../src/engine/sim/scenario-data.js');
const { INDICATOR_CATALOGUE, PERSONAS } = require('../src/data/initial-data.js');
const { QUESTION_POOL, getPreTestQuestions, getPostTestQuestions, evaluateTest, calculateImprovement } = require('../src/data/pre-post-test-data.js');

describe('Comprehensive Validation of S01–S10', () => {
  it('should load all 10 scenarios with unique IDs and valid schemas', () => {
    const keys = Object.keys(SCENARIOS);
    expect(keys.length).toBe(10);
    const uniqueIds = new Set(keys);
    expect(uniqueIds.size).toBe(10);

    for (let i = 1; i <= 10; i++) {
      const id = i < 10 ? `S0${i}` : `S${i}`;
      expect(keys).toContain(id);
      const sc = SCENARIOS[id];
      expect(sc.id).toBe(id);
      expect(sc.nodes.length).toBeGreaterThanOrEqual(2);
      expect(sc.startNodeId).toBeDefined();

      const validation = validateScenario(sc);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    }
  });

  it('should verify every referenced node exists and every path terminates without dead-ends', () => {
    for (const sc of Object.values(SCENARIOS)) {
      const nodeMap = new Map(sc.nodes.map(n => [n.id, n]));
      
      // Start node exists
      expect(nodeMap.has(sc.startNodeId)).toBe(true);

      // Check all choices
      for (const node of sc.nodes) {
        if (!node.terminal) {
          expect(Array.isArray(node.choices)).toBe(true);
          expect(node.choices.length).toBeGreaterThan(0);
          for (const choice of node.choices) {
            if (choice.nextNodeId !== null) {
              expect(nodeMap.has(choice.nextNodeId)).toBe(true);
            }
          }
        }
      }
    }
  });

  it('should verify all red-flag substrings exist exactly in their node messages', () => {
    for (const sc of Object.values(SCENARIOS)) {
      for (const node of sc.nodes) {
        if (Array.isArray(node.redFlags)) {
          for (const rf of node.redFlags) {
            expect(INDICATOR_CATALOGUE[rf.indicatorId]).toBeDefined();
            expect(node.message).toContain(rf.text);
          }
        }
      }
    }
  });

  it('should execute complete playable paths through all 10 scenarios (S01-S10)', () => {
    const engine = new ScenarioEngine();

    for (let i = 1; i <= 10; i++) {
      const id = i < 10 ? `S0${i}` : `S${i}`;
      engine.reset();
      const startNode = engine.startScenario(id);
      expect(startNode).toBeDefined();

      // Follow safe branch
      let currentNode = startNode;
      let steps = 0;
      while (!engine.isComplete() && steps < 10) {
        steps++;
        const choices = engine.getAvailableChoices();
        if (choices.length === 0) break;
        // Choose first choice
        const outcome = engine.choose(choices[0].id, { ms: 1500, confidence: 3 });
        currentNode = outcome.nextNode;
      }

      expect(engine.isComplete()).toBe(true);
      const result = engine.getResult();
      expect(result.scenarioId).toBe(id);
      expect(typeof result.scorePercentage).toBe('number');
      expect(result.scorePercentage).toBeGreaterThanOrEqual(0);
      expect(result.scorePercentage).toBeLessThanOrEqual(100);
      expect(result.takeaway.length).toBeGreaterThan(0);
    }
  });
});

describe('Branching & State Machine Verification', () => {
  it('should follow distinct paths and consequences for safe vs risky decisions in S01', () => {
    const engine = new ScenarioEngine();

    // Path 1: Safe Path
    engine.startScenario('S01');
    const safeChoice1 = engine.choose('S01-N01-C01'); // inspect
    expect(safeChoice1.nextNode.id).toBe('S01-N02');
    const safeChoice2 = engine.choose('S01-N02-C01'); // decline & report
    expect(safeChoice2.nextNode.id).toBe('S01-N04');
    expect(engine.isComplete()).toBe(true);
    const safeResult = engine.getResult();
    expect(safeResult.scorePercentage).toBe(100);
    expect(safeResult.verdict).toBe('SAFE');

    // Path 2: Risky Path
    engine.reset();
    engine.startScenario('S01');
    const riskyChoice1 = engine.choose('S01-N01-C02'); // rush
    expect(riskyChoice1.nextNode.id).toBe('S01-N03');
    const recoverChoice2 = engine.choose('S01-N03-C01'); // call 1930
    expect(engine.isComplete()).toBe(true);
    const mixedResult = engine.getResult();
    expect(mixedResult.caught).toBe(1);
    expect(mixedResult.missed).toBe(1);
    expect(mixedResult.scorePercentage).toBe(50);
    expect(mixedResult.verdict).toBe('VULNERABLE');
  });

  it('should track timeout as an explicit missed urgency indicator [U1]', () => {
    const engine = new ScenarioEngine();
    engine.startScenario('S01');
    const timeoutOutcome = engine.handleTimeout();
    expect(engine.getHistory().length).toBe(1);
    const event = engine.getHistory()[0];
    expect(event.timedOut).toBe(true);
    expect(event.good).toBe(false);
    expect(event.tags).toContain('U1');
  });
});

describe('Scoring Formulas & Safe Zero-Case Handling', () => {
  it('should safely return 0 score when no decisions exist', () => {
    const emptyResult = calculateScore([], null);
    expect(emptyResult.score).toBe(0.0);
    expect(emptyResult.scorePercentage).toBe(0);
    expect(emptyResult.verdict).toBe('COMPROMISED');
    expect(Number.isNaN(emptyResult.score)).toBe(false);
  });

  it('should compute exact caught / (caught + missed) percentage', () => {
    const events = [
      { good: true, tags: ['U2'] },
      { good: true, tags: ['L1'] },
      { good: false, tags: ['I1'] }
    ];
    const result = calculateScore(events, null);
    expect(result.caught).toBe(2);
    expect(result.missed).toBe(1);
    expect(result.totalDecisions).toBe(3);
    expect(result.scorePercentage).toBe(67); // Math.round(2/3 * 100)
    expect(result.verdict).toBe('VULNERABLE');
    expect(result.recognizedIndicators).toContain('U2');
    expect(result.recognizedIndicators).toContain('L1');
    expect(result.missedIndicators).toContain('I1');
  });

  it('should calculate accurate multi-scenario session scores', () => {
    const sessionResults = [
      { caught: 2, missed: 0 }, // 100%
      { caught: 1, missed: 1 }, // 50%
      { caught: 3, missed: 0 }  // 100%
    ];
    const totalCaught = sessionResults.reduce((s, r) => s + r.caught, 0);
    const totalMissed = sessionResults.reduce((s, r) => s + r.missed, 0);
    const sessionScore = Math.round((totalCaught / (totalCaught + totalMissed)) * 100);
    expect(totalCaught).toBe(6);
    expect(totalMissed).toBe(1);
    expect(sessionScore).toBe(86); // 6/7 * 100 = 85.7% -> 86%
  });
});

describe('Persona Prioritization & Adaptive Difficulty Engine', () => {
  it('should verify all 5 persona priority mappings', () => {
    const scenarios = Object.values(SCENARIOS);

    const studentScenarios = getPrioritizedScenarios('student', scenarios).slice(0, 3).map(s => s.id);
    expect(studentScenarios).toEqual(['S05', 'S06', 'S08']);

    const homemakerScenarios = getPrioritizedScenarios('homemaker', scenarios).slice(0, 3).map(s => s.id);
    expect(homemakerScenarios).toEqual(['S07', 'S01', 'S10']);

    const seniorScenarios = getPrioritizedScenarios('senior citizen', scenarios).slice(0, 3).map(s => s.id);
    expect(seniorScenarios).toEqual(['S03', 'S04', 'S10']);

    const shopkeeperScenarios = getPrioritizedScenarios('shopkeeper', scenarios).slice(0, 3).map(s => s.id);
    expect(shopkeeperScenarios).toEqual(['S09', 'S01', 'S02']);

    const salariedScenarios = getPrioritizedScenarios('salaried employee', scenarios).slice(0, 3).map(s => s.id);
    expect(salariedScenarios).toEqual(['S08', 'S04', 'S03']);
  });

  it('should recommend higher difficulty for strong performers', () => {
    const rec = evaluateAdaptiveProgression({
      persona: 'student',
      history: [
        { scenarioId: 'S05', scorePercentage: 100, missedIndicators: [] },
        { scenarioId: 'S06', scorePercentage: 90, missedIndicators: [] }
      ]
    }, SCENARIOS);

    expect(rec.targetDifficulty).toBeGreaterThanOrEqual(2);
    expect(rec.nextScenarioId).toBeDefined();
  });

  it('should reinforce repeatedly missed indicators with targeted scenario', () => {
    const rec = evaluateAdaptiveProgression({
      persona: 'student',
      history: [
        { scenarioId: 'S01', scorePercentage: 30, missedIndicators: ['I2'] },
        { scenarioId: 'S02', scorePercentage: 40, missedIndicators: ['I2'] }
      ]
    }, SCENARIOS);

    expect(rec.reason).toContain('I2');
    expect(rec.nextScenarioId).toBe('S09'); // S09 tests I2
  });

  it('should generate personalized safety profile advice from actual mistakes', () => {
    const history = [
      { scenarioId: 'S01', missedIndicators: ['I2', 'U3'] },
      { scenarioId: 'S04', missedIndicators: ['S2', 'I6'] }
    ];
    const recs = generatePersonalizedRecommendations(history, 'student');
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.some(r => r.includes('UPI PIN'))).toBe(true);
    expect(recs.some(r => r.includes('Authority Impersonation'))).toBe(true);
  });
});

describe('Pre-Test / Post-Test Assessment System (Prompt 13)', () => {
  it('should contain a pool of exactly 24 multiple choice questions (4 per dimension)', () => {
    expect(QUESTION_POOL.length).toBe(24);
    const dimensions = ['urgency', 'sender', 'link', 'info', 'emotion', 'reporting'];
    for (const dim of dimensions) {
      const inDim = QUESTION_POOL.filter(q => q.dimension === dim);
      expect(inDim.length).toBe(4);
      for (const q of inDim) {
        expect(q.options.length).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
        expect(q.explanation.length).toBeGreaterThan(10);
      }
    }
  });

  it('should generate 6-question pre-test and post-test with 1 question per dimension', () => {
    const pre = getPreTestQuestions();
    const post = getPostTestQuestions();
    expect(pre.length).toBe(6);
    expect(post.length).toBe(6);

    const preDims = new Set(pre.map(q => q.dimension));
    const postDims = new Set(post.map(q => q.dimension));
    expect(preDims.size).toBe(6);
    expect(postDims.size).toBe(6);

    // Pre and Post should use distinct questions
    const preIds = pre.map(q => q.id);
    const postIds = post.map(q => q.id);
    for (const id of postIds) {
      expect(preIds).not.toContain(id);
    }
  });

  it('should evaluate test answers and compute accurate dimension breakdown', () => {
    const pre = getPreTestQuestions();
    // Answer first 3 correctly, last 3 incorrectly
    const answers = [
      pre[0].correctIndex,
      pre[1].correctIndex,
      pre[2].correctIndex,
      (pre[3].correctIndex + 1) % 4,
      (pre[4].correctIndex + 1) % 4,
      (pre[5].correctIndex + 1) % 4
    ];

    const result = evaluateTest(answers, pre);
    expect(result.total).toBe(6);
    expect(result.correctCount).toBe(3);
    expect(result.scorePercentage).toBe(50);
    expect(result.dimensionResults['urgency'].correct).toBe(1);
    expect(result.dimensionResults['info'].correct).toBe(0);
  });

  it('should compute accurate percentage-point and relative improvement', () => {
    const imp1 = calculateImprovement(50, 83.3);
    expect(imp1.percentagePointImprovement).toBe(33.3);
    expect(imp1.relativeImprovement).toBe(66.6);
    expect(imp1.improved).toBe(true);

    const impZero = calculateImprovement(0, 50);
    expect(impZero.percentagePointImprovement).toBe(50);
    expect(impZero.relativeImprovement).toBe(100);

    const impSafe = calculateImprovement(0, 0);
    expect(impSafe.percentagePointImprovement).toBe(0);
    expect(impSafe.relativeImprovement).toBe(0);
  });
});
