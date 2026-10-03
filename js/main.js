/**
 * THANUSH PUVANESVARAN — INDUSTRIAL & PRODUCT DESIGN PORTFOLIO
 * Main Interactive Engine: Filtering, Case Studies, Lightbox, Time, Theme & Copy
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function readStored(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function writeStored(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keep Tab / Shift+Tab inside a dialog while it is open. */
function trapTab(e, container) {
  if (e.key !== 'Tab') return;
  const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
    e.preventDefault();
    first.focus();
  }
}

/** Focus an element inside a dialog that may still be transitioning from visibility:hidden. */
function focusWhenReady(el) {
  if (!el) return;
  el.focus();
  if (document.activeElement !== el) {
    requestAnimationFrame(() => {
      el.focus();
      if (document.activeElement !== el) setTimeout(() => el.focus(), 80);
    });
  }
}

/** Lock page scroll while any dialog is open. */
function syncScrollLock() {
  const open = document.querySelector('#case-study-overlay.active, #lightbox-modal.active');
  document.body.style.overflow = open ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLiveClock();
  initScrollReveal();
  initHeroPortraitSwitcher();
  init3DCADViewport();
  initCategoryFilters();
  initCaseStudyDrawer();
  initLightbox();
  initEmailCopy();
  initAmbientWaveCanvas();
  initCursorSpotlight();
  initFloatingHeader();
  initMobileNavDrawer();
});

/* --------------------------------------------------------------------------
   01. THEME TOGGLE (PERSISTENT LIGHT / DARK)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const lightBtn = document.getElementById('theme-btn-light');
  const darkBtn = document.getElementById('theme-btn-dark');
  const stored = readStored('id_portfolio_theme');
  const savedTheme = stored === 'dark' || stored === 'light' ? stored : 'light';

  applyTheme(savedTheme);

  if (lightBtn) {
    lightBtn.addEventListener('click', () => applyTheme('light'));
  }
  if (darkBtn) {
    darkBtn.addEventListener('click', () => applyTheme('dark'));
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    writeStored('id_portfolio_theme', theme);

    if (lightBtn && darkBtn) {
      const isDark = theme === 'dark';
      darkBtn.classList.toggle('active', isDark);
      lightBtn.classList.toggle('active', !isDark);
      darkBtn.setAttribute('aria-checked', String(isDark));
      lightBtn.setAttribute('aria-checked', String(!isDark));
    }
  }
}

/* --------------------------------------------------------------------------
   02. LIVE MALAYSIA LOCAL TIME (UTC+8)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockElem = document.getElementById('live-clock');
  if (!clockElem) return;

  function updateTime() {
    const now = new Date();
    // Malaysia is UTC+8
    const options = {
      timeZone: 'Asia/Kuala_Lumpur',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockElem.textContent = `${timeString} MYT (UTC+8)`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   03. SCROLL REVEAL OBSERVER
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   04. PROJECT CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initCategoryFilters() {
  // Only real filter buttons; other .filter-btn-styled links must not trigger filtering
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const projectItems = document.querySelectorAll('.project-item');

  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) allBtn.textContent = `All Projects (${projectItems.length})`;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        clearTimeout(item._filterTimer);
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
          item._filterTimer = setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          item._filterTimer = setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   05. COMPREHENSIVE CASE STUDY DATA & DRAWER SYSTEM
   -------------------------------------------------------------------------- */
