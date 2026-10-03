/**
 * ConVerse — Dashboard Page (dashboard.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 */

const DashboardPage = {
  render: function(container) {
    const userPersona = window.ConVerseState ? window.ConVerseState.currentPersona : 'student';
    const personaData = (window.ConVerseData && window.ConVerseData.PERSONAS) ? window.ConVerseData.PERSONAS[userPersona] : { name: 'Student', avatar: '🎓' };
    const preTest = JSON.parse(localStorage.getItem('converse_pre_test') || 'null');

    container.innerHTML = `
      <div class="dashboard-view">
        <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.1));">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #A5B4FC; font-weight: 700;">Awareness Engine</span>
              <h1 style="font-size: 1.6rem; font-weight: 800; margin-top: 0.2rem;">Welcome, ${personaData.name} ${personaData.avatar}</h1>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">Learn to spot real-world Indian financial scams through simulated UPI, SMS, and WhatsApp encounters.</p>
            </div>
          </div>
          
          <div style="margin-top: 1.2rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="#/simulator?session=true" class="next-step-btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.95rem; width: auto; background: var(--accent-emerald);">
              <span>⚡ Start 3-Scenario Session</span>
            </a>
            ${!preTest ? `
              <a href="#/test?type=pre" class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.95rem; width: auto; border-color: var(--accent-cyan);">
                <span>📝 Take Baseline Pre-Test</span>
              </a>
            ` : `
              <a href="#/simulator" class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.95rem; width: auto;">
                <span>🎮 Explore Scenarios</span>
              </a>
            `}
            <a href="#/tips" class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.95rem; width: auto;">
              <span>💡 Safety Rules</span>
            </a>
          </div>
        </div>

        <div class="card">
          <div class="section-header">
            <h2 class="section-title">🛡️ High Priority Scenarios for You</h2>
            <p class="section-desc">Curated based on your persona vulnerability profile.</p>
          </div>
          <div id="dashboardRecommendedScenarios" class="scenario-selector-grid">
            <!-- Populated dynamically -->
          </div>
        </div>

        <div class="card">
          <div class="section-header">
            <h2 class="section-title">🚨 Indian Cyber Helpline</h2>
            <p class="section-desc">Golden Hour reporting contacts if you suspect fraud.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 1rem;">
              <div style="font-size: 0.8rem; color: #FCA5A5; font-weight: 600;">National Cyber Crime Helpline</div>
              <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-mono); color: #EF4444; margin: 0.25rem 0;">1930</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Toll-Free, 24x7 Pan-India</div>
            </div>
            <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: var(--radius-md); padding: 1rem;">
              <div style="font-size: 0.8rem; color: #67E8F9; font-weight: 600;">Official Cyber Crime Portal</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-cyan); margin: 0.4rem 0;">cybercrime.gov.in</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">File online financial fraud complaint</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderRecommendedScenarios();
  },

  renderRecommendedScenarios: function() {
    const grid = document.getElementById('dashboardRecommendedScenarios');
    if (!grid) return;

    const userPersona = window.ConVerseState ? window.ConVerseState.currentPersona : 'student';
    let scenarios = [];
    if (window.ConVerseScenarios) {
      scenarios = Object.values(window.ConVerseScenarios);
    }

    if (window.ScenarioSelector && typeof window.ScenarioSelector.getPrioritizedScenarios === 'function') {
      scenarios = window.ScenarioSelector.getPrioritizedScenarios(userPersona, scenarios).slice(0, 3);
    } else {
      scenarios = scenarios.slice(0, 3);
    }

    if (scenarios.length === 0) {
      grid.innerHTML = `<p style="color: var(--text-muted);">No scenarios loaded yet.</p>`;
      return;
    }

    grid.innerHTML = scenarios.map(s => `
      <div class="scenario-card" onclick="window.location.hash = '#/simulator?id=${s.id}'" role="button" tabindex="0" onkeydown="if(event.key==='Enter') window.location.hash = '#/simulator?id=${s.id}'">
        <div>
          <div class="scenario-meta-row">
            <span class="scenario-id-tag">${s.id}</span>
            <span class="difficulty-badge diff-${s.difficulty}">Level ${s.difficulty}</span>
          </div>
          <h3 class="scenario-card-title">${s.title}</h3>
          <p class="scenario-card-summary">${s.summary}</p>
        </div>
        <div class="scenario-card-footer">
          <span>${s.category}</span>
          <span style="color: var(--accent-cyan);">Start Simulation &rarr;</span>
        </div>
      </div>
    `).join('');
  }
};

if (typeof window !== 'undefined') {
  window.DashboardPage = DashboardPage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DashboardPage };
}
