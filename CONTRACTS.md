# ConVerse — Teammate Integration Contracts & API Guide
**PS-10: Financial Scam Simulator & Awareness Engine**  
**Foundation & Shared Architecture Owner:** Tanishka

---

## Overview

This document defines the interface boundaries, contracts, and guidelines for teammates contributing scam detection intelligence, risk radar models, simulation sandboxes, and safety tips to **ConVerse**.

All teammates must integrate their logic into their respective directories inside `src/engine/` and `src/data/` without altering core layout, styling tokens, or navigation.

---

## 1. Directory Ownership & Boundaries

| Module | Directory | Responsible Teammate | Status |
| :--- | :--- | :--- | :--- |
| **Foundation, Shell & UI Components** | `src/styles/`, `src/components/`, `src/app/`, `src/i18n/` | **Tanishka** | **Completed & Locked** |
| **Scam Detection & Indicators** | `src/engine/detect/` | Scam Intelligence Lead | Stub ready for implementation |
| **Scam Risk Radar & Threat Trends** | `src/engine/radar/` | Threat Intelligence Lead | Stub ready for implementation |
| **Interactive Simulator Sandbox** | `src/engine/sim/` | Simulation Lead | Stub ready for implementation |
| **Safety Tips & Playbooks** | `src/engine/tips/` | Content / Safety Lead | Stub ready for implementation |
| **Scenarios & Mock Datasets** | `src/data/` | Shared Data Lead | Initial dataset initialized |

---

## 2. Engine Contracts

### A. Scam Detection Engine (`src/engine/detect/detect-contract.js`)

Used by the Quick Scanner on Dashboard and deep message analysis.

```javascript
/**
 * Analyzes raw text for financial fraud indicators
 * @param {string} rawText
 * @param {Object} [options]
 * @param {string} [options.language="en"] - Active language code
 * @returns {Promise<ScamDetectionResult>|ScamDetectionResult}
 */
export function detectScamIndicators(rawText, options = {}) { ... }
```

**Return Shape (`ScamDetectionResult`):**
```json
{
  "text": "Enter your UPI PIN to claim ₹5,000 reward",
  "riskLevel": "danger", // "safe" | "warn" | "danger"
  "confidenceScore": 88, // 0 - 100
  "matchedIndicators": [
    {
      "id": "ind-urgency",
      "name": "Artificial Urgency",
      "description": "Creates panic or deadline",
      "severity": "warn"
    },
    {
      "id": "ind-pin-request",
      "name": "PIN Request on Inflow",
      "description": "UPI PIN is never needed to receive money",
      "severity": "danger"
    }
  ],
  "explanation": "High risk detected: Entering UPI PIN debits your account.",
  "recommendedActions": [
    "Never enter your UPI PIN when receiving money.",
    "Report suspicious UPI IDs to 1930."
  ]
}
```

---

### B. Threat Radar Engine (`src/engine/radar/radar-contract.js`)

Used by the Live Threat Radar on Dashboard and Vulnerability Matrix on Progress page.

```javascript
/**
 * Retrieves current active scam threat metrics
 * @param {Object} [filter]
 * @returns {Array<RadarThreat>}
 */
export function getActiveScamRadar(filter = {}) { ... }

/**
 * Calculates user defense readiness and top weakness
 * @param {Object} userProfile
 * @returns {{ overallScore: number, level: string, topWeakness: string }}
 */
export function calculateVulnerabilityScore(userProfile = {}) { ... }
```

---

### C. Simulation Sandbox Engine (`src/engine/sim/sim-contract.js`)

Used by the Interactive Scam Simulator page (`#simulator`).

