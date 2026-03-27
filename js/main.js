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
    // Canvas Apps
    {
      tip: "Stop loading everything in App.OnStart — use Named Formulas in App.Formulas instead.",
      explanation: "❌ <strong>The problem:</strong> Putting all your Set() and Collect() calls in App.OnStart forces the app to execute every single initialization step before the user sees anything. The more you add, the longer the loading spinner stays on screen.<br><br>✅ <strong>The fix:</strong> Move your variable and collection initialization to Named Formulas in App.Formulas. Power Apps evaluates named formulas lazily — only when their value is actually needed — which dramatically reduces startup time and makes your app feel instant.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/working-with-large-apps\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Use With() instead of stacking context variables — it's scoped, clean, and leaves no state behind.",
      explanation: "❌ <strong>The problem:</strong> Developers often use UpdateContext() or Set() to store intermediate values inside a formula, which creates variables that live beyond their purpose, pollute the app scope, and make formulas harder to read and debug.<br><br>✅ <strong>The fix:</strong> Use the With() function to create named sub-values scoped only to the formula that needs them. With() is self-contained, works in any declarative formula context, and doesn't leave state behind. Think of it as a clean local variable — use it, discard it.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/guidance/coding-guidelines/code-optimization\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Named Formulas are not variables. Stop using them like one.",
      explanation: "❌ <strong>The problem:</strong> Many developers discover Named Formulas and start using them as a replacement for Set() everywhere — not realizing that named formulas can't hold mutable state. They're constants that recalculate automatically, not writable variables.<br><br>✅ <strong>The fix:</strong> Use Named Formulas for values that are derived, calculated, or always up to date — like theme colors, filtered datasets, or computed labels. Use Set() only when you actually need to store user-driven or mutable state. Mixing these up causes logic bugs that are hard to trace.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/efficient-calculations\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Enable Explicit Column Selection. Your older apps are fetching every column you never asked for.",
      explanation: "❌ <strong>The problem:</strong> Without Explicit Column Selection (ECS), Canvas Apps retrieve every column from your data source on every request — even ones your app never uses. On large Dataverse tables with many columns, this silently kills performance.<br><br>✅ <strong>The fix:</strong> ECS is enabled by default for new apps, but older apps may not have it. Check your app settings and enable it. Once active, Power Apps automatically reduces column retrieval to only what's referenced in your formulas. Less data over the wire, faster app.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/efficient-calculations\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Wrap independent data calls in Concurrent() on app load. Sequential loading is suffering on a schedule.",
      explanation: "❌ <strong>The problem:</strong> When your app loads three or four data sources sequentially — one after another — the total load time is the sum of all those round trips. On slow networks or large datasets, this stacks up fast.<br><br>✅ <strong>The fix:</strong> Wrap independent data calls inside the Concurrent() function. Power Apps will fire them simultaneously and wait for all to complete before continuing. If your calls don't depend on each other, there's no reason to run them one by one.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/guidance/coding-guidelines/code-optimization\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    // Power Automate
    {
      tip: "Implement Try / Catch / Finally with Scopes. A flow with no error handling is a ticking clock.",
      explanation: "❌ <strong>The problem:</strong> Most flows have zero error handling. When something fails, the flow stops, the user gets no feedback, the business process silently breaks, and nobody knows until someone notices the data is wrong — usually too late.<br><br>✅ <strong>The fix:</strong> Wrap your logic in a Try scope. Add a Catch scope configured to run only when the Try fails using \"Configure Run After.\" Add a Finally scope that always runs for cleanup. Inside Catch, log the error and send a notification with the actual error message using the actions() expression. Terminate with \"Failed\" status so the flow history reflects reality.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Use Parallel Branches for independent actions. Sequential by default is slow by design.",
      explanation: "❌ <strong>The problem:</strong> Developers build flows as a straight vertical list of actions — even when those actions have no dependency on each other. Sending an email, updating a SharePoint item, and posting to Teams all run one after the other, when they could run simultaneously.<br><br>✅ <strong>The fix:</strong> Use Parallel Branches to run independent actions at the same time. Also enable concurrency on Apply to Each loops when order doesn't matter — you can set the degree of parallelism up to 50. Less total execution time, same outcome.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/implement-parallel-execution\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Set Retry Policy to Exponential Backoff on every external call. Fixed intervals hit throttled services at the same cadence every time.",
      explanation: "❌ <strong>The problem:</strong> The default retry policy in Power Automate retries on a fixed interval — meaning if a service is throttled or temporarily down, all retry attempts hit it at the same cadence and usually all fail for the same reason.<br><br>✅ <strong>The fix:</strong> Change the retry policy of external connector actions to Exponential Backoff. This increases the delay between each retry attempt, giving the downstream service time to recover. Set it in the action's Settings panel. This is especially important for Dynamics 365, SharePoint, and any API with throttling limits.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Control your trigger concurrency. Simultaneous flow instances on the same records means race conditions and corrupted data.",
      explanation: "❌ <strong>The problem:</strong> When a trigger fires multiple times in quick succession — like a high-volume SharePoint list or a busy Dataverse table — Power Automate spins up multiple instances of the same flow simultaneously. If those instances read and write the same records, you get dirty reads, race conditions, and corrupted data.<br><br>✅ <strong>The fix:</strong> Enable Concurrency Control on your trigger and set the degree of parallelism to 1 if your flow must process records one at a time. Be aware: this setting is irreversible on the existing flow — you'll need to create a new flow to remove it. Apply it deliberately, not as an afterthought.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Use Child Flows for reusable logic. The same pattern in three flows is three places to miss a fix.",
      explanation: "❌ <strong>The problem:</strong> Teams build the same error notification block, the same approval pattern, or the same data transformation in flow after flow. When something needs to change, it has to be updated in every copy — and someone always misses one.<br><br>✅ <strong>The fix:</strong> Extract reusable logic into a Child Flow triggered by \"PowerApps or Power Automate.\" Call it from your parent flows using the \"Run a Child Flow\" action. One place to maintain, consistent behavior everywhere. Apply this especially to error handling, notifications, and shared business logic.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/implement-parallel-execution\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    // Dataverse Plugins
    {
      tip: "PreValidation, PreOperation, PostOperation are not interchangeable — getting them wrong means rollbacks and bad UX.",
      explanation: "❌ <strong>The problem:</strong> Developers often register all plugin logic in PostOperation because \"the record already exists by then.\" But PostOperation runs inside the database transaction — throwing an exception there causes a full rollback and a poor user experience.<br><br>✅ <strong>The fix:</strong> Use PreValidation to validate and cancel the operation cleanly before any transaction begins — this is where InvalidPluginExecutionException belongs. Use PreOperation to modify input values before they're written. Use PostOperation (async) for side effects that don't need to block the user — like sending notifications or triggering integrations.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/developer/data-platform/event-framework\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Use Pre-Entity Images to get old field values. Querying inside a plugin is an extra database call inside a running transaction.",
      explanation: "❌ <strong>The problem:</strong> When you need the value of a field before an Update operation, developers often call IOrganizationService.Retrieve() inside the plugin to fetch the current record. This fires an extra database call inside an already-running transaction — a serious performance hit.<br><br>✅ <strong>The fix:</strong> Register a Pre-Entity Image on your plugin step and specify only the columns you need. Dataverse captures a snapshot of the record before the operation and passes it directly to your plugin context via PreEntityImages. No extra query needed — the data is already there.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/developer/data-platform/register-plug-in\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Always use ITracingService. A plugin without trace logs is a black box — and you're the one debugging it at midnight.",
      explanation: "❌ <strong>The problem:</strong> Plugins that don't write to the tracing service are almost impossible to debug in production. When something goes wrong, you have no visibility into what the plugin was doing, what values it saw, or where exactly it failed.<br><br>✅ <strong>The fix:</strong> Always obtain ITracingService at the start of your Execute method and write trace messages at every meaningful step. Enable Plugin Trace Log in your environment settings. When a plugin throws, the trace log is the first place to look — and if you didn't write to it, you're debugging blind.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/developer/data-platform/write-plug-in\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Never use static fields or class-level state in a plugin. Dataverse reuses instances and your state bleeds across calls.",
      explanation: "❌ <strong>The problem:</strong> Dataverse may reuse the same plugin class instance across multiple executions. If you store state in static fields or instance variables outside the Execute method, that state bleeds across different plugin invocations — leading to race conditions, data corruption, and bugs that only appear under load.<br><br>✅ <strong>The fix:</strong> Keep all state inside the Execute method. Treat each plugin execution as completely stateless and isolated. The only things your plugin should hold at class level are constants and constructor-injected configuration — never mutable state.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/developer/data-platform/best-practices/business-logic/\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
    {
      tip: "Register PostOperation side effects as Async. Sync plugins block the user — and if they time out, the transaction fails.",
      explanation: "❌ <strong>The problem:</strong> Synchronous PostOperation plugins block the user's save operation until they complete. If your plugin sends an email, calls an external API, or does any heavy processing synchronously, the user stares at a loading screen — and if the plugin times out, the whole transaction fails.<br><br>✅ <strong>The fix:</strong> Register side-effect logic — notifications, integrations, logging, downstream record creation — as Asynchronous in PostOperation. The record saves immediately, the user moves on, and Dataverse processes your plugin in the background. Reserve synchronous execution only for logic that must block the operation.<br><br>📖 <a href=\"https://learn.microsoft.com/en-us/power-apps/developer/data-platform/event-framework\" target=\"_blank\" rel=\"noopener noreferrer\">Learn more →</a>"
    },
  ];

  const picked = tips[Math.floor(Math.random() * tips.length)];
  emojiEl.textContent = '';
  titleEl.textContent = picked.tip;
  bodyEl.textContent  = '';

  const infoBtn      = document.getElementById('sardonicInfoBtn');
  const explanation  = document.getElementById('sardonicExplanation');
  const explanText   = document.getElementById('sardonicExplanationText');
  explanText.innerHTML = picked.explanation;
  infoBtn.addEventListener('click', () => {
    const isHidden = explanation.hasAttribute('hidden');
    if (isHidden) {
      explanation.removeAttribute('hidden');
      infoBtn.setAttribute('aria-pressed', 'true');
    } else {
      explanation.setAttribute('hidden', '');
      infoBtn.setAttribute('aria-pressed', 'false');
    }
  });

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

// ════════════════════════════════════════════════
// ENVIRONMENT HEALTH CHECK EASTER EGG
// ════════════════════════════════════════════════
(function initHealthModal() {
  const modal      = document.getElementById('health-modal');
  if (!modal) return;
  const findingsEl = document.getElementById('health-findings');
  const footerEl   = document.getElementById('health-footer');
  const statusEl   = document.getElementById('health-status');

  const findings = [
    { icon: '❌', text: 'Default environment in active use' },
    { icon: '❌', text: 'org7382847.crm4.dynamics.com detected in production' },
    { icon: '❌', text: "Service account tied to a real person's email" },
    { icon: '❌', text: 'Unmanaged solution imported to Production' },
    { icon: '❌', text: '47 flows running without error handling' },
    { icon: '⚠️',  text: 'Publisher prefix: new_' },
    { icon: '⚠️',  text: 'Documentation last updated: never' },
    { icon: '✅',  text: "At least you're reading this blog" }
  ];

  function openHealthModal() {
    findingsEl.innerHTML = '';
    footerEl.style.display = 'none';
    statusEl.textContent = 'Scanning your tenant...';
    modal.style.display = 'flex';
    findings.forEach((f, i) => {
      setTimeout(() => {
        const li = document.createElement('li');
        li.className = 'health-finding';
        li.innerHTML = `<span class="health-finding-icon">${f.icon}</span><span>${f.text}</span>`;
        findingsEl.appendChild(li);
        if (i === findings.length - 1) {
          setTimeout(() => {
            statusEl.textContent = 'Scan complete.';
            footerEl.style.display = 'block';
          }, 300);
        }
      }, i * 400);
    });
  }

  window.closeHealthModal = function() { modal.style.display = 'none'; };
  modal.addEventListener('click', e => { if (e.target === modal) window.closeHealthModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') window.closeHealthModal();
  });

  // Triple-click Easter egg on nav brand
  const navBrand = document.getElementById('navBrand');
  if (!navBrand) return;
  let clickCount = 0, clickTimer = null;
  navBrand.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 1) clickTimer = setTimeout(() => { clickCount = 0; }, 1500);
    if (clickCount >= 3) {
      clearTimeout(clickTimer);
      clickCount = 0;
      openHealthModal();
    }
  });
})();

