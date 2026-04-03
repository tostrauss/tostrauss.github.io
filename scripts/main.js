/**
 * Main JavaScript — Tobias Strauss Portfolio
 * Cleaned up: removed duplicate inits, consolidated event listeners
 */

document.addEventListener("DOMContentLoaded", function () {
  initInteractiveBackground();
  initThemeToggle();
  initMobileNavigation();
  initProjectCards();
  initFadeIn();
  initSkillsAnimation();
  initSkillsSection();
  initNameUnderline();
  enhanceNavigationLinks();
  addAccessibilityFeatures();
});

/* ===== PARTICLES BACKGROUND ===== */
function initInteractiveBackground() {
  const el = document.getElementById("interactive-bg");
  if (!el) return;

  const isLight = document.body.classList.contains("light-mode");

  if (typeof particlesJS === "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    script.onload = () => runParticles(isLight);
    script.onerror = () => fallbackBg(el, isLight);
    document.body.appendChild(script);
  } else {
    runParticles(isLight);
  }
}

function runParticles(isLight) {
  const el = document.getElementById("interactive-bg");
  if (!el) return;
  el.innerHTML = "";

  particlesJS("interactive-bg", {
    particles: {
      number: { value: 100, density: { enable: true, value_area: 900 } },
      color: { value: isLight ? "#ffcc00" : "#ffaa00" },
      opacity: {
        value: isLight ? 0.3 : 0.45,
        random: false,
        anim: { enable: true, speed: 0.2, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 3.5,
        random: true,
        anim: { enable: true, speed: 0.4, size_min: 0.1, sync: false },
      },
      line_linked: {
        enable: true,
        distance: 140,
        color: isLight ? "#ffaa00" : "#ffcc00",
        opacity: isLight ? 0.25 : 0.35,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 130, line_linked: { opacity: 0.7 } },
        push: { particles_nb: 3 },
      },
    },
    retina_detect: true,
  });
}

function fallbackBg(el, isLight) {
  el.style.backgroundImage = isLight
    ? "radial-gradient(circle, rgba(255,170,0,0.15) 0%, transparent 70%)"
    : "radial-gradient(circle, rgba(255,204,0,0.15) 0%, transparent 70%)";
  el.style.backgroundSize = "100px 100px";
}

/* ===== THEME TOGGLE ===== */
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  const icon = toggle.querySelector("i");
  if (!icon) return;

  try {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
      icon.classList.replace("fa-moon", "fa-sun");
    }
  } catch (_) {}

  toggle.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");

    if (isLight) {
      icon.classList.replace("fa-moon", "fa-sun");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
    }

    try { localStorage.setItem("theme", isLight ? "light" : "dark"); } catch (_) {}

    // Refresh particles
    const bg = document.getElementById("interactive-bg");
    if (bg) { bg.innerHTML = ""; runParticles(isLight); }
  });
}

/* ===== MOBILE NAV ===== */
function initMobileNavigation() {
  const btn = document.getElementById("mobile-toggle");
  const nav = document.getElementById("nav-links");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    const i = btn.querySelector("i");
    if (i) i.classList.toggle("fa-bars"), i.classList.toggle("fa-times");
  });

  document.querySelectorAll(".nav-link").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      const i = btn.querySelector("i");
      if (i) { i.classList.add("fa-bars"); i.classList.remove("fa-times"); }
    })
  );
}

/* ===== PROJECT CARDS ===== */
function initProjectCards() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      if (this.classList.contains("flipped")) return;
      const r = this.getBoundingClientRect();
      const rY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 4;
      const rX = ((r.height / 2 - (e.clientY - r.top)) / (r.height / 2)) * 4;
      this.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("flipped")) this.style.transform = "";
    });
  });

  document.querySelectorAll(".flip-button").forEach((btn) =>
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const card = this.closest(".project-card");
      if (!card) return;
      card.classList.toggle("flipped");
      card.style.transform = card.classList.contains("flipped") ? "rotateY(180deg)" : "";
    })
  );

  document.addEventListener("click", (e) =>
    cards.forEach((c) => {
      if (c.classList.contains("flipped") && !c.contains(e.target)) {
        c.classList.remove("flipped");
        c.style.transform = "";
      }
    })
  );
}

/* ===== FADE-IN ===== */
function initFadeIn() {
  const els = document.querySelectorAll(".fade-in");
  if (!els.length) return;

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("active"), 80 + i * 60);
            obs.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
  } else {
    els.forEach((el, i) => setTimeout(() => el.classList.add("active"), 80 + i * 80));
  }
}

/* ===== SKILLS ANIMATION ===== */
function initSkillsAnimation() {
  const cards = document.querySelectorAll(".skill-card");
  if (!cards.length) return;

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillCard(entry.target);
            obs.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 }
    );
    cards.forEach((c) => obs.observe(c));
  } else {
    cards.forEach(animateSkillCard);
  }
}

function animateSkillCard(card) {
  const bar = card.querySelector(".progress");
  if (bar) {
    const target = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => (bar.style.width = target), 200);
  }
}

/* ===== SKILLS FILTERING ===== */
function initSkillsSection() {
  const cats = document.querySelectorAll(".skills-categories .skill-category");
  const items = document.querySelectorAll(".skill-item");
  if (!cats.length || !items.length) return;

  cats.forEach((cat) =>
    cat.addEventListener("click", function () {
      cats.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      const sel = this.dataset.category;

      items.forEach((item) => {
        const show = sel === "all" || item.dataset.category === sel;
        item.style.display = show ? "block" : "none";
        if (show) {
          const lv = item.querySelector(".skill-level");
          if (lv) {
            const w = lv.style.width;
            lv.style.width = "0%";
            setTimeout(() => (lv.style.width = w), 50);
          }
        }
      });
    })
  );
}

/* ===== NAME UNDERLINE ===== */
function initNameUnderline() {
  const span = document.querySelector(".hero-text h1 span");
  if (!span) return;
  if (!span.querySelector(".name-underline")) {
    const ul = document.createElement("span");
    ul.className = "name-underline";
    span.appendChild(ul);
  }
  setTimeout(() => span.classList.add("auto-underline"), 700);
}

/* ===== NAV ENHANCEMENTS ===== */
function enhanceNavigationLinks() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", function () { this.style.transform = "translateY(-2px)"; });
    link.addEventListener("mouseleave", function () { this.style.transform = ""; });
  });
}

/* ===== ACCESSIBILITY ===== */
function addAccessibilityFeatures() {
  if (!document.querySelector(".skip-to-content")) {
    const skip = document.createElement("a");
    skip.className = "skip-to-content";
    skip.href = "#content";
    skip.textContent = "Skip to content";
    document.body.insertBefore(skip, document.body.firstChild);
  }
}

/* ===== RESIZE HANDLER ===== */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const bg = document.getElementById("interactive-bg");
    if (bg) { bg.innerHTML = ""; initInteractiveBackground(); }
  }, 300);
});