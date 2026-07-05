# Wavy Sites 3.0 — Maximum Rebuild

This is a clean, deploy-ready static rebuild of the Wavy Sites website.

## What this version does

- Replaces the deeply nested older project structure with one clean deployable root.
- Uses static HTML, CSS, and JavaScript for speed and easy Netlify deployment.
- Includes a modern homepage, client roadmap page, thank-you page, and 404 page.
- Adds Netlify-ready project inquiry form markup.
- Adds SEO/AEO/GEO basics: metadata, FAQ schema, ProfessionalService schema, sitemap, robots file, Open Graph tags, canonical URLs, and descriptive alt text.
- Optimizes images into lightweight WebP assets while preserving the original main logo.
- Includes documentation and a Claude handoff prompt.

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
