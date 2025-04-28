/**
 * Main JavaScript file for portfolio 
 */

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  // Core functionality
  initInteractiveBackground();
  initThemeToggle();
  initProjectCards();
  initFadeIn();
  initSkillsAnimation();
  
  // Additional enhancements
  enhanceNavigationLinks();
  addKeyframeStyles();
});

/**
 * Initialize the interactive particles background
 */
function initInteractiveBackground() {
  const interactiveBg = document.getElementById("interactive-bg");
  
  if (!interactiveBg || typeof particlesJS === 'undefined') {
    console.warn("Interactive background element not found or particles.js not loaded");
    createBackupPattern();
    return;
  }
  
  // Get theme state
  const isLightMode = document.body.classList.contains('light-mode');
  
  // Enhanced particles configuration with better performance and visual appeal
  particlesJS("interactive-bg", {
    particles: {
      number: { 
        value: 60, 
        density: { enable: true, value_area: 1200 } 
      },
      color: { 
        value: isLightMode ? "#ffaa00" : "#ffcc00" 
      },
      shape: { 
        type: "circle",
        stroke: { width: 0, color: "#000000" },
      },
      opacity: { 
        value: isLightMode ? 0.2 : 0.3, 
        random: true, 
        anim: { enable: true, speed: 0.3, opacity_min: 0.1, sync: false } 
      },
      size: { 
        value: 3, 
        random: true, 
        anim: { enable: true, speed: 0.8, size_min: 0.1, sync: false } 
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: isLightMode ? "#ffaa00" : "#ffcc00",
        opacity: isLightMode ? 0.15 : 0.2,
        width: 1,
      },
      move: { 
        enable: true, 
        speed: 1, 
        direction: "none", 
        random: false, 
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 }
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
        grab: { distance: 140, line_linked: { opacity: 0.8 } },
        push: { particles_nb: 2 },
      },
    },
    retina_detect: true,
    fps_limit: 60
  });
  
  // Apply proper styling to the background container
  applyBackgroundStyles(interactiveBg, isLightMode);
}

/**
 * Applies appropriate styles to the interactive background
 */
function applyBackgroundStyles(element, isLightMode) {
  element.style.opacity = isLightMode ? "0.1" : "0.15";
  element.style.zIndex = "-1";
  element.style.position = "fixed";
  element.style.width = "100%";
  element.style.height = "100%";
  element.style.top = "0";
  element.style.left = "0";
  element.style.pointerEvents = "none";
}

/**
 * Creates a fallback pattern if particles.js isn't available
 */
function createBackupPattern() {
  const interactiveBg = document.getElementById("interactive-bg") || document.createElement("div");
  
  if (!document.getElementById("interactive-bg")) {
    interactiveBg.id = "interactive-bg";
    document.body.appendChild(interactiveBg);
  }
  
  const isLightMode = document.body.classList.contains('light-mode');
  
  // Create a subtle gradient background as fallback
  interactiveBg.style.backgroundImage = isLightMode 
    ? "radial-gradient(circle, rgba(255,170,0,0.05) 0%, rgba(0,0,0,0) 70%)"
    : "radial-gradient(circle, rgba(255,204,0,0.07) 0%, rgba(0,0,0,0) 70%)";
    
  interactiveBg.style.backgroundSize = "100px 100px";
  interactiveBg.style.backgroundPosition = "0 0, 50px 50px";
  
  // Apply common styles
  applyBackgroundStyles(interactiveBg, isLightMode);
}

