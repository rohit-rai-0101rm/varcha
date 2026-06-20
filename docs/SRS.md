# Software Requirements Specification — Varcha
**Version 7.0 — Per-Customer Engagement View** · June 19, 2026

## Revision History
| Version | Change |
|---|---|
| 1.0 | Initial draft — Amazon-redirect-only model |
| 2.0 | Hybrid model adopted: everyday line via Amazon, premium line via website-exclusive own checkout with COD |
| 2.1 | COD removed from premium-line checkout — prepaid only |
| 3.0 | Split document: business rationale moved to companion Business Plan |
| 4.0 | Generalized to multi-marketplace links (Amazon + Flipkart). Added WhatsApp and Settings collection |
| 5.0 | Phone required at signup. Added marketing-consent checkbox |
| 6.0 | Replaced fixed `finish` enum with admin-managed Styles collection. Added dropdown-only data-integrity rule (FR-30) |
| 7.0 | Added FR-31: per-customer time-spent breakdown for sales follow-up |

---

## 1. Introduction

### 1.1 Purpose
Functional and non-functional requirements for an e-commerce website for an artificial (fashion) jewelry brand, under a hybrid business model.

### 1.2 Scope
Two distinct product lines under one storefront:
- **Everyday line** (typically under ₹1,000) — customers redirected to the brand's Amazon/Flipkart listing to complete purchase. As of March 2026, Amazon charges zero referral fee on fashion jewellery under ₹1,000 (closing/weight-handling fees still apply).
- **Premium/bridal line** (typically above ₹1,000) — sold exclusively through the platform's own checkout. Never listed on any marketplace, to avoid cross-channel price comparison and inventory conflicts.

An admin panel lets non-technical staff manage products, categories, styles, banners, and orders.

### 1.3 Definitions and Acronyms
| Term | Definition |
|---|---|
| PLP | Product Listing Page (category page) |
| PDP | Product Detail Page |
| CRUD | Create, Read, Update, Delete |
| Session | A single visit by a browser, identified by a cookie, independent of login state |
| Event | A single recorded user action — page view, click, time-spent, or redirect |
| COD | Cash on Delivery |
| RTO | Return to Origin — an undelivered/refused order sent back to the seller |
| KYC | Know Your Customer — identity/business verification required by payment gateways |

---

## 2. Overall Description

### 2.1 Product Perspective
A new, ground-up build with two purchase paths: external redirect to a marketplace for the everyday line, self-hosted checkout for the premium line.

### 2.2 Product Positioning
Defined in the companion Business Plan document. This SRS assumes that positioning and translates it into technical requirements only.

### 2.3 User Classes
| User class | Description | Access |
|---|---|---|
| Guest visitor | Anonymous, no account | Full browsing; can redirect to marketplace or guest-checkout the premium line |
| Registered user | Signed up (optional) | Same as guest, plus wishlist, saved profile, order history |
| Admin | Client-side staff | Admin panel — products, categories, styles, banners, orders, analytics |

### 2.4 Operating Environment
- Frontend: Next.js (React), TypeScript
- Backend: Node.js with Express, TypeScript
- Database: MongoDB via Mongoose
- Payment gateway: Razorpay, Cashfree, or PayU (final choice pending client KYC) — cards, UPI, netbanking
- Shipping/logistics: third-party courier aggregator (e.g., Shiprocket) for premium-line fulfillment
- Image hosting: Cloudinary or equivalent
- Hosting/Deployment: Vercel (frontend), Node-compatible host/container (backend)

### 2.5 Assumptions and Dependencies
- Payment gateway activation requires business KYC (PAN, bank account, business registration). Hard dependency for own-checkout — should start immediately, in parallel with development.
- GST registration/invoicing should be confirmed by the client with an accountant; this document gives no tax advice.
- Everyday-line real conversion data is only available via Amazon Associates tagged links; otherwise only redirect-click counts exist, not confirmed sales.
- Premium-line products are never duplicated on a marketplace — enforced by admin process, not a technical block.
- Product photography, copy, and marketplace listing URLs are provided by the client.
- Browsing requires no login. Login is optional, required only for order history.
- Using collected phone numbers for outbound sales calls is a different purpose than collecting them for delivery/account creation. India's DND/NCPR rules and applicable data protection law generally require consent for that specific use — hence the marketing-consent checkbox (3.3, 3.4). Not legal advice; confirm with counsel before outbound calling begins.

---

## 3. Functional Requirements

### 3.1 Catalog & Navigation
- **FR-1**: Category navigation menu with sub-category filters.
- **FR-2**: Each PLP supports filtering by price range, occasion, gender, and style (from the Styles collection).
- **FR-3**: Search bar returning matches by name, category, or tag.
- **FR-4**: Each product carries a channel attribute — marketplace or website-exclusive — determining its PDP purchase flow.
- **FR-5**: Each PDP displays images (product-shot/model-shot tagged separately), name, price, description, and one or more styles.

