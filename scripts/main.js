document.addEventListener("DOMContentLoaded", function () {
  // Initialize particles.js
  particlesJS("interactive-bg", {
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } },
      color: { value: "#ffcc00" },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffcc00",
        opacity: 0.2,
        width: 1,
      },
      move: { enable: true, speed: 2, direction: "none", random: false, straight: false },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 200, line_linked: { opacity: 0.3 } },
        push: { particles_nb: 3 },
      },
    },
    retina_detect: true,
  });
  
  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
  
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem('theme', 'light');
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem('theme', 'dark');
    }
  });
  
  // Mobile Navigation
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");
  
  mobileToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    mobileToggle.querySelector("i").classList.toggle("fa-bars");
    mobileToggle.querySelector("i").classList.toggle("fa-times");
  });
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      mobileToggle.querySelector("i").classList.add("fa-bars");
      mobileToggle.querySelector("i").classList.remove("fa-times");
    });
  });
  
  // Animation on Load (for multi-page layout)
  setTimeout(function() {
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('active');
    });
  }, 300);
});