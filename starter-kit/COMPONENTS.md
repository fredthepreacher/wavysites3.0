# Component Library — Wavy Sites Design System

Copy-paste snippets. All classes come from `css/styles.css`. Anything inside `data-stagger` with class `reveal` animates in sequence automatically.

## Buttons

```html
<a class="btn btn-primary" href="#contact">Primary Action</a>
<a class="btn btn-secondary" href="#work">Secondary Action</a>
<a class="text-link" href="page.html">Inline link <span aria-hidden="true">→</span></a>
```

## Section shells

```html
<!-- Light -->
<section class="section" id="anchor"> <div class="container">…</div> </section>

<!-- Muted (soft blue-gray) -->
<section class="section section-muted">…</section>

<!-- Dark ocean band -->
<section class="section section-dark">…</section>
```

## Section heading

```html
<div class="section-heading reveal">
  <p class="eyebrow">Small label</p>
  <h2>Big headline.</h2>
  <p>Supporting sentence.</p>
</div>
<!-- Add class "center" to section-heading to center it -->
```

## Gradient highlight in a headline

```html
<h1>Plain start <span class="grad-text">gradient finish.</span></h1>
```

## Wave divider (bottom of a dark section, fill = next section's bg)

```html
<div class="wave-divider" aria-hidden="true">
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,64 C240,110 480,20 720,52 C960,84 1200,30 1440,70 L1440,120 L0,120 Z" fill="#ffffff"></path>
  </svg>
</div>
<!-- fill="#ffffff" before a light section, fill="#f3f8fb" before a muted section -->
```

## Service card grid (3-col desktop, stacks on mobile)

```html
<div class="cards service-grid" data-stagger>
  <article class="card reveal">
    <span class="card-number">01</span>
    <h3>Title</h3>
    <p>Description.</p>
  </article>
</div>
```

## Trust strip (4 quick proof points, overlaps the hero)

```html
<section class="section trust-strip">
  <div class="container trust-grid" data-stagger>
    <article class="reveal"><strong>Point</strong><span>One line.</span></article>
  </div>
</section>
```

## Portfolio / project card

```html
<div class="portfolio-grid" data-stagger>
  <article class="project-card reveal">
    <img src="assets/project.webp" alt="…" loading="lazy" width="700" height="700" />
    <div>
      <span>Category</span>
      <h3>Project Name</h3>
      <p>Result-focused description.</p>
      <a href="https://…" target="_blank" rel="noopener">Visit site <span aria-hidden="true">→</span></a>
    </div>
  </article>
</div>
```

## Process timeline (5-col desktop)

```html
<div class="timeline" data-stagger>
  <article class="timeline-item reveal"><span>01</span><h3>Step</h3><p>Detail.</p></article>
</div>
```

## Package / pricing cards (add class "featured" for the dark highlighted one)

```html
<div class="package-grid" data-stagger>
  <article class="package-card reveal">…</article>
  <article class="package-card featured reveal">…</article>
</div>
```

## FAQ (native details — keyboard accessible for free)

```html
<div class="faq-list">
  <details>
    <summary>Question?</summary>
    <p>Answer.</p>
  </details>
</div>
```

## Hero stats with animated counters

```html
<div class="hero-stats">
  <article><strong><span data-counter="5">5</span>+</strong><span>Label</span></article>
</div>
```

## Netlify form (required attributes — do not remove any)

```html
<form class="contact-form" name="FORM-NAME" method="POST" data-netlify="true"
      netlify-honeypot="bot-field" action="/thank-you.html">
  <input type="hidden" name="form-name" value="FORM-NAME" />
  <p class="hidden-field"><label>Do not fill this out if you are human: <input name="bot-field" /></label></p>
  …fields…
  <button class="btn btn-primary form-button" type="submit" data-form-button>Send</button>
</form>
```

## JS hooks (all optional — main.js skips missing elements)

| Attribute | Effect |
|---|---|
| `data-header` on `<header>` | shadow + solid bg after scrolling |
| `data-progress` on a div | top scroll progress bar |
| `data-nav-toggle` / `data-nav-menu` | mobile drawer (Esc + click-outside close) |
| `data-nav-link` on anchor links | highlights link when its section is in view |
| `data-stagger` on a grid | children with `.reveal` animate in sequence |
| `data-counter="80"` on a span | counts up when scrolled into view |
| `data-mobile-cta` | sticky CTA hides when #contact is visible |
| `data-year` | auto-fills current year |
