/**
 * ConVerse — Pre-Test & Post-Test Interactive Assessment Page (test.js)
 * Problem Statement: PS-10 Financial Scam Simulator & Awareness Engine
 * Author: Rucha
 */

const TestPage = {
  testType: 'pre', // 'pre' | 'post'
  questions: [],
  userAnswers: {},
  submitted: false,
  result: null,

  render: function(container, params) {
    this.testType = (params && params.get('type')) === 'post' ? 'post' : 'pre';
    this.submitted = false;
    this.userAnswers = {};
    this.result = null;

    const testPool = window.TestPool;
    if (!testPool) {
      container.innerHTML = `<div class="card"><p style="color: var(--accent-rose);">Assessment pool not loaded.</p></div>`;
      return;
    }

    this.questions = this.testType === 'post' 
      ? testPool.getPostTestQuestions() 
      : testPool.getPreTestQuestions();

    const isPost = this.testType === 'post';
    const title = isPost ? '🎯 Post-Training Awareness Assessment' : '📝 Baseline Pre-Test Assessment';
    const subtitle = isPost 
      ? 'Evaluate your scam detection skills after completing simulations.' 
      : 'Establish your baseline awareness across all 6 financial fraud dimensions before simulations.';

    container.innerHTML = `
      <div class="test-view">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h1 class="section-title">${title}</h1>
            <p class="section-desc">${subtitle}</p>
          </div>
          <div class="badge-tag" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
            6 Questions (1 per Dimension)
          </div>
        </div>

        <div id="testQuestionsContainer" style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${this.questions.map((q, idx) => `
            <div class="card" id="card-q-${idx}" style="border-left: 4px solid var(--indicator-${q.dimension ? q.dimension.charAt(0) : 'u'});">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan);">Question ${idx + 1} of 6</span>
                <span class="indicator-tag-pill tag-${q.dimension ? q.dimension.charAt(0) : 'u'}">${q.dimension.toUpperCase()} [${q.indicatorId || ''}]</span>
              </div>
              <p style="font-size: 0.95rem; font-weight: 600; color: #F8FAFC; margin-bottom: 1rem; line-height: 1.5;">${q.question}</p>
              
              <div class="test-options-list" style="display: flex; flex-direction: column; gap: 0.6rem;">
                ${q.options.map((opt, optIdx) => `
                  <button type="button" 
                          class="choice-btn test-opt-btn" 
                          id="btn-q-${idx}-opt-${optIdx}"
                          onclick="TestPage.selectOption(${idx}, ${optIdx})"
                          style="text-align: left; justify-content: flex-start; gap: 0.75rem;">
                    <span style="font-family: var(--font-mono); font-weight: 700; width: 24px; height: 24px; border-radius: 50%; background: var(--bg-tertiary); display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0;">
                      ${String.fromCharCode(65 + optIdx)}
                    </span>
                    <span style="font-size: 0.88rem; flex: 1;">${opt}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Explanation drawer (revealed only after submission) -->
              <div id="explanation-q-${idx}" class="test-explanation-box" style="display: none; margin-top: 1rem; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; line-height: 1.4;">
              </div>
            </div>
          `).join('')}
        </div>

        <div id="testSubmitCard" class="card" style="margin-top: 1.5rem; text-align: center;">
          <button id="submitTestBtn" class="next-step-btn" onclick="TestPage.submitTest()" style="max-width: 320px; margin: 0 auto;">
            Submit Assessment & View Score 🏆
          </button>
        </div>

        <div id="testResultReport" style="display: none; margin-top: 1.5rem;">
          <!-- Populated after submit -->
        </div>
      </div>
    `;
  },

  selectOption: function(questionIdx, optionIdx) {
    if (this.submitted) return;
    this.userAnswers[questionIdx] = optionIdx;

    // Update UI active state
    const totalOptions = this.questions[questionIdx].options.length;
    for (let i = 0; i < totalOptions; i++) {
      const btn = document.getElementById(`btn-q-${questionIdx}-opt-${i}`);
      if (btn) {
        if (i === optionIdx) {
          btn.style.borderColor = 'var(--accent-cyan)';
          btn.style.background = 'rgba(6, 182, 212, 0.18)';
        } else {
          btn.style.borderColor = '';
          btn.style.background = '';
        }
      }
    }
  },

  submitTest: function() {
    const answeredCount = Object.keys(this.userAnswers).length;
    if (answeredCount < this.questions.length) {
      const confirmSubmit = confirm(`You have answered ${answeredCount} of 6 questions. Unanswered questions will be scored as incorrect. Do you want to submit?`);
      if (!confirmSubmit) return;
    }

    this.submitted = true;
    const answersArray = this.questions.map((_, idx) => this.userAnswers[idx] !== undefined ? this.userAnswers[idx] : -1);
    
    this.result = window.TestPool.evaluateTest(answersArray, this.questions);

    // Save to localStorage
    const storageKey = this.testType === 'post' ? 'converse_post_test' : 'converse_pre_test';
    localStorage.setItem(storageKey, JSON.stringify(this.result));

    // Reveal options and explanations
    this.questions.forEach((q, idx) => {
      const userChoice = this.userAnswers[idx];
      const isCorrect = userChoice === q.correctIndex;
      const card = document.getElementById(`card-q-${idx}`);
      const explBox = document.getElementById(`explanation-q-${idx}`);

      if (card) {
        card.style.borderLeftColor = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
      }

      q.options.forEach((_, optIdx) => {
        const btn = document.getElementById(`btn-q-${idx}-opt-${optIdx}`);
        if (!btn) return;
        btn.disabled = true;
        btn.style.cursor = 'default';

        if (optIdx === q.correctIndex) {
          btn.style.borderColor = 'var(--accent-emerald)';
          btn.style.background = 'rgba(16, 185, 129, 0.2)';
          btn.innerHTML += ` <span style="color: var(--accent-emerald); font-weight: 700; margin-left: auto;">✓ Correct</span>`;
        } else if (optIdx === userChoice && !isCorrect) {
          btn.style.borderColor = 'var(--accent-rose)';
          btn.style.background = 'rgba(244, 63, 94, 0.2)';
          btn.innerHTML += ` <span style="color: var(--accent-rose); font-weight: 700; margin-left: auto;">✗ Your Choice</span>`;
        }
      });

      if (explBox) {
        explBox.style.display = 'block';
        explBox.style.background = isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)';
        explBox.style.border = isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)';
        explBox.innerHTML = `
          <div style="font-weight: 700; color: ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom: 0.25rem;">
            ${isCorrect ? '🛡️ Correctly Identified' : '⚠️ Incorrect Decision'}
          </div>
          <div style="color: #CBD5E1;">${q.explanation}</div>
        `;
      }
    });

    document.getElementById('testSubmitCard').style.display = 'none';
    this.renderResultReport();
  },

  renderResultReport: function() {
    const reportContainer = document.getElementById('testResultReport');
    if (!reportContainer || !this.result) return;
    reportContainer.style.display = 'block';

    const isPost = this.testType === 'post';
    const preData = JSON.parse(localStorage.getItem('converse_pre_test') || 'null');
    let improvementHtml = '';

    if (isPost && preData) {
      const imp = window.TestPool.calculateImprovement(preData.scorePercentage, this.result.scorePercentage);
      improvementHtml = `
        <div class="card" style="border-color: var(--accent-cyan); background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.1)); margin-bottom: 1.25rem;">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--accent-cyan);">📈 Verified Learning Improvement</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; text-align: center;">
            <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Pre-Test Baseline</div>
              <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: #CBD5E1;">${preData.scorePercentage}%</div>
            </div>
            <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Post-Test Score</div>
              <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-cyan);">${this.result.scorePercentage}%</div>
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

    reportContainer.innerHTML = `
      <div class="result-card">
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.25rem;">
          ${isPost ? 'Post-Test Assessment Complete' : 'Pre-Test Baseline Established'}
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          You scored ${this.result.correctCount} out of ${this.result.total} questions correctly.
        </p>

        <div class="score-display">
          <span class="score-num">${this.result.scorePercentage}</span>
          <span class="score-max">/100</span>
        </div>

        ${improvementHtml}

        <div class="result-action-row" style="margin-top: 1.5rem;">
          <a href="#/simulator" class="next-step-btn" style="text-decoration: none;">
            🎮 Go to Scam Simulator &rarr;
          </a>
          <a href="#/progress" class="btn-secondary" style="text-decoration: none;">
            🏆 View Full Progress Dashboard
          </a>
        </div>
      </div>
    `;

    reportContainer.scrollIntoView({ behavior: 'smooth' });
  }
};

if (typeof window !== 'undefined') {
  window.TestPage = TestPage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestPage };
}
