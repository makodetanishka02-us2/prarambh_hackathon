/**
 * ConVerse i18n Infrastructure
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 * Supports 7 Indian Languages: en, hi, mr, ta, te, gu, pa
 */

import en from '../locales/en/common.js';
import hi from '../locales/hi/common.js';
import mr from '../locales/mr/common.js';
import ta from '../locales/ta/common.js';
import te from '../locales/te/common.js';
import gu from '../locales/gu/common.js';
import pa from '../locales/pa/common.js';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', flag: '🇮🇳' }
];

const translations = { en, hi, mr, ta, te, gu, pa };
const STORAGE_KEY = 'converse_preferred_language';
let currentLang = 'en';
const listeners = new Set();

/**
 * Initialize i18n system with stored or default language
 */
export function initI18n() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) {
      currentLang = saved;
    } else {
      // Check browser language
      const navLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
      if (translations[navLang]) {
        currentLang = navLang;
      }
    }
  } catch (err) {
    console.warn('ConVerse i18n: localStorage not accessible, using default "en".', err);
    currentLang = 'en';
  }

  applyLanguageToDocument(currentLang);
  return currentLang;
}

/**
 * Get current active language code
 */
export function getLanguage() {
  return currentLang;
}

/**
 * Set active language and notify subscribers
 */
export function setLanguage(langCode) {
  if (!translations[langCode]) {
    console.warn(`ConVerse i18n: Unsupported language code "${langCode}". Falling back to "en".`);
    langCode = 'en';
  }

  currentLang = langCode;

  try {
    localStorage.setItem(STORAGE_KEY, langCode);
  } catch (err) {
    // Ignore storage quota errors in private browsing
  }

  applyLanguageToDocument(langCode);
  updateDom();

  // Notify all subscribed listeners
  listeners.forEach((listener) => {
    try {
      listener(currentLang);
    } catch (err) {
      console.error('ConVerse i18n listener error:', err);
    }
  });
}

/**
 * Subscribe to language change events
 */
export function onLanguageChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Translate key with fallback to English and parameter replacement
 */
export function t(key, params = {}) {
  const currentDict = translations[currentLang] || translations.en;
  let text = currentDict[key];

  // Fallback to English if translation is missing in selected language
  if (text === undefined && currentLang !== 'en') {
    text = translations.en[key];
  }

  if (text === undefined) {
    return key;
  }

  // Parameter interpolation: {name} -> value
  if (params && typeof params === 'object') {
    return text.replace(/{(\w+)}/g, (_, match) => {
      return params[match] !== undefined ? params[match] : `{${match}}`;
    });
  }

  return text;
}

/**
 * Get full list of supported languages
 */
export function getSupportedLanguages() {
  return [...SUPPORTED_LANGUAGES];
}

/**
 * Helper to get language info by code
 */
export function getLanguageMeta(code) {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}

/**
 * Update document attributes & script-specific font classes
 */
function applyLanguageToDocument(lang) {
  if (typeof document === 'undefined') return;
  
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-script', getLanguageMeta(lang).script.toLowerCase());
}

/**
 * Automatically update all DOM elements containing data-i18n attributes
 */
export function updateDom(container = document) {
  if (!container || !container.querySelectorAll) return;

  // Text content translation
  container.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // Placeholder translation
  container.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.setAttribute('placeholder', t(key));
    }
  });

  // Title / Tooltip translation
  container.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      el.setAttribute('title', t(key));
    }
  });

  // Aria label translation
  container.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (key) {
      el.setAttribute('aria-label', t(key));
    }
  });
}
