// Initialize interactive background with priority
document.addEventListener("DOMContentLoaded", function() {
  // Initialize particles background first
  initParticlesBackground();
  
  // Theme Toggle
  initThemeToggle();
  
  // Card flip functionality
  initCardFlip();
  
  // Animation on Load
  initFadeIn();
});

function initParticlesBackground() {
  const interactiveBg = document.getElementById("interactive-bg");
  
  if (!interactiveBg) {
    console.warn("Interactive background element not found");
    return;
  }
  
  // Clear any existing content to prevent overwriting
  interactiveBg.innerHTML = '';
  
  // Check if particles.js is loaded
  if (typeof particlesJS === 'undefined') {
    console.error("Particles.js not loaded. Make sure to include the script.");
    return;
  }
  
  // Configure particles with optimized settings
  particlesJS("interactive-bg", {
    particles: {
      number: { 
        value: 70, 
        density: { enable: true, value_area: 800 } 
      },
      color: { value: "#ffcc00" },
      shape: { type: "circle" },
      opacity: { 
        value: 0.3, 
        random: true, 
        anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false } 
      },
      size: { 
        value: 3, 
        random: true, 
        anim: { enable: true, speed: 1, size_min: 0.1, sync: false } 
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffcc00",
        opacity: 0.2,
        width: 1,
      },
      move: { 
        enable: true, 
        speed: 2, 
        direction: "none", 
        random: false, 
        straight: false,
        out_mode: "out",
        bounce: false
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.5 } },
        push: { particles_nb: 3 }
      },
    },
    retina_detect: true,
    fps_limit: 60
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  
  if (!themeToggle) return;
  
  const themeIcon = themeToggle.querySelector("i");
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  }
  
  themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
    if (themeIcon) {
      if (document.body.classList.contains("light-mode")) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem('theme', 'light');
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem('theme', 'dark');
      }
    }
  });
}

// Enhanced card flip with smooth transitions
function initCardFlip() {
  const projectCards = document.querySelectorAll('.project-card');
  const flipButtons = document.querySelectorAll('.flip-button');
  
  if (projectCards.length === 0) return;
  
  flipButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      
      const card = this.closest('.project-card');
      card.classList.toggle('flipped');
    });
  });
  
  // Add click outside to flip back
  document.addEventListener('click', function(e) {
    projectCards.forEach(card => {
      if (card.classList.contains('flipped')) {
        // Check if click was outside the card
        if (!card.contains(e.target)) {
          card.classList.remove('flipped');
        }
      }
    });
  });
}

// Improved staggered fade-in animations
function initFadeIn() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length === 0) return;
  
  fadeElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('active');
    }, 100 + (index * 100)); // Staggered timing
  });
}