const caseStudies = {
  'boat-redang': {
    index: 'Project 01 · Maritime Craft & CMF',
    title: 'Boat Redang: Maritime Memory & Keepsake',
    lead: 'Translating the maritime culture and folk craftsmanship of Pulau Redang, Terengganu into a tactile, collectible miniature sailboat with authentic rigging and CMF storytelling.',
    specs: [
      { label: 'Role', val: 'Designer & Maker' },
      { label: 'Institution', val: 'UniSZA Industrial Design' },
      { label: 'Materials', val: 'Timber, Cotton Canvas, Brass' },
      { label: 'Techniques', val: 'Wood Shaping, Hand Stitching, CMF' }
    ],
    stages: [
      {
        num: '01',
        label: 'Context & Brief',
        title: 'Capturing Place Beyond Generic Souvenirs',
        desc: 'Traditional tourist keepsakes from Pulau Redang often rely on disposable plastic or generic trinkets. The objective was to engineer an authentic souvenir object that communicates nautical boatbuilding traditions, local fishing boats, and tactile timber warmth.'
      },
      {
        num: '02',
        label: 'Form & Material Study',
        title: 'Carving Proportions & Hand Rigging',
        desc: 'Exploring hull curvature, keel balance, and mast stability at a miniature scale. Multiple wood species were tested for grain contrast, paired with unbleached hand-dyed cotton sailcloth and washer portholes.'
      },
      {
        num: '03',
        label: 'Final Execution',
        title: 'Exhibition Presentation & Visual Identity',
        desc: 'The finished fleet embodies maritime balance, tactile craft, and exhibition-ready boards detailing dimensional proportions, material finishes, and packaging storytelling.'
      }
    ],
    gallery: [
      {
        src: 'Img/boat-redang-hero.webp',
        col: 'col-12',
        caption: 'Boat Redang Trio — Handcrafted hull profiles with custom dyed sails and rigging'
      },
      {
        src: 'Img/boat-redang-sailboat.webp',
        col: 'col-6',
        caption: 'Detailed Silhouette — Single Boat Redang miniature showcasing brass grommets and deck'
      },
      {
        src: 'Img/boat-redang-exhibition-poster.webp',
        col: 'col-6',
        caption: 'Final Design Exhibition Poster — Complete visual story and cultural documentation'
      }
    ]
  },

  'agomoto-speaker': {
    index: 'Project 02 · Audio Hardware & Acoustics',
    title: 'Agomoto Acoustic: Sculptural Relic Speaker',
    lead: 'A desktop acoustic transducer built from mystical and sci-fi form language, blending cylindrical acoustic cavity engineering with ceremonial gold-bronze and brushed alloy CMF.',
    specs: [
      { label: 'Role', val: 'Concept & CAD Designer' },
      { label: 'Software', val: 'Fusion 360 / KeyShot' },
      { label: 'Form Reference', val: 'Eye of Agamotto / Sci-Fi Relic' },
      { label: 'CMF Strategy', val: 'Anodized Gold / Bead-Blasted Aluminum' }
    ],
    stages: [
      {
        num: '01',
        label: 'Problem Space',
        title: 'Elevating Consumer Electronics into Artefacts',
        desc: 'Most modern smart speakers are muted, fabric-wrapped boxes designed to disappear. Agomoto was conceived as a ceremonial centrepiece—an audio transducer that demands reverence and tactile interaction.'
      },
      {
        num: '02',
        label: 'CAD Engineering',
        title: 'Parametric Enclosure & Exploded Architecture',
        desc: 'Designed parametrically in Fusion 360: outer protective cradle, suspended cylindrical transducer core, directional acoustic lens, and multi-layered speaker grilles designed for unconstrained sound dispersal.'
      },
      {
        num: '03',
        label: 'CMF & Finish',
        title: 'Dual-Tone Metallic Contrast',
        desc: 'Rendered in KeyShot with high-precision surface roughness maps, balancing satin warm bronze-gold hardware with machined aluminum cooling accents and knurled control dials.'
      }
    ],
    gallery: [
      {
        src: 'Img/agomoto-technical-poster.webp',
        col: 'col-12',
        caption: 'Agomoto Technical Poster — CAD renders beside the 3D-printed prototypes'
      },
      {
        src: 'Img/agomoto-render.webp',
        col: 'col-6',
        caption: 'Studio Hero Render — Dual-tone metallic finish under directional studio lighting'
      },
      {
        src: 'Img/agomoto-concept-poster.webp',
        col: 'col-6',
        caption: 'Agomoto Concept Poster — Design concept, form language and exploded views'
      }
    ]
  },

  'smart-bento': {
    index: 'Project 03 · Systems & Ergonomics',
    title: 'Smart Bento: Modular Multi-Meal Container',
    lead: 'An ergonomic, tiered food management system for urban students and busy commuters, engineered with intuitive color-coded modular trays and embedded thermal timing alerts.',
    specs: [
      { label: 'Role', val: 'Industrial Product Designer' },
      { label: 'Prototype', val: 'Functional Foam & 3D Printed Model' },
      { label: 'User Group', val: 'Urban Commuters & Uni Students' },
      { label: 'Key Features', val: 'Tri-Tier Stacking, Seal Locks, Alert' }
    ],
    stages: [
      {
        num: '01',
        label: 'Human Factors',
        title: 'Addressing Meal Segregation & Temperature Friction',
        desc: 'Research revealed that single-tub containers compromise texture and flavor across distinct food groups. The design requires clean separation of dry grains, fresh greens, and warm proteins with leakproof seals.'
      },
      {
        num: '02',
        label: 'Modular Architecture',
        title: 'Tiered Locking Latches & Thermal Retention',
        desc: 'Prototyped with three interlocking food-safe tiers, ergonomic side latches, and an integrated base compartment calibrated for a compact rechargeable heating element and piezoelectric reminder.'
      },
      {
        num: '03',
        label: 'Prototype & Testing',
        title: 'High-Contrast Tactile Usability',
        desc: 'Constructed physical prototypes using contrasting cobalt blue and high-visibility safety orange, providing immediate visual cues for assembly, cleaning, and portion control.'
      }
    ],
    gallery: [
      {
        src: 'Img/smart-bento-prototype-render.webp',
        col: 'col-7',
        caption: 'Working Prototype Render — Tiered modular container in cobalt blue and safety orange'
      },
      {
        src: 'Img/smart-bento-enclosure-study.webp',
        col: 'col-5',
        caption: 'Enclosure Study — Lid form and vent-port layout'
      }
    ]
  },

  'flute-humidifier': {
    index: 'Project 04 · Personal Appliance',
    title: 'Flute Mist: Ceremonial Desktop Humidifier',
    lead: 'Reimagining desktop air moisture appliances through the slender rhythm and ceremonial elegance of traditional wind instruments, blending tactile metallic finishes with soft atmospheric vapor.',
    specs: [
      { label: 'Role', val: 'Concept & CMF Designer' },
      { label: 'Software', val: 'Fusion 360 / Keyshot / Photoshop' },
      { label: 'Inspiration', val: 'Acoustic Wind Flute & Classical Brass' },
      { label: 'Application', val: 'Personal Desktop Wellness' }
    ],
    stages: [
      {
        num: '01',
        label: 'Design Opportunity',
        title: 'Moving Beyond Boring Medical Humidifiers',
        desc: 'Most personal humidifiers resemble white plastic pill bottles or cheap generic cones. The goal was to design an appliance that doubles as a sculpture on an executive desk or creative workstation.'
      },
      {
        num: '02',
        label: 'Form Synthesis',
        title: 'Flute Geometry & Chimney Dispersion',
        desc: 'Utilizing a vertical cylindrical chimney to optimize ultrasonic vapor launch height, balanced with an arched carry handle that mirrors traditional instrument keys and tactile touch points.'
      },
      {
        num: '03',
        label: 'CMF & Mood',
        title: 'Brushed Copper & Satin Gold Architecture',
        desc: 'The metallic palette radiates warmth and architectural permanence, turning the daily ritual of filling and misting into a calm, grounding sensory experience.'
      }
    ],
    gallery: [
      {
        src: 'Img/flute-mist-concept-board.webp',
        col: 'col-4',
        caption: 'Flute Humidifier Concept Board — Main perspective, feature callouts & mist stream'
      },
      {
        src: 'Img/flute-mist-cad-front.webp',
        col: 'col-4',
        caption: 'CAD Study (front) — Chimney, vented collar and curved carry handle'
      },
      {
        src: 'Img/flute-mist-cad-side.webp',
        col: 'col-4',
        caption: 'CAD Study (side) — Geometry derivations, handle ergonomics & vent alignments'
      }
    ]
  }
};

