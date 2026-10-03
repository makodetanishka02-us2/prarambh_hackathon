/**
 * ConVerse — Scenario S08: Fake Stock-Tip & Institutional Trading Scam
 * Flags: E2, E5, I6
 * Difficulty: 3
 * Personas: salaried employee, student
 */

const S08 = {
  id: 'S08',
  title: 'Stock-Tip Group / "Institutional 500% Returns"',
  category: 'Investment & Trading Scams',
  difficulty: 3,
  personas: ['salaried employee', 'student'],
  summary: 'You are added to a WhatsApp VIP Stock Tips group claiming association with Goldman Sachs/Blackstone, where members post massive daily trading profits and push an unlisted institutional trading app.',
  startNodeId: 'S08-N01',

  nodes: [
    {
      id: 'S08-N01',
      channel: 'whatsapp',
      sender: {
        name: 'VIP Institutional Trading Club #12',
        handle: 'WhatsApp Group (180 Members)',
        avatar: '📈',
        verified: false
      },
      message: 'Group Admin "Professor Alok (SEBI Registered)": "Good morning team! Today\'s institutional upper-circuit stock tip made 420% profit. Congrats to Amit (+₹3.4 Lakh) and Priya (+₹7.8 Lakh)! We have 5 slots left for tomorrow\'s VIP Institutional Block Trade. Guaranteed minimum 300% return with zero loss guarantee!"',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S08-01',
          text: 'Guaranteed minimum 300% return with zero loss guarantee!',
          indicatorId: 'E2',
          explanation: 'Stock markets involve risk. SEBI strictly prohibits anyone from guaranteeing returns or promising zero-loss investments.'
        },
        {
          id: 'RF-S08-02',
          text: 'Congrats to Amit (+₹3.4 Lakh) and Priya (+₹7.8 Lakh)!',
          indicatorId: 'E5',
          explanation: 'Manufactured social proof: group participants showing huge profit screenshots are fake accounts operating in collusion.'
        }
      ],
      choices: [
        {
          id: 'S08-N01-C01',
          label: 'Recognize the SEBI violation and exit the group immediately. Report the group to WhatsApp and SEBI SCORES',
          nextNodeId: 'S08-N04',
          good: true,
          indicatorIds: ['E2', 'E5'],
          consequence: 'Prudent decision! SEBI has warned that genuine institutional trading accounts cannot be opened via WhatsApp groups.',
          type: 'report'
        },
        {
          id: 'S08-N01-C02',
          label: 'DM the Admin asking how you can join the VIP Block Trade with your savings',
          nextNodeId: 'S08-N02',
          good: false,
          indicatorIds: ['E2', 'E5'],
          consequence: 'Lure accepted! The admin guides you to install a custom unlisted trading APK.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S08-N02',
      channel: 'whatsapp',
      sender: {
        name: 'Professor Alok Assistant (Kavita)',
        handle: 'VIP Onboarding Desk',
        avatar: '👩‍💼',
        verified: false
      },
      message: 'Kavita sends a link: "To participate in institutional pricing, download our institutional terminal \'GS-Pro Institutional Trading App\'. Transfer your initial investment of ₹50,000 to our clearing house corporate account (M/S Shree Balaji Enterprises) to fund your wallet."',
      timeLimitSeconds: 20,
      redFlags: [
        {
          id: 'RF-S08-03',
          text: 'Transfer your initial investment of ₹50,000 to our clearing house corporate account (M/S Shree Balaji Enterprises)',
          indicatorId: 'I6',
          explanation: 'Legitimate SEBI brokers require funds to be deposited via your own linked bank account directly to the clearing corporation, NEVER to third-party enterprise accounts.'
        }
      ],
      choices: [
        {
          id: 'S08-N02-C01',
          label: 'Refuse to deposit. Check the broker name on the official SEBI registry (sebi.gov.in)',
          nextNodeId: 'S08-N04',
          good: true,
          indicatorIds: ['I6', 'E2'],
          consequence: 'Bullet dodged! Checking sebi.gov.in confirms that neither the app nor the entity is registered.',
          type: 'inspect'
        },
        {
          id: 'S08-N02-C02',
          label: 'Transfer ₹50,000 to the Balaji Enterprises account and watch the fake app show ₹2,40,000 profit',
          nextNodeId: 'S08-N03',
          good: false,
          indicatorIds: ['I6', 'E2'],
          consequence: 'Severe financial snare! The virtual profit numbers on the app screen are completely fabricated by scammers.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S08-N03',
      channel: 'app',
      sender: {
        name: 'GS-Pro Fake Trading Terminal',
        handle: 'Withdrawal Section',
        avatar: '📊',
        verified: false
      },
      message: 'Your screen shows ₹2,40,000 profit balance! But when you click Withdraw, the prompt says: "To withdraw ₹2,40,000, you must pay 20% SEBI Capital Gains Tax (₹48,000) upfront to the designated tax escrow wallet within 24 hours."',
      redFlags: [
        {
          id: 'RF-S08-04',
          text: 'pay 20% SEBI Capital Gains Tax (₹48,000) upfront',
          indicatorId: 'I6',
          explanation: 'Taxes are never paid as upfront crypto or UPI transfers to private wallets. This is an extortion trap.'
        }
      ],
      choices: [
        {
          id: 'S08-N03-C01',
          label: 'Do not pay any "tax fee". Immediately file a formal complaint at 1930 / cybercrime.gov.in',
          nextNodeId: null,
          good: true,
          indicatorIds: ['I6'],
          consequence: 'Right action. Realizing that the entire terminal is simulated prevents further loss.',
          type: 'report'
        },
        {
          id: 'S08-N03-C02',
          label: 'Transfer ₹48,000 tax fee expecting the ₹2,40,000 withdrawal to clear',
          nextNodeId: null,
          good: false,
          indicatorIds: ['E2', 'I6'],
          consequence: 'Additional ₹48,000 lost. The scammers delete the group and vanish.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S08-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Protection',
        handle: 'Investment Safety Guard',
        avatar: '🛡️',
        verified: true
      },
      message: 'You protected your wealth from the multi-crore WhatsApp stock scam syndicates. Always trade only through SEBI-registered brokers (Zerodha, Groww, AngelOne, ICICI Direct).',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'SEBI-registered stock brokers NEVER trade through WhatsApp groups, promise guaranteed 300%+ returns, or require fund transfers to third-party mule accounts.',
    vulnerableTakeaway: 'Fake trading apps display manipulated numbers to give victims the illusion of massive profits, while preventing actual withdrawals unless more "fees" are paid.',
    preventionSteps: [
      'Verify any financial adviser on the official SEBI portal (scores.gov.in / sebi.gov.in).',
      'Never install unlisted trading APKs or transfer funds to personal/third-party accounts.',
      'Remember: High guaranteed returns with zero risk is the universal definition of fraud.'
    ],
    officialHelpline: '1930 / SEBI Toll-Free (1800 22 7575 / 1800 266 7575)'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S08;
}
if (typeof window !== 'undefined') {
  window.Scenario_S08 = S08;
}
