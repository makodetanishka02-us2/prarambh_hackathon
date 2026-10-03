/**
 * ConVerse Shared UI — Modal Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

/**
 * Creates an accessible Modal Dialog with focus trapping and keyboard controls
 * @param {Object} options
 * @param {string} [options.title=""] Dialog heading
 * @param {HTMLElement|string} [options.content=""] Modal body content
 * @param {Array<HTMLElement>} [options.footerButtons=[]] Actions in footer
 * @param {boolean} [options.closeOnBackdrop=true] Whether clicking backdrop closes modal
 * @param {Function} [options.onClose] Callback executed when modal is closed
 * @param {string} [options.size="md"] Modal size variant
 * @param {string} [options.className=""] Extra class names
 * @returns {{ backdrop: HTMLElement, modal: HTMLElement, open: () => void, close: () => void, destroy: () => void }}
 */
export function createModal({
  title = "",
  content = "",
  footerButtons = [],
  closeOnBackdrop = true,
  onClose = null,
  size = "md",
  className = ""
} = {}) {
  let previousActiveElement = null;

  // Backdrop
  const backdrop = document.createElement("div");
  backdrop.className = `cv-modal-backdrop ${className}`.trim();
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-labelledby", "cv-modal-title");

  // Modal Container
  const modal = document.createElement("div");
  modal.className = `cv-modal cv-modal-${size}`;

  // Header
  const header = document.createElement("div");
  header.className = "cv-modal-header";

  const titleEl = document.createElement("h2");
  titleEl.className = "cv-modal-title";
  titleEl.id = "cv-modal-title";
  titleEl.textContent = title;
  header.appendChild(titleEl);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "cv-modal-close";
  closeBtn.setAttribute("aria-label", "Close modal");
  closeBtn.innerHTML = "✕";
  closeBtn.addEventListener("click", () => close());
  header.appendChild(closeBtn);

  modal.appendChild(header);

  // Body
  const body = document.createElement("div");
  body.className = "cv-modal-body";
  if (typeof content === "string") {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  modal.appendChild(body);

  // Footer (if buttons provided)
  let footer = null;
  if (footerButtons && footerButtons.length > 0) {
    footer = document.createElement("div");
    footer.className = "cv-modal-footer";
    footerButtons.forEach(btn => footer.appendChild(btn));
    modal.appendChild(footer);
  }

  backdrop.appendChild(modal);

  // Backdrop click
  if (closeOnBackdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        close();
      }
    });
  }

  // Keyboard Handlers (Escape & Tab Focus Trapping)
  function handleKeyDown(e) {
    if (!backdrop.classList.contains("open")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === "Tab") {
      const focusableEls = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableEls.length) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  function open() {
    previousActiveElement = document.activeElement;
    document.body.appendChild(backdrop);
    // Force reflow for CSS transition
    backdrop.offsetHeight;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Focus close button or first focusable
    setTimeout(() => {
      closeBtn.focus();
    }, 50);
  }

  function close() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeyDown);

    setTimeout(() => {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
      if (typeof onClose === "function") {
        onClose();
      }
    }, 250);
  }

  function destroy() {
    close();
  }

  return { backdrop, modal, open, close, destroy };
}
