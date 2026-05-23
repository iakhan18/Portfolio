/**
 * INTHIYAZ AHMAD — Portfolio Interactive Engine
 */

let clockInterval;
let cursorRaf;
let scrollHandler;
let mouseHandler;
let gridHandler;
let escapeHandler;
let revealObserver;

export function initPortfolio() {
  // Perform cleanup of any existing listeners before re-initializing
  const cleanup = () => {
    if (clockInterval) clearInterval(clockInterval);
    if (cursorRaf) cancelAnimationFrame(cursorRaf);
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    if (mouseHandler) window.removeEventListener('mousemove', mouseHandler);
    if (gridHandler) window.removeEventListener('mousemove', gridHandler);
    if (escapeHandler) window.removeEventListener('keydown', escapeHandler);
    if (revealObserver) revealObserver.disconnect();
  };

  cleanup();

  initCursor(); // Sets mouseHandler and cursorRaf
  initMagneticElements();
  initBentoHoverGlows();
  initGridGlowTracker(); // Sets gridHandler
  initClock(); // Sets clockInterval
  initScrollEffects(); // Sets scrollHandler
  initFadeInObserver(); // Sets revealObserver
  initCaseStudies(); // Sets escapeHandler
  initToTopButton();
  initPageLoader();
  initScrollProgress();
  initCounterAnimation();
  initCardTilt();
  initParallax();
  initSplitTextReveal();
  initSmoothHoverScale();

  return cleanup;
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
  mouseHandler = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Set immediate position for cursor wrapper (moves dot directly)
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  };
  window.addEventListener('mousemove', mouseHandler);

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

    cursorRaf = requestAnimationFrame(updateCursorCircle);
  }
  updateCursorCircle();

  // Hover states
  const interactableElements = document.querySelectorAll('a, button, [data-magnetic], .project-card');

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

  gridHandler = (e) => {
    // Shift a soft radial highlight using a CSS custom property
    const pctX = (e.clientX / window.innerWidth) * 100;
    const pctY = (e.clientY / window.innerHeight) * 100;

    bgGrid.style.setProperty('--glow-x', `${pctX}%`);
    bgGrid.style.setProperty('--glow-y', `${pctY}%`);
  };
  window.addEventListener('mousemove', gridHandler);
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
  clockInterval = setInterval(updateClock, 1000);
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

  scrollHandler = () => {
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
  };
  window.addEventListener('scroll', scrollHandler);
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

  revealObserver = new IntersectionObserver((entries, obs) => {
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

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   9. CASE STUDIES & MODAL CONTROLLER
   -------------------------------------------------------------------------- */
const caseStudiesData = {
  // Keys match the data-project values on .pc-cta buttons in HTML
  'nexus': {
    title: 'BRISKPE: SME Payments Dashboard',
    tags: ['Fintech UX', 'SME Payments', 'Design Systems'],
    role: 'UI/UX Designer',
    timeline: 'Mar 2024 — Present',
    client: 'BRISKPE',
    content: `
      <h3>The Challenge</h3>
      <p>SME users needed faster access to high-frequency payment actions across web and mobile, while onboarding and login flows had avoidable friction that slowed activation.</p>

      <h3>Design Approach</h3>
      <p>I redesigned the SME dashboard, simplified payment workflows, revamped signup and login journeys, and used user interviews plus competitive analysis to identify onboarding drop-offs and usability gaps.</p>

      <div class="metrics">
        <div class="metric">
          <div class="metric-n">75M+</div>
          <div class="metric-l">Payment TPV Volume</div>
        </div>
        <div class="metric">
          <div class="metric-n">4+</div>
          <div class="metric-l">Years Product Design Experience</div>
        </div>
      </div>

      <h3>The Outcome</h3>
      <p>The redesign contributed to payment TPV growth beyond 75M volume and improved onboarding clarity. I also worked on componentization and semantic design system structure to support scalability and dark mode adoption.</p>
    `
  },
  'aether': {
    title: 'GEP Worldwide: Third-Party Risk Management',
    tags: ['Enterprise UX', 'Risk Management', 'Procurement'],
    role: 'Consultant UI/UX Designer',
    timeline: 'Jan 2024 — Mar 2024',
    client: 'GEP Worldwide',
    content: `
      <h3>The Challenge</h3>
      <p>Enterprise risk workflows for JP Morgan Chase needed clearer visibility across modules, consistent patterns, and stronger information architecture for dense third-party risk data.</p>

      <h3>Design System Approach</h3>
      <p>I led UX design for key modules, collaborated with product, engineering, and design stakeholders, and contributed to scaling the platform design system across complex enterprise workflows.</p>

      <div class="metrics">
        <div class="metric">
          <div class="metric-n">13%</div>
          <div class="metric-l">Reduction in Risk Occurrences</div>
        </div>
        <div class="metric">
          <div class="metric-n">37%</div>
          <div class="metric-l">Productivity Lift Concept</div>
        </div>
      </div>

      <h3>The Outcome</h3>
      <p>The work helped reduce third-party risk occurrences by 13% through clearer IA and visibility. I also designed an AI-driven procurement assistant concept and delivered Process Mapping and Invoice Compliance concepts to leadership stakeholders.</p>
    `
  },
  'helios': {
    title: 'RippleHire: AI Hiring Workflows',
    tags: ['Hiring Tech', 'AI UX', 'B2B SaaS'],
    role: 'Product Designer',
    timeline: 'Dec 2022 — Jan 2024',
    client: 'RippleHire',
    content: `
      <h3>The Challenge</h3>
      <p>Recruiters, interviewers, and candidates needed clearer workflows across AI-enabled verification, interviews, events, jobs, campaigns, and compliance-heavy form journeys.</p>

      <h3>Our Solution</h3>
      <p>I owned end-to-end design for an AI-based video impersonation detection feature and redesigned core hiring workflows, creating wireframes and high-fidelity prototypes that accelerated stakeholder approvals.</p>

      <div class="metrics">
        <div class="metric">
          <div class="metric-n">34%</div>
          <div class="metric-l">Engagement Improvement</div>
        </div>
        <div class="metric">
          <div class="metric-n">40%</div>
          <div class="metric-l">Event Registration Lift</div>
        </div>
      </div>

      <h3>Key Features</h3>
      <p>The work included the Interview module, Events redesign, Jobs and Campaigns improvements, and DigiForms across India, the US, and Canada for Tredence.</p>
    `
  },
  'idfy': {
    title: 'IDfy 360: Document Verification',
    tags: ['Identity Verification', 'DigiLocker', 'Aadhaar Flow'],
    role: 'Product Designer',
    timeline: 'Figma design exploration',
    client: 'IDfy',
    content: `
      <h3>The Challenge</h3>
      <p>Document verification flows can feel technical and high-friction, especially when users need to choose between government document types and authentication methods before they understand the safest path forward.</p>

      <h3>Design Direction</h3>
      <p>The Figma frame structures the task as a compact step-by-step card: choose a document type, select a verification method, and continue once the required checks are complete. Aadhaar Card is selected by default, DigiLocker is emphasized as the recommended path, and Face Authentication remains available as a secondary option.</p>

      <div class="metrics">
        <div class="metric">
          <div class="metric-n">2</div>
          <div class="metric-l">Verification Methods</div>
        </div>
        <div class="metric">
          <div class="metric-n">3</div>
          <div class="metric-l">Guided Steps</div>
        </div>
      </div>

      <h3>Interaction Details</h3>
      <p>The selected DigiLocker card uses a blue active border, a recommended badge, clear helper text, and a primary “Start Verification” CTA. The footer keeps the completion state visible with the message “Complete all steps to continue.”</p>
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
      const link = card.querySelector('.pc-cta[href]');
      if (btn) openModal(btn.dataset.project);
      if (!btn && link) window.location.href = link.getAttribute('href');
    });
  });

  closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  escapeHandler = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  };
  window.addEventListener('keydown', escapeHandler);
}

/* --------------------------------------------------------------------------
   10. PAGE LOADER — CURTAIN REVEAL
   -------------------------------------------------------------------------- */
function initPageLoader() {
  const existing = document.querySelector('.page-loader');
  if (existing) return;

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<span class="loader-text">IA</span>';
  document.body.appendChild(loader);

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.style.width = '100%';
  document.body.appendChild(progress);

  setTimeout(() => loader.classList.add('loaded'), 800);
  setTimeout(() => loader.remove(), 1400);
}

/* --------------------------------------------------------------------------
   11. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   12. COUNTER ANIMATION (STATS COUNT UP ON SCROLL)
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const stats = document.querySelectorAll('.stat-n');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(\D*)$/);
        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = match[2];
        const duration = 1500;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(target * eased);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        el.textContent = '0' + suffix;
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}

/* --------------------------------------------------------------------------
   13. 3D CARD TILT ON HOVER
   -------------------------------------------------------------------------- */
function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });
}

/* --------------------------------------------------------------------------
   14. PARALLAX SCROLL EFFECTS
   -------------------------------------------------------------------------- */
function initParallax() {
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  const heroInner = document.querySelector('.hero-inner');
  const sticker = document.querySelector('.rotating-sticker') || document.querySelector('.sticker');

  if (!hero) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;

        if (scrollY < heroH) {
          const ratio = scrollY / heroH;

          if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
          }
          if (heroInner) {
            heroInner.style.transform = `translateY(${scrollY * 0.08}px)`;
            heroInner.style.opacity = 1 - ratio * 0.6;
          }
          if (sticker) {
            sticker.style.transform = `rotate(${scrollY * 0.15}deg)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   15. SPLIT TEXT REVEAL (CONTACT TITLE)
   -------------------------------------------------------------------------- */
function initSplitTextReveal() {
  const title = document.querySelector('.contact-title');
  if (!title || title.dataset.split) return;
  title.dataset.split = 'true';

  const html = title.innerHTML;
  const words = html.split(/(\s+|<[^>]+>)/g);

  title.innerHTML = words.map(word => {
    if (word.match(/^</) || word.match(/^\s+$/)) return word;
    return `<span class="word-reveal">${word}</span>`;
  }).join(' ');

  const wordEls = title.querySelectorAll('.word-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        wordEls.forEach((w, i) => {
          setTimeout(() => w.classList.add('visible'), i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(title);
}

/* --------------------------------------------------------------------------
   16. SMOOTH HOVER SCALE ON INTERACTIVE ELEMENTS
   -------------------------------------------------------------------------- */
function initSmoothHoverScale() {
  const btns = document.querySelectorAll('.btn, .nl-btn, .pc-cta, .contact-email');
  btns.forEach(btn => {
    btn.style.transition = btn.style.transition
      ? btn.style.transition + ', transform 0.3s cubic-bezier(.2,1,.2,1)'
      : 'transform 0.3s cubic-bezier(.2,1,.2,1)';

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.05)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
  });
}
