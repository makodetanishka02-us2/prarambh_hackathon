/**
 * ConVerse — Canonical Scenario Dataset Master Index (scenario-data.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 */

let S01, S02, S03, S04, S05, S06, S07, S08, S09, S10;

if (typeof require !== 'undefined') {
  S01 = require('./scenarios/S01.js');
  S02 = require('./scenarios/S02.js');
  S03 = require('./scenarios/S03.js');
  S04 = require('./scenarios/S04.js');
  S05 = require('./scenarios/S05.js');
  S06 = require('./scenarios/S06.js');
  S07 = require('./scenarios/S07.js');
  S08 = require('./scenarios/S08.js');
  S09 = require('./scenarios/S09.js');
  S10 = require('./scenarios/S10.js');
} else if (typeof window !== 'undefined') {
  S01 = window.Scenario_S01;
  S02 = window.Scenario_S02;
  S03 = window.Scenario_S03;
  S04 = window.Scenario_S04;
  S05 = window.Scenario_S05;
  S06 = window.Scenario_S06;
  S07 = window.Scenario_S07;
  S08 = window.Scenario_S08;
  S09 = window.Scenario_S09;
  S10 = window.Scenario_S10;
}

const SCENARIOS = {
  'S01': S01,
  'S02': S02,
  'S03': S03,
  'S04': S04,
  'S05': S05,
  'S06': S06,
  'S07': S07,
  'S08': S08,
  'S09': S09,
  'S10': S10
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SCENARIOS,
    S01, S02, S03, S04, S05, S06, S07, S08, S09, S10
  };
}

if (typeof window !== 'undefined') {
  window.ConVerseScenarios = SCENARIOS;
}
