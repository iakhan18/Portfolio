/**
 * INTHIYAZ AHMAD — Portfolio Interactive Engine
 */

/**
 * Refactored for React compatibility. 
 * Called via initPortfolio() in main.jsx after markup is injected.
 */
export function initPortfolio() {
    initCursor();
    initMagneticElements();
    initBentoHoverGlows();
    initGridGlowTracker();
    initClock();
    initScrollEffects();
    initFadeInObserver();
    initCaseStudies();
    initToTopButton();
    initSystemTuner();
}

/* --------------------------------------------------------------------------
   1. CUSTOM CURSOR SYSTEM (LERP / SPRING MOVEMENT)
   -------------------------------------------------------------------------- */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  const cursorCircle = cursor.querySelector('.cursor-circle');

  // Position coordinates
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  // Linear interpolation (lerp) coefficient for smooth spring follow
  const lerpCoeff = 0.12;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Set immediate position for cursor wrapper (moves dot directly)
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth lerp loop for the outer cursor circle
  function updateCursorCircle() {
    ringX += (mouseX - ringX) * lerpCoeff;
    ringY += (mouseY - ringY) * lerpCoeff;

    // Translate the circle relative to the cursor parent
    const deltaX = ringX - mouseX;
    const deltaY = ringY - mouseY;

    if (cursorCircle) {
      cursorCircle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
    }

    requestAnimationFrame(updateCursorCircle);
  }
  updateCursorCircle();

  // Hover states
  const interactableElements = document.querySelectorAll('a, button, [data-magnetic], .project-card, .tuner-toggle, .color-opt, .text-opt');

  interactableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.classList.contains('project-card')) {
        cursor.classList.add('is-card');
      } else {
        cursor.classList.add('is-link');
      }
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-card');
      cursor.classList.remove('is-link');
    });
  });
}

/* --------------------------------------------------------------------------
   2. MAGNETIC INTERACTION (SMOOTH SPRING CTA EFFECT)
   -------------------------------------------------------------------------- */
function initMagneticElements() {
  const magneticItems = document.querySelectorAll('[data-magnetic]');

  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

      const inner = item.querySelector('span, svg');
      if (inner) {
        inner.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate(0px, 0px)';

      const inner = item.querySelector('span, svg');
      if (inner) {
        inner.style.transform = 'translate(0px, 0px)';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. BENTO GRID HOVER GLOWS (DYNAMIC CSS VARIABLES)
   -------------------------------------------------------------------------- */
function initBentoHoverGlows() {
  // HTML uses .bcard — match it
  const cards = document.querySelectorAll('.bcard');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;

      card.style.setProperty('--mouse-x', `${pctX}%`);
      card.style.setProperty('--mouse-y', `${pctY}%`);
    });
  });
}

/* --------------------------------------------------------------------------
   4. BACKGROUND GRID GLOW TRACKER
   -------------------------------------------------------------------------- */
function initGridGlowTracker() {
  // HTML uses id="bgGrid" — no separate glow element; skip gracefully
  const bgGrid = document.getElementById('bgGrid');
  if (!bgGrid) return;

  window.addEventListener('mousemove', (e) => {
    // Shift a soft radial highlight using a CSS custom property
    const pctX = (e.clientX / window.innerWidth) * 100;
    const pctY = (e.clientY / window.innerHeight) * 100;

    bgGrid.style.setProperty('--glow-x', `${pctX}%`);
    bgGrid.style.setProperty('--glow-y', `${pctY}%`);
  });
}

/* --------------------------------------------------------------------------
   5. LIVE CLOCK (LOCAL GMT+5:30 TIME)
   -------------------------------------------------------------------------- */
