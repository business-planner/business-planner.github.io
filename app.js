/**
 * BUSINESS PLANNER - Complete JavaScript Application
 * Handles all interactive features: tabs, business plan editor, SWOT analysis,
 * goals tracker, financial projections, break-even calculator, localStorage persistence,
 * header/footer injection, mobile navigation, animations, and more.
 */

// ========================
// GLOBAL STATE & STORAGE KEYS
// ========================
const STORAGE_KEYS = {
  BUSINESS_PLAN: 'biz_plan_data',
  SWOT: 'biz_swot_data',
  GOALS: 'biz_goals_data',
  FINANCIALS: 'biz_financials_data'
};

// Default data structures
let swotData = {
  strengths: ['Strong brand identity', 'Experienced founding team'],
  weaknesses: ['Limited initial capital', 'Small marketing budget'],
  opportunities: ['Growing market demand', 'New technology adoption'],
  threats: ['Established competitors', 'Economic uncertainty']
};

let goalsData = [
  { id: 'g1', title: 'Launch MVP', priority: 'high', progress: 65 },
  { id: 'g2', title: 'Reach 100 paying customers', priority: 'high', progress: 30 },
  { id: 'g3', title: 'Secure seed funding', priority: 'med', progress: 45 }
];

// ========================
// UTILITY FUNCTIONS
// ========================
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Save/Load Business Plan (textareas & inputs)
function saveBusinessPlanToLocal() {
  const planData = {
    bizName: document.getElementById('biz-name')?.value || '',
    bizMission: document.getElementById('biz-mission')?.value || '',
    bizValue: document.getElementById('biz-value')?.value || '',
    marketTarget: document.getElementById('mkt-target')?.value || '',
    marketProblem: document.getElementById('mkt-problem')?.value || '',
    productDesc: document.getElementById('prod-desc')?.value || '',
    productAdv: document.getElementById('prod-adv')?.value || '',
    revenueStreams: document.getElementById('rev-streams')?.value || '',
    revenuePricing: document.getElementById('rev-pricing')?.value || '',
    teamMembers: document.getElementById('team-members')?.value || '',
    teamOps: document.getElementById('team-ops')?.value || ''
  };
  localStorage.setItem(STORAGE_KEYS.BUSINESS_PLAN, JSON.stringify(planData));
  showToast('Business plan saved! ✓');
}

function loadBusinessPlanFromLocal() {
  const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS_PLAN);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (document.getElementById('biz-name')) document.getElementById('biz-name').value = data.bizName || '';
      if (document.getElementById('biz-mission')) document.getElementById('biz-mission').value = data.bizMission || '';
      if (document.getElementById('biz-value')) document.getElementById('biz-value').value = data.bizValue || '';
      if (document.getElementById('mkt-target')) document.getElementById('mkt-target').value = data.marketTarget || '';
      if (document.getElementById('mkt-problem')) document.getElementById('mkt-problem').value = data.marketProblem || '';
      if (document.getElementById('prod-desc')) document.getElementById('prod-desc').value = data.productDesc || '';
      if (document.getElementById('prod-adv')) document.getElementById('prod-adv').value = data.productAdv || '';
      if (document.getElementById('rev-streams')) document.getElementById('rev-streams').value = data.revenueStreams || '';
      if (document.getElementById('rev-pricing')) document.getElementById('rev-pricing').value = data.revenuePricing || '';
      if (document.getElementById('team-members')) document.getElementById('team-members').value = data.teamMembers || '';
      if (document.getElementById('team-ops')) document.getElementById('team-ops').value = data.teamOps || '';
    } catch(e) { console.warn(e); }
  }
}

// SWOT persistence
function saveSWOTToLocal() {
  localStorage.setItem(STORAGE_KEYS.SWOT, JSON.stringify(swotData));
}

function loadSWOTFromLocal() {
  const saved = localStorage.getItem(STORAGE_KEYS.SWOT);
  if (saved) {
    try {
      swotData = JSON.parse(saved);
    } catch(e) {}
  }
  renderSWOT();
}

