/**
 * ConVerse Shared Data — Scenarios, Categories & Safety Guides
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 */

export const CORE_CATEGORIES = [
  {
    id: "all",
    label: "All Scenarios",
    icon: "🌐",
    description: "Browse all realistic financial scam simulations."
  },
  {
    id: "upi",
    label: "UPI & Payment Fraud",
    icon: "💳",
    description: "Fake QR codes, collect requests, and scan-to-receive money traps."
  },
  {
    id: "kyc",
    label: "Bank & KYC Scams",
    icon: "🏦",
    description: "Urgent bank account blocking alerts, fake APKs, and SIM expiration threats."
  },
  {
    id: "investment",
    label: "Investment Scams",
    icon: "📈",
    description: "Guaranteed high returns, fake stock trading groups, and crypto schemes."
  },
  {
    id: "loan",
    label: "Loan Scams",
    icon: "📑",
    description: "Instant pre-approved loans demanding upfront processing fees."
  },
  {
    id: "phishing",
    label: "Phishing",
    icon: "✉️",
    description: "Electricity bill disconnection notices and fake reward claim links."
  },
  {
    id: "job",
    label: "Job / Task Scams",
    icon: "💼",
    description: "Part-time work from home, video liking, and prepaid deposit tasks."
  }
];

// Alias for backwards compatibility
export const SAMPLE_CATEGORIES = CORE_CATEGORIES;

