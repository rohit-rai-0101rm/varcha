'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ApiProduct, ApiCategory, ApiBanner } from '@/lib/api';

interface Slide {
  id: string;
  image: string;
  linkUrl: string;
}

interface Props {
  banners: ApiBanner[];
  fallbackSlides: ApiProduct[];
  firstCategory?: ApiCategory;
}

function buildSlides(banners: ApiBanner[], fallback: ApiProduct[]): Slide[] {
  if (banners.length > 0) {
    return banners.map((b) => ({ id: b._id, image: b.image, linkUrl: b.linkUrl }));
  }
  return fallback
    .map((p) => {
      const img =
        p.images.find((im) => im.type === 'model-shot')?.url ??
        p.images.find((im) => im.type === 'product-shot')?.url ?? '';
      return { id: p._id, image: img, linkUrl: `/product/${p.slug}` };
    })
    .filter((s) => s.image);
}

export default function HeroCarousel({ banners, fallbackSlides, firstCategory }: Props) {
  const slides = buildSlides(banners, fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5200);
    return () => clearInterval(id);
  }, [slides.length, resetKey]);

  function goTo(i: number) {
    setCurrent(i);
    setResetKey((k) => k + 1);
  }

  if (slides.length === 0) return null;

  const browseHref = firstCategory ? `/category/${firstCategory.slug}` : '/search';

  return (
    <section className="relative h-[calc(100svh-4rem)] min-h-[600px] w-full overflow-hidden bg-ink">

      {/* ── Images ────────────────────────────────── */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: i === current ? 1 : 0 }}
        >
          {slide.image && (
            <Image
              src={slide.image}
              alt="Varcha editorial"
              fill
              priority={i === 0}
              sizes="100vw"
              quality={92}
              className="object-cover object-center"
            />
          )}
        </div>
      ))}

      {/* ── Gradient overlay ──────────────────────── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(26,18,14,0.92) 0%, rgba(26,18,14,0.55) 38%, rgba(26,18,14,0.10) 65%, transparent 100%)',
        }}
      />

      {/* ── Text + CTAs ───────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-12 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
        <div className="mx-auto max-w-7xl">

          {/* annotation */}
          <span className="font-annotation text-[9px] tracking-[0.42em] text-white/55 uppercase">
            Varcha · Exclusive Edit
          </span>

          {/* headline */}
          <h1 className="mt-3 font-display font-bold leading-[1.05] tracking-tight text-white
            text-[2.6rem] sm:text-[3.4rem] lg:text-[4.2rem] xl:text-[5rem]">
            Jewellery with a<br className="hidden sm:block" /> story worth wearing.
          </h1>

          {/* body copy */}
          <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/65 sm:text-base">
            Handcrafted pieces rooted in Indian craft traditions and the world's finest heritage.
          </p>

          {/* CTAs + dots */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/search"
              className="rounded-btn bg-surface px-7 py-3.5 font-body text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              Explore the Edit
            </Link>
            <Link
              href={browseHref}
              className="rounded-btn border border-white/45 px-7 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View All Pieces
            </Link>

            {/* dot nav pushed to the right */}
            {slides.length > 1 && (
              <div className="ml-auto flex items-center gap-2.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
                    }`}
                  />
                ))}
                <span className="ml-2 font-display text-[11px] tabular-nums text-white/40">
                  {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
