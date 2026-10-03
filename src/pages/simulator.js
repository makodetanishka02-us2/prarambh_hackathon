/**
 * ConVerse — Interactive Scam Simulator & Learning Engine (simulator.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 * 
 * Production-ready simulation controller wired to ScenarioEngine, AdaptiveEngine,
 * Text-to-Speech (speechSynthesis), Confidence Selector, and 3-Scenario Training Sessions.
 */

const SimulatorPage = {
  currentScenario: null,
  activeEngine: null,
  timerInterval: null,
  timeRemaining: 0,
  nodeStartTime: 0,
  selectedConfidence: 2, // 1: Unsure, 2: Fairly sure, 3: Certain
  isSpeaking: false,

  // 3-Scenario Session Tracking
  sessionMode: false,
  sessionScenarios: [],
  sessionIndex: 0,
  sessionResults: [],

  render: function(container, params) {
    const scenarioId = params ? params.get('id') : null;
    const startSessionParam = params ? params.get('session') : null;

    container.innerHTML = `
      <div class="simulator-view">
        <div id="simHeaderContainer" class="section-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h1 class="section-title">🎮 Scam Simulator</h1>
            <p class="section-desc">Experience and outsmart realistic Indian financial scams in simulated channels.</p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <div id="sessionProgressBadge" class="badge-tag" style="display: none; background: rgba(16, 185, 129, 0.2); color: #6EE7B7; font-size: 0.8rem; padding: 0.35rem 0.65rem;">
              Session: 1/3
            </div>
            <button id="scenarioPickerBtn" class="btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem; min-height: 38px; display: none;">
              Change Scenario
            </button>
          </div>
        </div>

        <!-- Scenario Selector & Session Launcher View -->
        <div id="scenarioSelectionView">
          <!-- 3-Scenario Training Session Banner -->
          <div class="card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1)); border-color: rgba(16, 185, 129, 0.4); margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-emerald); letter-spacing: 0.05em;">⚡ Comprehensive Training Mode</span>
                <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0.25rem 0;">Start 3-Scenario Awareness Session</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Play a curated 3-scenario training cycle tailored to your persona vulnerability profile.</p>
              </div>
              <button id="start3SessionBtn" class="next-step-btn" style="width: auto; padding: 0.65rem 1.25rem; font-size: 0.9rem; background: var(--accent-emerald);">
                Start 3-Scenario Session 🚀
              </button>
            </div>
          </div>

          <!-- Adaptive Recommendation Banner -->
          <div id="adaptiveRecommendationBanner" class="card" style="display: none; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1)); border-color: rgba(99, 102, 241, 0.4); margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-cyan); letter-spacing: 0.05em;">🎯 Adaptive Recommendation</span>
              <span id="recTargetDiff" class="difficulty-badge diff-2">Level 2</span>
            </div>
            <h3 id="recTitle" style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">Scenario Title</h3>
            <p id="recReason" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Reason</p>
            <button id="playRecommendedBtn" class="next-step-btn" style="width: auto; padding: 0.6rem 1.25rem; font-size: 0.9rem;">
              Play Recommended Scenario &rarr;
            </button>
          </div>

          <!-- Scenarios List Grid -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h2 style="font-size: 1.1rem; font-weight: 700;">Explore All Scenarios (S01–S10)</h2>
              <div id="personaFilterInfo" style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600;"></div>
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
                    <span id="simVerifiedBadge" class="verified-icon" title="Verified Sender">✓</span>
                  </div>
                  <div id="simContactSub" class="sim-contact-sub">VK-SBIBNK</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <!-- Speaker / Audio Button -->
                <button id="speechSynthesisBtn" class="icon-btn" title="Read Aloud" aria-label="Read Aloud" style="font-size: 1.1rem; min-width: 34px; min-height: 34px; width: 34px; height: 34px;">
                  🔊
                </button>
                <div id="simChannelBadge" class="badge-tag">SMS</div>
              </div>
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

            <!-- Confidence Selector -->
            <div class="card" style="margin: 0.75rem 0; padding: 0.6rem 0.85rem; background: var(--bg-tertiary); border: 1px solid var(--border-glass);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.05em;">How confident are you in this decision?</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem;">
                <button type="button" class="btn-secondary conf-btn" id="confBtn1" onclick="SimulatorPage.setConfidence(1)" style="padding: 0.4rem 0.5rem; font-size: 0.8rem;">
                  🤷‍♂️ Unsure
                </button>
                <button type="button" class="btn-secondary conf-btn active" id="confBtn2" onclick="SimulatorPage.setConfidence(2)" style="padding: 0.4rem 0.5rem; font-size: 0.8rem; border-color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15);">
                  🤔 Fairly Sure
                </button>
                <button type="button" class="btn-secondary conf-btn" id="confBtn3" onclick="SimulatorPage.setConfidence(3)" style="padding: 0.4rem 0.5rem; font-size: 0.8rem;">
                  🎯 Certain
                </button>
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

        <!-- Session Completed Summary View -->
        <div id="sessionSummaryView" style="display: none;">
          <!-- 3-Scenario Grand Summary rendered dynamically -->
        </div>
      </div>
    `;

    this.bindEvents();

    if (startSessionParam === 'true') {
      this.start3ScenarioSession();
    } else if (scenarioId && window.ConVerseScenarios && window.ConVerseScenarios[scenarioId]) {
      this.sessionMode = false;
      this.loadScenario(scenarioId);
    } else {
      this.renderScenarioList();
    }
  },

  bindEvents: function() {
    const pickerBtn = document.getElementById('scenarioPickerBtn');
    if (pickerBtn) {
      pickerBtn.addEventListener('click', () => {
        this.stopSpeech();
        this.renderScenarioList();
      });
    }

    const startSessionBtn = document.getElementById('start3SessionBtn');
    if (startSessionBtn) {
      startSessionBtn.addEventListener('click', () => {
        this.start3ScenarioSession();
      });
    }

    const speechBtn = document.getElementById('speechSynthesisBtn');
    if (speechBtn) {
      if (!('speechSynthesis' in window)) {
        speechBtn.style.display = 'none';
      } else {
        speechBtn.addEventListener('click', () => {
          this.toggleSpeech();
        });
      }
    }
  },

  setConfidence: function(level) {
    this.selectedConfidence = level;
    for (let i = 1; i <= 3; i++) {
      const btn = document.getElementById(`confBtn${i}`);
      if (btn) {
        if (i === level) {
          btn.style.borderColor = 'var(--accent-cyan)';
          btn.style.background = 'rgba(6, 182, 212, 0.2)';
        } else {
          btn.style.borderColor = '';
          btn.style.background = '';
        }
      }
    }
  },

  toggleSpeech: function() {
    if (!('speechSynthesis' in window)) return;

    if (this.isSpeaking) {
      this.stopSpeech();
    } else {
      const msgBubble = document.getElementById('simMessageBubble');
      const textToSpeak = msgBubble ? msgBubble.innerText : '';
      if (!textToSpeak) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.onend = () => {
        this.isSpeaking = false;
        const btn = document.getElementById('speechSynthesisBtn');
        if (btn) btn.textContent = '🔊';
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        const btn = document.getElementById('speechSynthesisBtn');
        if (btn) btn.textContent = '🔊';
      };

      this.isSpeaking = true;
      const btn = document.getElementById('speechSynthesisBtn');
      if (btn) btn.textContent = '⏹️';
      window.speechSynthesis.speak(utterance);
    }
  },

  stopSpeech: function() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    const btn = document.getElementById('speechSynthesisBtn');
    if (btn) btn.textContent = '🔊';
  },

  start3ScenarioSession: function() {
    const userPersona = window.ConVerseState ? window.ConVerseState.currentPersona : 'student';
    const allScenarios = Object.values(window.ConVerseScenarios || {});
    
    // Pick 3 prioritized scenarios for user persona
    let sequence = [];
    if (window.ScenarioSelector && typeof window.ScenarioSelector.getPrioritizedScenarios === 'function') {
      const prioritized = window.ScenarioSelector.getPrioritizedScenarios(userPersona, allScenarios);
      sequence = prioritized.slice(0, 3).map(s => s.id);
    } else {
      sequence = ['S01', 'S03', 'S04'];
    }

    this.sessionMode = true;
    this.sessionScenarios = sequence;
    this.sessionIndex = 0;
    this.sessionResults = [];

    this.loadScenario(this.sessionScenarios[0]);
  },

  renderScenarioList: function() {
    clearInterval(this.timerInterval);
    this.stopSpeech();
    this.sessionMode = false;

    document.getElementById('scenarioSelectionView').style.display = 'block';
    document.getElementById('simulationActiveView').style.display = 'none';
    document.getElementById('simulationResultView').style.display = 'none';
    document.getElementById('sessionSummaryView').style.display = 'none';
    document.getElementById('scenarioPickerBtn').style.display = 'none';
    document.getElementById('sessionProgressBadge').style.display = 'none';

    const userPersona = window.ConVerseState ? window.ConVerseState.currentPersona : 'student';
    let scenarios = Object.values(window.ConVerseScenarios || {});

    // Adaptive Recommendation Render
    const recBanner = document.getElementById('adaptiveRecommendationBanner');
    if (recBanner && window.ScenarioSelector) {
      const history = JSON.parse(localStorage.getItem('converse_history') || '[]');
      const rec = window.ScenarioSelector.getAdaptiveRecommendation({ persona: userPersona, history }, scenarios);
      const recScenario = (window.ConVerseScenarios || {})[rec.nextScenarioId];

      if (recScenario) {
        recBanner.style.display = 'block';
        document.getElementById('recTitle').textContent = `${recScenario.id}: ${recScenario.title}`;
        document.getElementById('recReason').textContent = rec.reason;
        const diffBadge = document.getElementById('recTargetDiff');
        diffBadge.textContent = `Level ${rec.targetDifficulty}`;
        diffBadge.className = `difficulty-badge diff-${rec.targetDifficulty}`;
        
        const playRecBtn = document.getElementById('playRecommendedBtn');
        playRecBtn.onclick = () => {
          this.sessionMode = false;
          this.loadScenario(recScenario.id);
        };
      }
    }

    const grid = document.getElementById('scenarioListGrid');
    if (!grid) return;

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

    this.stopSpeech();
    document.getElementById('scenarioSelectionView').style.display = 'none';
    document.getElementById('simulationActiveView').style.display = 'block';
    document.getElementById('simulationResultView').style.display = 'none';
    document.getElementById('sessionSummaryView').style.display = 'none';
    document.getElementById('scenarioPickerBtn').style.display = 'inline-block';
    document.getElementById('feedbackDrawer').style.display = 'none';

    // Update Session Badge if in 3-Scenario mode
    const sessionBadge = document.getElementById('sessionProgressBadge');
    if (this.sessionMode) {
      sessionBadge.style.display = 'inline-block';
      sessionBadge.textContent = `Session: ${this.sessionIndex + 1}/3 (${scenarioId})`;
    } else {
      sessionBadge.style.display = 'none';
    }

    this.activeEngine = new window.ScenarioEngine();
    const startNode = this.activeEngine.startScenario(scenarioId);
    this.currentScenario = (window.ConVerseScenarios || {})[scenarioId];

    this.renderNode(startNode);
  },

  renderNode: function(node) {
    if (!node) return;

    this.nodeStartTime = Date.now();
    this.stopSpeech();

    // Reset feedback drawer
    document.getElementById('feedbackDrawer').style.display = 'none';

    // Channel & Sender rendering
    const channelBadge = document.getElementById('simChannelBadge');
    const avatar = document.getElementById('simAvatar');
    const senderName = document.getElementById('simSenderName');
    const contactSub = document.getElementById('simContactSub');
    const verifiedBadge = document.getElementById('simVerifiedBadge');

    channelBadge.textContent = (node.channel || 'sms').toUpperCase();
    if (node.sender) {
      avatar.textContent = node.sender.avatar || '👤';
      senderName.textContent = node.sender.name || 'Unknown Contact';
      contactSub.textContent = node.sender.handle || '';
      verifiedBadge.style.display = node.sender.verified ? 'inline' : 'none';
    } else {
      avatar.textContent = '📱';
      senderName.textContent = 'Notification Alert';
      contactSub.textContent = '';
      verifiedBadge.style.display = 'none';
    }

    // Message rendering with clickable Red-Flag highlights
    const msgBubble = document.getElementById('simMessageBubble');
    msgBubble.className = 'sim-message-bubble ' + (node.channel || 'sms');
    
    let renderedMessage = node.message;
    if (node.redFlags && node.redFlags.length > 0) {
      node.redFlags.forEach(rf => {
        const regex = new RegExp(`(${rf.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        renderedMessage = renderedMessage.replace(regex, `<span class="red-flag-span" role="button" tabindex="0" title="Inspect Red Flag" onclick="SimulatorPage.showRedFlagInfo('${rf.indicatorId}', '${rf.explanation.replace(/'/g, "\\'")}', '${rf.text.replace(/'/g, "\\'")}')" onkeydown="if(event.key==='Enter') SimulatorPage.showRedFlagInfo('${rf.indicatorId}', '${rf.explanation.replace(/'/g, "\\'")}', '${rf.text.replace(/'/g, "\\'")}')">$1</span>`);
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
    this.stopSpeech();
    if (!this.activeEngine) return;

    const ms = Date.now() - (this.nodeStartTime || Date.now());
    const outcome = this.activeEngine.choose(choiceId, { 
      ms, 
      confidence: this.selectedConfidence 
    });
    this.showFeedback(outcome.choice, outcome.nextNode, outcome.isComplete);
  },

  handleTimeout: function() {
    if (!this.activeEngine) return;
    this.stopSpeech();
    const outcome = this.activeEngine.handleTimeout();
    const fakeChoice = {
      good: false,
      consequence: 'Time expired! High urgency countdown created panic and caused a missed scam indicator.',
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

    // Indicator Tags
    tags.innerHTML = (choice.indicatorIds || []).map(tag => {
      const dim = tag.charAt(0).toLowerCase();
      const info = (window.ConVerseData && window.ConVerseData.INDICATOR_CATALOGUE) ? window.ConVerseData.INDICATOR_CATALOGUE[tag] : null;
      const label = info ? `${tag}: ${info.name}` : tag;
      return `<span class="indicator-tag-pill tag-${dim}">${label}</span>`;
    }).join('');

    // Rebind next button
    const newBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newBtn, nextBtn);

    if (isComplete) {
      newBtn.textContent = this.sessionMode && this.sessionIndex < 2 
        ? `Proceed to Next Scenario (${this.sessionIndex + 2}/3) &rarr;` 
        : 'View Final Simulation Report 🏆';
      
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
    this.stopSpeech();
    document.getElementById('simulationActiveView').style.display = 'none';

    const result = this.activeEngine.getResult();

    // Save individual scenario history
    const history = JSON.parse(localStorage.getItem('converse_history') || '[]');
    const record = {
      scenarioId: result.scenarioId,
      scorePercentage: result.scorePercentage,
      recognizedIndicators: result.recognizedIndicators || [],
      missedIndicators: result.missedIndicators || [],
      caught: result.caught,
      missed: result.missed,
      verdict: result.verdict,
      date: Date.now()
    };
    history.push(record);
    localStorage.setItem('converse_history', JSON.stringify(history));

    // Handle 3-Scenario Session Progress
    if (this.sessionMode) {
      this.sessionResults.push(result);
      if (this.sessionIndex < 2) {
        this.sessionIndex++;
        this.loadScenario(this.sessionScenarios[this.sessionIndex]);
        return;
      } else {
        // Complete 3-scenario session!
        this.showSessionSummary();
        return;
      }
    }

    // Single Scenario Result Card
    const resultView = document.getElementById('simulationResultView');
    resultView.style.display = 'block';

    const verdictClass = result.verdict === 'SAFE' ? 'verdict-safe' : result.verdict === 'VULNERABLE' ? 'verdict-vulnerable' : 'verdict-compromised';

    // Generate Personalized Recommendations from actual history
    let recommendations = [];
    if (window.AdaptiveEngine && typeof window.AdaptiveEngine.generatePersonalizedRecommendations === 'function') {
      recommendations = window.AdaptiveEngine.generatePersonalizedRecommendations(history, window.ConVerseState ? window.ConVerseState.currentPersona : 'student');
    }

    // Adaptive next recommendation
    let nextRecScenarioId = 'S01';
    if (window.ScenarioSelector) {
      const rec = window.ScenarioSelector.getAdaptiveRecommendation({
        persona: window.ConVerseState ? window.ConVerseState.currentPersona : 'student',
        history
      }, Object.values(window.ConVerseScenarios || {}));
      nextRecScenarioId = rec.nextScenarioId;
    }

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

        <!-- Consequence Timeline -->
        <div class="card" style="text-align: left; margin: 1.25rem 0; background: var(--bg-tertiary);">
          <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.5rem;">Decision Timeline & Audit Trail</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${(result.events || []).map((ev, i) => `
              <div style="display: flex; gap: 0.5rem; align-items: flex-start; font-size: 0.85rem;">
                <span style="font-family: var(--font-mono); color: var(--text-muted);">${i + 1}.</span>
                <span style="color: ${ev.good ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; font-weight: 700;">
                  ${ev.good ? '✓ Safe Action' : '✗ Risky Action'}
                </span>
                <span style="color: var(--text-secondary); margin-left: auto;">
                  ${ev.tags && ev.tags.length > 0 ? `[${ev.tags.join(', ')}]` : ''}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="takeaway-box">
          <div class="takeaway-title">💡 Key Scam Lesson</div>
          <p style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.5;">${result.takeaway}</p>
        </div>

        <!-- Personalized Recommendations -->
        ${recommendations.length > 0 ? `
          <div class="card" style="text-align: left; margin: 1.25rem 0; border-color: rgba(99, 102, 241, 0.4);">
            <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--accent-primary); margin-bottom: 0.5rem;">Personalized Safety Profile Advice</div>
            <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: #CBD5E1; line-height: 1.5;">
              ${recommendations.map(r => `<li style="margin-bottom: 0.35rem;">${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="result-action-row">
          <button class="next-step-btn" onclick="SimulatorPage.loadScenario('${nextRecScenarioId}')">
            🎯 Play Next Recommended (${nextRecScenarioId}) &rarr;
          </button>
          <button class="btn-secondary" onclick="SimulatorPage.loadScenario('${result.scenarioId}')">
            🔄 Replay This Scenario
          </button>
          <button class="btn-secondary" onclick="SimulatorPage.renderScenarioList()">
            📋 All Scenarios
          </button>
        </div>
      </div>
    `;
  },

  showSessionSummary: function() {
    document.getElementById('simulationActiveView').style.display = 'none';
    document.getElementById('simulationResultView').style.display = 'none';
    const sessionView = document.getElementById('sessionSummaryView');
    sessionView.style.display = 'block';

    const totalCaught = this.sessionResults.reduce((sum, r) => sum + r.caught, 0);
    const totalMissed = this.sessionResults.reduce((sum, r) => sum + r.missed, 0);
    const totalDecisions = totalCaught + totalMissed;
    const sessionScorePct = totalDecisions > 0 ? Math.round((totalCaught / totalDecisions) * 100) : 0;

    // Save 3-scenario session to converse_sessions
    const sessions = JSON.parse(localStorage.getItem('converse_sessions') || '[]');
    sessions.push({
      date: Date.now(),
      scenarios: this.sessionScenarios,
      scorePercentage: sessionScorePct,
      totalCaught,
      totalMissed
    });
    // Keep last 10 sessions
    localStorage.setItem('converse_sessions', JSON.stringify(sessions.slice(-10)));

    const verdict = sessionScorePct === 100 ? 'SAFE' : sessionScorePct >= 50 ? 'VULNERABLE' : 'COMPROMISED';
    const verdictClass = verdict === 'SAFE' ? 'verdict-safe' : verdict === 'VULNERABLE' ? 'verdict-vulnerable' : 'verdict-compromised';

    sessionView.innerHTML = `
      <div class="result-card">
        <span class="result-verdict-badge ${verdictClass}">
          ${verdict === 'SAFE' ? '🛡️ SESSION MASTERED: VIGILANT DEFENDER' : verdict === 'VULNERABLE' ? '⚠️ SESSION COMPLETE: PARTIALLY VULNERABLE' : '🚨 SESSION COMPLETE: ACTION REQUIRED'}
        </span>

        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.25rem;">3-Scenario Training Session Complete</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem;">Completed: ${this.sessionScenarios.join(', ')}</p>

        <div class="score-display">
          <span class="score-num">${sessionScorePct}</span>
          <span class="score-max">/100</span>
        </div>

        <div class="stat-grid">
          <div class="stat-box">
            <div class="stat-val caught">${totalCaught}</div>
            <div class="stat-label">Total Caught Flags</div>
          </div>
          <div class="stat-box">
            <div class="stat-val missed">${totalMissed}</div>
            <div class="stat-label">Total Traps Encountered</div>
          </div>
        </div>

        <!-- Per-scenario breakdown -->
        <div class="card" style="text-align: left; margin: 1.25rem 0; background: var(--bg-tertiary);">
          <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.5rem;">Session Scenario Breakdown</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${this.sessionResults.map(r => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm);">
                <span style="font-weight: 700; font-family: var(--font-mono); color: #F8FAFC;">${r.scenarioId}</span>
                <span style="font-family: var(--font-mono); font-weight: 700; color: ${r.scorePercentage >= 80 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${r.scorePercentage}% (${r.verdict})</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="result-action-row">
          <a href="#/test?type=post" class="next-step-btn" style="text-decoration: none;">
            📝 Take Post-Test Assessment &rarr;
          </a>
          <a href="#/progress" class="btn-secondary" style="text-decoration: none;">
            🏆 View Full Progress Dashboard
          </a>
          <button class="btn-secondary" onclick="SimulatorPage.renderScenarioList()">
            📋 Explore All Scenarios
          </button>
        </div>
      </div>
    `;
  },

  showRedFlagInfo: function(indicatorId, explanation, text) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    const info = (window.ConVerseData && window.ConVerseData.INDICATOR_CATALOGUE) ? window.ConVerseData.INDICATOR_CATALOGUE[indicatorId] : null;
    
    modal.innerHTML = `
      <div class="modal-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #EF4444; display: flex; align-items: center; gap: 0.4rem;">
            <span>🚩</span> Red Flag Detected
          </h3>
          <button class="icon-btn" onclick="this.closest('.modal-backdrop').remove()" style="min-width: 32px; min-height: 32px; width: 32px; height: 32px;" aria-label="Close modal">✕</button>
        </div>
        ${text ? `<div style="font-style: italic; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid #EF4444; color: #CBD5E1; font-size: 0.88rem;">"${text}"</div>` : ''}
        <p style="font-size: 0.95rem; color: #F8FAFC; margin-bottom: 0.75rem; line-height: 1.5;">${explanation}</p>
        <div style="font-size: 0.8rem; color: var(--text-secondary); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
          Indicator: <strong style="color: var(--accent-cyan);">${indicatorId} — ${info ? info.name : ''}</strong>
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