### 3.2 Purchase Flow — Everyday Line (Marketplace)
- **FR-6**: Marketplace-channel PDPs show one button per configured marketplace link (Amazon/Flipkart) — a product may have one or both.
- **FR-7**: Log a redirect-click event (product ID, marketplace, session ID, timestamp) at the point of redirect.
- **FR-8** (conditional): If enrolled in Amazon Associates / a Flipkart affiliate program, links include the tracking tag.

### 3.3 Purchase Flow — Premium Line (Own Checkout)
- **FR-9**: Website-exclusive PDPs show "Add to Cart" instead of a marketplace redirect.
- **FR-10**: Cart with quantity adjustment and item removal, persisted per session.
- **FR-11**: Checkout collects shipping address, contact number, payment method, and an unchecked-by-default marketing-consent checkbox.
- **FR-12**: Payment via the gateway only (cards/UPI/netbanking). No COD in this version (see Section 8).
- **FR-13**: Order confirmation via email and/or SMS on success.
- **FR-14**: Logged-in users can view order history and current status.
- **FR-15**: Order status: placed, confirmed, shipped, delivered, cancelled, returned.

### 3.4 User Accounts
- **FR-16**: Guest browsing and guest checkout (premium line), no login required.
- **FR-17**: Optional signup/login via email + password. Phone number **required** at signup, plus the same consent checkbox.
- **FR-18**: Logged-in users can add/remove wishlist items.
- **FR-19**: On login, link the prior guest session's engagement history to the account where possible.

### 3.5 Admin Panel
- **FR-20**: CRUD on products — channel, marketplace links, style tags, stock qty (website-exclusive only).
- **FR-21**: CRUD on categories, styles, and promotional banners.
- **FR-22**: Order management — list, filter by status, update status, COD reconciliation.
- **FR-23**: Admin auth separate from regular user accounts.
- **FR-30**: Category and style fields on the product form are dropdown/multi-select only, sourced directly from the Categories/Styles collections. **Free-text entry is not permitted** — prevents miscategorization (e.g., a bangle filed under the wrong category).

### 3.6 Engagement & Analytics
- **FR-24**: Record session-level events — pageview, time spent, clicks, marketplace redirects, checkout completions.
- **FR-25**: Admin dashboard — most-viewed/clicked products, top categories by engagement, highest-engagement sessions/users, premium-line order volume and revenue (split by channel where relevant).
- **FR-31**: For any registered customer, a per-customer breakdown of time spent per product — grouped by userId then productId from Events data — to support personalized sales follow-up. Admin/sales-role only, never shown to the customer.

### 3.7 Static & Support Pages
- **FR-26**: About, Contact, Jewellery Care Guide, FAQ, Ring Size Guide.
- **FR-27**: Privacy Policy, Terms & Conditions, Refund/Cancellation Policy, Shipping Policy — required for operating the own-checkout line.

### 3.8 WhatsApp Support & Site Settings
- **FR-28**: Persistent sitewide "Chat on WhatsApp" button (wa.me, pre-filled message; includes product name if launched from a PDP).
- **FR-29**: Admin Settings page — WhatsApp number, contact email, social links, homepage banner toggle, first-order discount text — all editable without a code change.

---

## 4. Non-Functional Requirements
- **NFR-1 (Performance)**: PLP/PDP achieve Lighthouse 80+ on mobile.
- **NFR-2 (Usability)**: Fully responsive — mobile, tablet, desktop.
- **NFR-3 (Security — accounts)**: Passwords salted-hashed (bcrypt).
- **NFR-4 (Security — payments)**: Card/payment details never stored on platform servers — delegated entirely to the PCI-DSS-compliant gateway.
- **NFR-5 (Scalability)**: Schema supports new categories/styles/occasion tags with no structural migration.
- **NFR-6 (Maintainability)**: Consistent folder structure, maintainable by a single developer post-launch.
- **NFR-7 (Margin protection)**: Premium line is prepaid-only at launch. COD intentionally excluded (margin/RTO) — see Section 8 for the conditional path back.
- **NFR-8 (Purpose limitation)**: Phone numbers collected for delivery/account purposes are not used for outbound sales calls unless marketing-consent was checked. Sales call list must be filterable to consented contacts only.

## 5. External Interface Requirements
- **EIR-1**: Marketplaces (Amazon, Flipkart) — outbound links only; affiliate tagging optional, pending enrollment.
- **EIR-2**: Payment gateway (Razorpay/Cashfree/PayU) — final pick pending KYC; premium-line checkout only.
- **EIR-3**: Shipping/logistics aggregator — labels and tracking for premium-line deliveries.
- **EIR-4**: Email/SMS provider — order confirmation and status notifications.
- **EIR-5**: Image storage (e.g., Cloudinary) — product, model-shot, and banner images.
- **EIR-6**: WhatsApp — wa.me deep link only, no Business API integration in this version.

