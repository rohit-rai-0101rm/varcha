# Varcha — SEO Plan

Client wants the site to rank well on Google. This plan covers what's actually
controllable through code (Phase A), account/manual setup (Phase B), and the
ongoing habit that keeps ranking improving over time (Phase C). Execute in
order — Phase A first, since it's the highest-leverage and entirely in our
control.

**Expectation to set with the client:** technical SEO is necessary but not
sufficient — actual ranking movement takes weeks to months regardless of code
quality, since Google also weighs domain age, backlinks, and competition. This
is not a one-time fix.

**Instagram clarification:** a post showing up in Google search is controlled
by Instagram's own account indexing setting (public + indexing allowed), not
by anything built on the Varcha site. Separate system, separate fix.

---

## Phase A — Technical SEO (code changes, do first)

- [x] **Per-page metadata** — `generateMetadata()` on PDP/PLP/search, each
  with a unique title/description instead of inheriting the homepage default:
  - `/product/[slug]` — title = product name + "Varcha", description = product
    description, OG image = product's model-shot, canonical URL
  - `/category/[slug]` — title = category name, description mentions
    styles/occasions, OG image = category image, canonical URL
  - `/search` — dynamic title based on the query (still `noindex`)
- [x] **Structured data (JSON-LD)** — added:
  - `Product` schema on every PDP (name, image, price, availability, brand)
  - `BreadcrumbList` schema on PDP (Home → Category → Product) and PLP
    (Home → Category)
  - `Organization` schema on the homepage (name, logo, contact email)
- [x] **Image alt text audit** — `ProductCard` and `FeaturedStrip` now include
  the style name in alt text when available (e.g. "Kundan Polki Necklace —
  Kundan style"); PDP gallery already had descriptive alt text. Hero carousel
  images are decorative background banners with no per-slide caption data in
  the schema — left as generic alt text, low SEO value either way.
- [x] **Sitemap + robots check** — both already correct: sitemap includes
  homepage, all static pages, active categories and products with sensible
  priorities; robots.txt disallows admin/checkout/cart/account/search/auth
  and points to the sitemap. No changes needed.
- [x] **Canonical URLs** — added to homepage, every PDP, and every PLP via
  `alternates.canonical`.
- [ ] **Real Lighthouse check** — run against the live `https://varcha.in`,
  fix anything below the NFR-1 target (80+ mobile). Manual step, not yet run.

## Phase B — Off-page setup (manual, mostly account work, do after Phase A ships)

- [ ] **Google Search Console** — verify domain ownership (DNS TXT record via
  Cloudflare), submit the sitemap so Google actively crawls instead of waiting
  to discover it.
- [ ] **Google Business Profile** — free local listing; often surfaces above
  organic results for "jewelry near me" type searches. High value, low effort.
- [ ] **Set expectations with the client** on the Instagram/Google search
  distinction (see note above).

## Phase C — Ongoing (long-term, not a one-time task)

- [ ] Publish fresh content regularly (new products, updated descriptions) —
  signals an active site to Google. Operational habit for the client, not
  code work.

---

## Revision History
| Date | Change |
|---|---|
| 2026-07-05 | Initial plan drafted after client requested better Google ranking |
