/**
 * ConVerse Shared UI — Badge Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation & UI Owner: Tanishka
 */

const DEFAULT_SYMBOLS = {
  safe: "✓",
  success: "✓",
  warn: "!",
  warning: "!",
  danger: "✕",
  info: "i",
  neutral: "•"
};

/**
 * Creates a reusable Badge element with dual symbol + color indicators for accessibility
 * @param {Object} options
 * @param {string} options.text Badge label text
 * @param {"safe"|"warn"|"danger"|"info"|"neutral"|"success"|"warning"} [options.variant="safe"] Status variant
 * @param {string} [options.icon=""] Custom icon / symbol (defaults to semantic symbol)
 * @param {string} [options.className=""] Extra class names
 * @param {string} [options.i18nKey=""] i18n translation key
 * @returns {HTMLSpanElement}
 */
export function createBadge({
  text = "",
  variant = "safe",
  icon = "",
  className = "",
  i18nKey = ""
} = {}) {
  const badge = document.createElement("span");
  badge.className = `cv-badge cv-badge-${variant} ${className}`.trim();
  badge.setAttribute("role", "status");

  const badgeSymbol = icon || DEFAULT_SYMBOLS[variant] || "•";
  const iconSpan = document.createElement("span");
  iconSpan.className = "cv-badge-icon";
  iconSpan.setAttribute("aria-hidden", "true");
  iconSpan.textContent = badgeSymbol;
  badge.appendChild(iconSpan);

  const textSpan = document.createElement("span");
  textSpan.className = "cv-badge-text";
  if (i18nKey) {
    textSpan.setAttribute("data-i18n", i18nKey);
  }
  textSpan.textContent = text;
  badge.appendChild(textSpan);

  return badge;
}
