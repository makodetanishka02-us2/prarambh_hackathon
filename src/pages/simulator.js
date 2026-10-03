/**
 * ConVerse — Simulator Page (Baseline Integration)
 * Renders the mobile-first simulation canvas, connects with ScenarioEngine.
 */

const SimulatorPage = {
  currentScenario: null,
  activeEngine: null,
  timerInterval: null,
  timeRemaining: 0,

  render: function(container, params) {
    const scenarioId = params ? params.get('id') : null;
    
    container.innerHTML = `
      <div class="simulator-view">
        <div id="simHeaderContainer" class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 class="section-title">🎮 Scam Simulator</h1>
            <p class="section-desc">Test your instincts in realistic simulated fraud encounters.</p>
          </div>
          <button id="scenarioPickerBtn" class="btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem; min-height: 38px; display: none;">
            Change Scenario
          </button>
        </div>

        <!-- Scenario Selector View -->
        <div id="scenarioSelectionView">
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h2 style="font-size: 1.1rem; font-weight: 700;">Select a Scenario</h2>
              <div id="personaFilterInfo" style="font-size: 0.8rem; color: var(--accent-cyan);"></div>
            </div>
            <div id="scenarioListGrid" class="scenario-selector-grid">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>

        <!-- Simulation Active Canvas -->
        <div id="simulationActiveView" style="display: none;">
          <div class="simulation-container">
            <!-- Simulated Phone Header -->
            <div class="sim-phone-header">
              <div class="sim-caller-info">
                <div id="simAvatar" class="sim-avatar">📱</div>
                <div class="sim-contact-details">
                  <div class="sim-contact-name">
                    <span id="simSenderName">Bank Alert</span>
                    <span id="simVerifiedBadge" class="verified-icon">✓</span>
                  </div>
                  <div id="simContactSub" class="sim-contact-sub">VK-SBIBNK</div>
                </div>
              </div>
              <div id="simChannelBadge" class="badge-tag">SMS</div>
            </div>

            <!-- Urgency Timer Bar -->
            <div class="sim-timer-container">
              <div id="simTimerBar" class="sim-timer-bar"></div>
            </div>

            <!-- Message Dialogue Body -->
            <div class="sim-chat-body">
              <div id="simMessageBubble" class="sim-message-bubble">
                Loading scenario message...
              </div>
            </div>

            <!-- Decision Choices Panel -->
            <div class="sim-choices-panel">
              <div class="choices-prompt">
                <span>What will you do?</span>
                <span id="timerCountdownText" style="font-family: var(--font-mono); color: var(--accent-amber); font-size: 0.8rem;"></span>
              </div>
              <div id="choicesContainer" style="display: flex; flex-direction: column; gap: 0.6rem;">
                <!-- Choices rendered here -->
              </div>
            </div>

            <!-- Consequence Feedback Drawer -->
            <div id="feedbackDrawer" class="feedback-drawer" style="display: none;">
              <div class="feedback-header">
                <span id="feedbackIcon">⚠️</span>
                <span id="feedbackTitle">Decision Result</span>
              </div>
              <p id="feedbackText" class="feedback-text"></p>
              <div id="feedbackTags" class="feedback-tags"></div>
              <button id="nextStepBtn" class="next-step-btn">Continue &rarr;</button>
            </div>
          </div>
        </div>

        <!-- Simulation Completed Result View -->
        <div id="simulationResultView" style="display: none;">
          <!-- Result Card rendered dynamically -->
        </div>
      </div>
    `;

    this.bindEvents();

    if (scenarioId && window.ConVerseScenarios && window.ConVerseScenarios[scenarioId]) {
      this.loadScenario(scenarioId);
    } else {
      this.renderScenarioList();
    }
  },

  bindEvents: function() {
    const pickerBtn = document.getElementById('scenarioPickerBtn');
    if (pickerBtn) {
      pickerBtn.addEventListener('click', () => {
        this.renderScenarioList();
      });
    }
  },

  renderScenarioList: function() {
    clearInterval(this.timerInterval);
    document.getElementById('scenarioSelectionView').style.display = 'block';
    document.getElementById('simulationActiveView').style.display = 'none';
    document.getElementById('simulationResultView').style.display = 'none';
    document.getElementById('scenarioPickerBtn').style.display = 'none';

    const grid = document.getElementById('scenarioListGrid');
    if (!grid) return;

    const userPersona = window.ConVerseState ? window.ConVerseState.currentPersona : 'student';
    let scenarios = Object.values(window.ConVerseScenarios || {});

    const filterInfo = document.getElementById('personaFilterInfo');
    if (filterInfo) {
      filterInfo.textContent = `Prioritized for ${userPersona.toUpperCase()}`;
    }

    if (window.ScenarioSelector && typeof window.ScenarioSelector.getPrioritizedScenarios === 'function') {
      scenarios = window.ScenarioSelector.getPrioritizedScenarios(userPersona, scenarios);
    }

    if (scenarios.length === 0) {
      grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 2rem;">No scenarios available.</p>`;
      return;
    }

    grid.innerHTML = scenarios.map(s => `
      <div class="scenario-card" onclick="SimulatorPage.loadScenario('${s.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter') SimulatorPage.loadScenario('${s.id}')">
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
          <span style="color: var(--accent-cyan); font-weight: 600;">Play Scenario &rarr;</span>
        </div>
      </div>
    `).join('');
  },

  loadScenario: function(scenarioId) {
    if (!window.ScenarioEngine) {
      console.error('ScenarioEngine not available');
      return;
    }

    document.getElementById('scenarioSelectionView').style.display = 'none';
    document.getElementById('simulationActiveView').style.display = 'block';
    document.getElementById('simulationResultView').style.display = 'none';
    document.getElementById('scenarioPickerBtn').style.display = 'inline-block';
    document.getElementById('feedbackDrawer').style.display = 'none';

    this.activeEngine = new window.ScenarioEngine();
    const startNode = this.activeEngine.startScenario(scenarioId);
    this.currentScenario = (window.ConVerseScenarios || {})[scenarioId];

    this.renderNode(startNode);
  },

  renderNode: function(node) {
    if (!node) return;

    // Reset feedback drawer
    document.getElementById('feedbackDrawer').style.display = 'none';

    // Channel & Sender rendering
    const channelBadge = document.getElementById('simChannelBadge');
    const avatar = document.getElementById('simAvatar');
    const senderName = document.getElementById('simSenderName');
    const contactSub = document.getElementById('simContactSub');
    const verifiedBadge = document.getElementById('simVerifiedBadge');

    channelBadge.textContent = (node.channel || 'chat').toUpperCase();
    if (node.sender) {
      avatar.textContent = node.sender.avatar || '👤';
      senderName.textContent = node.sender.name || 'Unknown Contact';
      contactSub.textContent = node.sender.handle || '';
      verifiedBadge.style.display = node.sender.verified ? 'inline' : 'none';
    }

    // Message rendering with optional Red-Flag tooltips
    const msgBubble = document.getElementById('simMessageBubble');
    msgBubble.className = 'sim-message-bubble ' + (node.channel || 'sms');
    
    let renderedMessage = node.message;
    if (node.redFlags && node.redFlags.length > 0) {
      node.redFlags.forEach(rf => {
        const regex = new RegExp(`(${rf.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        renderedMessage = renderedMessage.replace(regex, `<span class="red-flag-span" title="Potential Red Flag: ${rf.explanation}" onclick="SimulatorPage.showRedFlagInfo('${rf.indicatorId}', '${rf.explanation.replace(/'/g, "\\'")}')">$1</span>`);
      });
    }
    msgBubble.innerHTML = renderedMessage;

    // Timer handling
    this.startTimer(node.timeLimitSeconds || 0);

    // Render Choices
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    const choices = this.activeEngine.getAvailableChoices();
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `
        <span>${choice.label}</span>
        <span class="choice-btn-arrow">&rarr;</span>
      `;
      btn.addEventListener('click', () => {
        this.handleChoice(choice.id);
      });
      choicesContainer.appendChild(btn);
    });
  },

  startTimer: function(seconds) {
    clearInterval(this.timerInterval);
    const timerBar = document.getElementById('simTimerBar');
    const timerText = document.getElementById('timerCountdownText');

    if (!seconds || seconds <= 0) {
      timerBar.style.width = '0%';
      timerText.textContent = '';
      return;
    }

    this.timeRemaining = seconds;
    const total = seconds;
    timerBar.style.width = '100%';
    timerText.textContent = `⏱️ ${this.timeRemaining}s`;

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      const pct = Math.max(0, (this.timeRemaining / total) * 100);
      timerBar.style.width = `${pct}%`;
      timerText.textContent = `⏱️ ${this.timeRemaining}s`;

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  },

  handleChoice: function(choiceId) {
    clearInterval(this.timerInterval);
    if (!this.activeEngine) return;

    const outcome = this.activeEngine.choose(choiceId, { ms: 1000 });
    this.showFeedback(outcome.choice, outcome.nextNode, outcome.isComplete);
  },

  handleTimeout: function() {
    if (!this.activeEngine) return;
    const outcome = this.activeEngine.handleTimeout();
    const fakeChoice = {
      good: false,
      consequence: 'Time ran out! High-pressure urgency caused a delay/missed recognition.',
      indicatorIds: ['U1']
    };
    this.showFeedback(fakeChoice, outcome.nextNode, outcome.isComplete);
  },

  showFeedback: function(choice, nextNode, isComplete) {
    const drawer = document.getElementById('feedbackDrawer');
    const icon = document.getElementById('feedbackIcon');
    const title = document.getElementById('feedbackTitle');
    const text = document.getElementById('feedbackText');
    const tags = document.getElementById('feedbackTags');
    const nextBtn = document.getElementById('nextStepBtn');

    drawer.style.display = 'block';

    if (choice.good) {
      icon.textContent = '🛡️';
      title.textContent = 'Safe Decision Recognized!';
      title.className = 'feedback-good';
    } else {
      icon.textContent = '⚠️';
      title.textContent = 'Scam Trap Triggered!';
      title.className = 'feedback-bad';
    }

    text.textContent = choice.consequence || 'Decision evaluated.';

    // Tags
    tags.innerHTML = (choice.indicatorIds || []).map(tag => {
      const dim = tag.charAt(0).toLowerCase();
      const info = (window.ConVerseData && window.ConVerseData.INDICATOR_CATALOGUE) ? window.ConVerseData.INDICATOR_CATALOGUE[tag] : null;
      const label = info ? `${tag}: ${info.name}` : tag;
      return `<span class="indicator-tag-pill tag-${dim}">${label}</span>`;
    }).join('');

    // Remove old listeners
    const newBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newBtn, nextBtn);

    if (isComplete) {
      newBtn.textContent = 'View Final Simulation Report 🏆';
      newBtn.addEventListener('click', () => {
        this.showResult();
      });
    } else {
      newBtn.textContent = 'Continue Simulation &rarr;';
      newBtn.addEventListener('click', () => {
        drawer.style.display = 'none';
        this.renderNode(nextNode);
      });
    }
  },

  showResult: function() {
    clearInterval(this.timerInterval);
    document.getElementById('simulationActiveView').style.display = 'none';
    const resultView = document.getElementById('simulationResultView');
    resultView.style.display = 'block';

    const result = this.activeEngine.getResult();

    // Save history
    const history = JSON.parse(localStorage.getItem('converse_history') || '[]');
    history.push({
      scenarioId: result.scenarioId,
      scorePercentage: result.scorePercentage,
      verdict: result.verdict,
      date: Date.now()
    });
    localStorage.setItem('converse_history', JSON.stringify(history));

    const verdictClass = result.verdict === 'SAFE' ? 'verdict-safe' : result.verdict === 'VULNERABLE' ? 'verdict-vulnerable' : 'verdict-compromised';

    resultView.innerHTML = `
      <div class="result-card">
        <span class="result-verdict-badge ${verdictClass}">
          ${result.verdict === 'SAFE' ? '🛡️ PROTECTED & VIGILANT' : result.verdict === 'VULNERABLE' ? '⚠️ PARTIALLY VULNERABLE' : '🚨 COMPROMISED'}
        </span>

        <h2 style="font-size: 1.5rem; font-weight: 800;">Simulation Complete</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">Scenario: ${result.scenarioId} — ${(this.currentScenario && this.currentScenario.title) || ''}</p>

        <div class="score-display">
          <span class="score-num">${result.scorePercentage}</span>
          <span class="score-max">/100</span>
        </div>

        <div class="stat-grid">
          <div class="stat-box">
            <div class="stat-val caught">${result.caught}</div>
            <div class="stat-label">Recognized Flags</div>
          </div>
          <div class="stat-box">
            <div class="stat-val missed">${result.missed}</div>
            <div class="stat-label">Fell For Traps</div>
          </div>
        </div>

        <div class="takeaway-box">
          <div class="takeaway-title">💡 Key Scam Lesson</div>
          <p style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.5;">${result.takeaway}</p>
        </div>

        ${result.missedIndicators && result.missedIndicators.length > 0 ? `
          <div style="text-align: left; margin-bottom: 1.25rem;">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-rose); font-weight: 700; margin-bottom: 0.4rem;">Missed Red Flags to Review:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${result.missedIndicators.map(id => {
                const info = (window.ConVerseData && window.ConVerseData.INDICATOR_CATALOGUE) ? window.ConVerseData.INDICATOR_CATALOGUE[id] : null;
                return `<span class="indicator-tag-pill tag-${id.charAt(0).toLowerCase()}">${id}: ${info ? info.name : ''}</span>`;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <div class="result-action-row">
          <button class="next-step-btn" onclick="SimulatorPage.loadScenario('${result.scenarioId}')">
            🔄 Replay Scenario
          </button>
          <button class="btn-secondary" onclick="SimulatorPage.renderScenarioList()">
            📋 Choose Another Scenario
          </button>
        </div>
      </div>
    `;
  },

  showRedFlagInfo: function(indicatorId, explanation) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #EF4444;">🚩 Red Flag Detected</h3>
          <button class="icon-btn" onclick="this.closest('.modal-backdrop').remove()" style="min-width: 32px; min-height: 32px; width: 32px; height: 32px;">✕</button>
        </div>
        <p style="font-size: 0.95rem; color: #F8FAFC; margin-bottom: 0.75rem;">${explanation}</p>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">
          Indicator Flag: <strong>${indicatorId}</strong>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }
};

if (typeof window !== 'undefined') {
  window.SimulatorPage = SimulatorPage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimulatorPage };
}
