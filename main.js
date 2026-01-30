// menu mobile — simples, previsível, sem efeito colateral
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu-mobile");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const aberto = menu.classList.contains("hidden");
    menu.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(aberto));
  });
}
