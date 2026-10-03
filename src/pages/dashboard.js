/**
 * ConVerse Page: Dashboard Shell
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

import { t } from '../i18n/i18n.js';
import { getState } from '../app/state.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { createProgressBar } from '../components/progress.js';
import { showToast } from '../components/toast.js';
import { detectScamIndicators } from '../engine/detect/detect-contract.js';
import { getActiveScamRadar } from '../engine/radar/radar-contract.js';

export function renderDashboard(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  const state = getState();

  // 1. Welcome & Defense Status Hero
  const heroCard = createCard({
    title: t("dash_welcome"),
    subtitle: t("dash_tagline"),
    icon: "🛡️",
    badge: createBadge({ text: state.user.level, variant: "safe" }),
    body: `
      <div style="margin: 12px 0;">
        <p style="margin-bottom: 8px;">Your financial defense readiness level is active and learning.</p>
      </div>
    `,
    footer: `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <span class="text-xs text-muted">National Scam Alerts Synced</span>
        <span class="cv-badge cv-badge-safe">● Real-time Active</span>
      </div>
    `,
    highlight: "primary"
  });

  const progressWidget = createProgressBar({
    value: state.user.awarenessScore,
    max: 100,
    label: t("progress_score_label"),
    variant: "primary"
  });
  heroCard.querySelector(".cv-card-body").appendChild(progressWidget);
  pageWrap.appendChild(heroCard);

  // 2. Emergency Helpline 1930 Banner
  const helplineBanner = createCard({
    title: "National Cyber Fraud Emergency Helpline",
    subtitle: "Immediate intervention for unauthorized UPI, net banking, or OTP fraud",
    icon: "🚨",
    badge: createBadge({ text: "Toll-Free 1930", variant: "danger" }),
    body: `<p class="text-sm">If money was deducted or credentials were leaked in the last 24 hours, call <strong>1930</strong> immediately to freeze funds before cashout.</p>`,
    footer: `
      <div class="flex items-center justify-between w-full">
        <a href="tel:1930" class="cv-btn cv-btn-danger cv-btn-sm" style="text-decoration: none;">
          📞 Call 1930 Now
        </a>
        <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="cv-btn cv-btn-outline cv-btn-sm" style="text-decoration: none;">
          🌐 cybercrime.gov.in
        </a>
      </div>
    `,
    highlight: "danger"
  });
  pageWrap.appendChild(helplineBanner);

  // 3. Quick Scam Scanner Widget (Foundation Slot for Scam Detection Teammate)
  const scannerContainer = document.createElement("div");
  scannerContainer.innerHTML = `
    <div style="margin-bottom: 8px;">
      <textarea id="scanner-input" rows="3" placeholder="${t('dash_scanner_placeholder')}" style="resize: vertical;"></textarea>
    </div>
    <div id="scanner-results" style="display: none; margin-top: 10px;"></div>
  `;

  const scanButton = createButton({
    text: t("btn_scan"),
    icon: "🔍",
    variant: "primary",
    size: "md",
    onClick: () => {
      const inputEl = scannerContainer.querySelector("#scanner-input");
      const resultsEl = scannerContainer.querySelector("#scanner-results");
      const query = inputEl ? inputEl.value.trim() : "";

      if (!query) {
        showToast({
          title: "Input Required",
          message: "Please paste a message or UPI note to scan.",
          type: "warn"
        });
        return;
      }

      // Execute detection contract
      const result = detectScamIndicators(query);
      resultsEl.style.display = "block";
      resultsEl.innerHTML = `
        <div class="cv-card cv-card-highlight-${result.riskLevel}" style="padding: 12px; background: var(--color-surface);">
          <div class="flex items-center justify-between" style="margin-bottom: 6px;">
            <strong class="text-sm">${result.riskLevel === "danger" ? "🚨 Scam Indicators Detected" : "🛡️ Analysis Complete"}</strong>
            <span class="cv-badge cv-badge-${result.riskLevel}">Risk: ${result.confidenceScore}%</span>
          </div>
          <p class="text-xs" style="margin-bottom: 6px;">${result.explanation}</p>
          ${
            result.recommendedActions.length > 0
              ? `<ul style="padding-left: 18px; font-size: 12px; color: var(--color-text);">
                  ${result.recommendedActions.map(a => `<li>${a}</li>`).join("")}
                </ul>`
              : ""
          }
        </div>
      `;
      showToast({
        title: "Scan Complete",
        message: result.explanation,
        type: result.riskLevel
      });
    }
  });

  const scannerCard = createCard({
    title: t("dash_scanner_title"),
    subtitle: t("dash_scanner_desc"),
    icon: "⚡",
    body: scannerContainer,
    footer: scanButton,
    highlight: "warn"
  });
  pageWrap.appendChild(scannerCard);

  // 4. Active Threat Radar Slot (Foundation Slot for Radar Teammate)
  const radarThreats = getActiveScamRadar();
  const radarListEl = document.createElement("div");
  radarListEl.className = "flex-col gap-xs";

  radarThreats.slice(0, 2).forEach(threat => {
    const item = document.createElement("div");
    item.className = "flex items-center justify-between p-sm";
    item.style.backgroundColor = "var(--color-surface)";
    item.style.borderRadius = "var(--radius-sm)";
    item.style.padding = "8px 12px";
    item.style.border = "1px solid var(--color-border-subtle)";
    item.innerHTML = `
      <div>
        <div class="text-sm text-bold">${threat.title}</div>
        <div class="text-xs text-muted">${threat.category} • ${threat.trend}</div>
      </div>
      <span class="cv-badge cv-badge-${threat.severity}">${threat.reportedCount} reported</span>
    `;
    radarListEl.appendChild(item);
  });

  const radarCard = createCard({
    title: t("dash_radar_title"),
    subtitle: t("dash_radar_desc"),
    icon: "📡",
    body: radarListEl,
    footer: `
      <a href="#progress" class="cv-btn cv-btn-outline cv-btn-sm" style="text-decoration: none;">
        ${t("btn_view_all")} Trends →
      </a>
    `
  });
  pageWrap.appendChild(radarCard);

  // 5. Daily Defense Challenge
  const dailyCard = createCard({
    title: t("dash_daily_challenge"),
    subtitle: t("dash_daily_challenge_desc"),
    icon: "🎯",
    badge: createBadge({ text: "+50 Defense XP", variant: "info" }),
    body: `<p class="text-sm">Scenario: An SMS arrives stating "Dear consumer, your electricity supply will be disconnected at 9:30 PM due to unupdated bill. Contact 98765-XXXXX immediately."</p>`,
    footer: `
      <a href="#simulator" class="cv-btn cv-btn-primary cv-btn-sm" style="text-decoration: none;">
        ${t("btn_start")} Simulation →
      </a>
    `,
    highlight: "primary"
  });
  pageWrap.appendChild(dailyCard);

  container.appendChild(pageWrap);
}
