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

## 2. Still open — confirm before building

- [ ] **Custom order request form fields.** Client asked for this section
  but hasn't specified fields. Proposed default (needs his sign-off):
  name, phone, email, occasion, budget range, preferred stone/style, a
  reference image upload, free-text message.
- [ ] **What happens when a custom order form is submitted** — does the
  client get notified to call the customer, or does it just sit in an
  admin list (same pattern as the existing Leads page)?
- [ ] **The "revolving circular" visual** between the Stone and Jewellery
  sections — still too vague to build. Need a reference (a site he likes,
  a screenshot, or a plain description of the motion: spins on load? on
  hover? cycles through images?).
- [ ] **Stone bracelet naming** — Jewellery's existing bracelet category is
  called "Bangles" in the nav, so there's no literal name collision today.
  Recommend naming the Stone subcategory something explicit like **"Rashi
  Bracelets"** (not just "Bracelets") so customers never confuse the two on
  sight. Needs client confirmation on the exact label.
- [ ] **Sales channel for Stone products** — assuming **website-exclusive**
  by default (natural/precious items, never listed on Amazon/Flipkart,
  consistent with the existing premium-line rule in CLAUDE.md). Confirm
  this is correct and not meant to also go on marketplace.
- [ ] **Dummy data removal scope** — clear demo Categories/Products (agreed,
  banners stay untouched). Still need a yes/no on the demo **Styles**
  (Kundan, Meenakari, Maasai Beadwork, Minimalist, etc.) — keep as real
  tags for future Jewellery products, or wipe and start fresh?

---

## 3. Technical design (once the above is confirmed)

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
- Homepage: new section directly below the hero banner, split into two
  blocks (Stone / Jewellery) — exact layout depends on the still-open
  "revolving circular" visual.
- Stone PDP: same template as regular PDP, plus the rashi tag displayed
  near the product name/style area.
- Custom order form: new page/section (`/custom-order` or embedded on
  Stone's landing block) — reuses the same lead-capture pattern already
  built (`LeadCaptureForm` component) as a starting point, extended with
  the extra fields once confirmed.

---

## 4. Build sequence (once open items are closed)

1. Confirm all open items in §2 with client.
2. Restructure categories (Stone / Jewellery parents, re-parent existing
   categories) — data change, no schema change.
3. Add `Rashi` type + `Product.rashi` field (shared type, backend model,
   admin form, PLP filter).
4. Clear dummy Categories/Products (and Styles, pending confirmation) —
   banners untouched.
5. Build the custom-order request form + admin list page (same pattern as
   `/admin/leads`).
6. Build the homepage Stone/Jewellery section + connecting visual, once a
   reference is available.
7. Update `docs/SRS.md` with the new FR + schema entries (per the
   documentation sync rule) once this actually ships — not before, since
   the spec should reflect what's built, not what's still being designed.