function initCaseStudyDrawer() {
  const overlay = document.getElementById('case-study-overlay');
  const drawerBody = document.getElementById('drawer-body');
  const closeBtn = document.getElementById('drawer-close-btn');
  const triggers = document.querySelectorAll('[data-open-case]');
  let lastFocus = null;

  if (!overlay || !drawerBody) return;

  function openCase(id) {
    const data = caseStudies[id];
    if (!data) return;

    const specsHtml = data.specs.map(s => `
      <div class="case-spec-item">
        <div class="case-spec-label">${escapeHtml(s.label)}</div>
        <div class="case-spec-val">${escapeHtml(s.val)}</div>
      </div>
    `).join('');

    const stagesHtml = data.stages.map(st => `
      <div class="case-stage">
        <div class="case-stage-marker">
          <span class="case-stage-num">${escapeHtml(st.num)}</span>
          <span class="case-stage-label">${escapeHtml(st.label)}</span>
        </div>
        <div class="case-stage-content">
          <h4>${escapeHtml(st.title)}</h4>
          <p>${escapeHtml(st.desc)}</p>
        </div>
      </div>
    `).join('');

    const galleryHtml = data.gallery.map(g => `
      <div class="gallery-item ${escapeHtml(g.col)}" role="button" tabindex="0" aria-label="Enlarge image: ${escapeHtml(g.caption)}" data-lightbox-src="${escapeHtml(g.src)}" data-lightbox-caption="${escapeHtml(g.caption)}">
        <img src="${escapeHtml(g.src)}" alt="${escapeHtml(g.caption)}" loading="lazy" decoding="async">
        <div class="gallery-caption-overlay">${escapeHtml(g.caption)}</div>
      </div>
    `).join('');

    drawerBody.innerHTML = `
      <div class="case-meta-header">
        <div class="case-eyebrow">${escapeHtml(data.index)}</div>
        <h2 class="case-hero-title">${escapeHtml(data.title)}</h2>
        <p class="case-lead-text">${escapeHtml(data.lead)}</p>
      </div>

      <div class="case-specs-table">
        ${specsHtml}
      </div>

      <div class="case-stages">
        ${stagesHtml}
      </div>

      <div class="case-gallery-section">
        <div class="case-gallery-heading">Design &amp; CAD Gallery · Click to enlarge</div>
        <div class="case-gallery-grid">
          ${galleryHtml}
        </div>
      </div>
    `;

    lastFocus = document.activeElement;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.querySelector('.case-study-drawer').scrollTop = 0;
    syncScrollLock();
    focusWhenReady(closeBtn);

    initDynamicGalleryClicks();
  }

  function closeCase() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    lastFocus = null;
  }

  triggers.forEach(trig => {
    const open = () => openCase(trig.getAttribute('data-open-case'));
    trig.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
    trig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCase);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCase();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (document.getElementById('lightbox-modal').classList.contains('active')) return;
    if (e.key === 'Escape') closeCase();
    trapTab(e, overlay);
  });
}

