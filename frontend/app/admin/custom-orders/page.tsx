'use client';

import { useEffect, useState } from 'react';
import { adminApiListCustomOrders } from '@/lib/admin-api';

interface CustomOrderRequest {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  occasion?: string;
  budgetRange?: string;
  preferredStone?: string;
  referenceImageUrl?: string;
  message?: string;
  createdAt: string;
}

export default function AdminCustomOrdersPage() {
  const [requests, setRequests] = useState<CustomOrderRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiListCustomOrders().then((data) => {
      setRequests(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Custom Order Requests</h1>
        <p className="mt-1 font-body text-sm text-ink-soft">
          Bespoke piece requests submitted from the Stone &amp; Jewellery section. Follow up by phone.
        </p>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="font-body text-sm text-ink-soft">No requests yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full font-body text-sm">
            <thead className="bg-surface text-left">
              <tr>
                {['Name', 'Phone', 'Email', 'Occasion', 'Budget', 'Preferred Stone', 'Reference', 'Message', 'Submitted'].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.phone}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.email || '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.occasion || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{r.budgetRange || '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.preferredStone || '—'}</td>
                  <td className="px-4 py-3">
                    {r.referenceImageUrl ? (
                      <a href={r.referenceImageUrl} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.referenceImageUrl} alt="Reference" className="h-10 w-10 rounded-btn border border-line object-cover" />
                      </a>
                    ) : '—'}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-ink-soft">{r.message || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                    {new Date(r.createdAt).toLocaleDateString('en-IN')}
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
