# Claude Handoff Prompt — Wavy Sites 3.0 Maximum Rebuild

Paste this into Claude with the rebuilt ZIP attached.

```md
You are my senior website strategist, UX designer, conversion copywriter, SEO/AEO/GEO specialist, and front-end developer.

I am uploading my rebuilt Wavy Sites 3.0 project ZIP. Treat this rebuilt ZIP as the source of truth, but also review the included master roadmap file inside `/docs/Wavy_Sites_Master_Website_Roadmap_Prompt.md` and follow it as the operating system for the project.

## Mission

Inspect, improve, and finalize this Wavy Sites website so it is a maximum-productivity, deploy-ready business website for Wavy Sites.

The website must function as:

1. A premium brand presence for Wavy Sites.
2. A lead-generation site for website clients.
3. A portfolio showcase.
4. A client education tool through the roadmap page.
5. A reusable example of the Wavy Sites build standard.
6. A clean Netlify-ready static website.

## First Rule: Inspect Before Changing

Before editing anything:

1. Inspect the entire file structure.
2. Confirm this is a static HTML/CSS/JS project.
3. Confirm `index.html` is at the deploy root.
4. Review `README.md` and `/docs/BUILD_REPORT.md`.
5. Review `/docs/Wavy_Sites_Master_Website_Roadmap_Prompt.md`.
6. Identify anything broken, weak, missing, duplicated, or unoptimized.
7. Preserve the rebuilt design direction unless there is a clear improvement.
8. Do not rebuild from scratch unless the structure is unusable.

## Required Improvements

Improve the site across these areas:

### Design and UX

- Keep the premium dark/ocean Wavy Sites identity.
- Make the first five seconds very clear: Wavy Sites builds websites and digital presence systems for small businesses and organizations.
- Keep the homepage journey clear: Understand → Trust → Explore → Decide → Contact.
- Check desktop, tablet, and mobile spacing.
- Ensure no awkward image cropping.
- Ensure the mobile nav works.
- Ensure the sticky mobile CTA does not block important form fields.

### Portfolio

- Confirm the portfolio cards are clean and useful.
- Keep existing project cards unless better organization is needed.
- Do not invent fake projects.
- If a link is uncertain, mark it clearly or leave it editable.

### Contact Form

The form must be fully Netlify-compatible.

Verify:

- `name="project-inquiry"`
- `method="POST"`
- `data-netlify="true"`
- hidden `form-name` input
- honeypot spam field
- accessible labels
- reasonable required fields
- `action="/thank-you.html"`
- real `thank-you.html` page exists

Do not switch back to Formspree unless I specifically ask.

### SEO / AEO / GEO

Optimize without keyword stuffing.

Verify and improve:

- Title tags
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Twitter card metadata
- H1/H2/H3 hierarchy
- Image alt text
- Local/service-area language
- FAQ content
- ProfessionalService or LocalBusiness schema
- FAQPage schema
- `sitemap.xml`
- `robots.txt`

### Performance

- Keep the site dependency-free unless absolutely needed.
- Keep images optimized.
- Use lazy loading for below-the-fold images.
- Avoid large inline CSS/JS if not necessary.
- Avoid heavy animation that hurts performance.

### Accessibility

Verify:

- Skip link works.
- Buttons and links are keyboard accessible.
- Focus states are visible.
- Form labels are connected.
- Color contrast is readable.
- Heading order is logical.

### Deployment

This should deploy on Netlify as a static site.

- No build command required.
- Publish directory should be the project root.
- `netlify.toml` should be valid.
- `index.html` must stay at root.
- `thank-you.html`, `404.html`, `robots.txt`, and `sitemap.xml` must stay at root.

## Output Required

Return a clean deploy-ready ZIP and include:

1. Summary of what you changed.
2. File-by-file change list.
3. Any assumptions made.
4. Any missing information needed from me.
5. Netlify deployment steps.
6. Live QA checklist.
7. Form testing instructions.

## Important Rules

- Do not invent fake reviews, fake awards, fake licenses, fake addresses, or fake guarantees.
- Do not expose private keys or environment variables.
- Do not remove working sections without explaining why.
- Do not leave placeholder form providers like `YOUR_FORM_ID`.
- Do not create dead buttons.
- Do not ignore mobile.
- Do not over-engineer this static site.

Build this like it is going in front of real Wavy Sites clients today.
```
