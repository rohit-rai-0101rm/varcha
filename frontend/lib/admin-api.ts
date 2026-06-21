const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const ADMIN_TOKEN_KEY = 'varcha_admin_token';

export function getAdminToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function adminHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAdminToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function adminApiLogin(email: string, password: string) {
  const res = await fetch(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Login failed');
  return data as { token: string; admin: { _id: string; name: string; email: string; role: string } };
}

export async function adminApiMe() {
  const res = await fetch(`${API}/api/admin/auth/me`, { headers: adminHeaders() });
  if (!res.ok) return null;
  return res.json() as Promise<{ _id: string; name: string; email: string; role: string }>;
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function adminApiListProducts() {
  const res = await fetch(`${API}/api/admin/products`, { headers: adminHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminApiGetProduct(id: string) {
  const res = await fetch(`${API}/api/admin/products/${id}`, { headers: adminHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function adminApiCreateProduct(data: unknown) {
  const res = await fetch(`${API}/api/admin/products`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed to create product');
  return json;
}

export async function adminApiUpdateProduct(id: string, data: unknown) {
  const res = await fetch(`${API}/api/admin/products/${id}`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed to update product');
  return json;
}

export async function adminApiDeleteProduct(id: string) {
  const res = await fetch(`${API}/api/admin/products/${id}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function adminApiListCategories() {
  const res = await fetch(`${API}/api/admin/categories`, { headers: adminHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminApiCreateCategory(data: unknown) {
  const res = await fetch(`${API}/api/admin/categories`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

export async function adminApiUpdateCategory(id: string, data: unknown) {
  const res = await fetch(`${API}/api/admin/categories/${id}`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

export async function adminApiDeleteCategory(id: string) {
  const res = await fetch(`${API}/api/admin/categories/${id}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete');
}

// ── Styles ────────────────────────────────────────────────────────────────────

export async function adminApiListStyles() {
  const res = await fetch(`${API}/api/admin/styles`, { headers: adminHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminApiCreateStyle(data: unknown) {
  const res = await fetch(`${API}/api/admin/styles`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

export async function adminApiUpdateStyle(id: string, data: unknown) {
  const res = await fetch(`${API}/api/admin/styles/${id}`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

export async function adminApiDeleteStyle(id: string) {
  const res = await fetch(`${API}/api/admin/styles/${id}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed');
}

// ── Banners ───────────────────────────────────────────────────────────────────

export async function adminApiListBanners() {
  const res = await fetch(`${API}/api/admin/banners`, { headers: adminHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminApiCreateBanner(data: unknown) {
  const res = await fetch(`${API}/api/admin/banners`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

export async function adminApiUpdateBanner(id: string, data: unknown) {
  const res = await fetch(`${API}/api/admin/banners/${id}`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

export async function adminApiToggleBanner(id: string) {
  const res = await fetch(`${API}/api/admin/banners/${id}/toggle`, {
    method: 'PATCH', headers: adminHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

export async function adminApiDeleteBanner(id: string) {
  const res = await fetch(`${API}/api/admin/banners/${id}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed');
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function adminApiListOrders(status?: string) {
  const url = status ? `${API}/api/admin/orders?status=${status}` : `${API}/api/admin/orders`;
  const res = await fetch(url, { headers: adminHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminApiUpdateOrderStatus(id: string, orderStatus: string) {
  const res = await fetch(`${API}/api/admin/orders/${id}/status`, {
    method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ orderStatus }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function adminApiGetSettings() {
  const res = await fetch(`${API}/api/admin/settings`, { headers: adminHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function adminApiUpdateSettings(data: unknown) {
  const res = await fetch(`${API}/api/admin/settings`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed');
  return json;
}
