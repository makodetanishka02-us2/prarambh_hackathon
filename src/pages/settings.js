/**
 * ConVerse Page: Settings Shell
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 *
 * Language switcher, privacy/storage explanation, offline mode, and data reset.
 */

import { t, getLanguage, setLanguage, getSupportedLanguages } from '../i18n/i18n.js';
import { getState, setState, resetProgress } from '../app/state.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderSettings(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  const state = getState();
  const currentLang = getLanguage();
  const supportedLangs = getSupportedLanguages();

  // Header
  const headerWrap = document.createElement("div");
  headerWrap.className = "page-header";
  headerWrap.innerHTML = `
    <h1 class="page-title">${t("settings_title")}</h1>
    <p class="page-subtitle">${t("settings_subtitle")}</p>
  `;
  pageWrap.appendChild(headerWrap);

  // 1. Language Selector (7 Official Indian Regional Languages)
  const langGrid = document.createElement("div");
  langGrid.className = "grid-cols-2";

  supportedLangs.forEach(lang => {
    const isSelected = lang.code === currentLang;
    const langBtn = document.createElement("button");
    langBtn.type = "button";
    langBtn.className = `cv-card cv-card-interactive ${isSelected ? "cv-card-highlight-primary" : ""}`;
    langBtn.style.textAlign = "left";
    langBtn.style.padding = "12px 14px";
    langBtn.style.backgroundColor = isSelected ? "var(--color-bg-subtle)" : "var(--color-surface)";
    langBtn.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-bold" style="color: var(--color-text);">${lang.nativeName}</div>
          <div class="text-xs text-muted">${lang.name} (${lang.script})</div>
        </div>
        ${isSelected ? '<span class="cv-badge cv-badge-safe">✓ Active</span>' : '<span class="text-xs text-muted">Select</span>'}
      </div>
    `;

    langBtn.addEventListener("click", () => {
      setLanguage(lang.code);
      renderSettings(container);
      showToast({
        title: "Language Changed",
        message: `Active language is now ${lang.name} (${lang.nativeName})`,
        type: "safe"
      });
    });

    langGrid.appendChild(langBtn);
  });

  const langCard = createCard({
    title: t("settings_language"),
    subtitle: "Supports 7 Indian regional languages with native script typography",
    body: langGrid
  });
  pageWrap.appendChild(langCard);

  // 2. Privacy & Local Storage Explanation
  const privacyCard = createCard({
    title: "Privacy & Data Storage",
    subtitle: "Local device storage only",
    body: `
      <p class="text-sm" style="margin-bottom: 8px;">${t("settings_privacy_storage")}</p>
      <div class="notice-box" style="padding: 8px 12px; font-size: 12px;">
        🔒 ConVerse never connects to real bank accounts, never requests PINs/OTPs, and does not sell or share user data.
      </div>
    `
  });
  pageWrap.appendChild(privacyCard);

  // 3. Offline Mode Preference
  const offlineBody = document.createElement("div");
  offlineBody.innerHTML = `
    <div class="flex items-center justify-between" style="padding: 4px 0;">
      <div>
        <strong class="text-sm">${t("settings_offline_mode")}</strong>
        <p class="text-xs text-muted" style="margin: 2px 0 0 0;">${t("settings_offline_desc")}</p>
      </div>
      <label style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; flex-shrink: 0; margin-left: 12px;">
        <input type="checkbox" id="offline-toggle" ${state.settings.offlineMode ? "checked" : ""} style="opacity: 0; width: 0; height: 0;" />
        <span style="position: absolute; inset: 0; background-color: ${state.settings.offlineMode ? "var(--color-primary)" : "var(--color-border)"}; border-radius: 24px; transition: 0.2s;">
          <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${state.settings.offlineMode ? "23px" : "3px"}; bottom: 3px; background-color: white; border-radius: 50%; transition: 0.2s;"></span>
        </span>
      </label>
    </div>
  `;

  offlineBody.querySelector("#offline-toggle").addEventListener("change", (e) => {
    setState({ settings: { ...state.settings, offlineMode: e.target.checked } });
    showToast({
      title: "Offline Settings",
      message: e.target.checked ? "Offline training mode enabled." : "Online mode restored.",
      type: "info"
    });
    renderSettings(container);
  });

  const offlineCard = createCard({
    title: "Connectivity",
    body: offlineBody
  });
  pageWrap.appendChild(offlineCard);

  // 4. Reset Training Progress
  const resetBtn = createButton({
    text: t("settings_reset_data"),
    variant: "danger",
    size: "sm",
    onClick: () => {
      const confirmModal = createModal({
        title: "Reset Training Progress?",
        content: `
          <p class="text-sm">Are you sure you want to reset all completed simulation records on this device? This action cannot be undone.</p>
        `,
        footerButtons: [
          createButton({
            text: "Cancel",
            variant: "secondary",
            size: "sm",
            onClick: () => confirmModal.close()
          }),
          createButton({
            text: "Yes, Reset Progress",
            variant: "danger",
            size: "sm",
            onClick: () => {
              resetProgress();
              confirmModal.close();
              showToast({
                title: "Progress Reset",
                message: "Training profile has been reset.",
                type: "info"
              });
              renderSettings(container);
            }
          })
        ]
      });
      confirmModal.open();
    }
  });

  const dangerCard = createCard({
    title: t("settings_reset_data"),
    subtitle: t("settings_reset_desc"),
    body: resetBtn,
    highlight: "danger"
  });
  pageWrap.appendChild(dangerCard);

  // 5. About & Version
  const aboutCard = createCard({
    title: t("settings_about_title"),
    subtitle: t("settings_version"),
    body: `
      <p class="text-xs text-muted" style="margin-bottom: 8px;">${t("settings_about_desc")}</p>
      <div class="flex items-center gap-xs" style="margin-top: 8px;">
        <a href="#styleguide" class="cv-btn cv-btn-secondary cv-btn-sm" style="text-decoration: none;">
          UI Styleguide
        </a>
      </div>
    `
  });
  pageWrap.appendChild(aboutCard);

  container.appendChild(pageWrap);
}