---

## 6. Data Requirements

### 6.1 Users (updated in v5)
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| name | String | Required |
| email | String | Required, unique |
| phone | String | Required |
| passwordHash | String | Bcrypt salted hash |
| marketingConsent | Boolean | Default false; from signup checkbox |
| createdAt | Date | Auto-set |

### 6.2 Categories
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| name | String | Display name |
| slug | String | URL-friendly, unique |
| parentCategory | ObjectId (ref) | Nullable, for sub-categories |
| image | String (URL) | Category thumbnail |
| isActive | Boolean | Default true |

### 6.3 Styles (NEW in v6)
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| name | String | e.g. "Kundan", "Maasai Beadwork", "Minimalist" |
| slug | String | URL-friendly, unique |
| family | String (enum) | indian-craft / global-tradition / aesthetic |
| image | String (URL) | Optional thumbnail |
| isActive | Boolean | Default true |

### 6.4 Products (updated in v6)
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| name | String | Required |
| slug | String | URL-friendly, unique |
| categoryId | ObjectId (ref) | References Categories |
| price | Number | In INR |
| images | Array<{url, type}> | type = product-shot / model-shot |
| description | String | |
| styleIds | Array<ObjectId> (ref Styles) | Replaces old `finish` enum |
| occasion | Array<String> | daily/party/festive/bridal/anniversary/formal/gen-z — free-form |
| gender | String (enum) | women / men / kids |
| channel | String (enum) | marketplace / website-exclusive |
| marketplaceLinks | Array<{platform, url}> | platform = amazon/flipkart; only when channel = marketplace |
| stockQty | Number | Only meaningful when channel = website-exclusive |
| isActive | Boolean | Default true |
| createdAt | Date | Auto-set |

### 6.5 Banners
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| image | String (URL) | Banner image |
| linkUrl | String | Destination on click |
| position | String (enum) | home-hero / category-top / sidebar |
| startDate | Date | Scheduling |
| endDate | Date | Scheduling |
| isActive | Boolean | Default true |

### 6.6 Sessions
| Field | Type | Notes |
|---|---|---|
| _id | String | Session ID, cookie on first visit |
| userId | ObjectId (ref) | Nullable; set on login |
| startedAt | Date | |
| endedAt | Date | Updated per event |
| device | String | User agent summary |

### 6.7 Events
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| sessionId | String (ref) | References Sessions — primary tracking key |
| userId | ObjectId (ref) | Nullable, only if logged in |
| type | String (enum) | pageview / click / time_spent / amazon_redirect / checkout_complete |
| productId | ObjectId (ref) | Nullable |
| categoryId | ObjectId (ref) | Nullable |
| durationMs | Number | Used for time_spent events |
| timestamp | Date | Auto-set |

### 6.8 Orders
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| userId | ObjectId (ref) | Nullable for guest checkout |
| guestContact | {name, phone, email} | Used when userId is null |
| marketingConsent | Boolean | Default false; from checkout checkbox |
| items | Array<{productId, qty, price}> | Price snapshot at order time |
| shippingAddress | {line1, line2, city, state, pincode} | |
| paymentMethod | String (enum) | gateway only in v1; "cod" reserved in enum, not exposed in UI |
| paymentStatus | String (enum) | pending / paid / failed / refunded |
| orderStatus | String (enum) | placed / confirmed / shipped / delivered / cancelled / returned |
| totalAmount | Number | In INR |
| createdAt | Date | Auto-set |

### 6.9 Payments
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| orderId | ObjectId (ref) | References Orders |
| gatewayTransactionId | String | Nullable for COD |
| amount | Number | In INR |
| status | String (enum) | initiated / success / failed / refunded |
| method | String | card / upi / netbanking (cod not active in v1) |

### 6.10 Admins
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| name | String | |
| email | String | Required, unique |
| passwordHash | String | Bcrypt salted hash, separate from Users |
| role | String (enum) | super-admin / editor / order-manager |

### 6.11 Settings (NEW in v4)
| Field | Type | Notes |
|---|---|---|
| _id | String | Singleton, e.g. "site-settings" |
| whatsappNumber | String | Builds the wa.me link |
| contactEmail | String | |
| socialLinks | {instagram, facebook} | Optional |
| homeBannerEnabled | Boolean | Sitewide on/off toggle |
| firstOrderDiscountText | String | e.g. "Flat ₹500 off" |
| updatedAt | Date | Auto-set on save |

---

## 7. Out of Scope (v1)
- Real-time inventory sync between the website and any marketplace
- Loyalty/rewards program
- Gold rate calculators, digital gold, real-precious-metal investment features
- Native mobile app

## 8. Future Enhancements
Maintained in the companion Business Plan document, Section 7 (Roadmap). None required for this version's technical scope.

## 9. Approval
| Role | Name | Signature | Date |
|---|---|---|---|
| Client | | | |
| Developer | | | |