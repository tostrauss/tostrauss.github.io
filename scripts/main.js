// Modern Portfolio - Streamlined JavaScript
// For Tobias Strauss portfolio website

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  // Initialize core functions with proper sequence
  initParticlesBackground();
  initThemeToggle();
  initCardFlip();
  initFadeIn();
  initSkillsAnimation();
  initProjectCardInteraction();
});

/**
 * Initializes the interactive particles background 
 * - Fixed to ensure it properly displays
 */
function initParticlesBackground() {
  // Ensure the interactive background element exists
  const interactiveBg = document.getElementById("interactive-bg");
  
  if (!interactiveBg) {
    console.warn("Interactive background element not found");
    return;
  }
  
  // Ensure particles.js is loaded
  if (typeof particlesJS === 'undefined') {
    console.error("Particles.js not loaded. Make sure to include the script properly.");
    
    // Create a fallback pattern if particles.js isn't available
    createBackupPattern(interactiveBg);
    return;
  }
  
  // Enhanced particles configuration for better performance and visual appeal
  particlesJS("interactive-bg", {
    particles: {
      number: { 
        value: 70, 
        density: { enable: true, value_area: 1200 } 
      },
      color: { value: "#ffcc00" },
      shape: { 
        type: "circle",
        stroke: { width: 0, color: "#000000" },
        polygon: { nb_sides: 5 }
      },
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
        speed: 1.5, 
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
        grab: { distance: 140, line_linked: { opacity: 0.5 } },
        push: { particles_nb: 3 }
      },
    },
    retina_detect: true,
    fps_limit: 60
  });
  
  // Ensure the particles container is visible
  interactiveBg.style.opacity = "0.2";
  interactiveBg.style.zIndex = "-1";
  interactiveBg.style.position = "fixed";
  interactiveBg.style.width = "100%";
  interactiveBg.style.height = "100%";
  interactiveBg.style.top = "0";
  interactiveBg.style.left = "0";
  interactiveBg.style.pointerEvents = "none";
}

/**
 * Creates a fallback pattern if particles.js isn't available
 */
function createBackupPattern(container) {
  // Create a subtle gradient background
  container.style.backgroundImage = "radial-gradient(circle, rgba(255,204,0,0.1) 0%, rgba(0,0,0,0) 70%)";
  container.style.backgroundSize = "100px 100px";
  container.style.backgroundPosition = "0 0, 50px 50px";
  container.style.opacity = "0.2";
}

/**
 * Initializes theme toggle functionality
 */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  
  if (!themeToggle) return;
  
  const themeIcon = themeToggle.querySelector("i");
  
  // Check for saved theme preference with improved localStorage handling
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
          console.warn("Unable to save theme preference to localStorage");
        }
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        try {
          localStorage.setItem('theme', 'dark');
        } catch (err) {
          console.warn("Unable to save theme preference to localStorage");
        }
      }
    }
    
    // Ensure particles adapt to theme change
    updateParticlesTheme();
  });
}

/**
 * Updates particles colors based on theme
 */
function updateParticlesTheme() {
  // Only proceed if particles.js is available
  if (typeof particlesJS === 'undefined') return;
  
  const isLightMode = document.body.classList.contains("light-mode");
  
  try {
    // This approach assumes pJS is available in window scope
    if (window.pJSDom && window.pJSDom.length > 0) {
      const particles = window.pJSDom[0].pJS.particles;
      
      // Update colors based on theme
      particles.line_linked.color = isLightMode ? "#ffaa00" : "#ffcc00";
      particles.color.value = isLightMode ? "#ffaa00" : "#ffcc00";
      
      // Refresh particles
      if (particles.move.enable) {
        window.pJSDom[0].pJS.fn.particlesRefresh();
      }
    }
  } catch (err) {
    console.warn("Could not update particles theme", err);
  }
}

/**
 * Enhanced card flip functionality with smooth transitions
 */