```javascript
/**
 * Load all scenarios or by category
 * @param {"all"|"upi"|"calls"|"phishing"|"job"|"investment"} [category="all"]
 * @returns {Array<Object>}
 */
export function getAvailableScenarios(category = "all") { ... }

/**
 * Load scenario details by ID
 * @param {string} scenarioId
 * @returns {Object|null}
 */
export function loadScenario(scenarioId) { ... }

/**
 * Evaluate user choice in scenario step
 * @param {string} scenarioId
 * @param {string} choiceId
 * @returns {{ isCorrect: boolean, feedback: string, scoreAwarded: number, nextStepId: string|null }}
 */
export function evaluateStepChoice(scenarioId, choiceId) { ... }
```

---

### D. Safety Tips Engine (`src/engine/tips/tips-contract.js`)

Used by the Safety Tips page (`#safety-tips`).

```javascript
/**
 * Returns safety playbooks filtered by query or category
 * @param {{ query?: string, category?: string }} [filter]
 * @returns {Array<Object>}
 */
export function getSafetyPlaybooks(filter = {}) { ... }

/**
 * Returns emergency response helplines and portals
 * @returns {Array<Object>}
 */
export function getEmergencyHelplines() { ... }
```

---

## 3. How to Use Shared UI Components

Teammates must use these Vanilla JS helpers instead of custom inline styles:

```javascript
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { createChip } from '../components/chip.js';
import { createProgressBar } from '../components/progress.js';
import { createModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

// 1. Button
const btn = createButton({
  text: "Analyze Message",
  icon: "🔍",
  variant: "primary", // "primary" | "secondary" | "outline" | "ghost" | "safe" | "danger"
  size: "md",        // "sm" | "md" | "lg"
  onClick: () => { ... }
});

// 2. Badge (Color + Symbol for Accessibility)
const badge = createBadge({
  text: "High Risk Scam",
  variant: "danger" // "safe" | "warn" | "danger" | "info"
});

// 3. Card
const card = createCard({
  title: "Electricity Disconnection SMS",
  subtitle: "Category: Phishing SMS",
  badge: badge,
  body: "<p>Suspicious message content...</p>",
  footer: btn,
  interactive: true,
  highlight: "danger"
});

// 4. Progress Bar
const progressBar = createProgressBar({
  value: 75,
  max: 100,
  label: "UPI Defense Readiness",
  variant: "safe"
});
progressBar.setValue(85); // Dynamic update

// 5. Toast Notification
showToast({
  title: "OTP Protected",
  message: "You correctly refused to share your OTP!",
  type: "safe", // "safe" | "warn" | "danger" | "info"
  duration: 4000
});

// 6. Accessible Modal
const modal = createModal({
  title: "Scam Verification Sandbox",
  content: "<p>Simulated phone call incoming...</p>",
  footerButtons: [
    createButton({ text: "Hang Up", variant: "danger", onClick: () => modal.close() })
  ]
});
modal.open();
```

---

## 4. Multilingual (i18n) Integration

When adding new strings, add keys to all 7 language dictionaries in `src/locales/`:
1. `src/locales/en/common.js` (English)
2. `src/locales/hi/common.js` (Hindi - हिन्दी)
3. `src/locales/mr/common.js` (Marathi - मराठी)
4. `src/locales/ta/common.js` (Tamil - தமிழ்)
5. `src/locales/te/common.js` (Telugu - తెలుగు)
6. `src/locales/gu/common.js` (Gujarati - ગુજરાતી)
7. `src/locales/pa/common.js` (Punjabi - ਪੰਜਾਬੀ)

Usage in JavaScript:
```javascript
import { t } from '../i18n/i18n.js';

const translated = t("dash_welcome");
```

Usage in HTML templates:
```html
<span data-i18n="btn_scan">Scan</span>
```

---

## 5. Global State Management

```javascript
import { getState, setState, subscribe } from '../app/state.js';

// Read state
const state = getState();
console.log(state.user.awarenessScore);

// Update state
setState({
  user: {
    ...state.user,
    awarenessScore: state.user.awarenessScore + 10
  }
});

// Subscribe to score updates
const unsubscribe = subscribe("user", (newUserState) => {
  console.log("Score updated to:", newUserState.awarenessScore);
});
```
