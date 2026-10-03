/**
 * ConVerse Page: Scam Simulator
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 *
 * Realistic communication channel simulation with educational feedback and structured results.
 */

import { t } from '../i18n/i18n.js';
import { getState, setState } from '../app/state.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createChip } from '../components/chip.js';
import { createBadge } from '../components/badge.js';
import { showToast } from '../components/toast.js';
import { emitRadarEvent } from '../engine/radar/radar-contract.js';
import { CORE_CATEGORIES, REALISTIC_SCENARIOS } from '../data/initial-data.js';


let activeScenario = null;
let currentStepState = {
  chosenOption: null,
  isSubmitted: false
};

export function renderSimulator(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  if (activeScenario) {
    // Render Active Simulation Sandbox
    renderActiveSandbox(pageWrap, activeScenario, () => {
      activeScenario = null;
      currentStepState = { chosenOption: null, isSubmitted: false };
      renderSimulator(container);
    });
  } else {
    // Render Scenario Discovery Catalog
    renderScenarioDiscovery(pageWrap, (selectedScenario) => {
      activeScenario = selectedScenario;
      currentStepState = { chosenOption: null, isSubmitted: false };
      renderSimulator(container);
    });
  }

  container.appendChild(pageWrap);
}

/**
 * Render Catalog of Available Scenarios with Category Filters
 */
