/**
 * ConVerse Component: Interactive Radar Visualization & Accessible Matrix
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Radar & Intelligence Engine Owner: Ananya
 *
 * Provides:
 * 1. Dual-Layer Lightweight SVG Radar Spider Chart (Layer A: Threat, Layer B: Awareness)
 * 2. Mode Selector: Threat | Awareness | Both
 * 3. Fully Accessible Semantic HTML Table
 * 4. Responsive (Desktop & Mobile, min 44px touch targets, no horizontal overflow)
 * 5. Reduced-Motion Compliant 600ms Transitions
 * 6. Live Subscriptions & Immediate State Sync
 */

import { t } from '../i18n/i18n.js';
import {
  SIX_DIMENSIONS,
  getRadarState,
  subscribeToRadar,
  getAwarenessScore,
  getAwarenessBand,
  getWeakestDimensions
} from '../engine/radar/radar-contract.js';

const CX = 170;
const CY = 170;
const MAX_RADIUS = 110;
const LABEL_RADIUS = 145;

// Dimension angles around the 6-axis spider chart (-90° top, +60° clockwise)
const ANGLES = [
  -Math.PI / 2,                // 0: Urgency (Top)
  -Math.PI / 2 + Math.PI / 3,   // 1: Sender (Top-Right)
  -Math.PI / 2 + 2 * Math.PI / 3, // 2: Link (Bottom-Right)
  -Math.PI / 2 + Math.PI,      // 3: Information (Bottom)
  -Math.PI / 2 + 4 * Math.PI / 3, // 4: Emotion (Bottom-Left)
  -Math.PI / 2 + 5 * Math.PI / 3  // 5: Reporting (Top-Left)
];

/**
 * Creates an interactive Radar View element
 * @param {Object} [options]
 * @param {"threat"|"awareness"|"both"} [options.initialMode="both"]
 * @param {boolean} [options.showTable=true] - Whether to render accessible table
 * @param {boolean} [options.compact=false] - Compact mode for dashboard cards
 * @param {boolean} [options.showControls=true] - Show Threat/Awareness toggle
 * @param {boolean} [options.showSummary=true] - Show score and weakest dimension banner
 * @returns {HTMLElement}
 */
