const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav a");
const statNumbers = document.querySelectorAll(".count");
const contactForm = document.querySelector(".contact-form");
const sectionsToReveal = document.querySelectorAll(".section, .page-hero, .hero");
const staggerTargets = ".card, .service-item, .service-card, .services-tab, .feature-grid article, .stat, .industries span, .contact-form, .office";
const themeToggle = document.getElementById("themeToggle");
const siteHeader = document.querySelector(".site-header");

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
  });
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

const animateCounters = () => {
  statNumbers.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const start = 0;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * progress);
      counter.textContent = value.toLocaleString("en-IN");
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
};

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        obs.disconnect();
      }
    });
  },
  { threshold: 0.35 }
);

const awardsSection = document.getElementById("awards");
if (awardsSection) {
  observer.observe(awardsSection);
}

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

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const btn = contactForm.querySelector("button");
  const initialLabel = btn.textContent;
  btn.textContent = "Message Sent ✓";
  btn.disabled = true;
  contactForm.reset();

  setTimeout(() => {
    btn.textContent = initialLabel;
    btn.disabled = false;
  }, 1800);
});

// Services tabs (services.html)
const serviceTabs = document.querySelectorAll("[data-services-tab]");
const servicePanels = document.querySelectorAll("[data-services-panel]");

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
