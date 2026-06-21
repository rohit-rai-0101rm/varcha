'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiListProducts, adminApiDeleteProduct } from '@/lib/admin-api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  channel: string;
  stockQty?: number;
  isActive: boolean;
  categoryId?: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await adminApiListProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminApiDeleteProduct(id);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-btn bg-wine px-4 py-2 font-body text-sm text-surface"
        >
          + New product
        </Link>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading…</p>
      ) : products.length === 0 ? (
        <p className="font-body text-sm text-ink-soft">No products yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full font-body text-sm">
            <thead className="bg-surface text-left">
              <tr>
                {['Name', 'Category', 'Price', 'Channel', 'Stock', 'Active', ''].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.categoryId?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-badge px-2 py-0.5 text-xs ${
                        p.channel === 'website-exclusive'
                          ? 'bg-rose-bg text-rose-ink'
                          : 'border border-line text-ink-soft'
                      }`}
                    >
                      {p.channel === 'website-exclusive' ? 'Exclusive' : 'Marketplace'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {p.channel === 'website-exclusive' ? (p.stockQty ?? 0) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${p.isActive ? 'text-green-600' : 'text-ink-soft'}`}>
                      {p.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${p._id}`} className="text-wine hover:underline">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="text-ink-soft hover:text-red-600"
                      >
                        Delete
                      </button>
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
