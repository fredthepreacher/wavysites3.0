/* Wavy Sites 3.1 — interactions & micro-UX
   Dependency-free. Respects prefers-reduced-motion. */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('[data-header]');

  const setHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.querySelector('[data-progress]');

  if (progressBar) {
    let ticking = false;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
      ticking = false;
    };

    updateProgress();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');

  const closeNav = () => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu.classList.toggle('is-open', !isOpen);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNav();
      }
    });
  }

  /* ---------- Staggered reveal animations ---------- */
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    group.querySelectorAll('.reveal').forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 0.08, 0.5)}s`;
    });
  });

  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (node) => {
    const target = parseInt(node.dataset.counter, 10);
    if (Number.isNaN(target)) return;

    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(eased * target);
      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  if (counters.length) {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });

      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach((counter) => {
        counter.textContent = counter.dataset.counter;
      });
    }
  }

  /* ---------- Active nav highlighting ---------- */
  const navLinks = document.querySelectorAll('[data-nav-link]');

  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionMap = new Map();

    navLinks.forEach((link) => {
      const id = link.getAttribute('href');
      if (id && id.startsWith('#')) {
        const section = document.querySelector(id);
        if (section) sectionMap.set(section, link);
      }
    });

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = sectionMap.get(entry.target);
        if (link && entry.isIntersecting) {
          navLinks.forEach((other) => other.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -55% 0px' });

    sectionMap.forEach((_link, section) => navObserver.observe(section));
  }

  /* ---------- Sticky mobile CTA: hide near the form ---------- */
  const mobileCta = document.querySelector('[data-mobile-cta]');
  const contactSection = document.querySelector('#contact');

  if (mobileCta && contactSection && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        mobileCta.classList.toggle('is-hidden', entry.isIntersecting);
      });
    }, { threshold: 0.08 });

    ctaObserver.observe(contactSection);
  }

  /* ---------- Form submit feedback ---------- */
  const form = document.querySelector('form[name="project-inquiry"]');
  const formButton = document.querySelector('[data-form-button]');

  if (form && formButton) {
    form.addEventListener('submit', () => {
      formButton.classList.add('is-sending');
      formButton.innerHTML = 'Sending…';
    });
  }
})();
