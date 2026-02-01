/* ============================================================================
   AVERUZ - MAIN JAVASCRIPT
   Intersection Observer + Scroll Animations + Performance Optimized
   ============================================================================ */

/**
 * ✨ INTERSECTION OBSERVER - Ativa animações quando elementos entram na viewport
 * Performance: Lazy evaluation, unobserve após animação
 */
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Se elemento entra na viewport
      if (entry.isIntersecting) {
        // Adicionar classe .animated para ativar animações
        entry.target.classList.add('animated');
        
        // Unobserve: parar de observar após animar (performance)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar TODOS elementos com classes de animação
  const animatableElements = document.querySelectorAll(
    '.animate-on-scroll, .animate-scale-on-scroll, .animate-slide-left, .animate-slide-right'
  );

  animatableElements.forEach(el => {
    observer.observe(el);
  });
};

/**
 * 📱 MOBILE MENU - Toggle com accessibilidade
 */
const initMobileMenu = () => {
  const menuButton = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');

  if (!menuButton || !menu) return;

  // Toggle menu
  menuButton.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    menuButton.setAttribute('aria-expanded', isOpen);
  });

  // Fechar ao clicar em link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });
};

/**
 * 🔗 SMOOTH SCROLL - Para links âncora
 */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Não bloquear links vazios ou com href="##"
      if (href === '#' || href === '') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

/**
 * ⬆️ BACK TO TOP - Botão voltar ao topo
 */
const initBackToTop = () => {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (!backToTopButton) return;

  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Mostrar/ocultar botão conforme scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });
};

/**
 * 📧 NEWSLETTER FORM - Com feedback visual
 */
const initNewsletterForm = () => {
  const form = document.getElementById('newsletter-form-substack');
  const submitBtn = document.getElementById('newsletter-submit-btn');
  const successMsg = document.getElementById('newsletter-success-msg');
  const input = document.getElementById('newsletter-email-substack');

  if (!form || !submitBtn || !successMsg || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação simples de email
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      input.style.borderColor = '#D10B68';
      input.placeholder = 'Email inválido';
      setTimeout(() => {
        input.style.borderColor = '';
        input.placeholder = 'Digite seu e-mail';
      }, 2000);
      return;
    }

    // Desabilitar botão
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // Simular envio (1s)
    setTimeout(() => {
      input.value = '';
      submitBtn.classList.add('hidden');
      successMsg.classList.remove('hidden');

      // Reset após 5s
      setTimeout(() => {
        successMsg.classList.add('hidden');
        submitBtn.classList.remove('hidden', 'opacity-50', 'cursor-not-allowed');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Assinar';
      }, 5000);
    }, 1000);
  });
};

/**
 * 🎯 UTILITY - Debounce para performance
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 🎯 UTILITY - Throttle para scroll events
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 🔔 INTERSECTION OBSERVER PARA HEADER - Adicionar shadow ao fazer scroll
 */
const initHeaderShadow = () => {
  const header = document.querySelector('header');
  
  if (!header) return;

  const headerObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
      } else {
        header.style.boxShadow = 'none';
      }
    },
    { threshold: 0 }
  );

  const heroEnd = document.querySelector('main > section:first-child');
  if (heroEnd) {
    headerObserver.observe(heroEnd);
  }
};

/**
 * 🚀 INICIALIZAR TUDO
 */
const init = () => {
  // Verificar se DOM está carregado
  if (document.readyState !== 'loading') {
    // DOM já está pronto
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initNewsletterForm();
    initHeaderShadow();
    console.log('✅ Averuz - Todas as animações iniciadas!');
  } else {
    // Aguardar DOM
    document.addEventListener('DOMContentLoaded', () => {
      initScrollAnimations();
      initMobileMenu();
      initSmoothScroll();
      initBackToTop();
      initNewsletterForm();
      initHeaderShadow();
      console.log('✅ Averuz - Todas as animações iniciadas!');
    });
  }
};

// Iniciar
init();

/**
 * 📊 PERFORMANCE MONITORING (optional, remover em produção se necessário)
 */
if (window.location.hostname !== 'localhost') {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
  });
}