function initCardFlip() {
  const projectCards = document.querySelectorAll('.project-card');
  const flipButtons = document.querySelectorAll('.flip-button');
  
  if (projectCards.length === 0) return;
  
  // Add subtle hover effect to all cards
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Apply floating animation
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.25)';
      
      // Show flip button more prominently
      const flipBtn = this.querySelector('.flip-button');
      if (flipBtn) {
        flipBtn.style.opacity = '1';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      // Only reset if not flipped
      if (!this.classList.contains('flipped')) {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
      }
      
      // Hide flip button unless hovered
      const flipBtn = this.querySelector('.flip-button');
      if (flipBtn) {
        flipBtn.style.opacity = '0.8';
      }
    });
  });
  
  // Handle flip button clicks
  flipButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      
      const card = this.closest('.project-card');
      card.classList.toggle('flipped');
      
      // Add enhanced 3D effect during flip
      if (card.classList.contains('flipped')) {
        card.style.transform = 'rotateY(180deg) translateZ(10px)';
      } else {
        card.style.transform = 'rotateY(0) translateZ(0)';
        
        // Reset to default after a moment
        setTimeout(() => {
          if (!card.classList.contains('flipped')) {
            card.style.transform = 'translateY(0)';
          }
        }, 300);
      }
    });
  });
  
  // Add click outside to flip back
  document.addEventListener('click', function(e) {
    projectCards.forEach(card => {
      if (card.classList.contains('flipped')) {
        // Check if click was outside the card
        if (!card.contains(e.target)) {
          card.classList.remove('flipped');
          card.style.transform = 'rotateY(0) translateZ(0)';
          
          // Reset to default after a moment
          setTimeout(() => {
            card.style.transform = 'translateY(0)';
          }, 300);
        }
      }
    });
  });
  
  // Ensure both sides of cards are properly styled
  enhanceProjectCardStyles();
}

/**
 * Apply enhanced styles to project cards
 */
function enhanceProjectCardStyles() {
  const cardFronts = document.querySelectorAll('.project-card-front');
  const cardBacks = document.querySelectorAll('.project-card-back');
  
  // Enhance front of cards
  cardFronts.forEach(front => {
    front.style.display = 'flex';
    front.style.flexDirection = 'column';
  });
  
  // Enhance back of cards for better tech stack presentation
  cardBacks.forEach(back => {
    back.style.display = 'flex';
    back.style.flexDirection = 'column';
    back.style.justifyContent = 'center';
    back.style.alignItems = 'center';
    back.style.padding = '2rem';
    back.style.textAlign = 'center';
    
    // Add floating animation to tech tags
    const techTags = back.querySelectorAll('.tech-tag');
    if (techTags) {
      techTags.forEach((tag, index) => {
        tag.style.animation = `float ${1 + (index % 3) * 0.2}s ease-in-out infinite alternate`;
      });
    }
  });
}

/**
 * Add custom floating animation for elements
 */
function addKeyframeStyles() {
  // Create a style element
  const style = document.createElement('style');
  
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

/**
 * Improved staggered fade-in animations
 */
function initFadeIn() {
  // Add keyframe animations first
  addKeyframeStyles();
  
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length === 0) return;
  
  // Create an Intersection Observer to trigger animations when elements are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Add a staggered delay based on the element's position
        setTimeout(() => {
          entry.target.classList.add('active');
        }, 100 + (i * 100));
        
        // Once the animation is triggered, stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // Trigger when at least 10% of the element is visible
  });
  
  // Start observing each fade element
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
 * Enhance project card interactions
 */
function initProjectCardInteraction() {
  const projectCards = document.querySelectorAll('.project-card');
  
  if (projectCards.length === 0) return;
  
  projectCards.forEach(card => {
    // Add shimmer effect on hover
    const shimmerEffect = document.createElement('div');
    shimmerEffect.classList.add('shimmer-effect');
    card.appendChild(shimmerEffect);
    
    // Ensure proper z-index layering
    const cardFront = card.querySelector('.project-card-front');
    const cardBack = card.querySelector('.project-card-back');
    
    if (cardFront && cardBack) {
      cardFront.style.zIndex = '2';
      cardBack.style.zIndex = '1';
    }
    
    // Add subtle parallax effect on hover
    card.addEventListener('mousemove', function(e) {
      if (this.classList.contains('flipped')) return;
      
      // Calculate mouse position relative to card
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the card
      const y = e.clientY - rect.top; // y position within the card
      
      // Calculate rotation based on mouse position
      // Limit rotation to a subtle amount (max 3 degrees)
      const rotateY = ((x / rect.width) - 0.5) * 6;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      
      // Apply the transform
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('flipped')) {
        // Reset transform when mouse leaves
        this.style.transform = 'translateY(0)';
      }
    });
  });
}

