/**
 * Tobias Strauss — portfolio behaviour
 * Load sequence (home), sticky nav state, mobile menu, scroll reveals,
 * cursor-lit project cards, flip handling, counting stats, skill filtering,
 * copy-to-clipboard, print, and a quiet particle field that answers to the
 * cursor. Everything degrades if JS or the CDN fails.
 */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initSkipLink();
  initTheme();
  initNav();
  initProjectCards();
  initSkillFilter();
  initCopyButtons();
  initPrintButtons();
  initYear();
  initParticles();

  // On the home page the scroll reveals wait until the intro has lifted, so
  // the hero is choreographed in instead of already sitting there.
  const revealPage = () => {
    initReveal();
    initCounters();
  };
  if (!initIntro(revealPage)) revealPage();
});

/* ============================================================
   LOAD SEQUENCE (home)
   <head> flags <html class="has-intro"> before first paint; the CSS holds
   the hero back and plays the overlay. Once the progress bar has filled we
   flag .is-loaded, the overlay wipes away and the hero animates in.
   Returns true when the page reveal has been handed to the callback.
   ============================================================ */
const INTRO_FAILSAFE_MS = 2600;
const INTRO_REVEAL_MS = 320;
const INTRO_EXIT_MS = 900;

function initIntro(onRevealed) {
  const html = document.documentElement;
  const intro = document.getElementById("intro");

  if (!intro || !html.classList.contains("has-intro")) return false;

  if (REDUCED_MOTION) {
    html.classList.add("is-loaded");
    intro.remove();
    return false;
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;

    html.classList.add("is-loaded");
    safeSessionSet("intro-played", "1");

    // Let the wipe get going before the reveals start, then drop the overlay.
    setTimeout(onRevealed, INTRO_REVEAL_MS);
    setTimeout(() => intro.remove(), INTRO_EXIT_MS);
  };

  const bar = intro.querySelector(".intro-bar-fill");
  if (bar) {
    bar.addEventListener("animationend", (e) => {
      if (e.animationName === "intro-fill") finish();
    });

    // If we arrive late (slow script) and the bar has already filled, go now.
    if (typeof bar.getAnimations === "function") {
      const done = bar.getAnimations().some((a) => a.playState === "finished");
      if (done || html.classList.contains("is-loaded")) finish();
    }
  }

  // Never leave a visitor behind the overlay.
  setTimeout(finish, INTRO_FAILSAFE_MS);
  return true;
}

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const stored = safeGet("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const isLight = stored ? stored === "light" : prefersLight;

  applyTheme(isLight);

  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const next = !document.body.classList.contains("light-mode");
    applyTheme(next);
    safeSet("theme", next ? "light" : "dark");
    restartParticles();
  });
}

function applyTheme(isLight) {
  document.body.classList.toggle("light-mode", isLight);
  const icon = document.querySelector("#theme-toggle i");
  if (icon) {
    icon.classList.toggle("fa-sun", isLight);
    icon.classList.toggle("fa-moon", !isLight);
  }
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  }
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav = document.querySelector(".navbar");
  const links = document.getElementById("nav-links");
  const toggle = document.getElementById("nav-toggle");

  if (nav) {
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (!links || !toggle) return;

  const close = () => {
    links.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = links.classList.toggle("active");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", close));

  document.addEventListener("click", (e) => {
    if (!links.contains(e.target) && e.target !== toggle) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ============================================================
   SCROLL REVEALS
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll(".fade-in");
  if (!els.length) return;

  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let staggered = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = staggered++ * 70;
        setTimeout(() => entry.target.classList.add("active"), delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

/* ============================================================
   PROJECT CARDS — cursor glow + flip
   ============================================================ */
function initProjectCards() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const front = card.querySelector(".project-card-front");

    if (front && !REDUCED_MOTION) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        front.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        front.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    }

    const flip = () => {
      const wasFlipped = card.classList.contains("flipped");
      cards.forEach((c) => c.classList.remove("flipped"));
      card.classList.toggle("flipped", !wasFlipped);
    };

    card.querySelectorAll(".flip-button").forEach((btn) => {
      btn.setAttribute("aria-label", "Show details");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        flip();
      });
    });
  });

  document.addEventListener("click", (e) => {
    cards.forEach((card) => {
      if (card.classList.contains("flipped") && !card.contains(e.target)) {
        card.classList.remove("flipped");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cards.forEach((c) => c.classList.remove("flipped"));
  });
}

/* ============================================================
   COUNTING STATS
   The markup already contains the final value, so this only ever
   makes an already-correct number more interesting.
   ============================================================ */
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  const format = (value) => Number(value).toLocaleString("en-US");

  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    els.forEach((el) => (el.textContent = format(el.dataset.count)));
    return;
  }

  const run = (el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;

    const duration = 900;
    let startedAt = null;

    const step = (now) => {
      if (startedAt === null) startedAt = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => observer.observe(el));
}

/* ============================================================
   SKILL FILTER (resume page)
   ============================================================ */
function initSkillFilter() {
  const chips = document.querySelectorAll(".skills-categories .skill-category");
  const items = document.querySelectorAll(".skill-item");
  if (!chips.length || !items.length) return;

  chips.forEach((chip) => {
    chip.setAttribute("role", "button");
    chip.setAttribute("tabindex", "0");

    const activate = () => {
      chips.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");

      const selected = chip.dataset.category;
      items.forEach((item) => {
        item.hidden = selected !== "all" && item.dataset.category !== selected;
      });
    };

    chip.addEventListener("click", activate);
    chip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });
}

/* ============================================================
   COPY TO CLIPBOARD (contact page)
   ============================================================ */
function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const original = btn.textContent;
        btn.textContent = "copied";
        setTimeout(() => (btn.textContent = original), 1600);
      } catch (_) {
        /* clipboard blocked — the address is visible next to the button anyway */
      }
    });
  });
}

