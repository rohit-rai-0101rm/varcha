'use client';

import { useEffect, useState } from 'react';
import { adminApiListOrders, adminApiUpdateOrderStatus } from '@/lib/admin-api';

interface OrderItem {
  productId: { name: string; slug: string } | null;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  userId?: { name: string; email: string } | null;
  guestContact?: { name: string; phone: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const ORDER_STATUSES = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-surface border border-line text-ink-soft',
  returned: 'bg-rose-bg text-rose-ink',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  async function load(status?: string) {
    setLoading(true);
    const data = await adminApiListOrders(status || undefined);
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { load(statusFilter); }, [statusFilter]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const updated = await adminApiUpdateOrderStatus(orderId, newStatus);
      setOrders((o) => o.map((x) => x._id === orderId ? { ...x, orderStatus: updated.orderStatus } : x));
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setUpdating(null);
    }
  }

  const customerName = (o: Order) =>
    o.userId?.name ?? o.guestContact?.name ?? 'Guest';
  const customerEmail = (o: Order) =>
    o.userId?.email ?? o.guestContact?.email ?? '';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="font-body text-sm text-ink-soft">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full font-body text-sm">
            <thead className="bg-surface text-left">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', ''].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-line last:border-0 align-top hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <p className="font-annotation text-xs text-ink-soft">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                    <p className="font-annotation text-xs text-ink-soft break-all">{o._id.slice(-8)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{customerName(o)}</p>
                    <p className="text-xs text-ink-soft">{customerEmail(o)}</p>
                  </td>
                  <td className="px-4 py-3">
                    {o.items.map((item, i) => (
                      <p key={i} className="text-ink-soft">
                        {item.productId?.name ?? 'Deleted'} ×{item.qty}
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                    ₹{o.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-badge px-2 py-0.5 text-xs capitalize ${o.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-badge px-2 py-0.5 text-xs capitalize ${STATUS_COLORS[o.orderStatus] ?? ''}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      disabled={updating === o._id}
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="rounded-btn border border-line bg-surface px-2 py-1 font-body text-xs text-ink focus:border-wine focus:outline-none disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
