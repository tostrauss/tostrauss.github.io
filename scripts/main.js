// Wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Initialize particles.js on the element with id "interactive-bg"
    particlesJS("interactive-bg", {
      particles: {
        number: { value: 150, density: { enable: true, value_area: 800 } },
        color: { value: "#ffcc00" },
        shape: { type: "circle" },
        opacity: { value: 0.4 },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffcc00",
          opacity: 0.4,
          width: 1,
        },
        move: { enable: true, speed: 3, direction: "none", random: false, straight: false },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  
    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      themeToggle.textContent = document.body.classList.contains("light-mode")
        ? "Dark Mode"
        : "Light Mode";
    });
  });
  