/**
 * Initializes theme toggle functionality
 */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  
  if (!themeToggle) return;
  
  const themeIcon = themeToggle.querySelector("i");
  
  // Check for saved theme preference
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      if (themeIcon) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      }
    }
  } catch (err) {
    console.warn("Unable to access localStorage for theme preference");
  }
  
  // Add bounce animation to icon on hover
  themeToggle.addEventListener("mouseenter", function() {
    if (themeIcon) {
      themeIcon.style.animation = "bounce 0.5s";
    }
  });
  
  themeToggle.addEventListener("animationend", function() {
    if (themeIcon) {
      themeIcon.style.animation = "";
    }
  });
  
  // Toggle theme with smooth transition and save preference
  themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
    
    if (themeIcon) {
      if (document.body.classList.contains("light-mode")) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        try {
          localStorage.setItem('theme', 'light');
        } catch (err) {
          console.warn("Unable to save theme preference");
        }
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        try {
          localStorage.setItem('theme', 'dark');
        } catch (err) {
          console.warn("Unable to save theme preference");
        }
      }
    }
    
    // Refresh interactive background for theme change
    updateBackgroundForTheme();
  });
}

/**
 * Updates the interactive background when theme changes
 */
function updateBackgroundForTheme() {
  const isLightMode = document.body.classList.contains('light-mode');
  
  // If particles.js is available, update its configuration
  if (typeof particlesJS !== 'undefined' && window.pJSDom && window.pJSDom.length > 0) {
    try {
      const particles = window.pJSDom[0].pJS.particles;
      
      // Update colors based on theme
      particles.line_linked.color = isLightMode ? "#ffaa00" : "#ffcc00";
      particles.color.value = isLightMode ? "#ffaa00" : "#ffcc00";
      particles.line_linked.opacity = isLightMode ? 0.15 : 0.2;
      
      // Refresh particles
      if (particles.move.enable) {
        window.pJSDom[0].pJS.fn.particlesRefresh();
      }
    } catch (err) {
      console.warn("Could not update particles theme", err);
      
      // Reinitialize as fallback
      document.getElementById("interactive-bg").innerHTML = '';
      initInteractiveBackground();
    }
  } else {
    // Update fallback pattern
    createBackupPattern();
  }
}

/**
 * Initializes project cards with enhanced 3D effects and interactions
 */
function initProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  const flipButtons = document.querySelectorAll('.flip-button');
  
  if (projectCards.length === 0) return;
  
  // Add shimmer effect to cards if not already present
  projectCards.forEach(card => {
    if (!card.querySelector('.shimmer-effect')) {
      const shimmer = document.createElement('div');
      shimmer.className = 'shimmer-effect';
      card.appendChild(shimmer);
    }
    
    // Add 3D hover effect
    card.addEventListener('mousemove', function(e) {
      // Only apply effect if card is not flipped
      if (this.classList.contains('flipped')) return;
      
      // Calculate mouse position relative to card
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation (max 5 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;
      
      // Apply smooth transform
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      this.style.boxShadow = `
        ${-rotateY/2}px ${-rotateX/2}px 20px rgba(255, 204, 0, 0.1),
        ${rotateY/2}px ${rotateX/2}px 20px rgba(0, 0, 0, 0.3)
      `;
      
      // Add depth to content elements
      const title = this.querySelector('h3');
      const tags = this.querySelectorAll('.project-tag');
      
      if (title) title.style.transform = `translateZ(20px)`;
      
      // Animated tags with staggered effect
      if (tags.length) {
        tags.forEach((tag, index) => {
          tag.style.transform = `translateZ(${10 + index * 2}px)`;
        });
      }
    });
    
    // Reset transform on mouse leave
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('flipped')) {
        this.style.transform = '';
        this.style.boxShadow = '';
        
        // Reset content elements
        const title = this.querySelector('h3');
        const tags = this.querySelectorAll('.project-tag');
        
        if (title) title.style.transform = '';
        if (tags.length) {
          tags.forEach(tag => {
            tag.style.transform = '';
          });
        }
      }
    });
  });
  
  // Handle flip button clicks with improved animation
  flipButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const card = this.closest('.project-card');
      card.classList.toggle('flipped');
      
      // Enhanced 3D effect during flip
      if (card.classList.contains('flipped')) {
        card.style.transform = 'rotateY(180deg)';
        
        // Highlight tech tags with staggered animation
        const techTags = card.querySelectorAll('.tech-tag');
        if (techTags.length) {
          techTags.forEach((tag, index) => {
            setTimeout(() => {
              tag.style.transform = 'translateY(-5px)';
              tag.style.boxShadow = '0 5px 15px rgba(255, 204, 0, 0.2)';
            }, 200 + index * 50);
          });
        }
        
        // Animate feature items
        const featureItems = card.querySelectorAll('.feature-item');
        if (featureItems.length) {
          featureItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.transform = 'translateX(5px)';
              item.style.opacity = '1';
            }, 200 + index * 50);
          });
        }
      } else {
        card.style.transform = '';
        
        // Reset tech tags
        const techTags = card.querySelectorAll('.tech-tag');
        if (techTags.length) {
          techTags.forEach(tag => {
            tag.style.transform = '';
            tag.style.boxShadow = '';
          });
        }
        
        // Reset feature items
        const featureItems = card.querySelectorAll('.feature-item');
        if (featureItems.length) {
          featureItems.forEach(item => {
            item.style.transform = '';
            item.style.opacity = '0.8';
          });
        }
      }
    });
  });
  
  // Close cards when clicking outside
  document.addEventListener('click', function(e) {
    projectCards.forEach(card => {
      if (card.classList.contains('flipped')) {
        // Check if click was outside the card
        if (!card.contains(e.target)) {
          card.classList.remove('flipped');
          card.style.transform = '';
          
          // Reset tech tags
          const techTags = card.querySelectorAll('.tech-tag');
          if (techTags.length) {
            techTags.forEach(tag => {
              tag.style.transform = '';
              tag.style.boxShadow = '';
            });
          }
          
          // Reset feature items
          const featureItems = card.querySelectorAll('.feature-item');
          if (featureItems.length) {
            featureItems.forEach(item => {
              item.style.transform = '';
              item.style.opacity = '0.8';
            });
          }
        }
      }
    });
  });
}

