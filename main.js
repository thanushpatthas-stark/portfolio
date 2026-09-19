/**
 * THANUSH PUVANESVARAN — INDUSTRIAL & PRODUCT DESIGN PORTFOLIO
 * Main Interactive Engine: Filtering, Case Studies, Lightbox, Time, Theme & Copy
 * Inspired by Dominik Scherrer's Behance Portfolio 2023
 */

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
  const savedTheme = localStorage.getItem('id_portfolio_theme') || 'light';
  
  applyTheme(savedTheme);

  if (lightBtn) {
    lightBtn.addEventListener('click', () => applyTheme('light'));
  }
  if (darkBtn) {
    darkBtn.addEventListener('click', () => applyTheme('dark'));
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('id_portfolio_theme', theme);

    if (lightBtn && darkBtn) {
      if (theme === 'dark') {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
      } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
      }
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
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
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
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (1).png',
        col: 'col-12',
        caption: 'Boat Redang Trio — Handcrafted hull profiles with custom dyed sails and rigging'
      },
      {
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (2).png',
        col: 'col-6',
        caption: 'Design Development Board — Nautical inspiration, form exploration & material selections'
      },
      {
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (4).png',
        col: 'col-6',
        caption: 'Craft Process & Technical Breakdown — Rigging assemblies, timber carving & jointing'
      },
      {
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (7).png',
        col: 'col-6',
        caption: 'Detailed Silhouette — Single Boat Redang miniature showcasing brass grommets and deck'
      },
      {
        src: 'Img/Suloam Addy Poster-1.png',
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
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (3).png',
        col: 'col-12',
        caption: 'Agomoto Technical Poster — Exploded CAD view, component breakdown & driver chamber'
      },
      {
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (5).png',
        col: 'col-6',
        caption: 'Studio Hero Render — Dual-tone metallic finish under directional studio lighting'
      },
      {
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (2).png',
        col: 'col-6',
        caption: 'Concept Development Board — Form language studies and acoustic volume calculations'
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
        src: 'Img/Black and White Minimalist Designer Portfolio Presentation (6).png',
        col: 'col-7',
        caption: 'Physical Working Prototype — Open and closed tiered modular configuration'
      },
      {
        src: 'Img/Untitled design (2).png',
        col: 'col-5',
        caption: 'Design & Ergonomics Board — User flow, compartment breakdown & latch mechanics'
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
        src: 'Img/humidifier.png',
        col: 'col-7',
        caption: 'Flute Humidifier Concept Board — Main perspective, feature callouts & mist stream'
      },
      {
        src: 'Img/Untitled design (3).png',
        col: 'col-5',
        caption: 'Form & CMF Studies — Geometry derivations, handle ergonomics & vent alignments'
      }
    ]
  }
};

