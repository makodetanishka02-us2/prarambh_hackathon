/**
 * ConVerse Page: Styleguide & Component Library
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 */

import { t } from '../i18n/i18n.js';
import { createButton } from '../components/button.js';
import { createChip } from '../components/chip.js';
import { createCard } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { createTabs } from '../components/tabs.js';
import { createModal } from '../components/modal.js';
import { createProgressBar } from '../components/progress.js';
import { showToast } from '../components/toast.js';

export function renderStyleguide(container) {
  container.innerHTML = "";

  const pageWrap = document.createElement("div");
  pageWrap.className = "page-container";

  // Header
  const headerWrap = document.createElement("div");
  headerWrap.className = "page-header";
  headerWrap.innerHTML = `
    <h1 class="page-title">${t("styleguide_title")}</h1>
    <p class="page-subtitle">${t("styleguide_subtitle")}</p>
  `;
  pageWrap.appendChild(headerWrap);

  // 1. Color Palette Tokens Swatches
  const colorSwatchesHtml = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
      <div style="background: #F7F4EE; color: #25231F; padding: 10px; border-radius: 6px; font-size: 11px; border: 1px solid #DED9CF;">
        <strong>Background</strong><br/>#F7F4EE
      </div>
      <div style="background: #FFFFFF; color: #25231F; padding: 10px; border-radius: 6px; font-size: 11px; border: 1px solid #DED9CF;">
        <strong>Surface Card</strong><br/>#FFFFFF
      </div>
      <div style="background: #25231F; color: #FFFFFF; padding: 10px; border-radius: 6px; font-size: 11px;">
        <strong>Primary Charcoal</strong><br/>#25231F
      </div>
      <div style="background: #524E47; color: #FFFFFF; padding: 10px; border-radius: 6px; font-size: 11px;">
        <strong>Text Secondary</strong><br/>#524E47
      </div>
      <div style="background: #1E6B38; color: #FFFFFF; padding: 10px; border-radius: 6px; font-size: 11px;">
        <strong>Success / Safe</strong><br/>#1E6B38
      </div>
      <div style="background: #B45309; color: #FFFFFF; padding: 10px; border-radius: 6px; font-size: 11px;">
        <strong>Warning Amber</strong><br/>#B45309
      </div>
      <div style="background: #A8201A; color: #FFFFFF; padding: 10px; border-radius: 6px; font-size: 11px;">
        <strong>Danger Red</strong><br/>#A8201A
      </div>
    </div>
  `;
  const colorCard = createCard({
    title: "1. Color Tokens Palette",
    subtitle: "Warm editorial palette without AI neon or purple gradients",
    body: colorSwatchesHtml
  });
  pageWrap.appendChild(colorCard);

  // 2. Buttons Showcase (Rectangular with 6-8px radius)
  const btnWrap = document.createElement("div");
  btnWrap.className = "flex-col gap-sm";

  const btnRow1 = document.createElement("div");
  btnRow1.className = "flex items-center gap-xs";
  btnRow1.style.flexWrap = "wrap";

  btnRow1.appendChild(createButton({ text: "Primary Button", variant: "primary" }));
  btnRow1.appendChild(createButton({ text: "Secondary", variant: "secondary" }));
  btnRow1.appendChild(createButton({ text: "Outline", variant: "outline" }));
  btnRow1.appendChild(createButton({ text: "Ghost", variant: "ghost" }));
  btnRow1.appendChild(createButton({ text: "Safe Action", variant: "safe" }));
  btnRow1.appendChild(createButton({ text: "Danger", variant: "danger" }));

  const btnRow2 = document.createElement("div");
  btnRow2.className = "flex items-center gap-xs";
  btnRow2.style.flexWrap = "wrap";
  btnRow2.appendChild(createButton({ text: "Small (sm)", size: "sm", variant: "primary" }));
  btnRow2.appendChild(createButton({ text: "Medium (md)", size: "md", variant: "primary" }));
  btnRow2.appendChild(createButton({ text: "Large (lg)", size: "lg", variant: "primary" }));
  btnRow2.appendChild(createButton({ text: "Disabled", variant: "primary", disabled: true }));

  btnWrap.appendChild(btnRow1);
  btnWrap.appendChild(btnRow2);

  const buttonCard = createCard({
    title: "2. Buttons (.cv-btn)",
    subtitle: "Rectangular 6–8px radius, min 44px touch height, solid high-contrast styles",
    body: btnWrap
  });
  pageWrap.appendChild(buttonCard);

  // 3. Badges Showcase (Dual symbol + color)
  const badgeWrap = document.createElement("div");
  badgeWrap.className = "flex items-center gap-xs";
  badgeWrap.style.flexWrap = "wrap";

  badgeWrap.appendChild(createBadge({ text: "Verified Safe", variant: "safe" }));
  badgeWrap.appendChild(createBadge({ text: "Suspicious Flag", variant: "warn" }));
  badgeWrap.appendChild(createBadge({ text: "High Risk Scam", variant: "danger" }));
  badgeWrap.appendChild(createBadge({ text: "Educational Note", variant: "info" }));
  badgeWrap.appendChild(createBadge({ text: "Fictional Simulation", variant: "neutral" }));

  const badgeCard = createCard({
    title: "3. Badges (.cv-badge)",
    subtitle: "Accessibility compliant with explicit symbols (✓, !, ✕, i)",
    body: badgeWrap
  });
  pageWrap.appendChild(badgeCard);

  // 4. Chips Showcase
  const chipWrap = document.createElement("div");
  chipWrap.className = "flex items-center gap-xs";
  chipWrap.style.flexWrap = "wrap";

  chipWrap.appendChild(createChip({ label: "Active Category", active: true }));
  chipWrap.appendChild(createChip({ label: "Selectable Filter", active: false, onClick: () => {} }));
  chipWrap.appendChild(createChip({ label: "Removable Indicator", removable: true, onRemove: () => {} }));

  const chipCard = createCard({
    title: "4. Chips (.cv-chip)",
    subtitle: "Used selectively for category filters, tags, and difficulty pills",
    body: chipWrap
  });
  pageWrap.appendChild(chipCard);

  // 5. Tabs Showcase
  const tabsExample = createTabs({
    tabs: [
      { id: "tab-upi", label: "UPI Fraud", content: `<p class="text-sm" style="padding: 10px 0;">Content for UPI Fraud guidelines.</p>` },
      { id: "tab-calls", label: "Fake Calls", content: `<p class="text-sm" style="padding: 10px 0;">Content for Impersonation Call guidelines.</p>` },
      { id: "tab-sms", label: "Phishing SMS", content: `<p class="text-sm" style="padding: 10px 0;">Content for SMS Phishing guidelines.</p>` }
    ]
  });

  const tabCard = createCard({
    title: "5. Tabs (.cv-tabs)",
    subtitle: "Accessible ARIA tablist with horizontal mobile scroll",
    body: tabsExample
  });
  pageWrap.appendChild(tabCard);

  // 6. Educational Feedback Block
  const feedbackDemo = document.createElement("div");
  feedbackDemo.innerHTML = `
    <div class="cv-feedback-card cv-feedback-missed" style="margin-top: 0;">
      <div class="cv-feedback-title">⚠ Warning Sign Missed</div>
      <div class="cv-feedback-desc">Urgency was used to pressure you into acting quickly without verifying the source.</div>
      <div class="cv-feedback-takeaway">
        <strong>Safer Option:</strong> Verify the request through the organization's official verified portal directly.<br/>
        <span class="text-muted">Why this mattered: Electricity boards never issue same-day disconnection notices via personal numbers.</span>
      </div>
    </div>
  `;
  const feedbackCard = createCard({
    title: "6. Educational Feedback Block (.cv-feedback-card)",
    subtitle: "Calm, educational, and non-judgmental feedback component",
    body: feedbackDemo
  });
  pageWrap.appendChild(feedbackCard);

  // 7. Modal Dialog Trigger
  const modalTriggerBtn = createButton({
    text: "Launch Modal Dialog",
    variant: "primary",
    onClick: () => {
      const modal = createModal({
        title: "Simulation Confirmation",
        content: `
          <p class="text-sm">This is an accessible modal with keyboard focus trapping, Escape key support, and clean solid surface styling.</p>
        `,
        footerButtons: [
          createButton({
            text: "Cancel",
            variant: "secondary",
            size: "sm",
            onClick: () => modal.close()
          }),
          createButton({
            text: "Confirm",
            variant: "primary",
            size: "sm",
            onClick: () => {
              showToast({ title: "Action Confirmed", message: "Modal confirmed successfully.", type: "safe" });
              modal.close();
            }
          })
        ]
      });
      modal.open();
    }
  });

  const modalCard = createCard({
    title: "7. Accessible Modal (.cv-modal)",
    subtitle: "Focus trapped, solid surface dialog",
    body: modalTriggerBtn
  });
  pageWrap.appendChild(modalCard);

  // 8. Toast Notifications Trigger
  const toastWrap = document.createElement("div");
  toastWrap.className = "flex items-center gap-xs";
  toastWrap.style.flexWrap = "wrap";

  toastWrap.appendChild(createButton({
    text: "Safe Toast",
    variant: "safe",
    size: "sm",
    onClick: () => showToast({ title: "Safe Choice", message: "You verified the sender.", type: "safe" })
  }));

  toastWrap.appendChild(createButton({
    text: "Warning Toast",
    variant: "warn",
    size: "sm",
    onClick: () => showToast({ title: "Suspicious Flag", message: "Review permissions carefully.", type: "warn" })
  }));

  toastWrap.appendChild(createButton({
    text: "Danger Toast",
    variant: "danger",
    size: "sm",
    onClick: () => showToast({ title: "Scam Detected", message: "Never enter UPI PIN to receive money.", type: "danger" })
  }));

  const toastCard = createCard({
    title: "8. Toast Notifications (.cv-toast)",
    subtitle: "Non-intrusive notification banners",
    body: toastWrap
  });
  pageWrap.appendChild(toastCard);

  // 9. Radar & Awareness Engine Component (Phase 2 by Ananya)
  const radarSection = document.createElement("section");
  radarSection.style.marginTop = "24px";

  const radarView = createRadarView({
    initialMode: "both",
    showTable: true,
    showControls: true,
    showSummary: true
  });

  const eventTesterWrap = document.createElement("div");
  eventTesterWrap.style.marginTop = "16px";
  eventTesterWrap.style.padding = "12px";
  eventTesterWrap.style.background = "var(--color-bg-subtle)";
  eventTesterWrap.style.borderRadius = "var(--radius-md)";
  eventTesterWrap.style.border = "1px solid var(--color-border)";
  eventTesterWrap.innerHTML = `
    <div class="text-xs text-bold" style="margin-bottom: 8px;">Live Radar Event Tester:</div>
    <div class="flex items-center gap-xs" style="flex-wrap: wrap;">
      <button id="test-scan-btn" class="cv-btn cv-btn-danger cv-btn-sm">
        Trigger scan:completed (U1 + I1)
      </button>
      <button id="test-sim-safe-btn" class="cv-btn cv-btn-safe cv-btn-sm">
        Trigger sim:choice_made (Safe)
      </button>
      <button id="test-action-report-btn" class="cv-btn cv-btn-primary cv-btn-sm">
        Trigger action:taken (Report 1930)
      </button>
      <button id="test-reset-radar-btn" class="cv-btn cv-btn-outline cv-btn-sm">
        Reset Radar Baseline (50)
      </button>
    </div>
  `;

  eventTesterWrap.querySelector("#test-scan-btn").addEventListener("click", () => {
    emitRadarEvent({
      type: "scan:completed",
      indicators: ["U1", "I1"]
    });
    showToast({
      title: "Radar Event Emitted",
      message: "scan:completed (U1 + I1) -> Threat calculated with PIN override",
      type: "danger"
    });
  });

  eventTesterWrap.querySelector("#test-sim-safe-btn").addEventListener("click", () => {
    emitRadarEvent({
      type: "sim:choice_made",
      indicators: ["U2", "L1"],
      outcome: 1,
      confidence: "certain"
    });
    showToast({
      title: "Radar Event Emitted",
      message: "sim:choice_made (outcome: 1, certain) -> Awareness updated",
      type: "safe"
    });
  });

  eventTesterWrap.querySelector("#test-action-report-btn").addEventListener("click", () => {
    emitRadarEvent({
      type: "action:taken",
      action: "report",
      confidence: "fairly"
    });
    showToast({
      title: "Radar Event Emitted",
      message: "action:taken (Report 1930) -> Reporting dimension updated",
      type: "info"
    });
  });

  eventTesterWrap.querySelector("#test-reset-radar-btn").addEventListener("click", () => {
    resetRadarState();
    showToast({
      title: "Radar Reset",
      message: "All 6 dimensions restored to 50 baseline.",
      type: "info"
    });
  });

  const radarCard = createCard({
    title: "9. Threat & Awareness Radar (.cv-radar-container)",
    subtitle: "Dual-layer spider chart & accessible data table (Phase 2 by Ananya)",
    body: radarView
  });
  radarCard.appendChild(eventTesterWrap);
  pageWrap.appendChild(radarCard);

  container.appendChild(pageWrap);
}

