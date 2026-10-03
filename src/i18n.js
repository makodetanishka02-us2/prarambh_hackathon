/**
 * ConVerse — Internationalization (i18n.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Clean, lightweight i18n architecture supporting English and Hindi baseline.
 */

const translations = {
  en: {
    appTitle: 'ConVerse',
    tagline: 'PS-10 Financial Scam Simulator & Awareness Engine',
    dashboard: 'Dashboard',
    simulator: 'Simulator',
    radar: 'Radar',
    tips: 'Tips',
    progress: 'Progress',
    preTest: 'Pre-Test',
    postTest: 'Post-Test',
    startSimulation: 'Start Simulation',
    startTrainingSession: 'Start 3-Scenario Session',
    essentialTips: 'Essential Tips',
    highPriorityScenarios: 'High Priority Scenarios for You',
    exploreAllScenarios: 'Explore All Scenarios (S01–S10)',
    level: 'Level',
    whatWillYouDo: 'What will you do?',
    continue: 'Continue',
    viewReport: 'View Final Simulation Report',
    safeDecision: 'Safe Decision Recognized!',
    scamTrap: 'Scam Trap Triggered!',
    helpline: 'National Cyber Crime Helpline: 1930',
    cyberPortal: 'cybercrime.gov.in',
    confidence: 'Confidence:',
    unsure: 'Unsure',
    fairlySure: 'Fairly sure',
    certain: 'Certain',
    listenAloud: 'Read Aloud',
    completed: 'Completed',
    avgScore: 'Avg Score',
    rank: 'Rank',
    noHistory: 'No completed scenarios yet. Start your first simulation or take the baseline pre-test!',
    practiceScenario: 'Practice Scenario',
    improvement: 'Improvement'
  },
  hi: {
    appTitle: 'कॉनवर्स (ConVerse)',
    tagline: 'वित्तीय धोखाधड़ी सिमुलेटर और जागरूकता इंजन',
    dashboard: 'डैशबोर्ड',
    simulator: 'सिमुलेटर',
    radar: 'रडार',
    tips: 'सुरक्षा नियम',
    progress: 'प्रगति',
    preTest: 'पूर्व-परीक्षण (Pre-Test)',
    postTest: 'उत्तर-परीक्षण (Post-Test)',
    startSimulation: 'सिमुलेशन शुरू करें',
    startTrainingSession: '3-परिदृश्य प्रशिक्षण सत्र',
    essentialTips: 'महत्वपूर्ण सुझाव',
    highPriorityScenarios: 'आपके लिए प्राथमिकता वाले परिदृश्य',
    exploreAllScenarios: 'सभी परिदृश्य देखें (S01–S10)',
    level: 'स्तर',
    whatWillYouDo: 'आप क्या करेंगे?',
    continue: 'आगे बढ़ें',
    viewReport: 'अंतिम रिपोर्ट देखें',
    safeDecision: 'सुरक्षित निर्णय लिया गया!',
    scamTrap: 'धोखाधड़ी का जाल!',
    helpline: 'राष्ट्रीय साइबर हेल्पलाइन: 1930',
    cyberPortal: 'cybercrime.gov.in',
    confidence: 'विश्वास स्तर:',
    unsure: 'अनिश्चित',
    fairlySure: 'कुछ हद तक निश्चित',
    certain: 'पूरी तरह निश्चित',
    listenAloud: 'सुनें (आवाज)',
    completed: 'पूरा किया',
    avgScore: 'औसत स्कोर',
    rank: 'रैंक',
    noHistory: 'अभी तक कोई परिदृश्य पूरा नहीं हुआ है। अपना पहला सिमुलेशन शुरू करें!',
    practiceScenario: 'अभ्यास करें',
    improvement: 'सुधार'
  }
};

let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('converse_lang')) || 'en';

function getLang() {
  return currentLang;
}

function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('converse_lang', lang);
    }
  }
}

function t(key, fallback = '') {
  const dict = translations[currentLang] || translations.en;
  return dict[key] || fallback || key;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    translations,
    getLang,
    setLang,
    t
  };
}

if (typeof window !== 'undefined') {
  window.i18n = {
    translations,
    getLang,
    setLang,
    t
  };
}
