/**
 * ConVerse — Scenario S06: Predatory Instant Loan App & Contact Extortion Scam
 * Flags: L5, I4, E1
 * Difficulty: 2
 * Personas: student
 */

const S06 = {
  id: 'S06',
  title: 'Instant Loan App / "No CIBIL, ₹50,000 in 2 Mins"',
  category: 'Predatory Lending & Blackmail',
  difficulty: 2,
  personas: ['student'],
  summary: 'A sideloaded APK promises an instant student loan without documents or CIBIL score, but secretly harvests your contact list and gallery for aggressive extortion.',
  startNodeId: 'S06-N01',

  nodes: [
    {
      id: 'S06-N01',
      channel: 'sms',
      sender: {
        name: 'Promo SMS',
        handle: 'HP-QUICKLOAN',
        avatar: '💸',
        verified: false
      },
      message: 'Urgent cash needed? Get instant loan of ₹50,000 with 0% interest, NO CIBIL check, NO income proof! Direct transfer in 2 minutes. Download QuickKash VIP APK now: https://bit.ly/quick-kash-apk-install',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S06-01',
          text: 'https://bit.ly/quick-kash-apk-install',
          indicatorId: 'L5',
          explanation: 'Sideloaded APK link outside Google Play Store. Unregistered lending apps are banned from official app stores by RBI.'
        },
        {
          id: 'RF-S06-02',
          text: '0% interest, NO CIBIL check, NO income proof',
          indicatorId: 'L5',
          explanation: 'RBI-regulated NBFCs are legally mandated to perform KYC and credit evaluation. Zero-document loans are illegal predatory traps.'
        }
      ],
      choices: [
        {
          id: 'S06-N01-C01',
          label: 'Delete the SMS and only apply for loans via RBI-registered banks/NBFCs on official stores',
          nextNodeId: 'S06-N04',
          good: true,
          indicatorIds: ['L5'],
          consequence: 'Great defense! Sideloaded loan APKs are prime tools for Chinese digital extortion rings in India.',
          type: 'inspect'
        },
        {
          id: 'S06-N01-C02',
          label: 'Click the shortened link to download and install the QuickKash APK on your phone',
          nextNodeId: 'S06-N02',
          good: false,
          indicatorIds: ['L5'],
          consequence: 'Dangerous move! You bypassed Android security warnings to install an unverified APK.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S06-N02',
      channel: 'app',
      sender: {
        name: 'Android System Permission Prompt',
        handle: 'QuickKash App Installation',
        avatar: '⚠️',
        verified: false
      },
      message: 'APP PERMISSION REQUEST: "Allow QuickKash to access all Contacts, Media & Photo Gallery, Camera, Location, and Call Logs?" App states permissions are "Required for instant loan verification."',
      redFlags: [
        {
          id: 'RF-S06-03',
          text: 'Allow QuickKash to access all Contacts, Media & Photo Gallery',
          indicatorId: 'I4',
          explanation: 'Predatory loan apps harvest your entire contact book and photo gallery to blackmail your family and friends later.'
        }
      ],
      choices: [
        {
          id: 'S06-N02-C01',
          label: 'Deny all permissions and immediately uninstall the APK from your phone',
          nextNodeId: 'S06-N04',
          good: true,
          indicatorIds: ['I4', 'L5'],
          consequence: 'Timely escape! You prevented the malicious app from exfiltrating your private contacts and photo albums.',
          type: 'report'
        },
        {
          id: 'S06-N02-C02',
          label: 'Grant all permissions and apply for ₹5,000 loan',
          nextNodeId: 'S06-N03',
          good: false,
          indicatorIds: ['I4', 'L5'],
          consequence: 'Severe compromise! The app instantly uploaded your entire phonebook and camera photos to their cloud servers.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S06-N03',
      channel: 'whatsapp',
      sender: {
        name: 'Recovery Agent (Extortion Desk)',
        handle: '+91 91230 48192',
        avatar: '🤬',
        verified: false
      },
      message: 'You received only ₹2,800 (after ₹2,200 "deductions"). Just 5 days later, agent messages: "Pay ₹8,500 by 1 PM today or we will send morphed nude photos with your face to your father (+91 98XXX), college professors, and all 420 contacts!"',
      redFlags: [
        {
          id: 'RF-S06-04',
          text: 'send morphed nude photos with your face to your father',
          indicatorId: 'E1',
          explanation: 'Classic illegal extortion tactic used by predatory illegal loan networks.'
        }
      ],
      choices: [
        {
          id: 'S06-N03-C01',
          label: 'Do not pay blackmail money. File a report on cybercrime.gov.in and alert your family about the morphing scam',
          nextNodeId: null,
          good: true,
          indicatorIds: ['E1'],
          consequence: 'The correct, brave response! Paying blackmail never stops the extortion; law enforcement intervention is mandatory.',
          type: 'report'
        },
        {
          id: 'S06-N03-C02',
          label: 'Pay ₹8,500 immediately to stop them from messaging your contacts',
          nextNodeId: null,
          good: false,
          indicatorIds: ['E1'],
          consequence: 'They demand another ₹15,000 the next day. Blackmailers continue until police intervene.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S06-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Security',
        handle: 'App Safety Guide',
        avatar: '🛡️',
        verified: true
      },
      message: 'You steered clear of illegal loan app traps. Always verify lenders on the RBI Sachet Portal (sachet.rbi.org.in) before applying.',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'Never install sideloaded loan APKs or grant Contacts/Gallery permissions to unverified financial apps. Only borrow from RBI-registered banks and NBFCs.',
    vulnerableTakeaway: 'Illegal loan apps use fake "instant approval" offers to steal contact lists and photos, which are then used for aggressive blackmail and defamation.',
    preventionSteps: [
      'Check if the lender is an RBI-regulated entity on sachet.rbi.org.in.',
      'Never grant Contact or Gallery permissions to any lending app.',
      'If targeted by loan app blackmail, call 1930 and file a complaint at your local cyber cell immediately.'
    ],
    officialHelpline: '1930 / RBI Sachet Portal (sachet.rbi.org.in)'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S06;
}
if (typeof window !== 'undefined') {
  window.Scenario_S06 = S06;
}
