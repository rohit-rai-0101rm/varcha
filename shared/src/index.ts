// ─── Literal union types (enums) ────────────────────────────────────────────

export type StyleFamily = 'indian-craft' | 'global-tradition' | 'aesthetic';

export type ProductChannel = 'marketplace' | 'website-exclusive';

export type MarketplacePlatform = 'amazon' | 'flipkart';

export type Gender = 'women' | 'men' | 'kids';

export type Occasion =
  | 'daily'
  | 'party'
  | 'festive'
  | 'bridal'
  | 'anniversary'
  | 'formal'
  | 'gen-z';

export type ImageType = 'product-shot' | 'model-shot';

export type BannerPosition = 'home-hero' | 'category-top' | 'sidebar';

export type EngagementEventType =
  | 'pageview'
  | 'click'
  | 'time_spent'
  | 'amazon_redirect'
  | 'checkout_complete';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

// "cod" is reserved in the enum but never exposed in the UI (prepaid-only at launch — NFR-7)
export type PaymentMethod = 'gateway' | 'cod';

export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type GatewayPaymentStatus = 'initiated' | 'success' | 'failed' | 'refunded';

export type GatewayPaymentMethod = 'card' | 'upi' | 'netbanking';

export type AdminRole = 'super-admin' | 'editor' | 'order-manager';

// ─── Domain interfaces ────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  marketingConsent: boolean; // default false; never pre-checked (FR-17)
  createdAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string; // ObjectId ref — nullable for top-level categories
  image?: string;
  isActive: boolean;
}

export interface Style {
  _id: string;
  name: string; // e.g. "Kundan", "Maasai Beadwork", "Minimalist"
  slug: string;
  family: StyleFamily; // drives which SVG motif renders on the product card
  image?: string;
  isActive: boolean;
}

export interface ProductImage {
  url: string;
  type: ImageType;
}

export interface MarketplaceLink {
  platform: MarketplacePlatform;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: string; // ref Category
  price: number; // INR
  images: ProductImage[];
  description: string;
  styleIds: string[]; // ref Style[] — dropdown/multi-select only (FR-30)
  occasion: Occasion[];
  gender: Gender;
  channel: ProductChannel;
  marketplaceLinks?: MarketplaceLink[]; // only when channel = 'marketplace'
  stockQty?: number; // only meaningful when channel = 'website-exclusive'
  isActive: boolean;
  createdAt: Date;
}

export interface Banner {
  _id: string;
  image: string;
  linkUrl: string;
  position: BannerPosition;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface Session {
  _id: string; // cookie-based session ID
  userId?: string; // ref User — set on login, nullable for guests
  startedAt: Date;
  endedAt?: Date;
  device?: string;
}

export interface EngagementEvent {
  _id: string;
  sessionId: string; // ref Session
  userId?: string; // ref User — nullable
  type: EngagementEventType;
  productId?: string; // ref Product — nullable
  categoryId?: string; // ref Category — nullable
  durationMs?: number; // only for time_spent events
  timestamp: Date;
}

export interface OrderItem {
  productId: string;
  qty: number;
  price: number; // snapshot at order time
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface GuestContact {
  name: string;
  phone: string;
  email: string;
}

export interface Order {
  _id: string;
  userId?: string; // ref User — nullable for guest checkout
  guestContact?: GuestContact; // used when userId is null
  marketingConsent: boolean; // default false; from checkout checkbox
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  totalAmount: number; // INR
  createdAt: Date;
}

export interface Payment {
  _id: string;
  orderId: string; // ref Order
  gatewayTransactionId?: string;
  amount: number; // INR
  status: GatewayPaymentStatus;
  method: GatewayPaymentMethod;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt, separate collection from Users
  role: AdminRole;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
}

export interface Settings {
  _id: string; // singleton — "site-settings"
  whatsappNumber: string;
  contactEmail: string;
  socialLinks?: SocialLinks;
  homeBannerEnabled: boolean;
  firstOrderDiscountText?: string;
  updatedAt: Date;
}
