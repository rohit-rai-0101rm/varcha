# Varcha — Stone / Jewellery Category Restructure Plan

Client-requested restructure: split the catalog into two top-level sections
(**Stone**, **Jewellery**) instead of one flat category list, plus a new
custom-order request feature. This doc captures what's confirmed, what's
still open, and the build plan once open items are closed.

---

## 1. What's confirmed (from client voice note + follow-up Q&A)

- **Stone** section sells only **bracelets made from natural gemstones**
  (ruby, pearl, coral, emerald, etc.), each tied to a zodiac sign (rashi).
  No necklaces, earrings, rings, or other jewellery types under Stone —
  bracelets only.
- **Jewellery** section is the existing fashion/artificial catalog
  (Necklaces, Bangles, Earrings, Polki Set, Navratan Set, Chocker Set) —
  unchanged in kind, just re-parented under a "Jewellery" top-level category.
- Rashi naming: **Hindi/Sanskrit names** (Mesh, Vrishabh, Mithun, Kark,
  Simha, Kanya, Tula, Vrishchik, Dhanu, Makar, Kumbh, Meen) — not the
  English zodiac names. *(Exact spelling/transliteration to confirm with
  client before this ships — Devanagari vs Roman script, and whether he
  wants Sanskrit or colloquial Hindi spelling.)*
- **No certificate/authenticity claim for now** — may be added later. No
  certificate upload field or "certified natural stone" badge needed in
  this phase.
- **Buying flow is the same** as regular Jewellery — browse → add to cart →
  checkout once Razorpay is live. No separate consultation/inquiry flow.
- **No astrological benefit claims for now** ("this stone helps your
  career/health") — may be added later. Keep Stone product copy factual:
  stone name, rashi, material, price. This also sidesteps ASCI
  advertising-claim scrutiny for now — worth remembering if benefit claims
  get added later, that's the point to revisit wording carefully.

## 2. Now decided (2026-07-12)

- **Custom order request form**: client confirmed the proposed field list
  (name, phone, email, occasion, budget range, preferred stone/style,
  reference image upload, message) — **and it opens as a modal**, not a
  separate page. Triggered by a CTA button on the Stone section.
- **Stone bracelet naming**: developer's call, per client — going with
  **"Rashi Bracelets"** to keep it clearly distinct from Jewellery's
  existing "Bangles" category.
- **Sales channel for Stone products**: confirmed **website-exclusive**
  only, never listed on marketplace — matches the existing premium-line
  rule.
- **The "revolving circular" visual**: client asked us to design this
  ourselves rather than supply a reference. Decision below.

### Design: rotating medallion badge
A circular badge (~160px) sits centered between the Stone and Jewellery
panels — overlapping the divider on desktop, stacked centered on mobile.
- **Outer ring**: small uppercase text curved around the circle (SVG
  `<textPath>`), reading something like "NATURAL STONES · HANDCRAFTED
  JEWELLERY ·" repeating — set in Inter (not Special Elite; curved text at
  this size needs to stay legible, and Special Elite is reserved for short
  flat labels per the design system).
- **Rotation**: the outer ring rotates continuously via CSS
  (`animation: spin 26s linear infinite`) — slow and steady, reads as
  premium rather than attention-grabbing. Same lightweight CSS-only
  approach as the existing Coming Soon hero tilt effect, no new
  dependencies.
- **Center**: stays static (does not rotate) — the Varcha V-mark, in gold,
  sitting still while the ring turns around it.
- This is deliberately restrained rather than a spinning carousel or
  flashy 3D object — matches the "craft journal" brand direction and
  reuses existing brand assets (logo, gold token) instead of inventing new
  visual language.

## 3. Still open — one item left

- [ ] **Dummy data removal scope** — clear demo Categories/Products
  (agreed, banners stay untouched). Still need a yes/no on the demo
  **Styles** (Kundan, Meenakari, Maasai Beadwork, Minimalist, etc.) — keep
  as real tags for future Jewellery products, or wipe and start fresh?
