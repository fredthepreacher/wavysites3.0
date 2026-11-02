# Video portfolio upgrade — 2026-11-02

Branch `feature/video-portfolio-2026-11-02`, cut from `main` @ `4e347c9` (identical to what wavysites.com serves; the only
live/main differences are Netlify's pretty-URL link rewriting). **Local only: not pushed, not deployed.**
Source package: `Wavy_Sites_Video_Upgrade_2026-11-02.zip` (7 project clips + posters, 1 hero reel). Internal file — `/docs/*`
is not served (see `netlify.toml`).

## Owner decisions (Fred, 2026-11-02)
- Target the **live static site** (`wavysites3.0`), not the Next.js revamp.
- **Permissions cleared:** written permission covers the people shown (Ten Ambassadors event footage incl. frames credited
  to The Upmixer event archive; Starlight honorees) and public portfolio use of Native Sun Homes. Recorded in
  `docs/video-manifest.json`.
- **Detail Kings 941** is shown as live client work.

## Clip → project mapping and sizes

| Package clip | Shown as | Live site (exact) | People | Clip | Posters (640 / 1280 WebP) |
|---|---|---|---|---|---|
| community-pools | Community Pools LLC | https://communitypoolsllc.com/ | no | 1,015,876 B | 12,280 / 37,078 B |
| vertical-builders | Vertical Builders & Commercial | https://www.verticalbuildersandcommercial.com/ | no | 1,180,775 B | 22,882 / 59,506 B |
| detail-kings-941 | Detail Kings 941 | https://detailkings941.vercel.app/ | no | 1,183,478 B | 18,410 / 53,178 B |
| homebuilder-site | **Native Sun Homes** (identified from the recording's branding) | https://nativesunhomes.com/ | no | 488,341 B | 23,996 / 74,796 B |
| adams-striping | Adams Striping | https://adamsstriping.com/ | no | 766,402 B | 19,596 / 53,818 B |
| association-site | **Ten Ambassadors** (identified from the recording's branding) | https://tenambassadors.org/ | yes | 498,499 B | 15,990 / 43,400 B |
| starlight-awards | Starlight Awards | https://starlightawards.org/ | yes | 949,144 B | 15,442 / 38,990 B |
| hero reel | homepage background (desktop/tablet) | — | yes | 3,345,092 B (desktop) · 1,218,915 B (tablet, 960 px) | 19,584 / 53,878 B |

All clips are silent H.264 (no audio track), 1280×720, 20 fps, ~9 s (reel 18.6 s), fast-start. They were copied
byte-for-byte; only the posters (WebP, 70–90 % smaller than the JPEGs) and the tablet reel were generated
(`scripts/media/add-video.ps1`). Confirm the two identified mappings on the preview before merging.

## What changed

| Page | Change |
|---|---|
| Home `/` | Hero: decorative reel behind the copy (desktop + tablet), fading in after load; poster first; visible "Pause background video" control; phones keep the original hero. Work section: 7 video cards (Community Pools as the lead card) + "Also live: Residential Finishes · Christos Fashion". Pricing note fixed (see below). |
| `/work` | Same 7 video cards; "More client websites" keeps Residential Finishes, Veterans Drywall (now without a dead link) and Christos Fashion. Vertical Builders links the Vertical Ops case study. |
| `/launch-website` | Proof section: Community Pools + Adams Striping video cards, "Also live: Residential Finishes". Veterans Drywall removed (its site is offline). |
| `/website-design-southwest-florida` | New "Recent Southwest Florida work" section: Community Pools (Port Charlotte), Vertical Builders (SW Florida), Detail Kings 941 — real local proof + internal link to `/work`. |
| `netlify.toml` | `/docs/*`, `/scripts/*` and `/README.md` now return 404 (they were publicly served). |
| `css/styles.css` | New section 24 (video cards, hero media) + two contrast fixes. |
| `js/video.js` | New, dependency-free controller (existing `main.js`/`launch.js` untouched). |

### Card behaviour
Poster first (lazy, responsive WebP). Desktop: hover or keyboard focus plays a muted, looping, inline preview; leaving
pauses. Phones/tablets: the most-visible card (≥ 60 % in view) plays; ties go to reading order. **One preview at a time**,
paused off screen and in background tabs. Every card has a visible Play/Pause button (WCAG 2.2.2) and an explicit
"View Live Website ↗" link; clicking the media also opens the live site (that duplicate link is hidden from keyboard and
screen readers). Nothing downloads until a card is activated. Reduced motion or Save-Data: posters only unless the
visitor presses Play. A clip that fails to load leaves the poster.

### Hero behaviour
The reel waits for the page `load` event and an idle moment, plays only while the hero is on screen, and remembers a
visitor's "Pause" (`localStorage`). Desktop: the reel sits on the right, faded out behind the headline, slightly
softened so other businesses' phone numbers and buttons read as motion rather than as Wavy Sites' details. Tablets
(821–1040 px) get the 960 px file under an even overlay. **Phones (≤ 820 px) keep the original hero** — the reel would
sit under a near-solid overlay there, costing data and LCP for almost no visual gain (one condition in `js/video.js`
to change if wanted).

## Broken / corrected URLs
- **`veteransdrywall.net` no longer exists** (NXDOMAIN at the .net registry, checked with Google DNS 2026-11-02). It was
  linked from `/`, `/work` and `/launch-website`. Links removed; the project stays on `/work` as "Live site currently
  offline". Worth telling the client — their domain may have expired.
- Package-supplied URLs used exactly: Adams Striping, `www.verticalbuildersandcommercial.com`, `detailkings941.vercel.app`.
  All seven project URLs returned 200 on 2026-11-02.

## Pricing and checkout (verified, unchanged)
- **$999 Website Launch:** `js/launch.js` and the checkout flow are untouched; the live $499 deposit Payment Link is the
  same. No Stripe page was opened and nothing was charged.
- **Quick Website Fixes from $99 / $149 / $199:** `quick-fixes.html` untouched; "Request the $99 Fix" still preselects
  the Netlify form (tested).
- Fixed a contradiction on the homepage: it said "Wavy Sites doesn't publish fixed prices" next to the $999 and $99
  offers. It now says larger projects are estimated after a discovery call and links both fixed-price offers.
- Netlify forms, sitemap, robots and existing JSON-LD are unchanged.

## Analytics events (first-party `window.wavyEvents` + `wavy:event`, same hook as `launch.js`; no provider wired)
`hero_video_start {variant}` · `project_preview_start {project, trigger: hover|focus|viewport|manual}` (once per card per
page view) · `project_live_site_click {project, from: card|media|also}` · `project_case_study_click {project}`.

## Page experience (local, Lighthouse 12, median of 3, simulated throttling — lab data, not field data)

| | `main` (live) | this branch |
|---|---|---|
| Home, mobile | perf 90 · LCP 2.87 s · CLS 0.011 · 285 KB | perf 90 · LCP 3.00 s · CLS 0.011 · 310 KB |
| Home, desktop | perf 96 · LCP 0.81 s · CLS 0.024 | perf 99 · LCP 0.83 s · CLS 0.014 · +3.0 MB reel, loaded after the page is ready |
| `/work`, mobile / desktop | 87 / 99 | 87 / 99 (posters 7–9 % lighter) |
| Accessibility (axe, serious/critical) | 1–2 colour-contrast issues per page | **0** on `/`, `/work`, `/launch-website`, SW Florida page |

## QA (local static server with HTTP range support; Playwright 1.64)
57/57 checks: desktop Chromium 1440×900 (hover/focus/one-at-a-time/pause/off-screen/hero pause remembered/links/alt
text/no early downloads/no console errors), reduced motion, Save-Data, Android (Pixel 7), **WebKit iPhone 14 and iPad Pro
11 emulation** (muted inline playback, in-view previews, no overflow), axe vs live baseline, `$99` form preselect, all
pages 200 with no overflow. WebKit emulation is the closest available proxy — **a real iPhone/Safari check is still
needed on the preview.**

## SEO / lead capture (item 4 of the package)
Done here: real local project proof and internal links on the Southwest Florida page, case-study and offer links from
cards and the pricing note, descriptive poster alt text. **Not built (needs copy approval):** service-specific landing
pages modelled on communitypoolsllc.com — suggested next: one page each for website repair, small-business website
design and custom software/CRM, each with its own FAQ, proof cards from this library and a clear inquiry route; no
duplicated city pages and no ranking guarantees.

## Adding the two clips still to come
1. `pwsh scripts/media/add-video.ps1 -Video <clip.mp4> -Poster <frame.jpg> -Id <project-id>` (strips audio, ensures
   fast-start, writes WebP posters).
2. Add a row to `docs/video-manifest.json` (URL, people, permission).
3. Copy one `<article class="video-card" …>` block, change `data-project`, `data-project-name`, `data-video-src`, the
   picture/img paths, alt, tag, text and both links. `js/video.js` picks it up automatically.
4. To include them in the hero, have the editor re-cut the reel (or append with
   `ffmpeg -i reel.mp4 -i new.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1[v]" -map "[v]" -an -c:v libx264 -crf 23 -movflags +faststart out.mp4`)
   and re-run step 1 with `-Kind hero`.

## Open items
- Review the new card copy (Vertical Builders, Detail Kings, Native Sun, Ten Ambassadors, Starlight — adapted from the
  revamp's reviewed copy) and the two identified clip mappings.
- Starlight's recording shows the 2026-12-11 countdown: recapture after the event.
- `starter-kit/` is still publicly served — decide whether to block it like `/docs`.
- Pre-existing, not changed: the desktop nav wraps onto two lines between ~1024 and ~1200 px.
- Netlify deploy previews are public URLs; everything on this branch is cleared for public use per the decisions above.

## Release
Push the branch → Netlify deploy preview → check on a real iPhone (Safari) and desktop → merge to `main` after Fred's
approval (that deploys production).
