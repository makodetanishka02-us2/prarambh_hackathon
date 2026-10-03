/**
 * ConVerse — Pre-Test and Post-Test Question Pool & Scoring Engine
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * 24 authentic multiple-choice questions (4 per dimension across all 6 radar dimensions).
 * Includes 6-question Pre-Test and 6-question Post-Test generators and improvement evaluators.
 */

const QUESTION_POOL = [
  // ================= URGENCY PRESSURE (U) — 4 Questions =================
  {
    id: 'Q-U1',
    dimension: 'urgency',
    indicatorId: 'U1',
    question: 'You receive an SMS stating: "Your electricity connection will be disconnected tonight at 9:30 PM due to unpaid bill of ₹480. Call officer on 98123-XXXX immediately." What is the most appropriate action?',
    options: [
      'Call the mobile number in the SMS quickly to pay ₹480 and prevent disconnection.',
      'Ignore the mobile number and check your billing status directly on the official state electricity board app or website.',
      'Forward the message to your family group asking them to pay it immediately.',
      'Send ₹480 to the caller\'s personal UPI handle provided on phone.'
    ],
    correctIndex: 1,
    explanation: 'Disconnection threats with short deadlines (tonight 9:30 PM) are common urgency scams. Genuine utility providers do not send personal mobile numbers for bill payments.'
  },
  {
    id: 'Q-U2',
    dimension: 'urgency',
    indicatorId: 'U2',
    question: 'A text message claims: "Your Bank Account and Debit Card will be BLOCKED TODAY within 2 hours due to unupdated KYC. Click http://bank-kyc-verify.link/update". What should you do?',
    options: [
      'Click the link immediately so your debit card is not deactivated.',
      'Enter your Aadhaar number and OTP on the web form.',
      'Do not click the link; banks never deactivate accounts in 2 hours via SMS links and official KYC is done through your official banking app or branch.',
      'Call the number that sent the SMS and give them your card details.'
    ],
    correctIndex: 2,
    explanation: 'Banks never block accounts on 2-hour notices via external SMS links. KYC updates are handled exclusively through official banking portals or bank branches.'
  },
  {
    id: 'Q-U3',
    dimension: 'urgency',
    indicatorId: 'U3',
    question: 'An online buyer on OLX contacts you: "I want to buy your furniture right now. I am sending a UPI Collect request for ₹15,000. Accept in 5 minutes or I will buy from someone else." What is true about this scenario?',
    options: [
      'You must approve the Collect request quickly before the buyer cancels.',
      'Entering your UPI PIN on a Collect request will debit ₹15,000 from your account, not credit it.',
      'Collect requests are the standard way to receive money into your bank.',
      'You should share your Debit Card CVV to speed up the transfer.'
    ],
    correctIndex: 1,
    explanation: 'A UPI Collect request always requests funds FROM you. You never enter a UPI PIN to receive money.'
  },
  {
    id: 'Q-U4',
    dimension: 'urgency',
    indicatorId: 'U4',
    question: 'A caller claiming to be a CBI Inspector tells you that an arrest warrant has been issued in your name and you have exactly 30 minutes to settle the case or police will arrive at your doorstep. How should you react?',
    options: [
      'Immediately pay whatever settlement amount they ask via RTGS.',
      'Understand that Indian law enforcement does not issue 30-minute arrest threats over phone calls or demand money settlements; hang up and report to 1930.',
      'Stay on the call and beg the caller for mercy.',
      'Share your NetBanking credentials for "verification".'
    ],
    correctIndex: 1,
    explanation: 'Law enforcement agencies follow due legal procedures and never demand emergency money transfers over phone calls to cancel arrest warrants.'
  },

  // ================= SENDER LEGITIMACY (S) — 4 Questions =================
  {
    id: 'Q-S1',
    dimension: 'sender',
    indicatorId: 'S1',
    question: 'You receive an SMS with header "BZ-HDFCBK-OFFER" asking you to update your credit card reward points. How can you verify whether this is genuine?',
    options: [
      'Assume it is genuine because the name contains "HDFCBK".',
      'Check official communications inside your official banking mobile app; scammers frequently spoof sender headers with lookalike variations.',
      'Click the link and enter your card expiry and CVV.',
      'Reply to the SMS asking if it is authentic.'
    ],
    correctIndex: 1,
    explanation: 'Sender IDs and headers can be spoofed or created with deceptive names. Always cross-check offers inside the official verified banking application.'
  },
  {
    id: 'Q-S2',
    dimension: 'sender',
    indicatorId: 'S2',
    question: 'A person wearing a police uniform video-calls you on WhatsApp claiming to be DCP Cyber Crime, showing a fake police station room, and stating you are under "Digital Arrest". What is the reality?',
    options: [
      'Digital Arrest is a recognized legal procedure in India where police inspect bank accounts via Skype.',
      'The concept of "Digital Arrest" does not exist under Indian law; police never conduct arrests or investigations via WhatsApp video calls.',
      'You must stay on the video call continuously and transfer money to the RBI verification account.',
      'You should show all your identity cards and bank passbooks on camera.'
    ],
    correctIndex: 1,
    explanation: 'Both the Supreme Court and Ministry of Home Affairs (MHA) have confirmed that "Digital Arrest" is a complete fabrication used by extortion syndicates.'
  },
  {
    id: 'Q-S3',
    dimension: 'sender',
    indicatorId: 'S3',
    question: 'You searched Google for "Airline Customer Care Number" to reschedule a flight. The number listed on a search result asks you to install "QuickSupport" or "AnyDesk" to process your refund of ₹1,200. What is happening?',
    options: [
      'This is standard technical support procedure for flight rescheduling.',
      'This is a fake customer care listing designed to gain remote control over your mobile phone and steal banking credentials.',
      'Installing AnyDesk is safe as long as you dont speak on the phone.',
      'You should install the app and enter your UPI PIN on screen.'
    ],
    correctIndex: 1,
    explanation: 'Fraudsters create fake Google search ads for airline, courier, and bank customer support. Genuine support never asks you to install screen-sharing software.'
  },
  {
    id: 'Q-S4',
    dimension: 'sender',
    indicatorId: 'S4',
    question: 'An unknown person calls crying that they accidentally transferred ₹20,000 meant for their child\'s hospital bill to your UPI ID and sends a screenshot of an SMS showing a transfer. What should you do?',
    options: [
      'Immediately transfer ₹20,000 back from your UPI app out of sympathy.',
      'Check your actual bank statement or net-banking balance directly; if no money came, it is a scam. If money actually arrived, ask them to route the reversal through their bank.',
      'Forward your UPI PIN to them so they can take their money back.',
      'Give them your ATM card number to refund the amount.'
    ],
    correctIndex: 1,
    explanation: 'Scammers forge SMS screenshots to panic victims into sending their own money. Legitimate wrong credits must be reversed through official bank banking channels.'
  },

  // ================= LINK & APP INTEGRITY (L) — 4 Questions =================
  {
    id: 'Q-L1',
    dimension: 'link',
    indicatorId: 'L1',
    question: 'You receive a WhatsApp message: "PM Free Laptop Scheme 2026! Register now at http://pm-laptop-yojana.xyz/apply". What indicator makes this link suspicious?',
    options: [
      'It contains the word "yojana".',
      'It uses an unofficial domain extension (.xyz) and non-HTTPS protocol instead of the official Government of India domain (.gov.in or .nic.in).',
      'It was sent over WhatsApp.',
      'The message is written in English.'
    ],
    correctIndex: 1,
    explanation: 'Official Indian government schemes are hosted strictly on ".gov.in" or ".nic.in" domains. Unofficial extensions (.xyz, .top, .site) are phishing traps.'
  },
  {
    id: 'Q-L2',
    dimension: 'link',
    indicatorId: 'L2',
    question: 'A contact in a Telegram group sends you a file named `FreeRecharge_v2.apk` and asks you to install it to get 1 year of free 5G data. Why is installing APKs dangerous?',
    options: [
      'APKs can only be opened on computers, not phones.',
      'Sideloaded APKs bypass Google Play Store security checks and can contain malware, keyloggers, and SMS forwarding trojans that steal banking OTPs.',
      'APKs will only slow down your internet speed.',
      'APKs are always safe if shared by friends.'
    ],
    correctIndex: 1,
    explanation: 'Sideloading unknown APK files grants malicious software system-level permissions to read confidential OTP messages and forward bank notifications.'
  },
  {
    id: 'Q-L3',
    dimension: 'link',
    indicatorId: 'L3',
    question: 'When clicking a link for your bank\'s login page, the address bar shows `http://onlinesbi.co.security-update.in/login`. How can you identify this as a phishing website?',
    options: [
      'The domain name has SBI in it, so it is genuine.',
      'The actual root domain is "security-update.in", which is an unauthorized deceptive domain trying to look like the genuine "onlinesbi.sbi".',
      'Any page that has a login form is safe.',
      'It has the word "security" in the URL.'
    ],
    correctIndex: 1,
    explanation: 'Subdomain deception uses the bank name as a subdomain prefix on a totally unrelated primary domain (security-update.in).'
  },
  {
    id: 'Q-L4',
    dimension: 'link',
    indicatorId: 'L5',
    question: 'An advertisement promises "Instant ₹50,000 Loan in 2 Minutes with No CIBIL Check" via a link to download an unofficial app. What risk is associated with such predatory loan apps?',
    options: [
      'They will charge slightly higher interest rates.',
      'They extract full access to your photo gallery and contacts, then use morphed photos and harassment messages to blackmail you and your relatives.',
      'They will report you to credit bureaus.',
      'There is no risk if you repay on time.'
    ],
    correctIndex: 1,
    explanation: 'Unregistered instant loan apps harvest contact lists and private photos to run abusive extortion and social shaming rackets.'
  },

  // ================= INFO & ACCESS SHARING (I) — 4 Questions =================
  {
    id: 'Q-I1',
    dimension: 'info',
    indicatorId: 'I1',
    question: 'A caller claiming to be from your bank states: "We are reversing a fraudulent debit of ₹5,000 from your account. Please read out the 6-digit OTP sent to your phone to confirm the refund." What should you do?',
    options: [
      'Share the OTP immediately because it is for receiving a refund.',
      'Never share the OTP with anyone under any circumstance; OTPs are for authorizing debits, not receiving refunds.',
      'Share only the first 3 digits of the OTP.',
      'Ask the caller to read the OTP to you first.'
    ],
    correctIndex: 1,
    explanation: 'Bank representatives and genuine payment systems NEVER ask for OTPs. Sharing an OTP gives scammers authorization to complete their debit transaction.'
  },
  {
    id: 'Q-I2',
    dimension: 'info',
    indicatorId: 'I2',
    question: 'Which of the following operations strictly requires entering your secret UPI PIN?',
    options: [
      'Receiving money sent by a friend into your bank account.',
      'Checking your account balance or transferring money OUT of your account.',
      'Accepting a cashback credit into your UPI wallet.',
      'Scanning a merchant\'s QR code to receive a payment for goods you sold.'
    ],
    correctIndex: 1,
    explanation: 'Entering a UPI PIN is exclusively used for authorizing debits (sending money) or checking balance. Receiving money never requires a PIN.'
  },
  {
    id: 'Q-I3',
    dimension: 'info',
    indicatorId: 'I5',
    question: 'A "Customer Support Representative" instructing you on fixing an ATM card problem asks you to install AnyDesk or TeamViewer QuickSupport on your smartphone and give them the 9-digit session code. What happens if you do this?',
    options: [
      'They can view your phone screen in real time, see your banking passwords, read incoming OTPs, and control your device remotely.',
      'It will securely link your phone to the bank server.',
      'It only allows them to fix your phone\'s network connection.',
      'It is safe as long as your phone is locked.'
    ],
    correctIndex: 0,
    explanation: 'Remote screen-sharing software gives fraudsters full visual and remote access to your device, allowing them to capture NetBanking credentials and read SMS OTPs.'
  },
  {
    id: 'Q-I4',
    dimension: 'info',
    indicatorId: 'I6',
    question: 'You are offered an online part-time job of liking YouTube videos for ₹50 per like. After earning ₹1,500 on paper, the coordinator demands you deposit ₹3,000 as a "VIP Security Recharge" to withdraw your earnings. What is this?',
    options: [
      'A legitimate platform fee required by all freelance portals.',
      'A task-based advance-fee scam where victims are lured with small fake profits and then extorted for escalating deposits that can never be withdrawn.',
      'A standard tax deduction required by the government.',
      'A refundable security deposit that will double your income.'
    ],
    correctIndex: 1,
    explanation: 'Work-from-home task scams ask for upfront deposits or wallet top-ups to release fake earnings. Once money is sent, scammers demand even higher deposits.'
  },

  // ================= EMOTIONAL MANIPULATION (E) — 4 Questions =================
  {
    id: 'Q-E1',
    dimension: 'emotion',
    indicatorId: 'E1',
    question: 'An automated IVR call says: "Customs Department Mumbai: A parcel containing 5 passports and 200g MDMA drugs addressed to you was intercepted. Press 9 to connect to investigating officer." How does this scam exploit emotion?',
    options: [
      'It uses greed by promising prizes.',
      'It uses intense fear and shock of criminal prosecution to make innocent victims panic and comply with extortion demands.',
      'It uses nostalgia and friendship.',
      'It offers legitimate legal representation.'
    ],
    correctIndex: 1,
    explanation: 'Narcotics parcel and customs scams use intense fear of criminal arrest and social disgrace to trap victims into paying extortionate clearance fees.'
  },
  {
    id: 'Q-E2',
    dimension: 'emotion',
    indicatorId: 'E2',
    question: 'A WhatsApp group named "VIP Stock Market Millionaires" shares screenshots of members making 500% guaranteed returns within 24 hours on institutional IPO allocations. What should you know?',
    options: [
      'Guaranteed high returns in stock markets do not exist; SEBI regulations prohibit guaranteed return promises and group members are often fake bot accounts creating social proof.',
      'You should invest a small amount of ₹5,000 to test if it is real.',
      'SEBI authorizes WhatsApp groups to trade institutional shares.',
      'High returns with zero risk are normal in modern crypto trading.'
    ],
    correctIndex: 0,
    explanation: 'Unrealistic guaranteed return promises exploit greed and FOMO. Legitimate investments carry market risk and regulated brokers do not operate through WhatsApp groups.'
  },
  {
    id: 'Q-E3',
    dimension: 'emotion',
    indicatorId: 'E3',
    question: 'A message from an unknown number with your relative\'s photo says: "Hi uncle, I had a severe accident on the highway and need ₹10,000 immediately for surgery. Don\'t call my mom, just UPI to this hospital account." How should you handle this?',
    options: [
      'Send ₹10,000 immediately because it is a family medical emergency.',
      'Directly call your relative or their parents on their known verified phone number to confirm their safety before sending any funds.',
      'Ask the sender to send a photo of the accident.',
      'Send half the amount to be cautious.'
    ],
    correctIndex: 1,
    explanation: 'Scammers use stolen social media photos and fake emergency stories to exploit family empathy. Always call the known phone number to verify.'
  },
  {
    id: 'Q-E4',
    dimension: 'emotion',
    indicatorId: 'E5',
    question: 'In a cryptocurrency trading group, 15 different members post messages praising the "Admin" for sending them ₹50,000 profits today. Why do scammers use this tactic?',
    options: [
      'Because the trading platform is genuinely popular.',
      'To create artificial social proof (herd mentality) and FOMO, making new members feel safe investing their savings.',
      'To provide customer reviews for SEBI compliance.',
      'To help new investors learn technical analysis.'
    ],
    correctIndex: 1,
    explanation: 'Syndicates use coordinated puppet accounts and fake payout receipts to manufacture trust and trick targets into lowering their guard.'
  },

  // ================= REPORTING & VERIFICATION (R) — 4 Questions =================
  {
    id: 'Q-R1',
    dimension: 'reporting',
    indicatorId: 'R1',
    question: 'If you realize that ₹35,000 was fraudulently debited from your bank account 15 minutes ago, what is the most critical first step you should take?',
    options: [
      'Post on social media asking for help.',
      'Call the National Cyber Crime Helpline (1930) or visit cybercrime.gov.in immediately to initiate a Golden Hour fund freeze on the recipient wallet/account.',
      'Wait 3 days to see if the bank automatically refunds the transaction.',
      'Call the scammer and demand they return the money.'
    ],
    correctIndex: 1,
    explanation: 'Calling 1930 within the Golden Hour (first 2 hours) allows law enforcement and banks to trace and freeze the stolen money across mule accounts before it is withdrawn at ATMs.'
  },
  {
    id: 'Q-R2',
    dimension: 'reporting',
    indicatorId: 'R2',
    question: 'If you suspect your NetBanking password or ATM card details were entered on a phishing website, what immediate banking action should you take?',
    options: [
      'Transfer all your money to a friend\'s UPI ID.',
      'Use your official banking app or bank helpline to immediately block the debit card, disable NetBanking/UPI access, and change all passwords.',
      'Delete the web browser app from your phone.',
      'Wait for the monthly bank statement to verify transactions.'
    ],
    correctIndex: 1,
    explanation: 'Instantly freezing cards and changing net-banking credentials halts unauthorized fund transfers before attackers can execute pending transactions.'
  },
  {
    id: 'Q-R3',
    dimension: 'reporting',
    indicatorId: 'R3',
    question: 'You receive a suspicious call claiming to be from SBI Head Office about suspicious transactions on your account. What is the safest way to verify this claim?',
    options: [
      'Call back the same number that called you.',
      'Disconnect and call the official toll-free number printed on the back of your debit card or visit your local home bank branch.',
      'Ask the caller for their employee badge number over the call.',
      'Look up random numbers on WhatsApp.'
    ],
    correctIndex: 1,
    explanation: 'Independent verification using the customer care number printed on your physical debit card or visiting your local branch guarantees you are speaking with authorized bank personnel.'
  },
  {
    id: 'Q-R4',
    dimension: 'reporting',
    indicatorId: 'R4',
    question: 'When reporting a financial cyber fraud on the National Cyber Crime Portal (cybercrime.gov.in), which details are essential for police investigation?',
    options: [
      'Only your name and home address.',
      'Transaction UTR/Reference number, date and time, fraudulent UPI ID/Account number, sender SMS/Call logs, and screenshots.',
      'Your secret UPI PIN and NetBanking password.',
      'Your social media account password.'
    ],
    correctIndex: 1,
    explanation: 'The UTR reference number, timestamp, fraudulent account/UPI ID, and communication evidence are vital for tracing the money trail through the banking system.'
  }
];

