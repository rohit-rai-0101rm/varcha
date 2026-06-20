'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiGetWishlist } from '@/lib/client-api';
import ProductCard from '@/components/ProductCard';
import type { ApiProduct } from '@/lib/api';

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    apiGetWishlist()
      .then((data) => setProducts(data as ApiProduct[]))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-card bg-line" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-ink">Your Wishlist</h1>

        {products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--line)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="font-body text-ink-soft">Your wishlist is empty.</p>
            <Link
              href="/search"
              className="rounded-btn bg-wine px-6 py-2.5 font-body text-sm font-semibold text-surface transition-opacity hover:opacity-90"
            >
              Explore pieces
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
