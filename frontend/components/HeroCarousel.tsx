'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ApiProduct, ApiCategory } from '@/lib/api';

interface Props {
  slides: ApiProduct[];
  firstCategory?: ApiCategory;
}

export default function HeroCarousel({ slides, firstCategory }: Props) {
  const [current, setCurrent] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4800);
    return () => clearInterval(id);
  }, [slides.length, resetKey]);

  function goTo(i: number) {
    setCurrent(i);
    setResetKey((k) => k + 1);
  }

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[88vh] min-h-[520px] w-full overflow-hidden bg-ink">
      {slides.map((product, i) => {
        const img =
          product.images.find((im) => im.type === 'model-shot')?.url ??
          product.images.find((im) => im.type === 'product-shot')?.url;

        return (
          <div
            key={product._id}
            style={{ zIndex: i === current ? 2 : 1 }}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {img && (
              <Image
                src={img}
                alt={product.name}
                fill
                priority={i === 0}
                sizes="100vw"
                quality={90}
                className="object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 px-8 pb-14 sm:px-12 sm:pb-16 lg:px-16 lg:pb-20 xl:px-20">
              <div className="max-w-2xl">
                <span className="font-annotation text-[10px] tracking-[0.35em] text-white/60 uppercase">
                  {product.styleIds[0]?.name ?? 'Handcrafted'}&nbsp;·&nbsp;Exclusive Edit
                </span>
                <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {product.name}
                </h1>
                <p className="mt-4 max-w-md font-body text-base leading-relaxed text-white/72 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/product/${product.slug}`}
                    className="rounded-btn bg-surface px-7 py-3.5 font-body text-sm font-semibold text-ink transition-opacity hover:opacity-90"
                  >
                    View Piece
                  </Link>
                  <Link
                    href={firstCategory ? `/category/${firstCategory.slug}` : '/search'}
                    className="rounded-btn border border-white/50 px-7 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    All Pieces
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide counter — desktop right edge */}
      {slides.length > 1 && (
        <div className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
          <span className="font-display text-sm font-semibold tabular-nums text-white">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="h-14 w-px bg-white/25" />
          <span className="font-display text-sm tabular-nums text-white/35">
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Dot nav */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-8 z-20 flex items-center gap-2 sm:bottom-8 sm:left-12 lg:left-16 xl:left-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/65'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