/**
 * Returns a balanced 6-question Pre-Test (1 question per dimension).
 * Uses deterministic selection (indices 0 from each dimension).
 * 
 * @returns {Array<Object>} 6 questions
 */
function getPreTestQuestions() {
  const dimensions = ['urgency', 'sender', 'link', 'info', 'emotion', 'reporting'];
  const questions = [];

  for (const dim of dimensions) {
    const dimQuestions = QUESTION_POOL.filter(q => q.dimension === dim);
    if (dimQuestions.length > 0) {
      questions.push(dimQuestions[0]); // First question of each dimension
    }
  }

  return questions;
}

/**
 * Returns a balanced 6-question Post-Test (1 question per dimension).
 * Uses distinct questions from the Pre-Test (indices 1 from each dimension).
 * 
 * @returns {Array<Object>} 6 questions
 */
function getPostTestQuestions() {
  const dimensions = ['urgency', 'sender', 'link', 'info', 'emotion', 'reporting'];
  const questions = [];

  for (const dim of dimensions) {
    const dimQuestions = QUESTION_POOL.filter(q => q.dimension === dim);
    if (dimQuestions.length > 1) {
      questions.push(dimQuestions[1]); // Second question of each dimension
    } else if (dimQuestions.length > 0) {
      questions.push(dimQuestions[0]);
    }
  }

  return questions;
}

