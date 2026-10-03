/**
 * ConVerse Global State Management
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

const STORAGE_KEY = 'converse_app_state_v1';

const defaultState = {
  // User Awareness Profile & Progress
  user: {
    name: "Citizen Defender",
    awarenessScore: 68,
    level: "Vigilant Scout",
    completedSimulations: ["sim-upi-qr-1", "sim-electricity-bill-1"],
    earnedBadges: [
      { id: "badge-first-defense", name: "First Defense", icon: "🛡️", desc: "Completed your first scam simulation" },
      { id: "badge-qr-master", name: "QR Trap Spotter", icon: "🔍", desc: "Successfully caught a fake merchant QR code" },
      { id: "badge-otp-guardian", name: "OTP Guardian", icon: "🔒", desc: "Never shared an OTP with an imposter" }
    ],
    vulnerabilities: {
      upi: 85,
      phishingSms: 70,
      fakeCalls: 60,
      jobFraud: 75,
      investmentScam: 50
    }
  },

  // Active Session & Simulator Context (Hooks for Teammates)
  simulator: {
    activeScenarioId: null,
    inProgress: false,
    score: 0,
    answers: []
  },

  // System & Environment Settings
  settings: {
    language: "en",
    offlineMode: false,
    soundEnabled: true,
    hapticFeedback: true
  },

  // Live Threats & Intelligence Radar
  radar: {
    activeThreatsCount: 1420,
    topTrendingCategory: "Electricity Bill Disconnection SMS",
    threatLevel: "High"
  }
};

let state = { ...defaultState };
const subscribers = new Map();

/**
 * Initialize state from localStorage or default
 */
export function initState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = {
        ...defaultState,
        ...parsed,
        user: { ...defaultState.user, ...(parsed.user || {}) },
        settings: { ...defaultState.settings, ...(parsed.settings || {}) },
        simulator: { ...defaultState.simulator, ...(parsed.simulator || {}) }
      };
    }
  } catch (err) {
    console.warn('ConVerse state: Unable to parse localStorage state, using default.', err);
    state = { ...defaultState };
  }
  return state;
}

/**
 * Get current state snapshot
 */
export function getState() {
  return state;
}

/**
 * Update state and notify subscribers
 * @param {Object|Function} updater Partial state object or function receiving current state
 */
export function setState(updater) {
  const previousState = { ...state };
  const updates = typeof updater === 'function' ? updater(state) : updater;

  state = {
    ...state,
    ...updates,
    user: updates.user ? { ...state.user, ...updates.user } : state.user,
    settings: updates.settings ? { ...state.settings, ...updates.settings } : state.settings,
    simulator: updates.simulator ? { ...state.simulator, ...updates.simulator } : state.simulator
  };

  // Persist to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('ConVerse state: Error writing to localStorage', err);
  }

  // Notify subscribers
  notifySubscribers(previousState, state);
  return state;
}

/**
 * Reset progress and training history
 */
export function resetProgress() {
  setState({
    user: {
      ...defaultState.user,
      awarenessScore: 20,
      level: "Novice Learner",
      completedSimulations: [],
      earnedBadges: []
    },
    simulator: {
      activeScenarioId: null,
      inProgress: false,
      score: 0,
      answers: []
    }
  });
}

/**
 * Subscribe to state changes
 * @param {string|Function} keyOrListener Path/key to observe, or callback function
 * @param {Function} [listener] Callback function when key is provided
 */
export function subscribe(keyOrListener, listener) {
  const key = typeof keyOrListener === 'string' ? keyOrListener : '*';
  const callback = typeof keyOrListener === 'function' ? keyOrListener : listener;

  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  subscribers.get(key).add(callback);

  return () => {
    const subs = subscribers.get(key);
    if (subs) {
      subs.delete(callback);
    }
  };
}

/**
 * Notify all relevant listeners
 */
function notifySubscribers(prevState, newState) {
  // Global listeners
  if (subscribers.has('*')) {
    subscribers.get('*').forEach(cb => cb(newState, prevState));
  }

  // Keyed listeners
  for (const [key, listeners] of subscribers.entries()) {
    if (key !== '*' && prevState[key] !== newState[key]) {
      listeners.forEach(cb => cb(newState[key], prevState[key], newState));
    }
  }
}
