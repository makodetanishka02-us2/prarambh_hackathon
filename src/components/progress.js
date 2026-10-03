/**
 * ConVerse Shared UI — Progress Bar Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

/**
 * Creates a reusable Progress Bar element with update methods
 * @param {Object} options
 * @param {number} [options.value=0] Initial value (0-100 or relative to max)
 * @param {number} [options.max=100] Maximum value
 * @param {string} [options.label=""] Optional text label above bar
 * @param {boolean} [options.showPercentage=true] Whether to display numerical %
 * @param {"primary"|"safe"|"warn"|"danger"} [options.variant="primary"] Color theme
 * @param {string} [options.className=""] Extra classes
 * @returns {HTMLElement & { setValue: (val: number) => void }}
 */
export function createProgressBar({
  value = 0,
  max = 100,
  label = "",
  showPercentage = true,
  variant = "primary",
  className = ""
} = {}) {
  const container = document.createElement("div");
  container.className = `cv-progress-container ${className}`.trim();

  const clampedVal = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clampedVal / max) * 100);

  // Label Row
  let labelEl = null;
  let percentEl = null;

  if (label || showPercentage) {
    const labelRow = document.createElement("div");
    labelRow.className = "cv-progress-label-row";

    if (label) {
      labelEl = document.createElement("span");
      labelEl.className = "cv-progress-label-text";
      labelEl.textContent = label;
      labelRow.appendChild(labelEl);
    }

    if (showPercentage) {
      percentEl = document.createElement("span");
      percentEl.className = "cv-progress-percent";
      percentEl.textContent = `${percentage}%`;
      labelRow.appendChild(percentEl);
    }

    container.appendChild(labelRow);
  }

  // Track & Fill Bar
  const track = document.createElement("div");
  track.className = "cv-progress-track";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuenow", clampedVal.toString());
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", max.toString());
  if (label) track.setAttribute("aria-label", label);

  const bar = document.createElement("div");
  bar.className = `cv-progress-bar cv-progress-bar-${variant}`;
  bar.style.width = `${percentage}%`;
  track.appendChild(bar);

  container.appendChild(track);

  // Method to update value dynamically
  container.setValue = function(newVal) {
    const clamped = Math.min(Math.max(0, newVal), max);
    const newPct = Math.round((clamped / max) * 100);
    bar.style.width = `${newPct}%`;
    track.setAttribute("aria-valuenow", clamped.toString());
    if (percentEl) {
      percentEl.textContent = `${newPct}%`;
    }
  };

  return container;
}
