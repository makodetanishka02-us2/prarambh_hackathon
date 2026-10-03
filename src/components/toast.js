/**
 * ConVerse Shared UI — Toast Notification Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

const TOAST_ICONS = {
  safe: "🛡️",
  success: "✓",
  warn: "⚠️",
  danger: "🚨",
  info: "ℹ️"
};

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement("div");
    toastContainer.className = "cv-toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    toastContainer.setAttribute("aria-atomic", "true");
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Displays a lightweight toast notification
 * @param {Object} options
 * @param {string} options.message Toast description message
 * @param {string} [options.title=""] Optional toast title
 * @param {"safe"|"success"|"warn"|"danger"|"info"} [options.type="info"] Notification type
 * @param {number} [options.duration=4000] Auto-dismiss duration in milliseconds (0 for persistent)
 * @param {Object} [options.action] Optional actionable button
 * @param {string} options.action.label Action button label
 * @param {Function} options.action.onClick Action button click handler
 * @returns {HTMLElement} The created toast element
 */
export function showToast({
  message = "",
  title = "",
  type = "info",
  duration = 4000,
  action = null
} = {}) {
  const container = ensureToastContainer();

  // Normalize type
  const normalizedType = type === "success" ? "safe" : type;
  const icon = TOAST_ICONS[type] || TOAST_ICONS.info;

  const toast = document.createElement("div");
  toast.className = `cv-toast cv-toast-${normalizedType}`;
  toast.setAttribute("role", "alert");

  // Icon
  const iconEl = document.createElement("div");
  iconEl.className = "cv-toast-icon";
  iconEl.innerHTML = icon;
  toast.appendChild(iconEl);

  // Content
  const contentEl = document.createElement("div");
  contentEl.className = "cv-toast-content";

  if (title) {
    const titleEl = document.createElement("h4");
    titleEl.className = "cv-toast-title";
    titleEl.textContent = title;
    contentEl.appendChild(titleEl);
  }

  if (message) {
    const msgEl = document.createElement("p");
    msgEl.className = "cv-toast-message";
    msgEl.textContent = message;
    contentEl.appendChild(msgEl);
  }

  if (action && action.label && typeof action.onClick === "function") {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "cv-btn cv-btn-sm cv-btn-secondary";
    actionBtn.style.marginTop = "6px";
    actionBtn.textContent = action.label;
    actionBtn.addEventListener("click", () => {
      action.onClick();
      dismissToast(toast);
    });
    contentEl.appendChild(actionBtn);
  }

  toast.appendChild(contentEl);

  // Close Button
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "cv-toast-close";
  closeBtn.setAttribute("aria-label", "Close notification");
  closeBtn.innerHTML = "✕";
  closeBtn.addEventListener("click", () => dismissToast(toast));
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  // Auto Dismiss
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast);
    }, duration);
  }

  return toast;
}

function dismissToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-10px)";
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 250);
}
