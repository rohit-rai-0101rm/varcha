'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiListCustomers } from '@/lib/admin-api';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  marketingConsent: boolean;
  pageviews: number;
  clicks: number;
  totalTimeMs: number;
}

function fmtTime(ms: number) {
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiListCustomers().then((data) => {
      setCustomers(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Customers</h1>
          <p className="mt-1 font-body text-sm text-ink-soft">
            Registered accounts only. Click a row to see per-product time spent before calling.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      ) : customers.length === 0 ? (
        <p className="font-body text-sm text-ink-soft">No registered customers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full font-body text-sm">
            <thead className="bg-surface text-left">
              <tr>
                {['Name', 'Phone', 'Joined', 'Pageviews', 'Time on site', 'Consent', ''].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-ink-soft">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{c.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                    {new Date(c.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-ink">{c.pageviews}</td>
                  <td className="px-4 py-3 text-ink">{fmtTime(c.totalTimeMs)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-badge px-2 py-0.5 text-xs ${
                        c.marketingConsent
                          ? 'bg-green-50 text-green-700'
                          : 'border border-line bg-surface text-ink-soft'
                      }`}
                    >
                      {c.marketingConsent ? 'Consented' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${c._id}`}
                      className="text-xs font-medium text-wine hover:underline"
                    >
                      View →
                    </Link>
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
