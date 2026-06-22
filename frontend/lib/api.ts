export type StyleFamily = 'indian-craft' | 'global-tradition' | 'aesthetic';

export interface ApiStyle {
  _id: string;
  name: string;
  slug: string;
  family: StyleFamily;
  image?: string;
  isActive: boolean;
}

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string;
  image?: string;
  isActive: boolean;
}

export interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  categoryId: ApiCategory;
  price: number;
  images: Array<{ url: string; type: 'product-shot' | 'model-shot' }>;
  description: string;
  styleIds: ApiStyle[];
  occasion: string[];
  gender: string;
  channel: 'marketplace' | 'website-exclusive';
  marketplaceLinks?: Array<{ platform: string; url: string }>;
  stockQty?: number;
  isActive: boolean;
  createdAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API}/api/categories`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchStyles(): Promise<ApiStyle[]> {
  const res = await fetch(`${API}/api/styles`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export interface ProductFilters {
  category?: string;
  style?: string;
  minPrice?: string;
  maxPrice?: string;
  occasion?: string;
  gender?: string;
  search?: string;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<ApiProduct[]> {
  const params = new URLSearchParams();
  (Object.entries(filters) as [string, string | undefined][]).forEach(([key, val]) => {
    if (val) params.set(key, val);
  });
  const qs = params.toString();
  const res = await fetch(`${API}/api/products${qs ? `?${qs}` : ''}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  const res = await fetch(`${API}/api/products/${slug}`, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  const res = await fetch(`${API}/api/categories/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export interface ApiBanner {
  _id: string;
  image: string;
  linkUrl: string;
  position: 'home-hero' | 'category-top' | 'sidebar';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface ApiSettings {
  whatsappNumber: string;
  contactEmail: string;
  homeBannerEnabled: boolean;
  firstOrderDiscountText: string;
}

export async function fetchBanners(position?: string): Promise<ApiBanner[]> {
  const qs = position ? `?position=${encodeURIComponent(position)}` : '';
  const res = await fetch(`${API}/api/banners${qs}`, { next: { revalidate: 30 } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchSettings(): Promise<ApiSettings | null> {
  const res = await fetch(`${API}/api/settings`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}