/**
 * Evaluates submitted test answers against question set.
 * 
 * @param {Array<number>} userAnswers - Array of selected option indices (0-3)
 * @param {Array<Object>} questions - The question list
 * @returns {Object} Test evaluation report
 */
function evaluateTest(userAnswers = [], questions = []) {
  let correctCount = 0;
  const dimensionResults = {};
  const questionBreakdown = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userChoice = userAnswers[i];
    const isCorrect = userChoice === q.correctIndex;

    if (isCorrect) correctCount++;

    if (!dimensionResults[q.dimension]) {
      dimensionResults[q.dimension] = { total: 0, correct: 0 };
    }
    dimensionResults[q.dimension].total++;
    if (isCorrect) dimensionResults[q.dimension].correct++;

    questionBreakdown.push({
      questionId: q.id,
      dimension: q.dimension,
      indicatorId: q.indicatorId,
      userChoice,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    });
  }

  const total = questions.length;
  const scorePercentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return {
    total,
    correctCount,
    scorePercentage,
    dimensionResults,
    questionBreakdown,
    timestamp: Date.now()
  };
}

/**
 * Calculates improvement metrics between Pre-Test and Post-Test.
 * 
 * @param {number} preScore - Baseline pre-test percentage (0-100)
 * @param {number} postScore - Post-test percentage (0-100)
 * @returns {Object} { percentagePointImprovement, relativeImprovement }
 */
function calculateImprovement(preScore = 0, postScore = 0) {
  const percentagePointImprovement = Math.round((postScore - preScore) * 10) / 10;
  
  let relativeImprovement = 0;
  if (preScore > 0) {
    relativeImprovement = Math.round(((postScore - preScore) / preScore) * 100 * 10) / 10;
  } else if (postScore > 0) {
    relativeImprovement = 100.0;
  }

  return {
    preScore,
    postScore,
    percentagePointImprovement,
    relativeImprovement,
    improved: postScore > preScore
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    QUESTION_POOL,
    getPreTestQuestions,
    getPostTestQuestions,
    evaluateTest,
    calculateImprovement
  };
}

if (typeof window !== 'undefined') {
  window.TestPool = {
    QUESTION_POOL,
    getPreTestQuestions,
    getPostTestQuestions,
    evaluateTest,
    calculateImprovement
  };
}
