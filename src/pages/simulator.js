/**
 * ConVerse Page: Simulator Shell
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

import { t } from '../i18n/i18n.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createChip } from '../components/chip.js';
import { createBadge } from '../components/badge.js';
import { createModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { SAMPLE_CATEGORIES, SAMPLE_SCENARIOS } from '../data/initial-data.js';

export function renderSimulator(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  // Header Area
  const headerWrap = document.createElement("div");
  headerWrap.className = "page-header";
  headerWrap.innerHTML = `
    <h1 class="page-title">${t("sim_title")}</h1>
    <p class="page-subtitle">${t("sim_subtitle")}</p>
  `;
  pageWrap.appendChild(headerWrap);

  // Category Filter Chips
  const chipBar = document.createElement("div");
  chipBar.className = "flex gap-xs";
  chipBar.style.overflowX = "auto";
  chipBar.style.paddingBottom = "4px";

  let activeCategory = "all";
  const scenarioListContainer = document.createElement("div");
  scenarioListContainer.className = "grid-cols-2";

  SAMPLE_CATEGORIES.forEach((cat, idx) => {
    const chip = createChip({
      label: cat.label,
      icon: cat.icon,
      active: idx === 0,
      value: cat.id,
      onClick: (isActive, chipEl, val) => {
        chipBar.querySelectorAll(".cv-chip").forEach(c => c.classList.remove("cv-chip-active"));
        chipEl.classList.add("cv-chip-active");
        activeCategory = val;
        renderScenarioList();
      }
    });
    chipBar.appendChild(chip);
  });
  pageWrap.appendChild(chipBar);

  // Function to render scenario cards
  function renderScenarioList() {
    scenarioListContainer.innerHTML = "";
    const filtered = activeCategory === "all"
      ? SAMPLE_SCENARIOS
      : SAMPLE_SCENARIOS.filter(s => s.categoryId === activeCategory);

    if (filtered.length === 0) {
      scenarioListContainer.innerHTML = `
        <div class="cv-card" style="grid-column: 1 / -1; text-align: center; padding: 32px;">
          <p class="text-muted">No scenarios found in this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(sc => {
      const enterBtn = createButton({
        text: t("sim_start_scenario"),
        icon: "▶️",
        variant: "primary",
        size: "sm",
        onClick: () => launchScenarioModal(sc)
      });

      const card = createCard({
        title: sc.title,
        subtitle: `⏱️ ${sc.estimatedMinutes} mins • Difficulty: ${sc.difficulty}`,
        badge: createBadge({ text: sc.riskLevel.toUpperCase(), variant: sc.riskLevel }),
        body: `<p class="text-sm">${sc.description}</p>`,
        footer: enterBtn,
        interactive: true,
        highlight: sc.riskLevel,
        onClick: () => launchScenarioModal(sc)
      });

      scenarioListContainer.appendChild(card);
    });
  }

  // Interactive Scenario Simulator Modal (Slot for Simulation Engine Teammate)
  function launchScenarioModal(scenario) {
    const modalBody = document.createElement("div");
    modalBody.innerHTML = `
      <div style="background: var(--color-surface-card); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 16px;">
        <div class="flex items-center justify-between" style="margin-bottom: 8px;">
          <strong class="text-sm">Incoming Suspicious Request</strong>
          <span class="cv-badge cv-badge-warn">Sandbox Mode</span>
        </div>
        <p class="text-sm" style="color: var(--color-text);">"${scenario.description}"</p>
      </div>

      <div style="margin-bottom: 12px;">
        <p class="text-xs text-bold" style="margin-bottom: 6px; color: var(--color-text-muted);">SELECT YOUR REACTION:</p>
        <div class="flex-col gap-xs" id="sim-choices">
          <button class="cv-btn cv-btn-outline cv-btn-sm" style="text-align: left; justify-content: flex-start;" data-choice="safe">
            🛡️ Refuse & verify on official bank app directly
          </button>
          <button class="cv-btn cv-btn-outline cv-btn-sm" style="text-align: left; justify-content: flex-start;" data-choice="scam">
            ⚠️ Scan the QR code and enter UPI PIN
          </button>
          <button class="cv-btn cv-btn-outline cv-btn-sm" style="text-align: left; justify-content: flex-start;" data-choice="report">
            🚨 Hang up and dial 1930 Cyber Fraud helpline
          </button>
        </div>
      </div>

      <div id="sim-feedback-slot" style="display: none; margin-top: 12px;"></div>
    `;

    const modal = createModal({
      title: scenario.title,
      content: modalBody,
      footerButtons: [
        createButton({
          text: t("btn_close"),
          variant: "secondary",
          size: "sm",
          onClick: () => modal.close()
        })
      ]
    });

    // Handle choice selection inside modal
    modalBody.querySelectorAll("[data-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        const choice = btn.dataset.choice;
        const feedbackSlot = modalBody.querySelector("#sim-feedback-slot");
        feedbackSlot.style.display = "block";

        if (choice === "safe" || choice === "report") {
          feedbackSlot.innerHTML = `
            <div class="cv-card cv-card-highlight-safe" style="padding: 10px; background: var(--color-safe-surface); border: 1px solid var(--color-safe-border);">
              <strong class="text-safe text-sm">✓ Correct Defense Decision!</strong>
              <p class="text-xs" style="margin-top: 4px; color: var(--color-safe-text);">
                You recognized that entering a UPI PIN is only for sending money, never receiving. +25 Defense XP earned!
              </p>
            </div>
          `;
          showToast({
            title: "Defense Successful",
            message: "You avoided the trap! +25 Defense XP",
            type: "safe"
          });
        } else {
          feedbackSlot.innerHTML = `
            <div class="cv-card cv-card-highlight-danger" style="padding: 10px; background: var(--color-danger-surface); border: 1px solid var(--color-danger-border);">
              <strong class="text-danger text-sm">🚨 Scam Trap Triggered!</strong>
              <p class="text-xs" style="margin-top: 4px; color: var(--color-danger-text);">
                Entering your UPI PIN authorizes a DEBIT from your bank account. Scammers use fake receiver QR codes to drain balances.
              </p>
            </div>
          `;
          showToast({
            title: "Scam Warning",
            message: "Entering PIN authorizes a money deduction!",
            type: "danger"
          });
        }
      });
    });

    modal.open();
  }

  renderScenarioList();
  pageWrap.appendChild(scenarioListContainer);

  // Active Simulation Runner Contract Notice
  const contractBox = createCard({
    title: t("sim_active_session"),
    subtitle: t("sim_hook_notice"),
    icon: "🧩",
    body: `<p class="text-xs text-muted">Simulation Engine teammate can mount full multi-step dialogue trees and audio/visual mockups directly into this container using <code>src/engine/sim/sim-contract.js</code>.</p>`,
    highlight: "primary"
  });
  pageWrap.appendChild(contractBox);

  container.appendChild(pageWrap);
}
