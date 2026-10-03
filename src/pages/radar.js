/**
 * ConVerse — 6-Dimensional Scam Radar Page (radar.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 */

const RadarPage = {
  render: function(container) {
    const catalogue = (window.ConVerseData && window.ConVerseData.INDICATOR_DIMENSIONS) || {};
    const dimensions = Object.values(catalogue);
    const indicatorList = (window.ConVerseData && window.ConVerseData.INDICATOR_CATALOGUE) || {};

    container.innerHTML = `
      <div class="radar-view">
        <div class="section-header">
          <h1 class="section-title">🎯 6-Dimensional Scam Radar</h1>
          <p class="section-desc">Understand the 6 warning vectors and 28 indicators evaluated across all ConVerse simulations.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${dimensions.map(d => {
            const indicatorsInDim = Object.values(indicatorList).filter(ind => ind.dimension === d.id);
            return `
              <div class="card" style="border-top: 3px solid ${d.color};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <h2 style="font-size: 1.1rem; font-weight: 700; color: #F8FAFC;">${d.name}</h2>
                  <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: ${d.color}; background: rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">Code: ${d.codePrefix}</span>
                </div>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${d.description}</p>
                <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Associated Flags:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                  ${indicatorsInDim.map(ind => `
                    <span class="indicator-tag-pill tag-${ind.id.charAt(0).toLowerCase()}" title="${ind.description}">
                      ${ind.id}: ${ind.name}
                    </span>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.RadarPage = RadarPage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RadarPage };
}