/**
 * Improved staggered fade-in animations
 */
function initFadeIn() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length === 0) return;
  
  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Add a staggered delay based on element position
        setTimeout(() => {
          entry.target.classList.add('active');
        }, 100 + (i * 80));
        
        // Stop observing once animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe each fade element
  fadeElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Add interactive animations to skill cards and progress bars
 */
function initSkillsAnimation() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  if (skillCards.length === 0) return;
  
  // Create an Intersection Observer to trigger skill animations when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillCard(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Start observing each skill card
  skillCards.forEach(card => {
    observer.observe(card);
  });
}

/**
 * Animate individual skill card elements
 */
function animateSkillCard(card) {
  // Animate card with subtle bounce
  card.style.animation = 'bounce 0.5s';
  
  // Animate progress bar with delay
  const progressBar = card.querySelector('.progress');
  if (progressBar) {
    // Add transition delay to create sequence effect
    setTimeout(() => {
      progressBar.style.transition = 'width 1.2s cubic-bezier(0.19, 1, 0.22, 1)';
      
      // Get the target width from the inline style
      const targetWidth = progressBar.style.width;
      
      // Reset and then animate to target
      progressBar.style.width = '0%';
      
      setTimeout(() => {
        progressBar.style.width = targetWidth;
      }, 50);
    }, 300);
  }
  
  // Add hover effects for better interactivity
  card.addEventListener('mouseenter', function() {
    // Scale up the icon
    const cardImg = this.querySelector('img');
    if (cardImg) {
      cardImg.style.transform = 'scale(1.1) translateY(-5px)';
    }
    
    // Highlight the skill name
    const cardTitle = this.querySelector('h3');
    if (cardTitle) {
      cardTitle.style.color = '#ffcc00';
    }
  });
  
  card.addEventListener('mouseleave', function() {
    // Reset icon
    const cardImg = this.querySelector('img');
    if (cardImg) {
      cardImg.style.transform = 'scale(1)';
    }
    
    // Reset skill name
    const cardTitle = this.querySelector('h3');
    if (cardTitle) {
      cardTitle.style.color = '';
    }
  });
}

