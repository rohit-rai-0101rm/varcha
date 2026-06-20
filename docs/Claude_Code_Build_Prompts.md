# Claude Code Build Prompts — Varcha E-Commerce Platform

How to use this: paste each checkpoint's prompt into Claude Code **in order**. Don't start the next checkpoint until the test gate for the current one passes. If something breaks mid-checkpoint, paste the error back to Claude Code rather than skipping ahead — it can usually fix its own mistake faster than you can work around it.

**Before checkpoint 0:** put the SRS in your repo at `docs/SRS.md`, and the design tokens reference at `docs/DESIGN_SYSTEM.md` (export the key sections as plain text/markdown — Claude Code reads files in the repo far better than a pasted summary). Every prompt below tells Claude Code to read these. If you don't have a markdown export of the SRS yet, even pasting the FR/NFR list and the schema tables into a plain `.md` file works fine.

---

## Checkpoint 0 — Project skeleton

```
    Set up new full-stack project for an e-commerce platform called Varcha,
    structured as a Yarn Workspace monorepo:

    - Root package.json with "workspaces": ["frontend", "backend", "shared"]
    - /frontend — Next.js (App Router), TypeScript, Tailwind CSS
    - /backend — Node.js + Express, TypeScript
    - /shared — TS types/interfaces used by both halves (Product, Order, etc.)
    - MongoDB via Mongoose, connection string from an .env file (never hardcoded)
    - One yarn.lock at the root — run `yarn install` once from root, not
    separate installs inside each workspace folder

    Read docs/SRS.md first for full context — it's an artificial jewelry
    e-commerce site with two purchase flows (marketplace redirect for everyday
    items, own checkout for an exclusive line) and an admin panel. Don't build
    any features yet, just the skeleton.

    Also read docs/DESIGN_SYSTEM.md and set up the design tokens now, even
    though there's no UI yet — define the CSS variables (light + dark, via a
    data-theme attribute) in the Tailwind config / global CSS, and import the
    three fonts (Fraunces, Inter, Special Elite). Every component built in
    later checkpoints should pull from these tokens, not invent new ones.

    Use Yarn for every install, not npm — when scaffolding anything (e.g.
    create-next-app), make sure it doesn't default to generating a
    package-lock.json. Commit yarn.lock once it exists.

    Set up:
    - TypeScript configs for both frontend and backend, strict mode on
    - ESLint + Prettier for both
    - A basic Express server with one health-check route: GET /api/health
    returning { status: "ok", db: "connected" | "disconnected" }
    - Mongoose connection with proper error handling and reconnection logic
    - .env.example listing every env var needed so far (MONGODB_URI, PORT)
    - A root README explaining how to run both halves locally
    ```

**Test gate:** run both servers locally. Hit `/api/health`, confirm it returns `db: "connected"`. Confirm the Next.js app renders a blank page with no console errors, light/dark toggle (even a placeholder one) actually swaps the CSS variables. Don't move on until both are true.

---

## Checkpoint 1 — Catalog core

```
Read docs/SRS.md, Section 6 (Data Requirements) and Section 3.1
(Catalog & Navigation, FR-1 to FR-5, FR-30).

Build, in MongoDB/Mongoose:
- Category model (6.2) — including parentCategory for nested categories
  like Mangalsutras > Mangalsutra Bracelets / Mangalsutra Chains
- Styles model (6.3) — name, slug, family (indian-craft / global-tradition
  / aesthetic), isActive
- Product model (6.4) — note styleIds is an array of refs to Styles, not
  a fixed enum

Backend: REST endpoints for Categories, Styles, and Products (list with
filters by category, style, price range, occasion, gender; get by slug;
basic search by name).

Frontend:
- A Product Listing Page at /category/[slug] with filter UI (price,
  occasion, gender, style)
- A Product Detail Page at /product/[slug] showing images (tag each as
  product-shot or model-shot), name, price, description, style tags
- A search bar
- Use the tokens and component patterns from docs/DESIGN_SYSTEM.md —
  product cards should show the origin/style label using the small SVG
  motif tied to that style's `family` (indian-craft / global-tradition /
  aesthetic), not a generic icon

Important: do NOT make category/style fields free-text anywhere in any
admin form you scaffold later — FR-30 explicitly requires dropdown/multi-
select sourced from the real collections, not typed text. Keep that in
mind even though the admin panel isn't built until checkpoint 4.

Write a small seed script that adds 2-3 sample categories, a handful of
styles across all three families, and 5-6 sample products, so the PLP/PDP
aren't empty during testing.
```

**Test gate:** run the seed script. Load the PLP, confirm filters actually narrow the product list. Open a PDP, confirm it shows the right product's data, not a mismatched one. Try the search bar with a partial product name.

