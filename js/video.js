/* Wavy Sites — portfolio video previews + hero reel.
   Dependency-free and progressive: without JS (and with reduced motion or Save-Data) every card and the
   hero show their poster, and every link works. Nothing is downloaded until a card is activated or,
   for the hero, until the page has finished loading. At most one card preview plays at a time.
   Videos are always muted (the files have no audio track). */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || {};
  const saveData = Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType || '');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- First-party analytics hook (same pattern as js/launch.js; no provider wired) ---------- */
  window.wavyEvents = window.wavyEvents || [];
  const pushEvent = (name, data) => {
    const event = { name, data: data || {}, at: new Date().toISOString() };
    window.wavyEvents.push(event);
    document.dispatchEvent(new CustomEvent('wavy:event', { detail: event }));
  };

  const storage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) { /* private mode */ } },
  };

  const makeVideo = (src, className) => {
    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    ['muted', 'playsinline', 'disablepictureinpicture', 'disableremoteplayback'].forEach((a) => video.setAttribute(a, ''));
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    video.className = className;
    video.src = src;
    return video;
  };

  /* ================= Project cards ================= */
  const cards = Array.from(document.querySelectorAll('[data-video-card]'));
  let activeCard = null;
  const previewed = new Set();

  const setCardButton = (card, playing) => {
    const button = card.querySelector('[data-video-toggle]');
    if (!button) return;
    const name = card.dataset.projectName || 'project';
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${name} preview`);
    const label = button.querySelector('[data-label]');
    if (label) label.textContent = playing ? 'Pause' : 'Play preview';
    button.classList.toggle('is-playing', playing);
  };

  const cardVideo = (card) => {
    if (card.wavyVideo) return card.wavyVideo;
    const media = card.querySelector('.video-card-media');
    const video = makeVideo(card.dataset.videoSrc, 'video-card-video');
    video.addEventListener('playing', () => card.classList.add('is-playing'));
    video.addEventListener('pause', () => card.classList.remove('is-playing'));
    video.addEventListener('error', () => {
      // Missing or unplayable clip: keep the poster, hide the control, never retry.
      card.classList.add('video-failed');
      card.classList.remove('is-playing');
      if (activeCard === card) activeCard = null;
    }, { once: true });
    media.insertBefore(video, media.querySelector('.video-card-hit'));
    card.wavyVideo = video;
    return video;
  };

  const pauseCard = (card) => {
    if (card.wavyVideo) card.wavyVideo.pause();
    setCardButton(card, false);
    if (activeCard === card) activeCard = null;
  };

  const playCard = (card, trigger) => {
    if (!card.dataset.videoSrc || card.classList.contains('video-failed')) return;
    if (activeCard && activeCard !== card) pauseCard(activeCard);
    activeCard = card;
    setCardButton(card, true);
    const attempt = cardVideo(card).play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => pauseCard(card)); // autoplay refused: stay on the poster
    }
    if (!previewed.has(card)) {
      previewed.add(card);
      pushEvent('project_preview_start', { project: card.dataset.project, trigger });
    }
  };

  // Automatic previews respect reduced motion, Save-Data and a visitor's own "Pause".
  const mayAutoplay = (card) => !reduceMotion.matches && !saveData && card.dataset.userPaused !== 'true';

  cards.forEach((card) => {
    setCardButton(card, false);

    const button = card.querySelector('[data-video-toggle]');
    if (button) {
      button.hidden = false;
      button.addEventListener('click', () => {
        if (activeCard === card && card.wavyVideo && !card.wavyVideo.paused) {
          card.dataset.userPaused = 'true';
          delete card.dataset.userPlayed;
          pauseCard(card);
        } else {
          delete card.dataset.userPaused;
          card.dataset.userPlayed = 'true';
          playCard(card, 'manual');
        }
      });
    }

    if (finePointer) {
      card.addEventListener('mouseenter', () => { if (mayAutoplay(card)) playCard(card, 'hover'); });
      card.addEventListener('mouseleave', () => { if (card.dataset.userPlayed !== 'true') pauseCard(card); });
    }
    card.addEventListener('focusin', (event) => {
      if (event.target === button) return; // the button itself decides
      if (mayAutoplay(card)) playCard(card, 'focus');
    });
    card.addEventListener('focusout', (event) => {
      if (!card.contains(event.relatedTarget) && card.dataset.userPlayed !== 'true') pauseCard(card);
    });

    card.querySelectorAll('[data-live-link]').forEach((link) => {
      link.addEventListener('click', () => pushEvent('project_live_site_click', { project: card.dataset.project, from: link.dataset.liveLink || 'card' }));
    });
    card.querySelectorAll('[data-case-study-link]').forEach((link) => {
      link.addEventListener('click', () => pushEvent('project_case_study_click', { project: card.dataset.project }));
    });
  });

  if (cards.length && 'IntersectionObserver' in window) {
    const ratios = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.intersectionRatio);
        // Off screen: always stop, including a preview the visitor started.
        if (entry.intersectionRatio < 0.15 && entry.target.wavyVideo) {
          delete entry.target.dataset.userPlayed;
          pauseCard(entry.target);
        }
      });
      if (finePointer) return;
      // Touch screens: the most visible card (at least 60 % on screen) previews; the others pause.
      // A card already playing keeps going while it stays well in view; ties go to reading order.
      if (activeCard && (ratios.get(activeCard) || 0) >= 0.6) return;
      let best = null;
      let bestRatio = 0;
      ratios.forEach((ratio, card) => {
        if (ratio >= 0.6 && ratio > bestRatio && mayAutoplay(card)) { best = card; bestRatio = ratio; }
      });
      if (best && best !== activeCard) playCard(best, 'viewport');
      else if (!best && activeCard && activeCard.dataset.userPlayed !== 'true') pauseCard(activeCard);
    }, { threshold: [0, 0.15, 0.6, 0.8, 1] });
    cards.forEach((card) => observer.observe(card));
  }

  /* ================= Hero reel (decorative background) ================= */
  const hero = document.querySelector('[data-hero-video]');
  const heroToggle = document.querySelector('[data-hero-toggle]');
  const HERO_PREF = 'wavy:hero-video';

  if (hero) {
    let video = null;
    let inView = true;
    let userPaused = storage.get(HERO_PREF) === 'paused';
    let reported = false;

    const setHeroButton = (playing) => {
      if (!heroToggle) return;
      heroToggle.hidden = false;
      heroToggle.classList.toggle('is-paused', !playing);
      const label = heroToggle.querySelector('[data-label]');
      if (label) label.textContent = playing ? 'Pause background video' : 'Play background video';
    };

    const ensureHeroVideo = () => {
      if (video) return video;
      const small = window.matchMedia('(max-width: 1040px)').matches;
      video = makeVideo(small && hero.dataset.srcSmall ? hero.dataset.srcSmall : hero.dataset.src, 'hero-video');
      video.addEventListener('playing', () => {
        hero.classList.add('is-playing');
        if (!reported) {
          reported = true;
          pushEvent('hero_video_start', { variant: small ? 'small' : 'full' });
        }
      });
      video.addEventListener('pause', () => hero.classList.remove('is-playing'));
      video.addEventListener('error', () => {
        hero.classList.remove('is-playing');
        if (heroToggle) heroToggle.hidden = true;
      }, { once: true });
      hero.appendChild(video);
      return video;
    };

    const playHero = () => {
      const attempt = ensureHeroVideo().play();
      setHeroButton(true);
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => setHeroButton(false));
    };

    const pauseHero = () => {
      if (video) video.pause();
      setHeroButton(false);
    };

    if (heroToggle) {
      heroToggle.addEventListener('click', () => {
        if (video && !video.paused) {
          userPaused = true;
          storage.set(HERO_PREF, 'paused');
          pauseHero();
        } else {
          userPaused = false;
          storage.set(HERO_PREF, 'on');
          playHero();
        }
      });
    }

    // Phones (≤ 820px) keep the plain hero: the reel would sit under a near-solid overlay, so it isn't worth
    // the data or the LCP cost there. Tablets use the lighter 960px file, desktops the full one.
    const phone = window.matchMedia('(max-width: 820px)').matches;
    const autoStart = () => !phone && !reduceMotion.matches && !saveData && !userPaused;

    if (autoStart()) {
      // Never compete with the first paint: wait for load, then for an idle moment.
      const begin = () => { if (inView && autoStart()) playHero(); };
      const whenIdle = () => ('requestIdleCallback' in window ? window.requestIdleCallback(begin, { timeout: 2500 }) : window.setTimeout(begin, 1200));
      if (document.readyState === 'complete') whenIdle();
      else window.addEventListener('load', whenIdle, { once: true });
    } else if (!phone && userPaused && !reduceMotion.matches && !saveData) {
      setHeroButton(false); // remembered "paused": offer Play, load nothing
    }

    const section = hero.closest('section') || hero;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (!video) return;
          if (!inView) video.pause();
          else if (!userPaused && !reduceMotion.matches) video.play().catch(() => {});
        });
      }, { threshold: 0.05 }).observe(section);
    }

    // Background tab: stop decoding; coming back resumes only if the visitor hasn't paused it.
    document.addEventListener('visibilitychange', () => {
      if (!video) return;
      if (document.hidden) video.pause();
      else if (inView && !userPaused && !reduceMotion.matches) video.play().catch(() => {});
    });
  }

  /* ---------- Global: hidden tab or reduced motion switched on → stop everything ---------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && activeCard) pauseCard(activeCard);
  });
  const onMotionPreference = () => {
    if (!reduceMotion.matches) return;
    if (activeCard) pauseCard(activeCard);
    const heroVideo = hero && hero.querySelector('video');
    if (heroVideo) { heroVideo.pause(); hero.classList.remove('is-playing'); }
  };
  if (typeof reduceMotion.addEventListener === 'function') reduceMotion.addEventListener('change', onMotionPreference);
})();
