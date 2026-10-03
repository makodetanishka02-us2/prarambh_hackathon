/**
 * ConVerse — Scenario S09: QR Code Swap / "Scan to Receive Money" Scam
 * Flags: I2, S4
 * Difficulty: 1
 * Personas: shopkeeper
 */

const S09 = {
  id: 'S09',
  title: 'QR Code Swap / "Scan QR to Receive Money"',
  category: 'Merchant & UPI Scams',
  difficulty: 1,
  personas: ['shopkeeper'],
  summary: 'A customer buying ₹4,500 worth of goods at your shop claims their UPI app cannot scan your counter standee QR, so they send you a "special barcode/QR" on WhatsApp claiming scanning it will credit ₹4,500.',
  startNodeId: 'S09-N01',

  nodes: [
    {
      id: 'S09-N01',
      channel: 'whatsapp',
      sender: {
        name: 'Impatient Customer at Shop Counter',
        handle: '+91 97410 88219',
        avatar: '🛍️',
        verified: false
      },
      message: 'Customer at counter: "Bhaiya, your Shop QR is giving server error in my PhonePe corporate account. I have generated a Special Merchant Deposit QR code for ₹4,500. Just open your GPay/PhonePe scanner and scan this QR I sent on WhatsApp, and ₹4,500 will be instantly credited to your bank account!"',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S09-01',
          text: 'scan this QR I sent on WhatsApp, and ₹4,500 will be instantly credited',
          indicatorId: 'I2',
          explanation: 'Fundamental rule of UPI: Scanning a QR code is ONLY for PAYING money out. You can NEVER receive money by scanning a QR code.'
        },
        {
          id: 'RF-S09-02',
          text: 'Special Merchant Deposit QR code',
          indicatorId: 'S4',
          explanation: 'Fabricated concept to trick merchants who don\'t understand QR architecture.'
        }
      ],
      choices: [
        {
          id: 'S09-N01-C01',
          label: 'Refuse firmly: "To receive money, you must scan my shop QR or send to my mobile number. I will not scan any QR to receive payment."',
          nextNodeId: 'S09-N04',
          good: true,
          indicatorIds: ['I2', 'S4'],
          consequence: 'Spot on! You know the core law of UPI: Scanning QR is strictly an outbound payment action.',
          type: 'inspect'
        },
        {
          id: 'S09-N01-C02',
          label: 'Open your UPI app camera and scan the QR image sent by the customer on WhatsApp',
          nextNodeId: 'S09-N02',
          good: false,
          indicatorIds: ['I2'],
          consequence: 'Danger! Scanning the QR loaded a payment checkout of ₹4,500.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S09-N02',
      channel: 'app',
      sender: {
        name: 'PhonePe / GPay Screen',
        handle: 'Payment Gateway Prompt',
        avatar: '📲',
        verified: true
      },
      message: 'The screen displays: "Paying ₹4,500 to Merchant PAY-DIRECT-HUB. Enter UPI PIN to Proceed with Payment."',
      timeLimitSeconds: 20,
      redFlags: [
        {
          id: 'RF-S09-03',
          text: 'Paying ₹4,500 to Merchant PAY-DIRECT-HUB. Enter UPI PIN',
          indicatorId: 'I2',
          explanation: 'Entering UPI PIN will debit ₹4,500 from your shop account.'
        }
      ],
      choices: [
        {
          id: 'S09-N02-C01',
          label: 'Cancel the transaction immediately and confront the fraudster at your counter',
          nextNodeId: 'S09-N04',
          good: true,
          indicatorIds: ['I2'],
          consequence: 'Saved just in time! You caught the deception before typing your secret UPI PIN.',
          type: 'report'
        },
        {
          id: 'S09-N02-C02',
          label: 'Enter your 4-digit UPI PIN thinking it is the verification PIN to accept funds',
          nextNodeId: 'S09-N03',
          good: false,
          indicatorIds: ['I2', 'S4'],
          consequence: 'Double loss! ₹4,500 debited from your bank account AND the customer ran off with the goods.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S09-N03',
      channel: 'sms',
      sender: {
        name: 'Bank Soundbox / Alert',
        handle: 'Paytm Soundbox Alert',
        avatar: '📢',
        verified: true
      },
      message: 'Debit Alert: ₹4,500 debited from your Shop Current A/c to PAY-DIRECT-HUB. Current balance: ₹12,100.',
      redFlags: [
        {
          id: 'RF-S09-04',
          text: 'debited from your Shop Current A/c',
          indicatorId: 'I2',
          explanation: 'Fraudulent payment was authorized.'
        }
      ],
      choices: [
        {
          id: 'S09-N03-C01',
          label: 'Call 1930 Cyber Helpline and notify your merchant acquirer/bank to flag the merchant VPA',
          nextNodeId: null,
          good: true,
          indicatorIds: ['I2'],
          consequence: 'Essential reporting step to blacklist the fraudulent UPI receiver.',
          type: 'report'
        },
        {
          id: 'S09-N03-C02',
          label: 'Ask other customers in the shop to scan the QR to test it',
          nextNodeId: null,
          good: false,
          indicatorIds: ['I2'],
          consequence: 'Puts other customers at risk.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S09-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Protection',
        handle: 'Merchant Shield',
        avatar: '🛡️',
        verified: true
      },
      message: 'Hearing your refusal, the scammer made an excuse about bringing cash from his car and hurried away. You saved your shop ₹4,500 and your goods!',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'You upheld the universal rule of UPI: You NEVER scan a QR code or enter a UPI PIN to RECEIVE money. QR scanning is strictly for paying out.',
    vulnerableTakeaway: 'Scammers frequently target small business owners and shopkeepers by claiming "special merchant receive QRs".',
    preventionSteps: [
      'Never scan any QR code sent by a customer.',
      'Only show your official shop QR standee or soundbox for customer payments.',
      'Wait for the official bank soundbox voice confirmation ("Received ₹X on Paytm/PhonePe") before handing over items.'
    ],
    officialHelpline: '1930 / NPCI Merchant Helpdesk'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S09;
}
if (typeof window !== 'undefined') {
  window.Scenario_S09 = S09;
}
