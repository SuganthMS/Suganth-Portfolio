const loader = document.getElementById("loader");
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.getElementById("themeToggle");
const typingText = document.getElementById("typingText");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const roles = ["AI Student", "Generative AI Intern"];
const savedTheme = localStorage.getItem("portfolioTheme");
const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function getInitialTheme() {
  return savedTheme || (systemPrefersLight.matches ? "light" : "dark");
}

function applyTheme(theme, shouldSave = true) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");

  if (shouldSave) {
    localStorage.setItem("portfolioTheme", theme);
  }
}

applyTheme(getInitialTheme(), Boolean(savedTheme));

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 650);
});

function typeRole() {
  const currentRole = roles[roleIndex];
  const displayedText = currentRole.slice(0, charIndex);
  typingText.textContent = displayedText;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(typeRole, 90);
    return;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    setTimeout(typeRole, 1200);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 45);
    return;
  }

  isDeleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 250);
}

typeRole();

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  themeToggle.classList.remove("switching");
  void themeToggle.offsetWidth;
  themeToggle.classList.add("switching");
  applyTheme(nextTheme);
});

themeToggle.addEventListener("animationend", () => {
  themeToggle.classList.remove("switching");
});

systemPrefersLight.addEventListener("change", (event) => {
  if (localStorage.getItem("portfolioTheme")) return;
  applyTheme(event.matches ? "light" : "dark", false);
});

function updateHeaderState() {
  const scrolled = window.scrollY > 16;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 480);
}

window.addEventListener("scroll", updateHeaderState);
updateHeaderState();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -60px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    threshold: 0.45,
  }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thank you. Your message has been prepared for Suganth MS.";
    contactForm.reset();
  });
}
