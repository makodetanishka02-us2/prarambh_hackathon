/**
 * ConVerse — Modular Deterministic Test Runner
 * Runs all unit and integration tests with zero external dependencies.
 * Supports synchronous and asynchronous tests.
 */

const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

const queue = [];
let currentSuite = '';

global.describe = function(suiteName, fn) {
  queue.push({ type: 'suite', name: suiteName });
  fn();
};

global.it = function(testName, fn) {
  queue.push({ type: 'test', name: testName, fn, suite: currentSuite });
};

global.expect = function(actual) {
  return {
    toBe: function(expected) {
      if (actual !== expected) {
        throw new Error(`Expected [${expected}] (${typeof expected}) but got [${actual}] (${typeof actual})`);
      }
    },
    toEqual: function(expected) {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(`Expected equality:\n  Expected: ${expectedStr}\n  Actual:   ${actualStr}`);
      }
    },
    toBeGreaterThan: function(expected) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual: function(expected) {
      if (!(actual >= expected)) {
        throw new Error(`Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThanOrEqual: function(expected) {
      if (!(actual <= expected)) {
        throw new Error(`Expected ${actual} <= ${expected}`);
      }
    },
    toBeDefined: function() {
      if (typeof actual === 'undefined') {
        throw new Error(`Expected value to be defined`);
      }
    },
    toBeNull: function() {
      if (actual !== null) {
        throw new Error(`Expected null but got ${actual}`);
      }
    },
    toBeTruthy: function() {
      if (!actual) {
        throw new Error(`Expected truthy value but got ${actual}`);
      }
    },
    toBeFalsy: function() {
      if (actual) {
        throw new Error(`Expected falsy value but got ${actual}`);
      }
    },
    toContain: function(item) {
      if (Array.isArray(actual)) {
        if (!actual.includes(item)) {
          throw new Error(`Expected array to contain [${item}], got: ${JSON.stringify(actual)}`);
        }
      } else if (typeof actual === 'string') {
        if (!actual.includes(item)) {
          throw new Error(`Expected string to contain "${item}", got: "${actual}"`);
        }
      } else {
        throw new Error(`toContain called on non-collection`);
      }
    }
  };
};

async function runAllTests() {
  console.log('====================================================');
  console.log('       ConVerse Deterministic Test Suite           ');
  console.log('====================================================');

  const testsDir = path.join(__dirname);
  const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

  for (const file of testFiles) {
    try {
      require(path.join(testsDir, file));
    } catch (e) {
      console.error(`\x1b[31mError loading test file ${file}: ${e.message}\x1b[0m\n${e.stack}`);
      failedTests++;
    }
  }

  for (const item of queue) {
    if (item.type === 'suite') {
      console.log(`\n\x1b[1m\x1b[36m▶ Suite: ${item.name}\x1b[0m`);
    } else if (item.type === 'test') {
      totalTests++;
      try {
        if (item.fn.length > 0) {
          // Callback style
          await new Promise((resolve, reject) => {
            try {
              item.fn((err) => {
                if (err) reject(err);
                else resolve();
              });
            } catch (err) {
              reject(err);
            }
          });
        } else {
          // Sync or Promise style
          const res = item.fn();
          if (res && typeof res.then === 'function') {
            await res;
          }
        }
        passedTests++;
        console.log(`  \x1b[32m✔\x1b[0m ${item.name}`);
      } catch (err) {
        failedTests++;
        console.log(`  \x1b[31m✖\x1b[0m ${item.name}`);
        failureDetails.push({ testName: item.name, error: err });
      }
    }
  }

  console.log('\n====================================================');
  console.log(`Summary: ${passedTests}/${totalTests} tests passed`);
  if (failedTests > 0) {
    console.log(`\x1b[31mFAILED: ${failedTests} test(s) failed\x1b[0m`);
    failureDetails.forEach(f => {
      console.log(`\n\x1b[31m✖ ${f.testName}\x1b[0m\n  ${f.error.message}\n${f.error.stack}`);
    });
    process.exit(1);
  } else {
    console.log(`\x1b[32mSUCCESS: All tests passed flawlessly!\x1b[0m`);
    process.exit(0);
  }
}

runAllTests();