export function createRadarView(options = {}) {
  const {
    initialMode = "both",
    showTable = true,
    compact = false,
    showControls = true,
    showSummary = true
  } = options;

  let currentMode = initialMode; // "threat" | "awareness" | "both"
  const container = document.createElement("div");
  container.className = `cv-radar-container ${compact ? "cv-radar-compact" : ""}`;

  // Accessible Live Region for Screen Readers
  const liveRegion = document.createElement("div");
  liveRegion.className = "sr-only";
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.id = `radar-live-${Math.random().toString(36).substr(2, 9)}`;
  container.appendChild(liveRegion);

  // 1. Controls Header (Mode Toggle: Threat | Awareness | Both)
  const headerEl = document.createElement("div");
  headerEl.className = "cv-radar-header";

  if (showControls) {
    const controlsWrap = document.createElement("div");
    controlsWrap.className = "cv-radar-controls";
    controlsWrap.setAttribute("role", "group");
    controlsWrap.setAttribute("aria-label", "Radar Display Mode");

    const modes = [
      { id: "both", labelKey: "radar_mode_both", fallback: "Both" },
      { id: "threat", labelKey: "radar_mode_threat", fallback: "Threat" },
      { id: "awareness", labelKey: "radar_mode_awareness", fallback: "Awareness" }
    ];

    modes.forEach(m => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cv-radar-mode-btn ${currentMode === m.id ? "active" : ""}`;
      btn.setAttribute("data-mode", m.id);
      btn.setAttribute("aria-pressed", currentMode === m.id ? "true" : "false");
      btn.textContent = t(m.labelKey) || m.fallback;

      btn.addEventListener("click", () => {
        currentMode = m.id;
        controlsWrap.querySelectorAll(".cv-radar-mode-btn").forEach(b => {
          const isActive = b.getAttribute("data-mode") === currentMode;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        updateDisplay();
      });

      controlsWrap.appendChild(btn);
    });

    headerEl.appendChild(controlsWrap);
  }

  // Legend indicators
  const legendWrap = document.createElement("div");
  legendWrap.className = "cv-radar-legend";
  legendWrap.innerHTML = `
    <span class="cv-radar-legend-item cv-radar-legend-threat">
      <span class="cv-radar-legend-dot" style="background-color: var(--color-danger, #A8201A);"></span>
      <span class="text-xs">${t("radar_table_threat") || "Threat"}</span>
    </span>
    <span class="cv-radar-legend-item cv-radar-legend-awareness">
      <span class="cv-radar-legend-dot" style="background-color: var(--color-success, #1E6B38);"></span>
      <span class="text-xs">${t("radar_table_awareness") || "My Awareness"}</span>
    </span>
  `;
  headerEl.appendChild(legendWrap);
  container.appendChild(headerEl);

  // 2. Main Visual Layout (SVG Chart & Score Cards)
  const chartLayout = document.createElement("div");
  chartLayout.className = "cv-radar-layout";

  // SVG Radar Canvas
  const svgWrap = document.createElement("div");
  svgWrap.className = "cv-radar-svg-wrap";
  svgWrap.innerHTML = renderSvgSkeleton();
  chartLayout.appendChild(svgWrap);

  // Summary / Insights Box
  const summaryBox = document.createElement("div");
  summaryBox.className = "cv-radar-summary-box";
  chartLayout.appendChild(summaryBox);

  container.appendChild(chartLayout);

  // 3. Semantic Accessible Table
  const tableWrap = document.createElement("div");
  tableWrap.className = "cv-radar-table-wrap";
  if (showTable) {
    container.appendChild(tableWrap);
  }

  /**
   * Re-renders dynamic elements based on latest radar state
   */
  function updateDisplay() {
    const state = getRadarState();
    const threat = state.threat || {};
    const awareness = state.awareness || {};
    const awarenessScore = getAwarenessScore(awareness);
    const band = getAwarenessBand(awarenessScore);
    const weakest = getWeakestDimensions(awareness, 2);

    // Update SVG Polygons
    const svgEl = svgWrap.querySelector("svg");
    if (svgEl) {
      updateSvgPolygons(svgEl, threat, awareness, currentMode);
    }

    // Update Summary Box
    if (showSummary) {
      const weakestName = weakest.length > 0 ? weakest[0].name : "Link Checking";
      const weakestScore = weakest.length > 0 ? Math.round(weakest[0].score) : 50;

      summaryBox.innerHTML = `
        <div class="cv-radar-stat-card">
          <div class="text-xs text-muted">${t("radar_overall_awareness") || "Awareness Score"}</div>
          <div class="flex items-center gap-xs" style="margin: 4px 0;">
            <span style="font-size: 1.75rem; font-weight: 700; color: var(--color-text);">${awarenessScore}</span>
            <span class="text-sm text-muted">/ 100</span>
            <span class="cv-badge ${band.band === 'strong' ? 'cv-badge-safe' : band.band === 'moderate' ? 'cv-badge-warn' : 'cv-badge-danger'}">
              ${band.label}
            </span>
          </div>
          <p class="text-xs text-muted" style="margin: 0;">
            Baseline: 50. Updates in real-time as you practice simulations.
          </p>
        </div>

        <div class="cv-radar-stat-card" style="margin-top: 10px;">
          <div class="text-xs text-muted">${t("radar_weakest_heading") || "Key Focus Dimension"}</div>
          <div class="text-sm text-bold" style="color: var(--color-text); margin: 2px 0;">
            ${weakestName} (${weakestScore}/100)
          </div>
          <p class="text-xs text-muted" style="margin: 0;">
            ${weakest[0]?.meaning || "Focus on spotting hidden red flags."}
          </p>
        </div>

        ${threat.overall > 0 ? `
          <div class="cv-radar-stat-card" style="margin-top: 10px; border-left: 3px solid var(--color-danger);">
            <div class="text-xs text-muted">${t("radar_overall_threat") || "Scanned Message Threat"}</div>
            <div class="flex items-center gap-xs" style="margin: 2px 0;">
              <span style="font-size: 1.25rem; font-weight: 700; color: var(--color-danger);">${Math.round(threat.overall)}%</span>
              ${threat.hasCriticalOverride ? '<span class="cv-badge cv-badge-danger">Safety Override: 85%+</span>' : ''}
            </div>
            <span class="text-xs text-muted">${threat.hitIndicators?.length || 0} threat indicators detected</span>
          </div>
        ` : ''}
      `;
    }

    // Update Accessible Table
    if (showTable) {
      tableWrap.innerHTML = `
        <table class="cv-radar-table" aria-label="${t("radar_accessible_table_caption") || "Scam Threat Risk and User Awareness Table"}">
          <caption class="sr-only">${t("radar_accessible_table_caption") || "Scam threat risk and user awareness scores across six defense dimensions"}</caption>
          <thead>
            <tr>
              <th scope="col">${t("radar_table_dimension") || "Dimension"}</th>
              <th scope="col" style="text-align: right;">${t("radar_table_threat") || "Threat"}</th>
              <th scope="col" style="text-align: right;">${t("radar_table_awareness") || "Awareness"}</th>
            </tr>
          </thead>
          <tbody>
            ${SIX_DIMENSIONS.map(d => {
              const tVal = Math.round(threat[d.key] || 0);
              const aVal = Math.round(awareness[d.key] || 50);
              return `
                <tr>
                  <td>
                    <strong>${d.name}</strong>
                    <div class="text-xs text-muted">${d.meaning}</div>
                  </td>
                  <td style="text-align: right; vertical-align: middle;">
                    <span class="cv-radar-cell-threat ${tVal > 50 ? 'text-danger text-bold' : ''}">${tVal}%</span>
                  </td>
                  <td style="text-align: right; vertical-align: middle;">
                    <span class="cv-radar-cell-awareness text-bold">${aVal} / 100</span>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    }

    // Screen reader announcement
    if (liveRegion) {
      liveRegion.textContent = `Scam radar updated. Overall awareness score is ${awarenessScore} out of 100 (${band.label}).`;
    }
  }

  // Subscribe to real-time radar changes
  const unsubscribe = subscribeToRadar(() => {
    updateDisplay();
  });

  // Initial draw
  updateDisplay();

  // Clean-up hook if disconnected
  container.destroy = () => {
    unsubscribe();
  };

  return container;
}

/**
 * Builds SVG spider skeleton (rings, radial axes, dimension labels)
 */
function renderSvgSkeleton() {
  const levels = [20, 40, 60, 80, 100];

  // Concentric polygon rings
  const rings = levels.map(lvl => {
    const pts = ANGLES.map(ang => {
      const r = (MAX_RADIUS * lvl) / 100;
      const x = CX + r * Math.cos(ang);
      const y = CY + r * Math.sin(ang);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    return `<polygon points="${pts}" class="cv-radar-grid-ring" fill="none" stroke="var(--color-border, #DED9CF)" stroke-width="1" stroke-dasharray="${lvl === 100 ? 'none' : '2,2'}" />`;
  }).join("");

  // Radial axes
  const axes = ANGLES.map((ang, i) => {
    const x = CX + MAX_RADIUS * Math.cos(ang);
    const y = CY + MAX_RADIUS * Math.sin(ang);
    return `<line x1="${CX}" y1="${CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--color-border, #DED9CF)" stroke-width="1" />`;
  }).join("");

  // Axis Labels
  const labels = SIX_DIMENSIONS.map((d, i) => {
    const ang = ANGLES[i];
    const x = CX + LABEL_RADIUS * Math.cos(ang);
    const y = CY + LABEL_RADIUS * Math.sin(ang);

    let anchor = "middle";
    if (Math.cos(ang) > 0.3) anchor = "start";
    else if (Math.cos(ang) < -0.3) anchor = "end";

    // Split long label into 2 lines if needed
    const parts = d.name.split(" ");
    const line1 = parts.slice(0, 2).join(" ");
    const line2 = parts.slice(2).join(" ");

    return `
      <text x="${x.toFixed(1)}" y="${(y - (line2 ? 4 : 0)).toFixed(1)}" text-anchor="${anchor}" class="cv-radar-axis-label" dominant-baseline="central">
        <tspan x="${x.toFixed(1)}" dy="0">${line1}</tspan>
        ${line2 ? `<tspan x="${x.toFixed(1)}" dy="12">${line2}</tspan>` : ''}
      </text>
    `;
  }).join("");

  return `
    <svg viewBox="0 0 340 340" width="100%" height="100%" class="cv-radar-svg" role="img" aria-label="Scam Threat and Awareness Spider Radar Chart">
      <defs>
        <filter id="threatGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#A8201A" flood-opacity="0.2"/>
        </filter>
        <filter id="awareGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#1E6B38" flood-opacity="0.2"/>
        </filter>
      </defs>

      <!-- Background Circles / Rings -->
      <g class="cv-radar-grid">${rings}</g>

      <!-- Axis Spokes -->
      <g class="cv-radar-spokes">${axes}</g>

      <!-- Threat Polygon Layer (Layer A) -->
      <polygon id="radar-threat-polygon" class="cv-radar-polygon cv-radar-polygon-threat" points="" fill="rgba(168, 32, 26, 0.22)" stroke="var(--color-danger, #A8201A)" stroke-width="2" stroke-linejoin="round" />
      <g id="radar-threat-points"></g>

      <!-- Awareness Polygon Layer (Layer B) -->
      <polygon id="radar-awareness-polygon" class="cv-radar-polygon cv-radar-polygon-awareness" points="" fill="rgba(30, 107, 56, 0.22)" stroke="var(--color-success, #1E6B38)" stroke-width="2.5" stroke-linejoin="round" />
      <g id="radar-awareness-points"></g>

      <!-- Center Anchor -->
      <circle cx="${CX}" cy="${CY}" r="3" fill="var(--color-text-muted, #6E6A62)" />

      <!-- Labels -->
      <g class="cv-radar-labels">${labels}</g>
    </svg>
  `;
}

/**
 * Updates dynamic SVG polygon coordinates and point circles
 */
function updateSvgPolygons(svgEl, threat, awareness, mode) {
  const threatPoly = svgEl.querySelector("#radar-threat-polygon");
  const threatPoints = svgEl.querySelector("#radar-threat-points");
  const awarePoly = svgEl.querySelector("#radar-awareness-polygon");
  const awarePoints = svgEl.querySelector("#radar-awareness-points");

  const showThreat = mode === "threat" || mode === "both";
  const showAwareness = mode === "awareness" || mode === "both";

  // Calculate Threat points
  const tPts = SIX_DIMENSIONS.map((d, i) => {
    const val = Math.max(0, Math.min(100, threat[d.key] || 0));
    const r = (MAX_RADIUS * val) / 100;
    const ang = ANGLES[i];
    return {
      x: CX + r * Math.cos(ang),
      y: CY + r * Math.sin(ang),
      val
    };
  });

  // Calculate Awareness points
  const aPts = SIX_DIMENSIONS.map((d, i) => {
    const val = Math.max(0, Math.min(100, awareness[d.key] ?? 50));
    const r = (MAX_RADIUS * val) / 100;
    const ang = ANGLES[i];
    return {
      x: CX + r * Math.cos(ang),
      y: CY + r * Math.sin(ang),
      val
    };
  });

  if (threatPoly) {
    threatPoly.style.display = showThreat ? "block" : "none";
    threatPoly.setAttribute("points", tPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "));
  }

  if (threatPoints) {
    threatPoints.style.display = showThreat ? "block" : "none";
    threatPoints.innerHTML = tPts.map(p => `
      <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="var(--color-danger, #A8201A)" stroke="#FFFFFF" stroke-width="1.5" class="cv-radar-point" />
    `).join("");
  }

  if (awarePoly) {
    awarePoly.style.display = showAwareness ? "block" : "none";
    awarePoly.setAttribute("points", aPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "));
  }

  if (awarePoints) {
    awarePoints.style.display = showAwareness ? "block" : "none";
    awarePoints.innerHTML = aPts.map(p => `
      <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="var(--color-success, #1E6B38)" stroke="#FFFFFF" stroke-width="1.5" class="cv-radar-point" />
    `).join("");
  }
}
