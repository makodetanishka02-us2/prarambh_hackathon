/**
 * ConVerse — Scenario S01: UPI Collect Request Scam
 * Flags: I2, U3, E2
 * Difficulty: Level 1
 * Personas: shopkeeper, homemaker
 */

const S01 = {
  id: 'S01',
  title: 'UPI Collect Request / "Claim Cashback"',
  category: 'UPI & Payment Fraud',
  difficulty: 1,
  personas: ['shopkeeper', 'homemaker'],
  summary: 'A buyer on OLX/WhatsApp claims to pay for an item but sends a "Collect Request" demanding your UPI PIN to receive payment.',
  startNodeId: 'S01-N01',

  nodes: [
    {
      id: 'S01-N01',
      channel: 'whatsapp',
      sender: {
        name: 'Ramesh Army Officer (OLX Buyer)',
        handle: '+91 98231 44102',
        avatar: '🎖️',
        verified: false
      },
      message: 'Hello! I am ready to buy your old refrigerator for ₹12,000 right now. I am posted in Military Cantt so my assistant will pick it up tomorrow. I am sending an instant UPI payment of ₹12,000. Accept fast or offer will cancel in 5 minutes!',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S01-01',
          text: 'Accept fast or offer will cancel in 5 minutes!',
          indicatorId: 'U3',
          explanation: 'Artificial time pressure to rush you into approving without reading transaction details.'
        },
        {
          id: 'RF-S01-02',
          text: 'posted in Military Cantt',
          indicatorId: 'E2',
          explanation: 'Scammers frequently impersonate army personnel or defense staff to gain unearned trust.'
        }
      ],
      choices: [
        {
          id: 'S01-N01-C01',
          label: 'Wait for notification and examine the incoming UPI request on PhonePe/GPay',
          nextNodeId: 'S01-N02',
          good: true,
          indicatorIds: ['U3'],
          consequence: 'Smart move! You chose to inspect the payment request rather than blindly trusting the countdown timer.',
          type: 'inspect'
        },
        {
          id: 'S01-N01-C02',
          label: 'Rush to open the UPI app and tap whatever prompt pops up immediately',
          nextNodeId: 'S01-N03',
          good: false,
          indicatorIds: ['U3', 'E2'],
          consequence: 'Trap triggered! Rushing due to the 5-minute countdown prevented you from noticing this is a Collect Request.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S01-N02',
      channel: 'app',
      sender: {
        name: 'UPI Gateway Notification',
        handle: 'GPay / PhonePe Alert',
        avatar: '📲',
        verified: true
      },
      message: 'POPUP NOTIFICATION: "Ramesh Kumar (army-pay@okaxis) is requesting ₹12,000 from your account. Enter 6-digit UPI PIN to approve payment."',
      timeLimitSeconds: 20,
      redFlags: [
        {
          id: 'RF-S01-03',
          text: 'is requesting ₹12,000 from your account. Enter 6-digit UPI PIN to approve payment.',
          indicatorId: 'I2',
          explanation: 'This is a DEBIT / COLLECT request. Entering your UPI PIN always DEDUCTS money from your bank account.'
        }
      ],
      choices: [
        {
          id: 'S01-N02-C01',
          label: 'Decline the request immediately and block the buyer on WhatsApp',
          nextNodeId: 'S01-N04',
          good: true,
          indicatorIds: ['I2'],
          consequence: 'Spot on! You correctly recognized that receiving money NEVER requires entering your UPI PIN.',
          type: 'report'
        },
        {
          id: 'S01-N02-C02',
          label: 'Enter your 6-digit UPI PIN believing it is required to deposit money into your account',
          nextNodeId: 'S01-N03',
          good: false,
          indicatorIds: ['I2'],
          consequence: 'Disaster! ₹12,000 was debited instantly from your account. Entering your UPI PIN authorizes a payment OUT.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S01-N03',
      channel: 'sms',
      sender: {
        name: 'Bank Alert',
        handle: 'VK-HDFCBK',
        avatar: '🏦',
        verified: true
      },
      message: 'Alert! ₹12,000.00 debited from A/c XX4821 to VPA army-pay@okaxis via UPI Ref 429184019281. If not done by you, call 1930 immediately.',
      redFlags: [
        {
          id: 'RF-S01-04',
          text: 'debited from A/c',
          indicatorId: 'I2',
          explanation: 'Money has been stolen via UPI collect authorization.'
        }
      ],
      choices: [
        {
          id: 'S01-N03-C01',
          label: 'Call National Cyber Crime Helpline (1930) and freeze the transaction within the Golden Hour',
          nextNodeId: null,
          good: true,
          indicatorIds: ['I2'],
          consequence: 'Essential mitigation! Calling 1930 immediately can freeze the recipient wallet before money is laundered.',
          type: 'report'
        },
        {
          id: 'S01-N03-C02',
          label: 'Message the scammer asking why money was cut instead of credited',
          nextNodeId: null,
          good: false,
          indicatorIds: ['I2', 'E2'],
          consequence: 'The scammer blocks your number immediately. You wasted precious time instead of contacting 1930.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S01-N04',
      channel: 'whatsapp',
      sender: {
        name: 'Security Summary',
        handle: 'ConVerse Protection',
        avatar: '🛡️',
        verified: true
      },
      message: 'You safely declined the fraudulent request. You also reported the scam UPI ID "army-pay@okaxis" to the NPCI fraud database.',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'You correctly remembered: UPI PIN is ONLY needed to SEND money, never to RECEIVE money. Collect requests are always debits.',
    vulnerableTakeaway: 'Never enter your UPI PIN to claim cashback, receive buyer payments, or accept lottery prizes. Any prompt asking for PIN is taking your money.',
    preventionSteps: [
      'Remember: UPI PIN is strictly for DEBITING funds.',
      'Always read the UPI popup header (Collect Request vs Receive Credit).',
      'If scammed, call 1930 within the first 2 hours (Golden Hour).'
    ],
    officialHelpline: '1930 / NPCI UPI Fraud Portal'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S01;
}
if (typeof window !== 'undefined') {
  window.Scenario_S01 = S01;
}
