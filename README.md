# ConVerse — Financial Scam Simulator & Awareness Engine

**Problem Statement 10:** Financial Scam Simulator & Awareness Engine  
**Target:** Indian mobile users (Shopkeepers, Students, Homemakers, Senior Citizens, Salaried Employees)  
**Stack:** Vanilla JavaScript (ES6+), HTML5, CSS3, Node.js (offline-capable).

---

## 🎯 Key Modules

1. **Scenario Engine (Owned by Rucha)**
   - 10 Realistic Scenarios (S01 to S10) covering UPI scams, KYC expiry, wrong transfers, digital arrest, fake job tasks, loan app extortion, fake customs parcel, stock tip groups, QR code scams, fake customer care.
   - Deterministic branching state machine.
   - Real-time caught/missed indicator tracking.
   - Persona-based prioritization and adaptive difficulty.
   - Automated graph & schema validator.
   - Timeout and urgency simulation.

2. **ConVerse Foundation & UI (Shared Baseline)**
   - Mobile-first responsive app shell with glassmorphism design.
   - Indian financial simulation context (UPI screens, SMS notifications, WhatsApp dialogues, caller overlays).
   - Test runner and deterministic testing suite.

---

## 🚀 Running the Project

### Start the server:
```bash
npm start
# Server starts at http://localhost:3000
```

### Run tests:
```bash
npm test
# or: node tests/test-runner.js
```

---

## 🛡️ Indian Context & Indicator Framework
ConVerse utilizes a 6-dimensional scam indicator matrix tailored to the Indian digital banking ecosystem:
- **U**: Urgency Pressure (Account block, countdowns, call isolation)
- **S**: Sender Legitimacy (Police, CBI, unverified toll-free, fake buyers)
- **L**: Link & App Integrity (Suspicious APKs, loan apps, phishing domains)
- **I**: Info & Access Sharing (UPI PIN to receive, OTP requests, AnyDesk remote access)
- **E**: Emotional Manipulation (Digital arrest fear, 500% stock returns, panic over wrong transfer)
- **R**: Reporting & Verification (1930 Cyber Helpline, bank blocking, independent branch check)
