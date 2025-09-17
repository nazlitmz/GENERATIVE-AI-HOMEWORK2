// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initScrollAnimations();
  initSkillBars();
  initStatCounters();
  initContactForm();
  initSmoothScrolling();
  initParallaxEffects();
});

// Navigation functionality
function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbar = document.querySelector(".navbar");

  // Mobile menu toggle
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Active navigation link highlighting
  window.addEventListener("scroll", function () {
    let current = "";
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Add animation classes and observe elements
  const animatedElements = [
    ".about-item",
    ".stat-card",
    ".skill-category",
    ".project-card",
    ".contact-item",
    ".section-title",
  ];

  animatedElements.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      element.classList.add("fade-in");
      element.style.animationDelay = `${index * 0.1}s`;
      observer.observe(element);
    });
  });
}

// Animated skill bars
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  const skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.getAttribute("data-width");

          setTimeout(() => {
            progressBar.style.width = targetWidth;
          }, 500);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => {
    skillObserver.observe(bar);
  });
}

// Animated counters for stats
function initStatCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");

  const countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-target"));
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60 FPS
          let current = 0;

          const updateCounter = () => {
            if (current < target) {
              current += increment;
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          updateCounter();
          countObserver.unobserve(counter); // Only animate once
        }
      });
    },
    { threshold: 0.7 }
  );

  statNumbers.forEach((number) => {
    countObserver.observe(number);
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // Basic validation
      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!validateEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Simulate form submission
      showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
      contactForm.reset();

      // Here you would typically send the data to a server
      console.log("Form submitted:", { name, email, subject, message });
    });
  }
}

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;

  // Add animation keyframes if not already added
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease forwards";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Parallax effects
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll(".floating-icons .icon");

  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.1;
      element.style.transform = `translateY(${rate * speed}px) rotate(${
        scrolled * speed * 0.1
      }deg)`;
    });
  });
}

// Typing effect for hero title
function initTypingEffect() {
  const titleElement = document.querySelector(".hero-title");
  if (!titleElement) return;

  const text = titleElement.textContent;
  titleElement.textContent = "";
  titleElement.style.borderRight = "2px solid #667eea";

  let index = 0;
  const typeSpeed = 100;

  function typeWriter() {
    if (index < text.length) {
      titleElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, typeSpeed);
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        titleElement.style.borderRight = "none";
      }, 1000);
    }
  }

  // Start typing after a short delay
  setTimeout(typeWriter, 500);
}

// Mouse cursor effect
function initCursorEffect() {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
    `;
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // Cursor hover effects
  const hoverElements = document.querySelectorAll(
    "a, button, .project-card, .skill-item"
  );
  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
      cursor.style.background = "rgba(102, 126, 234, 0.8)";
    });

    element.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.background = "rgba(102, 126, 234, 0.5)";
    });
  });
}

// Theme toggle functionality (bonus feature)
function initThemeToggle() {
  const themeToggle = document.createElement("button");
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.className = "theme-toggle";
  themeToggle.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(themeToggle);

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    // Save theme preference
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy loading for images (if you add real images later)
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize additional features
window.addEventListener("load", function () {
  // initTypingEffect(); // Uncomment if you want typing effect
  // initCursorEffect(); // Uncomment if you want custom cursor
  // initThemeToggle(); // Uncomment if you want dark mode toggle

  // Add loading class to body for initial animations
  document.body.classList.add("loaded");

  // Initialize lazy loading if needed
  initLazyLoading();
});

// Handle window resize
window.addEventListener(
  "resize",
  throttle(function () {
    // Recalculate any layout-dependent features
    const navMenu = document.querySelector(".nav-menu");
    const hamburger = document.querySelector(".hamburger");

    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    }
  }, 250)
);

// Error handling for older browsers
try {
  // Check for IntersectionObserver support
  if (!window.IntersectionObserver) {
    // Fallback: Add visible class to all animated elements
    const animatedElements = document.querySelectorAll(
      ".fade-in, .slide-in-left, .slide-in-right"
    );
    animatedElements.forEach((element) => {
      element.classList.add("visible");
    });

    // Fallback for skill bars
    const skillBars = document.querySelectorAll(".skill-progress");
    skillBars.forEach((bar) => {
      bar.style.width = bar.getAttribute("data-width");
    });

    // Fallback for counters
    const statNumbers = document.querySelectorAll(".stat-number");
    statNumbers.forEach((number) => {
      number.textContent = number.getAttribute("data-target");
    });
  }
} catch (error) {
  console.log("Some features may not work in older browsers");
}
