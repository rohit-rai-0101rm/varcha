import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/lib/api';
import StyleMotif from '@/components/StyleMotif';
import MarketplaceButton from '@/components/MarketplaceButton';
import WishlistButton from '@/components/WishlistButton';
import AddToCartButton from '@/components/AddToCartButton';
import ProductImageGallery from '@/components/ProductImageGallery';
import PageTracker from '@/components/PageTracker';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: 'Product not found — Varcha' };
  return {
    title: `${product.name} — Varcha`,
    description: product.description ?? `Shop ${product.name} on Varcha.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) notFound();

  const productShots = product.images.filter((i) => i.type === 'product-shot');
  const modelShots = product.images.filter((i) => i.type === 'model-shot');
  const allImages = [...productShots, ...modelShots];
  const mainImage = productShots[0] ?? product.images[0];

  const category =
    typeof product.categoryId === 'object' ? product.categoryId : null;

  return (
    <div className="min-h-screen bg-bg">
      <PageTracker productId={product._id} />
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-body text-xs text-ink-soft">
          <Link href="/" className="hover:text-wine">
            Home
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="hover:text-wine">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <ProductImageGallery
            images={allImages}
            productName={product.name}
            isExclusive={product.channel === 'website-exclusive'}
          />

          {/* Details */}
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-2xl font-semibold text-ink">{product.name}</h1>
            <p className="font-body text-2xl font-medium text-wine">
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            {/* Style tags */}
            {product.styleIds.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {product.styleIds.map((style) => (
                  <span
                    key={style._id}
                    className="flex items-center gap-1.5 font-annotation text-sm"
                    style={{ color: 'var(--sketch)' }}
                  >
                    <StyleMotif family={style.family} />
                    {style.name}
                  </span>
                ))}
              </div>
            )}

            {/* Occasion tags */}
            {product.occasion.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.occasion.map((occ) => (
                  <span
                    key={occ}
                    className="rounded-badge border border-line px-2 py-0.5 font-body text-xs capitalize text-ink-soft"
                  >
                    {occ}
                  </span>
                ))}
              </div>
            )}

            {product.description && (
              <p className="font-body text-sm leading-relaxed text-ink-soft">
                {product.description}
              </p>
            )}

            {/* CTA */}
            <div className="mt-2 flex flex-col gap-2">
              {product.channel === 'website-exclusive' ? (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <AddToCartButton
                      productId={product._id}
                      name={product.name}
                      price={product.price}
                      image={mainImage?.url ?? ''}
                      slug={product.slug}
                      stockQty={product.stockQty ?? 0}
                    />
                  </div>
                  <WishlistButton productId={product._id} />
                </div>
              ) : (
                <>
                  {product.marketplaceLinks?.map((link) => (
                    <MarketplaceButton
                      key={link.platform}
                      platform={link.platform}
                      url={link.url}
                      productId={product._id}
                    />
                  ))}
                  <WishlistButton productId={product._id} />
                </>
              )}
            </div>

            {product.channel === 'website-exclusive' && product.stockQty !== undefined && (
              <p className="font-body text-xs text-ink-soft">
                {product.stockQty > 0
                  ? `${product.stockQty} in stock`
                  : 'Out of stock'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
