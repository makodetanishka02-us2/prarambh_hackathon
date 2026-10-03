/**
 * ConVerse — Scenario S07: Courier Parcel / Narcotics Customs Extortion
 * Flags: E1, S2, U5
 * Difficulty: 2
 * Personas: homemaker
 */

const S07 = {
  id: 'S07',
  title: 'Courier Parcel / "Narcotics Detected at Customs"',
  category: 'Customs & Parcel Extortion',
  difficulty: 2,
  personas: ['homemaker'],
  summary: 'An IVR call posing as FedEx/Customs claims a parcel containing illegal MDMA drugs and fake passports in your name was seized at Mumbai airport, transferring you to a fake police interrogation.',
  startNodeId: 'S07-N01',

  nodes: [
    {
      id: 'S07-N01',
      channel: 'call',
      sender: {
        name: 'FedEx Customs Notification (IVR)',
        handle: '+91 80012 34567',
        avatar: '📦',
        verified: false
      },
      message: 'AUTOMATED VOICE: "Important alert from FedEx Customs Notification. Your international parcel tracking #FX-88491 sent from Mumbai to Taiwan has been seized by Indian Customs. 140 grams of MDMA drugs and 5 fake passports were found inside. Press 9 immediately to speak to Customs Cyber Narcotics Officer or an arrest warrant will be issued."',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S07-01',
          text: '140 grams of MDMA drugs and 5 fake passports',
          indicatorId: 'E1',
          explanation: 'Shocking contraband allegations designed to induce intense fear and blind compliance.'
        },
        {
          id: 'RF-S07-02',
          text: 'FedEx Customs Notification',
          indicatorId: 'S2',
          explanation: 'Couriers and Customs authorities do not use IVR robo-calls to threaten arrests.'
        }
      ],
      choices: [
        {
          id: 'S07-N01-C01',
          label: 'Hang up the call immediately. You never sent any parcel to Taiwan',
          nextNodeId: 'S07-N04',
          good: true,
          indicatorIds: ['E1', 'S2'],
          consequence: 'Spot on! FedEx and India Post have issued public advisories that they never make calls regarding illegal parcels.',
          type: 'inspect'
        },
        {
          id: 'S07-N01-C02',
          label: 'Press 9 in panic to explain to the officer that you never sent any package',
          nextNodeId: 'S07-N02',
          good: false,
          indicatorIds: ['E1'],
          consequence: 'Bait taken! You are transferred to an aggressive fake narcotics inspector.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S07-N02',
      channel: 'call',
      sender: {
        name: 'Inspector Vijay Chauhan (Customs Narcotics)',
        handle: 'Police Interrogation Desk',
        avatar: '👮',
        verified: false
      },
      message: 'AGGRESSIVE VOICE: "Listen carefully! Your Aadhaar card and signature were used to book this drug package. Under the NDPS Act, this is a non-bailable offense carrying 10 years imprisonment. You must stay on this line without telling anyone! To clear your name from the FIR, you must transfer ₹50,000 for Customs Forensic Clearance Certificate."',
      timeLimitSeconds: 20,
      redFlags: [
        {
          id: 'RF-S07-03',
          text: 'stay on this line without telling anyone!',
          indicatorId: 'U5',
          explanation: 'Isolation pressure to prevent you from discussing with family or verifying with real police.'
        },
        {
          id: 'RF-S07-04',
          text: 'transfer ₹50,000 for Customs Forensic Clearance Certificate',
          indicatorId: 'E1',
          explanation: 'Extortion demand under the guise of an imaginary government clearance certificate.'
        }
      ],
      choices: [
        {
          id: 'S07-N02-C01',
          label: 'Disconnect the call and report the scam number to 1930 and the local police station',
          nextNodeId: 'S07-N04',
          good: true,
          indicatorIds: ['E1', 'S2', 'U5'],
          consequence: 'Outstanding! Indian Customs and Police never issue clearance certificates over phone payments.',
          type: 'report'
        },
        {
          id: 'S07-N02-C02',
          label: 'Transfer ₹50,000 via UPI to the provided "Customs Clearance Escrow ID"',
          nextNodeId: 'S07-N03',
          good: false,
          indicatorIds: ['E1', 'U5'],
          consequence: 'Money lost! The scammer immediately demands another ₹1,00,000 for "Court Bail Guarantee".',
          type: 'action'
        }
      ]
    },
    {
      id: 'S07-N03',
      channel: 'whatsapp',
      sender: {
        name: 'Fake Customs Desk',
        handle: 'FIR Extortion',
        avatar: '⚖️',
        verified: false
      },
      message: 'Scammer messages: "Forensic test verified initial clearance, but Mumbai High Court warrants require ₹1,00,000 refundable surety bond right now or team will be dispatched."',
      redFlags: [
        {
          id: 'RF-S07-05',
          text: 'require ₹1,00,000 refundable surety bond',
          indicatorId: 'E1',
          explanation: 'Endless escalation of extortion demands.'
        }
      ],
      choices: [
        {
          id: 'S07-N03-C01',
          label: 'Immediately contact 1930 Cyber Helpline and freeze your bank account transactions',
          nextNodeId: null,
          good: true,
          indicatorIds: ['S2'],
          consequence: 'Right protocol to stop further fund bleeding.',
          type: 'report'
        },
        {
          id: 'S07-N03-C02',
          label: 'Pawn jewelry to pay the ₹1,00,000 surety bond',
          nextNodeId: null,
          good: false,
          indicatorIds: ['E1'],
          consequence: 'Devastating financial loss.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S07-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Protection',
        handle: 'Parcel Fraud Defense',
        avatar: '🛡️',
        verified: true
      },
      message: 'You avoided the infamous FedEx/Customs parcel scam. Indian Customs never contacts citizens via IVR calls or accepts UPI transfers for legal clearance.',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'Genuine courier companies and Customs officials NEVER call to demand money or threaten arrests over parcels you never booked.',
    vulnerableTakeaway: 'Scammers exploit fear of police, narcotics, and fake arrest warrants to manipulate innocent victims into panic payments.',
    preventionSteps: [
      'If you get an automated IVR call claiming an illegal parcel in your name, disconnect immediately.',
      'Check tracking numbers exclusively on official courier websites (fedex.com, indiapost.gov.in).',
      'Report extortion calls immediately to 1930.'
    ],
    officialHelpline: '1930 / cybercrime.gov.in'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S07;
}
if (typeof window !== 'undefined') {
  window.Scenario_S07 = S07;
}
