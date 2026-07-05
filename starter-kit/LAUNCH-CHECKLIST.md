# Launch Checklist — every Wavy Sites build

## Content & truth
- [ ] No `[BRACKETED]` placeholders left anywhere
- [ ] No fake reviews, awards, licenses, addresses, or guarantees
- [ ] Phone/email/social links are real or removed
- [ ] Portfolio links open the correct live sites

## SEO / AEO / GEO
- [ ] Unique `<title>` (business + service + area) and meta description on every page
- [ ] Canonical URL matches the final domain
- [ ] Open Graph + Twitter card tags with a real image URL
- [ ] One `<h1>` per page; logical H2/H3 order
- [ ] LocalBusiness/ProfessionalService schema + FAQPage schema validate (validator.schema.org)
- [ ] `sitemap.xml` lists real pages with the final domain; `robots.txt` present

## Forms
- [ ] `name`, `method="POST"`, `data-netlify="true"`, hidden `form-name`, honeypot all present
- [ ] `action="/thank-you.html"` and the page exists at root
- [ ] After deploy: form appears in Netlify → Forms; email notifications on; live test submitted

## Mobile & UX
- [ ] No horizontal overflow at 360px, 390px, 768px widths
- [ ] Mobile nav opens, closes on link tap / Esc / outside tap
- [ ] Sticky CTA hides when the contact form is visible
- [ ] Buttons ≥ 44px tall; text readable without zoom

## Accessibility
- [ ] Skip link works; focus rings visible on Tab
- [ ] All images have meaningful alt text (or empty alt if decorative)
- [ ] Labels connected to inputs; FAQ works with keyboard
- [ ] Animations disabled under prefers-reduced-motion

## Performance
- [ ] Images are WebP and reasonably sized; below-the-fold images `loading="lazy"`
- [ ] Lighthouse (mobile) after deploy: Performance ≥ 90, SEO ≥ 95, A11y ≥ 95

## Deploy (Netlify)
- [ ] `index.html`, `thank-you.html`, `404.html`, `robots.txt`, `sitemap.xml`, `netlify.toml` at root
- [ ] No build command; publish directory = root
- [ ] Custom domain + HTTPS confirmed; canonical/sitemap updated to match
