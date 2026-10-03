/**
 * ConVerse — Radar, Tips, and Progress Page Placeholders
 */

const RadarPage = {
  render: function(container) {
    const catalogue = (window.ConVerseData && window.ConVerseData.INDICATOR_DIMENSIONS) || {};
    const dimensions = Object.values(catalogue);

    container.innerHTML = `
      <div class="radar-view">
        <div class="section-header">
          <h1 class="section-title">🎯 6-Dimensional Scam Radar</h1>
          <p class="section-desc">Understand the warning vectors evaluated across all simulation scenarios.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${dimensions.map(d => `
            <div class="card" style="border-top: 3px solid ${d.color};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #F8FAFC;">${d.name}</h2>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: ${d.color}; background: rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">Code: ${d.codePrefix}</span>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-secondary);">${d.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

const TipsPage = {
  render: function(container) {
    const tips = (window.ConVerseData && window.ConVerseData.SAFETY_TIPS) || [];

    container.innerHTML = `
      <div class="tips-view">
        <div class="section-header">
          <h1 class="section-title">💡 Financial Safety Rules</h1>
          <p class="section-desc">Key principles to protect your UPI and bank accounts from digital fraud.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${tips.map((tip, idx) => `
            <div class="card" style="display: flex; gap: 1rem; align-items: flex-start;">
              <div style="background: rgba(99, 102, 241, 0.2); border: 1px solid var(--border-glass); width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-mono); color: var(--accent-cyan); flex-shrink: 0;">
                0${idx + 1}
              </div>
              <div>
                <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.3rem;">${tip.title}</h2>
                <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${tip.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

const ProgressPage = {
  render: function(container) {
    const history = JSON.parse(localStorage.getItem('converse_history') || '[]');
    const totalScenarios = 10;
    const completedCount = history.length;

    container.innerHTML = `
      <div class="progress-view">
        <div class="section-header">
          <h1 class="section-title">🏆 Your Awareness Progress</h1>
          <p class="section-desc">Track your simulation completion and scam recognition score.</p>
        </div>

        <div class="card" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
          <div>
            <div style="font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-cyan);">${completedCount}/${totalScenarios}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Completed</div>
          </div>
          <div>
            <div style="font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-emerald);">
              ${history.length > 0 ? Math.round(history.reduce((a, b) => a + (b.scorePercentage || 0), 0) / history.length) + '%' : '0%'}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Avg Score</div>
          </div>
          <div>
            <div style="font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-amber);">
              ${completedCount >= 5 ? 'Master' : completedCount >= 2 ? 'Apprentice' : 'Novice'}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Rank</div>
          </div>
        </div>

        <div class="card">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem;">Recent Simulation History</h2>
          ${history.length === 0 ? `
            <p style="font-size: 0.88rem; color: var(--text-muted); text-align: center; padding: 1rem 0;">No simulations completed yet. Start one from the Simulator tab!</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${history.slice(-5).reverse().map(h => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                  <div>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-primary); font-size: 0.85rem;">${h.scenarioId}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.5rem;">${new Date(h.date || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div style="font-weight: 700; font-family: var(--font-mono); color: ${h.verdict === 'SAFE' ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
                    ${h.scorePercentage}% (${h.verdict})
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.RadarPage = RadarPage;
  window.TipsPage = TipsPage;
  window.ProgressPage = ProgressPage;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RadarPage, TipsPage, ProgressPage };
}
