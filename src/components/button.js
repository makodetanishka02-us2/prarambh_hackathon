/**
 * ConVerse Shared UI — Button Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

/**
 * Creates a reusable, accessible Button element
 * @param {Object} options
 * @param {string} [options.text=""] Button label text
 * @param {string} [options.icon=""] HTML or emoji icon
 * @param {"primary"|"secondary"|"outline"|"ghost"|"safe"|"warn"|"danger"} [options.variant="primary"]
 * @param {"sm"|"md"|"lg"} [options.size="md"]
 * @param {"button"|"submit"|"reset"} [options.type="button"]
 * @param {Function} [options.onClick] Click event handler
 * @param {boolean} [options.disabled=false]
 * @param {string} [options.className=""] Additional CSS classes
 * @param {string} [options.id=""] Element ID
 * @param {string} [options.ariaLabel=""] Accessible label
 * @param {string} [options.i18nKey=""] Data-i18n translation key
 * @returns {HTMLButtonElement}
 */
export function createButton({
  text = "",
  icon = "",
  variant = "primary",
  size = "md",
  type = "button",
  onClick = null,
  disabled = false,
  className = "",
  id = "",
  ariaLabel = "",
  i18nKey = ""
} = {}) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.className = `cv-btn cv-btn-${variant} cv-btn-${size} ${className}`.trim();

  if (id) btn.id = id;
  if (ariaLabel) btn.setAttribute("aria-label", ariaLabel);
  if (disabled) btn.disabled = true;

  if (icon && !text) {
    btn.classList.add("cv-btn-icon-only");
  }

  if (icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = "cv-btn-icon";
    iconSpan.innerHTML = icon;
    btn.appendChild(iconSpan);
  }

  if (text || i18nKey) {
    const textSpan = document.createElement("span");
    textSpan.className = "cv-btn-text";
    if (i18nKey) {
      textSpan.setAttribute("data-i18n", i18nKey);
    }
    textSpan.textContent = text;
    btn.appendChild(textSpan);
  }

  if (typeof onClick === "function") {
    btn.addEventListener("click", onClick);
  }

  return btn;
}
