if (window.location.hostname === "sanyam1731.github.io") {
  const robotsMeta = document.createElement("meta");
  robotsMeta.name = "robots";
  robotsMeta.content = "noindex, nofollow";
  document.head.appendChild(robotsMeta);
}

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const servicesNavLink = mainNav?.querySelector('a[href="services.html"]');
if (servicesNavLink) {
  const servicesItem = document.createElement("li");
  servicesItem.className = "nav-dropdown";

  const servicesToggle = document.createElement("button");
  servicesToggle.className = "nav-dropdown-toggle";
  servicesToggle.type = "button";
  servicesToggle.textContent = "Services";
  servicesToggle.setAttribute("aria-expanded", "false");
  servicesToggle.setAttribute("aria-haspopup", "true");
  servicesToggle.setAttribute("aria-controls", "servicesDropdown");
  const servicesChevron = document.createElement("span");
  servicesChevron.className = "nav-dropdown-chevron";
  servicesChevron.setAttribute("aria-hidden", "true");
  servicesToggle.append(servicesChevron);

  const servicesMenu = document.createElement("ul");
  servicesMenu.className = "nav-dropdown-menu";
  servicesMenu.id = "servicesDropdown";

  [
    ["GHG Verification Services", "ghg-verification.html"],
    ["NISST", "nisst-verification.html"],
    ["ADEETIE", "adeetie.html"],
  ].forEach(([label, href]) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = label;
    link.href = href;
    item.append(link);
    servicesMenu.append(item);
  });

  servicesToggle.addEventListener("click", () => {
    const isOpen = servicesToggle.getAttribute("aria-expanded") === "true";
    servicesToggle.setAttribute("aria-expanded", String(!isOpen));
    servicesItem.classList.toggle("is-open", !isOpen);
  });

  servicesItem.append(servicesToggle, servicesMenu);
  servicesNavLink.closest("li").replaceWith(servicesItem);
}
const navLinks = document.querySelectorAll(".nav a");
const sectionsToReveal = document.querySelectorAll(".section, .page-hero, .hero");
const staggerTargets = ".card, .service-item, .service-card, .services-tab, .feature-grid article, .industries span, .office";
const themeToggle = document.getElementById("themeToggle");
const siteHeader = document.querySelector(".site-header");
const processReplayControls = [
  ["ghgProcessReplay", "ghgProcessAnimation"],
  ["nisstProcessReplay", "nisstProcessAnimation"],
  ["adeetieProcessReplay", "adeetieProcessAnimation"]
];

processReplayControls.forEach(([buttonId, animationId]) => {
  document.getElementById(buttonId)?.addEventListener("click", () => {
    const processAnimation = document.getElementById(animationId);
    if (!processAnimation) return;
    processAnimation.classList.add("is-replaying");
    void processAnimation.offsetWidth;
    processAnimation.querySelectorAll("animateMotion").forEach((animation) => animation.beginElement());
    processAnimation.classList.remove("is-replaying");
  });
});

const storedTheme = localStorage.getItem("encon-theme");
if (storedTheme === "dark") {
  document.body.classList.add("theme-dark");
}

const setThemeIcon = () => {
  if (!themeToggle) return;
  const isDark = document.body.classList.contains("theme-dark");
  themeToggle.textContent = isDark ? "☀" : "🌙";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
};

setThemeIcon();

const contactEmailForm = document.getElementById("contactEmailForm");
contactEmailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactEmailForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const whatsappUrl = `https://wa.me/917350542020?text=${encodeURIComponent(`Subject: ${subject}\n\n${body}`)}`;
  window.location.href = whatsappUrl;
});

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");
  localStorage.setItem("encon-theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
  setThemeIcon();
});

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  mainNav.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    const servicesItem = link.closest(".nav-dropdown");
    if (servicesItem) {
      servicesItem.classList.remove("is-open");
      servicesItem.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const servicesItem = mainNav?.querySelector(".nav-dropdown");
  if (servicesItem && !servicesItem.contains(e.target)) {
    servicesItem.classList.remove("is-open");
    servicesItem.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  }
  if (!mainNav || !menuToggle) return;
  if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains("open")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Handle escape key to close mobile menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const servicesItem = mainNav?.querySelector(".nav-dropdown.is-open");
    if (servicesItem) {
      servicesItem.classList.remove("is-open");
      servicesItem.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
      servicesItem.querySelector(".nav-dropdown-toggle")?.focus();
    }
  }
  if (e.key === "Escape" && mainNav?.classList.contains("open")) {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

// Smooth scroll header animation
window.addEventListener("scroll", () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("header-scrolled", window.scrollY > 18);
  
  // Parallax effect for hero section
  const hero = document.querySelector(".hero");
  if (hero && window.scrollY < window.innerHeight) {
    hero.style.backgroundPosition = `center, ${50 + window.scrollY * 0.5}px center`;
  }
});