export const REALISTIC_SCENARIOS = [
  {
    id: "sim-upi-qr-1",
    categoryId: "upi",
    categoryLabel: "UPI & Payment Fraud",
    title: "Marketplace Buyer 'Scan QR to Receive Money'",
    channel: "upi",
    difficulty: "Medium",
    decisionCount: 2,
    timeMinutes: 3,
    shortDescription: "A buyer on an online marketplace claims they sent an advance payment and asks you to scan a QR code and enter your PIN.",
    sender: "Buyer: Rajiv Kumar (OLX / Marketplace)",
    simulatedContent: {
      type: "upi_collect",
      vpa: "merchant.paytm@paytm",
      payeeName: "RAJIV ENTERPRISES",
      amount: "₹4,500",
      note: "REFUND / ADVANCE PAYMENT FOR FURNITURE",
      promptMessage: "I have generated a collect request QR. Scan it and enter your UPI PIN so the money gets credited to your bank account."
    },
    warningSigns: [
      "UPI PIN is requested for receiving money (PIN is ONLY used to send money or check balance).",
      "Collect request creates a DEBIT on your account, not a credit.",
      "Buyer refuses cash or standard bank transfer."
    ],
    choices: [
      {
        id: "choice-scan-pin",
        text: "Scan the QR code and enter UPI PIN to claim the ₹4,500",
        isSafe: false,
        feedback: {
          title: "Warning Sign Missed",
          desc: "Entering your UPI PIN authorizes a withdrawal from your bank account. You never need to enter a PIN to receive money.",
          saferOption: "Refuse the collect request. Inform the buyer that receiving money only requires sharing your UPI ID or phone number.",
          whyItMattered: "Scammers use reverse collect requests to drain victim accounts under the guise of paying advances."
        }
      },
      {
        id: "choice-refuse-verify",
        text: "Refuse the QR code and remind the buyer that receiving money requires no PIN",
        isSafe: true,
        feedback: {
          title: "Safe Decision",
          desc: "You correctly recognized the core rule of UPI: Receiving money NEVER requires entering a UPI PIN or scanning a collect QR code.",
          saferOption: "You made the safest choice.",
          whyItMattered: "By refusing to authorize the transaction with your PIN, you prevented ₹4,500 from being debited."
        }
      },
      {
        id: "choice-report",
        text: "Decline the request and block the buyer on the marketplace",
        isSafe: true,
        feedback: {
          title: "Safe Decision",
          desc: "Decline the transaction immediately and report the suspicious profile.",
          saferOption: "You protected your funds.",
          whyItMattered: "Reporting stops the fraudulent VPA from trapping other sellers."
        }
      }
    ],
    redFlags: [
      { id: "rf-1", text: "Demand for UPI PIN to receive money", caughtByDefault: false },
      { id: "rf-2", text: "Collect request disguised as payment credit", caughtByDefault: false }
    ],
    stoppingPoint: "Refusing to enter the UPI PIN stops the fraud before any funds leave your account."
  },
  {
    id: "sim-electricity-bill-1",
    categoryId: "phishing",
    categoryLabel: "Phishing",
    title: "Urgent Electricity Disconnection Notice",
    channel: "sms",
    difficulty: "Easy",
    decisionCount: 2,
    timeMinutes: 2,
    shortDescription: "An SMS arrives stating your electricity power will be disconnected at 9:30 PM tonight unless you call an unknown number.",
    sender: "SMS: VM-POWDIS",
    simulatedContent: {
      type: "sms",
      senderId: "VM-POWDIS",
      timestamp: "Today, 4:45 PM",
      message: "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Please immediately contact our electricity officer Mr. Sharma at 98765-XXXXX. Thank you."
    },
    warningSigns: [
      "Sent from a personal or non-official sender ID.",
      "Artificial panic with a tight same-day deadline (9:30 PM).",
      "Asks you to call a personal 10-digit mobile number instead of the official power board portal."
    ],
    choices: [
      {
        id: "choice-call-number",
        text: "Call the phone number in the SMS to avoid power disconnection",
        isSafe: false,
        feedback: {
          title: "Warning Sign Missed",
          desc: "Calling the number connects you directly to a fraudster who will ask you to install a remote-access app or make a ₹10 test payment.",
          saferOption: "Check your official power utility bill on their authorized app or website directly.",
          whyItMattered: "Electricity boards never send disconnection notices via personal mobile numbers with same-day deadlines."
        }
      },
      {
        id: "choice-check-official-app",
        text: "Ignore the SMS and check bill status on the official electricity provider portal",
        isSafe: true,
        feedback: {
          title: "Safe Decision",
          desc: "You identified the artificial urgency and verified your account balance through the verified official channel.",
          saferOption: "You made the safest choice.",
          whyItMattered: "Direct verification eliminates 100% of SMS phishing risk."
        }
      }
    ],
    redFlags: [
      { id: "rf-1", text: "Artificial urgency with same-day cutoff threat", caughtByDefault: false },
      { id: "rf-2", text: "Personal 10-digit mobile number for official billing", caughtByDefault: false }
    ],
    stoppingPoint: "Checking your bill directly on the official utility website breaks the phishing trap."
  },
  {
    id: "sim-fedex-police-1",
    categoryId: "kyc",
    categoryLabel: "Bank & KYC Scams",
    title: "Customs & 'Digital Arrest' Threat Call",
    channel: "call",
    difficulty: "Hard",
    decisionCount: 3,
    timeMinutes: 4,
    shortDescription: "A caller claims a parcel under your name was seized containing illegal goods, followed by a video call threatening arrest unless you transfer funds.",
    sender: "Incoming Call: Mumbai Cyber Cell / Customs",
    simulatedContent: {
      type: "call",
      callerName: "Officer Vikram Singh (Customs Dept)",
      callDuration: "01:24",
      transcript: "We have intercepted a FedEx parcel from Mumbai to Taipei containing 5 passports and contraband linked to your Aadhaar. You must stay on this video call for digital verification and transfer your funds to the RBI verification escrow account."
    },
    warningSigns: [
      "There is NO legal concept of 'Digital Arrest' under Indian law.",
      "Police and customs officers NEVER demand money transfers to verify identity.",
      "Official summons are delivered in writing, not via WhatsApp video calls."
    ],
    choices: [
      {
        id: "choice-transfer-verification",
        text: "Transfer money to the suggested 'verification escrow account' to clear your name",
        isSafe: false,
        feedback: {
          title: "Warning Sign Missed",
          desc: "Police, CBI, and RBI never ask citizens to transfer money to 'safe' or 'escrow' accounts for verification.",
          saferOption: "Disconnect the call immediately. Report the incident on cybercrime.gov.in or call 1930.",
          whyItMattered: "Digital arrest scams rely on intimidation and fear of authority to force rapid financial transfers."
        }
      },
      {
        id: "choice-disconnect-1930",
        text: "Disconnect the call immediately and report the number to 1930",
        isSafe: true,
        feedback: {
          title: "Safe Decision",
          desc: "You recognized the digital arrest tactic. No government body conducts judicial investigations or money transfers over video calls.",
          saferOption: "You made the safest choice.",
          whyItMattered: "Hanging up stops the psychological intimidation before any credentials or money are transferred."
        }
      }
    ],
    redFlags: [
      { id: "rf-1", text: "Claim of 'Digital Arrest' (does not exist in law)", caughtByDefault: false },
      { id: "rf-2", text: "Demand for financial transfer to 'clear' investigation", caughtByDefault: false }
    ],
    stoppingPoint: "Disconnecting the video call breaks the isolation and fear tactic."
  },
  {
    id: "sim-part-time-job-1",
    categoryId: "job",
    categoryLabel: "Job / Task Scams",
    title: "Telegram 'Like Videos & Earn ₹3,000/Day'",
    channel: "sms",
    difficulty: "Medium",
    decisionCount: 2,
    timeMinutes: 3,
    shortDescription: "A message invites you to earn daily income by rating products and liking videos, which soon requires an upfront deposit.",
    sender: "Telegram: Global Marketing HR",
    simulatedContent: {
      type: "sms",
      senderId: "TELEGRAM HR",
      timestamp: "Today, 11:20 AM",
      message: "Congratulations! You have been selected for Part-Time rating work. Earn ₹50 to ₹150 per task from home. To unlock premium tasks with ₹5,000 payout, deposit ₹1,000 security recharge."
    },
    warningSigns: [
      "Legitimate jobs never require employees to pay money to get paid.",
      "Promises disproportionately high earnings for trivial tasks.",
      "Redirection to anonymous Telegram channels."
    ],
    choices: [
      {
        id: "choice-deposit-job",
        text: "Pay the ₹1,000 deposit to unlock higher paying rating tasks",
        isSafe: false,
        feedback: {
          title: "Warning Sign Missed",
          desc: "Prepaid task scams take your deposit and demand progressively larger sums (₹5k, ₹20k) without ever allowing withdrawals.",
          saferOption: "Decline and exit the group. Never pay money upfront for employment.",
          whyItMattered: "Employment fraud preys on individuals seeking flexible income by fabricating initial small payouts."
        }
      },
      {
        id: "choice-reject-job",
        text: "Refuse the deposit and leave the Telegram group",
        isSafe: true,
        feedback: {
          title: "Safe Decision",
          desc: "You recognized that paying upfront deposits for a job is the defining indicator of employment fraud.",
          saferOption: "You protected your funds.",
          whyItMattered: "Exiting early avoids the sunk-cost trap of escalating deposits."
        }
      }
    ],
    redFlags: [
      { id: "rf-1", text: "Upfront security fee required for job tasks", caughtByDefault: false },
      { id: "rf-2", text: "Unrealistic earnings for trivial automated actions", caughtByDefault: false }
    ],
    stoppingPoint: "Refusing the first deposit stops the financial escalation."
  }
];

