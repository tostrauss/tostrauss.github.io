/**
 * Main JavaScript file for portfolio 
 */

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  // Core functionality
  initInteractiveBackground();
  initThemeToggle();
  initMobileNavigation();
  initProjectCards();
  initFadeIn();
  initSkillsAnimation();
  initSkillsSection();
  initNameUnderline();
  
  // Additional enhancements
  enhanceNavigationLinks();
  addKeyframeStyles();
  addAccessibilityFeatures();
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
  
  // Clean configuration with optimized settings
  particlesJS("interactive-bg", {
    particles: {
      number: { 
        value: 40,
        density: { enable: true, value_area: 1500 }
      },
      color: { 
        value: isLightMode ? "#ffaa00" : "#ffcc00" 
      },
      opacity: { 
        value: isLightMode ? 0.2 : 0.3, 
        random: true, 
        anim: { enable: true, speed: 0.2, opacity_min: 0.1, sync: false }
      },
      size: { 
        value: 3, 
        random: true, 
        anim: { enable: true, speed: 0.5, size_min: 0.1, sync: false }
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
        speed: 0.8,
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
        push: { particles_nb: 1 },
      },
    },
    retina_detect: false,
    fps_limit: 30
  });
  
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
  
  if (!themeToggle) {
    console.warn("Theme toggle button not found");
    return;
  }
  
  const themeIcon = themeToggle.querySelector("i");
  if (!themeIcon) {
    console.warn("Theme icon not found within toggle button");
    return;
  }
  
  // Check for saved theme preference
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  } catch (err) {
    console.warn("Unable to access localStorage for theme preference", err);
  }
  
  // Add bounce animation to icon on hover
  themeToggle.addEventListener("mouseenter", function() {
    themeIcon.style.animation = "bounce 0.5s";
  });
  
  themeToggle.addEventListener("animationend", function() {
    themeIcon.style.animation = "";
  });
  
  // Toggle theme with smooth transition and save preference
  themeToggle.addEventListener("click", function() {
    // Toggle the light-mode class on the body
    document.body.classList.toggle("light-mode");
    
    // Update the icon based on current theme
    if (document.body.classList.contains("light-mode")) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      try {
        localStorage.setItem('theme', 'light');
      } catch (err) {
        console.warn("Unable to save theme preference", err);
      }
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      try {
        localStorage.setItem('theme', 'dark');
      } catch (err) {
        console.warn("Unable to save theme preference", err);
      }
    }
    
    // Refresh interactive background for theme change
    updateBackgroundForTheme();
  });
  
  // Mark the toggle as initialized to prevent duplicate initialization
  themeToggle._initialized = true;
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNavigation() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");
  
  if (!mobileToggle || !navLinks) {
    return;
  }
  
  mobileToggle.addEventListener("click", function() {
    navLinks.classList.toggle("active");
    mobileToggle.querySelector("i").classList.toggle("fa-bars");
    mobileToggle.querySelector("i").classList.toggle("fa-times");
  });
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function() {
      navLinks.classList.remove("active");
      if (mobileToggle.querySelector("i")) {
        mobileToggle.querySelector("i").classList.add("fa-bars");
        mobileToggle.querySelector("i").classList.remove("fa-times");
      }
    });
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
      const interactiveBg = document.getElementById("interactive-bg");
      if (interactiveBg) {
        interactiveBg.innerHTML = '';
        initInteractiveBackground();
      }
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
  
  if (projectCards.length === 0) return;
  
  projectCards.forEach(card => {
    // Ensure 3D perspective is preserved
    card.style.transformStyle = 'preserve-3d';
    
    // Ensure front and back faces have proper styles
    const front = card.querySelector('.project-card-front');
    const back = card.querySelector('.project-card-back');
    
    if (front && back) {
      front.style.backfaceVisibility = 'hidden';
      front.style.webkitBackfaceVisibility = 'hidden';
      front.style.position = 'absolute';
      front.style.width = '100%';
      front.style.height = '100%';
      
      back.style.backfaceVisibility = 'hidden';
      back.style.webkitBackfaceVisibility = 'hidden';
      back.style.transform = 'rotateY(180deg)';
      back.style.position = 'absolute';
      back.style.width = '100%';
      back.style.height = '100%';
    }
    
    // Add shimmer effect if not already present
    if (!card.querySelector('.shimmer-effect')) {
      const shimmer = document.createElement('div');
      shimmer.className = 'shimmer-effect';
      card.appendChild(shimmer);
    }
    
    // Add 3D hover effect when not flipped
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
  const flipButtons = document.querySelectorAll('.flip-button');
  flipButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const card = this.closest('.project-card');
      if (!card) return;
      
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
  if ('IntersectionObserver' in window) {
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
  } else {
    // Fallback for browsers that don't support Intersection Observer
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, 100 + (index * 100));
    });
  }
}

