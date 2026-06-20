import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;

  const products = q ? await fetchProducts({ search: q }) : [];

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-4 font-display text-2xl font-semibold text-wine">Search</h1>
        <div className="mb-6">
          <SearchBar />
        </div>

        {q && (
          <p className="mb-4 font-body text-sm text-ink-soft">
            {products.length === 0
              ? `No results for "${q}"`
              : `${products.length} result${products.length === 1 ? '' : 's'} for "${q}"`}
          </p>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {!q && (
          <p className="font-body text-sm text-ink-soft">
            Enter a search term above to find pieces.
          </p>
        )}
      </div>
    </div>
  );
}
