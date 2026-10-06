# Harley Transport — new website

A full redesign of harleytransport.co.uk: static HTML/CSS/JS, no build step, no
framework lock-in — any basic web host (or Netlify/GitHub Pages) can serve it
as-is. Built around same-day, multi-day and through-the-night haulage, the
South West/South Wales coverage area, and the fleet-hire/driver-recruitment
side of the business.

## What's here

```
index.html                  Home
about.html                  Company story, values, accreditations, sustainability
services.html                Same-day / multi-day / through-the-night / fleet hire
fleet.html                   Vehicle classes 7.5t–44t
coverage-sectors.html        Coverage map + industries served
careers.html                 Driver recruitment + application form
news.html                    Blog/guides index
news/*.html                  Two sample SEO articles (with social share buttons)
faq.html                     FAQ accordion (with FAQPage schema)
quote.html                   3-step animated quote request form
contact.html                 Contact form + map + depot details
privacy-policy.html          Placeholder — needs legal review before launch
terms-conditions.html        Placeholder — needs legal review before launch
404.html                     Custom not-found page
robots.txt / sitemap.xml     Technical SEO
site.webmanifest             PWA-lite metadata (home screen icon etc.)
netlify.toml                 Optional — only matters if hosting on Netlify
assets/css/style.css         Whole design system — one file, CSS variables at the top
assets/js/main.js            Nav, scroll animations, counters, carousel, forms, share buttons
assets/images/               Placeholder favicon/OG/hero images — see below
assets/video/                Drop the real showreel here — see assets/video/README.md
```

Every page is plain HTML with the header/footer duplicated — no templating, so
anyone can open a file, edit the text, and save. There's nothing to "build" or
"compile".

## Before this goes live — a checklist

**Content & imagery**
- [ ] Replace `assets/images/hero-poster.jpg`, `assets/images/fleet-yard.jpg`
      and `assets/images/og-default.jpg` — these are hand-built brand
      illustrations (navy/amber, truck silhouettes), not real photography,
      used as a stopgap so the site isn't shipping with a generic stock
      photo. Swap in real photos/video of your vehicles, depot and drivers
      (with their permission) as soon as you have them.
- [ ] Add a real showreel to `assets/video/fleet-showreel.mp4` (see the README
      in that folder for the spec). The hero works fine without it — it just
      shows the poster image — but video is a big trust-builder for haulage.
- [ ] Swap the sample testimonials on the homepage for real, signed-off client
      quotes. The one genuine review ("Fantastic service at great prices") is
      already in there; the other two are clearly marked as placeholders.
- [ ] Review the two sample news articles — they're genuinely useful generic
      guides, but add your own voice, examples and photos over time.
- [ ] Have a solicitor or qualified advisor check `privacy-policy.html` and
      `terms-conditions.html` — they're structured correctly but the content
      is a starting template, not legal advice.
- [ ] Confirm the accreditation claims on the About page (Operator's Licence,
      insurance, DBS checks) match what you actually hold, and attach copies
      of the real certificates if you want to link to them.

**Forms (currently demo-only)**
All three forms (quote, contact, driver application) are wired for
[Netlify Forms](https://docs.netlify.com/manage/forms/setup/) already —
`data-netlify="true"` plus a hidden `form-name` field — so if you deploy on
Netlify, submissions just work and land in Site settings → Forms, with email
notifications you can turn on in two clicks.

If you're hosting elsewhere, pick one:
- **Formspree** (formspree.io) — change each form's `action` to your
  Formspree endpoint and remove `data-netlify="true"`.
- **Your own backend** — point `action` at your endpoint.

Either way, once a real backend is connected, remove the `data-demo-only`
attribute from each `<form>` tag in `quote.html`, `careers.html` and
`contact.html` — that attribute is what makes `main.js` intercept the submit
and show the demo "thanks" screen instead of actually sending the data.

**Analytics & tracking**
No analytics are wired in yet, by design — add whichever you use (GA4, Plausible,
Fathom, etc.) as a `<script>` tag just before `</head>` on every page, and
mention it in the cookie banner copy if it sets non-essential cookies.

**Search Console / Analytics setup**
- [ ] Verify the domain in Google Search Console and submit `sitemap.xml`
- [ ] Set up Google Business Profile (if not already) and link from the footer
- [ ] Update `sameAs` links in the homepage's LocalBusiness schema and the
      footer social icons once real social profiles are confirmed

## SEO & technical notes

**Fixes carried over from the old site's crawl audit** — a Screaming Frog
export of the previous harleytransport.co.uk (5 pages) flagged:
- Page titles under 30 characters on 4 of 5 pages → every title here is a
  full, keyword-rich pipe-separated title well past that minimum.
- Missing security response headers (HSTS, CSP, X-Content-Type-Options,
  X-Frame-Options, Referrer-Policy) on every page → added via `netlify.toml`
  if hosted on Netlify; set the equivalent in your host's config otherwise.
- Non-descriptive "Learn more" anchor text → every link now names what it
  leads to (e.g. "Same-day delivery details").
- Heavy legacy JavaScript, render-blocking requests, and unused CSS/JS
  (100% of pages) → this rebuild ships one hand-written CSS file and one
  ~8KB vanilla JS file, no framework runtime or polyfills, so there's
  nothing "unused" to strip.

- Every page has a unique `<title>`, meta description, canonical URL and
  Open Graph tags for social sharing previews.
- Structured data (JSON-LD): `MovingCompany`/LocalBusiness on the homepage,
  `Service` on the services page, `FAQPage` on the FAQ page, `Article` on
  each news post.
- Semantic HTML throughout (`<header>`, `<nav>`, `<main>`, `<article>`,
  breadcrumbs) with `aria-label`s on icon-only buttons.
- Images use `loading="lazy"` and explicit width/height to avoid layout shift.
- A skip-link and visible focus states are included for keyboard/screen-reader
  users; animations respect `prefers-reduced-motion`.
- No build tooling, no external JS framework — fast first paint on cheap hosting.

## Design system

Colours, fonts, spacing and radii are defined as CSS variables at the top of
`assets/css/style.css` (`:root { ... }`). Change the brand colour in one place
and it updates everywhere. The palette is a light, clean base (white/off-white
body, warm near-black "ink" for dark sections like the hero and footer) built
around a deep oxblood-red accent (`--red-600: #820f01`), with a brighter
`--red-400` variant used for accent text on the dark sections. Fonts are
Manrope (headings) and Inter (body), loaded from Google Fonts.

## Deploying

Any static host works:
- **Netlify / Cloudflare Pages / Vercel** — connect the repo, no build command needed (publish directory `.`), forms work out of the box on Netlify.
- **Traditional cPanel/FTP hosting** — upload everything as-is to `public_html`.
- **GitHub Pages** — enable Pages on this repo's default branch.

---
This README is for whoever maintains the site day to day — delete or trim it
once the checklist above is done.
