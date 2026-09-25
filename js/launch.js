/* Wavy Sites — Website Launch Package ($999 total / $499 deposit) funnel
   Covers launch-website.html (scope check + checkout), launch-success.html,
   and launch-intake.html — each block below no-ops on the other pages.
   Dependency-free, self-contained. Deliberately kept separate from
   js/main.js so the existing homepage script is never touched.
   Respects prefers-reduced-motion. */

(() => {
  'use strict';

  /* =====================================================================
     STRIPE LIVE DEPOSIT PAYMENT LINK
     -------------------------------------------------------------------
     This charges the $499 deposit only — NOT the $999 total. The
     remaining $500 is invoiced separately before final launch.

     Live Payment Link for "Wavy Sites — Website Launch Package
     Deposit" ($499). If this is ever emptied, the checkout button
     shows an honest "not connected yet" notice instead of a dead link.
     ===================================================================== */
  const STRIPE_DEPOSIT_PAYMENT_LINK = 'https://buy.stripe.com/eVqeVeb8ScoL0An4jBfIs02';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Analytics event hooks (no provider wired yet) ----------
     Privacy-conscious by design: first-party only, nothing sent
     anywhere until Fred picks an analytics provider. Every funnel
     step still gets recorded in-memory so a provider can be wired in
     later by extending pushEvent() alone — no funnel changes needed. */
  window.wavyEvents = window.wavyEvents || [];

  const pushEvent = (name, data) => {
    const event = { name, data: data || {}, at: new Date().toISOString() };
    window.wavyEvents.push(event);
    document.dispatchEvent(new CustomEvent('wavy:event', { detail: event }));
  };

  pushEvent('launch_page_view');

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

  /* ---------- Active nav highlighting (in-page anchors only) ---------- */
  const navLinks = document.querySelectorAll('[data-nav-link]');

  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionMap = new Map();

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        const section = document.querySelector(href);
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

  /* ---------- Sticky mobile CTA: hide near the hero and near #start ---------- */
  const mobileCta = document.querySelector('[data-mobile-cta]');
  const startSection = document.querySelector('#start');
  const heroSection = document.querySelector('.hero');

  if (mobileCta && 'IntersectionObserver' in window) {
    const ctaHideState = { hero: !!heroSection, start: false };

    const updateCtaVisibility = () => {
      mobileCta.classList.toggle('is-hidden', ctaHideState.hero || ctaHideState.start);
    };

    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          ctaHideState.hero = entry.isIntersecting;
          updateCtaVisibility();
        });
      }, { threshold: 0.08 });

      heroObserver.observe(heroSection);
    }

    if (startSection) {
      const startObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          ctaHideState.start = entry.isIntersecting;
          updateCtaVisibility();
        });
      }, { threshold: 0.08 });

      startObserver.observe(startSection);
    }

    updateCtaVisibility();
  }

  /* ---------- "Start My Website" click tracking (hero + sticky CTA) ---------- */
  document.querySelectorAll('[data-track="start_my_website_click"]').forEach((el) => {
    el.addEventListener('click', () => pushEvent('start_my_website_click'));
  });

  /* =====================================================================
     SCOPE CHECK — one question, no personal details
     -------------------------------------------------------------------
     "Does your project need any of these?" Picking "None of these"
     reveals the order summary + checkout; picking any advanced feature
     routes to a custom estimate instead. Nothing is submitted or stored
     here — contact and business details are collected by Stripe
     (email) and the post-purchase intake form, never twice.
     ===================================================================== */
  const scopeRoot = document.querySelector('[data-scope-check]');
  const fitCheckboxes = scopeRoot ? Array.from(scopeRoot.querySelectorAll('input[type="checkbox"][data-fit]')) : [];
  const noneCheckbox = scopeRoot ? scopeRoot.querySelector('input[type="checkbox"][data-fit="none"]') : null;
  const complexCheckboxes = fitCheckboxes.filter((box) => box !== noneCheckbox);
  const passResult = document.querySelector('[data-fit-result="pass"]');
  const customResult = document.querySelector('[data-fit-result="custom"]');
  const scopeStatus = document.querySelector('[data-scope-status]');
  const stepChips = document.querySelectorAll('[data-step]');

  /* A short reference id travels to Stripe as client_reference_id and on
     to the intake page, so a paid order can be matched to its intake
     without any backend. It identifies the order, not the person. */
  const referenceId = `LW-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

  const setStep = (stepNumber) => {
    stepChips.forEach((chip) => {
      const step = Number(chip.dataset.step);
      chip.classList.toggle('is-active', step === stepNumber);
      chip.classList.toggle('is-done', step < stepNumber);
    });
  };

  let scopeState = 'none';
  let scopeStarted = false;

  const applyScopeState = (state, { scroll = true, silent = false } = {}) => {
    const changed = state !== scopeState;
    scopeState = state;

    if (passResult) passResult.classList.toggle('is-visible', state === 'pass');
    if (customResult) customResult.classList.toggle('is-visible', state === 'custom');
    setStep(state === 'pass' ? 2 : 1);

    /* silent = re-syncing after the browser restored checkbox state
       (back/forward); not a new answer, so no events, status or scroll. */
    if (!changed || silent) return;

    if (scopeStatus) {
      scopeStatus.textContent = state === 'pass'
        ? 'The $999 Website Launch Package covers your project. Order summary and checkout are shown below.'
        : state === 'custom'
          ? 'This sounds like a custom build. A Get a Custom Estimate link is shown below.'
          : '';
    }

    if (state === 'pass') pushEvent('scope_check_pass', { reference_id: referenceId });
    if (state === 'custom') {
      pushEvent('scope_check_custom', {
        features: complexCheckboxes.filter((box) => box.checked).map((box) => box.dataset.fit),
      });
    }

    const target = state === 'pass' ? passResult : state === 'custom' ? customResult : null;
    if (scroll && target) {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: state === 'pass' ? 'start' : 'nearest',
        });
      });
    }
  };

  const evaluateScope = (options) => {
    if (complexCheckboxes.some((box) => box.checked)) {
      applyScopeState('custom', options);
    } else if (noneCheckbox && noneCheckbox.checked) {
      applyScopeState('pass', options);
    } else {
      applyScopeState('none', options);
    }
  };

  if (scopeRoot) {
    /* "None of these" and the advanced options are mutually exclusive,
       so the answer always stays meaningful. */
    fitCheckboxes.forEach((box) => {
      box.addEventListener('change', () => {
        if (!scopeStarted) {
          scopeStarted = true;
          pushEvent('scope_check_start');
        }
        if (box === noneCheckbox && box.checked) {
          complexCheckboxes.forEach((other) => { other.checked = false; });
        } else if (box !== noneCheckbox && box.checked && noneCheckbox) {
          noneCheckbox.checked = false;
        }
        evaluateScope({ scroll: true });
      });
    });

    evaluateScope({ silent: true });
  }

  document.querySelectorAll('[data-custom-estimate]').forEach((link) => {
    link.addEventListener('click', () => pushEvent('custom_estimate_click'));
  });

  /* =====================================================================
     CHECKOUT — Stripe Payment Link, $499 deposit (test mode)
     ===================================================================== */
  const checkoutButton = document.querySelector('[data-checkout-button]');
  const checkoutNotice = document.querySelector('[data-checkout-notice]');

  if (checkoutButton) {
    checkoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      pushEvent('checkout_start', { reference_id: referenceId, amount: 499, total: 999 });

      /* Keep only the order reference for the round trip through Stripe
         so the intake page can tag the submission. No personal details
         are stored — Stripe collects the buyer's email itself. */
      try {
        sessionStorage.setItem('wavyLaunchOrder', JSON.stringify({
          referenceId,
          at: new Date().toISOString(),
        }));
      } catch (err) {
        /* sessionStorage can throw (private mode, storage disabled) — the
           checkout itself must not be blocked by that. */
      }

      if (!STRIPE_DEPOSIT_PAYMENT_LINK) {
        if (checkoutNotice) checkoutNotice.classList.add('is-visible');
        return;
      }

      checkoutButton.classList.add('is-sending');
      checkoutButton.setAttribute('aria-disabled', 'true');

      const url = new URL(STRIPE_DEPOSIT_PAYMENT_LINK);
      url.searchParams.set('client_reference_id', referenceId);
      window.location.href = url.toString();
    });
  }

  /* Coming back from Stripe with the browser's back button: browsers
     restore the checked boxes after this script runs (or restore the whole
     page from the back/forward cache with the checkout button still marked
     busy). pageshow fires after either, so re-sync the result and reset
     the button there — the visitor lands right back on their order summary. */
  window.addEventListener('pageshow', () => {
    if (checkoutButton) {
      checkoutButton.classList.remove('is-sending');
      checkoutButton.removeAttribute('aria-disabled');
    }
    if (scopeRoot) evaluateScope({ silent: true });
  });

  /* =====================================================================
     SUCCESS PAGE — launch-success.html only (no-ops everywhere else)
     ===================================================================== */
  const successRoot = document.querySelector('[data-success-page]');

  if (successRoot) {
    pushEvent('purchase_success');

    let savedOrder = null;
    try {
      const raw = sessionStorage.getItem('wavyLaunchOrder');
      if (raw) savedOrder = JSON.parse(raw);
    } catch (err) {
      savedOrder = null;
    }

    const intakeLink = successRoot.querySelector('[data-intake-link]');
    if (intakeLink && savedOrder && savedOrder.referenceId) {
      const url = new URL(intakeLink.href, window.location.href);
      url.searchParams.set('ref', savedOrder.referenceId);
      intakeLink.href = url.toString();
    }

    const checkItems = successRoot.querySelectorAll('[data-success-check]');
    if (!prefersReducedMotion) {
      checkItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.12}s`;
      });
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          checkItems.forEach((item) => item.classList.add('is-visible'));
        });
      });
    } else {
      checkItems.forEach((item) => item.classList.add('is-visible'));
    }
  }

  /* =====================================================================
     INTAKE PAGE — launch-intake.html only (no-ops everywhere else)
     ===================================================================== */
  const intakeForm = document.querySelector('form[name="launch-intake"]');

  if (intakeForm) {
    pushEvent('intake_page_view');

    const params = new URLSearchParams(window.location.search);
    let savedOrder = null;
    try {
      const raw = sessionStorage.getItem('wavyLaunchOrder');
      if (raw) savedOrder = JSON.parse(raw);
    } catch (err) {
      savedOrder = null;
    }

    const refInput = intakeForm.querySelector('[name="order_reference"]');
    const refValue = params.get('ref') || (savedOrder ? savedOrder.referenceId : '');
    if (refInput && refValue) refInput.value = refValue;

    const intakeButton = intakeForm.querySelector('[data-form-button]');
    intakeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!intakeForm.reportValidity()) return;

      if (intakeButton) {
        intakeButton.classList.add('is-sending');
        intakeButton.disabled = true;
        intakeButton.textContent = 'Sending…';
      }

      const formData = new FormData(intakeForm);
      const body = new URLSearchParams(formData).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
        .catch(() => {})
        .finally(() => {
          pushEvent('intake_submitted', { reference_id: refValue });
          window.location.href = '/thank-you.html';
        });
    });
  }
})();
