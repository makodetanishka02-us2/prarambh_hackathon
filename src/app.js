/**
 * ConVerse — Application Root & Client State Router
 */

window.ConVerseState = {
  currentPersona: localStorage.getItem('converse_persona') || 'student',
  theme: localStorage.getItem('converse_theme') || 'dark',
  activeScenarioId: null
};

const App = {
  routes: {
    'dashboard': window.DashboardPage,
    'simulator': window.SimulatorPage,
    'radar': window.RadarPage,
    'tips': window.TipsPage,
    'progress': window.ProgressPage
  },

  init: function() {
    this.bindEvents();
    this.updatePersonaBadge();
    this.handleRouting();
    window.addEventListener('hashchange', () => this.handleRouting());
  },

  bindEvents: function() {
    const personaBadge = document.getElementById('currentPersonaDisplay');
    if (personaBadge) {
      personaBadge.addEventListener('click', () => this.showPersonaModal());
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }
  },

  updatePersonaBadge: function() {
    const personaDisplay = document.getElementById('currentPersonaDisplay');
    if (!personaDisplay) return;

    const personas = (window.ConVerseData && window.ConVerseData.PERSONAS) || {};
    const current = personas[window.ConVerseState.currentPersona] || { name: 'Student', avatar: '🎓' };
    
    personaDisplay.innerHTML = `
      <span class="persona-icon">${current.avatar}</span>
      <span class="persona-name">${current.name}</span>
    `;
  },

  showPersonaModal: function() {
    const personas = (window.ConVerseData && window.ConVerseData.PERSONAS) || {};
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'personaPickerModal';
    modal.innerHTML = `
      <div class="modal-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700;">Select Your Profile</h2>
          <button id="closePersonaModal" class="icon-btn" style="min-width: 32px; min-height: 32px; width: 32px; height: 32px;">✕</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">Simulations and scam awareness are customized to your profile's most common fraud threats.</p>
        
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${Object.values(personas).map(p => `
            <div class="choice-btn ${window.ConVerseState.currentPersona === p.id ? 'active' : ''}" 
                 style="cursor: pointer; ${window.ConVerseState.currentPersona === p.id ? 'border-color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15);' : ''}" 
                 onclick="App.selectPersona('${p.id}')">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.4rem;">${p.avatar}</span>
                <div>
                  <div style="font-weight: 700; color: #F8FAFC;">${p.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">${p.description}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closePersonaModal').addEventListener('click', () => {
      modal.remove();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  selectPersona: function(personaId) {
    window.ConVerseState.currentPersona = personaId;
    localStorage.setItem('converse_persona', personaId);
    this.updatePersonaBadge();
    const modal = document.getElementById('personaPickerModal');
    if (modal) modal.remove();
    this.handleRouting();
  },

  toggleTheme: function() {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      window.ConVerseState.theme = 'light';
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      window.ConVerseState.theme = 'dark';
    }
    localStorage.setItem('converse_theme', window.ConVerseState.theme);
  },

  handleRouting: function() {
    const hash = window.location.hash.slice(1) || '/dashboard';
    const [path, queryString] = hash.split('?');
    const cleanRoute = path.replace(/^\//, '') || 'dashboard';

    // Update bottom nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-page') === cleanRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const pageModule = this.routes[cleanRoute] || window.DashboardPage;
    const container = document.getElementById('pageContainer');
    if (container && pageModule && typeof pageModule.render === 'function') {
      const params = new URLSearchParams(queryString || '');
      pageModule.render(container, params);
      window.scrollTo(0, 0);
    }
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
