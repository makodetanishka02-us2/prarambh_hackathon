# ConVerse — System Contracts & Architecture (PS-10)

**Problem Statement:** PS-10 — Financial Scam Simulator & Awareness Engine  
**Product:** ConVerse (Mobile-first Financial Scam Simulator & Awareness Platform for India)  
**Version:** 1.0.0 (Hackathon Prototype)  
**Authors:** Tanishka (Foundation & UI Shell), Rucha (Scenario Engine)

---

## 1. System Architecture Overview

ConVerse is built on a modular, deterministic, offline-first architecture designed specifically for Indian mobile users across key demographic personas.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       App Shell & Navigation                            │
│                 (Router, Layout, State, Theme, Personas)                │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
        ┌───────────▼─────────────┐       ┌───────────▼─────────────┐
        │     Simulator Page      │       │   Dashboard / Radar /   │
        │  (Interactive Mockup)   │       │   Tips / Progress Pages │
        └───────────┬─────────────┘       └─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────────────────┐
│                    SCENARIO ENGINE (Rucha's Ownership)                  │
│  ┌───────────────────────┐             ┌─────────────────────────────┐  │
│  │    Scenario Schema    │             │      Scenario Validator     │  │
│  │  (Canonical Model)    │             │  (Graph, Schema, Reachable) │  │
│  ├───────────────────────┤             ├─────────────────────────────┤  │
│  │  Deterministic State  │             │      Scenario Scoring       │  │
│  │   Machine (Engine)    │             │  (Safe Zero-Case, Verdicts) │  │
│  ├───────────────────────┤             ├─────────────────────────────┤  │
│  │   Persona Selector    │             │     Adaptive Difficulty     │  │
│  │(Rule-based Priorities)│             │ (Reinforcement Engine)      │  │
│  └───────────────────────┘             └─────────────────────────────┘  │
│                     Scenarios Dataset (S01 - S10)                       │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────┐
│             Shared Canonical Indicator Catalogue (6 Dimensions)         │
│          Urgency (U), Sender (S), Link (L), Info (I), Emotion (E),      │
│                            Reporting (R)                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Canonical Data Models

### 2.1 6-Dimensional Indicator Matrix (Shared Catalogue)
1. **Urgency (`U`)**: `U1` (Countdown Pressure), `U2` (Account Block Threat), `U3` (Limited Time Offer), `U4` (Arrest Threat Deadline), `U5` (Call Isolation Pressure).
2. **Sender (`S`)**: `S1` (Spoofed Header), `S2` (Law Enforcement / Police Impersonation), `S3` (Fake Customer Support), `S4` (Unknown Buyer / Mistaken Sender Claim).
3. **Link (`L`)**: `L1` (Suspicious / Shortened Link), `L2` (Sideloaded APK), `L3` (Phishing Portal), `L4` (Deceptive Domain / Non-HTTPS), `L5` (Predatory Loan App APK).
4. **Info Sharing (`I`)**: `I1` (OTP Request), `I2` (UPI PIN to Receive / Scan QR), `I3` (Card / CVV Request), `I4` (Intrusive Permissions), `I5` (Remote Screen-Sharing App), `I6` (Advance Deposit / Fee).
5. **Emotion (`E`)**: `E1` (Fear / Arrest / Intimidation), `E2` (Greed / Unrealistic Guaranteed Returns), `E3` (Family Emergency Sympathy), `E4` (Panic Over Wrong Transfer), `E5` (Social Proof in Groups).
6. **Reporting (`R`)**: `R1` (Cyber Helpline 1930), `R2` (Official Bank Freeze), `R3` (Independent Branch Check), `R4` (Block & Report Number).

---

## 3. Scenario Schema Specification

```javascript
{
  id: "S01",                     // Unique Scenario ID (S01 - S10)
  title: "...",                  // Human-readable title
  category: "...",               // Category (UPI Fraud, Extortion, etc.)
  difficulty: 1 | 2 | 3,         // Level 1 (Easy), 2 (Medium), 3 (Hard)
  personas: ["shopkeeper", ...], // Relevant target personas
  summary: "...",                // Brief overview
  startNodeId: "S01-N01",        // Root starting node ID
  nodes: [
    {
      id: "S01-N01",             // Unique node ID within scenario
      channel: "sms"|"whatsapp"|"call"|"app"|"email",
      sender: {
        name: "...",
        handle: "...",
        avatar: "...",
        verified: boolean
      },
      message: "...",            // Message content
      timeLimitSeconds: 25,      // Optional countdown timer (seconds)
      redFlags: [                // Red flag highlights
        {
          id: "RF-01",
          text: "...",           // Exact text matching message
          indicatorId: "U3",     // Mapped indicator ID
          explanation: "..."     // Educational explanation
        }
      ],
      choices: [
        {
          id: "S01-N01-C01",
          label: "...",          // Option label shown to user
          nextNodeId: "S01-N02", // Target node (or null for terminal)
          good: true,            // Decision evaluation (true: safe, false: fell for scam)
          indicatorIds: ["U3"],  // Tags evaluated
          consequence: "...",    // Consequence feedback
          type: "action"|"inspect"|"report"
        }
      ],
      terminal: false            // True if endpoint node
    }
  ],
  result: {
    safeTakeaway: "...",
    vulnerableTakeaway: "...",
    preventionSteps: ["...", "..."],
    officialHelpline: "1930 / cybercrime.gov.in"
  }
}
```

---

## 4. Scenario Engine API

### 4.1 State Machine API (`ScenarioEngine`)
```javascript
const engine = new ScenarioEngine();

// Start scenario
const startNode = engine.startScenario('S01');

// Query state
const currentNode = engine.getCurrentNode();
const choices = engine.getAvailableChoices();
const isDone = engine.isComplete();
const history = engine.getHistory();

// Make decision
const outcome = engine.choose(choiceId, { ms: 1200, confidence: 5 });
// Returns: { nextNode, choice, isComplete }

// Urgency Timeout
const timeoutOutcome = engine.handleTimeout();
// Returns: { nextNode, isComplete }

// Compute final score
const result = engine.getResult();
// Returns: SimResult { scenarioId, caught, missed, totalDecisions, score, scorePercentage, recognizedIndicators, missedIndicators, verdict, takeaway }

// Reset
engine.reset();
```

### 4.2 Scoring Formula & Safe Zero Handling
```text
Score = caught / (caught + missed)

Zero-case safeguard:
if (caught + missed === 0) {
  normalizedScore = 0.0;
  scorePercentage = 0;
}

Verdict:
- 100% score (and totalDecisions > 0) -> 'SAFE'
- 50% - 99% score -> 'VULNERABLE'
- < 50% score -> 'COMPROMISED'
```

### 4.3 Persona Selection & Adaptive Difficulty API
```javascript
// Get scenarios prioritized for persona
const prioritized = getPrioritizedScenarios('shopkeeper', allScenarios);

// Get adaptive recommendation
const recommendation = getAdaptiveRecommendation({
  persona: 'student',
  history: [ /* simulation history */ ]
}, allScenarios);
// Returns: { nextScenarioId: 'S06', reason: '...', targetDifficulty: 2 }
```

### 4.4 Scenario Validator API
```javascript
// Validate single scenario
const result = validateScenario(scenarioData);
// Returns: { valid: boolean, errors: Array<{ code, message, nodeId, choiceId }> }

// Validate all scenarios
const batchResult = validateAllScenarios(scenariosMap);
```

---

## 5. Completed Production Scenarios Dataset

| ID | Title | Category | Diff | Personas | Indicator Flags |
|---|---|---|:---:|---|---|
| **S01** | UPI Collect Request | UPI & Payment Fraud | 1 | Shopkeeper, Homemaker | `I2`, `U3`, `E2` |
| **S02** | Wrong Transfer / "Sent by Mistake" | UPI & Payment Fraud | 2 | Shopkeeper, Homemaker | `E4`, `S4`, `I2` |
| **S03** | Urgent KYC Expiry | Identity & Banking Phishing | 2 | Senior Citizen, Salaried | `U2`, `L1`, `I1`, `S1` |
| **S04** | Digital Arrest / CBI Crime Branch | Extortion & Authority Impersonation | 3 | Senior Citizen, Salaried | `S2`, `E1`, `U4`, `U5`, `I6` |
| **S05** | Task-Based Part-Time Job | Employment & Task Scams | 1 | Student, Homemaker | `E2`, `I6`, `E5` |
| **S06** | Instant Loan App / Blackmail | Predatory Lending & Blackmail | 2 | Student | `L5`, `I4`, `E1` |
| **S07** | Courier Parcel / Narcotics Customs | Customs & Parcel Extortion | 2 | Homemaker | `E1`, `S2`, `U5` |
| **S08** | Stock-Tip Group / 500% Returns | Investment & Trading Scams | 3 | Salaried, Student | `E2`, `E5`, `I6` |
| **S09** | QR Code Swap / "Scan to Receive" | Merchant & UPI Scams | 1 | Shopkeeper | `I2`, `S4` |
| **S10** | Fake Customer Care / AnyDesk | Remote Access & Impersonation | 2 | Homemaker, Senior Citizen | `S3`, `I5`, `I1` |

---

## 6. Local REST Endpoints

- `GET /api/scenarios` — Returns array of scenario summaries.
- `GET /api/scenarios/:id` — Returns full scenario definition with nodes, red flags, and choices.
- `POST /api/scenarios/validate` — Validates arbitrary scenario payload against contracts.