/* --------------------------------------------------------------------------
   06. FULLSCREEN IMAGE LIGHTBOX
   -------------------------------------------------------------------------- */
let activeLightboxIndex = 0;
let currentLightboxItems = [];
let lightboxOpener = null;
let openLightboxAt = () => {};

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal) return;

  function showImage(index) {
    if (!currentLightboxItems.length) return;
    if (index < 0) index = currentLightboxItems.length - 1;
    if (index >= currentLightboxItems.length) index = 0;
    activeLightboxIndex = index;

    const item = currentLightboxItems[activeLightboxIndex];
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    if (img && item) {
      img.src = item.src;
      img.alt = item.caption || 'Project visual';
    }
    if (cap && item) {
      cap.textContent = item.caption || '';
    }
  }

  function openLightbox(index, opener) {
    lightboxOpener = opener || null;
    showImage(index);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    focusWhenReady(closeBtn);
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (lightboxOpener && typeof lightboxOpener.focus === 'function') lightboxOpener.focus();
    lightboxOpener = null;
  }

  openLightboxAt = openLightbox;

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(activeLightboxIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(activeLightboxIndex + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-img-wrapper')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(activeLightboxIndex - 1);
    if (e.key === 'ArrowRight') showImage(activeLightboxIndex + 1);
    trapTab(e, modal);
  });
}

function initDynamicGalleryClicks() {
  const galleryItems = document.querySelectorAll('[data-lightbox-src]');
  if (!galleryItems.length) return;

  currentLightboxItems = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-lightbox-src'),
    caption: item.getAttribute('data-lightbox-caption')
  }));

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightboxAt(idx, item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightboxAt(idx, item);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   07. ONE-CLICK EMAIL COPY & TOAST
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toast-msg');
  let toastTimer = null;

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) { /* fall through to legacy copy */ }

    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch (err) {
      return false;
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'thanushpatthas@gmail.com';

      if (await copyText(email)) {
        showToast(`Email copied: ${email}`);
      } else {
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   08. TOP HERO PORTRAIT SWITCHER (STUDIO VS FORMAL REAL PICTURES)
   -------------------------------------------------------------------------- */
function initHeroPortraitSwitcher() {
  const portraitImg = document.getElementById('hero-portrait-img');
  const badge = document.getElementById('portrait-photo-badge');
  const btnStudio = document.getElementById('btn-photo-studio');
  const btnFormal = document.getElementById('btn-photo-formal');

  if (!portraitImg || !btnStudio || !btnFormal) return;

  const buttons = [btnStudio, btnFormal];
  let swapTimer = null;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      buttons.forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });

      portraitImg.style.opacity = '0';
      portraitImg.style.transform = 'scale(0.96)';

      clearTimeout(swapTimer);
      swapTimer = setTimeout(() => {
        portraitImg.src = btn.dataset.photoSrc;
        portraitImg.alt = btn.dataset.alt || portraitImg.alt;
        if (badge) badge.textContent = btn.dataset.badge;
        portraitImg.style.opacity = '1';
        portraitImg.style.transform = 'scale(1)';
      }, prefersReducedMotion.matches ? 0 : 200);
    });
  });
}

/* --------------------------------------------------------------------------
   09. INTERACTIVE 3D CAD MODELING VIEWPORT (THREE.JS ENGINE)
   Loads the real Agomoto B-rep model (models/agomoto.glb) with CMF / Wireframe / Clay & Explode
   -------------------------------------------------------------------------- */
const CAD_MODEL_URL = 'models/agomoto.glb';
const CAD_MODEL_SCALE = 0.2;                       // model is authored in centimetres
const CAD_GROUND_Y = -9.05;                        // underside of the base (model space, cm)
const CAD_HOME = { rotX: 0.16, rotY: -0.55, camZ: 7.6, camY: 0.4 };

