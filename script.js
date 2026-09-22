const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const emptyMessage = document.querySelector("[data-filter-empty]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

const closeMenu = () => {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category?.split(" ") ?? [];
      const isVisible = filter === "all" || categories.includes(filter);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  });
});

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}
