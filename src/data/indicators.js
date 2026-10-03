/**
 * ConVerse Shared Indicator Catalogue & Dimension Definitions
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Radar & Intelligence Engine Owner: Ananya
 *
 * 28-Indicator Standard Threat & Awareness Taxonomy
 * Grouped into 6 Core Awareness Dimensions:
 * 1. Urgency Resistance (U1–U5)
 * 2. Sender Verification (S1–S5)
 * 3. Link and URL Checking (L1–L6)
 * 4. Information Sharing (I1–I6)
 * 5. Emotional Manipulation (E1–E6)
 * 6. Reporting Habit (R1–R4)
 */

export const SIX_DIMENSIONS = [
  {
    key: "urgency",
    id: "urgency",
    name: "Urgency resistance",
    meaning: "Do I stay calm when pushed to act fast?",
    indicators: ["U1", "U2", "U3", "U4", "U5"]
  },
  {
    key: "sender",
    id: "sender",
    name: "Sender verification",
    meaning: "Do I check who is really contacting me?",
    indicators: ["S1", "S2", "S3", "S4", "S5"]
  },
  {
    key: "link",
    id: "link",
    name: "Link and URL checking",
    meaning: "Do I notice fake links, apps and domains?",
    indicators: ["L1", "L2", "L3", "L4", "L5", "L6"]
  },
  {
    key: "information",
    id: "information",
    name: "Information sharing",
    meaning: "Do I keep secrets and refuse to pay to earn?",
    indicators: ["I1", "I2", "I3", "I4", "I5", "I6"]
  },
  {
    key: "emotion",
    id: "emotion",
    name: "Emotional manipulation",
    meaning: "Do fear, greed, love or sympathy cloud my judgement?",
    indicators: ["E1", "E2", "E3", "E4", "E5", "E6"]
  },
  {
    key: "reporting",
    id: "reporting",
    name: "Reporting habit",
    meaning: "Do I verify, block, report and tell family?",
    indicators: ["R1", "R2", "R3", "R4"]
  }
];

