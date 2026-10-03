/**
 * ConVerse — Scenario S10: Fake Customer Care & Remote Screen-Sharing Scam
 * Flags: S3, I5, I1
 * Difficulty: 2
 * Personas: homemaker, senior citizen
 */

const S10 = {
  id: 'S10',
  title: 'Fake Customer Care / "Install AnyDesk for Refund"',
  category: 'Remote Access & Support Impersonation',
  difficulty: 2,
  personas: ['homemaker', 'senior citizen'],
  summary: 'After a failed online food/flight order, you Google the customer care number and call an unverified search result where the fake agent asks you to download "QuickSupport / AnyDesk" to process your refund.',
  startNodeId: 'S10-N01',

  nodes: [
    {
      id: 'S10-N01',
      channel: 'call',
      sender: {
        name: 'Zomato/Airline Customer Support (Unverified)',
        handle: '+91 74819 22019 (Google Search Result)',
        avatar: '🎧',
        verified: false
      },
      message: 'CALL AGENT: "Welcome to Grievance Redressal Cell! We received your call from our Google Search helpline listing. I can see your pending refund of ₹1,850. Due to server encryption, our automated refund gateway cannot deposit to your bank directly. Please open Google Play Store and install the official server helper tool \'AnyDesk / RustDesk QuickSupport\' so I can verify your transaction token."',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S10-01',
          text: 'Google Search helpline listing',
          indicatorId: 'S3',
          explanation: 'Fraudsters buy search ads or edit Google Maps listings to display fake toll-free/mobile numbers as official customer care.'
        },
        {
          id: 'RF-S10-02',
          text: 'install the official server helper tool \'AnyDesk / RustDesk QuickSupport\'',
          indicatorId: 'I5',
          explanation: 'AnyDesk and TeamViewer are remote screen-sharing tools. Installing them allows scammers to see your screen, passwords, and banking OTPs in real time.'
        }
      ],
      choices: [
        {
          id: 'S10-N01-C01',
          label: 'Hang up immediately. Only contact customer support through the official in-app Help & Support chat',
          nextNodeId: 'S10-N04',
          good: true,
          indicatorIds: ['S3', 'I5'],
          consequence: 'Lifesaving vigilance! Legitimate customer support NEVER asks customers to install screen-sharing software.',
          type: 'inspect'
        },
        {
          id: 'S10-N01-C02',
          label: 'Install AnyDesk and read the 9-digit remote access code to the agent',
          nextNodeId: 'S10-N02',
          good: false,
          indicatorIds: ['S3', 'I5'],
          consequence: 'Massive security breach! The scammer can now view and control your mobile screen remotely.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S10-N02',
      channel: 'app',
      sender: {
        name: 'Remote Screen-Share Session Active',
        handle: 'AnyDesk / QuickSupport Connected',
        avatar: '📲',
        verified: false
      },
      message: 'AGENT ON CALL: "Great, session connected. Now please open your GPay / SBI YONO app and initiate a ₹1 test transfer to verify server handshake. Don\'t worry, your screen will go black for security."',
      timeLimitSeconds: 20,
      redFlags: [
        {
          id: 'RF-S10-03',
          text: 'open your GPay / SBI YONO app and initiate a ₹1 test transfer',
          indicatorId: 'I1',
          explanation: 'As you open the banking app and type your PIN, the scammer records every keystroke and OTP on their screen.'
        }
      ],
      choices: [
        {
          id: 'S10-N02-C01',
          label: 'Turn on Airplane Mode immediately, uninstall AnyDesk, and call your bank from another phone to block UPI',
          nextNodeId: 'S10-N04',
          good: true,
          indicatorIds: ['I5', 'I1'],
          consequence: 'Quick emergency response! Disconnecting network stops the remote intruder from executing transfers.',
          type: 'report'
        },
        {
          id: 'S10-N02-C02',
          label: 'Open your banking app and type your login password and UPI PIN as instructed',
          nextNodeId: 'S10-N03',
          good: false,
          indicatorIds: ['I1', 'I5'],
          consequence: 'Account drained! The scammer viewed your PIN and intercepted the SMS OTPs on screen.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S10-N03',
      channel: 'sms',
      sender: {
        name: 'Bank Alert SMS',
        handle: 'VK-HDFCBK',
        avatar: '💸',
        verified: true
      },
      message: 'Alert: ₹85,000.00 debited from A/c XX8910 via NetBanking IMPS transfer to MULE-PAY. If not done by you, report to 1930 immediately.',
      redFlags: [
        {
          id: 'RF-S10-04',
          text: 'debited from A/c XX8910 via NetBanking',
          indicatorId: 'I1',
          explanation: 'Credentials and OTP stolen via screen-sharing stream.'
        }
      ],
      choices: [
        {
          id: 'S10-N03-C01',
          label: 'Call 1930 Cyber Crime Helpline and instruct bank to freeze NetBanking user ID immediately',
          nextNodeId: null,
          good: true,
          indicatorIds: ['I1'],
          consequence: 'Crucial stopgap to prevent further fund exfiltration.',
          type: 'report'
        },
        {
          id: 'S10-N03-C02',
          label: 'Ask the AnyDesk agent on the phone why ₹85,000 was debited instead of ₹1',
          nextNodeId: null,
          good: false,
          indicatorIds: ['S3'],
          consequence: 'The scammer terminates the call and locks you out of your phone.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S10-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Protection',
        handle: 'Support Security Shield',
        avatar: '🛡️',
        verified: true
      },
      message: 'You protected your accounts from remote-access hijacking. Always use in-app support chat (Swiggy, Zomato, Amazon, MakeMyTrip) and never trust customer care numbers found on Google Search.',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'NEVER install screen-sharing software (AnyDesk, TeamViewer, QuickSupport) on instruction from anyone claiming to be customer service, and never look up helpline numbers on Google Search.',
    vulnerableTakeaway: 'Search engine algorithms often index fake customer care numbers created by scammers. Once AnyDesk is installed, scammers view your banking apps and OTPs in real time.',
    preventionSteps: [
      'Only reach customer support through verified in-app help sections.',
      'Never download remote screen-sharing apps for "refunds" or "KYC verification".',
      'If you accidentally installed AnyDesk, turn on Airplane mode immediately and reset banking passwords.'
    ],
    officialHelpline: '1930 / Official in-app grievance redressal'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S10;
}
if (typeof window !== 'undefined') {
  window.Scenario_S10 = S10;
}