// CMF specification per assembly group (polished bronze, champagne gold, stainless steel)
const CAD_PALETTE = {
  base:    { color: 0x7d5c26, metalness: 1.0, roughness: 0.17 },
  cradle:  { color: 0xd8bd88, metalness: 1.0, roughness: 0.22 },
  drum:    { color: 0xcbd0d8, metalness: 1.0, roughness: 0.20 },
  front:   { color: 0xd9ae55, metalness: 1.0, roughness: 0.20 },
  plate:   { color: 0x3a2e1a, metalness: 0.9, roughness: 0.38 },
  back:    { color: 0x2a261f, metalness: 0.8, roughness: 0.42 },
  handleL: { color: 0x8b642a, metalness: 1.0, roughness: 0.16 },
  handleR: { color: 0x8b642a, metalness: 1.0, roughness: 0.16 }
};

// Exploded-view travel per assembly group (cm; x right, y up, z toward the viewer)
const CAD_EXPLODE = {
  base: [0, -4.5, 0], cradle: [0, -2.0, 0], drum: [0, 0, 0],
  plate: [0, 0, 3.2], front: [0, 0, 7.5], back: [0, 0, -7.5],
  handleL: [-5.5, 0, 0], handleR: [5.5, 0, 0]
};

function showCadFallback(container, message) {
  container.innerHTML = '';
  const img = document.createElement('img');
  img.className = 'cad-fallback-img';
  img.src = 'Img/agomoto-render.webp';
  img.alt = 'Render of the Agomoto acoustic speaker';
  container.appendChild(img);
  container.title = message;
  container.style.cursor = 'default';
  const toolbar = document.querySelector('.cad-viewport-toolbar');
  if (toolbar) toolbar.hidden = true;
  const coords = document.getElementById('cad-coords');
  if (coords) coords.textContent = message;
}

/** Soft-box studio environment so the metals have something believable to reflect. */
function createStudioEnvironment(renderer) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0x25272c, side: THREE.BackSide })
  ));

  function softbox(w, h, pos, color, intensity) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
    );
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  }

  softbox(46, 46, [0, 32, 2], 0xffffff, 7);        // overhead key
  softbox(14, 34, [-30, 6, 22], 0xfff0dc, 5);      // warm front-left strip
  softbox(9, 36, [32, 4, 8], 0xd9e6ff, 3.2);       // cool right strip
  softbox(46, 12, [0, 6, -32], 0xffffff, 3);       // rim from behind
  softbox(40, 6, [0, -22, 18], 0xffe9cf, 1.4);     // low warm bounce

  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(env, 0.035).texture;
  pmrem.dispose();
  return texture;
}

function createGroundShadow() {
  const size = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0,0,0,0.42)');
  grad.addColorStop(0.45, 'rgba(0,0,0,0.18)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 22),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = -1;
  return mesh;
}

