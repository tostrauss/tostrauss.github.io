/**
 * Tobias Strauss — portfolio behaviour
 * Rebuilt July 2026: sticky nav state, mobile menu, scroll reveals,
 * cursor-lit project cards, flip handling, skill animation, and a much
 * quieter particle field. Everything degrades if JS or the CDN fails.
 */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initSkipLink();
  initTheme();
  initNav();
  initReveal();
  initProjectCards();
  initSkills();
  initSkillFilter();
  initCopyButtons();
  initYear();
  initParticles();
});

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
   SKILL BARS
   ============================================================ */
function initSkills() {
  const bars = document.querySelectorAll(".progress, .skill-level");
  if (!bars.length) return;

  bars.forEach((bar) => {
    const target = bar.dataset.width || bar.style.width || "0%";
    bar.dataset.width = target;
    bar.style.width = "0%";
  });

  const fill = (bar) => {
    requestAnimationFrame(() => (bar.style.width = bar.dataset.width));
  };

  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    bars.forEach(fill);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        fill(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
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
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const selected = chip.dataset.category;

      items.forEach((item) => {
        const show = selected === "all" || item.dataset.category === selected;
        item.hidden = !show;
        if (!show) return;
        const bar = item.querySelector(".skill-level");
        if (!bar) return;
        bar.style.width = "0%";
        requestAnimationFrame(() => (bar.style.width = bar.dataset.width || "0%"));
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
   Kept from the original site, but dialled right down: fewer nodes,
   slower drift, gold at low opacity. It is atmosphere, not the subject.
   ============================================================ */
function initParticles() {
  const host = document.getElementById("interactive-bg");
  if (!host || REDUCED_MOTION || window.innerWidth < 700) return;
  if (typeof particlesJS === "undefined") return;
  runParticles();
}

function runParticles() {
  const host = document.getElementById("interactive-bg");
  if (!host || typeof particlesJS === "undefined") return;
  host.innerHTML = "";

  const gold = document.body.classList.contains("light-mode") ? "#b57800" : "#ffc93c";

  particlesJS("interactive-bg", {
    particles: {
      number: { value: 32, density: { enable: true, value_area: 1100 } },
      color: { value: gold },
      shape: { type: "circle" },
      opacity: { value: 0.4, random: true, anim: { enable: false } },
      size: { value: 1.8, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 165, color: gold, opacity: 0.14, width: 1 },
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
        onclick: { enable: false },
        resize: true,
      },
      modes: { grab: { distance: 170, line_linked: { opacity: 0.32 } } },
    },
    retina_detect: true,
  });
}

function restartParticles() {
  const host = document.getElementById("interactive-bg");
  if (!host || REDUCED_MOTION || window.innerWidth < 700) return;
  runParticles();
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

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(restartParticles, 400);
});
