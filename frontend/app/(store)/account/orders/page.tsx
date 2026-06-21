'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiGetMyOrders } from '@/lib/client-api';
import { useRouter } from 'next/navigation';

interface OrderItem {
  productId: { name: string };
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-yellow-50 text-yellow-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  returned: 'bg-gray-100 text-gray-600',
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login?next=/account/orders');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    apiGetMyOrders()
      .then((data) => setOrders(data as Order[]))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || fetching) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-6 w-32 animate-pulse rounded bg-[var(--line)]" />
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">No orders yet</h1>
        <p className="mt-3 text-[var(--ink-soft)]">Your order history will appear here once you place an order.</p>
        <Link href="/" className="mt-8 inline-block rounded-lg bg-[var(--wine)] px-6 py-3 font-medium text-[var(--surface)]">
          Shop Now
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">My Orders</h1>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/account/orders/${order._id}`}
            className="block rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-[var(--ink-soft)]">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  {order.items.map((i) => `${i.productId?.name ?? 'Item'} × ${i.qty}`).join(', ')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.orderStatus] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                </span>
                <p className="font-semibold text-[var(--ink)]">₹{order.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