function init3DCADViewport() {
  const container = document.getElementById('cad-canvas-container');
  if (!container) return;

  if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
    showCadFallback(container, '3D engine unavailable. Showing a static render instead.');
    return;
  }

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 360;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 60);
  camera.position.set(0, CAD_HOME.camY, CAD_HOME.camZ);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (err) {
    showCadFallback(container, 'WebGL is unavailable on this device. Showing a static render instead.');
    return;
  }
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  container.appendChild(renderer.domElement);

  scene.environment = createStudioEnvironment(renderer);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.55);
  keyLight.position.set(5, 8, 7);
  scene.add(keyLight);

  // Rotating assembly (scaled from cm); the ground shadow lives inside so it follows the turntable
  const assembly = new THREE.Group();
  assembly.scale.setScalar(CAD_MODEL_SCALE);
  assembly.rotation.set(CAD_HOME.rotX, CAD_HOME.rotY, 0);
  scene.add(assembly);

  const shadow = createGroundShadow();
  shadow.position.y = CAD_GROUND_Y;
  assembly.add(shadow);

  // ------------------------------------------------------------------------
  // MATERIALS
  // ------------------------------------------------------------------------
  const surfaceOffset = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, side: THREE.DoubleSide };
  const cmfMaterials = {};
  Object.keys(CAD_PALETTE).forEach(name => {
    cmfMaterials[name] = new THREE.MeshStandardMaterial(Object.assign({ envMapIntensity: 1.15 }, CAD_PALETTE[name], surfaceOffset));
  });
  const clayMaterial = new THREE.MeshStandardMaterial(Object.assign({ color: 0xe6e3dc, roughness: 0.88, metalness: 0.0, envMapIntensity: 0.55 }, surfaceOffset));
  const ghostMaterial = new THREE.MeshBasicMaterial({ color: 0x185adb, transparent: true, opacity: 0.06, depthWrite: false, side: THREE.DoubleSide });
  const wireLineMaterial = new THREE.LineBasicMaterial({ color: 0x185adb, transparent: true, opacity: 0.95 });
  const clayLineMaterial = new THREE.LineBasicMaterial({ color: 0x20242b, transparent: true, opacity: 0.28 });

  // ------------------------------------------------------------------------
  // MODEL LOADING (real B-rep tessellation exported from the .3dm CAD file)
  // ------------------------------------------------------------------------
  const parts = {};   // group name -> { mesh, lines }
  let currentMode = 'cmf';
  let modelReady = false;
  let explodeFactor = 0;

  const loading = document.createElement('div');
  loading.className = 'cad-loading';
  loading.setAttribute('role', 'status');
  loading.textContent = 'Loading 3D model…';
  container.appendChild(loading);

  function groupName(obj) {
    const raw = obj.name || (obj.parent && obj.parent.name) || '';
    return raw.replace(/_edges$/, '');
  }

  function onModelLoaded(gltf) {
    gltf.scene.traverse(obj => {
      if (!(obj.isMesh || obj.isLine)) return;
      const name = groupName(obj);
      if (!name) return;
      parts[name] = parts[name] || {};
      if (obj.isMesh) parts[name].mesh = obj; else parts[name].lines = obj;
    });
    assembly.add(gltf.scene);
    loading.remove();
    modelReady = true;
    setRenderMode(currentMode);
    updateExplodedAssembly(explodeFactor);
    resumeRendering();
  }

  function onModelError() {
    loading.remove();
    showCadFallback(container, 'Could not load the 3D model. Showing a static render instead.');
    cancelAnimationFrame(frameId);
    frameId = 0;
    renderer.dispose();
  }

  function startLoading() {
    const loader = new THREE.GLTFLoader();
    loader.load(CAD_MODEL_URL, onModelLoaded, (xhr) => {
      if (xhr.lengthComputable && xhr.total) {
        loading.textContent = `Loading 3D model… ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
      }
    }, onModelError);
  }

  // Only fetch the model once the viewport is close to the screen
  if ('IntersectionObserver' in window) {
    const loadObserver = new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) {
        obs.disconnect();
        startLoading();
      }
    }, { rootMargin: '600px 0px' });
    loadObserver.observe(container);
  } else {
    startLoading();
  }

  // ------------------------------------------------------------------------
  // RENDER MODES + EXPLODED ASSEMBLY
  // ------------------------------------------------------------------------
  function setRenderMode(mode) {
    currentMode = mode;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    wireLineMaterial.color.setHex(isDark ? 0x38bdf8 : 0x185adb);
    ghostMaterial.color.setHex(isDark ? 0x38bdf8 : 0x185adb);

    Object.keys(parts).forEach(name => {
      const part = parts[name];
      if (part.mesh) {
        part.mesh.material = mode === 'wire' ? ghostMaterial : mode === 'clay' ? clayMaterial : (cmfMaterials[name] || clayMaterial);
      }
      if (part.lines) {
        part.lines.visible = mode !== 'cmf';
        part.lines.material = mode === 'wire' ? wireLineMaterial : clayLineMaterial;
      }
    });
  }

  function updateExplodedAssembly(factor) {
    explodeFactor = factor;
    Object.keys(parts).forEach(name => {
      const off = CAD_EXPLODE[name] || [0, 0, 0];
      ['mesh', 'lines'].forEach(kind => {
        const obj = parts[name][kind];
        if (obj) obj.position.set(off[0] * factor, off[1] * factor, off[2] * factor);
      });
    });
    // keep the whole exploded assembly inside the frame, and keep the shadow under the base
    assembly.scale.setScalar(CAD_MODEL_SCALE * (1 - 0.3 * factor));
    shadow.position.y = CAD_GROUND_Y + CAD_EXPLODE.base[1] * factor;
  }

  const modeBtns = document.querySelectorAll('[data-cad-mode]');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      setRenderMode(btn.getAttribute('data-cad-mode'));
      resumeRendering();
    });
  });

  const explodeSlider = document.getElementById('cad-explode-slider');
  const explodeValDisplay = document.getElementById('explode-val-display');

  if (explodeSlider) {
    explodeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      updateExplodedAssembly(val / 100);
      if (explodeValDisplay) explodeValDisplay.textContent = `${Math.round(val)}%`;
      resumeRendering();
    });
  }

  // ------------------------------------------------------------------------
  // TURNTABLE, RESET, ORBIT, ZOOM
  // ------------------------------------------------------------------------
  let autoRotate = !prefersReducedMotion.matches;
  const btnAutorotate = document.getElementById('cad-btn-autorotate');
  const autorotateIndicator = document.getElementById('autorotate-indicator');

  function syncAutorotateUi() {
    if (!btnAutorotate) return;
    btnAutorotate.classList.toggle('active', autoRotate);
    btnAutorotate.setAttribute('aria-pressed', String(autoRotate));
    if (autorotateIndicator) autorotateIndicator.textContent = autoRotate ? '●' : '○';
  }
  syncAutorotateUi();

  if (btnAutorotate) {
    btnAutorotate.addEventListener('click', () => {
      autoRotate = !autoRotate;
      syncAutorotateUi();
      resumeRendering();
    });
  }

  // Smoothed orbit: pointer input moves the *target*, the render loop eases toward it
  const target = { rotX: CAD_HOME.rotX, rotY: CAD_HOME.rotY, camZ: CAD_HOME.camZ };

  const btnReset = document.getElementById('cad-btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      target.rotX = CAD_HOME.rotX;
      // take the short way round to the home angle
      const turns = Math.round((assembly.rotation.y - CAD_HOME.rotY) / (Math.PI * 2));
      target.rotY = CAD_HOME.rotY + turns * Math.PI * 2;
      target.camZ = CAD_HOME.camZ;
      if (explodeSlider) {
        explodeSlider.value = 0;
        updateExplodedAssembly(0);
        if (explodeValDisplay) explodeValDisplay.textContent = '0%';
      }
      resumeRendering();
    });
  }

  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  const coordsElem = document.getElementById('cad-coords');

  function updateCoordsReadout() {
    if (!coordsElem || !modelReady) return;
    const degX = Math.round(assembly.rotation.x * (180 / Math.PI));
    const degY = ((Math.round(assembly.rotation.y * (180 / Math.PI)) % 360) + 360) % 360;
    coordsElem.textContent = `ROT: ${degX}° // ${degY}°`;
  }

  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    container.style.cursor = 'grabbing';
    resumeRendering();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    target.rotY += (e.clientX - prevPointerX) * 0.008;
    target.rotX += (e.clientY - prevPointerY) * 0.008;
    target.rotX = Math.max(-0.7, Math.min(0.9, target.rotX));
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
  });

  function endDrag() {
    isDragging = false;
    container.style.cursor = 'grab';
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Zoom with Ctrl / Cmd + scroll so normal page scrolling is never trapped
  container.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    target.camZ = Math.max(5.2, Math.min(12, target.camZ + e.deltaY * 0.01));
    resumeRendering();
  }, { passive: false });

  // Keyboard orbit / zoom for accessibility
  container.setAttribute('tabindex', '0');
  container.addEventListener('keydown', (e) => {
    const step = 0.12;
    if (e.key === 'ArrowLeft') target.rotY -= step;
    else if (e.key === 'ArrowRight') target.rotY += step;
    else if (e.key === 'ArrowUp') target.rotX = Math.max(-0.7, target.rotX - step);
    else if (e.key === 'ArrowDown') target.rotX = Math.min(0.9, target.rotX + step);
    else if (e.key === '+' || e.key === '=') target.camZ = Math.max(5.2, target.camZ - 0.5);
    else if (e.key === '-') target.camZ = Math.min(12, target.camZ + 0.5);
    else return;
    e.preventDefault();
    resumeRendering();
  });

  window.addEventListener('resize', () => {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    if (!newW || !newH) return;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
    resumeRendering();
  });

  // Keep wireframe colours in step with the light / dark theme
  const themeObserver = new MutationObserver(() => {
    if (modelReady) setRenderMode(currentMode);
    resumeRendering();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ------------------------------------------------------------------------
  // RENDER LOOP (only while visible; idles once everything has settled)
  // ------------------------------------------------------------------------
  let inView = true;
  let frameId = 0;

  function animate() {
    frameId = 0;
    if (!modelReady || !inView || document.hidden) return;

    if (autoRotate && !isDragging) target.rotY += 0.0055;

    const ease = prefersReducedMotion.matches ? 1 : 0.12;
    assembly.rotation.x += (target.rotX - assembly.rotation.x) * ease;
    assembly.rotation.y += (target.rotY - assembly.rotation.y) * ease;
    camera.position.z += (target.camZ - camera.position.z) * ease;
    camera.lookAt(0, 0, 0);

    updateCoordsReadout();
    renderer.render(scene, camera);

    const settled = Math.abs(target.rotX - assembly.rotation.x) < 1e-4 &&
      Math.abs(target.rotY - assembly.rotation.y) < 1e-4 &&
      Math.abs(target.camZ - camera.position.z) < 1e-3;
    if (autoRotate || isDragging || !settled) frameId = requestAnimationFrame(animate);
  }

  function resumeRendering() {
    if (!frameId && inView && !document.hidden) frameId = requestAnimationFrame(animate);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      resumeRendering();
    }).observe(container);
  }
  document.addEventListener('visibilitychange', resumeRendering);

  resumeRendering();
}