---

## Checkpoint 2 — Accounts & marketplace purchase flow

```
Read docs/SRS.md, Sections 3.2, 3.4, and 3.6-3.8 (FR-6 to FR-8,
FR-16 to FR-19, FR-26 to FR-29), and Section 6.1 (Users schema).

Build:
- Guest session: set a sessionId cookie on first visit if none exists
- Signup/login (email + password, bcrypt-hashed). Phone is REQUIRED on
  the signup form (NFR from SRS v5). Include the marketing-consent
  checkbox, unchecked by default, on the signup form.
- Wishlist (logged-in users only)
- On login, link the prior guest sessionId's data to the new userId
  where possible
- On each marketplace-channel PDP, render one button per configured
  marketplaceLink (Amazon/Flipkart) — a product can have one or both.
  Clicking logs an Events doc: type "amazon_redirect" or similar, with
  sessionId, productId, platform, timestamp — then opens the link in a
  new tab.
- Static pages: About, Contact, Care Guide, FAQ, Ring Size Guide
- A sitewide "Chat on WhatsApp" button (wa.me link) — hardcode a
  placeholder number for now, we'll wire it to the Settings collection
  in checkpoint 4

Use the Events and Sessions schemas from SRS Section 6.6/6.7 exactly as
specified.
```

**Test gate:** sign up a test account, confirm phone is required and won't submit without it, confirm the consent checkbox value is saved. Log out, browse as guest, add something to view history, then log back in — confirm the session's prior activity (check the database directly) is now tied to your userId. Click a marketplace buy button, confirm a new Events document appears in MongoDB.

---

## Checkpoint 3 — Checkout & payments (premium line)

```
Read docs/SRS.md, Section 3.3 (FR-9 to FR-15), Section 6.8/6.9
(Orders and Payments schemas), and Section 4 NFR-4 (payment security)
and NFR-7 (prepaid only, no COD).

Build:
- Cart (works for guests too — no login required to check out)
- Checkout flow: shipping address, contact number, payment method
  (gateway only — cards/UPI/netbanking — no COD option anywhere in the UI)
- Integrate [Razorpay/Cashfree/PayU — pick one] in TEST/SANDBOX mode only.
  Use their official Node SDK. Never log or store raw card details — the
  gateway's hosted checkout or SDK handles that, our server only stores
  the gateway's transaction reference.
- On successful payment: create an Order document and a Payment document,
  matching the schemas exactly. Use a Mongo transaction so the order
  creation and any stock decrement happen atomically — don't let two
  customers buy the last unit of a low-stock item.
- Send an order confirmation email (use a free transactional email
  service in test mode is fine for now — Resend, Nodemailer with a test
  SMTP, whatever's fastest to wire up)
- Order history page for logged-in users; order status field exists
  (placed/confirmed/shipped/delivered/cancelled/returned) even though
  status updates come from the admin panel in checkpoint 4

Be careful here — this is the one part of the build that handles real
money eventually. Don't take shortcuts on error handling: what happens
if the payment succeeds but the order-save fails? What happens if the
webhook arrives twice? Think through these explicitly and tell me how
you've handled them.
```

**Test gate:** run a full sandbox transaction start to finish. Check MongoDB directly — confirm the Order and Payment documents have the right data, right status, right linkage. Confirm the confirmation email arrives (even in test mode). Deliberately fail a sandbox payment and confirm the order is NOT created. This checkpoint is worth testing twice.

---

## Checkpoint 4 — Admin panel

```
Read docs/SRS.md, Section 3.5 (FR-20 to FR-23, FR-30), and Section 6.3,
6.5, 6.11 (Styles, Banners, Settings schemas).

Build an admin-only area (separate login from regular Users — use the
Admins collection from SRS 6.10) covering:
- Products: full CRUD. Category and style fields MUST be dropdown/
  multi-select populated from the real Categories and Styles collections
  — no free-text input for these two fields, per FR-30. Include channel,
  marketplaceLinks, stockQty.
- Categories: full CRUD, including setting parentCategory for nesting
- Styles: full CRUD, including the family grouping field, so a large tag
  list (30+ styles) stays browsable instead of one long dropdown
- Banners: CRUD + an on/off toggle
- Orders: list, filter by status, update status
- Settings: a single-document form for whatsappNumber, contactEmail,
  socialLinks, homeBannerEnabled, firstOrderDiscountText — wire the
  WhatsApp button built in checkpoint 2 to read the number from here
  instead of the hardcoded placeholder

Protect every admin route — confirm a non-admin user (or no user at all)
gets rejected, not just hidden in the UI.
```

