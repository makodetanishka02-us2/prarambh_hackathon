/**
 * ConVerse Page: Homepage (Dashboard)
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 */

import { t } from '../i18n/i18n.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { CORE_CATEGORIES, REALISTIC_SCENARIOS, EMERGENCY_RESOURCES } from '../data/initial-data.js';

export function renderDashboard(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  // 1. Hero Section (Clean, Educational, No Giant Marketing Blob)
  const heroSection = document.createElement("section");
  heroSection.className = "hero-section";
  heroSection.innerHTML = `
    <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: clamp(1.25rem, 3vw, 2.25rem); box-shadow: var(--shadow-xs);">
      <div style="max-width: 760px;">
        <span class="cv-badge cv-badge-neutral" style="margin-bottom: 12px;">
          Financial Safety Training for India
        </span>
        <h1 style="margin-bottom: 12px; color: var(--color-text); font-size: clamp(1.6rem, 3.5vw, 2.25rem); line-height: 1.25;">
          ${t("hero_title")}
        </h1>
        <p class="text-lead" style="margin-bottom: 20px; color: var(--color-text-secondary);">
          ${t("hero_subtitle")}
        </p>
        <div class="flex items-center gap-sm" style="flex-wrap: wrap;">
          <a href="#simulator" class="cv-btn cv-btn-primary cv-btn-md" style="text-decoration: none;">
            ${t("hero_cta_start")} →
          </a>
          <a href="#safety-tips" class="cv-btn cv-btn-secondary cv-btn-md" style="text-decoration: none;">
            ${t("btn_learn_more")}
          </a>
        </div>
      </div>
    </div>
  `;
  pageWrap.appendChild(heroSection);

  // 2. Fictional Disclaimer & Privacy Notice Banner
  const privacyNotice = document.createElement("div");
  privacyNotice.className = "notice-box";
  privacyNotice.innerHTML = `
    <div class="flex items-start gap-xs">
      <span class="cv-badge cv-badge-info" style="flex-shrink: 0; margin-top: 1px;">Notice</span>
      <p class="text-xs text-muted" style="margin: 0; line-height: 1.5;">
        ${t("home_privacy_notice")}
      </p>
    </div>
  `;
  pageWrap.appendChild(privacyNotice);

  // 3. How ConVerse Works (3 Structured Steps)
  const howSection = document.createElement("section");
  howSection.innerHTML = `
    <h2 style="margin-bottom: 4px;">${t("home_how_it_works_title")}</h2>
    <p class="text-sm text-muted" style="margin-bottom: 16px;">Three clear steps to build practical scam resistance.</p>
    <div class="grid-cols-3">
      <div class="cv-card" style="background: var(--color-surface);">
        <div class="text-sm text-bold" style="margin-bottom: 6px; color: var(--color-text);">${t("home_how_it_works_step1")}</div>
        <p class="text-xs text-muted">${t("home_how_it_works_step1_desc")}</p>
      </div>
      <div class="cv-card" style="background: var(--color-surface);">
        <div class="text-sm text-bold" style="margin-bottom: 6px; color: var(--color-text);">${t("home_how_it_works_step2")}</div>
        <p class="text-xs text-muted">${t("home_how_it_works_step2_desc")}</p>
      </div>
      <div class="cv-card" style="background: var(--color-surface);">
        <div class="text-sm text-bold" style="margin-bottom: 6px; color: var(--color-text);">${t("home_how_it_works_step3")}</div>
        <p class="text-xs text-muted">${t("home_how_it_works_step3_desc")}</p>
      </div>
    </div>
  `;
  pageWrap.appendChild(howSection);

  // 4. Core Scam Categories & Practice Scenarios Grid
  const categoriesSection = document.createElement("section");
  categoriesSection.innerHTML = `
    <div class="flex items-center justify-between" style="margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h2 style="margin-bottom: 2px;">${t("home_categories_title")}</h2>
        <p class="text-sm text-muted" style="margin: 0;">${t("home_categories_desc")}</p>
      </div>
      <a href="#simulator" class="cv-btn cv-btn-secondary cv-btn-sm" style="text-decoration: none;">
        ${t("btn_view_all")} (${REALISTIC_SCENARIOS.length}) →
      </a>
    </div>
  `;

  const scenariosGrid = document.createElement("div");
  scenariosGrid.className = "grid-cols-2";

  REALISTIC_SCENARIOS.slice(0, 4).forEach(scenario => {
    const card = createCard({
      title: scenario.title,
      subtitle: `${scenario.categoryLabel} • Difficulty: ${scenario.difficulty} • ~${scenario.timeMinutes} mins`,
      badge: createBadge({ text: scenario.difficulty.toUpperCase(), variant: scenario.difficulty === "Easy" ? "safe" : scenario.difficulty === "Hard" ? "danger" : "warn" }),
      body: `<p class="text-sm">${scenario.shortDescription}</p>`,
      footer: `
        <div class="flex items-center justify-between w-full">
          <span class="text-xs text-muted">${scenario.sender}</span>
          <a href="#simulator" class="cv-btn cv-btn-primary cv-btn-sm" style="text-decoration: none;">
            ${t("sim_start_scenario")} →
          </a>
        </div>
      `,
      interactive: true,
      onClick: () => {
        window.location.hash = "#simulator";
      }
    });
    scenariosGrid.appendChild(card);
  });

  categoriesSection.appendChild(scenariosGrid);
  pageWrap.appendChild(categoriesSection);

  // 5. Clearly Separated Emergency Help Section (No False Partner Claims)
  const emergencySection = document.createElement("section");
  emergencySection.className = "notice-box-emergency";
  emergencySection.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div class="flex items-center gap-xs">
        <span class="cv-badge cv-badge-danger">Emergency Assistance</span>
        <strong style="font-size: 15px; color: var(--color-danger-text);">${t("home_emergency_title")}</strong>
      </div>
      <p class="text-sm" style="margin: 0; color: var(--color-danger-text);">
        ${t("home_emergency_desc")}
      </p>
      <div class="flex items-center gap-sm" style="flex-wrap: wrap; margin-top: 4px;">
        <a href="tel:1930" class="cv-btn cv-btn-danger cv-btn-sm" style="text-decoration: none;">
          📞 ${t("home_emergency_cta")}
        </a>
        <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="cv-btn cv-btn-secondary cv-btn-sm" style="text-decoration: none;">
          🌐 Official Cyber Crime Portal (cybercrime.gov.in) ↗
        </a>
      </div>
    </div>
  `;
  pageWrap.appendChild(emergencySection);

  container.appendChild(pageWrap);
}
