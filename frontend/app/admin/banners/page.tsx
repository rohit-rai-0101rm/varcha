'use client';

import { useEffect, useState, FormEvent } from 'react';
import {
  adminApiListBanners,
  adminApiCreateBanner,
  adminApiDeleteBanner,
  adminApiToggleBanner,
} from '@/lib/admin-api';

interface Banner {
  _id: string;
  image: string;
  linkUrl: string;
  position: 'home-hero' | 'category-top' | 'sidebar';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

const POSITIONS = ['home-hero', 'category-top', 'sidebar'] as const;
const INPUT = 'w-full rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine';
const LABEL = 'font-body text-xs font-medium text-ink-soft';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');
  const [linkUrl, setLinkUrl] = useState('/');
  const [position, setPosition] = useState<typeof POSITIONS[number]>('home-hero');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const data = await adminApiListBanners();
    setBanners(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setImage(''); setLinkUrl('/'); setPosition('home-hero'); setStartDate(''); setEndDate(''); setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await adminApiCreateBanner({
        image, linkUrl, position,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        isActive: true,
      });
      await load();
      resetForm();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string) {
    try {
      const updated = await adminApiToggleBanner(id);
      setBanners((b) => b.map((x) => (x._id === id ? { ...x, isActive: updated.isActive } : x)));
    } catch (e: unknown) { alert((e as Error).message); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return;
    try {
      await adminApiDeleteBanner(id);
      setBanners((b) => b.filter((x) => x._id !== id));
    } catch (e: unknown) { alert((e as Error).message); }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Banners</h1>

      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <h2 className="mb-4 font-body text-sm font-medium text-ink">Add banner</h2>
        {error && <p className="mb-3 font-body text-xs text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1">
            <label className={LABEL}>Image URL *</label>
            <input className={INPUT} required value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Link URL</label>
            <input className={INPUT} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Position *</label>
            <select className={INPUT} value={position} onChange={(e) => setPosition(e.target.value as typeof POSITIONS[number])}>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Start date</label>
            <input className={INPUT} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>End date</label>
            <input className={INPUT} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={saving} className="rounded-btn bg-wine px-5 py-2 font-body text-sm text-surface disabled:opacity-60">
              {saving ? 'Adding…' : 'Add banner'}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      ) : banners.length === 0 ? (
        <p className="font-body text-sm text-ink-soft">No banners yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {banners.map((b) => (
            <div key={b._id} className="flex items-start gap-4 rounded-card border border-line bg-surface p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt="" className="h-16 w-28 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-ink truncate">{b.image}</p>
                <p className="font-body text-xs text-ink-soft">{b.position} · <a href={b.linkUrl} className="hover:underline">{b.linkUrl}</a></p>
                {(b.startDate || b.endDate) && (
                  <p className="font-body text-xs text-ink-soft">
                    {b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN') : '—'} → {b.endDate ? new Date(b.endDate).toLocaleDateString('en-IN') : '—'}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(b._id)}
                  className={`rounded-badge px-3 py-1 font-body text-xs font-medium ${b.isActive ? 'bg-green-50 text-green-700' : 'bg-surface border border-line text-ink-soft'}`}
                >
                  {b.isActive ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleDelete(b._id)} className="font-body text-xs text-ink-soft hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
