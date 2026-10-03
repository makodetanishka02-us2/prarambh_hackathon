/**
 * ConVerse Page: Progress & Defense Score Shell
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

export function renderProgress(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  const state = getState();
  const user = state.user;

  // Header
  const headerWrap = document.createElement("div");
  headerWrap.className = "page-header";
  headerWrap.innerHTML = `
    <h1 class="page-title">${t("progress_title")}</h1>
    <p class="page-subtitle">${t("progress_subtitle")}</p>
  `;
  pageWrap.appendChild(headerWrap);

  // Score Hero Card
  const scoreCard = createCard({
    title: user.level,
    subtitle: `${user.completedSimulations.length} Scenarios Mastered`,
    icon: "🏆",
    badge: createBadge({ text: `${user.awarenessScore}% DEFENSE SCORE`, variant: "safe" }),
    body: `
      <div style="margin: 12px 0;">
        <p class="text-sm">You are in the top 20% of protected users against UPI and SMS phishing attempts.</p>
      </div>
    `,
    footer: `
      <div class="flex items-center justify-between w-full">
        <span class="text-xs text-muted">Last simulated: Today</span>
        <button id="share-progress-btn" class="cv-btn cv-btn-primary cv-btn-sm">
          📤 ${t("btn_share")}
        </button>
      </div>
    `,
    highlight: "primary"
  });

  const mainProgressBar = createProgressBar({
    value: user.awarenessScore,
    max: 100,
    label: t("progress_score_label"),
    variant: "safe"
  });
  scoreCard.querySelector(".cv-card-body").appendChild(mainProgressBar);

  scoreCard.querySelector("#share-progress-btn").addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({
        title: "ConVerse Financial Scam Awareness",
        text: `I scored ${user.awarenessScore}% on ConVerse Scam Defense! Test your financial scam awareness score:`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`I scored ${user.awarenessScore}% on ConVerse Scam Defense! Check your awareness at: ${window.location.href}`);
      showToast({
        title: "Link Copied!",
        message: "Awareness score link copied to clipboard.",
        type: "safe"
      });
    }
  });

  pageWrap.appendChild(scoreCard);

  // Vulnerability Breakdown Card
  const vulnBody = document.createElement("div");
  vulnBody.className = "flex-col gap-sm";

  const categories = [
    { label: "UPI & QR Scam Defense", score: user.vulnerabilities.upi, variant: "safe" },
    { label: "SMS & Phishing Link Detection", score: user.vulnerabilities.phishingSms, variant: "primary" },
    { label: "Fake Impersonation Calls", score: user.vulnerabilities.fakeCalls, variant: "warn" },
    { label: "Part-time Job Schemes", score: user.vulnerabilities.jobFraud, variant: "safe" },
    { label: "High-Return Investment Scams", score: user.vulnerabilities.investmentScam, variant: "danger" }
  ];

  categories.forEach(item => {
    const bar = createProgressBar({
      value: item.score,
      max: 100,
      label: item.label,
      variant: item.variant
    });
    vulnBody.appendChild(bar);
  });

  const vulnCard = createCard({
    title: t("progress_vulnerability_radar"),
    subtitle: "Category-wise resilience and defense readiness",
    icon: "📊",
    body: vulnBody,
    highlight: "primary"
  });
  pageWrap.appendChild(vulnCard);

  // Earned Defense Badges
  const badgesGrid = document.createElement("div");
  badgesGrid.className = "grid-cols-3";

  user.earnedBadges.forEach(badge => {
    const bCard = createCard({
      title: badge.name,
      subtitle: badge.desc,
      icon: badge.icon,
      highlight: "safe"
    });
    badgesGrid.appendChild(bCard);
  });

  const badgesSection = createCard({
    title: t("progress_badges_title"),
    subtitle: "Milestones unlocked across scam defense training",
    icon: "🎖️",
    body: badgesGrid
  });
  pageWrap.appendChild(badgesSection);

  container.appendChild(pageWrap);
}
