const navigation = document.querySelector("#main-navigation");
const menuToggle = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector("#main-navigation-links");

if (
  navigation instanceof HTMLElement &&
  menuToggle instanceof HTMLButtonElement &&
  navigationLinks instanceof HTMLElement
) {
  document.body.classList.add("menu-enabled");

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("menu-open");
  };

  const currentPath = window.location.pathname.toLowerCase();
  document
    .querySelectorAll("#main-navigation-links a, .product-categories a")
    .forEach((link) => {
      if (new URL(link.href).pathname.toLowerCase() === currentPath) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

  navigationLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation menu" : "Close navigation menu",
    );
    navigation.classList.toggle("menu-open", !isExpanded);
  });

  navigation.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}