// Alias for backwards compatibility with existing engine tests
export const SAMPLE_SCENARIOS = REALISTIC_SCENARIOS;

export const SAFETY_GUIDES_DATA = [
  {
    id: "guide-upi",
    title: "UPI & QR Code Safety",
    category: "upi",
    categoryLabel: "UPI & Payments",
    whatToWatchFor: "Requests to scan QR codes or enter your UPI PIN to 'receive' money, refunds, lottery prizes, or marketplace buyer payments.",
    dos: [
      "Remember: Entering your UPI PIN is ONLY required to SEND money or check account balance.",
      "Verify the payee name on your banking app before confirming any payment.",
      "Set daily transaction limits on your UPI app for added security."
    ],
    donts: [
      "NEVER enter your UPI PIN to claim cashback, rewards, or incoming transfers.",
      "NEVER scan QR codes sent via WhatsApp or marketplace chats to 'accept' money.",
      "DO NOT share UPI registration SMS or debit card details with anyone."
    ]
  },
  {
    id: "guide-otp",
    title: "OTP & Credential Protection",
    category: "kyc",
    categoryLabel: "Bank & KYC",
    whatToWatchFor: "Calls from individuals claiming to be bank managers, KYC officers, or telecom agents asking for OTPs to prevent account deactivation.",
    dos: [
      "Always read the full OTP SMS: check the amount and merchant name mentioned.",
      "Contact your bank directly via the number printed on your physical debit card.",
      "Enable two-factor authentication with authenticator apps where supported."
    ],
    donts: [
      "NEVER read out OTPs or passwords over phone calls, even to 'bank officials'.",
      "DO NOT forward SMS or verification codes to unknown numbers.",
      "DO NOT approve unknown device login notifications."
    ]
  },
  {
    id: "guide-phishing",
    title: "SMS & Phishing Link Detection",
    category: "phishing",
    categoryLabel: "Phishing",
    whatToWatchFor: "Messages claiming urgent utility cutoffs, income tax refunds, or courier deliveries requiring immediate clicks on shortlinks (bit.ly, tinyurl).",
    dos: [
      "Look closely at website URLs for misspelled brand names (e.g., icic-bank.co instead of icicibank.com).",
      "Open your utility provider's official app to verify bill payment status.",
      "Report fraudulent SMS headers to your telecom provider (e.g. 1909 DND portal)."
    ],
    donts: [
      "DO NOT click links inside urgent disconnection or prize SMS messages.",
      "NEVER enter banking passwords on websites opened from an SMS link.",
      "DO NOT call 10-digit mobile numbers listed inside official-sounding SMS alerts."
    ]
  },
  {
    id: "guide-impersonation",
    title: "Police & 'Digital Arrest' Threats",
    category: "kyc",
    categoryLabel: "Impersonation",
    whatToWatchFor: "Callers in fake police uniforms on Skype/WhatsApp claiming your Aadhaar is linked to money laundering, drug parcels, or cybercrimes.",
    dos: [
      "Understand that Indian law does NOT contain any provision for 'Digital Arrest' via video call.",
      "Disconnect immediately and report the number to the National Cyber Crime Helpline (1930).",
      "Visit your local police station if you have genuine doubts about a legal matter."
    ],
    donts: [
      "DO NOT stay on video calls under threat or isolation.",
      "NEVER transfer money to 'RBI verification accounts' or 'escrow safety accounts'.",
      "DO NOT share your screen or camera showing your financial apps or IDs."
    ]
  },
  {
    id: "guide-job-investment",
    title: "Task Scams & High-Return Investments",
    category: "job",
    categoryLabel: "Job & Investment",
    whatToWatchFor: "Telegram groups promising ₹2,000–₹5,000/day for liking YouTube videos, rating hotels, or trading on unregulated platforms.",
    dos: [
      "Verify whether an investment firm is registered with SEBI (sebi.gov.in) before investing.",
      "Remember that legitimate employers NEVER require employees to deposit money to work.",
      "Research companies thoroughly on registered business directories."
    ],
    donts: [
      "NEVER deposit money to 'recharge' task balance or unlock salary payouts.",
      "DO NOT trust screenshots of large profits shared inside Telegram or WhatsApp groups.",
      "DO NOT download APK files or trading apps outside of Google Play Store / Apple App Store."
    ]
  },
  {
    id: "guide-screen-sharing",
    title: "Remote Access & Screen Sharing Apps",
    category: "kyc",
    categoryLabel: "Device Security",
    whatToWatchFor: "Callers asking you to install AnyDesk, TeamViewer, RustDesk, or QuickSupport to 'assist' with customer care or KYC verification.",
    dos: [
      "Uninstall any remote access application if an unknown caller asked you to install it.",
      "If you accidentally shared your screen, turn off mobile Wi-Fi/data immediately.",
      "Call your bank to temporarily freeze digital banking channels."
    ],
    donts: [
      "NEVER install remote control applications at the request of a customer care agent.",
      "DO NOT share the 9-digit code displayed inside AnyDesk / TeamViewer.",
      "DO NOT open banking apps while screen sharing is active."
    ]
  }
];

