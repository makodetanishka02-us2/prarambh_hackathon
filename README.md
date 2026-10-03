# ConVerse — Financial Scam Simulator & Awareness Engine
> **PS-10 Prototype Foundation & Shared Application Shell**  
> **Foundation Owner:** Tanishka

---

## 1. Overview

**ConVerse** is a mobile-first, installable web application (PWA) designed for India that teaches citizens how to recognize, simulate, and defend against financial cyber fraud (UPI scams, phishing SMS, fake video/call imposter traps, part-time job scams, and high-return investment fraud).

### Core Features Built in the Shared Shell:
1. **Mobile-First App Shell**: Responsive layout optimized for ~360px mobile viewports up to desktop.
2. **Warm Approachable Design System**: Curated mocha & warm linen palette (`#6F4E37`, `#F5EBDD`) with 12–16px rounded corners and subtle warm shadows (no pure white/grey main backgrounds).
3. **7 Indian Regional Languages (i18n)**:
   - English (`en`)
   - Hindi (`hi` / हिन्दी)
   - Marathi (`mr` / मराठी)
   - Tamil (`ta` / தமிழ்)
   - Telugu (`te` / తెలుగు)
   - Gujarati (`gu` / ગુજરાતી)
   - Punjabi (`pa` / ਪੰਜਾਬੀ - Gurmukhi)
4. **Shared UI Component Library**: Button, Chip, Card, Badge (symbol + color for accessibility), Tabs, Accessible Modal, Progress Bar, and Toast Notifications.
5. **Interactive UI Styleguide**: Live interactive component laboratory at `/#styleguide`.
6. **Engine Contracts for Teammates**: Modular contract interfaces in `src/engine/` ready for scam intelligence, risk radar, sandbox scenarios, and safety playbooks.
7. **PWA Offline Ready**: Web App Manifest, Service Worker caching, and touch-friendly controls.
8. **Local Node.js + Express Backend**: REST API endpoints for health, scenarios, languages, and radar intelligence.

---

## 2. Technology Stack

* **Frontend:** HTML5, Vanilla CSS3 (Custom Design Tokens), Vanilla JavaScript (ES Modules)
* **Backend:** Node.js + Express
* **State Management:** Reactive Pub/Sub Local State + `localStorage` persistence
* **Routing:** Client-side Hash Router (`#dashboard`, `#simulator`, `#safety-tips`, `#progress`, `#settings`, `#styleguide`)
* **PWA:** Web App Manifest + Service Worker

> **Strict Prototype Rule:** No heavy frameworks (React, Vue, TypeScript, Tailwind, MongoDB, Docker, GraphQL, etc.) to ensure zero bloat, instant startup, and full interoperability.

---

## 3. Project Structure

