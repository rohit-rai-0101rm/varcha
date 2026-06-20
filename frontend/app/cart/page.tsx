'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQty, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">Your cart is empty</h1>
        <p className="mt-3 text-[var(--ink-soft)]">Explore our collection and add something you love.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-[var(--wine)] px-6 py-3 font-medium text-[var(--surface)]"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">Your Cart</h1>

      <div className="mt-8 divide-y divide-[var(--line)]">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 py-6">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--line)]">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between">
                <Link href={`/product/${item.slug}`} className="font-medium text-[var(--ink)] hover:underline">
                  {item.name}
                </Link>
                <span className="font-semibold text-[var(--ink)]">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)]"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[var(--ink)]">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.qty + 1)}
                    disabled={item.qty >= item.stockQty}
                    className="flex h-7 w-7 items-center justify-center rounded border border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex w-full max-w-xs justify-between text-lg font-semibold text-[var(--ink)]">
          <span>Total</span>
          <span>₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <Link
          href="/checkout"
          className="rounded-lg bg-[var(--wine)] px-8 py-3 font-medium text-[var(--surface)] transition-opacity hover:opacity-90"
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}
