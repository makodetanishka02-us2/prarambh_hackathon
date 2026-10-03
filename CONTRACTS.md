# ConVerse — System Contracts & Architecture

**Problem Statement:** PS-10 — Financial Scam Simulator & Awareness Engine  
**Product:** ConVerse (Mobile-first Financial Scam Simulator for India)  
**Version:** 1.0.0 (Hackathon Prototype)

---

## 1. System Architecture Overview

ConVerse is built on a modular, deterministic, offline-capable architecture designed for mobile devices.

```text
┌─────────────────────────────────────────────────────────────┐
│                 App Shell & Navigation                      │
│             (Router, Layout, State, Theme, i18n)            │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
    ┌───────────▼─────────────┐   ┌───────────▼─────────────┐
    │     Simulator Page      │   │   Dashboard / Radar /   │
    │  (Interactive Mockup)   │   │   Scanner / Tips Pages  │
    └───────────┬─────────────┘   └─────────────────────────┘
                │
    ┌───────────▼───────────────────────────────────────────┐
    │               SCENARIO ENGINE (Rucha)                 │
    │  ┌───────────────────┐     ┌───────────────────────┐  │
    │  │  Scenario Schema  │     │   Scenario Validator  │  │
    │  ├───────────────────┤     ├───────────────────────┤  │
    │  │   State Machine   │     │    Scenario Scoring   │  │
    │  ├───────────────────┤     ├───────────────────────┤  │
    │  │ Persona Selector  │     │  Adaptive Difficulty  │  │
    │  └───────────────────┘     └───────────────────────┘  │
    │               Scenarios Dataset (S01 - S10)           │
    └───────────────────────────┬───────────────────────────┘
                                │
    ┌───────────────────────────▼───────────────────────────┐
    │            Shared Indicator Catalogue (I, U, L, S, E, R)
    └───────────────────────────────────────────────────────┘
```

---

## 2. Canonical Data Models

### 2.1 Indicator Dimensions & IDs
The system recognizes 6 core radar dimensions:
1. `urgency` (Prefix: `U`) — `U1`, `U2`, `U3`, `U4`, `U5`
2. `sender` (Prefix: `S`) — `S1`, `S2`, `S3`, `S4`
3. `link` (Prefix: `L`) — `L1`, `L2`, `L3`, `L4`, `L5`
4. `info` (Prefix: `I`) — `I1`, `I2`, `I3`, `I4`, `I5`, `I6`
5. `emotion` (Prefix: `E`) — `E1`, `E2`, `E3`, `E4`, `E5`
6. `reporting` (Prefix: `R`) — `R1`, `R2`, `R3`, `R4`

### 2.2 Scenario Schema
```typescript
interface ScenarioData {
  id: string; // e.g. 'S01'
  title: string;
  category: string;
  difficulty: 1 | 2 | 3;
  personas: Array<'student' | 'homemaker' | 'senior citizen' | 'shopkeeper' | 'salaried employee'>;
  summary: string;
  startNodeId: string;
  nodes: ScenarioNode[];
  result: {
    safeTakeaway: string;
    vulnerableTakeaway: string;
    preventionSteps: string[];
    officialHelpline: string;
  };
}

interface ScenarioNode {
  id: string;
  sender?: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  channel: 'sms' | 'whatsapp' | 'call' | 'app' | 'email';
  message: string;
  timeLimitSeconds?: number;
  redFlags?: RedFlagSpan[];
  choices: ScenarioChoice[];
  terminal?: boolean;
}

interface RedFlagSpan {
  id: string;
  text: string;
  indicatorId: string;
  explanation: string;
  startIndex?: number;
  endIndex?: number;
}

interface ScenarioChoice {
  id: string;
  label: string;
  nextNodeId: string | null;
  good: boolean;
  indicatorIds: string[];
  consequence: string;
  type?: 'action' | 'inspect' | 'report';
}
```

### 2.3 SimEvent Schema
```typescript
interface SimEvent {
  ts: number;
  scenarioId: string;
  nodeId: string;
  choiceId: string | null;
  good: boolean;
  tags: string[];
  confidence?: number;
  ms?: number;
  timedOut: boolean;
}
```

### 2.4 SimResult Schema
```typescript
interface SimResult {
  scenarioId: string;
  caught: number;
  missed: number;
  score: number; // 0.0 - 1.0 (safe against 0/0)
  scorePercentage: number; // 0 - 100
  recognizedIndicators: string[];
  missedIndicators: string[];
  events: SimEvent[];
  verdict: 'SAFE' | 'VULNERABLE' | 'COMPROMISED';
  takeaway: string;
}
```

---

## 3. Scenario Engine Public API

The `ScenarioEngine` class exposes the following deterministic methods:

- `startScenario(scenarioId: string, options?: object): ScenarioNode`
- `getCurrentNode(): ScenarioNode | null`
- `getAvailableChoices(): ScenarioChoice[]`
- `choose(choiceId: string, metadata?: { confidence?: number, ms?: number }): { nextNode: ScenarioNode | null, choice: ScenarioChoice, isComplete: boolean }`
- `handleTimeout(): { nextNode: ScenarioNode | null, isComplete: boolean }`
- `recordEvent(event: SimEvent): void`
- `isComplete(): boolean`
- `getResult(): SimResult`
- `reset(): void`
- `getHistory(): SimEvent[]`

### Selector API
- `selectScenarioForPersona(personaId: string, completedScenarioIds?: string[]): ScenarioData`
- `getAdaptiveRecommendation(userProfile: object): { nextScenarioId: string, reason: string, targetDifficulty: number }`

### Validator API
- `validateScenario(scenario: ScenarioData): { valid: boolean, errors: ValidationError[] }`
- `validateAllScenarios(scenarios: ScenarioData[]): { valid: boolean, errors: ValidationError[] }`

---

## 4. Scoring Logic

```text
Score = caught / (caught + missed)

Edge cases:
- When (caught + missed) === 0, score is 0.0 (0%).
- Verdict calculation:
  - 100% -> SAFE
  - 50% - 99% -> VULNERABLE
  - < 50% -> COMPROMISED
```

---

## 5. Local REST API Endpoints

- `GET /api/scenarios` — Returns all scenario metadata summaries
- `GET /api/scenarios/:id` — Returns full scenario definition with nodes and choices
- `POST /api/scenarios/validate` — Validates supplied scenario payload and returns validation issues