/* --------------------------------------------------------------------------
   08. GENERATIVE AERODYNAMIC CAD STREAMLINES (ANIMATED BACKGROUND)
   -------------------------------------------------------------------------- */
function initAmbientWaveCanvas() {
  const canvas = document.getElementById('ambient-wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let time = 0;
  let frameId = 0;

  let mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  });

  // 5 Parametric Aerodynamic Streamlines (Aerospace & CAD Airflow Contours)
  const waves = [
    { baseRatio: 0.16, amp: 42, freq: 0.0016, speed: 0.008, phase: 0 },
    { baseRatio: 0.34, amp: 58, freq: 0.0012, speed: 0.006, phase: 1.8 },
    { baseRatio: 0.52, amp: 46, freq: 0.0020, speed: 0.010, phase: 3.4 },
    { baseRatio: 0.70, amp: 64, freq: 0.0014, speed: 0.007, phase: 5.1 },
    { baseRatio: 0.86, amp: 40, freq: 0.0018, speed: 0.009, phase: 2.2 }
  ];

  function draw() {
    time += 1;

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Refined color palettes for White Mode (classical warm tones & cobalt) vs Dark Mode
    const palettes = isDark ? [
      { stroke: 'rgba(59, 130, 246, 0.22)', fill: 'rgba(59, 130, 246, 0.015)' },
      { stroke: 'rgba(56, 189, 248, 0.18)', fill: 'rgba(56, 189, 248, 0.012)' },
      { stroke: 'rgba(147, 51, 234, 0.15)', fill: 'rgba(147, 51, 234, 0.01)' },
      { stroke: 'rgba(59, 130, 246, 0.20)', fill: 'rgba(59, 130, 246, 0.014)' },
      { stroke: 'rgba(56, 189, 248, 0.16)', fill: 'rgba(56, 189, 248, 0.01)' }
    ] : [
      { stroke: 'rgba(24, 90, 219, 0.22)', fill: 'rgba(24, 90, 219, 0.022)' },      // Technical cobalt streamline
      { stroke: 'rgba(205, 170, 120, 0.32)', fill: 'rgba(235, 210, 170, 0.03)' },  // Warm champagne contour
      { stroke: 'rgba(165, 150, 130, 0.25)', fill: 'rgba(195, 180, 155, 0.02)' },  // Architectural titanium
      { stroke: 'rgba(24, 90, 219, 0.18)', fill: 'rgba(24, 90, 219, 0.018)' },     // Precision cobalt
      { stroke: 'rgba(215, 180, 135, 0.30)', fill: 'rgba(240, 220, 185, 0.025)' }  // Alabaster gold
    ];

    const step = 8; // Step size for smooth 60fps rendering

    waves.forEach((w, idx) => {
      const palette = palettes[idx % palettes.length];
      const baseY = height * w.baseRatio;

      ctx.beginPath();
      ctx.moveTo(0, baseY);

      for (let x = 0; x <= width + step; x += step) {
        // Parametric wave formula
        let y = baseY + Math.sin(x * w.freq + time * w.speed + w.phase) * w.amp;
        // Secondary aerodynamic harmonic
        y += Math.cos(x * w.freq * 1.5 - time * w.speed * 0.6) * (w.amp * 0.35);

        // Fluid interactive aerodynamic deflection around cursor
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 260;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 40;
            y += (dy > 0 ? force : -force);
          }
        }

        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = palette.stroke;
      ctx.lineWidth = (idx === 0 || idx === 3) ? 1.6 : 1.1;
      ctx.stroke();

      // Delicate shaded airflow ribbon
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = palette.fill;
      ctx.fill();
    });

    frameId = 0;
    // Static single frame for reduced motion; pause while the tab is hidden
    if (!document.hidden && !prefersReducedMotion.matches) frameId = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !frameId) frameId = requestAnimationFrame(draw);
  });
  frameId = requestAnimationFrame(draw);
}

