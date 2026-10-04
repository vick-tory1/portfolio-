const portfolioNav = document.querySelector("body > nav");
const portfolioNavToggle = portfolioNav?.querySelector(".nav-toggle");

function setPortfolioNavOpen(isOpen) {
  if (!portfolioNav || !portfolioNavToggle) return;
  portfolioNav.classList.toggle("is-open", isOpen);
  portfolioNavToggle.setAttribute("aria-expanded", String(isOpen));
  portfolioNavToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
}

portfolioNavToggle?.addEventListener("click", () => {
  const isOpen = portfolioNavToggle.getAttribute("aria-expanded") === "true";
  setPortfolioNavOpen(!isOpen);
});

portfolioNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => setPortfolioNavOpen(false));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    setPortfolioNavOpen(false);
    portfolioNavToggle?.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 640) setPortfolioNavOpen(false);
});