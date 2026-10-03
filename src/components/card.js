/**
 * ConVerse Shared UI — Card Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

/**
 * Creates a reusable Card element
 * @param {Object} options
 * @param {string} [options.title=""] Card title
 * @param {string} [options.subtitle=""] Card subtitle
 * @param {string} [options.icon=""] Card icon or emoji
 * @param {HTMLElement|string} [options.badge=null] Optional badge in header
 * @param {HTMLElement|string} [options.headerAction=null] Optional action button in header
 * @param {HTMLElement|string} [options.body=""] Content of the card
 * @param {HTMLElement|string} [options.footer=null] Optional footer section
 * @param {boolean} [options.interactive=false] Whether card has hover/click interaction
 * @param {"none"|"primary"|"safe"|"warn"|"danger"} [options.highlight="none"] Border accent highlight
 * @param {Function} [options.onClick=null] Click handler
 * @param {string} [options.className=""] Extra class names
 * @param {string} [options.id=""] ID
 * @returns {HTMLElement}
 */
export function createCard({
  title = "",
  subtitle = "",
  icon = "",
  badge = null,
  headerAction = null,
  body = "",
  footer = null,
  interactive = false,
  highlight = "none",
  onClick = null,
  className = "",
  id = ""
} = {}) {
  const card = document.createElement("article");
  card.className = `cv-card ${interactive ? "cv-card-interactive" : ""} ${
    highlight !== "none" ? `cv-card-highlight-${highlight}` : ""
  } ${className}`.trim();

  if (id) card.id = id;

  if (interactive) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
  }

  // Header
  if (title || subtitle || icon || badge || headerAction) {
    const header = document.createElement("div");
    header.className = "cv-card-header";

    const titleGroup = document.createElement("div");
    titleGroup.className = "cv-card-title-group";

    if (icon) {
      const iconEl = document.createElement("span");
      iconEl.className = "cv-card-icon";
      iconEl.innerHTML = icon;
      titleGroup.appendChild(iconEl);
    }

    const textWrap = document.createElement("div");
    if (title) {
      const titleEl = document.createElement("h3");
      titleEl.className = "cv-card-title";
      titleEl.textContent = title;
      textWrap.appendChild(titleEl);
    }
    if (subtitle) {
      const subtitleEl = document.createElement("p");
      subtitleEl.className = "cv-card-subtitle";
      subtitleEl.textContent = subtitle;
      textWrap.appendChild(subtitleEl);
    }
    titleGroup.appendChild(textWrap);
    header.appendChild(titleGroup);

    // Header Right Actions / Badge
    if (badge || headerAction) {
      const rightWrap = document.createElement("div");
      rightWrap.className = "cv-card-header-actions flex items-center gap-xs";
      if (badge) {
        if (typeof badge === "string") {
          const b = document.createElement("span");
          b.innerHTML = badge;
          rightWrap.appendChild(b);
        } else {
          rightWrap.appendChild(badge);
        }
      }
      if (headerAction) {
        if (typeof headerAction === "string") {
          const a = document.createElement("span");
          a.innerHTML = headerAction;
          rightWrap.appendChild(a);
        } else {
          rightWrap.appendChild(headerAction);
        }
      }
      header.appendChild(rightWrap);
    }

    card.appendChild(header);
  }

  // Body
  if (body) {
    const bodyEl = document.createElement("div");
    bodyEl.className = "cv-card-body";
    if (typeof body === "string") {
      bodyEl.innerHTML = body;
    } else if (body instanceof HTMLElement) {
      bodyEl.appendChild(body);
    }
    card.appendChild(bodyEl);
  }

  // Footer
  if (footer) {
    const footerEl = document.createElement("div");
    footerEl.className = "cv-card-footer";
    if (typeof footer === "string") {
      footerEl.innerHTML = footer;
    } else if (footer instanceof HTMLElement) {
      footerEl.appendChild(footer);
    }
    card.appendChild(footerEl);
  }

  // Click & Keyboard Handlers
  if (interactive && typeof onClick === "function") {
    card.addEventListener("click", onClick);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e);
      }
    });
  }

  return card;
}
