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

- [ ] **Per-page metadata** — add `generateMetadata()` so each page has a
  unique, specific title/description instead of inheriting the homepage
  default from `layout.tsx`:
  - `/product/[slug]` — title = product name + "Varcha", description = product
    description, OG image = product's model-shot
  - `/category/[slug]` — title = category name, description mentions
    styles/occasions
  - `/search` — dynamic title based on the query
- [ ] **Structured data (JSON-LD)** — invisible `<script type="application/ld+json">`
  blocks so Google can show rich results (price, image, rating):
  - `Product` schema on every PDP (name, image, price, availability, brand)
  - `BreadcrumbList` schema on PDP/PLP (Home → Category → Product)
  - `Organization` schema on the homepage (name, logo, social links, contact)
- [ ] **Image alt text audit** — `ProductCard`, PDP gallery, hero carousel all
  need descriptive `alt` text (e.g. "Kundan Polki Necklace — bridal gold
  necklace"), not blank or generic. Drives Google Image search traffic.
- [ ] **Sitemap + robots check** — `sitemap.ts` and `robots.txt` already exist;
  verify the live sitemap lists every product/category URL correctly on the
  real domain, and robots.txt isn't accidentally blocking anything.
- [ ] **Canonical URLs** — prevent duplicate-content penalties from
  filter/query-param variations of the same PLP.
- [ ] **Real Lighthouse check** — run against the live `https://varcha.in`,
  fix anything below the NFR-1 target (80+ mobile). Page speed is a direct
  ranking factor.

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
