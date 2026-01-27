document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     MENU MOBILE
  =============================== */

  const menuButton = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ===============================
     ANIMAÇÕES ON-SCROLL
     (respeitando prefers-reduced-motion)
  =============================== */

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animatedElements = document.querySelectorAll(".animate-fade-in-up");

  if (animatedElements.length === 0) return;

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => {
      el.style.opacity = "1";
    });
  }
});
