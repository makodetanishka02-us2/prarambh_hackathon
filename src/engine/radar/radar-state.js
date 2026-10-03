/**
 * ConVerse Radar State & Persistence Manager
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Radar & Intelligence Engine Owner: Ananya
 *
 * Manages:
 * - Persistent Awareness State (survives page reloads)
 * - Temporary Threat State (resets on new scan)
 * - Event-driven updates via handleRadarEvent()
 * - Safe fallback for corrupted localStorage
 * - Observer pattern for reactive UI updates
 */

import {
  createInitialRadarState,
  createEmptyThreatState,
  createInitialAwarenessState,
  calculateThreat,
  updateAwareness,
  updateDimensionAwareness,
  DIMENSION_KEYS,
  BASELINE_AWARENESS
} from './radar-engine.js';
import { RADAR_EVENTS, resolveReportingIndicator } from './radar-events.js';

export const RADAR_STORAGE_KEY = 'converse_radar_state_v1';

// In-memory fallback for environments without window.localStorage (e.g. Node.js tests)
const memoryStorage = new Map();

function getStorage() {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    return localStorage;
  }
  return {
    getItem: (key) => memoryStorage.has(key) ? memoryStorage.get(key) : null,
    setItem: (key, val) => memoryStorage.set(key, String(val)),
    removeItem: (key) => memoryStorage.delete(key),
    clear: () => memoryStorage.clear()
  };
}

let currentRadarState = createInitialRadarState();
const subscribers = new Set();

/**
 * Validates and sanitizes a restored radar state object
 * @param {Object} raw
 * @returns {Object} Validated radar state
 */
export function sanitizeRadarState(raw) {
  if (!raw || typeof raw !== 'object') {
    return createInitialRadarState();
  }

  const validState = createInitialRadarState();

  // Validate awareness dimensions
  if (raw.awareness && typeof raw.awareness === 'object') {
    for (const key of DIMENSION_KEYS) {
      const val = Number(raw.awareness[key]);
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        validState.awareness[key] = Math.max(0, Math.min(100, val));
      } else {
        validState.awareness[key] = BASELINE_AWARENESS;
      }
    }
  }

  // Validate threat dimensions (threat is temporary, but restore safely if present)
  if (raw.threat && typeof raw.threat === 'object') {
    for (const key of DIMENSION_KEYS) {
      const val = Number(raw.threat[key]);
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        validState.threat[key] = Math.max(0, Math.min(100, val));
      }
    }
    validState.threat.overall = typeof raw.threat.overall === 'number' && !isNaN(raw.threat.overall)
      ? Math.max(0, Math.min(100, raw.threat.overall))
      : 0;
    validState.threat.hitIndicators = Array.isArray(raw.threat.hitIndicators) ? raw.threat.hitIndicators : [];
    validState.threat.hasCriticalOverride = Boolean(raw.threat.hasCriticalOverride);
  }

  // History & Snapshots
  validState.history = Array.isArray(raw.history) ? raw.history.slice(-50) : [];
  validState.snapshots = {
    before: raw.snapshots && raw.snapshots.before ? raw.snapshots.before : null,
    after: raw.snapshots && raw.snapshots.after ? raw.snapshots.after : null
  };
  validState.lastUpdated = typeof raw.lastUpdated === 'number' ? raw.lastUpdated : Date.now();

  return validState;
}

/**
 * Restores radar state from localStorage with safe fallback on error or corruption
 * @returns {Object} Restored radar state
 */
export function restoreRadarState() {
  try {
    const storage = getStorage();
    const serialized = storage.getItem(RADAR_STORAGE_KEY);
    if (!serialized) {
      return createInitialRadarState();
    }
    const parsed = JSON.parse(serialized);
    return sanitizeRadarState(parsed);
  } catch (err) {
    console.warn('[ConVerse Radar] Corrupted local radar state detected. Falling back to default baseline.', err);
    return createInitialRadarState();
  }
}

/**
 * Persists current radar state to localStorage
 * @param {Object} [state] - State to persist (defaults to currentRadarState)
 */