function initCaseStudyDrawer() {
  const overlay = document.getElementById('case-study-overlay');
  const drawerBody = document.getElementById('drawer-body');
  const closeBtn = document.getElementById('drawer-close-btn');
  const triggers = document.querySelectorAll('[data-open-case]');

  if (!overlay || !drawerBody) return;

  function openCase(id) {
    const data = caseStudies[id];
    if (!data) return;

    let specsHtml = data.specs.map(s => `
      <div class="case-spec-item">
        <div class="case-spec-label">${s.label}</div>
        <div class="case-spec-val">${s.val}</div>
      </div>
    `).join('');

    let stagesHtml = data.stages.map(st => `
      <div class="case-stage">
        <div class="case-stage-marker">
          <span class="case-stage-num">${st.num}</span>
          <span class="case-stage-label">${st.label}</span>
        </div>
        <div class="case-stage-content">
          <h4>${st.title}</h4>
          <p>${st.desc}</p>
        </div>
      </div>
    `).join('');

    let galleryHtml = data.gallery.map(g => `
      <div class="gallery-item ${g.col}" data-lightbox-src="${g.src}" data-lightbox-caption="${g.caption}">
        <img src="${g.src}" alt="${g.caption}" loading="lazy">
        <div class="gallery-caption-overlay">${g.caption}</div>
      </div>
    `).join('');

    drawerBody.innerHTML = `
      <div class="case-meta-header">
        <div class="case-eyebrow">${data.index}</div>
        <h2 class="case-hero-title">${data.title}</h2>
        <p class="case-lead-text">${data.lead}</p>
      </div>

      <div class="case-specs-table">
        ${specsHtml}
      </div>

      <div class="case-stages">
        ${stagesHtml}
      </div>

      <div class="case-gallery-section">
        <div class="case-gallery-heading" style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 14px;">Design & CAD Gallery · Click to enlarge</div>
        <div class="case-gallery-grid">
          ${galleryHtml}
        </div>
      </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-bind lightbox click events for dynamically generated gallery items
    initDynamicGalleryClicks();
  }

  function closeCase() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach(trig => {
    trig.addEventListener('click', (e) => {
      e.preventDefault();
      const id = trig.getAttribute('data-open-case');
      openCase(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCase);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCase();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeCase();
    }
  });
}

/* --------------------------------------------------------------------------
   06. FULLSCREEN IMAGE LIGHTBOX
   -------------------------------------------------------------------------- */
let activeLightboxIndex = 0;
let currentLightboxItems = [];

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal) return;

  function showImage(index) {
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

  function closeLightbox() {
    modal.classList.remove('active');
  }

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
  });
}

function initDynamicGalleryClicks() {
  const galleryItems = document.querySelectorAll('[data-lightbox-src]');
  const modal = document.getElementById('lightbox-modal');
  if (!galleryItems.length || !modal) return;

  currentLightboxItems = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-lightbox-src'),
    caption: item.getAttribute('data-lightbox-caption')
  }));

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      activeLightboxIndex = idx;
      const img = document.getElementById('lightbox-img');
      const cap = document.getElementById('lightbox-caption');
      img.src = currentLightboxItems[idx].src;
      cap.textContent = currentLightboxItems[idx].caption || '';
      modal.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   07. ONE-CLICK EMAIL COPY & TOAST
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toast-msg');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'thanushpatthas@gmail.com';

      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      }).catch(() => {
        // Fallback
        window.location.href = `mailto:${email}`;
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
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

  function switchPhoto(btn, targetBtn, src, badgeText) {
    btn.addEventListener('click', () => {
      btn.classList.add('active');
      targetBtn.classList.remove('active');

      portraitImg.style.opacity = '0';
      portraitImg.style.transform = 'scale(0.96)';

      setTimeout(() => {
        portraitImg.src = src;
        if (badge) badge.textContent = badgeText;
        portraitImg.style.opacity = '1';
        portraitImg.style.transform = 'scale(1)';
      }, 200);
    });
  }

  switchPhoto(btnStudio, btnFormal, 'Img/thanush_proffesional.png', 'STUDIO WORK MODE');
  switchPhoto(btnFormal, btnStudio, 'Img/formal_me.jpg', 'FORMAL PROFILE');
}

/* --------------------------------------------------------------------------
   09. INTERACTIVE 3D CAD MODELING VIEWPORT (THREE.JS ENGINE)
   Showcases Agomoto Acoustic Speaker Assembly with Wireframe/CMF/Clay & Explode
   -------------------------------------------------------------------------- */
function init3DCADViewport() {
  const container = document.getElementById('cad-canvas-container');
  if (!container) return;

  // Verify Three.js availability
  if (typeof THREE === 'undefined') {
    container.innerHTML = `
      <div style="padding: 24px; text-align: center; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
        [ THREE.JS 3D ENGINE LOADING... ]
      </div>
    `;
    return;
  }

  // Sizing
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 360;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
  camera.position.set(0, 0.6, 6.4);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(5, 8, 7);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x90b0e0, 0.5);
  fillLight.position.set(-6, -2, -4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xffffff, 0.7, 10);
  rimLight.position.set(0, 3, -3);
  scene.add(rimLight);

  // Root Assembly Group
  const assemblyGroup = new THREE.Group();
  scene.add(assemblyGroup);

  // Initial Rotation
  assemblyGroup.rotation.x = 0.28;
  assemblyGroup.rotation.y = -0.42;

  // ------------------------------------------------------------------------
  // MATERIAL PALETTES (CMF, WIREFRAME & CLAY)
  // ------------------------------------------------------------------------
  const materials = {
    cmfGold: new THREE.MeshStandardMaterial({
      color: 0xd4a55d,
      metalness: 0.85,
      roughness: 0.22,
      envMapIntensity: 1.0
    }),
    cmfAlloy: new THREE.MeshStandardMaterial({
      color: 0xc8ced6,
      metalness: 0.75,
      roughness: 0.35
    }),
    cmfDarkGraphite: new THREE.MeshStandardMaterial({
      color: 0x1c1e23,
      metalness: 0.4,
      roughness: 0.5
    }),
    cmfEmissiveBlue: new THREE.MeshStandardMaterial({
      color: 0x185adb,
      emissive: 0x185adb,
      emissiveIntensity: 0.9,
      roughness: 0.2
    }),
    wireframe: new THREE.MeshBasicMaterial({
      color: 0x185adb,
      wireframe: true
    }),
    clay: new THREE.MeshStandardMaterial({
      color: 0xdcdbd6,
      roughness: 0.92,
      metalness: 0.05
    })
  };

  let currentMode = 'cmf';

  // ------------------------------------------------------------------------
  // PARAMETRIC 3D GEOMETRY CONSTRUCTION (AGOMOTO ACOUSTIC SPEAKER)
  // ------------------------------------------------------------------------
  // Part 1: Main Acoustic Resonance Enclosure (Body)
  const partBody = new THREE.Group();
  const bodyGeo = new THREE.CylinderGeometry(1.3, 1.3, 2.0, 36);
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.cmfAlloy);
  partBody.add(bodyMesh);

  // Decorative CNC Cooling Fins
  for (let i = -0.6; i <= 0.6; i += 0.3) {
    const finGeo = new THREE.TorusGeometry(1.32, 0.025, 12, 36);
    const finMesh = new THREE.Mesh(finGeo, materials.cmfGold);
    finMesh.rotation.x = Math.PI / 2;
    finMesh.position.y = i;
    partBody.add(finMesh);
  }
  assemblyGroup.add(partBody);

  // Part 2: Base Pedestal Stand
  const partBase = new THREE.Group();
  const baseGeo = new THREE.CylinderGeometry(1.5, 1.65, 0.4, 32);
  const baseMesh = new THREE.Mesh(baseGeo, materials.cmfDarkGraphite);
  partBase.add(baseMesh);

  const baseRimGeo = new THREE.TorusGeometry(1.65, 0.04, 12, 36);
  const baseRimMesh = new THREE.Mesh(baseRimGeo, materials.cmfGold);
  baseRimMesh.rotation.x = Math.PI / 2;
  baseRimMesh.position.y = -0.18;
  partBase.add(baseRimMesh);
  partBase.position.y = -1.2;
  assemblyGroup.add(partBase);

  // Part 3: Inner Transducer Core & Magnetic Driver
  const partCore = new THREE.Group();
  const coreGeo = new THREE.CylinderGeometry(0.82, 0.82, 1.5, 24);
  const coreMesh = new THREE.Mesh(coreGeo, materials.cmfDarkGraphite);
  partCore.add(coreMesh);

  // Luminous Status Ring
  const coreStatusGeo = new THREE.TorusGeometry(0.85, 0.045, 16, 32);
  const coreStatusMesh = new THREE.Mesh(coreStatusGeo, materials.cmfEmissiveBlue);
  coreStatusMesh.rotation.x = Math.PI / 2;
  partCore.add(coreStatusMesh);
  partCore.position.z = -0.15;
  assemblyGroup.add(partCore);

  // Part 4: Acoustic Diaphragm Cone & Center Dust Dome
  const partDiaphragm = new THREE.Group();
  const coneGeo = new THREE.ConeGeometry(1.15, 0.55, 32, 1, true);
  const coneMesh = new THREE.Mesh(coneGeo, materials.cmfDarkGraphite);
  coneMesh.rotation.x = -Math.PI / 2;
  partDiaphragm.add(coneMesh);

  const domeGeo = new THREE.SphereGeometry(0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const domeMesh = new THREE.Mesh(domeGeo, materials.cmfGold);
  domeMesh.position.z = 0.28;
  domeMesh.rotation.x = Math.PI / 2;
  partDiaphragm.add(domeMesh);
  partDiaphragm.position.z = 0.45;
  assemblyGroup.add(partDiaphragm);

  // Part 5: Outer Suspension Ring & Protective Bracket (Eye of Agamotto)
  const partRing = new THREE.Group();
  const ringGeo = new THREE.TorusGeometry(1.68, 0.09, 16, 48);
  const ringMesh = new THREE.Mesh(ringGeo, materials.cmfGold);
  partRing.add(ringMesh);

  // 4 Radial Suspension Bracket Arms
  for (let a = 0; a < 4; a++) {
    const armGeo = new THREE.BoxGeometry(0.08, 0.4, 0.08);
    const armMesh = new THREE.Mesh(armGeo, materials.cmfAlloy);
    const angle = (a * Math.PI) / 2 + Math.PI / 4;
    armMesh.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
    armMesh.rotation.z = angle;
    partRing.add(armMesh);
  }
  partRing.position.z = 0.72;
  assemblyGroup.add(partRing);

  // Part 6: Top Knurled Volume Control Dial
  const partDial = new THREE.Group();
  const dialGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.28, 28);
  const dialMesh = new THREE.Mesh(dialGeo, materials.cmfGold);
  partDial.add(dialMesh);

  const dialIndicatorGeo = new THREE.BoxGeometry(0.06, 0.3, 0.12);
  const dialIndicatorMesh = new THREE.Mesh(dialIndicatorGeo, materials.cmfDarkGraphite);
  dialIndicatorMesh.position.set(0, 0, 0.3);
  partDial.add(dialIndicatorMesh);
  partDial.position.y = 1.15;
  assemblyGroup.add(partDial);

  // Reference Base Positions for Exploded Calculation
  const basePositions = {
    ringZ: 0.72,
    diaphragmZ: 0.45,
    coreZ: -0.15,
    dialY: 1.15,
    baseY: -1.2
  };

  // Exploded Assembly Function
  function updateExplodedAssembly(factor) {
    partRing.position.z = basePositions.ringZ + factor * 2.3;
    partDiaphragm.position.z = basePositions.diaphragmZ + factor * 1.5;
    partCore.position.z = basePositions.coreZ - factor * 1.6;
    partDial.position.y = basePositions.dialY + factor * 1.3;
    partBase.position.y = basePositions.baseY - factor * 1.3;
  }

  // ------------------------------------------------------------------------
  // RENDER MODE SWITCHER (SHADED CMF, WIREFRAME, CLAY)
  // ------------------------------------------------------------------------
  function setRenderMode(mode) {
    currentMode = mode;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    materials.wireframe.color.setHex(isDark ? 0x38bdf8 : 0x185adb);

    assemblyGroup.traverse((child) => {
      if (child.isMesh) {
        if (mode === 'wire') {
          child.material = materials.wireframe;
        } else if (mode === 'clay') {
          child.material = materials.clay;
        } else {
          // Restore CMF Palette
          if (child === ringMesh || child === domeMesh || child === dialMesh || child.geometry.type === 'TorusGeometry') {
            child.material = materials.cmfGold;
          } else if (child === coreStatusMesh) {
            child.material = materials.cmfEmissiveBlue;
          } else if (child === baseMesh || child === coneMesh || child === coreMesh || child === dialIndicatorMesh) {
            child.material = materials.cmfDarkGraphite;
          } else {
            child.material = materials.cmfAlloy;
          }
        }
      }
    });
  }

  // Mode Buttons
  const modeBtns = document.querySelectorAll('[data-cad-mode]');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setRenderMode(btn.getAttribute('data-cad-mode'));
    });
  });

  // Explode Slider
  const explodeSlider = document.getElementById('cad-explode-slider');
  const explodeValDisplay = document.getElementById('explode-val-display');

  if (explodeSlider) {
    explodeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const factor = val / 100;
      updateExplodedAssembly(factor);
      if (explodeValDisplay) explodeValDisplay.textContent = `${Math.round(val)}%`;
    });
  }

  // Turntable Auto-Rotate Button
  let autoRotate = true;
  const btnAutorotate = document.getElementById('cad-btn-autorotate');
  const autorotateIndicator = document.getElementById('autorotate-indicator');

  if (btnAutorotate) {
    btnAutorotate.addEventListener('click', () => {
      autoRotate = !autoRotate;
      btnAutorotate.classList.toggle('active', autoRotate);
      if (autorotateIndicator) autorotateIndicator.textContent = autoRotate ? '●' : '○';
    });
  }

  // Reset Camera View Button
  const btnReset = document.getElementById('cad-btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      assemblyGroup.rotation.x = 0.28;
      assemblyGroup.rotation.y = -0.42;
      camera.position.set(0, 0.6, 6.4);
      if (explodeSlider) {
        explodeSlider.value = 0;
        updateExplodedAssembly(0);
        if (explodeValDisplay) explodeValDisplay.textContent = '0%';
      }
    });
  }

  // ------------------------------------------------------------------------
  // MOUSE & TOUCH ORBIT INTERACTION
  // ------------------------------------------------------------------------
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  const coordsElem = document.getElementById('cad-coords');

  function updateCoordsReadout() {
    if (!coordsElem) return;
    const degX = Math.round(assemblyGroup.rotation.x * (180 / Math.PI));
    const degY = Math.round(assemblyGroup.rotation.y * (180 / Math.PI)) % 360;
    coordsElem.textContent = `ROT: ${degX}° // ${degY}°`;
  }

  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevPointerX;
    const dy = e.clientY - prevPointerY;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;

    assemblyGroup.rotation.y += dx * 0.008;
    assemblyGroup.rotation.x += dy * 0.008;
    assemblyGroup.rotation.x = Math.max(-0.9, Math.min(0.9, assemblyGroup.rotation.x));
    updateCoordsReadout();
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });

  // Wheel Zoom
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.004;
    camera.position.z = Math.max(4.2, Math.min(8.8, camera.position.z));
  }, { passive: false });

  // Responsive Resize
  window.addEventListener('resize', () => {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    if (!newW || !newH) return;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });

  // Listen for Dark/Light mode change to sync wireframe color
  const themeObserver = new MutationObserver(() => {
    if (currentMode === 'wire') setRenderMode('wire');
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ------------------------------------------------------------------------
  // ANIMATION LOOP
  // ------------------------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);

    if (autoRotate && !isDragging) {
      assemblyGroup.rotation.y += 0.006;
      updateCoordsReadout();
    }

    renderer.render(scene, camera);
  }

  animate();
  updateCoordsReadout();
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

  window.addEventListener('mouseleave', () => {
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

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* --------------------------------------------------------------------------
   09. INTERACTIVE DRAFTING LIGHT TABLE (CURSOR SPOTLIGHT)
   -------------------------------------------------------------------------- */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursor-spotlight');
  if (!spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let fadeTimeout = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.style.opacity = '1';

    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      // Softly reduce intensity when cursor is stationary
      spotlight.style.opacity = '0.7';
    }, 1800);
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });

  function renderSpotlight() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(renderSpotlight);
  }

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
    drawer.classList.remove('active');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
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



