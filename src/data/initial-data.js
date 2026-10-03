/**
 * ConVerse Shared Data — Initial Data & Contracts
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

export const SAMPLE_CATEGORIES = [
  { id: "all", label: "All Scenarios", icon: "🌐" },
  { id: "upi", label: "UPI & QR Traps", icon: "📱" },
  { id: "calls", label: "Impersonation Calls", icon: "📞" },
  { id: "phishing", label: "SMS & Phishing Links", icon: "💬" },
  { id: "job", label: "Work-From-Home Fraud", icon: "💼" },
  { id: "investment", label: "High-Return Schemes", icon: "📈" }
];

export const SAMPLE_SCENARIOS = [
  {
    id: "sim-upi-qr-1",
    categoryId: "upi",
    title: "The 'Scan to Receive Money' Trap",
    description: "A buyer on an online marketplace asks you to scan a QR code and enter your UPI PIN to receive ₹5,000.",
    difficulty: "Medium",
    riskLevel: "danger",
    estimatedMinutes: 3,
    indicators: ["Enter UPI PIN to receive", "Unknown QR code", "Urgent deadline"]
  },
  {
    id: "sim-electricity-bill-1",
    categoryId: "phishing",
    title: "Urgent Electricity Disconnection SMS",
    description: "An SMS claiming your electricity power will be disconnected at 9:30 PM tonight unless you call an unknown 10-digit number.",
    difficulty: "Easy",
    riskLevel: "danger",
    estimatedMinutes: 2,
    indicators: ["Personal mobile number sender", "Extreme urgency", "Threat of disconnection"]
  },
  {
    id: "sim-fedex-police-1",
    categoryId: "calls",
    title: "Fake Customs & Police Video Call",
    description: "A caller posing as a courier executive claims a parcel containing contraband has your Aadhaar linked, followed by a fake police interrogation.",
    difficulty: "Hard",
    riskLevel: "danger",
    estimatedMinutes: 5,
    indicators: ["Digital arrest threat", "Demands financial transfer for clearance", "Aadhaar misuse scare"]
  },
  {
    id: "sim-part-time-job-1",
    categoryId: "job",
    title: "YouTube Video Liking Job Fraud",
    description: "A Telegram message promises ₹150 for every YouTube video liked, which later demands ₹10,000 upfront deposit to unlock larger payouts.",
    difficulty: "Medium",
    riskLevel: "warn",
    estimatedMinutes: 3,
    indicators: ["Too good to be true return", "Telegram redirection", "Prepaid task deposit required"]
  }
];

export const SAMPLE_RADAR_THREATS = [
  {
    id: "threat-1",
    title: "Electricity Bill Cut-off SMS",
    category: "Phishing SMS",
    reportedCount: 4200,
    severity: "danger",
    trend: "+24% this week",
    primaryTarget: "Urban & Semi-Urban households"
  },
  {
    id: "threat-2",
    title: "Fake APK File via WhatsApp (Wedding Card / Challan)",
    category: "Malware APK",
    reportedCount: 3100,
    severity: "danger",
    trend: "+18% this week",
    primaryTarget: "Android smartphone users"
  },
  {
    id: "threat-3",
    title: "Part-time Telegram Rating Scam",
    category: "Job Fraud",
    reportedCount: 2800,
    severity: "warn",
    trend: "+12% this week",
    primaryTarget: "Students & Job seekers"
  }
];

export const EMERGENCY_HELPLINES = [
  {
    title: "National Cyber Crime Helpline",
    number: "1930",
    description: "Toll-free emergency helpline for reporting financial cyber fraud immediately (MHA Govt of India).",
    action: "tel:1930"
  },
  {
    title: "National Cyber Crime Reporting Portal",
    url: "https://cybercrime.gov.in",
    description: "Official government portal to file cyber crime complaints online.",
    action: "https://cybercrime.gov.in"
  },
  {
    title: "RBI Sachet Portal",
    url: "https://sachet.rbi.org.in",
    description: "Reserve Bank of India portal to report unauthorized deposit taking entities.",
    action: "https://sachet.rbi.org.in"
  }
];
