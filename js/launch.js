/* Wavy Sites — Website Launch Package ($999 total / $499 deposit) funnel
   Covers launch-website.html (fit-check + checkout), launch-success.html,
   and launch-intake.html — each block below no-ops on the other pages.
   Dependency-free, self-contained. Deliberately kept separate from
   js/main.js so the existing homepage script is never touched.
   Respects prefers-reduced-motion. */

(() => {
  'use strict';

  /* =====================================================================
     STRIPE TEST-MODE DEPOSIT PAYMENT LINK
     -------------------------------------------------------------------
     This charges the $499 deposit only — NOT the $999 total. The
     remaining $500 is invoiced separately before launch (Version 1;
     see the Phase 10A/10C notes on a second Payment Link later).

     TODO (Fred): paste the Stripe TEST MODE Payment Link URL for
     "Wavy Sites — Website Launch Package Deposit" ($499) below before
     QA. Until this is filled in, the checkout button shows an honest
     "not connected yet" notice instead of a dead link — no payment
     can be taken either way.

     NEVER paste a LIVE Payment Link here until you have explicitly
     approved switching Phase 10 to live payments. Flipping from test
     to live later is swapping this one string — nothing else in the
     funnel needs to change.
     ===================================================================== */
  const STRIPE_TEST_DEPOSIT_PAYMENT_LINK = 'https://buy.stripe.com/test_28EcN6gtc9czcj5cQ7fIs00';

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
     FIT CHECK — qualification step
     ===================================================================== */
  const fitForm = document.querySelector('form[name="launch-fit-check"]');
  const fitButton = fitForm ? fitForm.querySelector('[data-form-button]') : null;
  const fitCheckboxes = fitForm ? Array.from(fitForm.querySelectorAll('input[type="checkbox"][data-fit]')) : [];
  const noneCheckbox = fitForm ? fitForm.querySelector('input[type="checkbox"][data-fit="none"]') : null;
  const passResult = document.querySelector('[data-fit-result="pass"]');
  const customResult = document.querySelector('[data-fit-result="custom"]');
  const stepChips = document.querySelectorAll('[data-step]');
  const referenceField = fitForm ? fitForm.querySelector('[name="reference_id"]') : null;
  const emailField = fitForm ? fitForm.querySelector('#fit-email') : null;

  /* A short reference id ties a fit-check submission to the Stripe
     order (via client_reference_id) so a paid order can be matched
     back to its fit-check answers in the Netlify + Stripe dashboards
     without any backend — see the Phase 10A architecture doc. */
  const referenceId = `LW-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  if (referenceField) referenceField.value = referenceId;

  let fitCheckStarted = false;
  if (fitForm) {
    fitForm.addEventListener('focusin', () => {
      if (!fitCheckStarted) {
        fitCheckStarted = true;
        pushEvent('fit_check_start');
      }
    }, { once: false });
  }

  /* Mutually exclusive: "None of these" clears the complex-need boxes
     and vice versa, so the selection always stays meaningful. */
  const complexCheckboxes = fitCheckboxes.filter((box) => box !== noneCheckbox);

  if (noneCheckbox) {
    noneCheckbox.addEventListener('change', () => {
      if (noneCheckbox.checked) {
        complexCheckboxes.forEach((box) => { box.checked = false; });
      }
    });
  }

  complexCheckboxes.forEach((box) => {
    box.addEventListener('change', () => {
      if (box.checked && noneCheckbox) noneCheckbox.checked = false;
    });
  });

  const setStep = (stepNumber) => {
    stepChips.forEach((chip) => {
      const step = Number(chip.dataset.step);
      chip.classList.toggle('is-active', step === stepNumber);
      chip.classList.toggle('is-done', step < stepNumber);
    });
  };

  const revealResult = (state) => {
    [passResult, customResult].forEach((el) => {
      if (el) el.classList.remove('is-visible');
    });
    const target = state === 'pass' ? passResult : customResult;
    if (target) {
      target.classList.add('is-visible');
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    }
    setStep(state === 'pass' ? 2 : 1);
  };

  const submitFitCheck = (event) => {
    event.preventDefault();
    if (!fitForm.reportValidity()) return;

    const hasComplexNeed = complexCheckboxes.some((box) => box.checked);
    const outcome = hasComplexNeed ? 'fail' : 'pass';

    if (fitButton) {
      fitButton.classList.add('is-sending');
      fitButton.disabled = true;
      fitButton.textContent = 'Checking…';
    }

    const formData = new FormData(fitForm);
    const body = new URLSearchParams(formData).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
      .catch(() => {
        /* Even if the Netlify Forms submission fails (e.g. previewing
           outside Netlify), the fit-check result itself still shows —
           qualification isn't blocked by the forms backend. */
      })
      .finally(() => {
        if (fitButton) {
          fitButton.classList.remove('is-sending');
          fitButton.disabled = false;
          fitButton.textContent = 'Check My Fit →';
        }
        pushEvent(outcome === 'pass' ? 'fit_check_complete_pass' : 'fit_check_complete_fail', { reference_id: referenceId });
        revealResult(outcome);
      });
  };

  if (fitForm) {
    fitForm.addEventListener('submit', submitFitCheck);
  }

  /* =====================================================================
     CHECKOUT — Stripe Payment Link, $499 deposit (test mode)
     ===================================================================== */
  const checkoutButton = document.querySelector('[data-checkout-button]');
  const checkoutNotice = document.querySelector('[data-checkout-notice]');
  const nameField = fitForm ? fitForm.querySelector('#fit-name') : null;

  if (checkoutButton) {
    checkoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      pushEvent('checkout_start', { reference_id: referenceId, amount: 499, total: 999 });

      /* Stash the order locally so launch-success.html / launch-intake.html
         can read it back after the round trip through Stripe — no backend,
         so this is the only way those pages know who just paid. It's
         best-effort: if the buyer clears storage or switches browsers, the
         pages still work, they just can't prefill anything. */
      try {
        sessionStorage.setItem('wavyLaunchOrder', JSON.stringify({
          referenceId,
          name: nameField ? nameField.value : '',
          email: emailField ? emailField.value : '',
          at: new Date().toISOString(),
        }));
      } catch (err) {
        /* sessionStorage can throw (private mode, storage disabled) — the
           checkout itself must not be blocked by that. */
      }

      if (!STRIPE_TEST_DEPOSIT_PAYMENT_LINK) {
        if (checkoutNotice) checkoutNotice.classList.add('is-visible');
        return;
      }

      checkoutButton.classList.add('is-sending');
      checkoutButton.setAttribute('aria-disabled', 'true');

      const url = new URL(STRIPE_TEST_DEPOSIT_PAYMENT_LINK);
      url.searchParams.set('client_reference_id', referenceId);
      if (emailField && emailField.value) {
        url.searchParams.set('prefilled_email', emailField.value);
      }
      window.location.href = url.toString();
    });
  }

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

    const nameNode = successRoot.querySelector('[data-order-name]');
    if (nameNode && savedOrder && savedOrder.name) {
      nameNode.textContent = `, ${savedOrder.name}`;
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

    const emailInput = intakeForm.querySelector('[name="email"]');
    if (emailInput && savedOrder && savedOrder.email && !emailInput.value) {
      emailInput.value = savedOrder.email;
    }

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

