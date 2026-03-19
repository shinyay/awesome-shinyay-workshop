/* ============================================
   Public Workshop Hub — Interactive Features
   ============================================ */

const LANGUAGE_COLORS = {
  'Python': '#3572A5',
  'TypeScript': '#3178c6',
  'Shell': '#89e051',
  'Markdown/SDD': '#083fa1',
  'JavaScript': '#f1e05a'
};

let workshops = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {
  initTheme();
  initEventListeners();
  await loadWorkshops();
  renderWorkshops();
  renderPaths();
  animateStats();
  initScrollObservers();
}

// --- Theme ---
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme'))
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });
}

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// --- Events ---
function initEventListeners() {
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  const hamburger = document.getElementById('nav-hamburger');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      document.querySelector('.nav-links').classList.remove('open');
    });
  });

  const backToTop = document.getElementById('back-to-top');
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 600) {
          backToTop.hidden = false;
          requestAnimationFrame(() => backToTop.classList.add('show'));
        } else {
          backToTop.classList.remove('show');
          setTimeout(() => { if (!backToTop.classList.contains('show')) backToTop.hidden = true; }, 300);
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// --- Data ---
async function loadWorkshops() {
  try {
    const res = await fetch('data/featured.json');
    workshops = await res.json();
  } catch (e) {
    console.error('Failed to load workshops:', e);
    workshops = [];
  }
}

// --- Render Workshop Cards ---
function renderWorkshops() {
  const grid = document.getElementById('showcase-grid');
  grid.innerHTML = workshops.map(createCard).join('');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  grid.querySelectorAll('.workshop-card').forEach(card => observer.observe(card));
}

function createCard(w) {
  const langColor = LANGUAGE_COLORS[w.language] || '#8b949e';

  const badgesHTML = `
    <span class="badge badge-difficulty">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l.086.162a1.75 1.75 0 0 0 2.227.788l.17-.078c1.248-.567 2.66.515 2.427 1.86l-.03.175a1.75 1.75 0 0 0 1.186 1.89l.168.058c1.305.45 1.575 2.17.463 2.958l-.143.102a1.75 1.75 0 0 0-.539 2.144l.079.17c.567 1.248-.515 2.66-1.86 2.427l-.175-.03a1.75 1.75 0 0 0-1.89 1.186l-.058.168c-.45 1.305-2.17 1.575-2.958.463l-.102-.143a1.75 1.75 0 0 0-2.144-.539l-.17.079c-1.248.567-2.66-.515-2.427-1.86l.03-.175a1.75 1.75 0 0 0-1.186-1.89l-.168-.058c-1.305-.45-1.575-2.17-.463-2.958l.143-.102a1.75 1.75 0 0 0 .539-2.144l-.079-.17c-.567-1.248.515-2.66 1.86-2.427l.175.03a1.75 1.75 0 0 0 1.89-1.186l.058-.168ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
      ${esc(w.difficulty)}
    </span>
    <span class="badge">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/></svg>
      ${esc(w.duration)}
    </span>
    <span class="badge badge-lang">
      <span class="lang-dot" style="background:${langColor}"></span>
      ${esc(w.language)}
    </span>
    <span class="badge">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm1.5 1.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM5.25 6.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM5.25 9.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Z"/></svg>
      ${esc(w.chapters)}
    </span>
  `;

  const skillsHTML = w.key_skills.map(s => `<span class="skill-tag">${esc(s)}</span>`).join('');

  const highlightsHTML = w.highlights.map(h => `
    <li>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
      ${esc(h)}
    </li>
  `).join('');

  return `
    <article class="workshop-card" style="position:relative">
      <div class="workshop-card-accent" style="background: linear-gradient(90deg, ${w.accent}, ${w.accent}88)"></div>
      <div class="card-body">
        <div class="card-icon-title">
          <div class="card-icon">${w.icon}</div>
          <div class="card-titles">
            <h3 class="card-title">${esc(w.title)}</h3>
            <div class="card-subtitle">${esc(w.subtitle)}</div>
          </div>
        </div>
        <p class="card-description">${esc(w.description)}</p>
        <div class="card-badges">${badgesHTML}</div>
        <div class="card-skills">${skillsHTML}</div>
      </div>
      <div class="card-sidebar">
        <ul class="card-highlights">${highlightsHTML}</ul>
        <div class="card-actions">
          <a href="${esc(w.pages_url)}" target="_blank" rel="noopener" class="card-btn card-btn-primary">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"/></svg>
            Start Workshop
          </a>
          <a href="${esc(w.repo_url)}" target="_blank" rel="noopener" class="card-btn card-btn-secondary">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>
            View Source
          </a>
        </div>
      </div>
    </article>
  `;
}

// --- Learning Paths ---
function renderPaths() {
  const container = document.getElementById('paths-grid');
  const paths = [
    {
      icon: '⚡',
      title: 'Quick Start (1 hour)',
      desc: 'Get productive with Copilot CLI in under an hour. Perfect for your first hands-on experience.',
      workshops: [{ id: 'getting-started-with-copilot-cli-v0.0.411', label: 'Copilot CLI Workshop' }],
      duration: '~1 hour'
    },
    {
      icon: '🤖',
      title: 'Agentic Copilot (4 hours)',
      desc: 'Master autonomous agents: cloud-side execution, Mission Control, hybrid workflows, and the Agent Framework.',
      workshops: [
        { id: 'agentic-github-workshop', label: 'Agentic GitHub Workshop' },
        { id: 'getting-started-with-agent-framework', label: 'Agent Framework' }
      ],
      duration: '~4 hours'
    },
    {
      icon: '🏗️',
      title: 'Build & Extend (14 hours)',
      desc: 'Go deep: Specification-Driven Development + build your own Copilot Extension with the SDK.',
      workshops: [
        { id: 'getting-started-with-spec-kit-v0.3.0', label: 'Spec Kit (SDD)' },
        { id: 'getting-started-with-copilot-sdk-v0.1.32', label: 'Copilot SDK' }
      ],
      duration: '~14 hours'
    },
    {
      icon: '🏆',
      title: 'Complete Mastery (20+ hours)',
      desc: 'The full curriculum. Cover every aspect of GitHub Copilot from CLI basics to production agents.',
      workshops: [
        { id: 'getting-started-with-copilot-cli-v0.0.411', label: 'Copilot CLI' },
        { id: 'agentic-github-workshop', label: 'Agentic Workshop' },
        { id: 'getting-started-with-agent-framework', label: 'Agent Framework' },
        { id: 'getting-started-with-spec-kit-v0.3.0', label: 'Spec Kit' },
        { id: 'getting-started-with-copilot-sdk-v0.1.32', label: 'Copilot SDK' }
      ],
      duration: '20+ hours'
    }
  ];

  container.innerHTML = paths.map(p => {
    const linksHTML = p.workshops.map((w, i) => {
      const ws = workshops.find(x => x.id === w.id);
      const url = ws ? ws.pages_url : '#';
      return `<a href="${esc(url)}" target="_blank" rel="noopener" class="path-workshop-link">
        <span class="path-num">${i + 1}</span> ${esc(w.label)}
      </a>`;
    }).join('');

    return `
      <div class="path-card">
        <div class="path-icon">${p.icon}</div>
        <h3 class="path-title">${esc(p.title)}</h3>
        <p class="path-desc">${esc(p.desc)}</p>
        <div class="path-workshops">${linksHTML}</div>
        <div class="path-duration">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/></svg>
          ${esc(p.duration)}
        </div>
      </div>
    `;
  }).join('');
}

// --- Stats Animation ---
function animateStats() {
  const totalHours = 20;
  const totalSteps = workshops.reduce((sum, w) => sum + (w.total_steps || 0), 0);
  animate('stat-workshops', workshops.length);
  animate('stat-steps', totalSteps);
  animate('stat-hours', totalHours);
}

function animate(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  const duration = 1200;
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + (id === 'stat-hours' ? '+' : '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// --- Scroll Observers ---
function initScrollObservers() {
  // Cards already handled in renderWorkshops
}

// --- Utilities ---
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