export function persistRadarState(state = currentRadarState) {
  try {
    const storage = getStorage();
    const sanitized = sanitizeRadarState(state);
    storage.setItem(RADAR_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('[ConVerse Radar] Unable to write state to storage:', err);
  }
}


/**
 * Initialize radar state from local persistence
 * @returns {Object}
 */
export function initRadarState() {
  currentRadarState = restoreRadarState();
  return currentRadarState;
}

/**
 * Returns a clone of the current radar state
 * @returns {Object}
 */
export function getRadarState() {
  return {
    ...currentRadarState,
    threat: { ...currentRadarState.threat },
    awareness: { ...currentRadarState.awareness },
    history: [...currentRadarState.history],
    snapshots: { ...currentRadarState.snapshots }
  };
}

/**
 * Subscribes a listener to radar state updates
 * @param {Function} callback - Function receiving (newState, event)
 * @returns {Function} Unsubscribe function
 */
export function subscribeToRadar(callback) {
  if (typeof callback === 'function') {
    subscribers.add(callback);
  }
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Notifies all subscribers of a state change
 * @param {Object} event - The triggering event
 */
function notifySubscribers(event) {
  const snapshot = getRadarState();
  subscribers.forEach(cb => {
    try {
      cb(snapshot, event);
    } catch (e) {
      console.error('[ConVerse Radar] Error in subscriber callback:', e);
    }
  });
}

/**
 * Resets radar state to initial baseline (50 for all awareness dimensions, 0 threat, empty history)
 * @returns {Object} Clean baseline radar state
 */
export function resetRadarState() {
  currentRadarState = createInitialRadarState();
  persistRadarState(currentRadarState);
  notifySubscribers({ type: RADAR_EVENTS.RADAR_RESET });
  return getRadarState();
}

/**
 * Central event processor for all radar state changes
 * @param {Object} event - Event descriptor
 * @returns {Object} Updated radar state snapshot
 */
export function handleRadarEvent(event = {}) {
  if (!event || !event.type) {
    return getRadarState();
  }

  const { type, ...payload } = event;

  switch (type) {
    // 1. scan:completed
    // Updates Threat layer for the message, awareness untouched
    case RADAR_EVENTS.SCAN_COMPLETED: {
      const indicators = payload.indicators || [];
      const newThreat = calculateThreat(indicators);

      currentRadarState.threat = newThreat;
      currentRadarState.history.push({
        type: RADAR_EVENTS.SCAN_COMPLETED,
        timestamp: Date.now(),
        threatRisk: newThreat.overall,
        hitIndicators: newThreat.hitIndicators
      });
      currentRadarState.lastUpdated = Date.now();
      break;
    }

    // 2. scan:deepcheck
    // Updates Link/Sender threat dimensions with additional verified intelligence
    case RADAR_EVENTS.SCAN_DEEPCHECK: {
      const newIndicators = payload.indicators || [];
      const existingHits = currentRadarState.threat.hitIndicators || [];
      const combined = Array.from(new Set([...existingHits, ...newIndicators]));
      const newThreat = calculateThreat(combined);

      currentRadarState.threat = newThreat;
      currentRadarState.history.push({
        type: RADAR_EVENTS.SCAN_DEEPCHECK,
        timestamp: Date.now(),
        threatRisk: newThreat.overall,
        hitIndicators: newThreat.hitIndicators
      });
      currentRadarState.lastUpdated = Date.now();
      break;
    }

    // 3. scan:challenge_answered
    // User guesses Safe or Scam before detection reveal
    case RADAR_EVENTS.SCAN_CHALLENGE_ANSWERED: {
      let outcome = 0;
      if (typeof payload.outcome === 'number') {
        outcome = payload.outcome === 1 ? 1 : 0;
      } else if (typeof payload.isCorrect === 'boolean') {
        outcome = payload.isCorrect ? 1 : 0;
      } else {
        const userGuess = String(payload.userGuess || '').toLowerCase();
        const actualRisk = String(payload.actualRisk || '').toLowerCase();
        const indicators = payload.indicators || [];
        const isScam = actualRisk === 'danger' || actualRisk === 'warn' || actualRisk === 'scam' || indicators.length > 0;
        const guessedScam = userGuess === 'scam' || userGuess === 'danger' || userGuess === 'warn';
        outcome = (guessedScam && isScam) || (!guessedScam && !isScam) ? 1 : 0;
      }

      const indicators = payload.indicators || [];
      const confidence = payload.confidence || 'fairly';

      currentRadarState.awareness = updateAwareness(currentRadarState.awareness, {
        indicators,
        outcome,
        confidence
      });

      currentRadarState.history.push({
        type: RADAR_EVENTS.SCAN_CHALLENGE_ANSWERED,
        timestamp: Date.now(),
        outcome,
        confidence,
        affectedIndicators: indicators
      });
      currentRadarState.lastUpdated = Date.now();
      persistRadarState(currentRadarState);
      break;
    }

    // 4. action:taken
    // User takes a safety action (Verify, Block, Report, Tell Family)
    case RADAR_EVENTS.ACTION_TAKEN: {
      const action = payload.action || 'verify';
      const reportingInd = resolveReportingIndicator(action);
      const confidence = payload.confidence || 'fairly';
      const outcome = typeof payload.outcome === 'number' ? payload.outcome : 1;

      // Update Reporting habit dimension
      const prevReporting = currentRadarState.awareness.reporting ?? BASELINE_AWARENESS;
      currentRadarState.awareness.reporting = updateDimensionAwareness(prevReporting, outcome, confidence);

      currentRadarState.history.push({
        type: RADAR_EVENTS.ACTION_TAKEN,
        timestamp: Date.now(),
        action,
        indicator: reportingInd,
        outcome
      });
      currentRadarState.lastUpdated = Date.now();
      persistRadarState(currentRadarState);
      break;
    }

    // 5. sim:choice_made
    // Simulator decision event
    case RADAR_EVENTS.SIM_CHOICE_MADE: {
      const indicators = payload.indicators || [];
      const dimensions = payload.dimensions || [];
      const outcome = typeof payload.outcome === 'number'
        ? payload.outcome
        : payload.isSafe ? 1 : 0;
      const confidence = payload.confidence || 'fairly';

      currentRadarState.awareness = updateAwareness(currentRadarState.awareness, {
        dimensions,
        indicators,
        outcome,
        confidence
      });

      currentRadarState.history.push({
        type: RADAR_EVENTS.SIM_CHOICE_MADE,
        timestamp: Date.now(),
        scenarioId: payload.scenarioId || null,
        indicators,
        outcome,
        confidence
      });
      currentRadarState.lastUpdated = Date.now();
      persistRadarState(currentRadarState);
      break;
    }

    // 6. test:completed
    // Pre/post test evaluation
    case RADAR_EVENTS.TEST_COMPLETED: {
      if (payload.dimensions && typeof payload.dimensions === 'object') {
        for (const key of DIMENSION_KEYS) {
          if (typeof payload.dimensions[key] === 'number') {
            currentRadarState.awareness[key] = Math.max(0, Math.min(100, payload.dimensions[key]));
          }
        }
      }

      if (payload.snapshot) {
        if (payload.snapshot.before) {
          currentRadarState.snapshots.before = { ...payload.snapshot.before };
        }
        if (payload.snapshot.after) {
          currentRadarState.snapshots.after = { ...payload.snapshot.after };
        }
      }

      currentRadarState.history.push({
        type: RADAR_EVENTS.TEST_COMPLETED,
        timestamp: Date.now(),
        testType: payload.testType || 'post'
      });
      currentRadarState.lastUpdated = Date.now();
      persistRadarState(currentRadarState);
      break;
    }

    // 7. radar:reset
    case RADAR_EVENTS.RADAR_RESET: {
      return resetRadarState();
    }

    default:
      console.warn(`[ConVerse Radar] Unknown radar event type: ${type}`);
      return getRadarState();
  }

  notifySubscribers(event);
  return getRadarState();
}

/**
 * Emit a radar event (alias for handleRadarEvent)
 * @param {Object} event
 * @returns {Object}
 */
export function emitRadarEvent(event) {
  return handleRadarEvent(event);
}
