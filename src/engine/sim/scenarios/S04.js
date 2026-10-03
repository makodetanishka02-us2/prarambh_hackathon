/**
 * ConVerse — Scenario S04: Digital Arrest & Extortion Scam
 * Flags: S2, E1, U4, U5, I6
 * Difficulty: 3
 * Personas: senior citizen, salaried employee
 */

const S04 = {
  id: 'S04',
  title: 'Digital Arrest / "CBI Cyber Cell Investigation"',
  category: 'Extortion & Authority Impersonation',
  difficulty: 3,
  personas: ['senior citizen', 'salaried employee'],
  summary: 'A fake police officer on video call claims your Aadhaar was used in a ₹3.8 Crore money-laundering crime and places you under "Digital Arrest", demanding secret fund transfer for clearance.',
  startNodeId: 'S04-N01',

  nodes: [
    {
      id: 'S04-N01',
      channel: 'call',
      sender: {
        name: 'DCP Cyber Crime (Uniformed Officer)',
        handle: 'WhatsApp Video Call',
        avatar: '👮‍♂️',
        verified: false
      },
      message: 'VIDEO CALL ALERT: A man in a police uniform with a fake police station backdrop speaks sternly: "I am DCP Rajesh Sharma from Mumbai Crime Branch. An arrest warrant is issued under your name. 24 fake bank accounts were opened with your Aadhaar in the Naresh Goyal money-laundering case. You are under DIGITAL ARREST right now! Do not disconnect this call or local police will raid your house in 30 minutes!"',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S04-01',
          text: 'DCP Rajesh Sharma from Mumbai Crime Branch',
          indicatorId: 'S2',
          explanation: 'Impersonation of high-ranking police officials to intimidate citizens.'
        },
        {
          id: 'RF-S04-02',
          text: 'DIGITAL ARREST right now!',
          indicatorId: 'E1',
          explanation: 'There is NO concept of "Digital Arrest" under Indian Law (CrPC / Bharatiya Nagarik Suraksha Sanhita).'
        },
        {
          id: 'RF-S04-03',
          text: 'local police will raid your house in 30 minutes!',
          indicatorId: 'U4',
          explanation: 'Fabricating immediate arrest deadlines to induce panic.'
        },
        {
          id: 'RF-S04-04',
          text: 'Do not disconnect this call',
          indicatorId: 'U5',
          explanation: 'Isolation tactic designed to stop you from consulting lawyers, family, or police.'
        }
      ],
      choices: [
        {
          id: 'S04-N01-C01',
          label: 'Disconnect the video call immediately. "Digital arrest" does not exist in Indian law',
          nextNodeId: 'S04-N04',
          good: true,
          indicatorIds: ['S2', 'E1', 'U4', 'U5'],
          consequence: 'Spot on! Supreme Court, MHA, and RBI have repeatedly clarified that no law enforcement agency conducts arrests over video calls.',
          type: 'inspect'
        },
        {
          id: 'S04-N01-C02',
          label: 'Stay trembling on the call and follow the officer\'s instructions to prove your innocence',
          nextNodeId: 'S04-N02',
          good: false,
          indicatorIds: ['S2', 'E1', 'U5'],
          consequence: 'Scam progression! The fraudsters now have psychological control over you through fear and isolation.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S04-N02',
      channel: 'whatsapp',
      sender: {
        name: 'Supreme Court Verification Dept (Fake)',
        handle: 'Document Attachment',
        avatar: '⚖️',
        verified: false
      },
      message: 'The scammer sends a forged PDF with a fake Supreme Court emblem, stamp, and signature titled "Order of Asset Seizure & High Court Bail Verification". He states: "To clear your name from money laundering, you must transfer your savings (₹2,00,000) to the RBI Secret Escrow Account for financial verification. It will be refunded within 15 minutes after clearance."',
      timeLimitSeconds: 20,
      redFlags: [
        {
          id: 'RF-S04-05',
          text: 'transfer your savings (₹2,00,000) to the RBI Secret Escrow Account',
          indicatorId: 'I6',
          explanation: 'No government agency, court, or RBI ever asks citizens to transfer money to "secret escrow" or "verification accounts".'
        }
      ],
      choices: [
        {
          id: 'S04-N02-C01',
          label: 'Refuse to transfer funds. Immediately walk into your local police station or call 1930',
          nextNodeId: 'S04-N04',
          good: true,
          indicatorIds: ['I6', 'S2'],
          consequence: 'Heroic recovery! You refused to yield to extortion and took the lawful verification route.',
          type: 'report'
        },
        {
          id: 'S04-N02-C02',
          label: 'Transfer ₹2,00,000 via RTGS to the specified "RBI Verification Account" expecting a refund',
          nextNodeId: 'S04-N03',
          good: false,
          indicatorIds: ['I6', 'E1'],
          consequence: 'Heartbreaking loss! ₹2,00,000 transferred to a mule account controlled by an organized cybercrime syndicate.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S04-N03',
      channel: 'whatsapp',
      sender: {
        name: 'Scammer Extortionist',
        handle: 'Extortion Demand',
        avatar: '💀',
        verified: false
      },
      message: 'Having received ₹2,00,000, the scammer now demands another ₹3,00,000 claiming "Customs penalty for international narcotics clearance".',
      redFlags: [
        {
          id: 'RF-S04-06',
          text: 'demands another ₹3,00,000',
          indicatorId: 'I6',
          explanation: 'Extortionists never stop demanding money until all funds are drained.'
        }
      ],
      choices: [
        {
          id: 'S04-N03-C01',
          label: 'Immediately alert 1930 Cyber Crime Helpline and freeze beneficiary accounts with your bank',
          nextNodeId: null,
          good: true,
          indicatorIds: ['S2'],
          consequence: 'Crucial step. Golden hour freezing is the only way to recover funds from mule networks.',
          type: 'report'
        },
        {
          id: 'S04-N03-C02',
          label: 'Borrow money from friends to pay the second demand',
          nextNodeId: null,
          good: false,
          indicatorIds: ['E1'],
          consequence: 'Further severe financial devastation.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S04-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Protection',
        handle: 'Cyber Awareness',
        avatar: '🛡️',
        verified: true
      },
      message: 'You stood strong against high-pressure intimidation. You reported the fake DCP number to 1930 and informed your family. Indian law never permits digital arrests or money transfers for legal clearance.',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'Indian Law enforcement agencies (Police, CBI, ED, Customs, NIA) NEVER issue arrest warrants over WhatsApp, conduct "digital arrests" on Skype, or demand money transfers for verification.',
    vulnerableTakeaway: 'Digital arrest is a massive psychological extortion scam. If someone threatens you with police uniform on video call and demands secrecy/money, disconnect immediately.',
    preventionSteps: [
      'Know your legal rights: Digital Arrest does NOT exist under any Indian law.',
      'Police officers will never conduct questioning via Skype/WhatsApp video calls.',
      'Never transfer funds to any alleged "RBI Escrow" or "Verification Account".',
      'Report intimidation calls directly on 1930 / cybercrime.gov.in.'
    ],
    officialHelpline: '1930 (MHA Cyber Crime Portal) / Nearest Police Station'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S04;
}
if (typeof window !== 'undefined') {
  window.Scenario_S04 = S04;
}
