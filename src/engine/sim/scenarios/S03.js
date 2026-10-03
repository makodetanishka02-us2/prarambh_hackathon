/**
 * ConVerse — Scenario S03: KYC Expiry & Account Block Phishing
 * Flags: U2, L1, I1, S1
 * Difficulty: 2
 * Personas: senior citizen, salaried employee
 */

const S03 = {
  id: 'S03',
  title: 'Urgent KYC Expiry / "Account Block Today"',
  category: 'Identity & Banking Phishing',
  difficulty: 2,
  personas: ['senior citizen', 'salaried employee'],
  summary: 'An SMS disguised as your bank warns your account and debit card will be suspended by midnight unless KYC is immediately updated via an unverified link.',
  startNodeId: 'S03-N01',

  nodes: [
    {
      id: 'S03-N01',
      channel: 'sms',
      sender: {
        name: 'Spoofed Bank SMS',
        handle: 'AD-SBIBNK-UPDATE',
        avatar: '📩',
        verified: false
      },
      message: 'SMS Header: [AD-SBIBNK-UPDATE]\nDear Customer, Your SBI Bank A/c will be BLOCKED TODAY within 6 hrs due to pending KYC verification. To avoid permanent account deactivation, update PAN & Aadhaar immediately at: http://sbi-kyc-portal.xyz/update',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S03-01',
          text: 'will be BLOCKED TODAY within 6 hrs',
          indicatorId: 'U2',
          explanation: 'Threat of imminent account deactivation creates panic to force careless clicking.'
        },
        {
          id: 'RF-S03-02',
          text: 'http://sbi-kyc-portal.xyz/update',
          indicatorId: 'L1',
          explanation: 'Unofficial, non-HTTPS domain with ".xyz" extension. Genuine bank domains use official bank portals (e.g. sbi.co.in).'
        },
        {
          id: 'RF-S03-03',
          text: 'AD-SBIBNK-UPDATE',
          indicatorId: 'S1',
          explanation: 'Sender ID header mimicry attempting to look like an official banking notification.'
        }
      ],
      choices: [
        {
          id: 'S03-N01-C01',
          label: 'Do not click the link. Open your official banking mobile app or visit the nearest bank branch',
          nextNodeId: 'S03-N04',
          good: true,
          indicatorIds: ['U2', 'L1', 'S1'],
          consequence: 'Excellent cybersecurity hygiene! Banks never ask customers to update KYC via third-party SMS links.',
          type: 'inspect'
        },
        {
          id: 'S03-N01-C02',
          label: 'Click the link in the SMS to quickly prevent your bank account from getting blocked',
          nextNodeId: 'S03-N02',
          good: false,
          indicatorIds: ['U2', 'L1'],
          consequence: 'Dangerous step! You opened a fraudulent phishing website crafted to steal banking credentials.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S03-N02',
      channel: 'app',
      sender: {
        name: 'Phishing Web Page',
        handle: 'sbi-kyc-portal.xyz',
        avatar: '🌐',
        verified: false
      },
      message: 'The webpage displays a copied State Bank of India logo with input fields asking for your 16-digit ATM Card Number, Expiry Date, ATM PIN, and NetBanking Password to "Verify KYC".',
      redFlags: [
        {
          id: 'RF-S03-04',
          text: 'ATM PIN, and NetBanking Password',
          indicatorId: 'I1',
          explanation: 'No bank KYC ever requires entering your secret ATM PIN or NetBanking password.'
        }
      ],
      choices: [
        {
          id: 'S03-N02-C01',
          label: 'Close the browser tab immediately and report the phishing URL to cybercrime.gov.in',
          nextNodeId: 'S03-N04',
          good: true,
          indicatorIds: ['I1', 'L1'],
          consequence: 'Good catch! You recognized credential harvesting before surrendering sensitive authorization passwords.',
          type: 'report'
        },
        {
          id: 'S03-N02-C02',
          label: 'Fill in your ATM card details, PIN, and submit the OTP received on your phone',
          nextNodeId: 'S03-N03',
          good: false,
          indicatorIds: ['I1', 'S1'],
          consequence: 'Catastrophe! Scammers intercepted your credentials and OTP to siphon funds from your account.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S03-N03',
      channel: 'sms',
      sender: {
        name: 'Bank Transaction Alert',
        handle: 'VK-SBIBNK',
        avatar: '🚨',
        verified: true
      },
      message: 'OTP 891244 used for NetBanking transfer of ₹48,00,0.00 to merchant PAYU-PG. If this was not you, block card immediately.',
      redFlags: [
        {
          id: 'RF-S03-05',
          text: 'OTP 891244 used for NetBanking transfer',
          indicatorId: 'I1',
          explanation: 'The OTP entered on the phishing site was used to drain your balance.'
        }
      ],
      choices: [
        {
          id: 'S03-N03-C01',
          label: 'Immediately block debit card and NetBanking via official toll-free helpline & call 1930',
          nextNodeId: null,
          good: true,
          indicatorIds: ['I1'],
          consequence: 'Crucial emergency protocol. Blocking cards prevents further siphoning of secondary accounts.',
          type: 'report'
        },
        {
          id: 'S03-N03-C02',
          label: 'Call the mobile number attached to the SMS to complain',
          nextNodeId: null,
          good: false,
          indicatorIds: ['S1'],
          consequence: 'The scammer poses as an agent and tries to extract a second OTP to "reverse" the charge.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S03-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Security',
        handle: 'Account Safe',
        avatar: '🛡️',
        verified: true
      },
      message: 'You checked your official YONO SBI app. Your KYC status is completely valid and verified. You successfully evaded a severe credential-harvesting phishing scam!',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'Banks NEVER send SMS links ending in random domains (.xyz, .top, bit.ly) or ask for ATM PIN / Passwords to update KYC.',
    vulnerableTakeaway: 'Urgent threats of "account deactivation today" are engineered to disable your rational checks. Always access your bank independently.',
    preventionSteps: [
      'Ignore SMS messages threatening account deactivation with embedded links.',
      'Check KYC status exclusively on official mobile banking apps or bank branch.',
      'Never input ATM PIN or NetBanking passwords on external web forms.'
    ],
    officialHelpline: '1930 / Official Bank Customer Helpline'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S03;
}
if (typeof window !== 'undefined') {
  window.Scenario_S03 = S03;
}