function renderScenarioDiscovery(wrapper, onSelectScenario) {
  // Header
  const headerWrap = document.createElement("div");
  headerWrap.className = "page-header";
  headerWrap.innerHTML = `
    <h1 class="page-title">${t("sim_title")}</h1>
    <p class="page-subtitle">${t("sim_subtitle")}</p>
  `;
  wrapper.appendChild(headerWrap);

  // Fictional Notice
  const noticeBox = document.createElement("div");
  noticeBox.className = "notice-box";
  noticeBox.style.marginBottom = "8px";
  noticeBox.innerHTML = `
    <div class="flex items-center gap-xs">
      <span class="cv-badge cv-badge-info">Training Sandbox</span>
      <span class="text-xs text-muted">${t("sim_fictional_banner")}</span>
    </div>
  `;
  wrapper.appendChild(noticeBox);

  // Category Filter Chips
  const filterWrap = document.createElement("div");
  filterWrap.className = "flex gap-xs";
  filterWrap.style.overflowX = "auto";
  filterWrap.style.paddingBottom = "6px";
  filterWrap.setAttribute("role", "tablist");
  filterWrap.setAttribute("aria-label", "Scenario Categories");

  let activeCategory = "all";
  const scenarioGrid = document.createElement("div");
  scenarioGrid.className = "grid-cols-2";

  function refreshGrid() {
    scenarioGrid.innerHTML = "";
    const filtered = activeCategory === "all"
      ? REALISTIC_SCENARIOS
      : REALISTIC_SCENARIOS.filter(s => s.categoryId === activeCategory);

    if (filtered.length === 0) {
      scenarioGrid.innerHTML = `
        <div class="cv-card" style="grid-column: 1 / -1; text-align: center; padding: 32px;">
          <p class="text-muted">No scenarios currently listed under this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(sc => {
      const card = createCard({
        title: sc.title,
        subtitle: `${sc.categoryLabel} • Difficulty: ${sc.difficulty} • ~${sc.timeMinutes} mins`,
        badge: createBadge({
          text: sc.difficulty.toUpperCase(),
          variant: sc.difficulty === "Easy" ? "safe" : sc.difficulty === "Hard" ? "danger" : "warn"
        }),
        body: `
          <p class="text-sm" style="margin-bottom: 8px;">${sc.shortDescription}</p>
          <div style="font-size: 12px; color: var(--color-text-muted); background: var(--color-surface-sunken); padding: 6px 10px; border-radius: var(--radius-sm);">
            <strong>Simulated Channel:</strong> ${sc.channel.toUpperCase()} (${sc.sender})
          </div>
        `,
        footer: `
          <div class="flex items-center justify-between w-full">
            <span class="text-xs text-muted">${sc.decisionCount} Decisions</span>
            <button class="cv-btn cv-btn-primary cv-btn-sm">
              ${t("sim_start_scenario")} →
            </button>
          </div>
        `,
        interactive: true,
        onClick: () => onSelectScenario(sc)
      });
      scenarioGrid.appendChild(card);
    });
  }

  CORE_CATEGORIES.forEach((cat, idx) => {
    const chip = createChip({
      label: cat.label,
      icon: cat.icon,
      active: idx === 0,
      value: cat.id,
      onClick: (isActive, chipEl, val) => {
        filterWrap.querySelectorAll(".cv-chip").forEach(c => c.classList.remove("cv-chip-active"));
        chipEl.classList.add("cv-chip-active");
        activeCategory = val;
        refreshGrid();
      }
    });
    filterWrap.appendChild(chip);
  });

  wrapper.appendChild(filterWrap);
  refreshGrid();
  wrapper.appendChild(scenarioGrid);
}

/**
 * Render Interactive Simulation Sandbox with Channel UI and Educational Feedback
 */
function renderActiveSandbox(wrapper, scenario, onExit) {
  const container = document.createElement("div");
  container.className = "sim-sandbox-container";

  // Top Bar (Scenario details, category, exit button)
  const topBar = document.createElement("div");
  topBar.className = "sim-sandbox-header";
  topBar.innerHTML = `
    <div class="flex items-center gap-xs">
      <button id="sim-exit-btn" class="cv-btn cv-btn-secondary cv-btn-sm" aria-label="Exit Simulation">
        ← ${t("btn_back")}
      </button>
      <div>
        <h2 style="font-size: 15px; margin: 0; font-weight: 600;">${scenario.title}</h2>
        <span class="text-xs text-muted">${scenario.categoryLabel} • Difficulty: ${scenario.difficulty}</span>
      </div>
    </div>
    <span class="sim-fictional-tag">Fictional Simulation</span>
  `;
  topBar.querySelector("#sim-exit-btn").addEventListener("click", onExit);
  container.appendChild(topBar);

  // Communication Channel Simulator View (SMS, UPI Collect, or Call)
  const channelView = document.createElement("div");

  if (scenario.channel === "sms") {
    channelView.className = "sim-channel-sms";
    channelView.innerHTML = `
      <div class="sim-sms-header">
        <div class="sim-sms-sender">${scenario.simulatedContent.senderId}</div>
        <div class="text-xs text-muted">${scenario.simulatedContent.timestamp}</div>
      </div>
      <div class="sim-sms-bubble">
        <p style="margin: 0; color: var(--color-text); font-size: 14px;">${scenario.simulatedContent.message}</p>
        <div class="sim-sms-time">Delivered • SMS</div>
      </div>
    `;
  } else if (scenario.channel === "upi") {
    channelView.className = "sim-channel-upi";
    channelView.innerHTML = `
      <div class="sim-upi-card">
        <div class="flex items-center justify-between" style="border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
          <div>
            <strong class="text-sm">Payment Collect Request</strong>
            <div class="text-xs text-muted">From: ${scenario.simulatedContent.payeeName}</div>
          </div>
          <span class="cv-badge cv-badge-warn">Collect Request</span>
        </div>
        <div style="text-align: center; padding: 16px 0;">
          <div class="text-xs text-muted">Requesting Amount</div>
          <div class="sim-upi-amount">${scenario.simulatedContent.amount}</div>
          <div class="text-xs" style="color: var(--color-text); background: var(--color-bg-subtle); padding: 4px 8px; border-radius: var(--radius-xs); display: inline-block;">
            VPA: ${scenario.simulatedContent.vpa}
          </div>
          <p class="text-xs text-muted" style="margin-top: 8px;">Note: "${scenario.simulatedContent.note}"</p>
        </div>
        <div class="notice-box" style="padding: 8px; font-size: 12px; margin-bottom: 0;">
          💬 Buyer prompt: "${scenario.simulatedContent.promptMessage}"
        </div>
      </div>
    `;
  } else {
    // Call screen / transcript view
    channelView.className = "sim-channel-sms";
    channelView.innerHTML = `
      <div class="sim-sms-header">
        <div class="sim-sms-sender">📞 ${scenario.simulatedContent.callerName}</div>
        <div class="text-xs text-muted">Active Call • Duration: ${scenario.simulatedContent.callDuration}</div>
      </div>
      <div class="sim-sms-bubble" style="border-left: 3px solid var(--color-danger);">
        <strong class="text-xs text-muted">CALL TRANSCRIPT:</strong>
        <p style="margin: 4px 0 0 0; color: var(--color-text); font-size: 14px;">"${scenario.simulatedContent.transcript}"</p>
      </div>
    `;
  }
  container.appendChild(channelView);

  // Decision Controls Box ("What do you do?")
  const decisionBox = document.createElement("div");
  decisionBox.className = "sim-decision-box";

  const decisionHeading = document.createElement("div");
  decisionHeading.className = "sim-decision-heading";
  decisionHeading.textContent = t("sim_decision_title");
  decisionBox.appendChild(decisionHeading);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "sim-decision-options";

  const feedbackContainer = document.createElement("div");
  feedbackContainer.id = "sim-feedback-slot";

  scenario.choices.forEach(choice => {
    const choiceBtn = document.createElement("button");
    choiceBtn.type = "button";
    choiceBtn.className = "cv-btn cv-btn-outline sim-decision-btn";
    choiceBtn.innerHTML = `<span>${choice.text}</span>`;

    choiceBtn.addEventListener("click", () => {
      // Highlight selected button
      optionsContainer.querySelectorAll(".sim-decision-btn").forEach(b => {
        b.disabled = true;
        b.classList.remove("cv-btn-primary");
      });
      choiceBtn.classList.add("cv-btn-primary");

      // Render Educational Feedback (Not Judgmental)
      const feedback = choice.feedback;
      feedbackContainer.innerHTML = `
        <div class="cv-feedback-card ${choice.isSafe ? "cv-feedback-safe" : "cv-feedback-missed"}">
          <div class="cv-feedback-title">${choice.isSafe ? "✓ Safe Decision" : "⚠ Warning Sign Missed"}</div>
          <div class="cv-feedback-desc">${feedback.desc}</div>
          <div class="cv-feedback-takeaway">
            <strong>Safer Option:</strong> ${feedback.saferOption}<br/>
            <span class="text-muted">Why this mattered: ${feedback.whyItMattered}</span>
          </div>
        </div>

        <!-- Structured Results Summary -->
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--color-border);">
          <h3 style="font-size: 16px; margin-bottom: 8px;">${t("sim_results_title")}</h3>
          <div class="cv-results-grid">
            <div class="cv-results-box">
              <div class="cv-results-box-title" style="color: var(--color-success-text);">
                ✓ ${t("sim_red_flags_caught")}
              </div>
              <ul style="padding-left: 18px; margin: 0; font-size: 13px; color: var(--color-text);">
                ${choice.isSafe
                  ? scenario.warningSigns.map(ws => `<li>${ws}</li>`).join("")
                  : `<li>Recognized that verification is required before any irreversible action.</li>`}
              </ul>
            </div>
            <div class="cv-results-box">
              <div class="cv-results-box-title" style="color: var(--color-danger-text);">
                ${choice.isSafe ? "Key Rules to Remember" : "⚠ " + t("sim_red_flags_missed")}
              </div>
              <ul style="padding-left: 18px; margin: 0; font-size: 13px; color: var(--color-text);">
                ${choice.isSafe
                  ? `<li>Never enter a UPI PIN or share an OTP to receive funds.</li>`
                  : scenario.warningSigns.map(ws => `<li>${ws}</li>`).join("")}
              </ul>
            </div>
          </div>
          <div style="background: var(--color-bg-subtle); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 14px;">
            <strong>${t("sim_stopping_point")}:</strong> ${scenario.stoppingPoint}
          </div>
          <div class="flex items-center gap-xs">
            <button id="sim-try-another-btn" class="cv-btn cv-btn-primary cv-btn-md">
              ${t("btn_retry")} →
            </button>
            <a href="#safety-tips" class="cv-btn cv-btn-secondary cv-btn-md" style="text-decoration: none;">
              ${t("btn_learn_more")}
            </a>
          </div>
        </div>
      `;

      feedbackContainer.querySelector("#sim-try-another-btn").addEventListener("click", onExit);

      // Record completed scenario into global state
      const state = getState();
      const completed = state.user.completedSimulations || [];
      if (!completed.includes(scenario.id)) {
        setState({
          user: {
            ...state.user,
            completedSimulations: [...completed, scenario.id]
          }
        });
      }

      // Emit sim:choice_made into radar engine
      const scenarioIndicators = scenario.categoryId === "upi" ? ["I1", "L5"] :
        scenario.categoryId === "phishing" ? ["U2", "S1", "L1"] :
        scenario.categoryId === "kyc" ? ["S4", "E1", "E6"] :
        scenario.categoryId === "job" ? ["I4", "E2"] : ["U1", "I1"];

      emitRadarEvent({
        type: "sim:choice_made",
        scenarioId: scenario.id,
        indicators: scenarioIndicators,
        outcome: choice.isSafe ? 1 : 0,
        confidence: "fairly"
      });

      showToast({
        title: choice.isSafe ? "Safe Choice" : "Warning Sign Missed",
        message: choice.isSafe ? "You successfully avoided the scam trap." : "Review the red flags to protect yourself next time.",
        type: choice.isSafe ? "safe" : "warn"
      });

    });

    optionsContainer.appendChild(choiceBtn);
  });

  decisionBox.appendChild(optionsContainer);
  decisionBox.appendChild(feedbackContainer);
  container.appendChild(decisionBox);

  wrapper.appendChild(container);
}
