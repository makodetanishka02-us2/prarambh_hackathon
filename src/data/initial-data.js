/**
 * ConVerse — Shared Canonical Data & Indicator Catalogue
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 */

const INDICATOR_DIMENSIONS = {
  urgency: {
    id: 'urgency',
    name: 'Urgency Pressure',
    description: 'Artificial deadlines, emergency calls, and immediate action threats.',
    codePrefix: 'U',
    color: '#EF4444' // red
  },
  sender: {
    id: 'sender',
    name: 'Sender Legitimacy',
    description: 'Impersonation of authorities, banks, couriers, or spoofed identifiers.',
    codePrefix: 'S',
    color: '#F59E0B' // amber
  },
  link: {
    id: 'link',
    name: 'Link & App Integrity',
    description: 'Suspicious URLs, unverified APKs, shortened links, and deceptive domains.',
    codePrefix: 'L',
    color: '#8B5CF6' // purple
  },
  info: {
    id: 'info',
    name: 'Info & Access Sharing',
    description: 'Requests for OTP, UPI PIN, passwords, screen sharing, or upfront deposits.',
    codePrefix: 'I',
    color: '#EC4899' // pink
  },
  emotion: {
    id: 'emotion',
    name: 'Emotional Manipulation',
    description: 'Fear, greed, guaranteed returns, panic, and fabricated social proof.',
    codePrefix: 'E',
    color: '#3B82F6' // blue
  },
  reporting: {
    id: 'reporting',
    name: 'Reporting & Verification',
    description: 'Verification via official 1930 portal, bank helpline, and blocking fraudulent actors.',
    codePrefix: 'R',
    color: '#10B981' // emerald
  }
};