- [ ] **What happens when the custom-order modal is submitted** —
  defaulting to the same pattern as `/admin/leads` (sits in an admin list,
  no auto-notification) unless client wants something more active (e.g.
  an email alert like the order-confirmation flow). Reasonable default,
  flagging in case he wants more.

---

## 4. Technical design

### Category structure
- Two new top-level `Category` documents: **"Stone"** and **"Jewellery"**
  (`parentCategory: null`).
- Existing categories (Necklaces, Bangles, Earrings, Polki Set, Navratan
  Set, Chocker Set) get `parentCategory` set to Jewellery's `_id` — no
  schema change needed, `Category.parentCategory` already supports this
  nesting (SRS §6.2), it's just data, not code.
- Under Stone: one subcategory to start ("Rashi Bracelets"), same nesting
  mechanism.

### Rashi tagging
- Add a fixed literal-union type `Rashi` to `shared/src/index.ts` (12
  values, Hindi/Sanskrit names) — same pattern as the existing `Gender`
  type, **not** a new admin-managed collection like Styles. There are
  exactly 12 rashis, forever — no CRUD needed, no reason to let admins
  free-text it (same data-integrity spirit as FR-30, just via a fixed enum
  instead of a DB lookup since the list never changes).
- Add optional `rashi?: Rashi` field to the `Product` schema (shared type +
  Mongoose model). Only shown/relevant on the admin product form when the
  selected category is under Stone.
- Product PLP for Stone gets a rashi filter (dropdown, same UX pattern as
  the existing style/occasion filters on regular PLPs).

### Product model
- No other schema changes needed — Stone bracelets are still `price`,
  `images`, `description`, `channel`, `stockQty` like every other product.
  No certificate field, no per-carat pricing (confirmed: these are priced
  as finished pieces, not sold by weight).

### Admin panel
- Category form: unchanged, `parentCategory` dropdown already exists.
- Product form: show the Rashi dropdown conditionally when category is
  under Stone (mirrors how `marketplaceLinks` already only shows when
  `channel = marketplace`).

### Frontend
- Homepage: new section directly below the hero banner — two blocks side
  by side (Stone / Jewellery) with the rotating medallion badge centered
  between them.
- Stone PDP: same template as regular PDP, plus the rashi tag displayed
  near the product name/style area.
- Custom order form: **modal**, not a page — a new `CustomOrderModal`
  component triggered by a CTA button on the Stone block, reusing the same
  submit/success-state pattern already built in `LeadCaptureForm`, extended
  with the extra fields (occasion, budget range, preferred stone/style,
  image upload).
- New `CustomOrderRequest` collection (mirrors `Lead`) + admin list page
  at `/admin/custom-orders`, same pattern as `/admin/leads`.

---

## 5. Build sequence

1. Confirm the one remaining open item in §3 (Styles wipe) with client.
2. Restructure categories (Stone / Jewellery parents, re-parent existing
   categories) — data change, no schema change. **Done in the local
   `varcha_dev` test DB** (Stone, Jewellery, and Polki/Navratan/Chocker
   re-parented under Jewellery). Not yet applied to production.
3. Add `Rashi` type + `Product.rashi` field (shared type, backend model,
   admin form, PLP filter). Not yet started.
4. Clear dummy Categories/Products (and Styles, pending confirmation) —
   banners untouched.
5. **Done** — custom-order modal (`CustomOrderTrigger` + shadcn/Radix
   `Dialog`), backend (`CustomOrderRequest` model/service/controller,
   public `POST /api/custom-orders` + `POST /api/custom-orders/upload`),
   and admin list page (`/admin/custom-orders`). Follows the same
   no-auto-notification pattern as `/admin/leads` per the open item in §3.
6. **Done** — homepage Stone/Jewellery section (`StoneJewellerySection`)
   with the rotating medallion badge (`RotatingMedallion` + `LogoMark`,
   CSS `spin` animation, SVG `textPath` ring). Gated on `Stone` and
   `Jewellery` categories existing by slug, so it stays invisible on any
   environment (like production) until step 2 actually ships there.
7. Update `docs/SRS.md` with the new FR + schema entries (per the
   documentation sync rule) once this actually ships — not before, since
   the spec should reflect what's built, not what's still being designed.
