const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const modal = document.querySelector(".contact-modal");
const modalForm = modal?.querySelector("form");

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
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#151d19" : "#10251f");
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
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

function openContact() {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector("input")?.focus();
}

function closeContact() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-open-contact]").forEach((button) => {
  button.addEventListener("click", openContact);
});
document.querySelectorAll("[data-close-contact]").forEach((button) => {
  button.addEventListener("click", closeContact);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeContact();
});

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = values.get("name");
    const email = values.get("email");
    const service = values.get("service");
    const message = values.get("message");
    const text = [
      `Hello Ahmed, I'm ${name}.`,
      `My email: ${email}`,
      service ? `I'm interested in: ${service}` : "",
      `Project details: ${message}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/2347030203622?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
});

const slides = [...document.querySelectorAll(".hero-slide")];
if (slides.length > 1) {
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