// Goals persistence
function saveGoalsToLocal() {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goalsData));
}

function loadGoalsFromLocal() {
  const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
  if (saved) {
    try {
      goalsData = JSON.parse(saved);
    } catch(e) {}
  }
  renderGoals();
}

// Financials persistence (revenue/expense values)
function saveFinancialsToLocal() {
  const revenue = document.getElementById('fin-revenue')?.value || '0';
  const expenses = document.getElementById('fin-expenses')?.value || '0';
  localStorage.setItem(STORAGE_KEYS.FINANCIALS, JSON.stringify({ revenue, expenses }));
}

function loadFinancialsFromLocal() {
  const saved = localStorage.getItem(STORAGE_KEYS.FINANCIALS);
  if (saved) {
    try {
      const { revenue, expenses } = JSON.parse(saved);
      if (document.getElementById('fin-revenue')) document.getElementById('fin-revenue').value = revenue;
      if (document.getElementById('fin-expenses')) document.getElementById('fin-expenses').value = expenses;
      updateFinancials();
    } catch(e) {}
  } else {
    // Default demo values
    if (document.getElementById('fin-revenue')) document.getElementById('fin-revenue').value = '12500';
    if (document.getElementById('fin-expenses')) document.getElementById('fin-expenses').value = '8200';
    updateFinancials();
  }
}

// ========================
// SWOT DYNAMIC RENDERING
// ========================
function renderSWOT() {
  const container = document.getElementById('swot-grid');
  if (!container) return;
  
  const categories = [
    { key: 'strengths', label: 'STRENGTHS', class: 's', colorLabel: 'Internal / Positive' },
    { key: 'weaknesses', label: 'WEAKNESSES', class: 'w', colorLabel: 'Internal / Negative' },
    { key: 'opportunities', label: 'OPPORTUNITIES', class: 'o', colorLabel: 'External / Positive' },
    { key: 'threats', label: 'THREATS', class: 't', colorLabel: 'External / Negative' }
  ];
  
  container.innerHTML = categories.map(cat => `
    <div class="swot-box ${cat.class}">
      <div class="swot-label" style="display:flex; justify-content:space-between;">
        <span>${cat.label}</span>
        <small style="opacity:0.7; font-size:0.6rem;">${cat.colorLabel}</small>
      </div>
      <div class="swot-items" id="swot-items-${cat.key}">
        ${swotData[cat.key].map((item, idx) => `
          <div class="swot-item" data-category="${cat.key}" data-index="${idx}">
            <input type="text" value="${escapeHtml(item)}" onchange="updateSwotItem('${cat.key}', ${idx}, this.value)" />
            <span style="cursor:pointer; color:#ff9980;" onclick="removeSwotItem('${cat.key}', ${idx})">✕</span>
          </div>
        `).join('')}
      </div>
      <div class="swot-add" onclick="addSwotItem('${cat.key}')">
        <span>+ Add ${cat.label.slice(0,-1)}</span>
      </div>
    </div>
  `).join('');
}

window.updateSwotItem = function(category, index, newValue) {
  if (swotData[category] && swotData[category][index] !== undefined) {
    swotData[category][index] = newValue;
    saveSWOTToLocal();
    showToast('SWOT updated');
  }
};

window.removeSwotItem = function(category, index) {
  swotData[category].splice(index, 1);
  saveSWOTToLocal();
  renderSWOT();
};

