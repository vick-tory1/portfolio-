
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-navigation");
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
    });
  }
  
  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll("#main-navigation a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("active");
    });
  });
});
