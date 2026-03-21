/* ═══════════════════════════
   KHATIB365 · main.js
   ═══════════════════════════ */

// ── NAV: scroll class & mobile toggle ──
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  const bars = navToggle.querySelectorAll('span');
  if (open) {
    bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    bars[1].style.opacity   = '0';
    bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    navToggle.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  });
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll(
  '.hero-left, .about-photo-col, .about-content, ' +
  '.skills-header, .skill-card, ' +
  '.blog-header, .blog-featured, .blog-card, ' +
  '.contact-header, .contact-open, .hero-scroll-hint'
);
reveals.forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in'), Number(delay));
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

['skill-card', 'blog-card'].forEach(cls => {
  document.querySelectorAll(`.${cls}`).forEach((el, i) => { el.dataset.delay = i * 70; });
});
reveals.forEach(el => revealObs.observe(el));

// ── ACTIVE NAV LINK ──
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-link:not(.nav-link--cta)');
const anchorLinks = [...navAnchors].filter(a => a.getAttribute('href').startsWith('#'));

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      anchorLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--copper)' : '';
      });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => sectionObs.observe(s));

// ── NAV BRAND ──
const navBrand = document.querySelector('.nav-brand');
if (navBrand) {
  navBrand.addEventListener('click', e => {
    const href = navBrand.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ════════════════════════════════════════════════
// PARTICLE NETWORK CANVAS — Interactive
// ════════════════════════════════════════════════
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, rafId;
  let mouse   = { x: -9999, y: -9999 };
  let ripples = [];

  // ── Full tech stack ──
  const TECH = [
    // Power Platform
    { label: 'Canvas Apps',     r: 3.8, cat: 'pp'   },
    { label: 'Model-Driven',    r: 3.4, cat: 'pp'   },
    { label: 'Power Automate',  r: 3.6, cat: 'pp'   },
    { label: 'Power Pages',     r: 3.0, cat: 'pp'   },
    { label: 'Power BI',        r: 3.2, cat: 'pp'   },
    { label: 'AI Builder',      r: 2.8, cat: 'pp'   },
    { label: 'Copilot Studio',  r: 3.0, cat: 'pp'   },
    { label: 'Power Fx',        r: 2.4, cat: 'pp'   },
    // Dataverse & D365
    { label: 'Dataverse',       r: 3.8, cat: 'dv'   },
    { label: 'Dynamics 365 CE', r: 3.4, cat: 'dv'   },
    { label: 'D365 F&O',        r: 3.0, cat: 'dv'   },
    { label: 'Custom APIs',     r: 2.6, cat: 'dv'   },
    { label: 'Plugins',         r: 2.4, cat: 'dv'   },
    { label: 'Business Events', r: 2.4, cat: 'dv'   },
    // Pro-code
    { label: 'PCF Controls',    r: 2.8, cat: 'code' },
    { label: 'TypeScript',      r: 2.6, cat: 'code' },
    { label: 'C#',              r: 2.4, cat: 'code' },
    { label: 'JavaScript',      r: 2.2, cat: 'code' },
    // Azure
    { label: 'Azure Functions', r: 3.4, cat: 'az'   },
    { label: 'Logic Apps',      r: 3.0, cat: 'az'   },
    { label: 'API Management',  r: 2.8, cat: 'az'   },
    { label: 'Service Bus',     r: 2.6, cat: 'az'   },
    { label: 'Azure OpenAI',    r: 3.2, cat: 'az'   },
    { label: 'Key Vault',       r: 2.4, cat: 'az'   },
    { label: 'App Insights',    r: 2.4, cat: 'az'   },
    { label: 'Entra ID',        r: 2.6, cat: 'az'   },
    // ALM & DevOps
    { label: 'Azure DevOps',    r: 3.0, cat: 'alm'  },
    { label: 'ALM',             r: 2.6, cat: 'alm'  },
    { label: 'Pipelines',       r: 2.4, cat: 'alm'  },
  ];

  const CAT_COLORS = {
    pp:   [  0, 120, 212],  // Power Platform blue
    dv:   [123,  94, 167],  // Dataverse purple
    az:   [  0, 145, 178],  // Azure teal
    code: [196, 122,  74],  // Copper
    alm:  [ 16, 124,  16],  // DevOps green
  };

  const TOTAL             = 58;
  const MAX_DIST          = 130;
  const BASE_SPEED        = 0.28;
  const ATTRACT_DIST      = 190;
  const ATTRACT_FORCE     = 0.013;
  const MAX_SPEED         = 3.0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle(i) {
    const tl  = i < TECH.length ? TECH[i] : null;
    const cat = tl ? tl.cat : Object.keys(CAT_COLORS)[i % 5];
    const col = CAT_COLORS[cat];
    return {
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * BASE_SPEED,
      vy:      (Math.random() - 0.5) * BASE_SPEED,
      r:       tl ? tl.r : (Math.random() * 1.2 + 0.6),
      label:   tl ? tl.label : null,
      a:       Math.random() * 0.35 + 0.25,
      glow:    tl ? 20 : 7,
      col,
      pulse:   0,
      hovered: false,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: TOTAL }, (_, i) => makeParticle(i));
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Ripple rings from clicks
    ripples = ripples.filter(rp => rp.a > 0);
    ripples.forEach(rp => {
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(196,122,74,${rp.a})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      rp.r += 4;
      rp.a -= 0.022;
    });

    // Find closest labeled particle to mouse (for hover)
    let hoveredParticle = null;
    let minDist = 44;
    particles.forEach(p => {
      if (!p.label) return;
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) { minDist = d; hoveredParticle = p; }
    });
    particles.forEach(p => { p.hovered = (p === hoveredParticle); });

    // Connection lines — brighten near cursor
    for (let i = 0; i < particles.length; i++) {
      const pi = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const pj  = particles[j];
        const dx  = pi.x - pj.x, dy = pi.y - pj.y;
        const d   = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const [r1, g1, b1] = pi.col;
          const [r2, g2, b2] = pj.col;
          const r = (r1 + r2) / 2, g = (g1 + g2) / 2, b = (b1 + b2) / 2;
          const base  = (1 - d / MAX_DIST) * 0.22;
          const mdx   = (pi.x + pj.x) / 2 - mouse.x;
          const mdy   = (pi.y + pj.y) / 2 - mouse.y;
          const md    = Math.sqrt(mdx * mdx + mdy * mdy);
          const boost = md < 110 ? (1 - md / 110) * 0.45 : 0;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${base + boost})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.stroke();
        }
      }
    }

    // Particles
    particles.forEach(p => {
      // Mouse attraction
      const dxm = mouse.x - p.x, dym = mouse.y - p.y;
      const dm  = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < ATTRACT_DIST && dm > 1) {
        p.vx += (dxm / dm) * ATTRACT_FORCE;
        p.vy += (dym / dm) * ATTRACT_FORCE;
      }

      // Speed cap
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > MAX_SPEED) { p.vx *= MAX_SPEED / spd; p.vy *= MAX_SPEED / spd; }

      // Gentle damping when mouse is away
      if (dm > ATTRACT_DIST) { p.vx *= 0.995; p.vy *= 0.995; }

      // Move — wrap edges
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -30) p.x = W + 30;
      else if (p.x > W + 30) p.x = -30;
      if (p.y < -30) p.y = H + 30;
      else if (p.y > H + 30) p.y = -30;

      const [r, g, b] = p.col;
      const isHov = p.hovered;

      // Pulse on hover
      if (isHov) p.pulse += 0.09;
      else if (p.pulse > 0) p.pulse = Math.max(0, p.pulse - 0.06);

      const scale   = isHov ? 1 + Math.sin(p.pulse) * 0.45 : 1;
      const drawR   = p.r * scale;
      const drawGlow = p.glow * (isHov ? 2.2 : 1);
      const alpha   = isHov ? Math.min(p.a + 0.55, 1) : p.a;

      // Glow halo
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawGlow);
      grd.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.85})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, drawGlow, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha + 0.4, 1)})`;
      ctx.fill();

      // Label
      if (p.label) {
        const fontSize   = isHov ? 11 : 9.5;
        const labelAlpha = isHov ? 1 : (p.a + 0.1);
        ctx.font      = `${isHov ? '500 ' : ''}${fontSize}px "Fira Code", monospace`;
        ctx.fillStyle = `rgba(220,205,185,${labelAlpha})`;
        ctx.fillText(p.label, p.x + drawR + 5, p.y + 3.5);
      }
    });

    rafId = requestAnimationFrame(frame);
  }

  // ── Mouse events ──
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  // Click → repulsion burst + ripple rings
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    particles.forEach(p => {
      const dx = p.x - cx, dy = p.y - cy;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 170 && d > 0) {
        const force = ((170 - d) / 170) * 2.8;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
    });

    // Two staggered ripple rings
    ripples.push({ x: cx, y: cy, r: 4, a: 0.85 });
    setTimeout(() => ripples.push({ x: cx, y: cy, r: 4, a: 0.5 }), 120);
  });

  canvas.style.cursor = 'crosshair';

  init();
  frame();

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => { cancelAnimationFrame(rafId); init(); frame(); }).observe(canvas.parentElement);
  } else {
    window.addEventListener('resize', () => { cancelAnimationFrame(rafId); init(); frame(); });
  }
})();

// ════════════════════════════════════════════════
// SARCASTIC FULL-SCREEN MODAL
// ════════════════════════════════════════════════
(function initSardonicModal() {
  const modal      = document.getElementById('sardonicModal');
  if (!modal) return;

  const titleEl    = document.getElementById('sardonicTitle');
  const bodyEl     = document.getElementById('sardonicBody');
  const emojiEl    = document.getElementById('sardonicEmoji');
  const dismissBtn = document.getElementById('sardonicDismiss');
  const backdrop   = document.getElementById('sardonicBackdrop');

  const tips = [
    {
      emoji: '🙃',
      title: "You're About to Deploy Unmanaged, Aren't You.",
      body:  "It'll be fine. It won't be fine. This is a judgment-free zone — except it's not. Deploy managed, or don't deploy at all."
    },
    {
      emoji: '💀',
      title: "Bold Choice, Hardcoding That URL.",
      body:  "That connection string you just pasted directly into 23 flows? It's wrong in every environment except the laptop you're holding right now. You know what to do."
    },
    {
      emoji: '🔥',
      title: "No Security Groups on the Environment? Love That.",
      body:  "You invited everyone directly by email. No security group. Everyone is now effectively a System Administrator. The auditors will have opinions."
    },
    {
      emoji: '😭',
      title: "One Solution. Everything in It. Respect the Courage.",
      body:  "The data model, the apps, the flows, the PCF controls — all in one glorious solution. Future-you is already filing the therapy paperwork."
    },
    {
      emoji: '👀',
      title: "It Works in Dev. That's Basically Done, Right?",
      body:  "Dev passed. Test passed. Prod is a different country with different laws, different environment variables, and it has never once heard of your hardcoded service account."
    },
    {
      emoji: '😬',
      title: "Polling Every Minute? That's a Lifestyle Choice.",
      body:  "Your scheduled flow runs 1,440 times a day and finds nothing to process 1,437 of those times. Your API provider has entered the building."
    },
    {
      emoji: '🫠',
      title: "Three Publisher Prefixes. In One Org.",
      body:  "You mixed publisher prefixes across solutions that share the same tables. You have created something that cannot be undone. This is your legacy now."
    },
    {
      emoji: '🤦',
      title: "Synchronous Plugin on a 10,000 Row Import.",
      body:  "You're about to block the entire transaction thread while processing ten thousand records. The waiting room is open and they are not happy."
    },
    {
      emoji: '🚨',
      title: "No DLP Policies. Living on the Edge, I See.",
      body:  "Anyone in your org can now connect Power Automate to personal Gmail, Dropbox, and Twitter simultaneously. This is what 'minimal governance' looks like in production."
    },
    {
      emoji: '⚡',
      title: "Environment Variables Are Optional, Right?",
      body:  "The service account email is hardcoded in 47 different flows. That person just left the company. Please update your emergency contact list immediately."
    }
  ];

  const tip = tips[Math.floor(Math.random() * tips.length)];
  emojiEl.textContent = tip.emoji;
  titleEl.textContent = tip.title;
  bodyEl.textContent  = tip.body;

  function closeModal() {
    modal.classList.remove('visible');
    modal.classList.add('hiding');
    setTimeout(() => modal.classList.add('hidden'), 500);
  }

  // Wire close triggers
  dismissBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Show after short delay
  setTimeout(() => modal.classList.add('visible'), 700);
})();