window.addSwotItem = function(category) {
  swotData[category].push('New item');
  saveSWOTToLocal();
  renderSWOT();
};

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ========================
// GOALS RENDERING & MANAGEMENT
// ========================
function renderGoals() {
  const container = document.getElementById('goals-list');
  if (!container) return;
  
  if (goalsData.length === 0) {
    container.innerHTML = '<div style="background:rgba(255,255,255,0.07); padding:40px; text-align:center; border-radius:20px;">No goals yet. Add your first business goal above!</div>';
    return;
  }
  
  container.innerHTML = goalsData.map(goal => `
    <div class="goal-item" data-id="${goal.id}">
      <div class="goal-priority ${goal.priority}">${goal.priority === 'high' ? '!' : (goal.priority === 'med' ? '‼' : '·')}</div>
      <div class="goal-content">
        <div class="goal-title">${escapeHtml(goal.title)}</div>
        <div class="goal-progress-bar">
          <div class="goal-progress-fill" style="width: ${goal.progress}%; background: var(--gold);"></div>
        </div>
        <div class="goal-meta">
          <span>Progress: ${goal.progress}%</span>
          <span style="cursor:pointer; color:var(--gold-light);" onclick="adjustProgress('${goal.id}', -5)">−5%</span>
          <span style="cursor:pointer; color:var(--gold-light);" onclick="adjustProgress('${goal.id}', 5)">+5%</span>
          <span style="cursor:pointer; color:#ffaa88;" onclick="deleteGoal('${goal.id}')">Delete</span>
        </div>
      </div>
    </div>
  `).join('');
}

window.adjustProgress = function(goalId, delta) {
  const goal = goalsData.find(g => g.id === goalId);
  if (goal) {
    let newProgress = goal.progress + delta;
    newProgress = Math.min(100, Math.max(0, newProgress));
    goal.progress = newProgress;
    saveGoalsToLocal();
    renderGoals();
    showToast(`Goal progress updated to ${newProgress}%`);
  }
};

window.deleteGoal = function(goalId) {
  goalsData = goalsData.filter(g => g.id !== goalId);
  saveGoalsToLocal();
  renderGoals();
  showToast('Goal removed');
};

window.addGoal = function() {
  const input = document.getElementById('new-goal-input');
  if (!input || !input.value.trim()) {
    showToast('Please enter a goal description', 2000);
    return;
  }
  const newGoal = {
    id: Date.now().toString(),
    title: input.value.trim(),
    priority: 'med',
    progress: 0
  };
  goalsData.push(newGoal);
  saveGoalsToLocal();
  renderGoals();
  input.value = '';
  showToast('New goal added!');
};

// ========================
// FINANCIAL CHART & UPDATES
// ========================
function updateFinancials() {
  const revenueInput = document.getElementById('fin-revenue');
  const expenseInput = document.getElementById('fin-expenses');
  const profitSpan = document.getElementById('fin-profit');
  
  if (!revenueInput || !expenseInput) return;
  
  let revenue = parseFloat(revenueInput.value) || 0;
  let expenses = parseFloat(expenseInput.value) || 0;
  let profit = revenue - expenses;
  
  if (profitSpan) profitSpan.textContent = `$${profit.toLocaleString()}`;
  
  // Update chart with 6-month projection
  updateFinancialChart(revenue, expenses);
  saveFinancialsToLocal();
}

function updateFinancialChart(baseRevenue, baseExpense) {
  const chartContainer = document.getElementById('fin-chart-bars');
  if (!chartContainer) return;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // Assume monthly growth: revenue +3%, expenses +1.5% for dynamic projection
  let revValues = [];
  let expValues = [];
  let currentRev = baseRevenue;
  let currentExp = baseExpense;
  for (let i = 0; i < 6; i++) {
    revValues.push(currentRev);
    expValues.push(currentExp);
    currentRev = currentRev * 1.03;
    currentExp = currentExp * 1.015;
  }
  
  const maxVal = Math.max(...revValues, ...expValues) || 1;
  
  chartContainer.innerHTML = months.map((month, idx) => {
    const revHeight = (revValues[idx] / maxVal) * 100;
    const expHeight = (expValues[idx] / maxVal) * 100;
    return `
      <div class="chart-bar-wrap">
        <div class="chart-bar revenue" style="height: ${revHeight}%;"></div>
        <div class="chart-bar expense" style="height: ${expHeight}%;"></div>
        <div class="chart-month">${month}</div>
      </div>
    `;
  }).join('');
}

