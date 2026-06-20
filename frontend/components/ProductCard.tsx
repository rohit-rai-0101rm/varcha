import Link from 'next/link';
import Image from 'next/image';
import type { ApiProduct } from '@/lib/api';
import StyleMotif from './StyleMotif';

interface Props {
  product: ApiProduct;
}

export default function ProductCard({ product }: Props) {
  const cover =
    product.images.find((i) => i.type === 'product-shot')?.url ?? product.images[0]?.url;
  const isExclusive = product.channel === 'website-exclusive';
  const firstStyle = product.styleIds[0];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-bg">
        {cover ? (
          <>
            <Image
              src={cover}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-end justify-center bg-ink/20 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="rounded-btn bg-surface px-5 py-2 font-body text-xs font-semibold uppercase tracking-widest text-ink shadow-sm">
                View Piece
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">No image</div>
        )}
        {isExclusive && (
          <span className="absolute left-3 top-3 rounded-badge bg-rose-bg px-2 py-0.5 font-annotation text-xs text-rose-ink">
            Exclusive edit
          </span>
        )}
      </div>

      {/* Text */}
      <div className="pt-3">
        <h3 className="font-display text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-wine">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="font-body text-sm font-semibold text-wine">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          {firstStyle && (
            <span className="flex shrink-0 items-center gap-1 font-annotation text-xs text-sketch">
              <StyleMotif family={firstStyle.family} />
              {firstStyle.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
