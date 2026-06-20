'use client';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'varcha_token';

export function getSessionId(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)varcha_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const sid = getSessionId();
  if (sid) headers['X-Session-Id'] = sid;
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  marketingConsent: boolean;
  wishlist: string[];
}

export async function apiSignup(body: {
  name: string;
  email: string;
  phone: string;
  password: string;
  marketingConsent: boolean;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Signup failed');
  return data;
}

export async function apiLogin(body: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Login failed');
  return data;
}

export async function apiMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API}/api/auth/me`, { headers: authHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function apiLogout() {
  clearToken();
}

export async function apiLogEvent(event: {
  type: string;
  productId?: string;
  categoryId?: string;
  durationMs?: number;
  platform?: string;
}) {
  const sid = getSessionId();
  if (!sid) return;
  try {
    await fetch(`${API}/api/events`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(event),
    });
  } catch {
    // best-effort — never throw on tracking failure
  }
}

export async function apiAddToWishlist(productId: string) {
  const res = await fetch(`${API}/api/wishlist/${productId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to add to wishlist');
}

export async function apiRemoveFromWishlist(productId: string) {
  const res = await fetch(`${API}/api/wishlist/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to remove from wishlist');
}

export async function apiGetWishlist(): Promise<unknown[]> {
  const res = await fetch(`${API}/api/wishlist`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}
