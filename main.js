document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";

      // alterna aria
      menuButton.setAttribute("aria-expanded", String(!isOpen));

      // controla visibilidade real (Tailwind)
      if (isOpen) {
        menu.classList.add("hidden");
      } else {
        menu.classList.remove("hidden");
      }
    });
  }
});