/* ============================================================
   PRINT (resume page)
   ============================================================ */
function initPrintButtons() {
  document.querySelectorAll("[data-print]").forEach((btn) => {
    btn.addEventListener("click", () => window.print());
  });
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

/* ============================================================
   SKIP LINK
   ============================================================ */
function initSkipLink() {
  if (document.querySelector(".skip-to-content")) return;
  const main = document.querySelector("main, [id='content'], section");
  if (main && !main.id) main.id = "content";
  const link = document.createElement("a");
  link.className = "skip-to-content";
  link.href = `#${main ? main.id : "content"}`;
  link.textContent = "Skip to content";
  document.body.prepend(link);
}

/* ============================================================
   PARTICLE FIELD
   Atmosphere, not the subject: few nodes, slow drift, gold at low opacity.
   The cursor grabs nearby nodes, and a click on empty space drops a new
   node right there. The click is handled by us rather than the library so
   the count stays capped and clicks on controls are left alone. Restarts
   (theme, resize) stop the previous draw loop instead of leaking it.
   ============================================================ */
const PARTICLES_MIN_WIDTH = 700;
const PARTICLES_MAX_NODES = 120;
const NO_SPAWN_TARGETS =
  "a, button, input, select, textarea, label, summary, [role='button'], [contenteditable]";

let particleClicksBound = false;

function particlesAllowed() {
  return (
    !REDUCED_MOTION &&
    window.innerWidth >= PARTICLES_MIN_WIDTH &&
    typeof particlesJS === "function" &&
    !!document.getElementById("interactive-bg")
  );
}

function initParticles() {
  if (!particlesAllowed()) return;
  runParticles();
  bindParticleClicks();
}

function runParticles() {
  const host = document.getElementById("interactive-bg");
  if (!host || typeof particlesJS !== "function") return;

  destroyParticles();
  host.innerHTML = "";

  const gold = document.body.classList.contains("light-mode") ? "#b57800" : "#ffc93c";

  particlesJS("interactive-bg", {
    particles: {
      number: { value: 34, density: { enable: true, value_area: 1100 } },
      color: { value: gold },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: false, anim: { enable: false } },
      size: { value: 2.2, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 180, color: gold, opacity: 0.16, width: 1 },
      move: {
        enable: true,
        speed: 0.45,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: false }, // see bindParticleClicks()
        resize: true,
      },
      modes: { grab: { distance: 200, line_linked: { opacity: 0.55 } } },
    },
    retina_detect: true,
  });
}

/* The running instance, if any. particles.js keeps them in window.pJSDom. */
function activeParticles() {
  const list = window.pJSDom;
  if (!Array.isArray(list) || !list.length) return null;
  const entry = list[list.length - 1];
  return entry && entry.pJS ? entry.pJS : null;
}

/* Stop every draw loop and forget the instances. The library's own
   destroy helper nulls the registry, which breaks the next start. */
function destroyParticles() {
  const list = window.pJSDom;
  if (!Array.isArray(list)) return;
  list.forEach((entry) => {
    const inst = entry && entry.pJS;
    if (inst && inst.fn && inst.fn.drawAnimFrame) cancelAnimationFrame(inst.fn.drawAnimFrame);
  });
  window.pJSDom = [];
}

function bindParticleClicks() {
  if (particleClicksBound) return;
  particleClicksBound = true;

  window.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.detail === 0) return; // handled elsewhere / keyboard
    const target = e.target instanceof Element ? e.target : null;
    if (target && target.closest(NO_SPAWN_TARGETS)) return;
    spawnParticle(e.clientX, e.clientY);
  });
}

/* One click, one node, right under the cursor — linked to its neighbours
   by the field's own line logic. Slightly bolder than the ambient nodes so
   the one you placed reads as yours. */
function spawnParticle(clientX, clientY) {
  const inst = activeParticles();
  if (!inst || !inst.fn || !inst.fn.modes || typeof inst.fn.modes.pushParticles !== "function") {
    return;
  }

  try {
    // The canvas covers the viewport, so client coordinates map 1:1 —
    // scaled by the pixel ratio when the library renders at retina size.
    const scale = (inst.tmp && inst.tmp.retina && inst.canvas.pxratio) || 1;
    inst.fn.modes.pushParticles(1, { pos_x: clientX * scale, pos_y: clientY * scale });

    const nodes = inst.particles.array;
    const node = nodes[nodes.length - 1];
    if (node) {
      node.radius = 2.4 * scale;
      node.opacity = 0.8;
    }
    if (nodes.length > PARTICLES_MAX_NODES) {
      nodes.splice(0, nodes.length - PARTICLES_MAX_NODES);
    }
  } catch (_) {
    /* decoration only — never let it throw */
  }
}

function restartParticles() {
  if (!particlesAllowed()) return;
  runParticles();
}

/* Cross the width threshold in either direction and start/stop the field;
   otherwise the library resizes its own canvas and nothing needs restarting. */
function syncParticles() {
  const host = document.getElementById("interactive-bg");
  if (!host) return;

  const running = activeParticles() !== null;
  if (particlesAllowed() && !running) {
    runParticles();
    bindParticleClicks();
  } else if (!particlesAllowed() && running) {
    destroyParticles();
    host.innerHTML = "";
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    /* private mode — theme just won't persist */
  }
}

function safeSessionSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch (_) {
    /* storage blocked — the intro simply plays again next time */
  }
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(syncParticles, 300);
});
