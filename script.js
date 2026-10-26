const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const modal = document.querySelector(".contact-modal");
const whatsappNumber = "2347030203622";
let contactTrigger = null;

document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  link.href = `https://wa.me/${whatsappNumber}`;
  link.setAttribute("aria-label", "Chat with Garkis-Kainji Prints on WhatsApp");
});
document.querySelectorAll("[data-phone-link]").forEach((link) => {
  link.href = `tel:+${whatsappNumber}`;
});
const contactPhone = whatsappNumber.startsWith("234") ? `0${whatsappNumber.slice(3)}` : whatsappNumber;
document.querySelectorAll("[data-contact-phone]").forEach((element) => {
  element.textContent = contactPhone;
});

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("garkis-theme");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  if (themeToggle) {
    const nextTheme = isDark ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
    themeToggle.querySelector(".theme-toggle-label").textContent = `${nextTheme === "dark" ? "Dark" : "Light"} mode`;
    themeToggle.querySelector(".theme-toggle-icon").textContent = isDark ? "☀" : "☾";
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#111a2d" : "#101c36");
}

applyTheme(storedTheme === "dark" ? "dark" : "light");
themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("garkis-theme", nextTheme);
  applyTheme(nextTheme);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

function openContact(event) {
  if (!modal) return;
  contactTrigger = event.currentTarget;
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector("input")?.focus();
}

function closeContact() {
  if (!modal) return;
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  contactTrigger?.focus();
}

document.querySelectorAll("[data-open-contact]").forEach((button) => {
  button.addEventListener("click", openContact);
});
document.querySelectorAll("[data-close-contact]").forEach((button) => {
  button.addEventListener("click", closeContact);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeContact();
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    navigation?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }
  if (event.key === "Tab" && modal?.classList.contains("is-open")) {
    const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = values.get("name");
    const email = values.get("email");
    const phone = values.get("phone");
    const service = values.get("service");
    const message = values.get("message");
    const text = [
      `Hello Garkis-Kainji Prints, I'm ${name}.`,
      `My email: ${email}`,
      `My phone: ${phone}`,
      service ? `I'm interested in: ${service}` : "",
      `Project details: ${message}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
});

const portfolioFilters = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item[data-category]");
portfolioFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    portfolioFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    portfolioItems.forEach((item) => {
      item.hidden = category !== "all" && item.dataset.category !== category;
    });
  });
});

const slides = [...document.querySelectorAll(".hero-slide")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (slides.length > 1 && !reducedMotion) {
  let activeSlide = 0;
  window.setInterval(() => {
    slides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add("is-active");
    const count = document.querySelector(".slide-count");
    if (count) count.textContent = String(activeSlide + 1).padStart(2, "0");
  }, 5500);
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
