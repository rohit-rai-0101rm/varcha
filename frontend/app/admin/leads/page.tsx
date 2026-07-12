'use client';

import { useEffect, useState } from 'react';
import { adminApiListLeads } from '@/lib/admin-api';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiListLeads().then((data) => {
      setLeads(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Leads</h1>
        <p className="mt-1 font-body text-sm text-ink-soft">
          Visitors who asked to be notified when checkout goes live. Message this list on launch day.
        </p>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="font-body text-sm text-ink-soft">No sign-ups yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full font-body text-sm">
            <thead className="bg-surface text-left">
              <tr>
                {['Name', 'Phone', 'Email', 'Signed up'].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{l.phone}</td>
                  <td className="px-4 py-3 text-ink-soft">{l.email || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                    {new Date(l.createdAt).toLocaleDateString('en-IN')}
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