**Test gate:** as admin, create a brand-new product end to end — confirm you could only pick category/style from dropdowns, never typed them. Toggle a banner off, confirm it disappears from the homepage without a deploy. Update an order's status, confirm it reflects on the customer's order history page. Try hitting an admin API route while logged out or as a regular user — confirm it's rejected.

---

## Checkpoint 5 — Event tracking pipeline

```
Read docs/SRS.md, Section 3.6 (FR-24, FR-25) and Section 6.6/6.7
(Sessions and Events schemas).

Build:
- A lightweight client-side tracker that fires events for: pageview,
  time_spent (on page unload or navigation, send duration), click
  (on key elements — product cards, category links), in addition to the
  amazon_redirect and checkout_complete events already wired in earlier
  checkpoints
- A single ingestion endpoint (POST /api/events) that writes to the
  Events collection — keyed by sessionId, with userId attached if the
  visitor is logged in
- Confirm the guest-to-user session linking from checkpoint 2 actually
  carries through to this event data, not just account data

Batch events client-side if it makes sense (don't fire a network request
on every single mouse movement) but don't over-engineer this — a simple
debounce is enough for now.
```

**Test gate:** browse the site anonymously for a few minutes across different pages. Query the Events collection directly — confirm pageview and time_spent documents are showing up with a consistent sessionId. Log in partway through, keep browsing, then check that later events carry your userId while earlier ones (now linked) can still be traced back to the same session.

---

## Checkpoint 6 — Analytics dashboard

```
Read docs/SRS.md, Section 3.6 (FR-25, FR-31).

Build an admin dashboard view aggregating the Events, Orders, and
Products collections to show:
- Most-viewed and most-clicked products
- Top categories and top styles by engagement
- Sessions/users with the highest engagement (time spent, click count)
- Premium-line order volume and revenue, separate from marketplace
  redirect-click counts (these are NOT the same kind of number — don't
  let the UI imply marketplace clicks are confirmed sales)
- FR-31: for any registered customer, a per-customer breakdown of time
  spent per product — group Events by userId, then by productId, sum
  durationMs. Surface this on that customer's detail page in admin, not
  just as a buried query — it's meant for the sales team to actually use
  before calling someone, so it needs to be visible, not just possible.

Use MongoDB aggregation pipelines for this rather than pulling everything
into the app and computing in JavaScript — it'll matter once there's
real data volume.
```

**Test gate:** before trusting this with real data, seed a known batch of fake Events and Orders with predictable values, then manually count what the "correct" dashboard numbers should be. Compare against what the dashboard actually shows. If they don't match, the aggregation logic is wrong — fix it before this checkpoint is considered done, not after real customers generate real (now-distrusted) numbers. Also open a test customer's detail page and confirm the per-product time breakdown matches what you'd expect from the seeded events for that user.

---

## Checkpoint 7 — Policy pages, performance, SEO

```
Read docs/SRS.md, Section 3.7 (FR-26, FR-27) and Section 4
(NFR-1, NFR-2).

Build:
- Privacy Policy, Terms & Conditions, Refund/Cancellation Policy,
  Shipping Policy pages — real content reflecting what this build
  actually does (prepaid-only premium checkout, marketplace redirect
  for the everyday line, what data is collected and why) — not
  generic boilerplate copied from a template
- Image optimization pass across PLP/PDP (Next.js Image component,
  proper sizing, lazy loading below the fold)
- Basic SEO: meta titles/descriptions per page, sitemap.xml, robots.txt
- Mobile responsiveness pass — test at common breakpoints, not just
  resizing a desktop browser window
- Run a Lighthouse audit and fix whatever's dragging the mobile
  performance score below 80
```

**Test gate:** run Lighthouse on the homepage, a PLP, and a PDP — confirm 80+ performance on mobile for each. Open the site on an actual phone, not just dev tools' device emulation. Confirm all four policy pages render with real, accurate content — not lorem ipsum, not a generic template (this was the single biggest failure of the previous vendor's site — don't repeat it).

---

## Checkpoint 8 — QA and go-live

```
Read docs/SRS.md in full one more time as a final check.

Do a full pass:
- Re-test every checkpoint's test gate together, not in isolation —
  confirm checkpoints don't conflict (e.g., does an admin banner toggle
  still work after the SEO pass touched the homepage layout?)
- Switch the payment gateway from sandbox to live credentials (only
  after the client's business KYC has actually cleared)
- Triple-check no card data, no raw payment details, are logged anywhere
  — check server logs, not just the database
```

**Test gate — do this yourself, don't delegate it:** place one real order with real money, the smallest amount the catalog allows. Confirm the payment clears, the order appears correctly in the admin panel, the confirmation email arrives, and the order status can be updated through to "delivered." Then test a cancellation/refund on a second real order. Only call this launch-ready once both of those have actually happened with real money — sandbox success doesn't count for this checkpoint.