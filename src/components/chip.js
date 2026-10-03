/**
 * ConVerse Shared UI — Chip Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

/**
 * Creates a reusable Chip element (for categories, indicators, tags, filters)
 * @param {Object} options
 * @param {string} options.label Chip text
 * @param {string} [options.icon=""] Optional icon/emoji
 * @param {boolean} [options.active=false] Whether chip is currently selected
 * @param {boolean} [options.clickable=true] Whether chip handles click events
 * @param {boolean} [options.removable=false] Whether chip has a remove button
 * @param {Function} [options.onClick] Click callback(isActive, chipEl)
 * @param {Function} [options.onRemove] Remove callback(chipEl)
 * @param {string} [options.value=""] Value associated with chip
 * @param {string} [options.className=""] Extra class names
 * @param {string} [options.id=""] ID
 * @returns {HTMLSpanElement}
 */
export function createChip({
  label = "",
  icon = "",
  active = false,
  clickable = true,
  removable = false,
  onClick = null,
  onRemove = null,
  value = "",
  className = "",
  id = "",
  i18nKey = ""
} = {}) {
  const chip = document.createElement("span");
  chip.className = `cv-chip ${active ? "cv-chip-active" : ""} ${clickable ? "cv-chip-clickable" : ""} ${className}`.trim();
  
  if (id) chip.id = id;
  if (value) chip.dataset.value = value;
  if (clickable) {
    chip.setAttribute("role", "button");
    chip.setAttribute("tabindex", "0");
    chip.setAttribute("aria-pressed", active ? "true" : "false");
  }

  if (icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = "cv-chip-icon";
    iconSpan.innerHTML = icon;
    chip.appendChild(iconSpan);
  }

  const labelSpan = document.createElement("span");
  labelSpan.className = "cv-chip-label";
  if (i18nKey) {
    labelSpan.setAttribute("data-i18n", i18nKey);
  }
  labelSpan.textContent = label;
  chip.appendChild(labelSpan);

  if (clickable && typeof onClick === "function") {
    const handleToggle = (e) => {
      e.stopPropagation();
      const isNowActive = chip.classList.toggle("cv-chip-active");
      chip.setAttribute("aria-pressed", isNowActive ? "true" : "false");
      onClick(isNowActive, chip, value);
    };

    chip.addEventListener("click", handleToggle);
    chip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle(e);
      }
    });
  }

  if (removable) {
    const removeBtn = document.createElement("span");
    removeBtn.className = "cv-chip-remove";
    removeBtn.innerHTML = "×";
    removeBtn.setAttribute("role", "button");
    removeBtn.setAttribute("aria-label", `Remove ${label}`);
    removeBtn.setAttribute("tabindex", "0");
    
    const handleRemove = (e) => {
      e.stopPropagation();
      if (typeof onRemove === "function") {
        onRemove(chip);
      } else {
        chip.remove();
      }
    };

    removeBtn.addEventListener("click", handleRemove);
    removeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRemove(e);
      }
    });

    chip.appendChild(removeBtn);
  }

  return chip;
}
