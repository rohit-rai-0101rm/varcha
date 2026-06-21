'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { apiGetOrderById } from '@/lib/client-api';
import { useRouter, useParams } from 'next/navigation';

interface ProductRef {
  name: string;
  slug: string;
  images: { url: string; type: string }[];
}

interface OrderItem {
  productId: ProductRef;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: { line1: string; line2?: string; city: string; state: string; pincode: string };
}

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-yellow-50 text-yellow-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  returned: 'bg-gray-100 text-gray-600',
};

export default function OrderDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login?next=/account/orders');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !orderId) return;
    apiGetOrderById(orderId)
      .then((data) => setOrder(data as Order | null))
      .finally(() => setFetching(false));
  }, [user, orderId]);

  if (loading || fetching) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 animate-pulse rounded-lg bg-[var(--line)]" />
          ))}
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">Order not found</h1>
        <Link href="/account/orders" className="mt-6 inline-block text-sm text-[var(--wine)] hover:underline">
          ← Back to orders
        </Link>
      </main>
    );
  }

  const addr = order.shippingAddress;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/account/orders" className="mb-6 inline-block text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
        ← My Orders
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.orderStatus] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>
      </div>

      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        Placed on{' '}
        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <section className="mt-8 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 font-display font-semibold text-[var(--ink)]">Items</h2>
        <ul className="divide-y divide-[var(--line)]">
          {order.items.map((item, idx) => {
            const coverImg = item.productId?.images?.find((i) => i.type === 'product-shot') ?? item.productId?.images?.[0];
            return (
              <li key={idx} className="flex gap-4 py-4">
                {coverImg && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-[var(--line)]">
                    <Image src={coverImg.url} alt={item.productId?.name ?? ''} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-[var(--ink)]">{item.productId?.name ?? 'Item'}</p>
                  <p className="text-sm text-[var(--ink-soft)]">
                    ₹{item.price.toLocaleString('en-IN')} × {item.qty}
                  </p>
                </div>
                <p className="font-semibold text-[var(--ink)]">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t border-[var(--line)] pt-4 font-semibold text-[var(--ink)]">
          <span>Total</span>
          <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="mb-2 font-display font-semibold text-[var(--ink)]">Shipping Address</h2>
        <p className="text-sm text-[var(--ink-soft)]">
          {addr.line1}
          {addr.line2 ? `, ${addr.line2}` : ''}<br />
          {addr.city}, {addr.state} — {addr.pincode}
        </p>
      </section>
    </main>
  );
}
