import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/lib/api';
import StyleMotif from '@/components/StyleMotif';
import MarketplaceButton from '@/components/MarketplaceButton';
import WishlistButton from '@/components/WishlistButton';
import AddToCartButton from '@/components/AddToCartButton';

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
  const mainImage = productShots[0] ?? product.images[0];

  const category =
    typeof product.categoryId === 'object' ? product.categoryId : null;

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-8">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="flex flex-col gap-3">
            {mainImage && (
              <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-surface">
                <Image
                  src={mainImage.url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {product.channel === 'website-exclusive' && (
                  <span className="absolute left-3 top-3 rounded-badge bg-rose-bg px-2 py-0.5 font-annotation text-xs text-rose-ink">
                    Exclusive edit
                  </span>
                )}
              </div>
            )}
            {/* Thumbnail strip for model shots */}
            {modelShots.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {[...productShots.slice(1), ...modelShots].map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-card border border-line bg-surface"
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} — ${img.type}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

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
