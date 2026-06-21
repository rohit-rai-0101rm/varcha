'use client';

import { useEffect, useState, FormEvent } from 'react';
import {
  adminApiListCategories,
  adminApiCreateCategory,
  adminApiUpdateCategory,
  adminApiDeleteCategory,
} from '@/lib/admin-api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  parentCategory?: { name: string } | null;
}

const INPUT = 'w-full rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine';
const LABEL = 'font-body text-xs font-medium text-ink-soft';

function slugify(t: string) {
  return t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const data = await adminApiListCategories();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing(null);
    setName(''); setSlug(''); setParentId(''); setIsActive(true); setError('');
  }

  function startEdit(c: Category) {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setParentId((c.parentCategory as any)?._id ?? '');
    setIsActive(c.isActive);
    setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = { name, slug: slug || slugify(name), parentCategory: parentId || null, isActive };
    try {
      if (editing) await adminApiUpdateCategory(editing._id, payload);
      else await adminApiCreateCategory(payload);
      await load();
      startNew();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, catName: string) {
    if (!confirm(`Delete "${catName}"?`)) return;
    try {
      await adminApiDeleteCategory(id);
      setCategories((c) => c.filter((x) => x._id !== id));
    } catch (e: any) { alert(e.message); }
  }

  const topLevel = categories.filter((c) => !c.parentCategory);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Categories</h1>

      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <h2 className="mb-4 font-body text-sm font-medium text-ink">
          {editing ? `Edit: ${editing.name}` : 'New category'}
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
            <label className={LABEL}>Parent category</label>
            <select className={INPUT} value={parentId} onChange={(e) => setParentId(e.target.value)}>
              <option value="">— none (top level) —</option>
              {topLevel.filter((c) => c._id !== editing?._id).map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
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
                {['Name', 'Slug', 'Parent', 'Active', ''].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 font-annotation text-xs text-ink-soft">{c.slug}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.parentCategory?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={c.isActive ? 'text-green-600' : 'text-ink-soft'}>{c.isActive ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(c)} className="text-wine hover:underline">Edit</button>
                      <button onClick={() => handleDelete(c._id, c.name)} className="text-ink-soft hover:text-red-600">Delete</button>
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