/**
 * Add interactive animations to skill cards and progress bars
 */
function initSkillsAnimation() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  if (skillCards.length === 0) return;
  
  if ('IntersectionObserver' in window) {
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
  } else {
    // Fallback for browsers without Intersection Observer
    skillCards.forEach(card => {
      animateSkillCard(card);
    });
  }
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
 * Initialize skills filtering and animation
 */
function initSkillsSection() {
  const skillCategories = document.querySelectorAll('.skill-category');
  const skillItems = document.querySelectorAll('.skill-item');
  
  // Handle category filtering if present
  if (skillCategories.length > 0 && skillItems.length > 0) {
    // Set default active category
    const defaultActiveCategory = document.querySelector('.skill-category[data-category="all"]');
    if (defaultActiveCategory) {
      defaultActiveCategory.classList.add('active');
    }
    
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
                const width = level.style.width;
                level.style.width = '0%';
                setTimeout(() => {
                  level.style.width = width;
                }, 50);
              }
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  
  // Fix category title line issue
  const skillCategoryTitles = document.querySelectorAll('.skill-category-title');
  skillCategoryTitles.forEach(title => {
    // Ensure the pseudo-element is visible by forcing a reflow
    title.style.position = 'relative';
    
    // Create a manual line if needed
    if (!title.querySelector('.category-line')) {
      const line = document.createElement('div');
      line.className = 'category-line';
      title.appendChild(line);
    }
  });
}

/**
 * Add the name underline animation effect
 */
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
    }, 800);
  }
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
    
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes scaleIn {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes progressGrow {
      from { width: 0; }
      to { width: 100%; }
    }
  `;
  
  // Add the CSS to the style element
  style.appendChild(document.createTextNode(css));
  
  // Add the style element to the document head
  document.head.appendChild(style);
}

/**
 * Add accessibility features to the site
 */
function addAccessibilityFeatures() {
  // Add aria labels to interactive elements without text
  document.querySelectorAll('button:not([aria-label]), a:not([aria-label])').forEach(el => {
    if (!el.textContent.trim() && !el.getAttribute('aria-label')) {
      const icon = el.querySelector('i');
      if (icon && icon.className) {
        const iconClass = icon.className;
        if (iconClass.includes('fa-moon') || iconClass.includes('fa-sun')) {
          el.setAttribute('aria-label', 'Toggle theme');
        } else if (iconClass.includes('fa-sync')) {
          el.setAttribute('aria-label', 'Flip card');
        } else if (iconClass.includes('fa-github')) {
          el.setAttribute('aria-label', 'GitHub profile');
        } else if (iconClass.includes('fa-linkedin')) {
          el.setAttribute('aria-label', 'LinkedIn profile');
        } else if (iconClass.includes('fa-envelope')) {
          el.setAttribute('aria-label', 'Send email');
        } else {
          el.setAttribute('aria-label', 'Interactive element');
        }
      }
    }
  });
  
  // Add skip to content link for keyboard users
  if (!document.querySelector('.skip-to-content')) {
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-to-content';
    skipLink.href = '#content';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // Add focus styles
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    a:focus, button:focus, input:focus, textarea:focus {
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
    }
    
    .skip-to-content:focus {
      top: 0;
    }
  `;
  document.head.appendChild(focusStyle);
}

// Ensure background is properly sized on window resize
window.addEventListener('resize', function() {
  if (typeof particlesJS !== 'undefined' && window.pJSDom && window.pJSDom.length > 0) {
    try {
      // Check if destroy method exists before calling it
      if (window.pJSDom[0].pJS.fn.vendors.destroy) {
        window.pJSDom[0].pJS.fn.vendors.destroy();
      } else {
        // If destroy isn't available, remove the canvas and reinitialize
        const canvas = document.querySelector('#interactive-bg canvas');
        if (canvas) {
          canvas.remove();
        }
      }
      initInteractiveBackground();
    } catch (err) {
      console.warn("Error resizing particles background", err);
      // Fallback: Clear and reinitialize
      const interactiveBg = document.getElementById("interactive-bg");
      if (interactiveBg) {
        interactiveBg.innerHTML = '';
        initInteractiveBackground();
      }
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
  
  // Recheck theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle && !themeToggle._initialized) {
    initThemeToggle(); // Reinitialize if needed
  }
});