function initClock() {
  // HTML uses id="clock"
  const clockEl = document.getElementById('clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   6. SCROLL EFFECTS (HEADER SHRINK + ACTIVE NAV LINKS)
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  // HTML uses class="nav" (not "header")
  const nav = document.querySelector('.nav');
  // HTML nav links use class="nl"
  const navLinks = document.querySelectorAll('.nl');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (nav) {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Active section highlights in nav
    let currentActive = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initToTopButton() {
  // HTML uses id="toTopBtn"
  const toTopBtn = document.getElementById('toTopBtn');
  if (!toTopBtn) return;

  toTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   8. INTERSECTION OBSERVER FOR CONTENT FADE-INS
   -------------------------------------------------------------------------- */
function initFadeInObserver() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   9. CASE STUDIES & MODAL CONTROLLER
   -------------------------------------------------------------------------- */
const caseStudiesData = {
  // Keys match the data-project values on .pc-cta buttons in HTML
  'nexus': {
    title: 'Nexus OS: Spatial Operating System',
    tags: ['Spatial Design', 'OS Design', 'Gestural UI'],
    role: 'Lead Interaction Designer',
    timeline: '8 Months (2025)',
    client: 'Futuristic Research Co (Nexus Lab)',
    content: `
      <h3>The Challenge</h3>
      <p>Current augmented reality interfaces rely heavily on legacy desktop paradigms (flat windows, simple pointers) or require tiring gestures that trigger physical fatigue. Our goal was to design an operating system for smart glasses that is lightweight, intuitive, and operates seamlessly through eye tracking and micro-gestures.</p>

      <h3>Design Philosophy</h3>
      <p>We designed the system under a strict rule: <strong>zero friction</strong>. Windows float based on visual depth cues, layout sizes container-query dynamically according to physical obstacles, and actions execute using micro-hand movements that can be done comfortably with your hand resting by your side.</p>

      <div class="metrics">
        <div class="metric">
          <div class="metric-n">35%</div>
          <div class="metric-l">Reduction in Cognitive Load</div>
        </div>
        <div class="metric">
          <div class="metric-n">22ms</div>
          <div class="metric-l">Average Action Execution Speed</div>
        </div>
      </div>

      <h3>The Outcome</h3>
      <p>A completely spatial workspace featuring eye-gaze selections, context-aware cards that render automatically based on coordinates, and a layout system that allows designers to easily deploy complex modules onto spatial canvases.</p>
    `
  },
  'aether': {
    title: 'Aether Finance: Flow Visualization',
    tags: ['Financial Tech', 'Data Systems', '3D Graphs'],
    role: 'Senior Product Designer',
    timeline: '6 Months (2024)',
    client: 'Aether Corp',
    content: `
      <h3>The Challenge</h3>
      <p>High-frequency cryptocurrency and multi-chain visualizers display an overwhelming amount of raw telemetry. Traders lose critical seconds parsing numbers on charts. Aether needed an interface to visualize complex real-time transactions as organic, three-dimensional fluid flows.</p>

      <h3>Design System Approach</h3>
      <p>We replaced rigid spreadsheet tables with interactive canvas visualizers. Node connections pulse based on transaction volume, and colors drift between cyber-orange and deep neon-purple to signal volatility thresholds. Using custom vector math, we mapped multidimensional coordinates onto a clean dashboard framework.</p>

      <div class="metrics">
        <div class="metric">
          <div class="metric-n">$4.2M</div>
          <div class="metric-l">Average Daily Flow Monitored</div>
        </div>
        <div class="metric">
          <div class="metric-n">98.4%</div>
          <div class="metric-l">User CSAT on Telemetry Interface</div>
        </div>
      </div>

      <h3>The Outcome</h3>
      <p>The resulting design won premium design accolades for balancing complex data structures with stunning visual harmony, lowering trading error rates by over 14% across core beta groups.</p>
    `
  },
  'helios': {
    title: 'Helios AI: Agent Orchestrator',
    tags: ['AI Systems', 'Canvas Interfaces', 'Flow Logic'],
    role: 'Lead Product Designer',
    timeline: '12 Months (2024)',
    client: 'Atlassian & Helios OpenSource',
    content: `
      <h3>The Challenge</h3>
      <p>Developing agentic workflows (where multiple LLMs collaborate to solve a task) is currently done in raw code or terminal pipelines. Developers lack visibility into where prompts fail, where loops get stuck, or how context is shared across agent chains.</p>

      <h3>Our Solution</h3>
      <p>We built a visual node-canvas editor that renders complex multi-agent execution flows. Each node is a visual block containing custom prompts, memory variables, and diagnostic inputs. Developers can inspect tokens, edit agent instructions mid-run, and drag-and-drop connectors to loop outputs.</p>

      <div class="metrics">
        <div class="metric">
          <div class="metric-n">3.5x</div>
          <div class="metric-l">Faster Debugging Speeds</div>
        </div>
        <div class="metric">
          <div class="metric-n">45%</div>
          <div class="metric-l">Year-over-Year Growth in Adoption</div>
        </div>
      </div>

      <h3>Key Features</h3>
      <p>Includes hot-reloading execution logs, visual telemetry nodes mapping API costs, and native design components built securely with strict layout guidelines.</p>
    `
  }
};

function initCaseStudies() {
  // HTML uses id="modal", id="modalClose", id="modalBody", class="modal-overlay"
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalClose');
  const overlay = modal ? modal.querySelector('.modal-overlay') : null;

  if (!modal || !modalBody || !closeBtn) return;

  function openModal(projectId) {
    const data = caseStudiesData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="mb-tags">
        ${data.tags.map(t => `<span class="mb-tag">${t}</span>`).join('')}
      </div>
      <h2 class="mb-title">${data.title}</h2>
      <div class="mb-meta">
        <div class="mb-meta-item">
          <span class="mb-meta-label">ROLE</span>
          <span class="mb-meta-val">${data.role}</span>
        </div>
        <div class="mb-meta-item">
          <span class="mb-meta-label">TIMELINE</span>
          <span class="mb-meta-val">${data.timeline}</span>
        </div>
        <div class="mb-meta-item">
          <span class="mb-meta-label">CLIENT</span>
          <span class="mb-meta-val">${data.client}</span>
        </div>
      </div>
      <hr class="mb-divider">
      <div class="mb-content">
        ${data.content}
      </div>
    `;

    // CSS uses class "open" to show modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Re-apply cursor hover for modal elements
    const cursor = document.getElementById('cursor');
    if (cursor) {
      modal.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-link'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-link'));
      });
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';

    const cursor = document.getElementById('cursor');
    if (cursor) {
      cursor.classList.remove('is-card', 'is-link');
    }
  }

  // "Read Case Study" buttons carry data-project; open the modal on click
  document.querySelectorAll('.pc-cta[data-project]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click bubbling if any
      openModal(btn.dataset.project);
    });
  });

  // Also allow clicking the whole project card
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      // Find the button inside this card
      const btn = card.querySelector('.pc-cta[data-project]');
      if (btn) openModal(btn.dataset.project);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   10. SYSTEM TUNER (THEME & GRID CONTROL)
   -------------------------------------------------------------------------- */
function initSystemTuner() {
  const toggle = document.querySelector('.tuner-toggle');
  const panel = document.querySelector('.tuner-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('active');
  });

  // Color theme buttons
  const colorBtns = document.querySelectorAll('.color-opt');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color || 'indigo';
      document.body.classList.remove('theme-indigo', 'theme-emerald', 'theme-tangerine');
      document.body.classList.add(`theme-${color}`);
      
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Grid density buttons
  const gridBtns = document.querySelectorAll('.text-opt[data-grid]');
  const bgGrid = document.getElementById('bgGrid');
  gridBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const density = btn.dataset.grid;
      if (bgGrid) {
        bgGrid.classList.remove('grid-dense', 'grid-sparse', 'grid-none');
        bgGrid.classList.add(`grid-${density}`);
      }
      gridBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Close panel on escape or clicking outside
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') panel.classList.remove('active');
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('active');
    }
  });
}
