/**
 * ConVerse — Scenario S05: Task-Based Part-Time Job Scam
 * Flags: E2, I6, E5
 * Difficulty: 1
 * Personas: student, homemaker
 */

const S05 = {
  id: 'S05',
  title: 'Task-Based Part-Time Job / "Like YouTube Videos"',
  category: 'Employment & Task Scams',
  difficulty: 1,
  personas: ['student', 'homemaker'],
  summary: 'A recruiter on Telegram offers ₹3,000–₹5,000/day for liking YouTube videos and rating Google Maps places, but eventually requires "prepaid crypto/merchant deposits" to unlock your salary.',
  startNodeId: 'S05-N01',

  nodes: [
    {
      id: 'S05-N01',
      channel: 'whatsapp',
      sender: {
        name: 'HR Neha (Global Digital Marketing)',
        handle: '+91 79012 33491',
        avatar: '💼',
        verified: false
      },
      message: 'Hi! We have a flexible Work-From-Home opportunity. Earn ₹3,000 to ₹8,000 daily simply by liking YouTube videos and rating hotels on Google Maps! No experience needed. We pay ₹150 for your first 3 trial tasks immediately. Interested?',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S05-01',
          text: 'Earn ₹3,000 to ₹8,000 daily simply by liking YouTube videos',
          indicatorId: 'E2',
          explanation: 'Absurdly high payouts for trivial digital tasks are the hallmark of structured task-fraud baiting.'
        }
      ],
      choices: [
        {
          id: 'S05-N01-C01',
          label: 'Recognize this as a classic task scam bait. Block and report the sender',
          nextNodeId: 'S05-N04',
          good: true,
          indicatorIds: ['E2'],
          consequence: 'Sharp intuition! Legitimate marketing agencies never hire random WhatsApp numbers for paid likes.',
          type: 'report'
        },
        {
          id: 'S05-N01-C02',
          label: 'Agree to do the 3 trial tasks to see if they actually send real money',
          nextNodeId: 'S05-N02',
          good: false,
          indicatorIds: ['E2'],
          consequence: 'Hook baited! Scammers will intentionally pay you ₹150 to establish false credibility before the real trap.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S05-N02',
      channel: 'app',
      sender: {
        name: 'Telegram VIP Earning Group',
        handle: 'Task Group #409 (5,200 members)',
        avatar: '👥',
        verified: false
      },
      message: 'You receive ₹150 on UPI. You are now added to a Telegram group where dozens of "members" share screenshots showing payouts of ₹50,000+. The Admin announces: "VIP Prepaid Task 4: Deposit ₹10,000 to crypto wallet to complete merchant order and withdraw ₹14,000 (40% profit in 20 mins)!"',
      timeLimitSeconds: 20,
      redFlags: [
        {
          id: 'RF-S05-02',
          text: 'Deposit ₹10,000 to crypto wallet to complete merchant order and withdraw ₹14,000',
          indicatorId: 'I6',
          explanation: 'Requiring workers to pay/deposit money to work or receive payouts is 100% fraud.'
        },
        {
          id: 'RF-S05-03',
          text: 'group where dozens of "members" share screenshots showing payouts',
          indicatorId: 'E5',
          explanation: 'Manufactured social proof: group members are bot accounts or fellow scammers operating in collusion.'
        }
      ],
      choices: [
        {
          id: 'S05-N02-C01',
          label: 'Refuse to deposit any money. Exit the group, report the Telegram channel, and keep the trial ₹150',
          nextNodeId: 'S05-N04',
          good: true,
          indicatorIds: ['I6', 'E5'],
          consequence: 'Masterclass move! You caught the switch from fake trial payout to upfront deposit extortion.',
          type: 'report'
        },
        {
          id: 'S05-N02-C02',
          label: 'Transfer ₹10,000 UPI believing the group testimonials and 40% guaranteed return',
          nextNodeId: 'S05-N03',
          good: false,
          indicatorIds: ['I6', 'E5'],
          consequence: 'Trapped! Your money is transferred to an offshore scammer pool.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S05-N03',
      channel: 'app',
      sender: {
        name: 'Telegram Admin / Fake Portal',
        handle: 'VIP Task Desk',
        avatar: '🔒',
        verified: false
      },
      message: 'Your virtual dashboard shows ₹14,000 balance, but when you click Withdraw, it fails: "System Error: You made a mistake in Task 4! To unfreeze your balance and withdraw ₹35,000, you must deposit a penalty fee of ₹25,000 immediately."',
      redFlags: [
        {
          id: 'RF-S05-04',
          text: 'deposit a penalty fee of ₹25,000 immediately',
          indicatorId: 'I6',
          explanation: 'The sunk cost trap: scammers fabricate system errors to extract ever-larger deposits.'
        }
      ],
      choices: [
        {
          id: 'S05-N03-C01',
          label: 'Stop sending any more money. Report to 1930 Cyber Helpline with transaction UTR numbers',
          nextNodeId: null,
          good: true,
          indicatorIds: ['I6'],
          consequence: 'Crucial stop-loss decision! Never pay "penalty fees" or "tax release fees" to scammers.',
          type: 'report'
        },
        {
          id: 'S05-N03-C02',
          label: 'Pay ₹25,000 hoping it will finally release your locked ₹14,000',
          nextNodeId: null,
          good: false,
          indicatorIds: ['E2', 'I6'],
          consequence: 'Complete financial loss. The virtual dashboard is completely fake.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S05-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Protection',
        handle: 'Job Safety Awareness',
        avatar: '🛡️',
        verified: true
      },
      message: 'You protected your money from the notorious Telegram task scam syndicate. Genuine jobs pay you for work; they never demand that you deposit money to earn.',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'Genuine employers NEVER ask you to deposit money, buy cryptocurrency, or pay "prepaid task fees" to receive salary.',
    vulnerableTakeaway: 'Task scams use small initial payouts (₹100–₹500) as psychological bait to lower your guard before demanding massive deposits.',
    preventionSteps: [
      'No genuine company pays ₹3,000/day for liking YouTube videos or Google reviews.',
      'Ignore Telegram / WhatsApp messages from unknown international numbers offering easy part-time work.',
      'Never send deposits or fees to unlock "frozen" virtual balances.'
    ],
    officialHelpline: '1930 / National Cyber Crime Portal (cybercrime.gov.in)'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S05;
}
if (typeof window !== 'undefined') {
  window.Scenario_S05 = S05;
}