sectionsToReveal.forEach((section) => {
  section.classList.add("reveal-item");
  const children = section.querySelectorAll(staggerTargets);
  children.forEach((child, index) => {
    child.classList.add("reveal-child");
    child.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
  });
});

// Enhanced reveal animations
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Add scroll-triggered animation to all reveal-child elements
        const children = entry.target.querySelectorAll(".reveal-child");
        children.forEach((child) => {
          child.style.animationPlayState = "running";
        });
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

sectionsToReveal.forEach((section) => {
  revealObserver.observe(section);
});

// Smooth scroll for anchor links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

// Services tabs (services.html)
const serviceTabs = document.querySelectorAll("[data-services-tab]");
const servicePanels = document.querySelectorAll("[data-services-panel]");
const serviceTabsContainer = document.querySelector(".services-tabs");

const setActiveServiceTab = (key) => {
  if (!key) return;
  serviceTabs.forEach((tab) => {
    const isActive = tab.getAttribute("data-services-tab") === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  servicePanels.forEach((panel) => {
    const isActive = panel.getAttribute("data-services-panel") === key;
    panel.classList.toggle("is-active", isActive);
    if (isActive) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
  });

  // Auto-scroll to active tab on mobile
  if (serviceTabsContainer && window.innerWidth <= 760) {
    const activeTab = document.querySelector(`[data-services-tab="${key}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }
};

serviceTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.getAttribute("data-services-tab");
    setActiveServiceTab(key);
    if (key) {
      history.replaceState(null, "", `#${key}`);
    }
  });
});

if (serviceTabs.length) {
  const initialKey = (location.hash || "").replace("#", "");
  const exists = Array.from(serviceTabs).some((t) => t.getAttribute("data-services-tab") === initialKey);
  setActiveServiceTab(exists ? initialKey : serviceTabs[0].getAttribute("data-services-tab"));
}

// Service accordions: keep only one open at a time (per card)
document.addEventListener(
  "toggle",
  (event) => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement)) return;
    if (!details.classList.contains("service-accordion")) return;
    if (!details.open) return;

    const scope = details.closest(".service-card-body") || document;
    scope.querySelectorAll(".service-accordion").forEach((other) => {
      if (other !== details) other.open = false;
    });
  },
  true
);

// Slideshow functionality
let currentSlideIndex = 1;
let slideAutoPlayInterval;

const showSlide = (n) => {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  if (!slides.length) return;
  currentSlideIndex = ((n - 1 + slides.length) % slides.length) + 1;

  slides.forEach((slide, index) => {
    const isActive = index === currentSlideIndex - 1;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  dots.forEach((dot, index) => {
    const isActive = index === currentSlideIndex - 1;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });
};

const changeSlide = (n) => {
  clearInterval(slideAutoPlayInterval);
  currentSlideIndex += n;
  showSlide(currentSlideIndex);
  autoPlaySlideshow();
};

const currentSlide = (n) => {
  clearInterval(slideAutoPlayInterval);
  currentSlideIndex = n;
  showSlide(currentSlideIndex);
  autoPlaySlideshow();
};

const autoPlaySlideshow = () => {
  slideAutoPlayInterval = setInterval(() => {
    currentSlideIndex += 1;
    showSlide(currentSlideIndex);
  }, 5000); // Change slide every 5 seconds
};

// Initialize slideshow
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideDots = document.querySelectorAll(".dot");

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => changeSlide(-1));
  nextBtn.addEventListener("click", () => changeSlide(1));
  slideDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const slideIndex = Number(dot.getAttribute("data-slide-index"));
      if (Number.isInteger(slideIndex) && slideIndex > 0) {
        currentSlide(slideIndex);
      }
    });
  });
  
  // Start auto-play
  showSlide(currentSlideIndex);
  autoPlaySlideshow();
  
  // Pause on hover
  const slideshowContainer = document.querySelector(".slideshow-container");
  if (slideshowContainer) {
    slideshowContainer.addEventListener("mouseenter", () => {
      clearInterval(slideAutoPlayInterval);
    });
    
    slideshowContainer.addEventListener("mouseleave", () => {
      autoPlaySlideshow();
    });
  }
}