/**
 * Add subtle enhancements to the navigation links
 */
function enhanceNavigationLinks() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

/**
 * Add keyframe animations required for various effects
 */
function addKeyframeStyles() {
  // Check if styles already exist
  if (document.getElementById('animation-keyframes')) return;
  
  // Create a style element
  const style = document.createElement('style');
  style.id = 'animation-keyframes';
  
  // Add keyframe animations
  const css = `
    @keyframes float {
      0% { transform: translateY(0); }
      100% { transform: translateY(-5px); }
    }
    
    @keyframes pulse {
      0% { opacity: 0.2; }
      50% { opacity: 0.5; }
      100% { opacity: 0.2; }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-300%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  
  // Add the CSS to the style element
  style.appendChild(document.createTextNode(css));
  
  // Add the style element to the document head
  document.head.appendChild(style);
}

// Ensure background is properly sized on window resize
window.addEventListener('resize', function() {
  if (typeof particlesJS !== 'undefined' && window.pJSDom && window.pJSDom.length > 0) {
    try {
      window.pJSDom[0].pJS.fn.vendors.destroy();
      initInteractiveBackground();
    } catch (err) {
      console.warn("Error resizing particles background", err);
    }
  }
});

// Ensure all content is initialized properly
window.addEventListener('load', function() {
  // Recheck interactive background
  const interactiveBg = document.getElementById("interactive-bg");
  if (interactiveBg && typeof particlesJS !== 'undefined' && 
      (!window.pJSDom || window.pJSDom.length === 0)) {
    interactiveBg.innerHTML = ''; // Clear any existing content
    initInteractiveBackground(); // Reinitialize
  }
});

// Initialize skills filtering and animation
function initSkillsSection() {
  const skillCategories = document.querySelectorAll('.skill-category');
  const skillItems = document.querySelectorAll('.skill-item');
  const skillLevels = document.querySelectorAll('.skill-level');
  
  if (skillCategories.length === 0) return;
  
  // Animate skill bars on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find and animate all skill levels within this container
        const levels = entry.target.querySelectorAll('.skill-level');
        if (levels.length) {
          setTimeout(() => {
            levels.forEach(level => {
              level.style.width = level.style.width;
            });
          }, 300);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  // Observe the skills container
  const skillsContainer = document.querySelector('.skills-container');
  if (skillsContainer) {
    observer.observe(skillsContainer);
  }
  
  // Handle category filtering
  skillCategories.forEach(category => {
    category.addEventListener('click', function() {
      // Update active state
      skillCategories.forEach(cat => cat.classList.remove('active'));
      this.classList.add('active');
      
      const selectedCategory = this.dataset.category;
      
      // Filter items
      skillItems.forEach(item => {
        if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
          item.style.display = 'block';
          // Trigger animation again
          setTimeout(() => {
            const level = item.querySelector('.skill-level');
            if (level) {
              level.style.width = level.style.width;
            }
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Add to your document ready function
document.addEventListener("DOMContentLoaded", function() {
  // Your existing initializations
  initInteractiveBackground();
  initThemeToggle();
  initProjectCards();
  initFadeIn();
  initSkillsAnimation();
  
  // Add new skill section initialization
  initSkillsSection();
  
  // Additional enhancements
  enhanceNavigationLinks();
  addKeyframeStyles();
});

// Add automatic underline effect to name on homepage
function initNameUnderline() {
  const heroNameSpan = document.querySelector('.hero-text h1 span');
  if (heroNameSpan) {
    // Create underline element if it doesn't exist
    if (!heroNameSpan.querySelector('.name-underline')) {
      const underline = document.createElement('span');
      underline.className = 'name-underline';
      heroNameSpan.appendChild(underline);
    }
    
    // Add auto-underline class to trigger animation
    setTimeout(() => {
      heroNameSpan.classList.add('auto-underline');
    }, 800); // Delay for visual effect
  }
}

// Add to DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function() {
  // ... existing code
  
  // Initialize name underline effect
  initNameUnderline();
});