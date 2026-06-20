'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiAddToWishlist, apiRemoveFromWishlist } from '@/lib/client-api';

interface Props {
  productId: string;
}

export default function WishlistButton({ productId }: Props) {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const inWishlist = user?.wishlist.includes(productId) ?? false;

  async function toggle() {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setLoading(true);
    try {
      if (inWishlist) {
        await apiRemoveFromWishlist(productId);
      } else {
        await apiAddToWishlist(productId);
      }
      await refreshUser();
    } catch {
      // silent — wishlist errors don't need a modal
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface transition-colors hover:border-wine disabled:opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={inWishlist ? 'var(--wine)' : 'none'}
        stroke="var(--wine)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
