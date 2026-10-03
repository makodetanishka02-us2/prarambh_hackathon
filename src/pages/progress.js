/**
 * ConVerse Page: Progress & Awareness Profile
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 *
 * Honest state-based progress tracking without fabricated metrics or fake rankings.
 */

import { t } from '../i18n/i18n.js';
import { getState, resetProgress } from '../app/state.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { createProgressBar } from '../components/progress.js';
import { REALISTIC_SCENARIOS } from '../data/initial-data.js';

export function renderProgress(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  const state = getState();
  const user = state.user || {};
  const completedIds = user.completedSimulations || [];

  // Header
  const headerWrap = document.createElement("div");
  headerWrap.className = "page-header";
  headerWrap.innerHTML = `
    <h1 class="page-title">${t("progress_title")}</h1>
    <p class="page-subtitle">${t("progress_subtitle")}</p>
  `;
  pageWrap.appendChild(headerWrap);

  // Check if any simulations have been completed
  if (completedIds.length === 0) {
    // Honest Empty State
    const emptyCard = createCard({
      title: t("progress_empty_title"),
      subtitle: t("progress_empty_desc"),
      icon: "ℹ️",
      body: `
        <p class="text-sm" style="margin-bottom: 14px;">
          Your awareness score, category defense breakdown, and simulation history will be recorded locally as you practice scenarios.
        </p>
      `,
      footer: `
        <a href="#simulator" class="cv-btn cv-btn-primary cv-btn-md" style="text-decoration: none;">
          ${t("hero_cta_start")} →
        </a>
      `
    });
    pageWrap.appendChild(emptyCard);
  } else {
    // Score & Readiness Profile
    const completedScenarios = REALISTIC_SCENARIOS.filter(s => completedIds.includes(s.id));
    const scoreVal = user.awarenessScore || 50;

    const profileCard = createCard({
      title: `Defense Awareness Score: ${scoreVal} / 100`,
      subtitle: `${completedIds.length} of ${REALISTIC_SCENARIOS.length} Available Scenarios Completed`,
      badge: createBadge({ text: `${completedIds.length} COMPLETED`, variant: "safe" }),
      body: `
        <div style="margin: 8px 0 16px 0;">
          <div class="flex items-center justify-between text-xs text-muted" style="margin-bottom: 4px;">
            <span>Overall Readiness</span>
            <span>${scoreVal} / 100</span>
          </div>
          <div class="cv-progress-track">
            <div class="cv-progress-bar cv-progress-bar-safe" style="width: ${scoreVal}%;"></div>
          </div>
        </div>
      `,
      footer: `
        <div class="flex items-center justify-between w-full">
          <span class="text-xs text-muted">Stored locally on this device</span>
          <a href="#simulator" class="cv-btn cv-btn-secondary cv-btn-sm" style="text-decoration: none;">
            Practice More Scenarios →
          </a>
        </div>
      `,
      highlight: "safe"
    });
    pageWrap.appendChild(profileCard);

    // List of Completed Scenarios
    const historySection = document.createElement("section");
    historySection.innerHTML = `
      <h2 style="font-size: 17px; margin-bottom: 8px;">Completed Scenarios</h2>
    `;
    const historyGrid = document.createElement("div");
    historyGrid.className = "grid-cols-2";

    completedScenarios.forEach(sc => {
      const card = createCard({
        title: sc.title,
        subtitle: `${sc.categoryLabel} • Difficulty: ${sc.difficulty}`,
        badge: createBadge({ text: "PRACTICED", variant: "safe" }),
        body: `<p class="text-xs" style="margin: 0;">${sc.shortDescription}</p>`,
        footer: `
          <a href="#simulator" class="cv-btn cv-btn-outline cv-btn-sm" style="text-decoration: none; width: 100%; text-align: center;">
            Review Scenario
          </a>
        `
      });
      historyGrid.appendChild(card);
    });

    historySection.appendChild(historyGrid);
    pageWrap.appendChild(historySection);
  }

  // Category Practice Matrix
  const matrixSection = document.createElement("section");
  matrixSection.innerHTML = `
    <h2 style="font-size: 17px; margin-bottom: 4px;">${t("progress_vulnerability_radar")}</h2>
    <p class="text-xs text-muted" style="margin-bottom: 12px;">Overview of practiced scam categories in India.</p>
  `;

  const matrixBody = document.createElement("div");
  matrixBody.className = "cv-card";
  matrixBody.style.padding = "16px";

  const categories = [
    { name: "UPI & Payment Fraud", id: "upi", status: completedIds.includes("sim-upi-qr-1") ? "Practiced" : "Pending Practice" },
    { name: "Phishing & Utility Alerts", id: "phishing", status: completedIds.includes("sim-electricity-bill-1") ? "Practiced" : "Pending Practice" },
    { name: "Bank & KYC Impersonation", id: "kyc", status: completedIds.includes("sim-fedex-police-1") ? "Practiced" : "Pending Practice" },
    { name: "Job / Task Prepaid Scams", id: "job", status: completedIds.includes("sim-part-time-job-1") ? "Practiced" : "Pending Practice" },
    { name: "High-Return Investment Scams", id: "investment", status: "Pending Practice" },
    { name: "Instant Loan Scams", id: "loan", status: "Pending Practice" }
  ];

  matrixBody.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${categories.map(c => `
        <div class="flex items-center justify-between" style="padding: 8px 12px; background: var(--color-bg-subtle); border-radius: var(--radius-sm);">
          <span class="text-xs text-bold" style="color: var(--color-text);">${c.name}</span>
          <span class="cv-badge ${c.status === 'Practiced' ? 'cv-badge-safe' : 'cv-badge-neutral'}">
            ${c.status === 'Practiced' ? '✓ Practiced' : 'Pending'}
          </span>
        </div>
      `).join("")}
    </div>
  `;

  matrixSection.appendChild(matrixBody);
  pageWrap.appendChild(matrixSection);

  container.appendChild(pageWrap);
}
