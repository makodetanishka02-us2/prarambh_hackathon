/**
 * ConVerse Shared UI — Tabs Component
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

/**
 * Creates an accessible Tabs component with panels
 * @param {Object} options
 * @param {Array<{id: string, label: string, icon?: string, badge?: HTMLElement|string, content?: HTMLElement|string, i18nKey?: string}>} options.tabs
 * @param {string} [options.activeTabId] Initially active tab id (defaults to first)
 * @param {Function} [options.onTabChange] Callback when tab switches (tabId, tabIndex)
 * @param {string} [options.className=""] Extra class names
 * @returns {HTMLElement & { setActiveTab: (id: string) => void }}
 */
export function createTabs({
  tabs = [],
  activeTabId = "",
  onTabChange = null,
  className = ""
} = {}) {
  const container = document.createElement("div");
  container.className = `cv-tabs-container ${className}`.trim();

  if (!tabs.length) return container;

  const currentActiveId = activeTabId || tabs[0].id;
  const nav = document.createElement("div");
  nav.className = "cv-tabs-nav";
  nav.setAttribute("role", "tablist");

  const panelContainer = document.createElement("div");
  panelContainer.className = "cv-tabs-panels";

  const tabButtons = [];
  const tabPanels = [];

  tabs.forEach((tab, index) => {
    const isSelected = tab.id === currentActiveId;

    // Tab Button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `cv-tab-item ${isSelected ? "active" : ""}`;
    btn.id = `tab-${tab.id}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", isSelected ? "true" : "false");
    btn.setAttribute("aria-controls", `panel-${tab.id}`);
    btn.setAttribute("tabindex", isSelected ? "0" : "-1");

    if (tab.icon) {
      const iconSpan = document.createElement("span");
      iconSpan.className = "cv-tab-icon";
      iconSpan.innerHTML = tab.icon;
      btn.appendChild(iconSpan);
    }

    const labelSpan = document.createElement("span");
    labelSpan.className = "cv-tab-label";
    if (tab.i18nKey) {
      labelSpan.setAttribute("data-i18n", tab.i18nKey);
    }
    labelSpan.textContent = tab.label;
    btn.appendChild(labelSpan);

    if (tab.badge) {
      if (tab.badge instanceof HTMLElement) {
        btn.appendChild(tab.badge);
      } else {
        const b = document.createElement("span");
        b.innerHTML = tab.badge;
        btn.appendChild(b);
      }
    }

    btn.addEventListener("click", () => {
      setActiveTab(tab.id);
    });

    // Keyboard Arrow navigation for tablist
    btn.addEventListener("keydown", (e) => {
      let targetIndex = null;
      if (e.key === "ArrowRight") {
        targetIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        targetIndex = 0;
      } else if (e.key === "End") {
        targetIndex = tabs.length - 1;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        tabButtons[targetIndex].focus();
        setActiveTab(tabs[targetIndex].id);
      }
    });

    tabButtons.push(btn);
    nav.appendChild(btn);

    // Panel
    const panel = document.createElement("div");
    panel.className = `cv-tab-panel ${isSelected ? "active" : ""}`;
    panel.id = `panel-${tab.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab-${tab.id}`);
    panel.setAttribute("tabindex", "0");

    if (tab.content) {
      if (tab.content instanceof HTMLElement) {
        panel.appendChild(tab.content);
      } else {
        panel.innerHTML = tab.content;
      }
    }

    tabPanels.push(panel);
    panelContainer.appendChild(panel);
  });

  function setActiveTab(id) {
    const selectedIndex = tabs.findIndex(t => t.id === id);
    if (selectedIndex === -1) return;

    tabs.forEach((tab, index) => {
      const isTarget = tab.id === id;
      tabButtons[index].classList.toggle("active", isTarget);
      tabButtons[index].setAttribute("aria-selected", isTarget ? "true" : "false");
      tabButtons[index].setAttribute("tabindex", isTarget ? "0" : "-1");

      tabPanels[index].classList.toggle("active", isTarget);
    });

    if (typeof onTabChange === "function") {
      onTabChange(id, selectedIndex);
    }
  }

  container.appendChild(nav);
  container.appendChild(panelContainer);
  container.setActiveTab = setActiveTab;

  return container;
}
