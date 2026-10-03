/**
 * ConVerse Page: Safety Tips Shell
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

import { t } from '../i18n/i18n.js';
import { createCard } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { createTabs } from '../components/tabs.js';
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

  // Emergency First Response Card
  const helplines = getEmergencyHelplines();
  const emergencyListHtml = helplines.map(h => `
    <div style="background: var(--color-surface); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 8px; border: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong class="text-sm">${h.title}</strong>
        <p class="text-xs text-muted" style="margin: 2px 0 0 0;">${h.description}</p>
      </div>
      <a href="${h.action}" target="${h.action.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer" class="cv-btn cv-btn-danger cv-btn-sm" style="text-decoration: none; flex-shrink: 0; margin-left: 12px;">
        ${h.number || 'Open Portal'} ↗
      </a>
    </div>
  `).join("");

  const emergencyCard = createCard({
    title: t("tips_emergency_heading"),
    subtitle: t("tips_emergency_desc"),
    icon: "🚨",
    badge: createBadge({ text: "URGENT RESPONSE", variant: "danger" }),
    body: emergencyListHtml,
    highlight: "danger"
  });
  pageWrap.appendChild(emergencyCard);

  // Search Filter
  const searchWrap = document.createElement("div");
  searchWrap.innerHTML = `
    <input type="search" id="tips-search-input" placeholder="${t('tips_search_placeholder')}" style="width: 100%;" />
  `;
  pageWrap.appendChild(searchWrap);

  // Playbooks Tabs (All, UPI Rules, Impersonation, APK Malware)
  const playbooks = getSafetyPlaybooks();
  
  function renderPlaybookCards(items) {
    const list = document.createElement("div");
    list.className = "grid-cols-2";
    if (items.length === 0) {
      list.innerHTML = `<p class="text-muted" style="grid-column: 1 / -1; text-align: center; padding: 24px;">No guides match your search.</p>`;
      return list;
    }
    items.forEach(item => {
      const card = createCard({
        title: item.title,
        subtitle: `Category: ${item.category.toUpperCase()}`,
        badge: createBadge({ text: "CRITICAL DEFENSE", variant: "warn" }),
        body: `
          <p class="text-sm text-bold" style="color: var(--color-text);">${item.summary}</p>
          <p class="text-xs text-muted" style="margin-top: 6px;">${item.fullGuide}</p>
        `,
        footer: `
          <div style="font-size: 11px; color: var(--color-safe-text); background: var(--color-safe-surface); padding: 4px 8px; border-radius: var(--radius-xs); width: 100%;">
            🛡️ <strong>Golden Rule:</strong> ${item.keyTakeaway}
          </div>
        `,
        highlight: "warn"
      });
      list.appendChild(card);
    });
    return list;
  }

  const tipsContainer = document.createElement("div");
  tipsContainer.id = "tips-list-container";
  tipsContainer.appendChild(renderPlaybookCards(playbooks));

  // Connect live search
  const searchInput = searchWrap.querySelector("#tips-search-input");
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value;
    const filtered = getSafetyPlaybooks({ query: q });
    tipsContainer.innerHTML = "";
    tipsContainer.appendChild(renderPlaybookCards(filtered));
  });

  pageWrap.appendChild(tipsContainer);
  container.appendChild(pageWrap);
}
