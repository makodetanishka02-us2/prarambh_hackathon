/**
 * ConVerse Shared UI — Badge Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

const DEFAULT_ICONS = {
  safe: "🛡️",
  warn: "⚠️",
  danger: "🚨",
  info: "ℹ️"
};

/**
 * Creates a reusable Badge element with dual color and symbol indicators
 * @param {Object} options
 * @param {string} options.text Badge label text
 * @param {"safe"|"warn"|"danger"|"info"} [options.variant="safe"] Status variant
 * @param {string} [options.icon=""] Custom icon / emoji (defaults to variant symbol)
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

  const badgeIcon = icon || DEFAULT_ICONS[variant] || "•";
  const iconSpan = document.createElement("span");
  iconSpan.className = "cv-badge-icon";
  iconSpan.setAttribute("aria-hidden", "true");
  iconSpan.innerHTML = badgeIcon;
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
