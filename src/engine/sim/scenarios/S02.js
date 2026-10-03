/**
 * ConVerse — Scenario S02: Wrong Transfer / Fake Refund Scam
 * Flags: E4, S4, I2
 * Difficulty: 2
 * Personas: shopkeeper, homemaker
 */

const S02 = {
  id: 'S02',
  title: 'Wrong Transfer / "Sent by Mistake"',
  category: 'UPI & Payment Fraud',
  difficulty: 2,
  personas: ['shopkeeper', 'homemaker'],
  summary: 'A frantic caller claims they accidentally transferred ₹25,000 intended for their mother\'s hospital bill to your UPI ID and begs for an immediate return.',
  startNodeId: 'S02-N01',

  nodes: [
    {
      id: 'S02-N01',
      channel: 'call',
      sender: {
        name: 'Desperate Unknown Caller',
        handle: '+91 88492 19283',
        avatar: '📞',
        verified: false
      },
      message: 'CALL TRANSCRIPT: "Bhaiya please help! I am calling you from an unknown number because I made a huge mistake! I wanted to send ₹25,000 for my mother\'s ICU admission, but I typed one wrong digit and it came to your PhonePe! I am sending you the screenshot on WhatsApp. Please send it back right now or my mother won\'t get admitted!"',
      timeLimitSeconds: 25,
      redFlags: [
        {
          id: 'RF-S02-01',
          text: 'mother\'s ICU admission',
          indicatorId: 'E4',
          explanation: 'Extreme emotional panic and emergency fabricated to bypass your critical verification.'
        },
        {
          id: 'RF-S02-02',
          text: 'calling you from an unknown number',
          indicatorId: 'S4',
          explanation: 'Unknown caller claiming an unverified accidental financial transfer.'
        }
      ],
      choices: [
        {
          id: 'S02-N01-C01',
          label: 'Stay calm and tell the caller you will independently check your bank passbook/app balance first',
          nextNodeId: 'S02-N02',
          good: true,
          indicatorIds: ['E4', 'S4'],
          consequence: 'Wise decision! Never rely on phone calls or forwarded screenshots. Always verify actual bank balance.',
          type: 'inspect'
        },
        {
          id: 'S02-N01-C02',
          label: 'Panic from the emotional plea and immediately open GPay to send ₹25,000 back',
          nextNodeId: 'S02-N03',
          good: false,
          indicatorIds: ['E4', 'I2'],
          consequence: 'Scam triggered! You sent ₹25,000 of your own hard-earned money without ever receiving a single rupee.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S02-N02',
      channel: 'app',
      sender: {
        name: 'Official Mobile Banking App',
        handle: 'NetBanking / Passbook Check',
        avatar: '🏦',
        verified: true
      },
      message: 'You log into your official banking app. Your recent transaction history shows NO incoming credit of ₹25,000. Meanwhile, the caller sends a fake forged SMS screenshot showing a fake credit notification.',
      redFlags: [
        {
          id: 'RF-S02-03',
          text: 'NO incoming credit of ₹25,000',
          indicatorId: 'S4',
          explanation: 'The screenshot was fabricated using a fake SMS generator or spoofing app.'
        }
      ],
      choices: [
        {
          id: 'S02-N02-C01',
          label: 'Inform the caller: "No money was credited to my account. Please contact your bank to raise an official chargeback dispute."',
          nextNodeId: 'S02-N04',
          good: true,
          indicatorIds: ['S4'],
          consequence: 'Spot on! Standard banking procedure for genuine wrong transfers is for the sender bank to initiate a reversal request.',
          type: 'report'
        },
        {
          id: 'S02-N02-C02',
          label: 'Believe the SMS screenshot over your bank app and initiate a UPI transfer of ₹25,000',
          nextNodeId: 'S02-N03',
          good: false,
          indicatorIds: ['I2', 'E4'],
          consequence: 'Fell for it! Screenshots can easily be edited. Your bank statement is the only source of truth.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S02-N03',
      channel: 'sms',
      sender: {
        name: 'Bank Debit SMS',
        handle: 'VK-SBIBNK',
        avatar: '💸',
        verified: true
      },
      message: 'Alert: Your Account has been debited by ₹25,000.00 via UPI to vikas.sharma@paytm. Available Balance: ₹3,410.00.',
      redFlags: [
        {
          id: 'RF-S02-04',
          text: 'debited by ₹25,000.00',
          indicatorId: 'I2',
          explanation: 'Money has been transferred from your account.'
        }
      ],
      choices: [
        {
          id: 'S02-N03-C01',
          label: 'Report to 1930 Cyber Crime Helpline and lodge an immediate complaint on National Cyber Crime Portal',
          nextNodeId: null,
          good: true,
          indicatorIds: ['S4'],
          consequence: 'Good recovery action! Swift reporting to 1930 allows cyber authorities to freeze the scammer wallet.',
          type: 'report'
        },
        {
          id: 'S02-N03-C02',
          label: 'Call the person back asking them to return your money',
          nextNodeId: null,
          good: false,
          indicatorIds: ['E4'],
          consequence: 'The number is permanently switched off. Scammers never return money willingly.',
          type: 'action'
        }
      ]
    },
    {
      id: 'S02-N04',
      channel: 'app',
      sender: {
        name: 'ConVerse Security',
        handle: 'Threat Averted',
        avatar: '🛡️',
        verified: true
      },
      message: 'Hearing you mention the official bank chargeback process, the scammer abruptly disconnected the call and deleted their WhatsApp profile. Your ₹25,000 is safe!',
      terminal: true,
      choices: []
    }
  ],

  result: {
    safeTakeaway: 'You followed the golden rule: Never refund an alleged "wrong transfer" directly. Always check your actual bank statement and instruct the sender to route reversals through their bank.',
    vulnerableTakeaway: 'Scammers exploit emergency stories and fake SMS screenshots to panic victims into sending their own money.',
    preventionSteps: [
      'Check official net-banking balance directly, never trust SMS notifications or screenshots.',
      'Legitimate wrong transfers must be resolved by the remitter filing a request with their bank.',
      'Block and report callers using urgent medical excuses to bypass verification.'
    ],
    officialHelpline: '1930 (National Cyber Crime Reporting Portal)'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = S02;
}
if (typeof window !== 'undefined') {
  window.Scenario_S02 = S02;
}
