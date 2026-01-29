/* =====================================================
   Averuz — JS progressivo e defensivo
   Etapa 6: limpeza técnica
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupBackToTop();
});

/* =========================
   MENU MOBILE
   ========================= */
function setupMobileMenu() {
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (!button || !menu) return;

  // estado inicial seguro
  menu.classList.add("hidden");
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("hidden");
  });

  // fecha menu ao clicar em link (mobile UX básico)
  const links = menu.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================
   VOLTAR AO TOPO
   ========================= */
function setupBackToTop() {
  const links = document.querySelectorAll('a[href="#topo"]');

  if (!links.length) return;

  links.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });
}
