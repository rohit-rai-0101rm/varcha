import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchCategoryBySlug, fetchProducts, fetchStyles } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';
import SearchBar from '@/components/SearchBar';
import PageTracker from '@/components/PageTracker';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: 'Category — Varcha' };
  return {
    title: `${category.name} — Varcha`,
    description: `Shop ${category.name} — handcrafted artificial jewellery from Varcha. Browse our curated collection.`,
  };
}

function sp(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;

  const [category, styles, products] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchStyles(),
    fetchProducts({
      category: slug,
      style: sp(filters.style),
      minPrice: sp(filters.minPrice),
      maxPrice: sp(filters.maxPrice),
      occasion: sp(filters.occasion),
      gender: sp(filters.gender),
    }),
  ]);

  if (!category) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <PageTracker categoryId={category._id} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-wine">{category.name}</h1>
          <p className="mt-1 font-body text-sm text-ink-soft">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>

        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter sidebar */}
          <div className="w-full lg:w-56 lg:shrink-0">
            <FilterPanel
              styles={styles}
              initialStyle={sp(filters.style)}
              initialOccasion={sp(filters.occasion)}
              initialGender={sp(filters.gender)}
              initialMinPrice={sp(filters.minPrice)}
              initialMaxPrice={sp(filters.maxPrice)}
            />
          </div>

          {/* Product grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="rounded-card border border-line bg-surface px-6 py-12 text-center">
                <p className="font-body text-ink-soft">No pieces match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