const INDICATOR_CATALOGUE = {
  // Urgency Flags (U)
  'U1': {
    id: 'U1',
    dimension: 'urgency',
    code: 'U1',
    name: 'Immediate Countdown Pressure',
    description: 'Scammer imposes an arbitrary short countdown (e.g. 5 minutes) to force rushed action without thinking.'
  },
  'U2': {
    id: 'U2',
    dimension: 'urgency',
    code: 'U2',
    name: 'Account Block Threat',
    description: 'Threatens that bank account, SIM card, electricity connection, or UPI ID will be deactivated today.'
  },
  'U3': {
    id: 'U3',
    dimension: 'urgency',
    code: 'U3',
    name: 'Limited Time Deal / Cash Reward',
    description: 'Pressures target that reward, buyer deal, or prize will expire if not claimed within minutes.'
  },
  'U4': {
    id: 'U4',
    dimension: 'urgency',
    code: 'U4',
    name: 'Legal / Police Arrest Deadline',
    description: 'Claims arrest warrant is issued and must be settled immediately to avoid arrest.'
  },
  'U5': {
    id: 'U5',
    dimension: 'urgency',
    code: 'U5',
    name: 'Continuous Call / Isolation',
    description: 'Demands victim stay on call/video continuously without speaking to family or checking with anyone.'
  },

  // Sender Flags (S)
  'S1': {
    id: 'S1',
    dimension: 'sender',
    code: 'S1',
    name: 'Spoofed Bank / Service Header',
    description: 'SMS or message header mimicking official banks (e.g. "VK-SBIBNK-UPDATE") from unverified sources.'
  },
  'S2': {
    id: 'S2',
    dimension: 'sender',
    code: 'S2',
    name: 'Law Enforcement Impersonation',
    description: 'Impersonating Police officer, CBI agent, Customs official, or Cyber Crime department.'
  },
  'S3': {
    id: 'S3',
    dimension: 'sender',
    code: 'S3',
    name: 'Fake Customer Support',
    description: 'Unverified toll-free number or search-engine listing pretending to be airline, courier, or bank care.'
  },
  'S4': {
    id: 'S4',
    dimension: 'sender',
    code: 'S4',
    name: 'Unknown Buyer / Sender Claim',
    description: 'Unknown contact claiming accidental transfer or eager buyer demanding upfront settlement.'
  },

  // Link & App Flags (L)
  'L1': {
    id: 'L1',
    dimension: 'link',
    code: 'L1',
    name: 'Suspicious / Shortened Link',
    description: 'Links using bit.ly, ngrok, tinyurl, or fake subdomains like "sbi-kyc-verify.xyz".'
  },
  'L2': {
    id: 'L2',
    dimension: 'link',
    code: 'L2',
    name: 'Sideloaded / Unofficial APK',
    description: 'Direct APK file sent over WhatsApp or Telegram bypassing Google Play Store verification.'
  },
  'L3': {
    id: 'L3',
    dimension: 'link',
    code: 'L3',
    name: 'Phishing Portal',
    description: 'Lookalike bank login or payment screen designed to harvest credentials.'
  },
  'L4': {
    id: 'L4',
    dimension: 'link',
    code: 'L4',
    name: 'Deceptive Domain / Non-HTTPS',
    description: 'Domain misspellings (typosquatting) or insecure HTTP web forms.'
  },
  'L5': {
    id: 'L5',
    dimension: 'link',
    code: 'L5',
    name: 'Predatory Loan App Download',
    description: 'Unregistered instant loan app APK link not available on official app stores.'
  },

  // Info Sharing & Access Flags (I)
  'I1': {
    id: 'I1',
    dimension: 'info',
    code: 'I1',
    name: 'OTP / Verification Code Request',
    description: 'Direct request for OTP sent to your phone for banking, UPI, or account verification.'
  },
  'I2': {
    id: 'I2',
    dimension: 'info',
    code: 'I2',
    name: 'UPI PIN to "Receive" Money / QR Scan',
    description: 'Asking user to enter UPI PIN, scan QR code, or accept UPI Collect request under the guise of receiving money.'
  },
  'I3': {
    id: 'I3',
    dimension: 'info',
    code: 'I3',
    name: 'Card Details & CVV Request',
    description: 'Requesting 16-digit debit/credit card number, expiry date, and CVV.'
  },
  'I4': {
    id: 'I4',
    dimension: 'info',
    code: 'I4',
    name: 'Intrusive Mobile Permissions',
    description: 'Requesting access to contacts, SMS, photos, and location for malicious exploitation.'
  },
  'I5': {
    id: 'I5',
    dimension: 'info',
    code: 'I5',
    name: 'Screen-Sharing App Installation',
    description: 'Asking user to download AnyDesk, TeamViewer, RustDesk, or QuickSupport to "assist" remotely.'
  },
  'I6': {
    id: 'I6',
    dimension: 'info',
    code: 'I6',
    name: 'Advance Fee / Security Deposit',
    description: 'Demanding upfront deposit, registration fee, or wallet balance recharge before releasing earnings or loan.'
  },

  // Emotion Dimension (E)
  'E1': {
    id: 'E1',
    dimension: 'emotion',
    code: 'E1',
    name: 'Fear & Intimidation',
    description: 'Threats of immediate arrest, FIR, jail, police interrogation, or public shaming.'
  },
  'E2': {
    id: 'E2',
    dimension: 'emotion',
    code: 'E2',
    name: 'Greed / Unrealistic Guaranteed Returns',
    description: 'Promises of 200%-500% guaranteed stock returns, effortless work-from-home salary, or lottery jackpot.'
  },
  'E3': {
    id: 'E3',
    dimension: 'emotion',
    code: 'E3',
    name: 'Sympathy / Family Emergency',
    description: 'Emotional story about sudden hospital emergency, accident, or stranded relative.'
  },
  'E4': {
    id: 'E4',
    dimension: 'emotion',
    code: 'E4',
    name: 'Panic Over "Mistaken" Transfer',
    description: 'Creating frantic pressure claiming life savings were mistakenly transferred to your account.'
  },
  'E5': {
    id: 'E5',
    dimension: 'emotion',
    code: 'E5',
    name: 'Social Proof & FOMO in Groups',
    description: 'Multiple fake members celebrating large payouts and profits in WhatsApp/Telegram group.'
  },

  // Reporting & Verification Dimension (R)
  'R1': {
    id: 'R1',
    dimension: 'reporting',
    code: 'R1',
    name: 'Cyber Crime Helpline (1930)',
    description: 'Reporting immediately to 1930 / cybercrime.gov.in to freeze stolen funds within golden hour.'
  },
  'R2': {
    id: 'R2',
    dimension: 'reporting',
    code: 'R2',
    name: 'Official Bank Channel Verification',
    description: 'Freezing UPI ID, blocking debit card, and contacting bank through official app or verified number.'
  },
  'R3': {
    id: 'R3',
    dimension: 'reporting',
    code: 'R3',
    name: 'Independent Credential Verification',
    description: 'Verifying identity of police/customs/courier through official office branch, not provided links.'
  },
  'R4': {
    id: 'R4',
    dimension: 'reporting',
    code: 'R4',
    name: 'Block & Report Scam Channel',
    description: 'Reporting fraudulent phone number, UPI handle, or link to telecom authorities and in-app reporting.'
  }
};