// ========================
// BREAK-EVEN & ROI CALCULATOR
// ========================
function runCalc() {
  const fixed = parseFloat(document.getElementById('c-fixed')?.value) || 0;
  const varCost = parseFloat(document.getElementById('c-variable')?.value) || 0;
  const price = parseFloat(document.getElementById('c-price')?.value) || 0;
  const units = parseFloat(document.getElementById('c-units')?.value) || 0;
  const investment = parseFloat(document.getElementById('c-invest')?.value) || 0;
  
  const contribution = price - varCost;
  let breakEven = (contribution > 0) ? (fixed / contribution) : Infinity;
  breakEven = (breakEven === Infinity || breakEven < 0) ? '∞' : Math.ceil(breakEven);
  
  const monthlyRevenue = price * units;
  const monthlyProfit = (price - varCost) * units - fixed;
  const annualProfit = monthlyProfit * 12;
  const roi = (investment > 0) ? (annualProfit / investment) * 100 : 0;
  
  const beElement = document.getElementById('res-breakeven');
  const profitElement = document.getElementById('res-profit');
  const revenueElement = document.getElementById('res-revenue');
  const roiElement = document.getElementById('res-roi');
  
  if (beElement) beElement.textContent = (breakEven === '∞') ? 'N/A' : breakEven;
  if (profitElement) profitElement.textContent = `$${monthlyProfit.toLocaleString()}`;
  if (revenueElement) revenueElement.textContent = `$${monthlyRevenue.toLocaleString()}`;
  if (roiElement) roiElement.textContent = `${roi.toFixed(1)}%`;
}

// ========================
// TAB SWITCHING
// ========================
function switchTab(tabId) {
  // Update tab buttons
  document.querySelectorAll('.app-tab').forEach(tab => tab.classList.remove('active'));
  const activeTabBtn = Array.from(document.querySelectorAll('.app-tab')).find(btn => btn.textContent.includes(tabId === 'plan' ? 'Business Plan' : 
    (tabId === 'swot' ? 'SWOT' : (tabId === 'goals' ? 'Goals' : 'Financials'))));
  if (activeTabBtn) activeTabBtn.classList.add('active');
  
  // Update panels
  document.querySelectorAll('.app-panel').forEach(panel => panel.classList.remove('active'));
  const panelMap = {
    plan: 'tab-plan',
    swot: 'tab-swot',
    goals: 'tab-goals',
    financial: 'tab-financial'
  };
  const activePanel = document.getElementById(panelMap[tabId]);
  if (activePanel) activePanel.classList.add('active');
  
  // Re-render dynamic content if needed
  if (tabId === 'swot') renderSWOT();
  if (tabId === 'goals') renderGoals();
  if (tabId === 'financial') updateFinancials();
}

// ========================
// SECTION EXPAND/COLLAPSE (Business Plan)
// ========================
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.toggle('expanded');
  }
}

// ========================
// FAQ ACCORDION
// ========================
function toggleFaq(element) {
  const faqItem = element.closest('.faq-item');
  if (faqItem) {
    faqItem.classList.toggle('open');
  }
}

// ========================
// HEADER & FOOTER INJECTION
// ========================
function buildHeader() {
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;
  headerEl.innerHTML = `
    <div class="header-inner">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <span>Business Planner</span>
      </div>
      <nav class="nav">
        <a href="#features">Features</a>
        <a href="#app">Planner Tool</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#calculator">Calculator</a>
        <a href="#market">Market Analysis</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div class="header-cta">
        <a href="#app" class="btn btn-primary" style="padding:10px 20px;">Start Planning</a>
        <a href="#app" class="btn-outline" style="padding:10px 20px;">Sign In</a>
      </div>
      <div class="hamburger" id="hamburgerBtn">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  // Hamburger toggle
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }
}

function buildFooter() {
  const footerEl = document.getElementById('site-footer');
  if (!footerEl) return;
  footerEl.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="logo" style="color:#fff; margin-bottom:16px;">
            <div class="logo-icon" style="background:var(--gold);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <span>Business Planner</span>
          </div>
          <p>The ultimate web application for business planning, financial projections, and strategic growth.</p>
        </div>
        <div class="footer-col"><h5>Product</h5><ul><li><a href="#features">Features</a></li><li><a href="#app">Planner Tool</a></li><li><a href="#calculator">Calculator</a></li><li><a href="#roadmap">Roadmap</a></li></ul></div>
        <div class="footer-col"><h5>Resources</h5><ul><li><a href="#">Help Center</a></li><li><a href="#">Templates</a></li><li><a href="#">Blog</a></li><li><a href="#">Community</a></li></ul></div>
        <div class="footer-col"><h5>Company</h5><ul><li><a href="#">About</a></li><li><a href="#">Press</a></li><li><a href="#">Contact</a></li><li><a href="#">Privacy</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <div class="footer-copy">© 2025 Business Planner — Plan, Launch, Grow.</div>
        <div class="footer-links"><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a></div>
      </div>
    </div>
  `;
}

