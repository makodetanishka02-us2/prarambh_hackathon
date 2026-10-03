/**
 * ConVerse Main Application Bootstrap
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

import { initI18n, getLanguage, setLanguage, getSupportedLanguages, onLanguageChange, updateDom, t } from '../i18n/i18n.js';
import { initState } from './state.js';
import { initRouter, getCurrentRoute, navigate } from './router.js';
import { createModal } from '../components/modal.js';
import { createButton } from '../components/button.js';

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize State & i18n
  initState();
  initI18n();

  const mainContent = document.getElementById("main-content");
  
  // 2. Initialize Client Router
  if (mainContent) {
    initRouter(mainContent);
  }

  // 3. Setup Header Language Selector Trigger
  setupHeaderLanguageTrigger();

  // 4. Listen to Language Changes to re-render DOM & Active Route
  onLanguageChange((newLang) => {
    updateDom(document);
    updateHeaderLangLabel();
    const currentRoute = getCurrentRoute();
    navigate(currentRoute);
  });

  // Initial translation pass on shell elements
  updateDom(document);
  updateHeaderLangLabel();

  // 5. Register PWA Service Worker (if supported)
  registerServiceWorker();
});

/**
 * Configure Language Modal Trigger in Header
 */
function setupHeaderLanguageTrigger() {
  const triggerBtn = document.getElementById("header-lang-btn");
  if (!triggerBtn) return;

  triggerBtn.addEventListener("click", () => {
    const currentLang = getLanguage();
    const supported = getSupportedLanguages();

    const langListEl = document.createElement("div");
    langListEl.className = "grid-cols-2";

    const modal = createModal({
      title: "Select Language / भाषा चुनें",
      content: langListEl,
      size: "md"
    });

    supported.forEach(lang => {
      const isSelected = lang.code === currentLang;
      const itemBtn = document.createElement("button");
      itemBtn.type = "button";
      itemBtn.className = `cv-card cv-card-interactive ${isSelected ? "cv-card-highlight-primary" : ""}`;
      itemBtn.style.textAlign = "left";
      itemBtn.style.padding = "12px";
      itemBtn.style.backgroundColor = isSelected ? "var(--color-primary-surface)" : "var(--color-surface-card)";
      itemBtn.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-bold">${lang.nativeName}</div>
            <div class="text-xs text-muted">${lang.name} (${lang.script})</div>
          </div>
          ${isSelected ? '<span class="cv-badge cv-badge-safe">✓ Active</span>' : ''}
        </div>
      `;

      itemBtn.addEventListener("click", () => {
        setLanguage(lang.code);
        modal.close();
      });

      langListEl.appendChild(itemBtn);
    });

    modal.open();
  });
}

/**
 * Update Language indicator in header button
 */
function updateHeaderLangLabel() {
  const labelEl = document.getElementById("header-lang-label");
  if (!labelEl) return;
  const current = getLanguage();
  const supported = getSupportedLanguages();
  const meta = supported.find(l => l.code === current) || supported[0];
  labelEl.textContent = `${meta.nativeName}`;
}

/**
 * PWA Service Worker Registration
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('ConVerse Service Worker active:', reg.scope);
      })
      .catch(err => {
        console.log('ConVerse Service Worker registration skipped:', err);
      });
  }
}