/* --------------------------------------------------------------------------
   09. INTERACTIVE DRAFTING LIGHT TABLE (CURSOR SPOTLIGHT)
   -------------------------------------------------------------------------- */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursor-spotlight');
  if (!spotlight || prefersReducedMotion.matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let fadeTimeout = null;
  let frameId = 0;

  function renderSpotlight() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    // Stop the loop once the spotlight has caught up with the cursor
    const settled = Math.abs(mouseX - currentX) < 0.5 && Math.abs(mouseY - currentY) < 0.5;
    frameId = settled ? 0 : requestAnimationFrame(renderSpotlight);
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.style.opacity = '1';

    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      // Softly reduce intensity when cursor is stationary
      spotlight.style.opacity = '0.7';
    }, 1800);

    if (!frameId) frameId = requestAnimationFrame(renderSpotlight);
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });

  renderSpotlight();
}

/* --------------------------------------------------------------------------
   10. FLOATING CONSOLE HEADER SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initFloatingHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   11. MOBILE NAVIGATION DRAWER TOGGLE
   -------------------------------------------------------------------------- */
function initMobileNavDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleDrawer() {
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function openDrawer() {
    drawer.classList.add('active');
    toggleBtn.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    const hadFocus = drawer.contains(document.activeElement);
    drawer.classList.remove('active');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    if (hadFocus) toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', toggleDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('active') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}
