/**
 * ConVerse Page: Styleguide & Component Showcase
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
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
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
      <div style="background: #6F4E37; color: #fff; padding: 12px; border-radius: 8px; font-size: 11px;">
        <strong>Primary Mocha</strong><br/>#6F4E37
      </div>
      <div style="background: #C88A58; color: #000; padding: 12px; border-radius: 8px; font-size: 11px;">
        <strong>Secondary Clay</strong><br/>#C88A58
      </div>
      <div style="background: #F5EBDD; color: #2B1D16; padding: 12px; border-radius: 8px; font-size: 11px; border: 1px solid #E0D0BE;">
        <strong>Warm Background</strong><br/>#F5EBDD
      </div>
      <div style="background: #FAF2E8; color: #2B1D16; padding: 12px; border-radius: 8px; font-size: 11px; border: 1px solid #E0D0BE;">
        <strong>Surface Warm</strong><br/>#FAF2E8
      </div>
      <div style="background: #2E7D32; color: #fff; padding: 12px; border-radius: 8px; font-size: 11px;">
        <strong>Safe Green</strong><br/>#2E7D32
      </div>
      <div style="background: #D97706; color: #fff; padding: 12px; border-radius: 8px; font-size: 11px;">
        <strong>Warning Amber</strong><br/>#D97706
      </div>
      <div style="background: #C5221F; color: #fff; padding: 12px; border-radius: 8px; font-size: 11px;">
        <strong>Danger Red</strong><br/>#C5221F
      </div>
    </div>
  `;
  const colorCard = createCard({
    title: "1. Color Tokens Palette",
    subtitle: "Warm, earthy mocha design system without pure white/grey backgrounds",
    body: colorSwatchesHtml,
    highlight: "primary"
  });
  pageWrap.appendChild(colorCard);

  // 2. Buttons Showcase
  const btnWrap = document.createElement("div");
  btnWrap.className = "flex-col gap-sm";

  const btnRow1 = document.createElement("div");
  btnRow1.className = "flex items-center gap-xs";
  btnRow1.style.flexWrap = "wrap";

  btnRow1.appendChild(createButton({ text: "Primary Button", variant: "primary", icon: "✨" }));
  btnRow1.appendChild(createButton({ text: "Secondary", variant: "secondary", icon: "🔄" }));
  btnRow1.appendChild(createButton({ text: "Outline", variant: "outline" }));
  btnRow1.appendChild(createButton({ text: "Ghost", variant: "ghost" }));
  btnRow1.appendChild(createButton({ text: "Safe Action", variant: "safe", icon: "🛡️" }));
  btnRow1.appendChild(createButton({ text: "Danger", variant: "danger", icon: "🚨" }));

  const btnRow2 = document.createElement("div");
  btnRow2.className = "flex items-center gap-xs";
  btnRow2.style.flexWrap = "wrap";
  btnRow2.appendChild(createButton({ text: "Small (sm)", size: "sm", variant: "primary" }));
  btnRow2.appendChild(createButton({ text: "Medium (md)", size: "md", variant: "primary" }));
  btnRow2.appendChild(createButton({ text: "Large (lg)", size: "lg", variant: "primary" }));
  btnRow2.appendChild(createButton({ icon: "🔍", variant: "primary", ariaLabel: "Search Icon" }));
  btnRow2.appendChild(createButton({ text: "Disabled", variant: "primary", disabled: true }));

  btnWrap.appendChild(btnRow1);
  btnWrap.appendChild(btnRow2);

  const buttonCard = createCard({
    title: "2. Buttons (.cv-btn)",
    subtitle: "Variants: primary, secondary, outline, ghost, safe, danger | Sizes: sm, md, lg",
    body: btnWrap
  });
  pageWrap.appendChild(buttonCard);

  // 3. Badges Showcase
  const badgeWrap = document.createElement("div");
  badgeWrap.className = "flex items-center gap-xs";
  badgeWrap.style.flexWrap = "wrap";

  badgeWrap.appendChild(createBadge({ text: "Verified Safe", variant: "safe" }));
  badgeWrap.appendChild(createBadge({ text: "Suspicious Warning", variant: "warn" }));
  badgeWrap.appendChild(createBadge({ text: "High Risk Scam", variant: "danger" }));
  badgeWrap.appendChild(createBadge({ text: "Threat Intelligence", variant: "info" }));

  const badgeCard = createCard({
    title: "3. Badges (.cv-badge)",
    subtitle: "Symbol + Color design ensures accessibility for all users",
    body: badgeWrap
  });
  pageWrap.appendChild(badgeCard);

  // 4. Chips Showcase
  const chipWrap = document.createElement("div");
  chipWrap.className = "flex items-center gap-xs";
  chipWrap.style.flexWrap = "wrap";

  chipWrap.appendChild(createChip({ label: "Active Filter", active: true, icon: "🏷️" }));
  chipWrap.appendChild(createChip({ label: "Clickable Tag", active: false, icon: "📱", onClick: () => {} }));
  chipWrap.appendChild(createChip({ label: "Removable Indicator", removable: true, onRemove: () => {} }));

  const chipCard = createCard({
    title: "4. Chips (.cv-chip)",
    subtitle: "Used for filters, tags, categories, and scam indicator chips",
    body: chipWrap
  });
  pageWrap.appendChild(chipCard);

  // 5. Tabs Showcase
  const tabsExample = createTabs({
    tabs: [
      { id: "tab-upi", label: "UPI Fraud", icon: "📱", content: `<p class="text-sm" style="padding: 12px 0;">Content for UPI Fraud safety tab.</p>` },
      { id: "tab-calls", label: "Fake Calls", icon: "📞", content: `<p class="text-sm" style="padding: 12px 0;">Content for Impersonation Calls safety tab.</p>` },
      { id: "tab-sms", label: "Phishing SMS", icon: "💬", content: `<p class="text-sm" style="padding: 12px 0;">Content for SMS Phishing safety tab.</p>` }
    ]
  });

  const tabCard = createCard({
    title: "5. Tabs (.cv-tabs)",
    subtitle: "Keyboard accessible ARIA tablist with horizontal scrolling on mobile",
    body: tabsExample
  });
  pageWrap.appendChild(tabCard);

  // 6. Dynamic Progress Bars
  const progContainer = document.createElement("div");
  progContainer.className = "flex-col gap-sm";

  const dynamicBar = createProgressBar({
    value: 65,
    max: 100,
    label: "Dynamic Defense Score",
    variant: "safe"
  });

  const sliderControl = document.createElement("input");
  sliderControl.type = "range";
  sliderControl.min = "0";
  sliderControl.max = "100";
  sliderControl.value = "65";
  sliderControl.addEventListener("input", (e) => {
    dynamicBar.setValue(Number(e.target.value));
  });

  progContainer.appendChild(dynamicBar);
  progContainer.appendChild(sliderControl);

  const progCard = createCard({
    title: "6. Progress Bars (.cv-progress)",
    subtitle: "Supports dynamic updates via setValue(val) method",
    body: progContainer
  });
  pageWrap.appendChild(progCard);

  // 7. Modal Dialog Trigger
  const modalTriggerBtn = createButton({
    text: "Launch Sample Modal Dialog",
    icon: "🪟",
    variant: "primary",
    onClick: () => {
      const modal = createModal({
        title: "Security Verification Dialog",
        content: `
          <p class="text-sm">This is an accessible modal with full keyboard navigation (Escape to close, Tab focus trapping) and background blur.</p>
          <p class="text-xs text-muted" style="margin-top: 8px;">Used for scam simulations, detailed indicator breakdowns, and confirmations.</p>
        `,
        footerButtons: [
          createButton({
            text: "Cancel",
            variant: "secondary",
            size: "sm",
            onClick: () => modal.close()
          }),
          createButton({
            text: "Confirm Action",
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
    title: "7. Modal Dialog (.cv-modal)",
    subtitle: "Accessible modal with backdrop blur, focus trap, and close control",
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
    onClick: () => showToast({ title: "Safe Action", message: "No security issues detected.", type: "safe" })
  }));

  toastWrap.appendChild(createButton({
    text: "Warning Toast",
    variant: "warn",
    size: "sm",
    onClick: () => showToast({ title: "Suspicious Alert", message: "Review permissions carefully.", type: "warn" })
  }));

  toastWrap.appendChild(createButton({
    text: "Danger Toast",
    variant: "danger",
    size: "sm",
    onClick: () => showToast({ title: "Scam Detected", message: "Urgent: do not share OTP with anyone.", type: "danger" })
  }));

  toastWrap.appendChild(createButton({
    text: "Info Toast",
    variant: "secondary",
    size: "sm",
    onClick: () => showToast({ title: "System Update", message: "Scam radar trends refreshed.", type: "info" })
  }));

  const toastCard = createCard({
    title: "8. Toast Notifications (.cv-toast)",
    subtitle: "Lightweight auto-dismissing notifications for user actions and alerts",
    body: toastWrap
  });
  pageWrap.appendChild(toastCard);

  container.appendChild(pageWrap);
}
