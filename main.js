// Menu mobile — compatível com Tailwind (md:flex / hidden)
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isHidden = menu.classList.contains("hidden");

    menu.classList.toggle("hidden", !isHidden);
    toggle.setAttribute("aria-expanded", String(isHidden));
  });
}
