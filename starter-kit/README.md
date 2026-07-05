# Wavy Sites Starter Kit

Spin up a new client site in minutes using the same design system as wavysites.com.

## How to start a new client site

1. Create a new folder for the client (e.g. `client-name-site/`).
2. Copy into it:
   - `client-template.html` → rename to `index.html`
   - `../css/styles.css` → into `css/styles.css`
   - `tokens.css` → into `css/tokens.css`
   - `../js/main.js` → into `js/main.js`
   - `../thank-you.html`, `../404.html`, `../netlify.toml`, `../robots.txt`
3. Open `css/tokens.css` and change the brand colors/fonts to match the client.
   Because `tokens.css` loads **after** `styles.css`, it overrides the Wavy Sites palette — no other CSS edits needed.
4. Replace every `[BRACKETED]` placeholder in `index.html` with real client content.
5. Update the form name, canonical URL, schema, title, and meta description.
6. Run through `LAUNCH-CHECKLIST.md` before handing off.

## Files

| File | Purpose |
|---|---|
| `client-template.html` | Homepage skeleton: hero → trust → services → work → process → packages → FAQ → contact |
| `tokens.css` | Per-client theme overrides (colors, fonts, radius) |
| `COMPONENTS.md` | Copy-paste component snippets |
| `LAUNCH-CHECKLIST.md` | Pre-launch QA list |

## Rules baked into the system

- No fake reviews, awards, or guarantees — proof must be real.
- Netlify form markup with honeypot + thank-you redirect on every build.
- Mobile-first: sticky CTA, stacked cards, no horizontal overflow.
- SEO on every page: title, description, canonical, OG, schema, sitemap, robots.
- Respect `prefers-reduced-motion` — the JS and CSS already handle it.
