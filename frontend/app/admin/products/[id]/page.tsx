'use client';

import { useEffect, useState, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  adminApiGetProduct,
  adminApiCreateProduct,
  adminApiUpdateProduct,
  adminApiListCategories,
  adminApiListStyles,
} from '@/lib/admin-api';

interface Category { _id: string; name: string }
interface Style { _id: string; name: string; family: string }

const OCCASIONS = ['daily', 'party', 'festive', 'bridal', 'anniversary', 'formal', 'gen-z'];
const GENDERS = ['women', 'men', 'kids'];
const IMAGE_TYPES = ['product-shot', 'model-shot'];
const PLATFORMS = ['amazon', 'flipkart'];

const INPUT = 'w-full rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine';
const LABEL = 'font-body text-xs font-medium text-ink-soft';

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [gender, setGender] = useState('women');
  const [channel, setChannel] = useState<'marketplace' | 'website-exclusive'>('marketplace');
  const [stockQty, setStockQty] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; type: string }[]>([{ url: '', type: 'product-shot' }]);
  const [marketplaceLinks, setMarketplaceLinks] = useState<{ platform: string; url: string }[]>([{ platform: 'amazon', url: '' }]);

  useEffect(() => {
    adminApiListCategories().then(setCategories);
    adminApiListStyles().then(setStyles);
    if (!isNew) {
      adminApiGetProduct(id).then((p: any) => {
        if (!p) { router.replace('/admin/products'); return; }
        setName(p.name);
        setSlug(p.slug);
        setCategoryId(p.categoryId?._id ?? p.categoryId ?? '');
        setPrice(String(p.price));
        setGender(p.gender ?? 'women');
        setChannel(p.channel);
        setStockQty(String(p.stockQty ?? ''));
        setDescription(p.description ?? '');
        setIsActive(p.isActive);
        setSelectedStyles((p.styleIds ?? []).map((s: any) => s._id ?? s));
        setSelectedOccasions(p.occasion ?? []);
        setImages(p.images?.length ? p.images : [{ url: '', type: 'product-shot' }]);
        setMarketplaceLinks(p.marketplaceLinks?.length ? p.marketplaceLinks : [{ platform: 'amazon', url: '' }]);
        setLoading(false);
      });
    }
  }, [id]);

  function toggleSet<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      name, slug: slug || slugify(name),
      categoryId: categoryId || undefined,
      price: Number(price),
      gender,
      channel,
      stockQty: channel === 'website-exclusive' ? Number(stockQty) : undefined,
      description,
      isActive,
      styleIds: selectedStyles,
      occasion: selectedOccasions,
      images: images.filter((i) => i.url.trim()),
      marketplaceLinks: channel === 'marketplace' ? marketplaceLinks.filter((l) => l.url.trim()) : [],
    };
    try {
      if (isNew) await adminApiCreateProduct(payload);
      else await adminApiUpdateProduct(id, payload);
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="font-body text-sm text-ink-soft">Loading…</p>;

  const stylesByFamily = styles.reduce<Record<string, Style[]>>((acc, s) => {
    (acc[s.family] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        {isNew ? 'New product' : 'Edit product'}
      </h1>

      {error && (
        <p className="mb-4 rounded-btn bg-rose-bg px-3 py-2 font-body text-sm text-rose-ink">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Name *</label>
            <input
              className={INPUT} required value={name}
              onChange={(e) => { setName(e.target.value); if (!slug || slug === slugify(name)) setSlug(slugify(e.target.value)); }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Slug</label>
            <input className={INPUT} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
          </div>
        </div>

        {/* Category (FR-30: dropdown only) */}
        <div className="flex flex-col gap-1">
          <label className={LABEL}>Category (FR-30: dropdown only)</label>
          <select className={INPUT} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">— select —</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* Price + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Price (₹) *</label>
            <input className={INPUT} type="number" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Gender</label>
            <select className={INPUT} value={gender} onChange={(e) => setGender(e.target.value)}>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Channel */}
        <div className="flex flex-col gap-2">
          <label className={LABEL}>Channel *</label>
          <div className="flex gap-6">
            {(['marketplace', 'website-exclusive'] as const).map((c) => (
              <label key={c} className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink">
                <input type="radio" name="channel" value={c} checked={channel === c} onChange={() => setChannel(c)} />
                {c === 'marketplace' ? 'Marketplace (Amazon/Flipkart)' : 'Website exclusive (own checkout)'}
              </label>
            ))}
          </div>
        </div>

        {/* Stock — only for website-exclusive */}
        {channel === 'website-exclusive' && (
          <div className="flex flex-col gap-1">
            <label className={LABEL}>Stock qty</label>
            <input className={INPUT} type="number" min="0" value={stockQty} onChange={(e) => setStockQty(e.target.value)} />
          </div>
        )}

        {/* Marketplace links — only for marketplace */}
        {channel === 'marketplace' && (
          <div className="flex flex-col gap-2">
            <label className={LABEL}>Marketplace links</label>
            {marketplaceLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <select
                  className="rounded-btn border border-line bg-surface px-2 py-2 font-body text-sm text-ink"
                  value={link.platform}
                  onChange={(e) => setMarketplaceLinks(marketplaceLinks.map((l, j) => j === i ? { ...l, platform: e.target.value } : l))}
                >
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input
                  className={`${INPUT} flex-1`}
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => setMarketplaceLinks(marketplaceLinks.map((l, j) => j === i ? { ...l, url: e.target.value } : l))}
                />
                {marketplaceLinks.length > 1 && (
                  <button type="button" onClick={() => setMarketplaceLinks(marketplaceLinks.filter((_, j) => j !== i))} className="font-body text-sm text-ink-soft hover:text-red-600">✕</button>
                )}
              </div>
            ))}
            {marketplaceLinks.length < 2 && (
              <button type="button" onClick={() => setMarketplaceLinks([...marketplaceLinks, { platform: 'flipkart', url: '' }])} className="self-start font-body text-xs text-wine hover:underline">
                + Add link
              </button>
            )}
          </div>
        )}

        {/* Styles (FR-30: checkboxes, no free-text) */}
        <div className="flex flex-col gap-2">
          <label className={LABEL}>Styles (FR-30: select from list)</label>
          {Object.entries(stylesByFamily).map(([family, fStyles]) => (
            <div key={family} className="mb-1">
              <p className="font-annotation text-xs text-ink-soft capitalize">{family}</p>
              <div className="mt-1 flex flex-wrap gap-3">
                {fStyles.map((s) => (
                  <label key={s._id} className="flex cursor-pointer items-center gap-1.5 font-body text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(s._id)}
                      onChange={() => setSelectedStyles(toggleSet(selectedStyles, s._id))}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Occasion */}
        <div className="flex flex-col gap-2">
          <label className={LABEL}>Occasion</label>
          <div className="flex flex-wrap gap-3">
            {OCCASIONS.map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-1.5 font-body text-sm text-ink capitalize">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(o)}
                  onChange={() => setSelectedOccasions(toggleSet(selectedOccasions, o))}
                />
                {o}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className={LABEL}>Description</label>
          <textarea className={INPUT} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Images */}
        <div className="flex flex-col gap-2">
          <label className={LABEL}>Images (URL + type)</label>
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={`${INPUT} flex-1`}
                placeholder="https://..."
                value={img.url}
                onChange={(e) => setImages(images.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
              />
              <select
                className="rounded-btn border border-line bg-surface px-2 py-2 font-body text-sm text-ink"
                value={img.type}
                onChange={(e) => setImages(images.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}
              >
                {IMAGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {images.length > 1 && (
                <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="font-body text-sm text-ink-soft hover:text-red-600">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setImages([...images, { url: '', type: 'product-shot' }])} className="self-start font-body text-xs text-wine hover:underline">
            + Add image
          </button>
        </div>

        {/* Active */}
        <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active (visible on site)
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="rounded-btn bg-wine px-6 py-2 font-body text-sm font-medium text-surface disabled:opacity-60">
            {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
          </button>
          <button type="button" onClick={() => router.push('/admin/products')} className="rounded-btn border border-line px-4 py-2 font-body text-sm text-ink-soft hover:border-wine hover:text-wine">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
