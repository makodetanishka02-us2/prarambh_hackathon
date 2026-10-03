/**
 * ConVerse Client-Side Router
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

import { renderDashboard } from '../pages/dashboard.js';
import { renderSimulator } from '../pages/simulator.js';
import { renderSafetyTips } from '../pages/safety-tips.js';
import { renderProgress } from '../pages/progress.js';
import { renderSettings } from '../pages/settings.js';
import { renderStyleguide } from '../pages/styleguide.js';
import { updateDom } from '../i18n/i18n.js';

const routes = {
  "": renderDashboard,
  "dashboard": renderDashboard,
  "simulator": renderSimulator,
  "safety-tips": renderSafetyTips,
  "progress": renderProgress,
  "settings": renderSettings,
  "styleguide": renderStyleguide
};

let currentRoute = "";
let mainContainer = null;

/**
 * Initialize Router
 * @param {HTMLElement} contentContainer Element where page views are mounted
 */
export function initRouter(contentContainer) {
  mainContainer = contentContainer;

  window.addEventListener("hashchange", handleRouteChange);
  handleRouteChange();
}

/**
 * Navigate to a specific route programmatically
 * @param {string} route Path without leading hash (e.g., "simulator")
 */
export function navigate(route) {
  window.location.hash = `#${route}`;
}

/**
 * Get the current active route name
 */
export function getCurrentRoute() {
  return currentRoute;
}

/**
 * Handles route resolution and mounting
 */
function handleRouteChange() {
  const hash = window.location.hash.replace(/^#\/?/, "").trim();
  currentRoute = hash || "dashboard";

  const renderFn = routes[currentRoute] || routes["dashboard"];

  if (mainContainer) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderFn(mainContainer);
    updateDom(mainContainer);
    updateActiveNavIndicators(currentRoute);
  }
}

/**
 * Updates active classes across desktop and mobile bottom navigation bars
 */
function updateActiveNavIndicators(route) {
  const activeKey = route === "" ? "dashboard" : route;

  // Mobile Bottom Navigation Links
  document.querySelectorAll(".bottom-nav-item").forEach(item => {
    const itemRoute = (item.getAttribute("href") || "").replace(/^#\/?/, "");
    const isActive = itemRoute === activeKey;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-current", isActive ? "page" : "false");
  });

  // Desktop Navigation Links
  document.querySelectorAll(".desktop-nav-link").forEach(link => {
    const linkRoute = (link.getAttribute("href") || "").replace(/^#\/?/, "");
    const isActive = linkRoute === activeKey;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}
