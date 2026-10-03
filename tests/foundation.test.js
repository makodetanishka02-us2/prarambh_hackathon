/**
 * ConVerse — Foundation Tests
 */

const { INDICATOR_DIMENSIONS, INDICATOR_CATALOGUE, PERSONAS, SAFETY_TIPS } = require('../src/data/initial-data.js');
const { SimContract } = require('../src/engine/sim/sim-contract.js');

describe('ConVerse Foundation Baseline', () => {
  it('should expose all 6 indicator radar dimensions', () => {
    expect(Object.keys(INDICATOR_DIMENSIONS).length).toBe(6);
    expect(INDICATOR_DIMENSIONS.urgency.codePrefix).toBe('U');
    expect(INDICATOR_DIMENSIONS.sender.codePrefix).toBe('S');
    expect(INDICATOR_DIMENSIONS.link.codePrefix).toBe('L');
    expect(INDICATOR_DIMENSIONS.info.codePrefix).toBe('I');
    expect(INDICATOR_DIMENSIONS.emotion.codePrefix).toBe('E');
    expect(INDICATOR_DIMENSIONS.reporting.codePrefix).toBe('R');
  });

  it('should define core indicators for all radar dimensions', () => {
    expect(INDICATOR_CATALOGUE['I2']).toBeDefined();
    expect(INDICATOR_CATALOGUE['I2'].name).toContain('UPI PIN');
    expect(INDICATOR_CATALOGUE['U2']).toBeDefined();
    expect(INDICATOR_CATALOGUE['S2']).toBeDefined();
    expect(INDICATOR_CATALOGUE['E1']).toBeDefined();
    expect(INDICATOR_CATALOGUE['L1']).toBeDefined();
    expect(INDICATOR_CATALOGUE['R1']).toBeDefined();
  });

  it('should define all 5 target user personas', () => {
    const personaKeys = Object.keys(PERSONAS);
    expect(personaKeys).toContain('student');
    expect(personaKeys).toContain('homemaker');
    expect(personaKeys).toContain('senior citizen');
    expect(personaKeys).toContain('shopkeeper');
    expect(personaKeys).toContain('salaried employee');
  });

  it('should define simulation contract constants', () => {
    expect(SimContract.VERSION).toBe('1.0.0');
    expect(SimContract.VERDICTS.SAFE).toBe('SAFE');
    expect(SimContract.VERDICTS.VULNERABLE).toBe('VULNERABLE');
    expect(SimContract.VERDICTS.COMPROMISED).toBe('COMPROMISED');
  });
});
