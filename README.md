# Wavy Sites 3.1 — Premium Redesign + Starter Kit

Deploy-ready static Wavy Sites website, upgraded to an agency-grade design system, plus a reusable starter kit for future client builds.

## What's new in 3.1

- **Design system**: fluid type scale (Sora display + Inter body), design tokens, glass surfaces, gradient accents, animated hero aurora and floating orbs, SVG wave dividers, refined shadows and radii.
- **Micro-interactions**: scroll progress bar, staggered reveal animations, animated hero counters, active nav highlighting, button shine sweep, card hover lift/glow, portfolio image zoom, animated FAQ chevrons.
- **UX**: mobile drawer closes on Esc/outside tap, sticky mobile CTA auto-hides at the contact form, form submit feedback state, `scroll-padding` for anchor jumps, everything respects `prefers-reduced-motion`.
- **Starter kit** (`/starter-kit/`): client homepage template, per-client theme tokens, component library reference, and launch checklist — spin up new client sites in minutes.
- All Netlify form markup, SEO/schema, sitemap, and robots handling preserved from 3.0.

## File structure

```txt
/
  index.html
  roadmap.html
  thank-you.html
  404.html
  robots.txt
  sitemap.xml
  netlify.toml
  css/styles.css
  js/main.js
  assets/
    logos/
    projects/
  starter-kit/
    README.md
    client-template.html
    tokens.css
    COMPONENTS.md
    LAUNCH-CHECKLIST.md
  docs/
    BUILD_REPORT.md
    CLAUDE_HANDOFF_PROMPT.md
    Wavy_Sites_Master_Website_Roadmap_Prompt.md
```

## Netlify deployment

Use this folder as the deploy root.

For manual drag-and-drop deployment:

1. Zip or drag this folder into Netlify.
2. Make sure `index.html` is at the root of the deployed folder.
3. Confirm Netlify detects the `project-inquiry` form.
4. In Netlify, go to Forms and enable email notifications.
5. Submit a live test from the deployed site.
6. Confirm the submission appears in Netlify and redirects to `/thank-you.html`.

For GitHub deployment:

1. Push this folder contents to the repository root.
2. Set Netlify publish directory to `.` if needed.
3. No build command is required for this static version.

## Before final launch

Update these as needed:

- Confirm all portfolio links are correct.
- Add social links if Wavy Sites has official profiles.
- Add a public phone/email only if you want them visible.
- Replace or add portfolio projects as new client sites go live.
- Update `sitemap.xml` and canonical URLs if the final domain changes.