export const INDICATOR_CATALOGUE = [
  // 1. Urgency Resistance (U1–U5)
  {
    id: "U1",
    code: "U1",
    dimension: "urgency",
    name: "Artificial Countdown / Deadline",
    description: "Creates artificial panic with a strict countdown or same-day deadline (e.g., 'within 15 minutes', 'by 9:30 PM tonight').",
    weight: 4
  },
  {
    id: "U2",
    code: "U2",
    dimension: "urgency",
    name: "Immediate Loss / Cutoff Threat",
    description: "Threatens immediate disconnection of electricity, SIM card expiry, or bank account suspension.",
    weight: 4
  },
  {
    id: "U3",
    code: "U3",
    dimension: "urgency",
    name: "Panic Inducement",
    description: "High-pressure psychological tactics forcing immediate compliance before thinking or consulting others.",
    weight: 3
  },
  {
    id: "U4",
    code: "U4",
    dimension: "urgency",
    name: "Limited-Time Financial Offer (FOMO)",
    description: "Fabricated exclusive financial rewards, lottery winnings, or cashback expiring shortly.",
    weight: 3
  },
  {
    id: "U5",
    code: "U5",
    dimension: "urgency",
    name: "Instant Callback Demand",
    description: "Demands an immediate callback or message response without independent verification.",
    weight: 3
  },

  // 2. Sender Verification (S1–S5)
  {
    id: "S1",
    code: "S1",
    dimension: "sender",
    name: "Personal Mobile Number for Official Alert",
    description: "Official institutional or utility alerts delivered via standard 10-digit personal mobile numbers.",
    weight: 4
  },
  {
    id: "S2",
    code: "S2",
    dimension: "sender",
    name: "Header Spoofing / Unfamiliar Sender ID",
    description: "Unregistered, lookalike, or suspicious SMS sender headers (e.g., VM-POWDIS, AD-SBIUPD).",
    weight: 4
  },
  {
    id: "S3",
    code: "S3",
    dimension: "sender",
    name: "Unofficial Communication Channel",
    description: "Using WhatsApp, Telegram, or social media for formal banking, legal, or government communications.",
    weight: 5
  },
  {
    id: "S4",
    code: "S4",
    dimension: "sender",
    name: "Authority Impersonation / 'Digital Arrest'",
    description: "Impersonating Police, Customs, CBI, or RBI officers to demand money or video verification.",
    weight: 5
  },
  {
    id: "S5",
    code: "S5",
    dimension: "sender",
    name: "Generic Unpersonalized Greeting",
    description: "Generic salutations ('Dear Customer') from an entity claiming to manage your specific account.",
    weight: 2
  },

  // 3. Link and URL Checking (L1–L6)
  {
    id: "L1",
    code: "L1",
    dimension: "link",
    name: "Domain Lookalike / Typosquatting",
    description: "Misspelled or misleading domains mimicking trusted banking or government portals (e.g. icic-bank.co).",
    weight: 5
  },
  {
    id: "L2",
    code: "L2",
    dimension: "link",
    name: "Shortened / Obfuscated Link",
    description: "URL shorteners (bit.ly, tinyurl, is.gd) masking the actual destination URL.",
    weight: 4
  },
  {
    id: "L3",
    code: "L3",
    dimension: "link",
    name: "Insecure / Suspicious Subdomain or IP",
    description: "Non-HTTPS link, raw numerical IP address, or deceptive nested subdomain.",
    weight: 4
  },
  {
    id: "L4",
    code: "L4",
    dimension: "link",
    name: "Direct APK Sideload Link",
    description: "Prompts to download and install an Android APK package from outside Google Play Store.",
    weight: 5
  },
  {
    id: "L5",
    code: "L5",
    dimension: "link",
    name: "Disguised Payment QR Code",
    description: "Sending a payment collect QR code under the pretext of 'scan to receive money' or refund.",
    weight: 5
  },
  {
    id: "L6",
    code: "L6",
    dimension: "link",
    name: "Remote Screen-Share Request",
    description: "Instructions to install remote management software (AnyDesk, TeamViewer, RustDesk, QuickSupport).",
    weight: 5
  },

  // 4. Information Sharing (I1–I6)
  {
    id: "I1",
    code: "I1",
    dimension: "information",
    name: "UPI PIN Solicitation",
    description: "Request to enter UPI PIN to receive funds, process refunds, or claim cashback rewards.",
    weight: 5
  },
  {
    id: "I2",
    code: "I2",
    dimension: "information",
    name: "OTP / 2FA Solicitation",
    description: "Demanding one-time passwords over phone calls, SMS forwarding, or chat.",
    weight: 5
  },
  {
    id: "I3",
    code: "I3",
    dimension: "information",
    name: "Card CVV / ATM PIN / Banking Password",
    description: "Soliciting debit/credit card CVV, expiry date, ATM PIN, or Netbanking passwords.",
    weight: 5
  },
  {
    id: "I4",
    code: "I4",
    dimension: "information",
    name: "Upfront Fee / Security Deposit Demand",
    description: "Demanding advance payments, processing fees, or 'recharges' to unlock tasks, loans, or lottery.",
    weight: 4
  },
  {
    id: "I5",
    code: "I5",
    dimension: "information",
    name: "Sensitive Identity Document Solicitation",
    description: "Requesting photos of Aadhaar, PAN card, or passport outside authorized KYC portals.",
    weight: 4
  },
  {
    id: "I6",
    code: "I6",
    dimension: "information",
    name: "Full Bank Account / KYC Solicitation",
    description: "Demanding complete banking credentials under the pretext of mandatory KYC update.",
    weight: 4
  },

  // 5. Emotional Manipulation (E1–E6)
  {
    id: "E1",
    code: "E1",
    dimension: "emotion",
    name: "Fear & Legal Intimidation",
    description: "Exploiting fear of arrest, police custody, customs seizure, or criminal proceedings.",
    weight: 5
  },
  {
    id: "E2",
    code: "E2",
    dimension: "emotion",
    name: "Greed & Unrealistic Payouts",
    description: "Promises of exorbitant daily income (₹3000/day for video likes) or guaranteed high investment returns.",
    weight: 4
  },
  {
    id: "E3",
    code: "E3",
    dimension: "emotion",
    name: "Romance & Trust Exploitation",
    description: "Building fake emotional or romantic bonds to extract financial help or fake investments.",
    weight: 4
  },
  {
    id: "E4",
    code: "E4",
    dimension: "emotion",
    name: "Sympathy & Emergency Distress Plea",
    description: "Impersonating friends, relatives, or acquaintances facing medical or travel emergencies.",
    weight: 3
  },
  {
    id: "E5",
    code: "E5",
    dimension: "emotion",
    name: "Fabricated Social Proof",
    description: "Displaying fake payout screenshots, rigged balance sheets, or paid group members praising profits.",
    weight: 3
  },
  {
    id: "E6",
    code: "E6",
    dimension: "emotion",
    name: "Isolation & Secrecy Tactics",
    description: "Demanding the victim remain on call and not discuss the matter with family, friends, or advisors.",
    weight: 4
  },

  // 6. Reporting Habit (R1–R4)
  {
    id: "R1",
    code: "R1",
    dimension: "reporting",
    name: "Independent Official Verification",
    description: "Verified the alert directly via authorized official banking app or branch.",
    weight: 3
  },
  {
    id: "R2",
    code: "R2",
    dimension: "reporting",
    name: "Blocked Suspicious Entity",
    description: "Blocked fraudulent sender, phone number, or social media handle immediately.",
    weight: 3
  },
  {
    id: "R3",
    code: "R3",
    dimension: "reporting",
    name: "Reported to 1930 / Cybercrime Portal",
    description: "Reported the fraud attempt to National Cyber Crime Helpline 1930 / cybercrime.gov.in.",
    weight: 4
  },
  {
    id: "R4",
    code: "R4",
    dimension: "reporting",
    name: "Informed Family / Community",
    description: "Shared details of the scam attempt with family and peers to protect others.",
    weight: 3
  }
];

// Fast lookup indices
export const INDICATORS_BY_ID = new Map();
export const INDICATORS_BY_DIMENSION = new Map();

INDICATOR_CATALOGUE.forEach(ind => {
  INDICATORS_BY_ID.set(ind.id.toUpperCase(), ind);
  INDICATORS_BY_ID.set(ind.id.toLowerCase(), ind);

  if (!INDICATORS_BY_DIMENSION.has(ind.dimension)) {
    INDICATORS_BY_DIMENSION.set(ind.dimension, []);
  }
  INDICATORS_BY_DIMENSION.get(ind.dimension).push(ind);
});

/**
 * Retrieve indicator definition by ID
 * @param {string} id - Indicator ID (e.g., 'U1', 'I2')
 * @returns {Object|null}
 */
export function getIndicator(id) {
  if (!id) return null;
  return INDICATORS_BY_ID.get(String(id).toUpperCase()) || null;
}

/**
 * Retrieve all indicators for a specific dimension
 * @param {string} dimension - Dimension key
 * @returns {Array<Object>}
 */
export function getIndicatorsByDimension(dimension) {
  return INDICATORS_BY_DIMENSION.get(dimension) || [];
}