```text
/
├── index.html                    # Main HTML shell with SEO and multilingual fonts
├── package.json                  # Dependencies & scripts
├── README.md                     # Project documentation
├── CONTRACTS.md                  # Teammate API and integration guide
├── sw.js                         # PWA Service Worker
│
├── public/
│   ├── manifest.webmanifest      # PWA App Manifest
│   ├── icons/                    # App icons (192px, 512px SVG)
│   └── fonts/                    # Fallback font references
│
├── src/
│   ├── app/
│   │   ├── app.js                # Application entrypoint & bootstrapper
│   │   ├── router.js             # Client-side hash router
│   │   └── state.js              # Global state manager with pub/sub
│   │
│   ├── components/               # Pure Vanilla JS UI Component Helpers
│   │   ├── button.js             # Button (primary, secondary, outline, safe, danger)
│   │   ├── chip.js               # Chip (tags, filters, categories, removable)
│   │   ├── card.js               # Card (interactive, highlight borders, header/footer)
│   │   ├── badge.js              # Badge (symbol + color for safe, warn, danger, info)
│   │   ├── tabs.js               # Tabs (accessible ARIA tablist with horizontal scroll)
│   │   ├── modal.js              # Accessible Modal (focus trap, ESC close, backdrop blur)
│   │   ├── progress.js           # Progress Bar (linear, dynamic setValue method)
│   │   └── toast.js              # Toast Notifications (safe, warn, danger, info)
│   │
│   ├── pages/                    # Modular Page Views
│   │   ├── dashboard.js          # Dashboard with Quick Scanner & Threat Radar
│   │   ├── simulator.js          # Scam Simulator with category filters & sandbox modal
│   │   ├── safety-tips.js        # Safety Tips with emergency 1930 banner & search
│   │   ├── progress.js           # Defense Score, Vulnerability Radar & Badges
│   │   ├── settings.js           # 7-Language selector, offline mode & data reset
│   │   └── styleguide.js         # Interactive Component Styleguide (/styleguide)
│   │
│   ├── engine/                   # Teammate Engine Contracts (Stubs)
│   │   ├── detect/               # Scam Detection & Indicator Analysis contract
│   │   ├── radar/                # Scam Risk Radar & Threat Trends contract
│   │   ├── sim/                  # Simulation Sandbox Execution contract
│   │   └── tips/                 # Safety Playbooks contract
│   │
│   ├── data/
│   │   └── initial-data.js       # Shared mock scenarios, threats & helplines
│   │
│   ├── locales/                  # 7 Language Dictionaries
│   │   ├── en/common.js          # English
│   │   ├── hi/common.js          # Hindi (हिन्दी)
│   │   ├── mr/common.js          # Marathi (मराठी)
│   │   ├── ta/common.js          # Tamil (தமிழ்)
│   │   ├── te/common.js          # Telugu (తెలుగు)
│   │   ├── gu/common.js          # Gujarati (ગુજરાતી)
│   │   └── pa/common.js          # Punjabi (ਪੰਜਾਬੀ - Gurmukhi)
│   │
│   ├── styles/                   # Design System CSS
│   │   ├── tokens.css            # Palette, typography, spacing, radii, shadows
│   │   ├── base.css              # Reset, font scripts, utility classes, animations
│   │   ├── components.css        # Component styling (.cv-btn, .cv-card, .cv-modal, etc.)
│   │   └── layout.css            # Sticky header, mobile bottom nav, responsive grid
│   │
│   └── i18n/
│       └── i18n.js               # Translation engine & DOM updater
│
├── server/
│   └── server.js                 # Express server & local REST API endpoints
│
└── tests/
    └── test-runner.js            # Automated verification test suite
```

---

## 4. Quick Start & Local Execution

### Prerequisites
* Node.js (v18 or higher recommended)

### 1. Install Dependencies
```bash
cmd.exe /c "npm install"
# or
npm install
```

### 2. Run the Development Server
```bash
node server/server.js
# or
npm start
```

### 3. Open in Browser
* **App URL:** [http://localhost:3000](http://localhost:3000)
* **Interactive Styleguide:** [http://localhost:3000/#styleguide](http://localhost:3000/#styleguide)
* **REST API Health:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 4. Run Automated Test Suite
```bash
node tests/test-runner.js
# or
npm test
```

---

## 5. Design System Tokens Summary

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--color-primary` | `#6F4E37` | Mocha Warm Brand Identity |
| `--color-secondary` | `#C88A58` | Terracotta / Chai Clay Accent |
| `--color-background` | `#F5EBDD` | Warm Almond Linen Background (No pure white/grey) |
| `--color-surface` | `#FAF2E8` | Elevated warm container background |
| `--color-surface-card` | `#FDF7F0` | Card surface |
| `--color-text` | `#2B1D16` | Deep espresso readable text |
| `--color-safe` | `#2E7D32` | Verified Safe / Success |
| `--color-warn` | `#D97706` | Suspicious / Warning |
| `--color-danger` | `#C5221F` | High Risk Scam Alert |
| `--radius-md` | `14px` | Standard card and container radius |
| `--radius-full` | `9999px` | Badges, chips, and pills |

---

## 6. How Teammates Plug In Their Work

Please review [CONTRACTS.md](file:///c:/Users/TANISHKA/OneDrive/Desktop/prarambh_hackathon/CONTRACTS.md) for full details.

1. **Scam Detection Lead:** Implement detection logic in `src/engine/detect/detect-contract.js`.
2. **Threat Radar Lead:** Connect live metrics in `src/engine/radar/radar-contract.js`.
3. **Simulation Lead:** Build interactive dialogue branches in `src/engine/sim/sim-contract.js`.
4. **Safety Content Lead:** Add playbooks in `src/engine/tips/tips-contract.js`.

All UI components and helpers (`createButton`, `createCard`, `createBadge`, `showToast`, `createModal`) are pre-tested and available for immediate reuse.
