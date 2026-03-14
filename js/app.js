/* ============================================
   Shinyay Workshop Hub — Interactive Features
   ============================================ */

const CATEGORY_LABELS = {
  'copilot-ai': 'Copilot & AI',
  'legacy-modernization': 'Legacy Mod',
  'github-platform': 'GitHub',
  'ai-ml': 'AI & ML',
  'cloud-infra': 'Cloud',
  'spring-java': 'Spring/Java',
  'devops-containers': 'DevOps'
};

// GitHub language colors (subset)
const LANGUAGE_COLORS = {
  'Python': '#3572A5',
  'Java': '#b07219',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Kotlin': '#A97BFF',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'SCSS': '#c6538c',
  'COBOL': '#002aff',
  'Go': '#00ADD8',
  'Ruby': '#701516',
  'Dockerfile': '#384d54',
  'Zig': '#ec915c'
};

let workshops = [];
let activeCategory = 'all';
let searchQuery = '';
let sortBy = 'date-desc';
let cardObserver = null;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', init);

async function init() {
  initTheme();
  initEventListeners();
  await loadWorkshops();
  renderWorkshops();
  renderTechBreakdown();
  animateStats();
  initScrollObservers();
}

// --- Theme Management ---
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// --- Event Listeners ---
function initEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Search
  const searchInput = document.getElementById('search-input');
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderWorkshops();
    }, 200);
  });

  // Category pills
  document.getElementById('category-pills').addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.category;
    renderWorkshops();
  });

  // Sort
  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderWorkshops();
  });

  // Hamburger menu
  const hamburger = document.getElementById('nav-hamburger');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      document.querySelector('.nav-links').classList.remove('open');
    });
  });

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Show/hide back-to-top on scroll
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 600) {
          backToTop.hidden = false;
          requestAnimationFrame(() => backToTop.classList.add('show'));
        } else {
          backToTop.classList.remove('show');
          setTimeout(() => { if (!backToTop.classList.contains('show')) backToTop.hidden = true; }, 300);
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
}

// --- Data Loading ---
async function loadWorkshops() {
  try {
    const response = await fetch('data/workshops.json');
    workshops = await response.json();
  } catch (error) {
    console.error('Failed to load workshops:', error);
    workshops = [];
  }
}

// --- Filtering & Sorting ---
function getFilteredWorkshops() {
  let filtered = [...workshops];

  // Category filter
  if (activeCategory !== 'all') {
    filtered = filtered.filter(w => w.category === activeCategory);
  }

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(w => {
      const searchable = [
        w.name,
        w.description,
        w.language,
        w.category,
        ...(w.topics || [])
      ].filter(Boolean).join(' ').toLowerCase();
      return searchQuery.split(/\s+/).every(term => searchable.includes(term));
    });
  }

  // Sort
  const [field, direction] = sortBy.split('-');
  filtered.sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'date':
        cmp = new Date(a.updated_at) - new Date(b.updated_at);
        break;
      case 'stars':
        cmp = a.stargazers_count - b.stargazers_count;
        break;
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
    }
    return direction === 'desc' ? -cmp : cmp;
  });

  return filtered;
}

// --- Rendering ---
function renderWorkshops() {
  const grid = document.getElementById('workshops-grid');
  const emptyState = document.getElementById('empty-state');
  const searchCount = document.getElementById('search-count');
  const filtered = getFilteredWorkshops();

  // Update search count
  if (searchQuery || activeCategory !== 'all') {
    searchCount.textContent = `${filtered.length} of ${workshops.length}`;
  } else {
    searchCount.textContent = '';
  }

  // Toggle empty state
  emptyState.hidden = filtered.length > 0;
  grid.style.display = filtered.length > 0 ? 'grid' : 'none';

  // Render cards
  grid.innerHTML = filtered.map(workshop => createCard(workshop)).join('');

  // Observe new cards for entrance animation
  if (cardObserver) cardObserver.disconnect();
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  grid.querySelectorAll('.workshop-card').forEach(card => {
    cardObserver.observe(card);
  });
}

function createCard(w) {
  const categoryLabel = CATEGORY_LABELS[w.category] || w.category;
  const langColor = w.language ? (LANGUAGE_COLORS[w.language] || '#8b949e') : null;
  const date = new Date(w.updated_at);
  const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  const topicsHTML = (w.topics || []).slice(0, 3).map(t =>
    `<span class="card-tag">${escapeHtml(t)}</span>`
  ).join('');

  const starsHTML = w.stargazers_count > 0
    ? `<span class="card-stars">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
        ${w.stargazers_count}
       </span>`
    : '';

  const languageHTML = w.language
    ? `<span class="card-language">
        <span class="language-dot" style="background:${langColor}"></span>
        ${escapeHtml(w.language)}
       </span>`
    : '<span class="card-language"></span>';

  return `
    <article class="workshop-card" data-category="${escapeAttr(w.category)}">
      <div class="card-header">
        <span class="card-category" data-category="${escapeAttr(w.category)}">
          ${escapeHtml(categoryLabel)}
        </span>
        ${starsHTML}
      </div>
      <h3 class="card-title">
        <a href="${escapeAttr(w.html_url)}" target="_blank" rel="noopener">${escapeHtml(formatName(w.name))}</a>
      </h3>
      <p class="card-description">${escapeHtml(w.description || '')}</p>
      <div class="card-tags">${topicsHTML}</div>
      <div class="card-footer">
        ${languageHTML}
        <span class="card-date">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2H13.25a1.75 1.75 0 0 1 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75A1.75 1.75 0 0 1 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z"/></svg>
          ${dateStr}
        </span>
        <a href="${escapeAttr(w.html_url)}" target="_blank" rel="noopener" class="card-link">
          View
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"/></svg>
        </a>
      </div>
    </article>
  `;
}

// --- Technology Breakdown ---
function renderTechBreakdown() {
  const container = document.getElementById('tech-bars');
  const langCounts = {};

  workshops.forEach(w => {
    if (w.language) {
      langCounts[w.language] = (langCounts[w.language] || 0) + 1;
    }
  });

  const sorted = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

  container.innerHTML = sorted.map(([lang, count]) => {
    const color = LANGUAGE_COLORS[lang] || '#8b949e';
    const width = Math.max((count / maxCount) * 100, 3);
    return `
      <div class="tech-bar-item">
        <span class="tech-bar-name">${escapeHtml(lang)}</span>
        <div class="tech-bar-track">
          <div class="tech-bar-fill" style="width:${width}%;background:${color}"></div>
        </div>
        <span class="tech-bar-count">${count}</span>
      </div>
    `;
  }).join('');
}

// --- Stats Animation ---
function animateStats() {
  const languages = new Set(workshops.map(w => w.language).filter(Boolean));
  animateCounter('stat-workshops', workshops.length);
  animateCounter('stat-categories', 7);
  animateCounter('stat-languages', languages.size);
}

function animateCounter(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// --- Scroll Observers ---
function initScrollObservers() {
  // Animate tech bars on scroll
  const techBars = document.querySelectorAll('.tech-bar-fill');
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetWidth = el.style.width;
        el.style.width = '0%';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.width = targetWidth;
          });
        });
        techObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  techBars.forEach(bar => techObserver.observe(bar));
}

// --- Utilities ---
function formatName(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b(gs|jp|ws)\b/gi, (m) => m.toUpperCase())
    .replace(/\d{6}/g, '') // Remove date suffixes like 260224
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
