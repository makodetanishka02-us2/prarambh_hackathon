/**
 * ConVerse — Financial Safety Tips Page
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 */

const TipsPage = {
  render: function(container) {
    const tips = (window.ConVerseData && window.ConVerseData.SAFETY_TIPS) || [];

    container.innerHTML = `
      <div class="tips-view">
        <div class="section-header">
          <h1 class="section-title">💡 Financial Safety Rules</h1>
          <p class="section-desc">Essential defensive principles to protect your UPI, banking, and identity in India.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${tips.map((tip, idx) => `
            <div class="card" style="display: flex; gap: 1rem; align-items: flex-start;">
              <div style="background: rgba(99, 102, 241, 0.2); border: 1px solid var(--border-glass); width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-mono); color: var(--accent-cyan); flex-shrink: 0;">
                0${idx + 1}
              </div>
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.3rem;">
                  <h2 style="font-size: 1.1rem; font-weight: 700;">${tip.title}</h2>
                  ${tip.relatedIndicators ? tip.relatedIndicators.map(id => `<span class="badge-tag">${id}</span>`).join('') : ''}
                </div>
                <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${tip.description}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Golden Hour Emergency Action Card -->
        <div class="card" style="margin-top: 1.5rem; border-color: rgba(239, 68, 68, 0.4); background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(19, 27, 46, 0.8));">
          <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-size: 1.5rem;">⏱️</span>
            <div>
              <h2 style="font-size: 1.15rem; font-weight: 800; color: #FCA5A5;">The "Golden Hour" Rule</h2>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">What to do immediately if defrauded</div>
            </div>
          </div>
          <p style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.5; margin-bottom: 1rem;">
            If you entered your UPI PIN or transferred funds to a fraudster, call <strong>1930</strong> within the first <strong>2 hours</strong>. The Citizen Financial Cyber Fraud Reporting System can freeze the funds in intermediary mule accounts before withdrawal.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="tel:1930" class="next-step-btn" style="width: auto; text-decoration: none; padding: 0.6rem 1.25rem; font-size: 0.9rem; background: var(--accent-rose);">
              📞 Call 1930
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="width: auto; text-decoration: none; padding: 0.6rem 1.25rem; font-size: 0.9rem;">
              🌐 cybercrime.gov.in &rarr;
            </a>
          </div>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.TipsPage = TipsPage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TipsPage };
}