export const EMERGENCY_RESOURCES = [
  {
    title: "National Cyber Crime Helpline",
    number: "1930",
    description: "Toll-free emergency number operated by Ministry of Home Affairs (I4C) for immediate financial fraud reporting.",
    action: "tel:1930",
    isPrimary: true
  },
  {
    title: "National Cyber Crime Reporting Portal",
    url: "https://cybercrime.gov.in",
    description: "Official Government of India portal for lodging formal cyber crime complaints and tracking status.",
    action: "https://cybercrime.gov.in",
    isPrimary: false
  },
  {
    title: "RBI Sachet Portal",
    url: "https://sachet.rbi.org.in",
    description: "Reserve Bank of India portal to report unauthorized deposit schemes and fraudulent lending apps.",
    action: "https://sachet.rbi.org.in",
    isPrimary: false
  },
  {
    title: "Chakshu Portal (DoT)",
    url: "https://sancharsaathi.gov.in",
    description: "Department of Telecommunications portal for reporting suspected fraud communications (calls/SMS/WhatsApp).",
    action: "https://sancharsaathi.gov.in",
    isPrimary: false
  }
];

// Alias for backwards compatibility
export const EMERGENCY_HELPLINES = EMERGENCY_RESOURCES;

export const SAMPLE_RADAR_THREATS = [
  {
    id: "threat-1",
    title: "Electricity Bill Cut-off SMS",
    category: "Phishing",
    reportedCount: "High Frequency",
    severity: "danger",
    trend: "Active Across Multiple States",
    primaryTarget: "Residential electricity consumers"
  },
  {
    id: "threat-2",
    title: "Fake Police Video Call ('Digital Arrest')",
    category: "Bank & KYC Scams",
    reportedCount: "Rising Threat",
    severity: "danger",
    trend: "High Financial Impact",
    primaryTarget: "Senior citizens & professionals"
  },
  {
    id: "threat-3",
    title: "Part-time Telegram Video Rating Task",
    category: "Job / Task Scams",
    reportedCount: "High Volume",
    severity: "warn",
    trend: "Targeting Job Seekers",
    primaryTarget: "Students & young adults"
  }
];