// ════════════════════════════════════════════════
// FOOTER — COMMIT MESSAGE + UPTIME
// ════════════════════════════════════════════════
(function initFooterEggs() {
  const commits = [
    "fix: fixed the fix that fixed the previous fix",
    "hotfix: please work",
    "temp: do not push to prod (pushing to prod)",
    "chore: removed todo comments (left the todos)",
    "refactor: same code, more confidence",
    "fix: it works now (reason unknown)",
    "wip: not wip anymore, shipping anyway",
    "feat: added feature client didn't ask for but definitely needs",
    "hotfix: prod is fine, this is fine, everything is fine",
    "fix: reverted the revert of the revert",
    "style: moved semicolon 1px to the right",
    "docs: added comment explaining what the code does (incorrectly)",
    "fix: null check (too late)",
    "feat: environment variables (they were hardcoded until today)",
    "deploy: fingers crossed",
    "fix: works on my machine (adding my machine to prod)",
    "chore: deleted unused code (it will be needed next week)",
    "feat: error handling (catching and ignoring)",
    "fix: race condition by adding setTimeout 1000",
    "hotfix: unrelated change that somehow fixes everything"
  ];

  const msgEl = document.getElementById('footer-commit-msg');
  if (msgEl) msgEl.textContent = commits[Math.floor(Math.random() * commits.length)];

  const uptimeEl = document.getElementById('status-uptime');
  if (uptimeEl) uptimeEl.textContent =
    'Khatib365 up for ' +
    Math.floor((Date.now() - new Date('2026-03-01').getTime()) / 86400000) + ' days';
})();
