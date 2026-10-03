/**
 * ConVerse — Progress & Learning Dashboard (progress.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Real, data-driven progress analytics wired directly to localStorage.
 * Zero fabricated metrics — honest empty states for new users.
 */

const ProgressPage = {
  render: function(container) {
    const history = JSON.parse(localStorage.getItem('converse_history') || '[]');
    const sessions = JSON.parse(localStorage.getItem('converse_sessions') || '[]');
    const preTest = JSON.parse(localStorage.getItem('converse_pre_test') || 'null');
    const postTest = JSON.parse(localStorage.getItem('converse_post_test') || 'null');
    const userPersona = window.ConVerseState ? window.ConVerseState.currentPersona : 'student';

    const totalScenarios = 10;
    const completedCount = history.length;
    const avgScore = history.length > 0 
      ? Math.round(history.reduce((sum, h) => sum + (h.scorePercentage || 0), 0) / history.length) 
      : 0;

    // Aggregate indicator metrics
    const recognizedIndicators = new Set();
    const missedIndicatorsCount = {};
    const dimensionStats = {
      U: { name: 'Urgency Pressure', code: 'U', recognized: 0, missed: 0, color: 'var(--indicator-u)' },
      S: { name: 'Sender Legitimacy', code: 'S', recognized: 0, missed: 0, color: 'var(--indicator-s)' },
      L: { name: 'Link & App Integrity', code: 'L', recognized: 0, missed: 0, color: 'var(--indicator-l)' },
      I: { name: 'Info & Access Sharing', code: 'I', recognized: 0, missed: 0, color: 'var(--indicator-i)' },
      E: { name: 'Emotional Manipulation', code: 'E', recognized: 0, missed: 0, color: 'var(--indicator-e)' },
      R: { name: 'Reporting & Verification', code: 'R', recognized: 0, missed: 0, color: 'var(--indicator-r)' }
    };

    history.forEach(h => {
      if (Array.isArray(h.missedIndicators)) {
        h.missedIndicators.forEach(tag => {
          missedIndicatorsCount[tag] = (missedIndicatorsCount[tag] || 0) + 1;
          const dim = tag.charAt(0).toUpperCase();
          if (dimensionStats[dim]) dimensionStats[dim].missed++;
        });
      }
      if (Array.isArray(h.recognizedIndicators)) {
        h.recognizedIndicators.forEach(tag => {
          recognizedIndicators.add(tag);
          const dim = tag.charAt(0).toUpperCase();
          if (dimensionStats[dim]) dimensionStats[dim].recognized++;
        });
      }
    });

    // Determine top missed indicator for targeted practice
    let topMissedTag = null;
    let maxMissCount = 0;
    for (const [tag, count] of Object.entries(missedIndicatorsCount)) {
      if (count > maxMissCount) {
        maxMissCount = count;
        topMissedTag = tag;
      }
    }

    // Pre/Post test improvement
    let assessmentHtml = '';
    if (!preTest && !postTest) {
      assessmentHtml = `
        <div class="card" style="border-left: 4px solid var(--accent-cyan);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">📝 Baseline Assessment Not Taken</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Take the 6-question Pre-Test to evaluate your initial scam detection instincts.</p>
            </div>
            <a href="#/test?type=pre" class="next-step-btn" style="width: auto; text-decoration: none; padding: 0.5rem 1rem; font-size: 0.85rem;">
              Take Pre-Test &rarr;
            </a>
          </div>
        </div>
      `;
    } else if (preTest && !postTest) {
      assessmentHtml = `
        <div class="card" style="border-left: 4px solid var(--accent-amber);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <h3 style="font-size: 1.05rem; font-weight: 700;">Pre-Test Baseline: ${preTest.scorePercentage}%</h3>
                <span class="badge-tag" style="background: rgba(245, 158, 11, 0.2); color: #FCD34D;">Pre-Test Complete</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Complete simulations and take the Post-Test to measure your verified learning growth.</p>
            </div>
            <a href="#/test?type=post" class="next-step-btn" style="width: auto; text-decoration: none; padding: 0.5rem 1rem; font-size: 0.85rem;">
              Take Post-Test &rarr;
            </a>
          </div>
        </div>
      `;
    } else if (preTest && postTest) {
      const imp = window.TestPool 
        ? window.TestPool.calculateImprovement(preTest.scorePercentage, postTest.scorePercentage)
        : { percentagePointImprovement: postTest.scorePercentage - preTest.scorePercentage, relativeImprovement: 0 };
      
      assessmentHtml = `
        <div class="card" style="border-color: var(--accent-cyan); background: linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.08));">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--accent-cyan);">📈 Pre-Test vs Post-Test Improvement</h3>
            <span class="badge-tag" style="background: rgba(16, 185, 129, 0.2); color: #6EE7B7;">Verified Assessment</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; text-align: center;">
            <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Pre-Test Baseline</div>
              <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: #CBD5E1;">${preTest.scorePercentage}%</div>
            </div>
            <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Post-Test Score</div>
              <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-cyan);">${postTest.scorePercentage}%</div>
            </div>
            <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Absolute Gain</div>
              <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: ${imp.percentagePointImprovement >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
                ${imp.percentagePointImprovement >= 0 ? '+' : ''}${imp.percentagePointImprovement}% pts
              </div>
            </div>
            <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Relative Growth</div>
              <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: ${imp.relativeImprovement >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
                ${imp.relativeImprovement >= 0 ? '+' : ''}${imp.relativeImprovement}%
              </div>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="progress-view">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h1 class="section-title">🏆 Your Awareness Progress</h1>
            <p class="section-desc">Personalized analytics and scam defense mastery based on actual simulation decisions.</p>
          </div>
          <button id="resetProgressBtn" class="btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; color: var(--text-muted);">
            Reset Data
          </button>
        </div>

        <!-- Metric Summary Cards -->
        <div class="card" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
          <div>
            <div style="font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-cyan);">${completedCount}/${totalScenarios}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Scenarios Played</div>
          </div>
          <div>
            <div style="font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: ${avgScore >= 80 ? 'var(--accent-emerald)' : avgScore >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)'};">
              ${completedCount > 0 ? avgScore + '%' : '0%'}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Avg Sim Score</div>
          </div>
          <div>
            <div style="font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-amber);">
              ${completedCount >= 8 ? 'Cyber Shield' : completedCount >= 4 ? 'Vigilant' : completedCount > 0 ? 'Learner' : 'Unranked'}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Defense Rank</div>
          </div>
        </div>

        <!-- Pre/Post Assessment Section -->
        ${assessmentHtml}

        <!-- 6-Dimensional Radar Breakdown -->
        <div class="card">
          <div class="section-header">
            <h2 class="section-title">🎯 6-Dimensional Defense Vector Matrix</h2>
            <p class="section-desc">Your real-time defense performance across key fraud vectors.</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${Object.values(dimensionStats).map(dim => {
              const total = dim.recognized + dim.missed;
              const pct = total > 0 ? Math.round((dim.recognized / total) * 100) : 0;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
                    <span style="font-weight: 600; color: #F8FAFC;">
                      <span style="color: ${dim.color}; font-family: var(--font-mono); font-weight: 700;">[${dim.code}]</span> ${dim.name}
                    </span>
                    <span style="font-family: var(--font-mono); color: var(--text-secondary); font-size: 0.8rem;">
                      ${total > 0 ? `${dim.recognized} recognized / ${dim.missed} traps (${pct}%)` : 'No data yet'}
                    </span>
                  </div>
                  <div style="height: 6px; width: 100%; background: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden;">
                    <div style="height: 100%; width: ${total > 0 ? pct : 0}%; background: ${dim.color}; border-radius: var(--radius-full); transition: width 0.4s ease;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Targeted Practice Recommendation Card -->
        ${topMissedTag ? `
          <div class="card" style="border-color: rgba(244, 63, 94, 0.4); background: linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(19, 27, 46, 0.8));">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-rose); letter-spacing: 0.05em;">🎯 Targeted Reinforcement</span>
                <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0.25rem 0;">Most Missed Warning: Flag [${topMissedTag}]</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">You fell for this warning indicator ${maxMissCount} time(s). Practice relevant scenarios to master this defense.</p>
              </div>
              <a href="#/simulator" class="next-step-btn" style="width: auto; text-decoration: none; padding: 0.5rem 1rem; font-size: 0.85rem; background: var(--accent-rose);">
                Practice Scenarios &rarr;
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Recent Simulations History -->
        <div class="card">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem;">Recent Simulation History (Last 10)</h2>
          ${history.length === 0 ? `
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎮</div>
              <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem;">No completed scenarios yet.</div>
              <p style="font-size: 0.85rem; margin-bottom: 1rem;">Complete your first simulation encounter to build your awareness timeline.</p>
              <a href="#/simulator" class="next-step-btn" style="display: inline-block; width: auto; text-decoration: none; padding: 0.5rem 1.25rem; font-size: 0.88rem;">
                Start First Simulation
              </a>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${history.slice(-10).reverse().map(h => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
                  <div>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan); font-size: 0.9rem;">${h.scenarioId}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.6rem;">${new Date(h.date || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-weight: 700; font-family: var(--font-mono); font-size: 0.9rem; color: ${h.verdict === 'SAFE' ? 'var(--accent-emerald)' : h.verdict === 'VULNERABLE' ? 'var(--accent-amber)' : 'var(--accent-rose)'};">
                      ${h.scorePercentage}% (${h.verdict})
                    </span>
                    <a href="#/simulator?id=${h.scenarioId}" style="text-decoration: none; font-size: 0.8rem; color: var(--accent-primary); font-weight: 600;">Replay &rarr;</a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Bind Reset Button
    const resetBtn = document.getElementById('resetProgressBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all simulation history and test assessments?')) {
          localStorage.removeItem('converse_history');
          localStorage.removeItem('converse_sessions');
          localStorage.removeItem('converse_pre_test');
          localStorage.removeItem('converse_post_test');
          this.render(container);
        }
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.ProgressPage = ProgressPage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProgressPage };
}
