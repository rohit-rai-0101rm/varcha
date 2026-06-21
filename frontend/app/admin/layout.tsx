'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAdminToken, clearAdminToken, adminApiMe } from '@/lib/admin-api';

const NAV = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/styles', label: 'Styles' },
  { href: '/admin/banners', label: 'Banners' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [adminName, setAdminName] = useState('');
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      if (!isLogin) router.replace('/admin/login');
      setReady(true);
      return;
    }
    adminApiMe().then((admin) => {
      if (!admin) {
        clearAdminToken();
        router.replace('/admin/login');
      } else {
        setAdminName(admin.name);
      }
      setReady(true);
    });
  }, []); // single check on mount

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex flex-1 bg-bg">
      <aside className="flex w-56 shrink-0 flex-col bg-wine" style={{ minHeight: '100vh' }}>
        <div className="border-b border-white/20 px-5 py-4">
          <p className="font-display text-lg font-bold text-surface">Varcha</p>
          <p className="font-body text-xs text-white/60">Admin</p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-btn px-3 py-2 font-body text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? 'bg-white/20 font-medium text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/20 p-4">
          {adminName && <p className="mb-2 truncate font-body text-xs text-white/60">{adminName}</p>}
          <button
            onClick={() => { clearAdminToken(); router.push('/admin/login'); }}
            className="w-full rounded-btn border border-white/30 px-3 py-1.5 font-body text-xs text-white/80 hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
