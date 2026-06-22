'use client';

import { useEffect, useState, FormEvent } from 'react';
import {
  adminApiListStyles,
  adminApiCreateStyle,
  adminApiUpdateStyle,
  adminApiDeleteStyle,
} from '@/lib/admin-api';

interface Style {
  _id: string;
  name: string;
  slug: string;
  family: 'indian-craft' | 'global-tradition' | 'aesthetic';
  isActive: boolean;
}

const FAMILIES = ['indian-craft', 'global-tradition', 'aesthetic'] as const;
const INPUT = 'w-full rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine';
const LABEL = 'font-body text-xs font-medium text-ink-soft';

function slugify(t: string) {
  return t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminStylesPage() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Style | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [family, setFamily] = useState<typeof FAMILIES[number]>('indian-craft');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const data = await adminApiListStyles();
    setStyles(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing(null); setName(''); setSlug(''); setFamily('indian-craft'); setIsActive(true); setError('');
  }

  function startEdit(s: Style) {
    setEditing(s); setName(s.name); setSlug(s.slug); setFamily(s.family); setIsActive(s.isActive); setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = { name, slug: slug || slugify(name), family, isActive };
    try {
      if (editing) await adminApiUpdateStyle(editing._id, payload);
      else await adminApiCreateStyle(payload);
      await load();
      startNew();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, styleName: string) {
    if (!confirm(`Delete "${styleName}"?`)) return;
    try {
      await adminApiDeleteStyle(id);
      setStyles((s) => s.filter((x) => x._id !== id));
    } catch (e: unknown) { alert((e as Error).message); }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Styles</h1>

      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <h2 className="mb-4 font-body text-sm font-medium text-ink">
          {editing ? `Edit: ${editing.name}` : 'New style'}
        </h2>
        {error && <p className="mb-3 font-body text-xs text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Name *</label>
            <input
              className={INPUT} required value={name}
              onChange={(e) => { setName(e.target.value); if (!slug || slug === slugify(name)) setSlug(slugify(e.target.value)); }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Slug</label>
            <input className={INPUT} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto" />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Family *</label>
            <select className={INPUT} value={family} onChange={(e) => setFamily(e.target.value as typeof FAMILIES[number])}>
              {FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
            </label>
          </div>
          <div className="col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="rounded-btn bg-wine px-5 py-2 font-body text-sm text-surface disabled:opacity-60">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
            </button>
            {editing && (
              <button type="button" onClick={startNew} className="rounded-btn border border-line px-4 py-2 font-body text-sm text-ink-soft">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full font-body text-sm">
            <thead className="bg-surface text-left">
              <tr>
                {['Name', 'Slug', 'Family', 'Active', ''].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {styles.map((s) => (
                <tr key={s._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                  <td className="px-4 py-3 font-annotation text-xs text-ink-soft">{s.slug}</td>
                  <td className="px-4 py-3 text-ink-soft capitalize">{s.family}</td>
                  <td className="px-4 py-3">
                    <span className={s.isActive ? 'text-green-600' : 'text-ink-soft'}>{s.isActive ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(s)} className="text-wine hover:underline">Edit</button>
                      <button onClick={() => handleDelete(s._id, s.name)} className="text-ink-soft hover:text-red-600">Delete</button>
                    </div>
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