// Initialize on load to ensure all content is ready
window.addEventListener('load', function() {
  // Recheck interactive background
  const interactiveBg = document.getElementById("interactive-bg");
  if (interactiveBg && typeof particlesJS !== 'undefined') {
    interactiveBg.innerHTML = ''; // Clear any existing content
    initParticlesBackground(); // Reinitialize
  }
  
  // Add additional interactive elements if needed
  enhanceNavigationLinks();
  enhanceHeroSection();
});

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
 * Add subtle enhancements to the hero section
 */
function enhanceHeroSection() {
  const heroText = document.querySelector('.hero-text h1 span');
  
  if (heroText) {
    // Add subtle highlight animation
    heroText.style.position = 'relative';
    
    // Create underline effect
    const underline = document.createElement('span');
    underline.style.position = 'absolute';
    underline.style.bottom = '-5px';
    underline.style.left = '0';
    underline.style.width = '0';
    underline.style.height = '2px';
    underline.style.backgroundColor = '#ffcc00';
    underline.style.transition = 'width 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    // Append underline to hero text
    heroText.appendChild(underline);
    
    // Animate underline on page load
    setTimeout(() => {
      underline.style.width = '100%';
    }, 1000);
  }
  /**
 * Enhanced Project Cards JavaScript
 * Adds advanced interaction and 3D effects to project cards
 */

// Initialize when DOM is ready
function initEnhancedProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  const flipButtons = document.querySelectorAll('.flip-button');
  
  if (projectCards.length === 0) return;
  
  // Add project content from README files
  updateProjectContent();
  
  // Add 3D hover effects to project cards
  projectCards.forEach(card => {
    // Create shimmer effect if not already present
    if (!card.querySelector('.shimmer-effect')) {
      const shimmer = document.createElement('div');
      shimmer.className = 'shimmer-effect';
      card.appendChild(shimmer);
    }
    
    // Add 3D hover effect (inspired by 1Percent Training cards)
    card.addEventListener('mousemove', function(e) {
      // Only apply if not flipped
      if (this.classList.contains('flipped')) return;
      
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position (max 5 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;
      
      // Apply transform with smooth transition
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      this.style.boxShadow = `
        ${-rotateY/2}px ${-rotateX/2}px 20px rgba(255, 204, 0, 0.1),
        ${rotateY/2}px ${rotateX/2}px 20px rgba(0, 0, 0, 0.3)
      `;
      
      // Add depth to content elements
      const title = this.querySelector('h3');
      const image = this.querySelector('.project-image img');
      const tags = this.querySelectorAll('.project-tag');
      
      if (title) title.style.transform = `translateZ(20px)`;
      if (image) image.style.transform = `scale(1.05) translateZ(5px)`;
      
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
        const image = this.querySelector('.project-image img');
        const tags = this.querySelectorAll('.project-tag');
        
        if (title) title.style.transform = '';
        if (image) image.style.transform = '';
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
  
  // Add click outside to flip back
  document.addEventListener('click', function(e) {
    projectCards.forEach(card => {
      if (card.classList.contains('flipped')) {
        // Check if click was outside the card
        if (!card.contains(e.target)) {
          card.classList.remove('flipped');
          card.style.transform = '';
        }
      }
    });
  });
}

/**
 * Update project card content with information from README files
 */
function updateProjectContent() {
  // College Recruit App
  updateCollegeRecruitCard();
  
  // Stock Analysis Tool
  updateStockAnalysisCard();
  
  // Time Tracking Tool
  updateTimeTrackingCard();
}

/**
 * Updates the College Recruit Card back with dynamic content
 */
function updateCollegeRecruitCard() {
  const card = document.querySelector('.project-card:nth-child(1)');
  if (!card) return;
  
  // Get front and back sides
  const cardFront = card.querySelector('.project-card-front');
  const cardBack = card.querySelector('.project-card-back');
  
  // If back doesn't exist, create it
  if (!cardBack) {
    createProjectCardBack(card, {
      title: "College Recruit App",
      imageSrc: cardFront.querySelector('.project-image img').src,
      features: [
        "Comprehensive recruitment platform for international soccer players",
        "Cross-platform compatibility (web, iOS, Android)",
        "User profiles and college matching algorithm",
        "Real-time messaging and notifications",
        "College database with filtering and search capabilities",
        "Scholarship tracking and application management"
      ],
      techStack: [
        "Angular", "TypeScript", "HTML", "CSS", "JavaScript", 
        "Node.js", "Express", "Firebase"
      ]
    });
  }
}

/**
 * Updates the Stock Analysis Tool Card back with dynamic content
 */
function updateStockAnalysisCard() {
  const card = document.querySelector('.project-card:nth-child(2)');
  if (!card) return;
  
  // Get front and back sides
  const cardFront = card.querySelector('.project-card-front');
  const cardBack = card.querySelector('.project-card-back');
  
  // If back doesn't exist, create it
  if (!cardBack) {
    createProjectCardBack(card, {
      title: "Stock Analysis & Options Trading Tool",
      imageSrc: cardFront.querySelector('.project-image img').src,
      features: [
        "Real-time market data integration",
        "Interactive financial dashboards",
        "Technical analysis tools with customizable indicators",
        "Options chain analysis and strategy visualization",
        "Backtesting capabilities for trading strategies",
        "Risk management and portfolio analytics"
      ],
      techStack: [
        "Python", "Pandas", "NumPy", "Flask", "PostgreSQL", 
        "Dash", "Plotly", "Financial APIs"
      ]
    });
  }
}

/**
 * Updates the Time Tracking Tool Card back with dynamic content
 */
function updateTimeTrackingCard() {
  const card = document.querySelector('.project-card:nth-child(3)');
  if (!card) return;
  
  // Get front and back sides
  const cardFront = card.querySelector('.project-card-front');
  const cardBack = card.querySelector('.project-card-back');
  
  // If back doesn't exist, create it
  if (!cardBack) {
    createProjectCardBack(card, {
      title: "Time Tracking & Gantt-Chart",
      imageSrc: cardFront.querySelector('.project-image img').src,
      features: [
        "Comprehensive time tracking with clock in/out functionality",
        "Gantt chart project visualization and management",
        "Team collaboration and task assignment",
        "Project progress tracking and milestone management",
        "Data visualization with interactive charts",
        "Integrated with CollegeRecruit library"
      ],
      techStack: [
        "JavaScript", "HTML", "CSS", "Chart.js", 
        "jQuery", "Bootstrap", "Firebase"
      ]
    });
  }
}

/**
 * Creates a project card back with provided content
 */
function createProjectCardBack(card, data) {
  // Create card back if it doesn't exist
  if (!card.querySelector('.project-card-back')) {
    const cardBack = document.createElement('div');
    cardBack.className = 'project-card-back';
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-card-back-image';
    
    // Create image
    const image = document.createElement('img');
    image.src = data.imageSrc;
    image.alt = data.title;
    imageContainer.appendChild(image);
    
    // Create back content container
    const backContent = document.createElement('div');
    backContent.className = 'project-back-content';
    
    // Create tech stack
    const techTags = document.createElement('div');
    techTags.className = 'tech-tags';
    
    data.techStack.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      techTags.appendChild(tag);
    });
    
    // Create features
    const features = document.createElement('div');
    features.className = 'project-features';
    
    const featuresTitle = document.createElement('h4');
    featuresTitle.textContent = 'Key Features';
    features.appendChild(featuresTitle);
    
    const featureList = document.createElement('div');
    featureList.className = 'feature-list';
    
    data.features.forEach(feature => {
      const featureItem = document.createElement('div');
      featureItem.className = 'feature-item';
      featureItem.style.opacity = '0.8';
      
      const icon = document.createElement('span');
      icon.className = 'feature-item-icon';
      icon.innerHTML = '&#9733;'; // Star symbol
      
      const text = document.createElement('span');
      text.textContent = feature;
      
      featureItem.appendChild(icon);
      featureItem.appendChild(text);
      featureList.appendChild(featureItem);
    });
    
    features.appendChild(featureList);
    
    // Add flip button
    const flipButton = document.createElement('button');
    flipButton.className = 'flip-button';
    flipButton.setAttribute('aria-label', 'Flip card');
    flipButton.innerHTML = '<i class="fas fa-undo"></i>';
    
    // Assemble card back
    cardBack.appendChild(imageContainer);
    backContent.appendChild(techTags);
    backContent.appendChild(features);
    cardBack.appendChild(backContent);
    cardBack.appendChild(flipButton);
    
    // Add card back to card
    card.appendChild(cardBack);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initEnhancedProjectCards();
});

// Ensure it also works when the page is fully loaded
window.addEventListener('load', function() {
  // Check if cards were already initialized
  const backSides = document.querySelectorAll('.project-card-back');
  if (backSides.length === 0) {
    initEnhancedProjectCards();
  }
});
/**
 * Enhanced Project Cards JavaScript
 * Shows project image ONLY when card is flipped to the back
 */

// Initialize when DOM is ready
function initEnhancedProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  const flipButtons = document.querySelectorAll('.flip-button');
  
  if (projectCards.length === 0) return;
  
  // Update project content from README files
  updateProjectContent();
  
  // Add 3D hover effects to project cards
  projectCards.forEach(card => {
    // Create shimmer effect if not already present
    if (!card.querySelector('.shimmer-effect')) {
      const shimmer = document.createElement('div');
      shimmer.className = 'shimmer-effect';
      card.appendChild(shimmer);
    }
    
    // Add 3D hover effect (inspired by 1Percent Training cards)
    card.addEventListener('mousemove', function(e) {
      // Only apply if not flipped
      if (this.classList.contains('flipped')) return;
      
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position (max 5 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;
      
      // Apply transform with smooth transition
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
  
  // Add click outside to flip back
  document.addEventListener('click', function(e) {
    projectCards.forEach(card => {
      if (card.classList.contains('flipped')) {
        // Check if click was outside the card
        if (!card.contains(e.target)) {
          card.classList.remove('flipped');
          card.style.transform = '';
        }
      }
    });
  });
}

/**
 * Update project card content with information from README files
 */
function updateProjectContent() {
  // College Recruit App
  updateCollegeRecruitCard();
  
  // Stock Analysis Tool
  updateStockAnalysisCard();
  
  // Time Tracking Tool
  updateTimeTrackingCard();
}

/**
 * Updates the College Recruit Card back with dynamic content
 */
function updateCollegeRecruitCard() {
  const card = document.querySelector('.project-card:nth-child(1)');
  if (!card) return;
  
  // Get or create the back side
  let cardBack = card.querySelector('.project-card-back');
  
  // If back doesn't exist, create it
  if (!cardBack) {
    createProjectCardBack(card, {
      title: "College Recruit App",
      imageSrc: "images/CollegeRecruit_Logo.png", // Reference to the image
      features: [
        "Comprehensive recruitment platform for international soccer players",
        "Cross-platform compatibility (web, iOS, Android)",
        "User profiles and college matching algorithm",
        "Real-time messaging and notifications",
        "College database with filtering and search capabilities",
        "Scholarship tracking and application management"
      ],
      techStack: [
        "Angular", "TypeScript", "HTML", "CSS", "JavaScript", 
        "Node.js", "Express", "Firebase"
      ]
    });
  }
}

/**
 * Updates the Stock Analysis Tool Card back with dynamic content
 */
function updateStockAnalysisCard() {
  const card = document.querySelector('.project-card:nth-child(2)');
  if (!card) return;
  
  // Get or create the back side
  let cardBack = card.querySelector('.project-card-back');
  
  // If back doesn't exist, create it
  if (!cardBack) {
    createProjectCardBack(card, {
      title: "Stock Analysis & Options Trading Tool",
      imageSrc: "images/stock-dashboard.png", // Reference to screenshot image
      features: [
        "Real-time market data integration",
        "Interactive financial dashboards",
        "Technical analysis tools with customizable indicators",
        "Options chain analysis and strategy visualization",
        "Backtesting capabilities for trading strategies",
        "Risk management and portfolio analytics"
      ],
      techStack: [
        "Python", "Pandas", "NumPy", "Flask", "PostgreSQL", 
        "Dash", "Plotly", "Financial APIs"
      ]
    });
  }
}

/**
 * Updates the Time Tracking Tool Card back with dynamic content
 */
function updateTimeTrackingCard() {
  const card = document.querySelector('.project-card:nth-child(3)');
  if (!card) return;
  
  // Get or create the back side
  let cardBack = card.querySelector('.project-card-back');
  
  // If back doesn't exist, create it
  if (!cardBack) {
    createProjectCardBack(card, {
      title: "Time Tracking & Gantt-Chart",
      imageSrc: "images/time-tracking-screenshot.png", // Reference to screenshot
      features: [
        "Comprehensive time tracking with clock in/out functionality",
        "Gantt chart project visualization and management",
        "Team collaboration and task assignment",
        "Project progress tracking and milestone management",
        "Data visualization with interactive charts",
        "Integrated with CollegeRecruit library"
      ],
      techStack: [
        "JavaScript", "HTML", "CSS", "Chart.js", 
        "jQuery", "Bootstrap", "Firebase"
      ]
    });
  }
}

/**
 * Creates a project card back with provided content
 */
function createProjectCardBack(card, data) {
  // Create card back if it doesn't exist
  if (!card.querySelector('.project-card-back')) {
    const cardBack = document.createElement('div');
    cardBack.className = 'project-card-back';
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-card-back-image';
    
    // Create image
    const image = document.createElement('img');
    image.src = data.imageSrc;
    image.alt = data.title;
    imageContainer.appendChild(image);
    
    // Create back content container
    const backContent = document.createElement('div');
    backContent.className = 'project-back-content';
    
    // Create tech stack
    const techTags = document.createElement('div');
    techTags.className = 'tech-tags';
    
    data.techStack.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      techTags.appendChild(tag);
    });
    
    // Create features
    const features = document.createElement('div');
    features.className = 'project-features';
    
    const featuresTitle = document.createElement('h4');
    featuresTitle.textContent = 'Key Features';
    features.appendChild(featuresTitle);
    
    const featureList = document.createElement('div');
    featureList.className = 'feature-list';
    
    data.features.forEach(feature => {
      const featureItem = document.createElement('div');
      featureItem.className = 'feature-item';
      featureItem.style.opacity = '0.8';
      
      const icon = document.createElement('span');
      icon.className = 'feature-item-icon';
      icon.innerHTML = '&#9733;'; // Star symbol
      
      const text = document.createElement('span');
      text.textContent = feature;
      
      featureItem.appendChild(icon);
      featureItem.appendChild(text);
      featureList.appendChild(featureItem);
    });
    
    features.appendChild(featureList);
    
    // Add flip button
    const flipButton = document.createElement('button');
    flipButton.className = 'flip-button';
    flipButton.setAttribute('aria-label', 'Flip card');
    flipButton.innerHTML = '<i class="fas fa-undo"></i>';
    
    // Assemble card back
    cardBack.appendChild(imageContainer);
    backContent.appendChild(techTags);
    backContent.appendChild(features);
    cardBack.appendChild(backContent);
    cardBack.appendChild(flipButton);
    
    // Add card back to card
    card.appendChild(cardBack);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initEnhancedProjectCards();
});

// Ensure it also works when the page is fully loaded
window.addEventListener('load', function() {
  // Check if cards were already initialized
  const backSides = document.querySelectorAll('.project-card-back');
  if (backSides.length === 0) {
    initEnhancedProjectCards();
  }
});
}