const PERSONAS = {
  'student': {
    id: 'student',
    name: 'College Student',
    avatar: '🎓',
    description: 'Tech-savvy but vulnerable to part-time job scams, easy loans, and investment traps.',
    primaryVulnerabilities: ['E2', 'I6', 'L5'],
    prioritizedScenarios: ['S05', 'S06', 'S08']
  },
  'homemaker': {
    id: 'homemaker',
    name: 'Homemaker',
    avatar: '🏡',
    description: 'Manages household expenses, vulnerable to courier parcel threats, UPI payment confusions, and fake support.',
    primaryVulnerabilities: ['E1', 'S2', 'I2'],
    prioritizedScenarios: ['S07', 'S01', 'S10']
  },
  'senior citizen': {
    id: 'senior citizen',
    name: 'Senior Citizen',
    avatar: '👴',
    description: 'Targets of digital arrest intimidation, urgent KYC expiry warnings, and screen-sharing theft.',
    primaryVulnerabilities: ['U2', 'S2', 'I5'],
    prioritizedScenarios: ['S03', 'S04', 'S10']
  },
  'shopkeeper': {
    id: 'shopkeeper',
    name: 'Small Business / Shopkeeper',
    avatar: '🏪',
    description: 'Processes dozens of daily UPI/QR payments, vulnerable to QR swap scams, wrong transfers, and collect requests.',
    primaryVulnerabilities: ['I2', 'S4', 'E4'],
    prioritizedScenarios: ['S09', 'S01', 'S02']
  },
  'salaried employee': {
    id: 'salaried employee',
    name: 'Salaried Professional',
    avatar: '💼',
    description: 'Invests savings, vulnerable to high-return stock tip groups, digital arrest extortion, and KYC spoofing.',
    primaryVulnerabilities: ['E2', 'E5', 'S2'],
    prioritizedScenarios: ['S08', 'S04', 'S03']
  }
};

const SAFETY_TIPS = [
  {
    id: 'TIP-01',
    title: 'UPI PIN is ONLY for Paying',
    description: 'You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money.',
    dimension: 'info',
    relatedIndicators: ['I2']
  },
  {
    id: 'TIP-02',
    title: 'No Digital Arrests in India',
    description: 'Police, CBI, Customs, or Courts NEVER conduct investigations or arrests over Skype or WhatsApp video calls.',
    dimension: 'sender',
    relatedIndicators: ['S2', 'E1', 'U5']
  },
  {
    id: 'TIP-03',
    title: 'Never Share OTP or Screen',
    description: 'No bank or genuine company customer service will ever ask for OTP, PIN, or remote screen sharing (AnyDesk).',
    dimension: 'info',
    relatedIndicators: ['I1', 'I5', 'S3']
  },
  {
    id: 'TIP-04',
    title: 'Report on 1930 Immediately',
    description: 'If money is fraudulently debited, call 1930 or visit cybercrime.gov.in immediately within the golden hour to freeze funds.',
    dimension: 'reporting',
    relatedIndicators: ['R1', 'R2']
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    INDICATOR_DIMENSIONS,
    INDICATOR_CATALOGUE,
    PERSONAS,
    SAFETY_TIPS
  };
}

if (typeof window !== 'undefined') {
  window.ConVerseData = {
    INDICATOR_DIMENSIONS,
    INDICATOR_CATALOGUE,
    PERSONAS,
    SAFETY_TIPS
  };
}
