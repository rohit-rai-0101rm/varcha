# Varcha — Product Roadmap & Next Steps

**Current status:** Checkpoints 0–7 complete and live on Vercel. Payment gateway in sandbox only — no real revenue until Razorpay KYC clears.

---

## Blockers Before the Site Can Make Money

These are not features. Fix these before building anything else.

| # | Blocker | Owner | Impact |
|---|---|---|---|
| 1 | **Razorpay KYC** — PAN, bank account, business registration | Client | Zero revenue possible until this is done |
| 2 | **Real product catalog** — 9 demo products with fake photos and placeholder Amazon links | Client + Developer | Site works but sells nothing real |
| 3 | ~~**Order notifications**~~ — done 2026-07-05, admin + customer emails now fire on every paid order | Developer | Resolved |

---

## Phase 2 — Revenue Ready

> **Goal:** Turn the site from a working demo into a shop that can actually collect money and fulfil orders.
> **Charge:** ₹8,000–12,000

### Features

- [x] **Admin order alert email** — the moment a customer pays, client gets an email (via Resend): buyer name, phone, items ordered, amount, shipping address. Sent to whatever `contactEmail` is set in Admin → Settings.
- [x] **Customer order confirmation email** — professional confirmation with order ID and summary (Resend), already wired into the checkout flow
- **Transactional SMS** — skipped for now (2026-07-05 decision). DLT registration + per-SMS cost apply regardless of provider (Twilio/MSG91); WhatsApp's existing wa.me button (FR-28) covers the "instant notification" feel for free. Revisit only if the client specifically wants real SMS and accepts the ongoing per-message cost.
- [ ] **Real product upload session** — sit with the client, upload their actual jewelry inventory: real photos, real descriptions, real Amazon/Flipkart URLs

### Test gate for Phase 2
Place one real paid order (after KYC). Confirm: admin gets the email within 60 seconds, customer gets confirmation, order appears in admin panel with correct status.

---

## Phase 3 — Operations

> **Goal:** Make order fulfilment manageable without the client needing to hire someone or juggle spreadsheets.
> **Charge:** ₹10,000–15,000

### Features

- **Shiprocket / Delhivery integration** — admin clicks "Create Shipment" on an order inside the admin panel, courier label is generated, tracking number auto-saved to the order
- **Shipped notification to customer** — email + SMS with tracking link when admin marks order as shipped
- **Low stock alert** — email to admin when any product's stockQty drops to 3 or below
- **Discount / coupon codes** — admin creates a code (flat ₹ or % off), customer enters it at checkout, order total recalculates

### Test gate for Phase 3
Create a shipment for a test order from the admin panel. Confirm label downloads, tracking number is saved, and customer receives the shipping notification automatically.

---

## Phase 4 — Growth

> **Goal:** Drive repeat purchases and higher average order value once the first ₹1L in revenue is in.
> **When to scope:** After the analytics show which products and categories are actually performing — don't guess now.

### Features (indicative, not committed)

- **WhatsApp abandoned cart nudge** — customer adds to cart but doesn't check out → automated WhatsApp message 2 hours later with a direct checkout link
- **Customer reviews on PDP** — star rating + text review, moderated via admin panel
- **"Complete the look" — related products** — show 2–3 complementary products at the bottom of every PDP
- **Instagram feed on homepage** — auto-pulls the brand's latest Instagram posts, keeps the homepage fresh without manual updates
- **Loyalty / referral program** — points on purchase, redeemable at checkout

---

## Pricing Summary

| Phase | Scope | Suggested Charge |
|---|---|---|
| Phase 2 | Revenue ready (emails, real catalog) | ₹8,000–12,000 |
| Phase 3 | Operations (shipping, coupons, stock alerts) | ₹10,000–15,000 |
| Phase 4 | Growth (WhatsApp, reviews, loyalty) | Quote after Phase 3 — scope depends on analytics |

---

## Talking Points for the Client

- **Phase 2** is the difference between a brochure and a shop. Until this is done, the site looks great but earns nothing.
- **Phase 3** is what prevents the client from needing a second person to manage orders manually once volume picks up.
- **Phase 4** is a future conversation — scope it only after the first few months of real sales data, because what you build should be driven by what the analytics actually show, not guesswork.
