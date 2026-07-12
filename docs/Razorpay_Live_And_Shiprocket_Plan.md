# Varcha — Razorpay Go-Live & Shiprocket Integration Plan

Two separate tracks. Razorpay must go live first — Shiprocket exists to fulfil
real paid orders, so building it before real orders exist is solving a
problem that doesn't exist yet. Build Shiprocket's code in parallel if there's
idle time, but don't consider Phase 3 "done" until Razorpay is live and at
least one real Shiprocket shipment has been created for a real order.

---

## Track 1 — Razorpay: Test → Live

### Client-owned (blocks everything else)
- [ ] Complete KYC on the Razorpay dashboard — PAN, bank account, business
  registration. For a Pvt Ltd entity this typically needs: Certificate of
  Incorporation, company PAN, MOA/AOA, authorized signatory KYC, company
  bank account proof.
- [ ] Wait for Razorpay approval (timeline varies — sole proprietorship is
  usually faster than Pvt Ltd; check the Razorpay dashboard directly for
  live status rather than guessing)

### Developer steps (once KYC clears — quick, code is already correct)
- [ ] Razorpay issues live keys (`rzp_live_...`) — get `RAZORPAY_KEY_ID` and
  `RAZORPAY_KEY_SECRET` from the live dashboard
- [ ] Update the server's `.env` with the live keys (never commit these)
- [ ] Configure a webhook in the Razorpay dashboard: URL
  `https://varcha.in/api/checkout/webhook`, event `payment.captured` — copy
  the webhook secret into `RAZORPAY_WEBHOOK_SECRET` in `.env`
- [ ] Restart backend: `pm2 restart varcha-backend --update-env`
- [ ] Place **one real, small-value order** (e.g. the cheapest product) to
  confirm: live payment succeeds → order + payment saved atomically →
  stock decrements → both admin alert and customer confirmation emails fire
- [ ] Re-confirm `NFR-4` still holds in live mode — only
  `gatewayTransactionId` is ever stored on the `Payment` model, never card
  details (already true by design, but worth a conscious re-check before
  real money moves through it)
- [ ] Refund the test order via the Razorpay dashboard afterward

### Test gate
One real order placed, paid, and refunded successfully with both emails
confirmed received.

---

## Track 2 — Shiprocket Integration (first time — detailed)

### What Shiprocket's API actually looks like
Shiprocket doesn't use a static API key — auth is **email + password login**
that returns a Bearer token (valid ~10 days), which must be refreshed
periodically. This is different from Razorpay's static key pattern, so the
service needs its own token-caching logic. **Verify exact endpoint paths and
payload shapes against Shiprocket's current API docs when implementing** —
their API has changed over time and specifics below are the general shape,
not guaranteed byte-for-byte accurate at implementation time.

General flow:
1. `POST /v1/external/auth/login` (email/password) → returns `token`
2. `POST /v1/external/orders/create/adhoc` — creates the order on
   Shiprocket's side (customer address, items, weight/dimensions, payment
   mode) → returns a Shiprocket `order_id` and `shipment_id`
3. Assign a courier (either auto-assign via Shiprocket's recommendation, or
   admin picks one) → generates an AWB (tracking) number
4. Generate the shipping label/manifest (PDF) via their label endpoint
5. Schedule pickup
6. Track via their tracking endpoint, or (better) their webhook for status
   updates (out for delivery, delivered, RTO, etc.)

### Client-owned setup
- [ ] Create a Shiprocket account, complete their business verification
- [ ] Get API credentials (their login email/password used for API auth —
  not a separate API key)
- [ ] Confirm pickup address/warehouse details are set up correctly in their
  dashboard (this is what appears on shipping labels)

### Developer work — backend
- [ ] `backend/src/services/shiprocketService.ts`:
  - Token management: login, cache the token, detect expiry/401 and
    re-login transparently
  - `createShipment(order)` — maps a Varcha `Order` to Shiprocket's
    create-order payload, calls their API, returns `{ shiprocketOrderId,
    shipmentId, awbCode, courierName, labelUrl }`
  - Wrap all calls with try/catch — a Shiprocket failure must not corrupt
    order state; surface the error to the admin UI instead
- [ ] Schema addition to `Order` (needs an `docs/SRS.md` §6.8 revision per
  the doc-sync rule, since this modifies the documented schema):
  - `shiprocketOrderId: String`
  - `trackingNumber: String` (the AWB code)
  - `courierName: String`
  - `labelUrl: String` (nullable until generated)
- [ ] New route: `POST /api/admin/orders/:id/create-shipment` (admin-only,
  `requireAdmin`) — calls `shiprocketService.createShipment`, saves the
  returned tracking fields onto the `Order`, updates `orderStatus` to
  `shipped`
- [ ] Extend `emailService.ts` with `sendShippedNotification` — reuses the
  existing pattern (Resend, non-blocking, logs `error` field rather than
  relying on a throw), includes the tracking number and a tracking link
- [ ] Call the shipped-notification email from the create-shipment
  controller once the shipment is successfully created

### Developer work — frontend (admin panel)
- [ ] `app/admin/orders/[id]/page.tsx` (or wherever order detail lives) —
  add a **"Create Shipment"** button, only enabled when `orderStatus` is
  `confirmed`/`placed` and no `trackingNumber` exists yet
- [ ] On click: call the new endpoint via `admin-api.ts`, show
  loading/error states, then display the resulting tracking number + a
  link to download the label (`labelUrl`)
- [ ] Customer-facing order history/detail page (`account/orders/[orderId]`)
  — show tracking number + courier name once present, matching FR-15's
  order status list

### Testing plan
Shiprocket doesn't have a true separate "sandbox" the way Razorpay does —
test with a real order using your own address as the delivery address, then
cancel/don't actually ship it if a real courier gets dispatched. Confirm:
label downloads correctly, tracking number saves onto the `Order`, and the
customer notification email fires with a working tracking link.

### Production-readiness checklist (before calling Phase 3 done)
- [ ] Token refresh logic actually handles expiry without manual
  intervention (test by forcing a stale token if possible)
- [ ] A failed Shiprocket API call shows a clear error in the admin UI,
  doesn't silently fail, and doesn't leave the order in an inconsistent
  state
- [ ] `docs/SRS.md` §6.8 Orders schema updated with the new tracking fields
- [ ] One real end-to-end shipment created and tracked from admin panel to
  delivery

---

## Revision History
| Date | Change |
|---|---|
| 2026-07-08 | Initial plan drafted — Razorpay go-live sequenced before Shiprocket, per client request to add both |
