'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AuthNav() {
  const { user, logout, loading } = useAuth();

  if (loading) return <div className="h-8 w-16 animate-pulse rounded-btn bg-line" />;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/wishlist"
          className="hidden items-center gap-1.5 font-body text-xs text-ink-soft transition-colors hover:text-wine sm:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Wishlist
        </Link>
        <button
          onClick={logout}
          className="rounded-btn border border-line px-3 py-1.5 font-body text-xs text-ink-soft transition-colors hover:border-wine hover:text-wine"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="rounded-btn border border-line px-3 py-1.5 font-body text-xs text-ink-soft transition-colors hover:border-wine hover:text-wine"
      >
        Sign in
      </Link>
    </div>
  );
}
