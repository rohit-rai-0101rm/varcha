'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApiGetCustomerDetail } from '@/lib/admin-api';

interface TimeSpentRow {
  _id: string;
  productName: string;
  productSlug: string;
  totalTimeMs: number;
  visits: number;
}

interface CustomerDetail {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    marketingConsent: boolean;
  };
  timeSpentByProduct: TimeSpentRow[];
}

function fmtTime(ms: number) {
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function AdminCustomerDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiGetCustomerDetail(userId).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <p className="font-body text-sm text-ink-soft">Loading…</p>;
  if (!data) return <p className="font-body text-sm text-ink-soft">Customer not found.</p>;

  const { user, timeSpentByProduct } = data;

  return (
    <div className="space-y-8">
      <Link href="/admin/customers" className="font-body text-sm text-ink-soft hover:text-ink">
        ← Customers
      </Link>

      {/* Customer profile */}
      <div className="rounded-card border border-line bg-surface p-6">
        <h1 className="font-display text-2xl font-semibold text-ink">{user.name}</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-ink-soft">Email</p>
            <p className="mt-0.5 font-body text-sm text-ink">{user.email}</p>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-ink-soft">Phone</p>
            <p className="mt-0.5 font-body text-sm text-ink">{user.phone}</p>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-ink-soft">Joined</p>
            <p className="mt-0.5 font-body text-sm text-ink">
              {new Date(user.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-ink-soft">Marketing consent</p>
            <span
              className={`mt-0.5 inline-block rounded-badge px-2 py-0.5 text-xs ${
                user.marketingConsent
                  ? 'bg-green-50 text-green-700'
                  : 'border border-line bg-surface text-ink-soft'
              }`}
            >
              {user.marketingConsent ? 'Consented — ok to call' : 'Not consented'}
            </span>
          </div>
        </div>
      </div>

      {/* FR-31: per-product time spent */}
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Time Spent by Product</h2>
        <p className="mt-1 mb-4 font-body text-sm text-ink-soft">
          How long this customer spent on each product page — sorted by total time. Use this before
          calling to know which pieces they were most interested in.
        </p>

        {timeSpentByProduct.length === 0 ? (
          <p className="font-body text-sm text-ink-soft">
            No product browsing data for this customer yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="w-full font-body text-sm">
              <thead className="bg-surface text-left">
                <tr>
                  {['Product', 'Total time', 'Visits'].map((h) => (
                    <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSpentByProduct.map((row) => (
                  <tr key={row._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                    <td className="px-4 py-3 font-medium text-ink">{row.productName}</td>
                    <td className="px-4 py-3 text-ink">{fmtTime(row.totalTimeMs)}</td>
                    <td className="px-4 py-3 text-ink-soft">{row.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
