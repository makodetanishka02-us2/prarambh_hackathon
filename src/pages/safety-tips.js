/**
 * ConVerse Page: Safety Guides
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 *
 * Practical, concise DO / DON'T playbooks across scam categories.
 */

import { t } from '../i18n/i18n.js';
import { createCard } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { getSafetyPlaybooks, getEmergencyHelplines } from '../engine/tips/tips-contract.js';

export function renderSafetyTips(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  // Header
  const headerWrap = document.createElement("div");
  headerWrap.className = "page-header";
  headerWrap.innerHTML = `
    <h1 class="page-title">${t("tips_title")}</h1>
    <p class="page-subtitle">${t("tips_subtitle")}</p>
  `;
  pageWrap.appendChild(headerWrap);

  // Search Filter Input
  const searchWrap = document.createElement("div");
  searchWrap.innerHTML = `
    <input type="search" id="guides-search-input" placeholder="${t('tips_search_placeholder')}" style="width: 100%; max-width: 540px;" />
  `;
  pageWrap.appendChild(searchWrap);

  // Guides List Container
  const guidesContainer = document.createElement("div");
  guidesContainer.id = "guides-list";
  guidesContainer.className = "grid-cols-2";

  function renderGuidesList(items) {
    guidesContainer.innerHTML = "";

    if (items.length === 0) {
      guidesContainer.innerHTML = `
        <div class="cv-card" style="grid-column: 1 / -1; text-align: center; padding: 32px;">
          <p class="text-muted">No safety guides match your search.</p>
        </div>
      `;
      return;
    }

    items.forEach(guide => {
      const card = createCard({
        title: guide.title,
        subtitle: `Category: ${guide.categoryLabel || guide.category.toUpperCase()}`,
        badge: createBadge({ text: "VERIFIED GUIDE", variant: "info" }),
        body: `
          <div style="margin-bottom: 12px; background: var(--color-bg-subtle); padding: 8px 12px; border-radius: var(--radius-sm);">
            <strong class="text-xs" style="color: var(--color-text-muted); text-transform: uppercase;">What to watch for:</strong>
            <p class="text-xs" style="margin: 4px 0 0 0; color: var(--color-text);">${guide.whatToWatchFor}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            <div style="background: var(--color-success-surface); border: 1px solid var(--color-success-border); border-radius: var(--radius-sm); padding: 8px 12px;">
              <strong class="text-xs" style="color: var(--color-success-text);">DO:</strong>
              <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 12px; color: var(--color-success-text); line-height: 1.4;">
                ${guide.dos ? guide.dos.map(d => `<li>${d}</li>`).join("") : `<li>${guide.summary || ""}</li>`}
              </ul>
            </div>

            <div style="background: var(--color-danger-surface); border: 1px solid var(--color-danger-border); border-radius: var(--radius-sm); padding: 8px 12px;">
              <strong class="text-xs" style="color: var(--color-danger-text);">DON'T:</strong>
              <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 12px; color: var(--color-danger-text); line-height: 1.4;">
                ${guide.donts ? guide.donts.map(d => `<li>${d}</li>`).join("") : `<li>${guide.keyTakeaway || ""}</li>`}
              </ul>
            </div>
          </div>
        `
      });
      guidesContainer.appendChild(card);
    });
  }

  const allGuides = getSafetyPlaybooks();
  renderGuidesList(allGuides);

  // Live Search Listener
  searchWrap.querySelector("#guides-search-input").addEventListener("input", (e) => {
    const q = e.target.value;
    const filtered = getSafetyPlaybooks({ query: q });
    renderGuidesList(filtered);
  });

  pageWrap.appendChild(guidesContainer);

  // Separated Emergency Resources Box
  const helplines = getEmergencyHelplines();
  const emergencySection = document.createElement("section");
  emergencySection.className = "notice-box-emergency";
  emergencySection.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div class="flex items-center gap-xs">
        <span class="cv-badge cv-badge-danger">Emergency Action</span>
        <strong style="color: var(--color-danger-text);">${t("tips_emergency_heading")}</strong>
      </div>
      <p class="text-xs" style="margin: 0; color: var(--color-danger-text);">
        ${t("tips_emergency_desc")}
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin-top: 6px;">
        ${helplines.map(h => `
          <div style="background: #FFFFFF; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-danger-border); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="text-xs text-bold" style="color: var(--color-text);">${h.title}</div>
              <div class="text-2xs text-muted">${h.number || h.url}</div>
            </div>
            <a href="${h.action}" target="${h.action.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer" class="cv-btn cv-btn-danger cv-btn-sm" style="text-decoration: none; padding: 3px 8px; font-size: 11px;">
              ${h.number ? 'Call ' + h.number : 'Visit ↗'}
            </a>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  pageWrap.appendChild(emergencySection);

  container.appendChild(pageWrap);
}