// ========================
// READING PROGRESS & BACK TO TOP
// ========================
function initReadingProgress() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;
  window.addEventListener('scroll', () => {
    const winScroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
    
    // Back to top visibility
    const backTop = document.getElementById('backTop');
    if (backTop) {
      if (winScroll > 300) backTop.classList.add('visible');
      else backTop.classList.remove('visible');
    }
  });
}

// ========================
// SCROLL REVEAL ANIMATIONS
// ========================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => observer.observe(el));
}

// ========================
// HERO PROGRESS FILL ANIMATION
// ========================
function initHeroProgress() {
  const fillBars = document.querySelectorAll('.progress-fill');
  fillBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    if (width) {
      bar.style.width = width + '%';
    } else {
      const computedWidth = bar.style.width;
      if (!computedWidth) bar.style.width = '0%';
      setTimeout(() => {
        if (bar.getAttribute('data-width')) bar.style.width = bar.getAttribute('data-width') + '%';
      }, 200);
    }
  });
}

// ========================
// INITIAL LOAD: LOAD DATA, ATTACH GLOBAL LISTENERS
// ========================
document.addEventListener('DOMContentLoaded', () => {
  // Build UI structure
  buildHeader();
  buildFooter();
  
  // Load all persisted data
  loadBusinessPlanFromLocal();
  loadSWOTFromLocal();  // loads swotData and calls renderSWOT
  loadGoalsFromLocal();  // loads goalsData and calls renderGoals
  loadFinancialsFromLocal();
  
  // Setup event listeners for forms
  const savePlanBtn = document.querySelector('#tab-plan .btn-gold');
  if (savePlanBtn) savePlanBtn.onclick = saveBusinessPlanToLocal;
  
  // Input listeners for financials tab
  const revenueInput = document.getElementById('fin-revenue');
  const expenseInput = document.getElementById('fin-expenses');
  if (revenueInput) revenueInput.addEventListener('input', updateFinancials);
  if (expenseInput) expenseInput.addEventListener('input', updateFinancials);
  
  // Calculator inputs
  const calcInputs = ['c-fixed', 'c-variable', 'c-price', 'c-units', 'c-invest'];
  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', runCalc);
  });
  runCalc(); // initial calculation
  
  // Ensure all business plan sections can be expanded
  document.querySelectorAll('.plan-section').forEach(section => {
    if (!section.classList.contains('expanded')) {
      // start collapsed, toggle will work
    }
  });
  
  // Attach global functions for inline onclick references
  window.switchTab = switchTab;
  window.toggleSection = toggleSection;
  window.savePlan = saveBusinessPlanToLocal;
  window.updateFinancials = updateFinancials;
  window.runCalc = runCalc;
  window.toggleFaq = toggleFaq;
  window.addGoal = addGoal;
  
  // Additional helper for any dynamic forms
  initHeroProgress();
  initReadingProgress();
  initScrollReveal();
  
  // Make sure goal input works with enter key
  const goalInput = document.getElementById('new-goal-input');
  if (goalInput) {
    goalInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addGoal();
    });
  }
  
  // Re-run progress bars visuals for hero after small delay
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
      const w = bar.getAttribute('data-width');
      if (w) bar.style.width = w + '%';
    });
  }, 300);
  
  // Sync financial chart
  updateFinancials();
  console.log('Business Planner fully loaded — plan, launch & grow!');
});
