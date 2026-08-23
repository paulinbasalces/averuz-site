// main.js - Menu Mobile e Interações
document.addEventListener('DOMContentLoaded', () => {
const brandLogo = document.getElementById('brand-logo');
const brandFallback = document.getElementById('brand-logo-fallback');
if (brandLogo && brandFallback) {
brandLogo.addEventListener('error', () => {
brandLogo.classList.add('hidden');
brandFallback.classList.remove('hidden');
});
}
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
if (btn && menu) {
btn.addEventListener('click', () => {
menu.classList.toggle('hidden');
const isExpanded = btn.getAttribute('aria-expanded') === 'true';
btn.setAttribute('aria-expanded', String(!isExpanded));
btn.setAttribute('aria-label', isExpanded ? 'Abrir menu' : 'Fechar menu');
});
}
const navbar = document.getElementById('navbar');
if (navbar) {
window.addEventListener('scroll', () => {
if (window.scrollY > 10) {
navbar.classList.add('shadow-sm');
} else {
navbar.classList.remove('shadow-sm');
}
});
}

// Contadores do hero (números "contam" ao carregar)
document.querySelectorAll('[data-count]').forEach((el) => {
const target = parseFloat(el.dataset.count);
const prefix = el.dataset.prefix || '';
const suffix = el.dataset.suffix || '';
const duration = 1200;
const start = performance.now();
const step = (now) => {
const p = Math.min((now - start) / duration, 1);
el.textContent = prefix + Math.round(target * p) + suffix;
if (p < 1) requestAnimationFrame(step);
};
requestAnimationFrame(step);
});
});